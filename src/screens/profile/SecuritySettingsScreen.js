import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
  Alert,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useNavigation } from '@react-navigation/native';
import { useSelector, useDispatch } from 'react-redux';
import ReactNativeBiometrics from 'react-native-biometrics';
import Toast from 'react-native-toast-message';

import { 
  selectUser, 
  selectBiometricEnabled,
  setBiometricEnabled,
} from '../../store/auth/authSlice';
import AuthService from '../../api/auth';
import PinInputModal from '../../components/common/PinInputModal';
import { Colors } from '../../styles/colors';
import { Fonts } from '../../styles/fonts';
import { Spacing } from '../../styles/spacing';

const SecuritySettingsScreen = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const user = useSelector(selectUser);
  const biometricEnabled = useSelector(selectBiometricEnabled);

  const [settings, setSettings] = useState({
    biometric: false,
    twoFactor: false,
    loginNotifications: true,
    transactionAlerts: true,
  });
  const [biometricAvailable, setBiometricAvailable] = useState(false);
  const [biometricType, setBiometricType] = useState('');
  const [showPinModal, setShowPinModal] = useState(false);
  const [pinModalConfig, setPinModalConfig] = useState({
    title: '',
    message: '',
    action: null,
  });

  const rnBiometrics = new ReactNativeBiometrics();

  useEffect(() => {
    checkBiometricAvailability();
    loadSettings();
  }, []);

  useEffect(() => {
    // Sync with Redux state
    setSettings(prev => ({
      ...prev,
      biometric: biometricEnabled,
    }));
  }, [biometricEnabled]);

  const checkBiometricAvailability = async () => {
    try {
      const { available, biometryType } = await rnBiometrics.isSensorAvailable();
      setBiometricAvailable(available);
      setBiometricType(biometryType || 'Biometric');
      
      console.log('Biometric available:', available, 'Type:', biometryType);
    } catch (error) {
      console.error('Biometric check error:', error);
      setBiometricAvailable(false);
    }
  };

  const loadSettings = async () => {
    try {
      const isBiometricEnabled = await AuthService.isBiometricEnabled();
      setSettings(prev => ({
        ...prev,
        biometric: isBiometricEnabled,
      }));
    } catch (error) {
      console.error('Error loading settings:', error);
    }
  };

  const handleEnableBiometric = async (transactionPin) => {
    try {
      const setupResult = await AuthService.setupBiometric(transactionPin);
      
      if (setupResult.success) {
        // Update Redux state
        dispatch(setBiometricEnabled(true));
        
        // Update local state
        setSettings(prev => ({
          ...prev,
          biometric: true,
        }));
        
        Toast.show({
          type: 'success',
          text1: 'Biometric Enabled',
          text2: `${biometricType} login has been enabled`,
        });
      } else {
        Toast.show({
          type: 'error',
          text1: 'Setup Failed',
          text2: setupResult.message || 'Failed to enable biometric',
        });
      }
    } catch (error) {
      console.error('Biometric setup error:', error);
      Toast.show({
        type: 'error',
        text1: 'Setup Failed',
        text2: 'Failed to enable biometric authentication',
      });
    }
    
    setShowPinModal(false);
  };

  const handleDisableBiometric = async (transactionPin) => {
    try {
      const result = await AuthService.disableBiometric(transactionPin);
      
      if (result.success) {
        // Update Redux state
        dispatch(setBiometricEnabled(false));
        
        // Update local state
        setSettings(prev => ({
          ...prev,
          biometric: false,
        }));
        
        Toast.show({
          type: 'success',
          text1: 'Biometric Disabled',
          text2: 'Biometric login has been disabled',
        });
      } else {
        Toast.show({
          type: 'error',
          text1: 'Failed',
          text2: result.message || 'Failed to disable biometric',
        });
      }
    } catch (error) {
      console.error('Biometric disable error:', error);
      Toast.show({
        type: 'error',
        text1: 'Failed',
        text2: 'Failed to disable biometric authentication',
      });
    }
    
    setShowPinModal(false);
  };

  const handleBiometricToggle = async () => {
    if (!biometricAvailable) {
      Alert.alert(
        'Biometric Not Available',
        'Your device does not support biometric authentication.',
        [{ text: 'OK' }]
      );
      return;
    }

    try {
      if (!settings.biometric) {
        // Enabling biometric
        if (Platform.OS === 'ios') {
          // Use Alert.prompt for iOS
          Alert.prompt(
            'Enable Biometric Login',
            `Enter your 4-digit transaction PIN to enable ${biometricType} login`,
            [
              {
                text: 'Cancel',
                style: 'cancel',
              },
              {
                text: 'Enable',
                onPress: async (transactionPin) => {
                  if (!transactionPin || transactionPin.length !== 4) {
                    Toast.show({
                      type: 'error',
                      text1: 'Invalid PIN',
                      text2: 'Please enter a 4-digit transaction PIN',
                    });
                    return;
                  }
                  await handleEnableBiometric(transactionPin);
                },
              },
            ],
            'secure-text'
          );
        } else {
          // Use custom modal for Android
          setPinModalConfig({
            title: 'Enable Biometric Login',
            message: `Enter your 4-digit transaction PIN to enable ${biometricType} login`,
            action: 'enable',
          });
          setShowPinModal(true);
        }
      } else {
        // Disabling biometric
        if (Platform.OS === 'ios') {
          // Use Alert.prompt for iOS
          Alert.prompt(
            'Disable Biometric Login',
            'Enter your 4-digit transaction PIN to disable biometric login',
            [
              {
                text: 'Cancel',
                style: 'cancel',
              },
              {
                text: 'Disable',
                style: 'destructive',
                onPress: async (transactionPin) => {
                  if (!transactionPin || transactionPin.length !== 4) {
                    Toast.show({
                      type: 'error',
                      text1: 'Invalid PIN',
                      text2: 'Please enter a 4-digit transaction PIN',
                    });
                    return;
                  }
                  await handleDisableBiometric(transactionPin);
                },
              },
            ],
            'secure-text'
          );
        } else {
          // Use custom modal for Android
          setPinModalConfig({
            title: 'Disable Biometric Login',
            message: 'Enter your 4-digit transaction PIN to disable biometric login',
            action: 'disable',
          });
          setShowPinModal(true);
        }
      }
    } catch (error) {
      console.error('Biometric toggle error:', error);
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'An error occurred while updating biometric settings',
      });
    }
  };

  const handlePinSubmit = (pin) => {
    if (pinModalConfig.action === 'enable') {
      handleEnableBiometric(pin);
    } else if (pinModalConfig.action === 'disable') {
      handleDisableBiometric(pin);
    }
  };

  const toggleSetting = (key) => {
    if (key === 'biometric') {
      handleBiometricToggle();
      return;
    }

    setSettings(prev => ({
      ...prev,
      [key]: !prev[key],
    }));
    
    Toast.show({
      type: 'success',
      text1: 'Settings Updated',
      text2: `${key} has been ${!settings[key] ? 'enabled' : 'disabled'}`,
    });
  };

  const securityOptions = [
    {
      id: 1,
      title: 'Change Password',
      description: 'Update your account password',
      icon: 'lock',
      color: Colors.primary,
      onPress: () => navigation.navigate('ChangePassword'),
    },
    {
      id: 2,
      title: 'Change Transaction PIN',
      description: 'Update your 4-digit transaction PIN',
      icon: 'pin',
      color: '#ff9800',
      onPress: () => navigation.navigate('ChangePin'),
    },
    {
      id: 3,
      title: 'Transaction Limits',
      description: 'Set daily transaction limits',
      icon: 'account-balance',
      color: '#4caf50',
      onPress: () => navigation.navigate('TransactionLimits'),
    },
    {
      id: 4,
      title: 'Linked Accounts',
      description: 'Manage linked bank accounts',
      icon: 'link',
      color: '#2196f3',
      onPress: () => navigation.navigate('LinkedAccounts'),
    },
  ];

  const renderSecurityOption = (option) => (
    <TouchableOpacity
      key={option.id}
      style={styles.optionItem}
      onPress={option.onPress}>
      <View style={[styles.optionIcon, { backgroundColor: option.color + '20' }]}>
        <Icon name={option.icon} size={24} color={option.color} />
      </View>
      <View style={styles.optionContent}>
        <Text style={styles.optionTitle}>{option.title}</Text>
        <Text style={styles.optionDescription}>{option.description}</Text>
      </View>
      <Icon name="chevron-right" size={24} color={Colors.textLight} />
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-back" size={24} color={Colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Security Settings</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Authentication</Text>
          
          <View style={styles.settingItem}>
            <View style={styles.settingLeft}>
              <Icon name="fingerprint" size={24} color={Colors.primary} />
              <View style={styles.settingTextContainer}>
                <Text style={styles.settingTitle}>
                  {biometricType || 'Biometric'} Login
                </Text>
                <Text style={styles.settingDescription}>
                  {biometricAvailable 
                    ? `Use ${biometricType || 'biometric'} to login`
                    : 'Not available on this device'
                  }
                </Text>
              </View>
            </View>
            <Switch
              value={settings.biometric}
              onValueChange={() => toggleSetting('biometric')}
              disabled={!biometricAvailable}
              trackColor={{ false: Colors.border, true: Colors.primary + '50' }}
              thumbColor={settings.biometric ? Colors.primary : Colors.textLight}
            />
          </View>

          <View style={styles.settingItem}>
            <View style={styles.settingLeft}>
              <Icon name="security" size={24} color={Colors.primary} />
              <View style={styles.settingTextContainer}>
                <Text style={styles.settingTitle}>Two-Factor Authentication</Text>
                <Text style={styles.settingDescription}>
                  Add extra security layer
                </Text>
              </View>
            </View>
            <Switch
              value={settings.twoFactor}
              onValueChange={() => toggleSetting('twoFactor')}
              trackColor={{ false: Colors.border, true: Colors.primary + '50' }}
              thumbColor={settings.twoFactor ? Colors.primary : Colors.textLight}
            />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Notifications</Text>
          
          <View style={styles.settingItem}>
            <View style={styles.settingLeft}>
              <Icon name="notifications" size={24} color={Colors.primary} />
              <View style={styles.settingTextContainer}>
                <Text style={styles.settingTitle}>Login Notifications</Text>
                <Text style={styles.settingDescription}>
                  Get notified of new login attempts
                </Text>
              </View>
            </View>
            <Switch
              value={settings.loginNotifications}
              onValueChange={() => toggleSetting('loginNotifications')}
              trackColor={{ false: Colors.border, true: Colors.primary + '50' }}
              thumbColor={settings.loginNotifications ? Colors.primary : Colors.textLight}
            />
          </View>

          <View style={styles.settingItem}>
            <View style={styles.settingLeft}>
              <Icon name="payment" size={24} color={Colors.primary} />
              <View style={styles.settingTextContainer}>
                <Text style={styles.settingTitle}>Transaction Alerts</Text>
                <Text style={styles.settingDescription}>
                  Get instant transaction notifications
                </Text>
              </View>
            </View>
            <Switch
              value={settings.transactionAlerts}
              onValueChange={() => toggleSetting('transactionAlerts')}
              trackColor={{ false: Colors.border, true: Colors.primary + '50' }}
              thumbColor={settings.transactionAlerts ? Colors.primary : Colors.textLight}
            />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Security Options</Text>
          {securityOptions.map(renderSecurityOption)}
        </View>

        <View style={styles.infoCard}>
          <Icon name="shield" size={24} color={Colors.success} />
          <Text style={styles.infoText}>
            Your account is secured with industry-standard encryption.
            {user?.last_login_at && `\nLast login: ${new Date(user.last_login_at).toLocaleString()}`}
          </Text>
        </View>
      </ScrollView>

      {/* PIN Input Modal for Android */}
      <PinInputModal
        visible={showPinModal}
        onClose={() => setShowPinModal(false)}
        onSubmit={handlePinSubmit}
        title={pinModalConfig.title}
        message={pinModalConfig.message}
      />
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
  scrollContent: {
    paddingBottom: Spacing.xl,
  },
  section: {
    backgroundColor: Colors.white,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.lg,
    marginBottom: Spacing.md,
  },
  sectionTitle: {
    fontSize: 16,
    fontFamily: Fonts.semiBold,
    color: Colors.text,
    marginBottom: Spacing.md,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  settingTextContainer: {
    marginLeft: Spacing.md,
    flex: 1,
  },
  settingTitle: {
    fontSize: 14,
    fontFamily: Fonts.medium,
    color: Colors.text,
    marginBottom: 2,
  },
  settingDescription: {
    fontSize: 12,
    fontFamily: Fonts.regular,
    color: Colors.textLight,
  },
  optionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  optionIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.md,
  },
  optionContent: {
    flex: 1,
  },
  optionTitle: {
    fontSize: 14,
    fontFamily: Fonts.medium,
    color: Colors.text,
    marginBottom: 2,
  },
  optionDescription: {
    fontSize: 12,
    fontFamily: Fonts.regular,
    color: Colors.textLight,
  },
  infoCard: {
    flexDirection: 'row',
    backgroundColor: Colors.successLight,
    padding: Spacing.md,
    marginHorizontal: Spacing.md,
    borderRadius: 8,
  },
  infoText: {
    flex: 1,
    fontSize: 12,
    fontFamily: Fonts.regular,
    color: Colors.text,
    marginLeft: Spacing.sm,
    lineHeight: 18,
  },
});

export default SecuritySettingsScreen;