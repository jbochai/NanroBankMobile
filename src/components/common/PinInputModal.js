import React, { useState } from 'react';
import {
  Modal,
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Colors } from '../../styles/colors';
import { Fonts } from '../../styles/fonts';
import { Spacing } from '../../styles/spacing';
import Button from './Button';

const PinInputModal = ({ visible, onClose, onSubmit, title, message }) => {
  const [pin, setPin] = useState('');

  const handleSubmit = () => {
    if (pin.length === 4) {
      onSubmit(pin);
      setPin('');
    }
  };

  const handleClose = () => {
    setPin('');
    onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={handleClose}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.overlay}>
        <View style={styles.container}>
          <View style={styles.modal}>
            <Text style={styles.title}>{title}</Text>
            <Text style={styles.message}>{message}</Text>

            <TextInput
              style={styles.input}
              value={pin}
              onChangeText={(text) => setPin(text.replace(/[^0-9]/g, '').slice(0, 4))}
              placeholder="Enter 4-digit PIN"
              keyboardType="number-pad"
              secureTextEntry
              maxLength={4}
              autoFocus
            />

            <View style={styles.buttonRow}>
              <Button
                title="Cancel"
                onPress={handleClose}
                variant="outline"
                style={styles.button}
                fullWidth={false}
              />
              <Button
                title="Submit"
                onPress={handleSubmit}
                disabled={pin.length !== 4}
                style={styles.button}
                fullWidth={false}
              />
            </View>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    width: '100%',
    paddingHorizontal: Spacing.lg,
  },
  modal: {
    backgroundColor: Colors.white,
    borderRadius: 12,
    padding: Spacing.xl,
    width: '100%',
  },
  title: {
    fontSize: 20,
    fontFamily: Fonts.semiBold,
    color: Colors.text,
    marginBottom: Spacing.sm,
    textAlign: 'center',
  },
  message: {
    fontSize: 14,
    fontFamily: Fonts.regular,
    color: Colors.textLight,
    marginBottom: Spacing.lg,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 8,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.md,
    fontSize: 24,
    fontFamily: Fonts.semiBold,
    textAlign: 'center',
    letterSpacing: 8,
    marginBottom: Spacing.lg,
  },
  buttonRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  button: {
    flex: 1,
  },
});

export default PinInputModal;