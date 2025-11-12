import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  Pressable,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { Colors } from '../../styles/colors';
import { Fonts } from '../../styles/fonts';
import { Spacing, BorderRadius } from '../../styles/spacing';

const DownloadOptionsModal = ({ visible, onClose, onDownloadPDF, onSharePDF, onShareText, isLoading }) => {
  const handleOptionPress = async (action) => {
    await action();
    onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}>
      <Pressable style={styles.overlay} onPress={onClose}>
        <Pressable style={styles.container} onPress={(e) => e.stopPropagation()}>
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.iconContainer}>
              <Icon name="info" size={32} color={Colors.primary} />
            </View>
            <Text style={styles.title}>Download Receipt</Text>
            <Text style={styles.message}>
              Choose how you want to save or share your receipt
            </Text>
          </View>

          {/* Options */}
          <View style={styles.optionsContainer}>
            <TouchableOpacity
              style={[styles.option, styles.primaryOption]}
              onPress={() => handleOptionPress(onDownloadPDF)}
              disabled={isLoading}>
              <Icon name="picture-as-pdf" size={24} color={Colors.white} />
              <Text style={styles.primaryOptionText}>Download as PDF</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.option}
              onPress={() => handleOptionPress(onSharePDF)}
              disabled={isLoading}>
              <Icon name="share" size={24} color={Colors.primary} />
              <Text style={styles.optionText}>Share as PDF</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.option}
              onPress={() => handleOptionPress(onShareText)}
              disabled={isLoading}>
              <Icon name="text-fields" size={24} color={Colors.primary} />
              <Text style={styles.optionText}>Share as Text</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.option, styles.cancelOption]}
              onPress={onClose}
              disabled={isLoading}>
              <Text style={styles.cancelText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </Pressable>
      </Pressable>
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
  container: {
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.xl,
    width: '100%',
    maxWidth: 400,
    overflow: 'hidden',
  },
  header: {
    alignItems: 'center',
    padding: Spacing.xl,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  iconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: Colors.primary + '20',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  title: {
    fontSize: 20,
    fontFamily: Fonts.bold,
    color: Colors.text,
    marginBottom: Spacing.sm,
  },
  message: {
    fontSize: 14,
    fontFamily: Fonts.regular,
    color: Colors.textLight,
    textAlign: 'center',
    lineHeight: 20,
  },
  optionsContainer: {
    padding: Spacing.lg,
    gap: Spacing.sm,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    borderColor: Colors.border,
    backgroundColor: Colors.white,
    gap: Spacing.sm,
  },
  primaryOption: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  optionText: {
    fontSize: 16,
    fontFamily: Fonts.semiBold,
    color: Colors.primary,
  },
  primaryOptionText: {
    fontSize: 16,
    fontFamily: Fonts.semiBold,
    color: Colors.white,
  },
  cancelOption: {
    marginTop: Spacing.sm,
    backgroundColor: Colors.backgroundLight,
    borderColor: Colors.backgroundLight,
  },
  cancelText: {
    fontSize: 16,
    fontFamily: Fonts.semiBold,
    color: Colors.textLight,
  },
});

export default DownloadOptionsModal;