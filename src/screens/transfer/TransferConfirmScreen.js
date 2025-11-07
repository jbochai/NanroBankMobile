import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Toast from 'react-native-toast-message';

import Header from '../../components/common/Header';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import PinInput from '../../components/forms/PinInput';
import Loader from '../../components/common/Loader';
import Alert from '../../components/common/Alert';
import { initiateTransfer } from '../../store/transfer/transferSlice';
import { selectBalance } from '../../store/account/accountSlice';
import { formatCurrency } from '../../utils/formatting';
import { authenticateWithBiometric } from '../../utils/biometric';
import { Colors } from '../../styles/colors';
import { Fonts } from '../../styles/fonts';
import { Spacing, BorderRadius } from '../../styles/spacing';

const TransferConfirmScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const dispatch = useDispatch();
  
  const balance = useSelector(selectBalance);
  
  const {
    accountNumber,
    accountName,
    bankName,
    bankCode,
    amount,
    narration,
    transferType,
  } = route.params || {};

  const [pin, setPin] = useState('');
  const [loading, setLoading] = useState(false);
  const [useBiometric, setUseBiometric] = useState(false);
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const [transactionReference, setTransactionReference] = useState('');

  const transferDetails = [
    {
      label: 'Recipient Name',
      value: accountName,
      icon: 'person',
    },
    {
      label: 'Account Number',
      value: accountNumber,
      icon: 'account-balance',
    },
    {
      label: 'Bank',
      value: bankName,
      icon: 'account-balance',
    },
    {
      label: 'Amount',
      value: formatCurrency(parseFloat(amount)),
      icon: 'payments',
      highlight: true,
    },
    narration && {
      label: 'Narration',
      value: narration,
      icon: 'description',
    },
  ].filter(Boolean);

  const handleBiometricAuth = async () => {
    const result = await authenticateWithBiometric();
    
    if (result.success) {
      handleTransfer(null, true);
    } else {
      Toast.show({
        type: 'error',
        text1: 'Authentication Failed',
        text2: result.error || 'Biometric authentication failed',
      });
    }
  };

  const handleTransfer = async (transactionPin = pin, isBiometric = false) => {
    if (!isBiometric && transactionPin.length !== 4) {
      Toast.show({
        type: 'error',
        text1: 'Invalid PIN',
        text2: 'Please enter your 4-digit transaction PIN',
      });
      return;
    }

    const amountNum = parseFloat(amount);
    if (amountNum > balance) {
      Toast.show({
        type: 'error',
        text1: 'Insufficient Balance',
        text2: 'You do not have enough funds for this transfer',
      });
      return;
    }

    setLoading(true);

    try {
      const transferData = {
        recipient_account: accountNumber,
        recipient_name: accountName,
        bank_code: bankCode,
        amount: amountNum,
        narration: narration || 'Transfer',
        transaction_pin: isBiometric ? undefined : transactionPin,
        use_biometric: isBiometric,
        transfer_type: transferType,
      };

      const result = await dispatch(initiateTransfer(transferData)).unwrap();
      
      setTransactionReference(result.reference || 'N/A');
      setShowSuccessDialog(true);
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Transfer Failed',
        text2: error.message || 'Failed to complete transfer',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSuccessClose = () => {
    setShowSuccessDialog(false);
    navigation.navigate('Dashboard');
  };

  const handleViewReceipt = () => {
    setShowSuccessDialog(false);
    navigation.navigate('TransactionDetail', {
      transaction: {
        reference: transactionReference,
        amount: parseFloat(amount),
        type: 'transfer',
        status: 'success',
        recipient_name: accountName,
        recipient_account: accountNumber,
        recipient_bank: bankName,
        narration: narration || 'Transfer',
        created_at: new Date().toISOString(),
      },
    });
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <Header title="Confirm Transfer" showBack={true} />

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}>
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled">
          
          {/* Transfer Summary */}
          <View style={styles.summarySection}>
            <Text style={styles.sectionTitle}>Transfer Summary</Text>
            <Card style={styles.summaryCard}>
              {transferDetails.map((detail, index) => (
                <View key={detail.label}>
                  <View style={styles.detailRow}>
                    <View style={styles.detailLeft}>
                      <Icon name={detail.icon} size={20} color={Colors.textLight} />
                      <Text style={styles.detailLabel}>{detail.label}</Text>
                    </View>
                    <Text
                      style={[
                        styles.detailValue,
                        detail.highlight && styles.detailValueHighlight,
                      ]}>
                      {detail.value}
                    </Text>
                  </View>
                  {index < transferDetails.length - 1 && <View style={styles.divider} />}
                </View>
              ))}
            </Card>
          </View>

          {/* Warning Card */}
          <Card style={styles.warningCard}>
            <Icon name="warning" size={20} color={Colors.warning} />
            <Text style={styles.warningText}>
              Please verify all details before confirming. Transfers cannot be reversed.
            </Text>
          </Card>

          {/* Authentication Section */}
          <View style={styles.authSection}>
            <Text style={styles.sectionTitle}>Authenticate Transaction</Text>
            
            <View style={styles.pinSection}>
              <Text style={styles.pinLabel}>Enter Transaction PIN</Text>
              <PinInput
                length={4}
                value={pin}
                onChangeText={setPin}
                onComplete={(value) => setPin(value)}
                secureTextEntry={true}
              />
            </View>

            <Button
              title="Confirm Transfer"
              onPress={() => handleTransfer()}
              loading={loading}
              disabled={pin.length !== 4}
              gradient
              size="large"
              style={styles.confirmButton}
            />

            <View style={styles.dividerContainer}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>OR</Text>
              <View style={styles.dividerLine} />
            </View>

            <Button
              title="Use Biometric Authentication"
              onPress={handleBiometricAuth}
              variant="outline"
              icon="fingerprint"
              size="large"
              disabled={loading}
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Success Dialog */}
      <Alert
        visible={showSuccessDialog}
        type="success"
        title="Transfer Successful!"
        message={`Your transfer of ${formatCurrency(parseFloat(amount))} to ${accountName} was successful.\n\nReference: ${transactionReference}`}
        confirmText="View Receipt"
        cancelText="Done"
        showCancel={true}
        onConfirm={handleViewReceipt}
        onClose={handleSuccessClose}
      />

      <Loader visible={loading} />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  keyboardView: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    padding: Spacing.lg,
  },
  summarySection: {
    marginBottom: Spacing.lg,
  },
  sectionTitle: {
    fontSize: 16,
    fontFamily: Fonts.semiBold,
    color: Colors.text,
    marginBottom: Spacing.md,
  },
  summaryCard: {
    padding: Spacing.md,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: Spacing.sm,
  },
  detailLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: Spacing.sm,
  },
  detailLabel: {
    fontSize: 14,
    fontFamily: Fonts.regular,
    color: Colors.textLight,
  },
  detailValue: {
    fontSize: 14,
    fontFamily: Fonts.medium,
    color: Colors.text,
    textAlign: 'right',
    flex: 1,
  },
  detailValueHighlight: {
    fontSize: 18,
    fontFamily: Fonts.bold,
    color: Colors.primary,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.border,
  },
  warningCard: {
    flexDirection: 'row',
    padding: Spacing.md,
    backgroundColor: Colors.warningLight,
    marginBottom: Spacing.lg,
    gap: Spacing.sm,
  },
  warningText: {
    flex: 1,
    fontSize: 13,
    fontFamily: Fonts.regular,
    color: Colors.warning,
    lineHeight: 18,
  },
  authSection: {
    marginBottom: Spacing.xl,
  },
  pinSection: {
    marginBottom: Spacing.lg,
  },
  pinLabel: {
    fontSize: 14,
    fontFamily: Fonts.medium,
    color: Colors.text,
    marginBottom: Spacing.md,
    textAlign: 'center',
  },
  confirmButton: {
    marginBottom: Spacing.lg,
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: Spacing.lg,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: Colors.border,
  },
  dividerText: {
    fontSize: 12,
    fontFamily: Fonts.medium,
    color: Colors.textLight,
    marginHorizontal: Spacing.md,
  },
});

export default TransferConfirmScreen;
