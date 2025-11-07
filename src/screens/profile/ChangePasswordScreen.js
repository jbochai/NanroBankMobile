import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useNavigation } from '@react-navigation/native';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import Toast from 'react-native-toast-message';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import { Colors } from '../../styles/colors';
import { Fonts } from '../../styles/fonts';
import { Spacing } from '../../styles/spacing';
import api from '../../api/client';

const schema = yup.object({
  currentPassword: yup
    .string()
    .required('Current password is required')
    .min(6, 'Password must be at least 6 characters'),
  newPassword: yup
    .string()
    .required('New password is required')
    .min(6, 'Password must be at least 6 characters')
    .notOneOf([yup.ref('currentPassword')], 'New password must be different from current password'),
  confirmPassword: yup
    .string()
    .required('Please confirm your password')
    .oneOf([yup.ref('newPassword')], 'Passwords must match'),
}).required();

const ChangePasswordScreen = () => {
  const navigation = useNavigation();
  const [isLoading, setIsLoading] = useState(false);
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    },
  });

  const onSubmit = async (data) => {
    setIsLoading(true);
    
    try {
      const response = await api.post('/auth/change-password', {
        current_password: data.currentPassword,
        new_password: data.newPassword,
        new_password_confirmation: data.confirmPassword,
      });

      if (response.data.success) {
        Toast.show({
          type: 'success',
          text1: 'Password Changed',
          text2: 'Your password has been updated successfully',
        });
        reset();
        navigation.goBack();
      }
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: error.response?.data?.message || 'Failed to change password',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const passwordRequirements = [
    { text: 'At least 6 characters', met: false },
    { text: 'Contains uppercase letter', met: false },
    { text: 'Contains lowercase letter', met: false },
    { text: 'Contains number', met: false },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-back" size={24} color={Colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Change Password</Text>
        <View style={{ width: 24 }} />
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}>
          
          <View style={styles.infoCard}>
            <Icon name="info" size={24} color={Colors.primary} />
            <Text style={styles.infoText}>
              Choose a strong password that you haven't used before.
              Avoid using personal information.
            </Text>
          </View>

          <View style={styles.form}>
            <Controller
              control={control}
              name="currentPassword"
              render={({ field: { onChange, onBlur, value } }) => (
                <Input
                  label="Current Password"
                  placeholder="Enter current password"
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  error={errors.currentPassword?.message}
                  secureTextEntry={!showCurrent}
                  leftIcon="lock"
                  rightIcon={showCurrent ? 'visibility-off' : 'visibility'}
                  onRightIconPress={() => setShowCurrent(!showCurrent)}
                />
              )}
            />

            <Controller
              control={control}
              name="newPassword"
              render={({ field: { onChange, onBlur, value } }) => (
                <Input
                  label="New Password"
                  placeholder="Enter new password"
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  error={errors.newPassword?.message}
                  secureTextEntry={!showNew}
                  leftIcon="lock"
                  rightIcon={showNew ? 'visibility-off' : 'visibility'}
                  onRightIconPress={() => setShowNew(!showNew)}
                />
              )}
            />

            <Controller
              control={control}
              name="confirmPassword"
              render={({ field: { onChange, onBlur, value } }) => (
                <Input
                  label="Confirm New Password"
                  placeholder="Re-enter new password"
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  error={errors.confirmPassword?.message}
                  secureTextEntry={!showConfirm}
                  leftIcon="lock"
                  rightIcon={showConfirm ? 'visibility-off' : 'visibility'}
                  onRightIconPress={() => setShowConfirm(!showConfirm)}
                />
              )}
            />

            <View style={styles.requirementsCard}>
              <Text style={styles.requirementsTitle}>Password Requirements:</Text>
              {passwordRequirements.map((req, index) => (
                <View key={index} style={styles.requirementItem}>
                  <Icon
                    name={req.met ? 'check-circle' : 'radio-button-unchecked'}
                    size={16}
                    color={req.met ? Colors.success : Colors.textLight}
                  />
                  <Text style={styles.requirementText}>{req.text}</Text>
                </View>
              ))}
            </View>

            <Button
              title="Change Password"
              onPress={handleSubmit(onSubmit)}
              loading={isLoading}
              style={styles.submitButton}
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.md,
    backgroundColor: Colors.white,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  headerTitle: {
    fontSize: 18,
    fontFamily: Fonts.semiBold,
    color: Colors.text,
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    padding: Spacing.md,
  },
  infoCard: {
    flexDirection: 'row',
    backgroundColor: Colors.primaryLight,
    padding: Spacing.md,
    borderRadius: 8,
    marginBottom: Spacing.lg,
  },
  infoText: {
    flex: 1,
    fontSize: 13,
    fontFamily: Fonts.regular,
    color: Colors.text,
    marginLeft: Spacing.sm,
    lineHeight: 20,
  },
  form: {
    backgroundColor: Colors.white,
    borderRadius: 12,
    padding: Spacing.lg,
  },
  requirementsCard: {
    backgroundColor: Colors.background,
    padding: Spacing.md,
    borderRadius: 8,
    marginVertical: Spacing.md,
  },
  requirementsTitle: {
    fontSize: 14,
    fontFamily: Fonts.semiBold,
    color: Colors.text,
    marginBottom: Spacing.sm,
  },
  requirementItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: Spacing.xs,
  },
  requirementText: {
    fontSize: 12,
    fontFamily: Fonts.regular,
    color: Colors.textLight,
    marginLeft: Spacing.xs,
  },
  submitButton: {
    marginTop: Spacing.md,
  },
});

export default ChangePasswordScreen;