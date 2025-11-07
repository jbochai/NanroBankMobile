import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { Alert } from 'react-native';

// Import navigators
import TabNavigator from './TabNavigator';

// Import existing screens
import TransferScreen from '../screens/transfer/TransferScreen';
import TransferConfirmScreen from '../screens/transfer/TransferConfirmScreen';
import BeneficiariesScreen from '../screens/transfer/BeneficiariesScreen';
import BillPaymentScreen from '../screens/bills/BillPaymentScreen';
import AirtimeScreen from '../screens/bills/AirtimeScreen';
import DataScreen from '../screens/bills/DataScreen';
import TransactionDetailScreen from '../screens/transactions/TransactionDetailScreen';
import SettingsScreen from '../screens/profile/SettingsScreen';

// Import placeholder component
import PlaceholderScreen from '../components/common/PlaceholderScreen';

// Create placeholder screens with custom titles
const ServicesScreen = () => <PlaceholderScreen title="Services" />;
const NotificationsScreen = () => <PlaceholderScreen title="Notifications" />;
const QRScannerScreen = () => <PlaceholderScreen title="QR Scanner" />;
const InvestmentsScreen = () => <PlaceholderScreen title="Investments" />;
const SavingsScreen = () => <PlaceholderScreen title="Savings" />;
const PersonalInfoScreen = () => <PlaceholderScreen title="Personal Info" />;
const SecuritySettingsScreen = () => <PlaceholderScreen title="Security Settings" />;
const ChangePasswordScreen = () => <PlaceholderScreen title="Change Password" />;
const ChangePinScreen = () => <PlaceholderScreen title="Change PIN" />;
const ReferFriendScreen = () => <PlaceholderScreen title="Refer a Friend" />;
const AccountStatementScreen = () => <PlaceholderScreen title="Account Statement" />;
const StatementsScreen = () => <PlaceholderScreen title="Statements" />;
const RewardsScreen = () => <PlaceholderScreen title="Rewards" />;
const LinkedAccountsScreen = () => <PlaceholderScreen title="Linked Accounts" />;
const TransactionLimitsScreen = () => <PlaceholderScreen title="Transaction Limits" />;
const NotificationSettingsScreen = () => <PlaceholderScreen title="Notification Settings" />;
const SupportScreen = () => <PlaceholderScreen title="Support" />;
const AboutScreen = () => <PlaceholderScreen title="About" />;
const RequestCardScreen = () => <PlaceholderScreen title="Request Card" />;
const AnnouncementDetailScreen = () => <PlaceholderScreen title="Announcement" />;
const AllServicesScreen = () => <PlaceholderScreen title="All Services" />;
const BillPaymentDetailScreen = () => <PlaceholderScreen title="Bill Payment" />;
const LoansScreen = () => <PlaceholderScreen title="Loans" />;

const Stack = createStackNavigator();

const MainNavigator = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        cardStyleInterpolator: ({ current, layouts }) => {
          return {
            cardStyle: {
              transform: [
                {
                  translateX: current.progress.interpolate({
                    inputRange: [0, 1],
                    outputRange: [layouts.screen.width, 0],
                  }),
                },
              ],
            },
          };
        },
      }}>
      <Stack.Screen name="HomeTabs" component={TabNavigator} />
      
      {/* Existing Screens */}
      <Stack.Screen name="Transfer" component={TransferScreen} />
      <Stack.Screen name="TransferConfirm" component={TransferConfirmScreen} />
      <Stack.Screen name="Beneficiaries" component={BeneficiariesScreen} />
      <Stack.Screen name="BillPayment" component={BillPaymentScreen} />
      <Stack.Screen name="Airtime" component={AirtimeScreen} />
      <Stack.Screen name="Data" component={DataScreen} />
      <Stack.Screen name="TransactionDetail" component={TransactionDetailScreen} />
      <Stack.Screen name="Settings" component={SettingsScreen} />
      
      {/* Placeholder Screens */}
      <Stack.Screen name="Services" component={ServicesScreen} />
      <Stack.Screen name="Notifications" component={NotificationsScreen} />
      <Stack.Screen name="QRScanner" component={QRScannerScreen} />
      <Stack.Screen name="Investments" component={InvestmentsScreen} />
      <Stack.Screen name="Savings" component={SavingsScreen} />
      <Stack.Screen name="PersonalInfo" component={PersonalInfoScreen} />
      <Stack.Screen name="SecuritySettings" component={SecuritySettingsScreen} />
      <Stack.Screen name="ChangePassword" component={ChangePasswordScreen} />
      <Stack.Screen name="ChangePin" component={ChangePinScreen} />
      <Stack.Screen name="ReferFriend" component={ReferFriendScreen} />
      <Stack.Screen name="AccountStatement" component={AccountStatementScreen} />
      <Stack.Screen name="Statements" component={StatementsScreen} />
      <Stack.Screen name="Rewards" component={RewardsScreen} />
      <Stack.Screen name="LinkedAccounts" component={LinkedAccountsScreen} />
      <Stack.Screen name="TransactionLimits" component={TransactionLimitsScreen} />
      <Stack.Screen name="NotificationSettings" component={NotificationSettingsScreen} />
      <Stack.Screen name="Support" component={SupportScreen} />
      <Stack.Screen name="About" component={AboutScreen} />
      <Stack.Screen name="RequestCard" component={RequestCardScreen} />
      <Stack.Screen name="AnnouncementDetail" component={AnnouncementDetailScreen} />
      <Stack.Screen name="AllServices" component={AllServicesScreen} />
      <Stack.Screen name="BillPaymentDetail" component={BillPaymentDetailScreen} />
      <Stack.Screen name="Loans" component={LoansScreen} />
    </Stack.Navigator>
  );
};

export default MainNavigator;