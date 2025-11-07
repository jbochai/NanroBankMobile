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
import Toast from 'react-native-toast-message';
import Button from '../../components/common/Button';
import { Colors } from '../../styles/colors';
import { Fonts } from '../../styles/fonts';
import { Spacing } from '../../styles/spacing';

const NotificationSettingsScreen = () => {
  const navigation = useNavigation();
  const [isLoading, setIsLoading] = useState(false);

  const [notifications, setNotifications] = useState({
    // Push Notifications
    pushEnabled: true,
    transactions: true,
    transfers: true,
    billPayments: true,
    deposits: true,
    withdrawals: true,
    
    // Email Notifications
    emailEnabled: true,
    weeklyStatement: true,
    monthlyStatement: true,
    promotions: false,
    securityAlerts: true,
    
    // SMS Notifications
    smsEnabled: true,
    transactionAlerts: true,
    loginAlerts: true,
    otpEnabled: true,
  });

  const toggleNotification = (key) => {
    setNotifications(prev => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const handleSave = async () => {
    setIsLoading(true);
    
    setTimeout(() => {
      setIsLoading(false);
      Toast.show({
        type: 'success',
        text1: 'Settings Saved',
        text2: 'Your notification preferences have been updated',
      });
    }, 1500);
  };

  const NotificationItem = ({ title, description, value, onToggle, icon }) => (
    <View style={styles.notificationItem}>
      <View style={styles.notificationLeft}>
        <Icon name={icon} size={24} color={Colors.primary} />
        <View style={styles.notificationTextContainer}>
          <Text style={styles.notificationTitle}>{title}</Text>
          {description && (
            <Text style={styles.notificationDescription}>{description}</Text>
          )}
        </View>
      </View>
      <Switch
        value={value}
        onValueChange={onToggle}
        trackColor={{ false: Colors.border, true: Colors.primary + '50' }}
        thumbColor={value ? Colors.primary : Colors.textLight}
      />
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-back" size={24} color={Colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Notification Settings</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>
        
        {/* Push Notifications Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Push Notifications</Text>
            <Switch
              value={notifications.pushEnabled}
              onValueChange={() => toggleNotification('pushEnabled')}
              trackColor={{ false: Colors.border, true: Colors.primary + '50' }}
              thumbColor={notifications.pushEnabled ? Colors.primary : Colors.textLight}
            />
          </View>
          
          {notifications.pushEnabled && (
            <>
              <NotificationItem
                icon="payment"
                title="Transaction Notifications"
                description="Get notified of all transactions"
                value={notifications.transactions}
                onToggle={() => toggleNotification('transactions')}
              />
              <NotificationItem
                icon="send"
                title="Transfer Alerts"
                description="Alerts for money transfers"
                value={notifications.transfers}
                onToggle={() => toggleNotification('transfers')}
              />
              <NotificationItem
                icon="receipt"
                title="Bill Payments"
                description="Notifications for bill payments"
                value={notifications.billPayments}
                onToggle={() => toggleNotification('billPayments')}
              />
              <NotificationItem
                icon="account-balance-wallet"
                title="Deposits"
                description="Alerts for account deposits"
                value={notifications.deposits}
                onToggle={() => toggleNotification('deposits')}
              />
              <NotificationItem
                icon="atm"
                title="Withdrawals"
                description="Alerts for withdrawals"
                value={notifications.withdrawals}
                onToggle={() => toggleNotification('withdrawals')}
              />
            </>
          )}
        </View>

        {/* Email Notifications Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Email Notifications</Text>
            <Switch
              value={notifications.emailEnabled}
              onValueChange={() => toggleNotification('emailEnabled')}
              trackColor={{ false: Colors.border, true: Colors.primary + '50' }}
              thumbColor={notifications.emailEnabled ? Colors.primary : Colors.textLight}
            />
          </View>
          
          {notifications.emailEnabled && (
            <>
              <NotificationItem
                icon="description"
                title="Weekly Statements"
                description="Receive weekly account statements"
                value={notifications.weeklyStatement}
                onToggle={() => toggleNotification('weeklyStatement')}
              />
              <NotificationItem
                icon="calendar-today"
                title="Monthly Statements"
                description="Receive monthly account statements"
                value={notifications.monthlyStatement}
                onToggle={() => toggleNotification('monthlyStatement')}
              />
              <NotificationItem
                icon="local-offer"
                title="Promotions & Offers"
                description="Special offers and promotions"
                value={notifications.promotions}
                onToggle={() => toggleNotification('promotions')}
              />
              <NotificationItem
                icon="security"
                title="Security Alerts"
                description="Important security notifications"
                value={notifications.securityAlerts}
                onToggle={() => toggleNotification('securityAlerts')}
              />
            </>
          )}
        </View>

        {/* SMS Notifications Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>SMS Notifications</Text>
            <Switch
              value={notifications.smsEnabled}
              onValueChange={() => toggleNotification('smsEnabled')}
              trackColor={{ false: Colors.border, true: Colors.primary + '50' }}
              thumbColor={notifications.smsEnabled ? Colors.primary : Colors.textLight}
            />
          </View>
          
          {notifications.smsEnabled && (
            <>
              <NotificationItem
                icon="message"
                title="Transaction Alerts"
                description="SMS for all transactions"
                value={notifications.transactionAlerts}
                onToggle={() => toggleNotification('transactionAlerts')}
              />
              <NotificationItem
                icon="login"
                title="Login Alerts"
                description="SMS for new login attempts"
                value={notifications.loginAlerts}
                onToggle={() => toggleNotification('loginAlerts')}
              />
              <NotificationItem
                icon="key"
                title="OTP Messages"
                description="One-time passwords via SMS"
                value={notifications.otpEnabled}
                onToggle={() => toggleNotification('otpEnabled')}
              />
            </>
          )}
        </View>

        <View style={styles.infoCard}>
          <Icon name="info" size={24} color={Colors.primary} />
          <Text style={styles.infoText}>
            Standard SMS and data rates may apply. Security alerts cannot be disabled.
          </Text>
        </View>

        <Button
          title="Save Changes"
          onPress={handleSave}
          loading={isLoading}
          style={styles.saveButton}
        />
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
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: Spacing.md,
    paddingBottom: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  sectionTitle: {
    fontSize: 16,
    fontFamily: Fonts.semiBold,
    color: Colors.text,
  },
  notificationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  notificationLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  notificationTextContainer: {
    marginLeft: Spacing.md,
    flex: 1,
  },
  notificationTitle: {
    fontSize: 14,
    fontFamily: Fonts.medium,
    color: Colors.text,
    marginBottom: 2,
  },
  notificationDescription: {
    fontSize: 12,
    fontFamily: Fonts.regular,
    color: Colors.textLight,
  },
  infoCard: {
    flexDirection: 'row',
    backgroundColor: Colors.primaryLight,
    padding: Spacing.md,
    marginHorizontal: Spacing.md,
    borderRadius: 8,
    marginBottom: Spacing.lg,
  },
  infoText: {
    flex: 1,
    fontSize: 12,
    fontFamily: Fonts.regular,
    color: Colors.text,
    marginLeft: Spacing.sm,
    lineHeight: 18,
  },
  saveButton: {
    marginHorizontal: Spacing.md,
  },
});

export default NotificationSettingsScreen;