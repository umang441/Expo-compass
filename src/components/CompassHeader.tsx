import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

interface CompassHeaderProps {
  displayHeading: number;
  cardinal: string;
  isTrueNorth: boolean;
  onToggleNorth: () => void;
  accuracy: number;
  latitude: number | null;
  longitude: number | null;
  altitude: number | null;
}

export const CompassHeader: React.FC<CompassHeaderProps> = ({
  displayHeading,
  cardinal,
  isTrueNorth,
  onToggleNorth,
  accuracy,
  latitude,
  longitude,
  altitude,
}) => {
  const getAccuracyBadge = () => {
    switch (accuracy) {
      case 3:
        return { label: 'High Accuracy', color: '#10B981' };
      case 2:
        return { label: 'Medium Accuracy', color: '#F59E0B' };
      case 1:
        return { label: 'Low Accuracy', color: '#EF4444' };
      default:
        return { label: 'Calibrating...', color: '#6B7280' };
    }
  };

  const badge = getAccuracyBadge();

  return (
    <View style={styles.container}>
      {/* North Mode Switch Pill */}
      <View style={styles.topRow}>
        <TouchableOpacity style={styles.toggleButton} onPress={onToggleNorth} activeOpacity={0.8}>
          <Text style={styles.toggleText}>
            {isTrueNorth ? 'TRUE NORTH' : 'MAGNETIC NORTH'}
          </Text>
        </TouchableOpacity>

        <View style={[styles.badge, { borderColor: badge.color }]}>
          <View style={[styles.badgeDot, { backgroundColor: badge.color }]} />
          <Text style={[styles.badgeText, { color: badge.color }]}>{badge.label}</Text>
        </View>
      </View>

      {/* Main Big Heading Number */}
      <View style={styles.headingRow}>
        <Text style={styles.headingDegree}>{displayHeading}°</Text>
        <Text style={styles.headingCardinal}>{cardinal}</Text>
      </View>

      {/* Location / Lat Long details */}
      {latitude !== null && longitude !== null ? (
        <View style={styles.locationContainer}>
          <Text style={styles.locationText}>
            {Math.abs(latitude).toFixed(4)}° {latitude >= 0 ? 'N' : 'S'}  •  
            {Math.abs(longitude).toFixed(4)}° {longitude >= 0 ? 'E' : 'W'}
          </Text>
          {altitude !== null && (
            <Text style={styles.altitudeText}>Elevation: {Math.round(altitude)}m</Text>
          )}
        </View>
      ) : (
        <Text style={styles.locationText}>Acquiring GPS coordinates...</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 20,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 16,
  },
  toggleButton: {
    backgroundColor: '#1E293B',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#334155',
  },
  toggleText: {
    color: '#38BDF8',
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 1,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
    backgroundColor: '#0F172A',
  },
  badgeDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: 6,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '600',
  },
  headingRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginVertical: 4,
  },
  headingDegree: {
    fontSize: 64,
    fontWeight: '800',
    color: '#F8FAFC',
    letterSpacing: -1,
  },
  headingCardinal: {
    fontSize: 32,
    fontWeight: '700',
    color: '#38BDF8',
    marginLeft: 12,
  },
  locationContainer: {
    alignItems: 'center',
    marginTop: 6,
  },
  locationText: {
    color: '#94A3B8',
    fontSize: 14,
    fontWeight: '500',
    letterSpacing: 0.5,
  },
  altitudeText: {
    color: '#64748B',
    fontSize: 12,
    marginTop: 2,
  },
});
