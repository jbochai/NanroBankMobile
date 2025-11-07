import React from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { Colors } from '../../styles/colors';
import { Fonts } from '../../styles/fonts';
import { Spacing, BorderRadius, Shadows } from '../../styles/spacing';
import Button from './Button';

const Alert = ({
  visible = false,
  type = 'info', // success, error, warning, info
  title,
  message,
  onClose,
  onConfirm,
  confirmText = 'OK',
  cancelText = 'Cancel',
  showCancel = false,
}) => {
  const getIcon = () => {
    switch (type) {
      case 'success':
        return { name: 'check-circle', color: Colors.success };
      case 'error':
        return { name: 'error', color: Colors.error };
      case 'warning':
        return { name: 'warning', color: Colors.warning };
      default:
        return { name: 'info', color: Colors.info };
    }
  };

  const icon = getIcon();

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.alertBox}>
          <View style={styles.iconContainer}>
            <Icon name={icon.name} size={48} color={icon.color} />
          </View>

          {title && <Text style={styles.title}>{title}</Text>}
          {message && <Text style={styles.message}>{message}</Text>}

          <View style={styles.buttonContainer}>
            {showCancel && (
              <Button
                title={cancelText}
                variant="outline"
                onPress={onClose}
                style={styles.button}
              />
            )}
            <Button
              title={confirmText}
              onPress={onConfirm || onClose}
              style={[styles.button, !showCancel && styles.fullButton]}
            />
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.lg,
  },
  alertBox: {
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.lg,
    padding: Spacing.xl,
    width: '100%',
    maxWidth: 400,
    ...Shadows.lg,
  },
  iconContainer: {
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  title: {
    fontSize: 20,
    fontFamily: Fonts.semiBold,
    color: Colors.text,
    textAlign: 'center',
    marginBottom: Spacing.sm,
  },
  message: {
    fontSize: 16,
    fontFamily: Fonts.regular,
    color: Colors.textLight,
    textAlign: 'center',
    marginBottom: Spacing.lg,
    lineHeight: 22,
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: Spacing.md,
  },
  button: {
    flex: 1,
  },
  fullButton: {
    flex: 1,
  },
});

export default Alert;