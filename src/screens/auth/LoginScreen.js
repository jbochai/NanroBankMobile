import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
  Alert,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialIcons';
import ReactNativeBiometrics from 'react-native-biometrics';
import * as Animatable from 'react-native-animatable';
import Toast from 'react-native-toast-message';


import { 
  login, 
  biometricLogin, 
  clearError,
  selectIsLoading,
  selectError,
  selectIsAccountLocked,
  selectLockoutEndTime,
} from '../../store/auth/authSlice';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import { Colors } from '../../styles/colors';
import { Fonts } from '../../styles/fonts';
import { Spacing } from '../../styles/spacing';
import AuthService from '../../api/auth';

// Validation schema
const schema = yup.object({
  login: yup
    .string()
    .required('Email or Phone number is required')
    .test('login', 'Enter a valid email or phone number', (value) => {
      if (!value) return false;
      // Check if it's an email
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      // Check if it's a phone number (Nigerian format)
      const phoneRegex = /^(\+234|0)[789]\d{9}$/;
      return emailRegex.test(value) || phoneRegex.test(value);
    }),
  password: yup
    .string()
    .required('Password is required')
    .min(6, 'Password must be at least 6 characters'),
}).required();

const LoginScreen = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const isLoading = useSelector(selectIsLoading);
  const error = useSelector(selectError);
  const isAccountLocked = useSelector(selectIsAccountLocked);
  const lockoutEndTime = useSelector(selectLockoutEndTime);
  
  const [showPassword, setShowPassword] = useState(false);
  const [biometricAvailable, setBiometricAvailable] = useState(false);
  const [lockoutTimeRemaining, setLockoutTimeRemaining] = useState(0);

  const rnBiometrics = new ReactNativeBiometrics();

  const {
    control,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      login: '',
      password: '',
    },
  });

  useEffect(() => {
    checkBiometricAvailability();
    return () => {
      dispatch(clearError());
    };
  }, []);

  useEffect(() => {
    if (isAccountLocked && lockoutEndTime) {
      const timer = setInterval(() => {
        const remaining = Math.max(0, lockoutEndTime - Date.now());
        setLockoutTimeRemaining(remaining);
        
        if (remaining === 0) {
          clearInterval(timer);
        }
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [isAccountLocked, lockoutEndTime]);

  useEffect(() => {
    if (error) {
      Toast.show({
        type: 'error',
        text1: 'Login Failed',
        text2: error,
      });
    }
  }, [error]);

  const checkBiometricAvailability = async () => {
    try {
      const { available } = await rnBiometrics.isSensorAvailable();
      setBiometricAvailable(available);
      
      // Check if biometric login is set up
      const biometricEnabled = await AuthService.isBiometricEnabled();
      if (available && biometricEnabled) {
        // Auto prompt for biometric login
        handleBiometricLogin();
      }
    } catch (error) {
      console.log('Biometric check error:', error);
    }
  };

  const onSubmit = async (data) => {
    if (isAccountLocked && lockoutTimeRemaining > 0) {
      const minutes = Math.ceil(lockoutTimeRemaining / 60000);
      Alert.alert(
        'Account Locked',
        `Too many failed login attempts. Please try again in ${minutes} minute${minutes > 1 ? 's' : ''}.`,
      );
      return;
    }

    try {
      const result = await dispatch(login(data)).unwrap();
      
      if (result) {
        Toast.show({
          type: 'success',
          text1: 'Welcome Back!',
          text2: `Hello, ${result.user.first_name}`,
        });
      }
    } catch (error) {
      console.error('Login error:', error);
    }
  };

  const handleBiometricLogin = async () => {
    try {
      const result = await dispatch(biometricLogin()).unwrap();
      
      if (result) {
        Toast.show({
          type: 'success',
          text1: 'Welcome Back!',
          text2: `Hello, ${result.user.first_name}`,
        });
      }
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Biometric Login Failed',
        text2: 'Please use your password to login',
      });
    }
  };

  const formatLockoutTime = () => {
    const minutes = Math.floor(lockoutTimeRemaining / 60000);
    const seconds = Math.floor((lockoutTimeRemaining % 60000) / 1000);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}>
          
          {/* Header Section */}
          <LinearGradient
            colors={[Colors.primary, Colors.primaryDark]}
            style={styles.headerSection}>
            <Animatable.View 
              animation="fadeInDown" 
              duration={1000}
              style={styles.logoContainer}>
              <View style={styles.logo}>
              <Image 
                source={require('../../assets/images/logo.png')}
                style={styles.logoImage}
                resizeMode="contain"
              />
            </View>
              <Text style={styles.appName}>Nanro Bank</Text>
              <Text style={styles.tagline}>Your Financial Partner</Text>
            </Animatable.View>
          </LinearGradient>

          {/* Form Section */}
          <Animatable.View 
            animation="fadeInUp" 
            duration={1000}
            style={styles.formSection}>
            <Text style={styles.welcomeText}>Welcome Back!</Text>
            <Text style={styles.instructionText}>
              Login to access your account
            </Text>

            {isAccountLocked && lockoutTimeRemaining > 0 && (
              <View style={styles.lockoutBanner}>
                <Icon name="lock-clock" size={20} color={Colors.error} />
                <Text style={styles.lockoutText}>
                  Account locked. Try again in {formatLockoutTime()}
                </Text>
              </View>
            )}

            <Controller
              control={control}
              name="login"
              render={({ field: { onChange, onBlur, value } }) => (
                <Input
                  label="Email or Phone Number"
                  placeholder="Enter email or phone number"
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  error={errors.login?.message}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  leftIcon="person"
                />
              )}
            />

            <Controller
              control={control}
              name="password"
              render={({ field: { onChange, onBlur, value } }) => (
                <Input
                  label="Password"
                  placeholder="Enter your password"
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  error={errors.password?.message}
                  secureTextEntry={!showPassword}
                  leftIcon="lock"
                  rightIcon={showPassword ? 'visibility-off' : 'visibility'}
                  onRightIconPress={() => setShowPassword(!showPassword)}
                />
              )}
            />

            <TouchableOpacity
              style={styles.forgotPassword}
              onPress={() => navigation.navigate('ForgotPassword')}>
              <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
            </TouchableOpacity>

            <Button
              title="Login"
              onPress={handleSubmit(onSubmit)}
              loading={isLoading}
              disabled={isAccountLocked && lockoutTimeRemaining > 0}
              style={styles.loginButton}
            />

            {biometricAvailable && (
              <TouchableOpacity
                style={styles.biometricButton}
                onPress={handleBiometricLogin}
                disabled={isLoading}>
                <Icon name="fingerprint" size={40} color={Colors.primary} />
                <Text style={styles.biometricText}>Login with Biometric</Text>
              </TouchableOpacity>
            )}

            <View style={styles.signupContainer}>
              <Text style={styles.signupText}>Don't have an account? </Text>
              <TouchableOpacity
                onPress={() => navigation.navigate('Register')}>
                <Text style={styles.signupLink}>Sign Up</Text>
              </TouchableOpacity>
            </View>
          </Animatable.View>
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
  headerSection: {
    paddingVertical: Spacing.xl * 2,
    paddingHorizontal: Spacing.lg,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    elevation: 5,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  logoContainer: {
    alignItems: 'center',
  },
  logo: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: Colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.md,
  },
  logoImage: {
  width: 50,
  height: 50,
},
  logoText: {
    fontSize: 32,
    fontFamily: Fonts.bold,
    color: Colors.primary,
  },
  appName: {
    fontSize: 28,
    fontFamily: Fonts.bold,
    color: Colors.white,
    marginBottom: Spacing.xs,
  },
  tagline: {
    fontSize: 14,
    fontFamily: Fonts.regular,
    color: Colors.white,
    opacity: 0.9,
  },
  formSection: {
    flex: 1,
    padding: Spacing.lg,
    paddingTop: Spacing.xl,
  },
  welcomeText: {
    fontSize: 24,
    fontFamily: Fonts.semiBold,
    color: Colors.text,
    marginBottom: Spacing.xs,
  },
  instructionText: {
    fontSize: 14,
    fontFamily: Fonts.regular,
    color: Colors.textLight,
    marginBottom: Spacing.xl,
  },
  lockoutBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.errorLight,
    padding: Spacing.md,
    borderRadius: 8,
    marginBottom: Spacing.lg,
  },
  lockoutText: {
    marginLeft: Spacing.sm,
    fontSize: 14,
    fontFamily: Fonts.medium,
    color: Colors.error,
  },
  forgotPassword: {
    alignSelf: 'flex-end',
    marginTop: Spacing.sm,
    marginBottom: Spacing.lg,
  },
  forgotPasswordText: {
    fontSize: 14,
    fontFamily: Fonts.medium,
    color: Colors.primary,
  },
  loginButton: {
    marginTop: Spacing.md,
  },
  biometricButton: {
    alignItems: 'center',
    marginTop: Spacing.xl,
    padding: Spacing.md,
  },
  biometricText: {
    marginTop: Spacing.sm,
    fontSize: 14,
    fontFamily: Fonts.medium,
    color: Colors.primary,
  },
  signupContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: Spacing.xl,
  },
  signupText: {
    fontSize: 14,
    fontFamily: Fonts.regular,
    color: Colors.textLight,
  },
  signupLink: {
    fontSize: 14,
    fontFamily: Fonts.semiBold,
    color: Colors.primary,
  },
});

export default LoginScreen;

