import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useDispatch, useSelector } from 'react-redux';
import Icon from 'react-native-vector-icons/MaterialIcons';
import ReactNativeBiometrics from 'react-native-biometrics';
import LinearGradient from 'react-native-linear-gradient';
import Toast from 'react-native-toast-message';

import { 
  unlockScreen, 
  logout, 
  selectUser, 
  selectIsLoading,
  selectBiometricEnabled,
} from '../../store/auth/authSlice';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import { Colors, Gradients } from '../../styles/colors';
import { Fonts } from '../../styles/fonts';
import { Spacing } from '../../styles/spacing';

const rnBiometrics = new ReactNativeBiometrics();

const LockScreen = () => {
  const dispatch = useDispatch();
  const user = useSelector(selectUser);
  const isLoading = useSelector(selectIsLoading);
  const biometricEnabled = useSelector(selectBiometricEnabled);

  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [biometricAvailable, setBiometricAvailable] = useState(false);

  useEffect(() => {
    checkBiometrics();
    if (biometricEnabled) {
      handleBiometricAuth();
    }
  }, []);

  const checkBiometrics = async () => {
    try {
      const { available } = await rnBiometrics.isSensorAvailable();
      setBiometricAvailable(available);
    } catch (error) {
      console.error('Biometric check error:', error);
    }
  };

  const handleBiometricAuth = async () => {
    try {
      const { success, error } = await rnBiometrics.simplePrompt({
        promptMessage: 'Unlock Nanro Bank',
        cancelButtonText: 'Use Password',
      });

      if (success) {
        dispatch(unlockScreen({ biometric: true }))
          .unwrap()
          .then(() => {
            Toast.show({
              type: 'success',
              text1: 'Welcome back!',
              text2: `Hello ${user?.first_name}`,
            });
          })
          .catch((error) => {
            Toast.show({
              type: 'error',
              text1: 'Unlock Failed',
              text2: error,
            });
          });
      }
    } catch (error) {
      console.error('Biometric authentication error:', error);
    }
  };

  const handleUnlock = async () => {
    if (!password) {
      Toast.show({
        type: 'error',
        text1: 'Password Required',
        text2: 'Please enter your password',
      });
      return;
    }

    try {
      await dispatch(unlockScreen(password)).unwrap();
      Toast.show({
        type: 'success',
        text1: 'Welcome back!',
        text2: `Hello ${user?.first_name}`,
      });
      setPassword('');
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Unlock Failed',
        text2: error,
      });
    }
  };

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: () => dispatch(logout()),
        },
      ]
    );
  };

  return (
    <LinearGradient colors={Gradients.primary} style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.content}>
          <View style={styles.header}>
            <View style={styles.avatarContainer}>
              {user?.profile_photo ? (
                <Image 
                  source={{ uri: user.profile_photo }} 
                  style={styles.avatar}
                />
              ) : (
                <View style={styles.avatarPlaceholder}>
                  <Text style={styles.avatarText}>
                    {user?.first_name?.charAt(0)}{user?.last_name?.charAt(0)}
                  </Text>
                </View>
              )}
            </View>
            <Text style={styles.userName}>{user?.full_name}</Text>
            <Text style={styles.subtitle}>Welcome back! Please unlock to continue</Text>
          </View>

          <View style={styles.formContainer}>
            <Input
              placeholder="Enter your password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPassword}
              leftIcon="lock"
              rightIcon={showPassword ? 'visibility-off' : 'visibility'}
              onRightIconPress={() => setShowPassword(!showPassword)}
              onSubmitEditing={handleUnlock}
              style={styles.input}
            />

            <Button
              title="Unlock"
              onPress={handleUnlock}
              loading={isLoading}
              gradient
              style={styles.unlockButton}
            />

            {biometricAvailable && biometricEnabled && (
              <TouchableOpacity
                style={styles.biometricButton}
                onPress={handleBiometricAuth}>
                <Icon name="fingerprint" size={48} color={Colors.white} />
                <Text style={styles.biometricText}>Use Biometrics</Text>
              </TouchableOpacity>
            )}
          </View>

          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <Icon name="logout" size={20} color={Colors.white} />
            <Text style={styles.logoutText}>Logout</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.xl,
  },
  header: {
    alignItems: 'center',
    marginTop: Spacing.xl * 2,
  },
  avatarContainer: {
    marginBottom: Spacing.lg,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 3,
    borderColor: Colors.white,
  },
  avatarPlaceholder: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: Colors.white,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: Colors.white,
  },
  avatarText: {
    fontSize: 36,
    fontFamily: Fonts.bold,
    color: Colors.primary,
  },
  userName: {
    fontSize: 28,
    fontFamily: Fonts.bold,
    color: Colors.white,
    marginBottom: Spacing.xs,
  },
  subtitle: {
    fontSize: 14,
    fontFamily: Fonts.regular,
    color: Colors.white,
    opacity: 0.9,
    textAlign: 'center',
  },
  formContainer: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: Spacing.md,
  },
  input: {
    marginBottom: Spacing.lg,
  },
  unlockButton: {
    marginBottom: Spacing.xl,
  },
  biometricButton: {
    alignItems: 'center',
    paddingVertical: Spacing.lg,
  },
  biometricText: {
    fontSize: 14,
    fontFamily: Fonts.medium,
    color: Colors.white,
    marginTop: Spacing.sm,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.md,
  },
  logoutText: {
    fontSize: 16,
    fontFamily: Fonts.medium,
    color: Colors.white,
    marginLeft: Spacing.xs,
  },
});

export default LockScreen;