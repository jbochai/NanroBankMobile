import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import Icon from 'react-native-vector-icons/MaterialIcons';
import * as Animatable from 'react-native-animatable';
import Toast from 'react-native-toast-message';

import Button from '../../components/common/Button';
import Loader from '../../components/common/Loader';
import { biometricLogin } from '../../store/auth/authSlice';
import { selectIsLoading } from '../../store/auth/authSlice';
import { 
  isBiometricAvailable, 
  authenticateWithBiometric,
  getBiometricEnrollmentGuidance,
} from '../../utils/biometric';
import { Colors } from '../../styles/colors';
import { Fonts } from '../../styles/fonts';
import { Spacing } from '../../styles/spacing';

const BiometricLoginScreen = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  
  const isLoading = useSelector(selectIsLoading);
  
  const [biometricAvailable, setBiometricAvailable] = useState(false);
  const [biometryType, setBiometryType] = useState(null);
  const [biometryName, setBiometryName] = useState('Biometric Authentication');
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    checkBiometricAvailability();
  }, []);

  const checkBiometricAvailability = async () => {
    try {
      const { available, biometryType: type, biometryName: name } = await isBiometricAvailable();
      
      setBiometricAvailable(available);
      setBiometryType(type);
      setBiometryName(name || 'Biometric Authentication');
      
      if (!available) {
        Toast.show({
          type: 'error',
          text1: 'Biometric Not Available',
          text2: 'Please use password to login',
        });
      } else {
        setTimeout(() => {
          handleBiometricLogin();
        }, 500);
      }
    } catch (err) {
      console.error('Error checking biometric availability:', err);
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Failed to check biometric availability',
      });
    } finally {
      setChecking(false);
    }
  };

  const handleBiometricLogin = async () => {
    if (!biometricAvailable) {
      Toast.show({
        type: 'error',
        text1: 'Not Available',
        text2: 'Biometric authentication is not available on this device',
      });
      return;
    }

    try {
      const result = await authenticateWithBiometric();
      
      if (result.success) {
        const loginResult = await dispatch(biometricLogin()).unwrap();
        
        Toast.show({
          type: 'success',
          text1: 'Login Successful',
          text2: `Welcome back, ${loginResult.user?.first_name || 'User'}!`,
        });
      } else {
        Toast.show({
          type: 'error',
          text1: 'Authentication Failed',
          text2: result.error || 'Biometric authentication failed',
        });
      }
    } catch (err) {
      console.error('Biometric login error:', err);
      Toast.show({
        type: 'error',
        text1: 'Login Failed',
        text2: err.message || 'An error occurred during biometric login',
      });
    }
  };

  const handleUsePassword = () => {
    navigation.navigate('Login');
  };

  const handleSetupBiometric = async () => {
    const guidance = await getBiometricEnrollmentGuidance();
    
    if (!guidance.canEnroll) {
      Toast.show({
        type: 'info',
        text1: 'Not Available',
        text2: guidance.message,
      });
      return;
    }

    Toast.show({
      type: 'info',
      text1: 'Setup Biometric',
      text2: guidance.message,
      visibilityTime: 5000,
    });
  };

  const getBiometricIcon = () => {
    if (Platform.OS === 'ios') {
      if (biometryType === 'FaceID') {
        return 'face';
      } else if (biometryType === 'TouchID') {
        return 'fingerprint';
      }
    }
    return 'fingerprint';
  };

  const getBiometricIconColor = () => {
    return biometricAvailable ? Colors.primary : Colors.textMuted;
  };

  if (checking) {
    return (
      <SafeAreaView style={styles.container}>
        <Loader visible={true} text="Checking biometric availability..." />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
          <Icon name="arrow-back" size={24} color={Colors.text} />
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        <Animatable.View
          animation="fadeInDown"
          duration={800}
          style={styles.logoContainer}>
          <View style={styles.biometricIconContainer}>
            <Icon
              name={getBiometricIcon()}
              size={80}
              color={getBiometricIconColor()}
            />
          </View>
          
          <Text style={styles.title}>
            {biometricAvailable ? biometryName : 'Biometric Not Available'}
          </Text>
          
          <Text style={styles.subtitle}>
            {biometricAvailable
              ? `Use your ${biometryName.toLowerCase()} to securely login to your account`
              : 'Biometric authentication is not set up on this device'}
          </Text>
        </Animatable.View>

        <Animatable.View
          animation="fadeInUp"
          delay={400}
          duration={800}
          style={styles.buttonContainer}>
          
          {biometricAvailable ? (
            <>
              <Button
                title={`Authenticate with ${biometryName}`}
                onPress={handleBiometricLogin}
                loading={isLoading}
                gradient
                icon={getBiometricIcon()}
                size="large"
              />

              <Button
                title="Use Password Instead"
                onPress={handleUsePassword}
                variant="ghost"
                size="large"
                style={styles.passwordButton}
              />
            </>
          ) : (
            <>
              <Button
                title="Setup Biometric Authentication"
                onPress={handleSetupBiometric}
                variant="outline"
                icon="settings"
                size="large"
              />

              <Button
                title="Login with Password"
                onPress={handleUsePassword}
                gradient
                size="large"
                style={styles.passwordButton}
              />
            </>
          )}
        </Animatable.View>

        {biometricAvailable && (
          <Animatable.View
            animation="fadeIn"
            delay={800}
            duration={800}
            style={styles.infoContainer}>
            <Icon name="info" size={16} color={Colors.textLight} />
            <Text style={styles.infoText}>
              Your biometric data is stored securely on your device and never leaves it
            </Text>
          </Animatable.View>
        )}
      </View>

      <Loader visible={isLoading && !checking} />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.md,
  },
  backButton: {
    padding: Spacing.xs,
  },
  content: {
    flex: 1,
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.xl * 2,
  },
  logoContainer: {
    alignItems: 'center',
    marginTop: Spacing.xl * 2,
  },
  biometricIconContainer: {
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: Colors.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.xl,
  },
  title: {
    fontSize: 24,
    fontFamily: Fonts.semiBold,
    color: Colors.text,
    textAlign: 'center',
    marginBottom: Spacing.md,
  },
  subtitle: {
    fontSize: 16,
    fontFamily: Fonts.regular,
    color: Colors.textLight,
    textAlign: 'center',
    lineHeight: 24,
    paddingHorizontal: Spacing.lg,
  },
  buttonContainer: {
    gap: Spacing.md,
  },
  passwordButton: {
    marginTop: Spacing.xs,
  },
  infoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Spacing.lg,
    gap: Spacing.xs,
  },
  infoText: {
    flex: 1,
    fontSize: 12,
    fontFamily: Fonts.regular,
    color: Colors.textLight,
    lineHeight: 18,
  },
});

export default BiometricLoginScreen;

