import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useNavigation } from '@react-navigation/native';
import { useSelector } from 'react-redux';
import Toast from 'react-native-toast-message';
import { selectUser, selectBiometricEnabled } from '../../store/auth/authSlice';
import { Colors } from '../../styles/colors';
import { Fonts } from '../../styles/fonts';
import { Spacing } from '../../styles/spacing';

const SecuritySettingsScreen = () => {
  const navigation = useNavigation();
  const user = useSelector(selectUser);
  const biometricEnabled = useSelector(selectBiometricEnabled);

  const [settings, setSettings] = useState({
    biometric: biometricEnabled || false,
    twoFactor: false,
    loginNotifications: true,
    transactionAlerts: true,
  });

  const toggleSetting = (key) => {
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
                <Text style={styles.settingTitle}>Biometric Login</Text>
                <Text style={styles.settingDescription}>
                  Use fingerprint or face ID to login
                </Text>
              </View>
            </View>
            <Switch
              value={settings.biometric}
              onValueChange={() => toggleSetting('biometric')}
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
            Last login: {user?.last_login_at ? new Date(user.last_login_at).toLocaleString() : 'N/A'}
          </Text>
        </View>
      </ScrollView>
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