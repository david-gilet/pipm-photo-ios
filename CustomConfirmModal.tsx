import React from 'react';
import { Modal, View, Text, TouchableOpacity, StyleSheet } from 'react-native';

export default function CustomConfirmModal({ visible, onConfirm, onCancel, message }: {
  visible: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  message: string;
}) {
  return (
    <Modal transparent visible={visible} animationType="fade">
      <View style={styles.modalBackdrop}>
        <View style={styles.modalContent}>
          <Text style={styles.modalMessage}>{message}</Text>
          <View style={styles.modalButtons}>
            <TouchableOpacity onPress={onCancel} style={styles.buttonCancel}>
              <Text style={styles.textCancel}>Annuler</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={onConfirm} style={styles.buttonConfirm}>
              <Text style={styles.textConfirm}>Oui</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 25,
    borderRadius: 10,
    width: '80%',
    alignItems: 'center',
  },
  modalMessage: {
    fontSize: 18,
    marginBottom: 25,
    textAlign: 'center',
    color: '#333',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  buttonCancel: {
    backgroundColor: '#ccc',
    paddingVertical: 12,
    borderRadius: 6,
    flex: 1,
    marginRight: 10,
    alignItems: 'center',
  },
  buttonConfirm: {
    backgroundColor: '#00aaff',
    paddingVertical: 12,
    borderRadius: 6,
    flex: 1,
    alignItems: 'center',
  },
  textCancel: {
    color: '#333',
    fontWeight: 'bold',
  },
  textConfirm: {
    color: 'white',
    fontWeight: 'bold',
  },
});
