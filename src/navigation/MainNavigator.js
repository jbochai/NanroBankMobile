import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

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

// Import new screens
import AllServicesScreen from '../screens/services/AllServicesScreen';
import BillPaymentDetailScreen from '../screens/bills/BillPaymentDetailScreen';
import LoansScreen from '../screens/loans/LoansScreen';
import PersonalInfoScreen from '../screens/profile/PersonalInfoScreen';
import SecuritySettingsScreen from '../screens/profile/SecuritySettingsScreen';
import ChangePasswordScreen from '../screens/profile/ChangePasswordScreen';
import ChangePinScreen from '../screens/profile/ChangePinScreen';
import TransactionLimitsScreen from '../screens/profile/TransactionLimitsScreen';
import NotificationSettingsScreen from '../screens/profile/NotificationSettingsScreen';
import LinkedAccountsScreen from '../screens/profile/LinkedAccountsScreen';
import NotificationsScreen from '../screens/notifications/NotificationsScreen';
import QRScannerScreen from '../screens/qr/QRScannerScreen';
import InvestmentsScreen from '../screens/investments/InvestmentsScreen';
import SavingsScreen from '../screens/savings/SavingsScreen';
import ReferFriendScreen from '../screens/referral/ReferFriendScreen';
import AccountStatementScreen from '../screens/statements/AccountStatementScreen';
import StatementsScreen from '../screens/statements/StatementsScreen';
import RewardsScreen from '../screens/rewards/RewardsScreen';
import SupportScreen from '../screens/support/SupportScreen';
import AboutScreen from '../screens/about/AboutScreen';
import RequestCardScreen from '../screens/cards/RequestCardScreen';
import AnnouncementDetailScreen from '../screens/announcements/AnnouncementDetailScreen';
import TransferSuccessScreen  from '../screens/transfer/TransferSuccessScreen';
import SetupPinScreen from '../screens/profile/SetupPinScreen';
import KYCScreen from '../screens/kyc/KYCScreen';


// Import placeholder component
import PlaceholderScreen from '../components/common/PlaceholderScreen';

// Create placeholder screens with custom titles
const ServicesScreen = () => <PlaceholderScreen title="Services" />;

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
      
      {/* Transfer & Payment Screens */}
      <Stack.Screen name="Transfer" component={TransferScreen} />
      <Stack.Screen name="TransferConfirm" component={TransferConfirmScreen} />
      <Stack.Screen name="Beneficiaries" component={BeneficiariesScreen} />
      <Stack.Screen name="BillPayment" component={BillPaymentScreen} />
      <Stack.Screen name="BillPaymentDetail" component={BillPaymentDetailScreen} />
      <Stack.Screen name="Airtime" component={AirtimeScreen} />
      <Stack.Screen name="Data" component={DataScreen} />
      
      {/* Transaction Screens */}
      <Stack.Screen name="TransactionDetail" component={TransactionDetailScreen} />
      
      {/* Profile & Settings Screens */}
      <Stack.Screen name="Settings" component={SettingsScreen} />
      <Stack.Screen name="PersonalInfo" component={PersonalInfoScreen} />
      <Stack.Screen name="SecuritySettings" component={SecuritySettingsScreen} />
      <Stack.Screen name="ChangePassword" component={ChangePasswordScreen} />
      <Stack.Screen name="ChangePin" component={ChangePinScreen} />
      <Stack.Screen name="TransactionLimits" component={TransactionLimitsScreen} />
      <Stack.Screen name="NotificationSettings" component={NotificationSettingsScreen} />
      <Stack.Screen name="LinkedAccounts" component={LinkedAccountsScreen} />
      
      {/* Service Screens */}
      <Stack.Screen name="AllServices" component={AllServicesScreen} />
      <Stack.Screen name="Services" component={ServicesScreen} />
      <Stack.Screen name="Notifications" component={NotificationsScreen} />
      <Stack.Screen name="QRScanner" component={QRScannerScreen} />
      
      {/* Financial Screens */}
      <Stack.Screen name="Investments" component={InvestmentsScreen} />
      <Stack.Screen name="Savings" component={SavingsScreen} />
      <Stack.Screen name="Loans" component={LoansScreen} />
      <Stack.Screen name="Rewards" component={RewardsScreen} />
      
      {/* Other Screens */}
      <Stack.Screen name="ReferFriend" component={ReferFriendScreen} />
      <Stack.Screen name="AccountStatement" component={AccountStatementScreen} />
      <Stack.Screen name="Statements" component={StatementsScreen} />
      <Stack.Screen name="Support" component={SupportScreen} />
      <Stack.Screen name="About" component={AboutScreen} />
      <Stack.Screen name="RequestCard" component={RequestCardScreen} />
      <Stack.Screen name="AnnouncementDetail" component={AnnouncementDetailScreen} />
      <Stack.Screen name="SetupPin" component={SetupPinScreen} options={{ headerShown: false }}/>
      <Stack.Screen name="KYC" component={KYCScreen} options={{ headerShown: false }}/>
      <Stack.Screen name="TransferSuccess"   component={TransferSuccessScreen}  options={{ headerShown: false }}/>
    </Stack.Navigator>
  );
};

export default MainNavigator;