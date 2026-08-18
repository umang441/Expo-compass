import React from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity } from 'react-native';

interface CalibrationModalProps {
  visible: boolean;
  onClose: () => void;
}

export const CalibrationModal: React.FC<CalibrationModalProps> = ({ visible, onClose }) => {
  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.card}>
          <Text style={styles.title}>Calibrate Sensor</Text>
          <Text style={styles.description}>
            To improve compass accuracy and remove magnetic interference:
          </Text>

          <View style={styles.figure8Box}>
            <Text style={styles.figure8Icon}>♾️</Text>
            <Text style={styles.figure8Text}>
              Wave your device in a figure-8 pattern 3 to 4 times in the air.
            </Text>
          </View>

          <TouchableOpacity style={styles.closeBtn} onPress={onClose} activeOpacity={0.8}>
            <Text style={styles.closeBtnText}>Got It</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(2, 6, 23, 0.85)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  card: {
    backgroundColor: '#0F172A',
    borderRadius: 24,
    padding: 24,
    width: '100%',
    maxWidth: 340,
    borderWidth: 1,
    borderColor: '#334155',
    alignItems: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: '#F8FAFC',
    marginBottom: 8,
  },
  description: {
    fontSize: 14,
    color: '#94A3B8',
    textAlign: 'center',
    marginBottom: 16,
    lineHeight: 20,
  },
  figure8Box: {
    backgroundColor: '#1E293B',
    padding: 16,
    borderRadius: 16,
    alignItems: 'center',
    marginBottom: 20,
    width: '100%',
  },
  figure8Icon: {
    fontSize: 40,
    marginBottom: 8,
  },
  figure8Text: {
    color: '#38BDF8',
    fontSize: 13,
    textAlign: 'center',
    fontWeight: '500',
  },
  closeBtn: {
    backgroundColor: '#38BDF8',
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 20,
    width: '100%',
    alignItems: 'center',
  },
  closeBtnText: {
    color: '#0F172A',
    fontWeight: '700',
    fontSize: 15,
  },
});
