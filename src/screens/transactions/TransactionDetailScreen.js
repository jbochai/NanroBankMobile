import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import moment from 'moment';
import Toast from 'react-native-toast-message';
import Clipboard from '@react-native-clipboard/clipboard';

import Header from '../../components/common/Header';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Alert from '../../components/common/Alert';
import DownloadOptionsModal from '../../components/transactions/DownloadOptionsModal';
import ReceiptGenerator from '../../services/ReceiptGenerator';
import { formatCurrency } from '../../utils/formatting';
import { Colors } from '../../styles/colors';
import { Fonts } from '../../styles/fonts';
import { Spacing, BorderRadius } from '../../styles/spacing';

const TransactionDetailScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  
  const { transaction } = route.params || {};
  
  const [showReportDialog, setShowReportDialog] = useState(false);
  const [showDownloadOptions, setShowDownloadOptions] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [isSharing, setIsSharing] = useState(false);

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
    switch (status?.toLowerCase()) {
      case 'success':
      case 'completed':
        return Colors.success;
      case 'pending':
      case 'processing':
        return Colors.warning;
      case 'failed':
        return Colors.error;
      case 'reversed':
        return Colors.info;
      default:
        return Colors.textLight;
    }
  };

  const getStatusIcon = (status) => {
    switch (status?.toLowerCase()) {
      case 'success':
      case 'completed':
        return 'check-circle';
      case 'pending':
      case 'processing':
        return 'schedule';
      case 'failed':
        return 'cancel';
      case 'reversed':
        return 'undo';
      default:
        return 'info';
    }
  };

  const handleCopy = (text, label) => {
    Clipboard.setString(text);
    Toast.show({
      type: 'success',
      text1: 'Copied',
      text2: `${label} copied to clipboard`,
    });
  };

  const handleShare = async () => {
    setIsSharing(true);
    try {
      const result = await ReceiptGenerator.shareAsText(transaction);
      
      if (!result.success && result.error) {
        throw new Error(result.error);
      }
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Failed to share receipt',
      });
    } finally {
      setIsSharing(false);
    }
  };

  const handleDownloadReceipt = () => {
    setShowDownloadOptions(true);
  };

  const handleDownloadPDF = async () => {
    setIsDownloading(true);
    
    try {
      const result = await ReceiptGenerator.generateAndDownloadPDF(transaction, null);
      
      if (result.success) {
        const folderName = Platform.OS === 'ios' ? 'Documents' : 'Downloads';
        Toast.show({
          type: 'success',
          text1: 'PDF Downloaded',
          text2: `Receipt saved to ${folderName} folder as ${result.fileName}`,
          visibilityTime: 5000,
        });
      } else {
        throw new Error(result.error || 'Failed to download PDF');
      }
    } catch (error) {
      console.error('Download PDF Error:', error);
      Toast.show({
        type: 'error',
        text1: 'Download Failed',
        text2: error.message || 'Failed to download PDF receipt. Please try again.',
        visibilityTime: 4000,
      });
    } finally {
      setIsDownloading(false);
    }
  };

  const handleSharePDF = async () => {
    setIsSharing(true);
    
    try {
      const result = await ReceiptGenerator.sharePDF(transaction, null);
      
      if (!result.success && result.error) {
        throw new Error(result.error);
      }
      
      // Success - user shared or cancelled
      Toast.show({
        type: 'success',
        text1: 'Share Complete',
        text2: 'Receipt shared successfully',
        visibilityTime: 2000,
      });
    } catch (error) {
      console.error('Share PDF Error:', error);
      Toast.show({
        type: 'error',
        text1: 'Share Failed',
        text2: error.message || 'Failed to share PDF receipt. Please try again.',
        visibilityTime: 4000,
      });
    } finally {
      setIsSharing(false);
    }
  };

  const handleShareText = async () => {
    await handleShare();
  };

  const handleReportTransaction = async () => {
    setShowReportDialog(false);
    
    try {
      // Report transaction API call would go here
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
    ...(transaction.fee && parseFloat(transaction.fee) > 0
      ? [
          {
            label: 'Transaction Fee',
            value: formatCurrency(transaction.fee),
            icon: 'account-balance-wallet',
          },
        ]
      : []),
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
    transaction.recipient_account_name && {
      label: isCredit ? 'Sender' : 'Recipient',
      value: transaction.recipient_account_name,
      icon: 'person',
    },
    transaction.recipient_account_number && {
      label: 'Account Number',
      value: transaction.recipient_account_number,
      icon: 'account-balance',
      copyable: true,
    },
    transaction.recipient_bank_name && {
      label: 'Bank',
      value: transaction.recipient_bank_name,
      icon: 'account-balance',
    },
    transaction.description && {
      label: 'Description',
      value: transaction.description,
      icon: 'description',
    },
    transaction.session_id && {
      label: 'Session ID',
      value: transaction.session_id,
      icon: 'vpn-key',
      copyable: true,
    },
  ].filter(Boolean);

  const renderDetailRow = (detail, index) => (
    <View key={index} style={styles.detailRow}>
      <View style={styles.detailLeft}>
        <Icon name={detail.icon} size={20} color={Colors.textLight} />
        <Text style={styles.detailLabel}>{detail.label}</Text>
      </View>
      <View style={styles.detailRight}>
        <Text
          style={[
            styles.detailValue,
            detail.color && { color: detail.color },
            detail.label === 'Status' && styles.statusText,
          ]}
          numberOfLines={2}>
          {detail.value}
        </Text>
        {detail.copyable && (
          <TouchableOpacity
            onPress={() => handleCopy(detail.value, detail.label)}
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
          <TouchableOpacity
            onPress={handleShare}
            disabled={isSharing}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
            {isSharing ? (
              <ActivityIndicator size="small" color={Colors.primary} />
            ) : (
              <Icon name="share" size={24} color={Colors.primary} />
            )}
          </TouchableOpacity>
        }
      />

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Status Card */}
        <Card style={styles.statusCard}>
          <View
            style={[
              styles.statusIconContainer,
              { backgroundColor: `${getStatusColor(transaction.status)}15` },
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
            {isCredit ? '+' : '-'}
            {formatCurrency(transaction.amount)}
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
            title={isDownloading ? 'Downloading...' : 'Download Receipt'}
            onPress={handleDownloadReceipt}
            icon="download"
            gradient
            disabled={isDownloading}
            loading={isDownloading}
            style={styles.actionButton}
          />

          {transaction.status?.toLowerCase() === 'completed' && (
            <Button
              title="Repeat Transaction"
              onPress={() => {
                if (transaction.type === 'transfer') {
                  navigation.navigate('Transfer', {
                    recipientAccount: transaction.recipient_account_number,
                    recipientName: transaction.recipient_account_name,
                    recipientBank: transaction.recipient_bank_name,
                    recipientBankCode: transaction.recipient_bank_code,
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
      </ScrollView>

      {/* Download Options Modal */}
      <DownloadOptionsModal
        visible={showDownloadOptions}
        onClose={() => setShowDownloadOptions(false)}
        onDownloadPDF={handleDownloadPDF}
        onSharePDF={handleSharePDF}
        onShareText={handleShareText}
        isLoading={isDownloading || isSharing}
      />

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
    paddingVertical: Spacing.md,
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
    flexShrink: 1,
  },
  statusText: {
    textTransform: 'capitalize',
  },
  actionsSection: {
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.xl,
    marginTop: Spacing.md,
  },
  actionButton: {
    marginBottom: Spacing.md,
  },
  reportButtonText: {
    color: Colors.error,
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