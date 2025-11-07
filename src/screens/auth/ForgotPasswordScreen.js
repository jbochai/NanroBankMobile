import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { useDispatch } from 'react-redux';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Toast from 'react-native-toast-message';

import Header from '../../components/common/Header';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import { forgotPassword } from '../../store/auth/authActions';
import { validateEmail } from '../../utils/validation';
import { Colors } from '../../styles/colors';
import { Fonts } from '../../styles/fonts';
import { Spacing } from '../../styles/spacing';

const ForgotPasswordScreen = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async () => {
    // Validate email
    const validation = validateEmail(email);
    if (!validation.isValid) {
      setError(validation.error);
      return;
    }

    setLoading(true);
    setError('');

    try {
      const result = await dispatch(forgotPassword(email)).unwrap();
      
      setEmailSent(true);
      Toast.show({
        type: 'success',
        text1: 'Email Sent',
        text2: 'Please check your email for password reset instructions',
      });
    } catch (err) {
      setError(err.message || 'Failed to send reset email. Please try again.');
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: err.message || 'Failed to send reset email',
      });
    } finally {
      setLoading(false);
    }
  };

  if (emailSent) {
    return (
      <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
        <Header title="Forgot Password" />
        
        <View style={styles.successContainer}>
          <Icon name="mark-email-read" size={80} color={Colors.success} />
          <Text style={styles.successTitle}>Email Sent!</Text>
          <Text style={styles.successMessage}>
            We've sent password reset instructions to{' '}
            <Text style={styles.email}>{email}</Text>
          </Text>
          <Text style={styles.successSubtext}>
            Please check your email and follow the instructions to reset your password.
          </Text>

          <Button
            title="Back to Login"
            onPress={() => navigation.navigate('Login')}
            style={styles.successButton}
          />

          <Button
            title="Resend Email"
            variant="outline"
            onPress={handleSubmit}
            loading={loading}
            style={styles.resendButton}
          />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <Header title="Forgot Password" />
      
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled">
          
          <View style={styles.content}>
            <Text style={styles.title}>Reset Your Password</Text>
            <Text style={styles.subtitle}>
              Enter your email address and we'll send you instructions to reset your password.
            </Text>

            <Input
              label="Email Address"
              placeholder="Enter your email"
              value={email}
              onChangeText={(text) => {
                setEmail(text);
                setError('');
              }}
              keyboardType="email-address"
              autoCapitalize="none"
              error={error}
              icon="email"
            />

            <Button
              title="Send Reset Link"
              onPress={handleSubmit}
              loading={loading}
              gradient
              style={styles.submitButton}
            />

            <Button
              title="Back to Login"
              variant="ghost"
              onPress={() => navigation.goBack()}
              style={styles.backButton}
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
    backgroundColor: Colors.white,
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  content: {
    flex: 1,
    padding: Spacing.xl,
  },
  title: {
    fontSize: 24,
    fontFamily: Fonts.semiBold,
    color: Colors.text,
    marginBottom: Spacing.sm,
  },
  subtitle: {
    fontSize: 16,
    fontFamily: Fonts.regular,
    color: Colors.textLight,
    marginBottom: Spacing.xl * 2,
    lineHeight: 22,
  },
  submitButton: {
    marginTop: Spacing.lg,
  },
  backButton: {
    marginTop: Spacing.md,
  },
  successContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.xl,
  },
  successTitle: {
    fontSize: 24,
    fontFamily: Fonts.semiBold,
    color: Colors.text,
    marginTop: Spacing.lg,
    marginBottom: Spacing.md,
  },
  successMessage: {
    fontSize: 16,
    fontFamily: Fonts.regular,
    color: Colors.text,
    textAlign: 'center',
    marginBottom: Spacing.sm,
    lineHeight: 22,
  },
  email: {
    fontFamily: Fonts.semiBold,
    color: Colors.primary,
  },
  successSubtext: {
    fontSize: 14,
    fontFamily: Fonts.regular,
    color: Colors.textLight,
    textAlign: 'center',
    marginBottom: Spacing.xl * 2,
    lineHeight: 20,
  },
  successButton: {
    width: '100%',
    marginBottom: Spacing.md,
  },
  resendButton: {
    width: '100%',
  },
});

export default ForgotPasswordScreen;

