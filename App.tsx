import React, { useState } from 'react';
import { StyleSheet, View, Text, SafeAreaView, TouchableOpacity, StatusBar } from 'react-native';
import { useCompass } from './src/hooks/useCompass';
import { CompassDial } from './src/components/CompassDial';
import { CompassHeader } from './src/components/CompassHeader';
import { CalibrationModal } from './src/components/CalibrationModal';

export default function App() {
  const {
    heading,
    displayHeading,
    cardinal,
    accuracy,
    hasPermission,
    errorMsg,
    latitude,
    longitude,
    altitude,
    isTrueNorth,
    toggleNorthMode,
  } = useCompass();

  const [showCalibration, setShowCalibration] = useState(false);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#020617" />

      {/* Header Info */}
      <CompassHeader
        displayHeading={displayHeading}
        cardinal={cardinal}
        isTrueNorth={isTrueNorth}
        onToggleNorth={toggleNorthMode}
        accuracy={accuracy}
        latitude={latitude}
        longitude={longitude}
        altitude={altitude}
      />

      {/* Error / Sensor Warning Banner */}
      {errorMsg ? (
        <View style={styles.errorBox}>
          <Text style={styles.errorText}>{errorMsg}</Text>
        </View>
      ) : null}

      {/* Compass Dial Center */}
      <View style={styles.dialWrapper}>
        <CompassDial heading={heading} />
      </View>

      {/* Footer Controls */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.calibrateButton}
          onPress={() => setShowCalibration(true)}
          activeOpacity={0.8}
        >
          <Text style={styles.calibrateText}>Calibrate Compass ♾️</Text>
        </TouchableOpacity>
      </View>

      {/* Calibration Guidance Modal */}
      <CalibrationModal
        visible={showCalibration}
        onClose={() => setShowCalibration(false)}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#020617',
    justifyContent: 'space-between',
    paddingVertical: 10,
  },
  dialWrapper: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 20,
  },
  errorBox: {
    backgroundColor: '#450A0A',
    borderColor: '#991B1B',
    borderWidth: 1,
    padding: 12,
    marginHorizontal: 20,
    borderRadius: 12,
    alignItems: 'center',
  },
  errorText: {
    color: '#FCA5A5',
    fontSize: 13,
    textAlign: 'center',
  },
  footer: {
    alignItems: 'center',
    paddingBottom: 20,
  },
  calibrateButton: {
    backgroundColor: '#0F172A',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: '#334155',
  },
  calibrateText: {
    color: '#94A3B8',
    fontSize: 13,
    fontWeight: '600',
  },
});
