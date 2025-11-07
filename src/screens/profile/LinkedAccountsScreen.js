import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Modal,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useNavigation } from '@react-navigation/native';
import { useForm, Controller } from 'react-hook-form';
import Toast from 'react-native-toast-message';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import { Colors } from '../../styles/colors';
import { Fonts } from '../../styles/fonts';
import { Spacing } from '../../styles/spacing';

const LinkedAccountsScreen = () => {
  const navigation = useNavigation();
  const [isLoading, setIsLoading] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [linkedAccounts, setLinkedAccounts] = useState([
    {
      id: 1,
      bankName: 'GTBank',
      accountNumber: '0123456789',
      accountName: 'John Doe',
      isPrimary: true,
    },
    {
      id: 2,
      bankName: 'Access Bank',
      accountNumber: '9876543210',
      accountName: 'John Doe',
      isPrimary: false,
    },
  ]);

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    defaultValues: {
      bankName: '',
      accountNumber: '',
    },
  });

  const onSubmitAddAccount = async (data) => {
    setIsLoading(true);
    
    setTimeout(() => {
      const newAccount = {
        id: linkedAccounts.length + 1,
        bankName: data.bankName,
        accountNumber: data.accountNumber,
        accountName: 'John Doe',
        isPrimary: false,
      };
      
      setLinkedAccounts([...linkedAccounts, newAccount]);
      setIsLoading(false);
      setShowAddModal(false);
      reset();
      
      Toast.show({
        type: 'success',
        text1: 'Account Linked',
        text2: 'Your bank account has been linked successfully',
      });
    }, 1500);
  };

  const handleRemoveAccount = (id) => {
    setLinkedAccounts(linkedAccounts.filter(acc => acc.id !== id));
    Toast.show({
      type: 'success',
      text1: 'Account Removed',
      text2: 'Linked account has been removed',
    });
  };

  const handleSetPrimary = (id) => {
    const updatedAccounts = linkedAccounts.map(acc => ({
      ...acc,
      isPrimary: acc.id === id,
    }));
    setLinkedAccounts(updatedAccounts);
    Toast.show({
      type: 'success',
      text1: 'Primary Account Updated',
      text2: 'This account is now your primary account',
    });
  };

  const renderAccountCard = (account) => (
    <View key={account.id} style={styles.accountCard}>
      <View style={styles.accountHeader}>
        <View style={styles.bankIcon}>
          <Icon name="account-balance" size={24} color={Colors.primary} />
        </View>
        <View style={styles.accountInfo}>
          <Text style={styles.bankName}>{account.bankName}</Text>
          <Text style={styles.accountNumber}>{account.accountNumber}</Text>
          <Text style={styles.accountName}>{account.accountName}</Text>
        </View>
        {account.isPrimary && (
          <View style={styles.primaryBadge}>
            <Text style={styles.primaryText}>Primary</Text>
          </View>
        )}
      </View>
      
      <View style={styles.accountActions}>
        {!account.isPrimary && (
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => handleSetPrimary(account.id)}>
            <Icon name="star" size={18} color={Colors.primary} />
            <Text style={styles.actionButtonText}>Set as Primary</Text>
          </TouchableOpacity>
        )}
        <TouchableOpacity
          style={[styles.actionButton, styles.removeButton]}
          onPress={() => handleRemoveAccount(account.id)}>
          <Icon name="delete" size={18} color={Colors.error} />
          <Text style={[styles.actionButtonText, styles.removeButtonText]}>Remove</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-back" size={24} color={Colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Linked Accounts</Text>
        <TouchableOpacity onPress={() => setShowAddModal(true)}>
          <Icon name="add" size={24} color={Colors.primary} />
        </TouchableOpacity>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>
        
        <View style={styles.infoCard}>
          <Icon name="info" size={24} color={Colors.primary} />
          <Text style={styles.infoText}>
            Link your other bank accounts for seamless transfers between accounts.
          </Text>
        </View>

        {linkedAccounts.length > 0 ? (
          <View style={styles.accountsList}>
            {linkedAccounts.map(renderAccountCard)}
          </View>
        ) : (
          <View style={styles.emptyState}>
            <Icon name="account-balance" size={64} color={Colors.textLight} />
            <Text style={styles.emptyStateTitle}>No Linked Accounts</Text>
            <Text style={styles.emptyStateText}>
              Add your bank accounts to transfer funds easily
            </Text>
            <Button
              title="Add Account"
              onPress={() => setShowAddModal(true)}
              style={styles.emptyStateButton}
            />
          </View>
        )}
      </ScrollView>

      {/* Add Account Modal */}
      <Modal
        visible={showAddModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowAddModal(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Add Bank Account</Text>
              <TouchableOpacity onPress={() => setShowAddModal(false)}>
                <Icon name="close" size={24} color={Colors.text} />
              </TouchableOpacity>
            </View>

            <Controller
              control={control}
              name="bankName"
              rules={{ required: 'Bank name is required' }}
              render={({ field: { onChange, onBlur, value } }) => (
                <Input
                  label="Bank Name"
                  placeholder="Select or enter bank name"
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  error={errors.bankName?.message}
                  leftIcon="account-balance"
                />
              )}
            />

            <Controller
              control={control}
              name="accountNumber"
              rules={{ 
                required: 'Account number is required',
                minLength: { value: 10, message: 'Account number must be 10 digits' }
              }}
              render={({ field: { onChange, onBlur, value } }) => (
                <Input
                  label="Account Number"
                  placeholder="Enter account number"
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  error={errors.accountNumber?.message}
                  keyboardType="numeric"
                  maxLength={10}
                  leftIcon="credit-card"
                />
              )}
            />

            <Button
              title="Link Account"
              onPress={handleSubmit(onSubmitAddAccount)}
              loading={isLoading}
              style={styles.modalButton}
            />
          </View>
        </View>
      </Modal>
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
    padding: Spacing.md,
    paddingBottom: Spacing.xl,
  },
  infoCard: {
    flexDirection: 'row',
    backgroundColor: Colors.primaryLight,
    padding: Spacing.md,
    borderRadius: 8,
    marginBottom: Spacing.lg,
  },
  infoText: {
    flex: 1,
    fontSize: 13,
    fontFamily: Fonts.regular,
    color: Colors.text,
    marginLeft: Spacing.sm,
    lineHeight: 20,
  },
  accountsList: {
    marginBottom: Spacing.lg,
  },
  accountCard: {
    backgroundColor: Colors.white,
    borderRadius: 12,
    padding: Spacing.lg,
    marginBottom: Spacing.md,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  accountHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  bankIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.md,
  },
  accountInfo: {
    flex: 1,
  },
  bankName: {
    fontSize: 16,
    fontFamily: Fonts.semiBold,
    color: Colors.text,
    marginBottom: 4,
  },
  accountNumber: {
    fontSize: 14,
    fontFamily: Fonts.medium,
    color: Colors.primary,
    marginBottom: 2,
  },
  accountName: {
    fontSize: 12,
    fontFamily: Fonts.regular,
    color: Colors.textLight,
  },
  primaryBadge: {
    backgroundColor: Colors.successLight,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 4,
    borderRadius: 12,
  },
  primaryText: {
    fontSize: 12,
    fontFamily: Fonts.semiBold,
    color: Colors.success,
  },
  accountActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    paddingTop: Spacing.md,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    marginLeft: Spacing.sm,
  },
  actionButtonText: {
    fontSize: 12,
    fontFamily: Fonts.medium,
    color: Colors.primary,
    marginLeft: 4,
  },
  removeButton: {
    borderLeftWidth: 1,
    borderLeftColor: Colors.border,
  },
  removeButtonText: {
    color: Colors.error,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: Spacing.xl * 2,
  },
  emptyStateTitle: {
    fontSize: 20,
    fontFamily: Fonts.semiBold,
    color: Colors.text,
    marginTop: Spacing.lg,
    marginBottom: Spacing.xs,
  },
  emptyStateText: {
    fontSize: 14,
    fontFamily: Fonts.regular,
    color: Colors.textLight,
    textAlign: 'center',
    marginBottom: Spacing.xl,
  },
  emptyStateButton: {
    minWidth: 200,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: Colors.white,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: Spacing.lg,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: Spacing.lg,
  },
  modalTitle: {
    fontSize: 18,
    fontFamily: Fonts.semiBold,
    color: Colors.text,
  },
  modalButton: {
    marginTop: Spacing.md,
  },
});

export default LinkedAccountsScreen;