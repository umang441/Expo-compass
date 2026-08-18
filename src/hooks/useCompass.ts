import { useEffect, useState, useRef } from 'react';
import { Magnetometer } from 'expo-sensors';
import * as Location from 'expo-location';

export interface CompassData {
  heading: number; // Smoothed continuous angle in degrees
  displayHeading: number; // Normalized (0..359) integer for UI
  cardinal: string;
  accuracy: number; // 0: Unknown, 1: Low, 2: Medium, 3: High
  hasPermission: boolean;
  errorMsg: string | null;
  latitude: number | null;
  longitude: number | null;
  altitude: number | null;
  isTrueNorth: boolean;
  toggleNorthMode: () => void;
}

// Low pass filter alpha parameter (0 < ALPHA <= 1). Lower value = smoother / less jitter
const ALPHA = 0.15;

/**
 * Returns cardinal direction string based on normalized heading (0 - 360).
 */
export function getCardinalDirection(heading: number): string {
  const normalized = ((heading % 360) + 360) % 360;
  const directions = [
    'N', 'NNE', 'NE', 'ENE',
    'E', 'ESE', 'SE', 'SSE',
    'S', 'SSW', 'SW', 'WSW',
    'W', 'WNW', 'NW', 'NNW'
  ];
  const index = Math.round(normalized / 22.5) % 16;
  return directions[index];
}

/**
 * Calculates raw magnetic heading from Magnetometer x, y reading (in microteslas).
 */
function calculateRawHeading(x: number, y: number): number {
  let angle = Math.atan2(y, x) * (180 / Math.PI);
  // Convert atan2 (-180..180) to standard compass bearing (0..360) where North = 0/360, East = 90
  angle = 90 - angle;
  if (angle < 0) {
    angle += 360;
  }
  return angle;
}

export function useCompass(): CompassData {
  const [heading, setHeading] = useState<number>(0);
  const [accuracy, setAccuracy] = useState<number>(3);
  const [hasPermission, setHasPermission] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [location, setLocation] = useState<{ lat: number | null; lon: number | null; alt: number | null }>({
    lat: null,
    lon: null,
    alt: null,
  });
  const [isTrueNorth, setIsTrueNorth] = useState<boolean>(true);

  // Refs for tracking unwrapped continuous angle and low-pass filter state
  const prevContinuousAngleRef = useRef<number>(0);
  const subscriptionRef = useRef<any>(null);
  const locationSubRef = useRef<any>(null);

  const toggleNorthMode = () => setIsTrueNorth(prev => !prev);

  useEffect(() => {
    let isMounted = true;

    async function setupCompass() {
      try {
        // Request Location permission for heading subscription / location metrics
        const { status: locStatus } = await Location.requestForegroundPermissionsAsync();
        const locGranted = locStatus === 'granted';
        setHasPermission(locGranted);

        if (locGranted) {
          // Get current coordinates for metadata display
          Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced })
            .then(loc => {
              if (isMounted && loc) {
                setLocation({
                  lat: loc.coords.latitude,
                  lon: loc.coords.longitude,
                  alt: loc.coords.altitude,
                });
              }
            })
            .catch(() => {});

          // Try native location heading subscription first (provides True North & True Heading when supported)
          try {
            const headingSub = await Location.watchHeadingAsync(newHeading => {
              if (!isMounted) return;
              
              const rawTarget = isTrueNorth && newHeading.trueHeading >= 0 
                ? newHeading.trueHeading 
                : newHeading.magHeading;
              
              if (newHeading.accuracy !== undefined) {
                setAccuracy(newHeading.accuracy);
              }

              processHeadingUpdate(rawTarget);
            });
            locationSubRef.current = headingSub;
            return;
          } catch (e) {
            // Location heading watch failed or unsupported on current device/emulator, fallback to Magnetometer
          }
        }

        // Magnetometer fallback
        const isAvailable = await Magnetometer.isAvailableAsync();
        if (!isAvailable) {
          if (isMounted) setErrorMsg('Magnetometer sensor is not available on this device');
          return;
        }

        Magnetometer.setUpdateInterval(50); // 20 FPS updates
        const magSub = Magnetometer.addListener(data => {
          if (!isMounted) return;
          const rawAngle = calculateRawHeading(data.x, data.y);
          processHeadingUpdate(rawAngle);
        });
        subscriptionRef.current = magSub;

      } catch (err: any) {
        if (isMounted) setErrorMsg(err?.message || 'Failed to initialize compass sensors');
      }
    }

    // Anti-jitter low pass filter with continuous angle unwrapping
    function processHeadingUpdate(rawTarget: number) {
      let prevContinuous = prevContinuousAngleRef.current;
      
      // Calculate shortest angular distance delta (-180 .. +180)
      let delta = (rawTarget - (prevContinuous % 360));
      if (delta > 180) {
        delta -= 360;
      } else if (delta < -180) {
        delta += 360;
      }

      // Target continuous angle without sudden 360 degree wrap jumps
      const targetContinuous = prevContinuous + delta;

      // Low pass filter formula: S_t = S_{t-1} + ALPHA * (X_t - S_{t-1})
      const smoothedContinuous = prevContinuous + ALPHA * (targetContinuous - prevContinuous);

      prevContinuousAngleRef.current = smoothedContinuous;
      setHeading(smoothedContinuous);
    }

    setupCompass();

    return () => {
      isMounted = false;
      if (subscriptionRef.current) subscriptionRef.current.remove();
      if (locationSubRef.current) locationSubRef.current.remove();
    };
  }, [isTrueNorth]);

  const displayHeading = Math.round(((heading % 360) + 360) % 360);
  const cardinal = getCardinalDirection(displayHeading);

  return {
    heading,
    displayHeading,
    cardinal,
    accuracy,
    hasPermission,
    errorMsg,
    latitude: location.lat,
    longitude: location.lon,
    altitude: location.alt,
    isTrueNorth,
    toggleNorthMode,
  };
}
