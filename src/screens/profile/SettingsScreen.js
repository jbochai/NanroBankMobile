import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Switch,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Toast from 'react-native-toast-message';

import Header from '../../components/common/Header';
import Card from '../../components/common/Card';
import Loader from '../../components/common/Loader';
import { Colors } from '../../styles/colors';
import { Fonts } from '../../styles/fonts';
import { Spacing, BorderRadius } from '../../styles/spacing';

const SettingsScreen = () => {
  const navigation = useNavigation();
  
  const [loading, setLoading] = useState(false);
  const [settings, setSettings] = useState({
    notifications: true,
    pushNotifications: true,
    emailNotifications: true,
    smsNotifications: false,
    transactionAlerts: true,
    securityAlerts: true,
    promotionalEmails: false,
    biometricLogin: true,
    autoLockEnabled: true,
    autoLockTime: '5 minutes',
    language: 'English',
    currency: 'NGN',
    theme: 'Light',
  });

  const handleToggle = async (key) => {
    const newValue = !settings[key];
    setSettings({ ...settings, [key]: newValue });

    try {
      // Save settings to API
      Toast.show({
        type: 'success',
        text1: 'Settings Updated',
        text2: 'Your preferences have been saved',
      });
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Failed to update settings',
      });
      // Revert on error
      setSettings({ ...settings, [key]: !newValue });
    }
  };

  const settingsSections = [
    {
      title: 'Account',
      items: [
        {
          id: 'kyc',
          label: 'KYC Verification',
          description: 'Verify your identity',
          type: 'navigate',
          screen: 'KYC',
          icon: 'verified-user',
          iconColor: Colors.primary,
        },
        {
          id: 'personalInfo',
          label: 'Personal Information',
          description: 'Update your profile details',
          type: 'navigate',
          screen: 'PersonalInfo',
          icon: 'person',
          iconColor: '#4caf50',
        },
      ],
    },
    {
      title: 'Notifications',
      items: [
        {
          id: 'pushNotifications',
          label: 'Push Notifications',
          description: 'Receive push notifications on your device',
          type: 'toggle',
        },
        {
          id: 'emailNotifications',
          label: 'Email Notifications',
          description: 'Receive notifications via email',
          type: 'toggle',
        },
        {
          id: 'smsNotifications',
          label: 'SMS Notifications',
          description: 'Receive notifications via SMS',
          type: 'toggle',
        },
        {
          id: 'transactionAlerts',
          label: 'Transaction Alerts',
          description: 'Get notified for every transaction',
          type: 'toggle',
        },
        {
          id: 'securityAlerts',
          label: 'Security Alerts',
          description: 'Important security notifications',
          type: 'toggle',
        },
        {
          id: 'promotionalEmails',
          label: 'Promotional Emails',
          description: 'Receive offers and promotions',
          type: 'toggle',
        },
      ],
    },
    {
      title: 'Security',
      items: [
        {
          id: 'biometricLogin',
          label: 'Biometric Login',
          description: 'Use fingerprint or face ID',
          type: 'toggle',
        },
        {
          id: 'autoLockEnabled',
          label: 'Auto-Lock',
          description: 'Lock app after inactivity',
          type: 'toggle',
        },
        {
          id: 'securitySettings',
          label: 'Security Settings',
          description: 'Manage security options',
          type: 'navigate',
          screen: 'SecuritySettings',
        },
        {
          id: 'changePin',
          label: 'Change Transaction PIN',
          description: 'Update your transaction PIN',
          type: 'navigate',
          screen: 'ChangePin',
        },
        {
          id: 'changePassword',
          label: 'Change Password',
          description: 'Update your login password',
          type: 'navigate',
          screen: 'ChangePassword',
        },
      ],
    },
    {
      title: 'Preferences',
      items: [
        {
          id: 'language',
          label: 'Language',
          description: settings.language,
          type: 'navigate',
          screen: 'LanguageSettings',
        },
        {
          id: 'currency',
          label: 'Currency',
          description: settings.currency,
          type: 'navigate',
          screen: 'CurrencySettings',
        },
        {
          id: 'theme',
          label: 'Theme',
          description: settings.theme,
          type: 'navigate',
          screen: 'ThemeSettings',
        },
      ],
    },
  ];

  const renderSettingItem = (item) => {
    if (item.type === 'toggle') {
      return (
        <View key={item.id} style={styles.settingItem}>
          <View style={styles.settingContent}>
            <Text style={styles.settingLabel}>{item.label}</Text>
            <Text style={styles.settingDescription}>{item.description}</Text>
          </View>
          <Switch
            value={settings[item.id]}
            onValueChange={() => handleToggle(item.id)}
            trackColor={{ false: Colors.border, true: Colors.primaryLight }}
            thumbColor={settings[item.id] ? Colors.primary : Colors.white}
          />
        </View>
      );
    }

    if (item.type === 'navigate') {
      return (
        <TouchableOpacity
          key={item.id}
          style={styles.settingItem}
          onPress={() => navigation.navigate(item.screen)}
          activeOpacity={0.7}>
          {item.icon && (
            <View style={styles.iconContainer}>
              <Icon 
                name={item.icon} 
                size={24} 
                color={item.iconColor || Colors.textLight} 
              />
            </View>
          )}
          <View style={styles.settingContent}>
            <Text style={styles.settingLabel}>{item.label}</Text>
            <Text style={styles.settingDescription}>{item.description}</Text>
          </View>
          <Icon name="chevron-right" size={24} color={Colors.textLight} />
        </TouchableOpacity>
      );
    }

    return null;
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <Header title="Settings" showBack={true} />

      <ScrollView style={styles.scrollView}>
        {settingsSections.map((section) => (
          <View key={section.title} style={styles.section}>
            <Text style={styles.sectionTitle}>{section.title}</Text>
            <Card style={styles.sectionCard}>
              {section.items.map((item, index) => (
                <View key={item.id}>
                  {renderSettingItem(item)}
                  {index < section.items.length - 1 && <View style={styles.divider} />}
                </View>
              ))}
            </Card>
          </View>
        ))}

        {/* Additional Options */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Data & Storage</Text>
          <Card style={styles.sectionCard}>
            <TouchableOpacity
              style={styles.settingItem}
              onPress={() => {
                Toast.show({
                  type: 'info',
                  text1: 'Cache Cleared',
                  text2: 'App cache has been cleared',
                });
              }}
              activeOpacity={0.7}>
              <View style={styles.settingContent}>
                <Text style={styles.settingLabel}>Clear Cache</Text>
                <Text style={styles.settingDescription}>
                  Free up storage space
                </Text>
              </View>
              <Icon name="delete-outline" size={24} color={Colors.textLight} />
            </TouchableOpacity>
          </Card>
        </View>

        {/* Legal */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Legal</Text>
          <Card style={styles.sectionCard}>
            <TouchableOpacity
              style={styles.settingItem}
              onPress={() => navigation.navigate('TermsAndConditions')}
              activeOpacity={0.7}>
              <View style={styles.settingContent}>
                <Text style={styles.settingLabel}>Terms & Conditions</Text>
              </View>
              <Icon name="chevron-right" size={24} color={Colors.textLight} />
            </TouchableOpacity>
            <View style={styles.divider} />
            <TouchableOpacity
              style={styles.settingItem}
              onPress={() => navigation.navigate('PrivacyPolicy')}
              activeOpacity={0.7}>
              <View style={styles.settingContent}>
                <Text style={styles.settingLabel}>Privacy Policy</Text>
              </View>
              <Icon name="chevron-right" size={24} color={Colors.textLight} />
            </TouchableOpacity>
          </Card>
        </View>

        {/* App Info */}
        <View style={styles.appInfo}>
          <Text style={styles.appInfoText}>Nanro Bank v1.0.0</Text>
          <Text style={styles.appInfoText}>© 2025 Starcode Technology</Text>
        </View>
      </ScrollView>

      <Loader visible={loading} />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scrollView: {
    flex: 1,
  },
  section: {
    padding: Spacing.lg,
    paddingBottom: 0,
  },
  sectionTitle: {
    fontSize: 16,
    fontFamily: Fonts.semiBold,
    color: Colors.text,
    marginBottom: Spacing.md,
  },
  sectionCard: {
    padding: 0,
    overflow: 'hidden',
    marginBottom: Spacing.md,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: Spacing.md,
  },
  iconContainer: {
    marginRight: Spacing.sm,
  },
  settingContent: {
    flex: 1,
    marginRight: Spacing.md,
  },
  settingLabel: {
    fontSize: 15,
    fontFamily: Fonts.medium,
    color: Colors.text,
    marginBottom: 4,
  },
  settingDescription: {
    fontSize: 13,
    fontFamily: Fonts.regular,
    color: Colors.textLight,
    lineHeight: 18,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.border,
    marginLeft: Spacing.md,
  },
  appInfo: {
    alignItems: 'center',
    paddingVertical: Spacing.xl,
  },
  appInfoText: {
    fontSize: 12,
    fontFamily: Fonts.regular,
    color: Colors.textLight,
    marginBottom: 4,
  },
});

export default SettingsScreen;