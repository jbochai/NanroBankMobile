import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Share,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import moment from 'moment';
import Toast from 'react-native-toast-message';

import Header from '../../components/common/Header';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Alert from '../../components/common/Alert';
import { formatCurrency } from '../../utils/formatting';
import { Colors } from '../../styles/colors';
import { Fonts } from '../../styles/fonts';
import { Spacing, BorderRadius } from '../../styles/spacing';

const TransactionDetailScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  
  const { transaction } = route.params || {};
  
  const [showReportDialog, setShowReportDialog] = useState(false);

  if (!transaction) {
    return (
      <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
        <Header title="Transaction Details" showBack={true} />
        <View style={styles.errorState}>
          <Icon name="error-outline" size={80} color={Colors.error} />
          <Text style={styles.errorText}>Transaction not found</Text>
          <Button
            title="Go Back"
            onPress={() => navigation.goBack()}
            style={styles.errorButton}
          />
        </View>
      </SafeAreaView>
    );
  }

  const isCredit = transaction.type === 'credit' || transaction.type === 'deposit';

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'success':
      case 'completed':
        return Colors.success;
      case 'pending':
        return Colors.warning;
      case 'failed':
        return Colors.error;
      default:
        return Colors.textLight;
    }
  };

  const getStatusIcon = (status) => {
    switch (status.toLowerCase()) {
      case 'success':
      case 'completed':
        return 'check-circle';
      case 'pending':
        return 'schedule';
      case 'failed':
        return 'cancel';
      default:
        return 'info';
    }
  };

  const handleShare = async () => {
    try {
      const message = `
Transaction Receipt
-------------------
Reference: ${transaction.reference}
Amount: ${formatCurrency(transaction.amount)}
Type: ${transaction.type}
Status: ${transaction.status}
Date: ${moment(transaction.created_at).format('MMM DD, YYYY h:mm A')}
Narration: ${transaction.narration || 'N/A'}
      `.trim();

      await Share.share({
        message,
        title: 'Transaction Receipt',
      });
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Failed to share receipt',
      });
    }
  };

  const handleDownloadReceipt = () => {
    Toast.show({
      type: 'success',
      text1: 'Receipt Downloaded',
      text2: 'Receipt saved to your downloads',
    });
  };

  const handleReportTransaction = async () => {
    setShowReportDialog(false);
    
    try {
      // Report transaction API call
      Toast.show({
        type: 'success',
        text1: 'Report Submitted',
        text2: 'We will investigate this transaction',
      });
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Failed to submit report',
      });
    }
  };

  const transactionDetails = [
    {
      label: 'Transaction Type',
      value: transaction.type?.replace('_', ' ').toUpperCase(),
      icon: 'category',
    },
    {
      label: 'Amount',
      value: formatCurrency(transaction.amount),
      icon: 'payments',
      color: isCredit ? Colors.success : Colors.error,
    },
    {
      label: 'Reference Number',
      value: transaction.reference,
      icon: 'tag',
      copyable: true,
    },
    {
      label: 'Date & Time',
      value: moment(transaction.created_at).format('MMMM DD, YYYY • h:mm A'),
      icon: 'schedule',
    },
    {
      label: 'Status',
      value: transaction.status,
      icon: 'info',
      color: getStatusColor(transaction.status),
    },
  ];

  const additionalDetails = [
    transaction.recipient_name && {
      label: isCredit ? 'Sender' : 'Recipient',
      value: transaction.recipient_name,
      icon: 'person',
    },
    transaction.recipient_account && {
      label: 'Account Number',
      value: transaction.recipient_account,
      icon: 'account-balance',
    },
    transaction.recipient_bank && {
      label: 'Bank',
      value: transaction.recipient_bank,
      icon: 'account-balance',
    },
    transaction.narration && {
      label: 'Narration',
      value: transaction.narration,
      icon: 'description',
    },
    transaction.session_id && {
      label: 'Session ID',
      value: transaction.session_id,
      icon: 'vpn-key',
      copyable: true,
    },
  ].filter(Boolean);

  const handleCopy = (text) => {
    // Copy to clipboard logic
    Toast.show({
      type: 'success',
      text1: 'Copied',
      text2: 'Text copied to clipboard',
    });
  };

  const renderDetailRow = (detail) => (
    <View key={detail.label} style={styles.detailRow}>
      <View style={styles.detailLeft}>
        <Icon name={detail.icon} size={20} color={Colors.textLight} />
        <Text style={styles.detailLabel}>{detail.label}</Text>
      </View>
      <View style={styles.detailRight}>
        <Text style={[styles.detailValue, detail.color && { color: detail.color }]}>
          {detail.value}
        </Text>
        {detail.copyable && (
          <TouchableOpacity
            onPress={() => handleCopy(detail.value)}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
            <Icon name="content-copy" size={18} color={Colors.primary} />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <Header
        title="Transaction Details"
        showBack={true}
        rightComponent={
          <TouchableOpacity onPress={handleShare}>
            <Icon name="share" size={24} color={Colors.primary} />
          </TouchableOpacity>
        }
      />

      <ScrollView style={styles.scrollView}>
        {/* Status Card */}
        <Card style={styles.statusCard}>
          <View
            style={[
              styles.statusIconContainer,
              { backgroundColor: `${getStatusColor(transaction.status)}20` },
            ]}>
            <Icon
              name={getStatusIcon(transaction.status)}
              size={48}
              color={getStatusColor(transaction.status)}
            />
          </View>
          <Text style={styles.statusTitle}>
            Transaction {transaction.status}
          </Text>
          <Text style={styles.amountLarge}>
            {isCredit ? '+' : '-'}{formatCurrency(transaction.amount)}
          </Text>
        </Card>

        {/* Transaction Details */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Transaction Information</Text>
          <Card style={styles.detailsCard}>
            {transactionDetails.map(renderDetailRow)}
          </Card>
        </View>

        {/* Additional Details */}
        {additionalDetails.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Additional Information</Text>
            <Card style={styles.detailsCard}>
              {additionalDetails.map(renderDetailRow)}
            </Card>
          </View>
        )}

        {/* Actions */}
        <View style={styles.actionsSection}>
          <Button
            title="Download Receipt"
            onPress={handleDownloadReceipt}
            icon="download"
            gradient
            style={styles.actionButton}
          />

          {transaction.status.toLowerCase() === 'success' && (
            <Button
              title="Repeat Transaction"
              onPress={() => {
                if (transaction.type === 'transfer') {
                  navigation.navigate('Transfer', {
                    recipientAccount: transaction.recipient_account,
                    recipientName: transaction.recipient_name,
                  });
                }
              }}
              variant="outline"
              icon="repeat"
              style={styles.actionButton}
            />
          )}

          <Button
            title="Report Issue"
            onPress={() => setShowReportDialog(true)}
            variant="ghost"
            icon="report-problem"
            style={styles.actionButton}
            textStyle={styles.reportButtonText}
          />
        </View>

        {/* Help Text */}
        <Card style={styles.helpCard}>
          <Icon name="help-outline" size={20} color={Colors.info} />
          <Text style={styles.helpText}>
            Need help with this transaction? Contact our support team at
            support@nanrobank.com or call 0800-NANRO-BANK
          </Text>
        </Card>
      </ScrollView>

      {/* Report Dialog */}
      <Alert
        visible={showReportDialog}
        type="warning"
        title="Report Transaction"
        message="Are you sure you want to report an issue with this transaction? Our team will investigate and get back to you."
        confirmText="Report"
        cancelText="Cancel"
        showCancel={true}
        onConfirm={handleReportTransaction}
        onClose={() => setShowReportDialog(false)}
      />
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
  statusCard: {
    margin: Spacing.lg,
    padding: Spacing.xl,
    alignItems: 'center',
  },
  statusIconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  statusTitle: {
    fontSize: 18,
    fontFamily: Fonts.semiBold,
    color: Colors.text,
    marginBottom: Spacing.sm,
    textTransform: 'capitalize',
  },
  amountLarge: {
    fontSize: 32,
    fontFamily: Fonts.bold,
    color: Colors.text,
  },
  section: {
    marginBottom: Spacing.lg,
    paddingHorizontal: Spacing.lg,
  },
  sectionTitle: {
    fontSize: 16,
    fontFamily: Fonts.semiBold,
    color: Colors.text,
    marginBottom: Spacing.md,
  },
  detailsCard: {
    padding: Spacing.md,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: Spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
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
  detailRight: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    justifyContent: 'flex-end',
    gap: Spacing.sm,
  },
  detailValue: {
    fontSize: 14,
    fontFamily: Fonts.medium,
    color: Colors.text,
    textAlign: 'right',
  },
  actionsSection: {
    paddingHorizontal: Spacing.lg,
    marginBottom: Spacing.lg,
  },
  actionButton: {
    marginBottom: Spacing.md,
  },
  reportButtonText: {
    color: Colors.error,
  },
  helpCard: {
    flexDirection: 'row',
    margin: Spacing.lg,
    padding: Spacing.md,
    backgroundColor: Colors.infoLight,
    gap: Spacing.sm,
  },
  helpText: {
    flex: 1,
    fontSize: 12,
    fontFamily: Fonts.regular,
    color: Colors.info,
    lineHeight: 18,
  },
  errorState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: Spacing.xl,
  },
  errorText: {
    fontSize: 18,
    fontFamily: Fonts.semiBold,
    color: Colors.error,
    marginTop: Spacing.lg,
    marginBottom: Spacing.xl,
  },
  errorButton: {
    minWidth: 150,
  },
});

export default TransactionDetailScreen;
