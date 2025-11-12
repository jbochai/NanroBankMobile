import React from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Button from './Button';
import { Colors } from '../../styles/colors';
import { Fonts } from '../../styles/fonts';
import { Spacing, BorderRadius } from '../../styles/spacing';

const Alert = ({
  visible,
  type = 'info', // success, error, warning, info
  title,
  message,
  confirmText = 'OK',
  cancelText = 'Cancel',
  showCancel = false,
  onConfirm,
  onCancel,
  onClose,
}) => {
  const getIconName = () => {
    switch (type) {
      case 'success':
        return 'check-circle';
      case 'error':
        return 'error';
      case 'warning':
        return 'warning';
      default:
        return 'info';
    }
  };

  const getIconColor = () => {
    switch (type) {
      case 'success':
        return Colors.success;
      case 'error':
        return Colors.error;
      case 'warning':
        return Colors.warning;
      default:
        return Colors.info;
    }
  };

  const handleConfirm = () => {
    if (onConfirm) {
      onConfirm();
    }
    if (onClose) {
      onClose();
    }
  };

  const handleCancel = () => {
    if (onCancel) {
      onCancel();
    }
    if (onClose) {
      onClose();
    }
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.container}>
          <View style={styles.alertBox}>
            {/* Icon */}
            <View style={[styles.iconContainer, { backgroundColor: `${getIconColor()}20` }]}>
              <Icon name={getIconName()} size={48} color={getIconColor()} />
            </View>

            {/* Title */}
            {title && <Text style={styles.title}>{title}</Text>}

            {/* Message */}
            {message && <Text style={styles.message}>{message}</Text>}

            {/* Buttons */}
            <View style={styles.buttonContainer}>
              {showCancel && (
                <Button
                  title={cancelText}
                  onPress={handleCancel}
                  variant="outline"
                  style={styles.button}
                  fullWidth={false}
                />
              )}
              <Button
                title={confirmText}
                onPress={handleConfirm}
                style={styles.button}
                fullWidth={false}
              />
            </View>
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
  },
  container: {
    width: '85%',
    maxWidth: 400,
  },
  alertBox: {
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.lg,
    padding: Spacing.xl,
    alignItems: 'center',
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.lg,
  },
  title: {
    fontSize: 20,
    fontFamily: Fonts.semiBold,
    color: Colors.text,
    textAlign: 'center',
    marginBottom: Spacing.sm,
  },
  message: {
    fontSize: 14,
    fontFamily: Fonts.regular,
    color: Colors.textLight,
    textAlign: 'center',
    marginBottom: Spacing.xl,
    lineHeight: 20,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    gap: Spacing.sm,
  },
  button: {
    flex: 1,
  },
});

export default Alert;