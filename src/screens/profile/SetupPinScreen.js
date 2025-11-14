import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useNavigation } from '@react-navigation/native';
import Toast from 'react-native-toast-message';

import Button from '../../components/common/Button';
import AuthService from '../../api/auth';
import { Colors } from '../../styles/colors';
import { Fonts } from '../../styles/fonts';
import { Spacing } from '../../styles/spacing';

const SetupPinScreen = () => {
  const navigation = useNavigation();
  const [pin, setPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');
  const [step, setStep] = useState(1); // 1 = enter PIN, 2 = confirm PIN
  const [isLoading, setIsLoading] = useState(false);
  
  // Refs for PIN inputs
  const pinInput1 = useRef(null);
  const pinInput2 = useRef(null);
  const pinInput3 = useRef(null);
  const pinInput4 = useRef(null);
  
  const confirmPinInput1 = useRef(null);
  const confirmPinInput2 = useRef(null);
  const confirmPinInput3 = useRef(null);
  const confirmPinInput4 = useRef(null);

  const handlePinChange = (value, index, isConfirm = false) => {
    const currentPin = isConfirm ? confirmPin : pin;
    const setCurrentPin = isConfirm ? setConfirmPin : setPin;
    const refs = isConfirm 
      ? [confirmPinInput1, confirmPinInput2, confirmPinInput3, confirmPinInput4]
      : [pinInput1, pinInput2, pinInput3, pinInput4];

    // Only allow numbers
    if (value && !/^\d$/.test(value)) return;

    // Update PIN
    const newPin = currentPin.split('');
    newPin[index] = value;
    setCurrentPin(newPin.join(''));

    // Auto-focus next input
    if (value && index < 3) {
      refs[index + 1].current?.focus();
    }
  };

  const handleKeyPress = (e, index, isConfirm = false) => {
    const currentPin = isConfirm ? confirmPin : pin;
    const setCurrentPin = isConfirm ? setConfirmPin : setPin;
    const refs = isConfirm 
      ? [confirmPinInput1, confirmPinInput2, confirmPinInput3, confirmPinInput4]
      : [pinInput1, pinInput2, pinInput3, pinInput4];

    if (e.nativeEvent.key === 'Backspace') {
      if (!currentPin[index] && index > 0) {
        // If current is empty, go back and clear previous
        refs[index - 1].current?.focus();
        const newPin = currentPin.split('');
        newPin[index - 1] = '';
        setCurrentPin(newPin.join(''));
      } else {
        // Clear current
        const newPin = currentPin.split('');
        newPin[index] = '';
        setCurrentPin(newPin.join(''));
      }
    }
  };

  const handleContinue = () => {
    if (step === 1) {
      if (pin.length !== 4) {
        Toast.show({
          type: 'error',
          text1: 'Invalid PIN',
          text2: 'Please enter a 4-digit PIN',
        });
        return;
      }
      setStep(2);
      // Auto-focus first confirm input
      setTimeout(() => confirmPinInput1.current?.focus(), 100);
    } else {
      handleSetupPin();
    }
  };

  const handleSetupPin = async () => {
    if (pin !== confirmPin) {
      Toast.show({
        type: 'error',
        text1: 'PIN Mismatch',
        text2: 'The PINs you entered do not match',
      });
      setConfirmPin('');
      confirmPinInput1.current?.focus();
      return;
    }

    if (confirmPin.length !== 4) {
      Toast.show({
        type: 'error',
        text1: 'Invalid PIN',
        text2: 'Please enter a 4-digit PIN',
      });
      return;
    }

    try {
      setIsLoading(true);

      const response = await AuthService.setupPin(pin, confirmPin);

      if (response.success) {
        Toast.show({
          type: 'success',
          text1: 'PIN Setup Complete',
          text2: 'Your transaction PIN has been set successfully',
        });

        // Navigate back to Security Settings
        setTimeout(() => {
          navigation.goBack();
        }, 1000);
      } else {
        Toast.show({
          type: 'error',
          text1: 'Setup Failed',
          text2: response.message || 'Failed to setup PIN',
        });
      }
    } catch (error) {
      console.error('Setup PIN error:', error);
      Toast.show({
        type: 'error',
        text1: 'Setup Failed',
        text2: error.message || 'An error occurred while setting up your PIN',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleBack = () => {
    if (step === 2) {
      setStep(1);
      setConfirmPin('');
      setTimeout(() => pinInput1.current?.focus(), 100);
    } else {
      navigation.goBack();
    }
  };

  const renderPinInputs = (isConfirm = false) => {
    const currentPin = isConfirm ? confirmPin : pin;
    const refs = isConfirm 
      ? [confirmPinInput1, confirmPinInput2, confirmPinInput3, confirmPinInput4]
      : [pinInput1, pinInput2, pinInput3, pinInput4];

    return (
      <View style={styles.pinContainer}>
        {[0, 1, 2, 3].map((index) => (
          <TextInput
            key={index}
            ref={refs[index]}
            style={[
              styles.pinInput,
              currentPin[index] && styles.pinInputFilled,
            ]}
            value={currentPin[index] || ''}
            onChangeText={(value) => handlePinChange(value, index, isConfirm)}
            onKeyPress={(e) => handleKeyPress(e, index, isConfirm)}
            keyboardType="number-pad"
            maxLength={1}
            secureTextEntry
            selectTextOnFocus
            autoFocus={index === 0 && !isConfirm}
          />
        ))}
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBack}>
          <Icon name="arrow-back" size={24} color={Colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Setup Transaction PIN</Text>
        <View style={{ width: 24 }} />
      </View>

      <View style={styles.content}>
        <View style={styles.iconContainer}>
          <Icon 
            name={step === 1 ? 'lock-outline' : 'lock'} 
            size={64} 
            color={Colors.primary} 
          />
        </View>

        <Text style={styles.title}>
          {step === 1 ? 'Create Your PIN' : 'Confirm Your PIN'}
        </Text>
        
        <Text style={styles.description}>
          {step === 1 
            ? 'Create a 4-digit PIN to secure your transactions'
            : 'Enter your PIN again to confirm'
          }
        </Text>

        {renderPinInputs(step === 2)}

        <View style={styles.stepIndicator}>
          <View style={[styles.stepDot, step >= 1 && styles.stepDotActive]} />
          <View style={[styles.stepDot, step >= 2 && styles.stepDotActive]} />
        </View>

        <View style={styles.buttonContainer}>
          <Button
            title={step === 1 ? 'Continue' : 'Setup PIN'}
            onPress={handleContinue}
            loading={isLoading}
            disabled={step === 1 ? pin.length !== 4 : confirmPin.length !== 4}
          />
        </View>

        <View style={styles.infoCard}>
          <Icon name="info" size={20} color={Colors.primary} />
          <View style={styles.infoTextContainer}>
            <Text style={styles.infoTitle}>Important</Text>
            <Text style={styles.infoText}>
              • Your PIN will be required for all transactions{'\n'}
              • Keep your PIN secure and don't share it{'\n'}
              • You can change it later in Security Settings
            </Text>
          </View>
        </View>
      </View>
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
  content: {
    flex: 1,
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.xl,
  },
  iconContainer: {
    alignItems: 'center',
    marginBottom: Spacing.xl,
  },
  title: {
    fontSize: 24,
    fontFamily: Fonts.bold,
    color: Colors.text,
    textAlign: 'center',
    marginBottom: Spacing.sm,
  },
  description: {
    fontSize: 14,
    fontFamily: Fonts.regular,
    color: Colors.textLight,
    textAlign: 'center',
    marginBottom: Spacing.xl,
  },
  pinContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: Spacing.md,
    marginBottom: Spacing.lg,
  },
  pinInput: {
    width: 56,
    height: 56,
    borderWidth: 2,
    borderColor: Colors.border,
    borderRadius: 12,
    fontSize: 24,
    fontFamily: Fonts.bold,
    color: Colors.text,
    textAlign: 'center',
    backgroundColor: Colors.white,
  },
  pinInputFilled: {
    borderColor: Colors.primary,
    backgroundColor: Colors.primaryLight,
  },
  stepIndicator: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: Spacing.xs,
    marginBottom: Spacing.xl,
  },
  stepDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.border,
  },
  stepDotActive: {
    backgroundColor: Colors.primary,
    width: 24,
  },
  buttonContainer: {
    marginBottom: Spacing.xl,
  },
  infoCard: {
    flexDirection: 'row',
    backgroundColor: Colors.primaryLight,
    padding: Spacing.md,
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: Colors.primary,
  },
  infoTextContainer: {
    flex: 1,
    marginLeft: Spacing.sm,
  },
  infoTitle: {
    fontSize: 14,
    fontFamily: Fonts.semiBold,
    color: Colors.text,
    marginBottom: Spacing.xs,
  },
  infoText: {
    fontSize: 12,
    fontFamily: Fonts.regular,
    color: Colors.textLight,
    lineHeight: 18,
  },
});

export default SetupPinScreen;