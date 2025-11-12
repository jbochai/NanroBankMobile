import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  Modal,
  FlatList,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import * as Animatable from 'react-native-animatable';
import Toast from 'react-native-toast-message';

import {
  verifyAccount,
  intraBankTransfer,
  interBankTransfer,
  fetchBeneficiaries,
  fetchBankList,
  selectBeneficiaries,
  selectBanks,
  selectVerifiedAccount,
  selectTransferLoading,
  clearVerifiedAccount,
} from '../../store/transfer/transferSlice';
import { selectBalance } from '../../store/account/accountSlice';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import { Colors } from '../../styles/colors';
import { Fonts, Typography } from '../../styles/fonts';
import { Spacing, BorderRadius, Shadows } from '../../styles/spacing';
import { formatCurrency, parseAmount, formatAccountNumber } from '../../utils/formatting';

const TransferScreen = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  
  const beneficiaries = useSelector(selectBeneficiaries);
  const banks = useSelector(selectBanks);
  const verifiedAccount = useSelector(selectVerifiedAccount);
  const isLoading = useSelector(selectTransferLoading);
  const balance = useSelector(selectBalance);

  const [transferType, setTransferType] = useState('intra'); // 'intra' or 'inter'
  const [amount, setAmount] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [selectedBank, setSelectedBank] = useState(null);
  const [description, setDescription] = useState('');
  const [showBankModal, setShowBankModal] = useState(false);
  const [showBeneficiaryModal, setShowBeneficiaryModal] = useState(false);
  const [showPinModal, setShowPinModal] = useState(false);
  const [pin, setPin] = useState('');
  const [saveBeneficiary, setSaveBeneficiary] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);

  // Add ref for PIN input
  const pinInputRef = useRef(null);

  useEffect(() => {
    loadInitialData();
    return () => {
      dispatch(clearVerifiedAccount());
    };
  }, []);

  // Focus PIN input when modal opens
  useEffect(() => {
    if (showPinModal) {
      // Delay to ensure modal animation completes
      const timer = setTimeout(() => {
        if (pinInputRef.current) {
          pinInputRef.current.focus();
        }
      }, 500);
      
      return () => clearTimeout(timer);
    } else {
      // Clear PIN when modal closes
      setPin('');
    }
  }, [showPinModal]);

  const loadInitialData = async () => {
    try {
      // Load beneficiaries and banks without failing if endpoints don't exist
      await Promise.allSettled([
        dispatch(fetchBeneficiaries()),
        dispatch(fetchBankList()),
      ]);
    } catch (error) {
      console.error('Failed to load transfer data:', error);
      // Don't show error toast - just log it
    }
  };

  const handleAmountChange = (text) => {
    // Remove non-numeric characters except decimal point
    const cleaned = text.replace(/[^0-9.]/g, '');
    // Ensure only one decimal point
    const parts = cleaned.split('.');
    if (parts.length <= 2) {
      const formatted = parts[0] + (parts[1] !== undefined ? '.' + parts[1].slice(0, 2) : '');
      setAmount(formatted);
    }
  };

  const handleAccountNumberChange = (text) => {
    // Remove non-numeric characters
    const cleaned = text.replace(/\D/g, '');
    // Limit to 10 digits for Nigerian account numbers
    if (cleaned.length <= 10) {
      setAccountNumber(cleaned);
      
      // Auto-verify when 10 digits reached
      if (cleaned.length === 10) {
        // Small delay to ensure state is updated
        setTimeout(() => {
          handleVerifyAccount(cleaned);
        }, 100);
      } else {
        // Clear verification when user edits
        if (verifiedAccount) {
          dispatch(clearVerifiedAccount());
        }
      }
    }
  };

  const handleVerifyAccount = async (accountNum = null) => {
    const accNumber = accountNum || accountNumber;
    
    if (!accNumber || accNumber.length !== 10) {
      Toast.show({
        type: 'error',
        text1: 'Invalid Account Number',
        text2: 'Please enter a valid 10-digit account number',
      });
      return;
    }

    if (transferType === 'inter' && !selectedBank) {
      Toast.show({
        type: 'error',
        text1: 'Select Bank',
        text2: 'Please select a bank',
      });
      return;
    }

    setIsVerifying(true);

    try {
      const verifyData = {
        account_number: accNumber,
        ...(transferType === 'inter' && { bank_code: selectedBank.code }),
      };

      await dispatch(verifyAccount(verifyData)).unwrap();
      Toast.show({
        type: 'success',
        text1: 'Account Verified',
        text2: 'Account details retrieved successfully',
      });
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Verification Failed',
        text2: error.message || 'Unable to verify account',
      });
    } finally {
      setIsVerifying(false);
    }
  };

  const handleTransferInitiate = () => {
    // Validate inputs
    if (!verifiedAccount) {
      Toast.show({
        type: 'error',
        text1: 'Verify Account',
        text2: 'Please verify the recipient account first',
      });
      return;
    }

    const amountValue = parseAmount(amount);
    if (!amountValue || amountValue <= 0) {
      Toast.show({
        type: 'error',
        text1: 'Invalid Amount',
        text2: 'Please enter a valid amount',
      });
      return;
    }

    if (amountValue > balance) {
      Toast.show({
        type: 'error',
        text1: 'Insufficient Balance',
        text2: 'You do not have enough balance for this transfer',
      });
      return;
    }

    if (!description.trim()) {
      Toast.show({
        type: 'error',
        text1: 'Description Required',
        text2: 'Please enter a description for this transfer',
      });
      return;
    }

    // Show PIN modal and clear any previous PIN
    setPin('');
    setShowPinModal(true);
  };

  const handleConfirmTransfer = async () => {
    if (pin.length !== 4) {
      Toast.show({
        type: 'error',
        text1: 'Invalid PIN',
        text2: 'Please enter your 4-digit transaction PIN',
      });
      return;
    }

    setShowPinModal(false);

    try {
      const transferData = {
        account_number: accountNumber,
        amount: parseAmount(amount),
        description: description.trim(),
        transaction_pin: pin,
        bank_code: '044',
       // save_beneficiary: saveBeneficiary,
      };

      let result;
      if (transferType === 'intra') {
        console.log('About to do a transaction for:', transferType);
        result = await dispatch(intraBankTransfer(transferData)).unwrap();
        console.log('Intra transfer result:', result);
      } else {
        transferData.bank_code = selectedBank.code;
        result = await dispatch(interBankTransfer(transferData)).unwrap();
      }

      // Show success toast
      Toast.show({
        type: 'success',
        text1: 'Transfer Successful!',
        text2: `₦${parseAmount(amount).toLocaleString()} sent to ${verifiedAccount.account_name}`,
        visibilityTime: 3000,
      });

      // Reset form first
      resetForm();

      // Navigate to TransactionDetail screen with the transaction data
      setTimeout(() => {
        navigation.navigate('TransactionDetail', {
          transaction: result,
        });
      }, 500);

    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Transfer Failed',
        text2: error.message || 'Unable to complete transfer',
      });
    }
    
    setPin('');
  };

  const resetForm = () => {
    setAmount('');
    setAccountNumber('');
    setSelectedBank(null);
    setDescription('');
    setSaveBeneficiary(false);
    dispatch(clearVerifiedAccount());
  };

  const selectBeneficiary = (beneficiary) => {
    setAccountNumber(beneficiary.account_number);
    if (beneficiary.bank_code && beneficiary.bank_code !== '999999') {
      setTransferType('inter');
      const bank = banks.find(b => b.code === beneficiary.bank_code);
      if (bank) setSelectedBank(bank);
    } else {
      setTransferType('intra');
    }
    setShowBeneficiaryModal(false);
    handleVerifyAccount();
  };

  const renderQuickAmounts = () => {
    const amounts = [1000, 5000, 10000, 20000, 50000, 100000];
    
    return (
      <View style={styles.quickAmounts}>
        <Text style={styles.quickAmountsTitle}>Quick Amount</Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.quickAmountsList}>
          {amounts.map((quickAmount) => (
            <TouchableOpacity
              key={quickAmount}
              style={[
                styles.quickAmountButton,
                amount === quickAmount.toString() && styles.quickAmountButtonActive,
              ]}
              onPress={() => setAmount(quickAmount.toString())}>
              <Text
                style={[
                  styles.quickAmountText,
                  amount === quickAmount.toString() && styles.quickAmountTextActive,
                ]}>
                {formatCurrency(quickAmount, false)}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
    );
  };

  const renderBankModal = () => (
    <Modal
      visible={showBankModal}
      animationType="slide"
      transparent={true}
      onRequestClose={() => setShowBankModal(false)}>
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Select Bank</Text>
            <TouchableOpacity onPress={() => setShowBankModal(false)}>
              <Icon name="close" size={24} color={Colors.text} />
            </TouchableOpacity>
          </View>
          
          <FlatList
            data={banks}
            keyExtractor={(item) => item.code}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.bankItem}
                onPress={() => {
                  setSelectedBank(item);
                  setShowBankModal(false);
                }}>
                <Text style={styles.bankName}>{item.name}</Text>
                {selectedBank?.code === item.code && (
                  <Icon name="check" size={20} color={Colors.primary} />
                )}
              </TouchableOpacity>
            )}
            ItemSeparatorComponent={() => <View style={styles.separator} />}
          />
        </View>
      </View>
    </Modal>
  );

  const renderPinModal = () => (
    <Modal
      visible={showPinModal}
      animationType="fade"
      transparent={true}
      onRequestClose={() => {
        setShowPinModal(false);
        setPin('');
      }}>
      <TouchableOpacity 
        style={styles.modalOverlay}
        activeOpacity={1}
        onPress={() => {
          // Close modal when clicking outside
          setShowPinModal(false);
          setPin('');
        }}>
        <TouchableOpacity
          style={styles.pinModalContent}
          activeOpacity={1}
          onPress={(e) => e.stopPropagation()}>
          <Text style={styles.pinModalTitle}>Enter Transaction PIN</Text>
          <Text style={styles.pinModalSubtitle}>
            Enter your 4-digit PIN to confirm this transfer
          </Text>
          
          {/* PIN Display Boxes */}
          <View style={styles.pinDisplayContainer}>
            {[0, 1, 2, 3].map((index) => (
              <View
                key={index}
                style={[
                  styles.pinBox,
                  pin.length > index && styles.pinBoxFilled,
                ]}>
                {pin.length > index && (
                  <Text style={styles.pinDot}>●</Text>
                )}
              </View>
            ))}
          </View>
          
          {/* Actual Input Field - Made visible but styled to blend */}
          <View style={styles.pinInputWrapper}>
            <TextInput
              ref={pinInputRef}
              style={styles.pinInput}
              value={pin}
              onChangeText={(text) => {
                if (/^\d*$/.test(text) && text.length <= 4) {
                  setPin(text);
                }
              }}
              placeholder="Enter PIN"
              placeholderTextColor={Colors.textMuted}
              keyboardType="number-pad"
              maxLength={4}
              autoFocus={true}
              secureTextEntry={false}
              caretHidden={false}
              contextMenuHidden={true}
              selectTextOnFocus={true}
              editable={!isLoading}
            />
          </View>
          
          <View style={styles.pinModalButtons}>
            <Button
              title="Cancel"
              variant="outline"
              onPress={() => {
                setShowPinModal(false);
                setPin('');
              }}
              style={styles.pinModalButton}
            />
            <Button
              title="Confirm"
              onPress={handleConfirmTransfer}
              disabled={pin.length !== 4 || isLoading}
              loading={isLoading}
              style={styles.pinModalButton}
            />
          </View>
        </TouchableOpacity>
      </TouchableOpacity>
    </Modal>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-back" size={24} color={Colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Transfer Money</Text>
        <TouchableOpacity onPress={() => navigation.navigate('TransferHistory')}>
          <Icon name="history" size={24} color={Colors.text} />
        </TouchableOpacity>
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.content}>
        <ScrollView showsVerticalScrollIndicator={false}>
          {/* Transfer Type Selector */}
          <View style={styles.transferTypeContainer}>
            <TouchableOpacity
              style={[
                styles.transferTypeButton,
                transferType === 'intra' && styles.transferTypeButtonActive,
              ]}
              onPress={() => setTransferType('intra')}>
              <Icon
                name="account-balance"
                size={20}
                color={transferType === 'intra' ? Colors.white : Colors.primary}
              />
              <Text
                style={[
                  styles.transferTypeText,
                  transferType === 'intra' && styles.transferTypeTextActive,
                ]}>
                Nanro Bank
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[
                styles.transferTypeButton,
                transferType === 'inter' && styles.transferTypeButtonActive,
              ]}
              onPress={() => setTransferType('inter')}>
              <Icon
                name="compare-arrows"
                size={20}
                color={transferType === 'inter' ? Colors.white : Colors.primary}
              />
              <Text
                style={[
                  styles.transferTypeText,
                  transferType === 'inter' && styles.transferTypeTextActive,
                ]}>
                Other Banks
              </Text>
            </TouchableOpacity>
          </View>

          {/* Beneficiaries */}
          {beneficiaries.length > 0 && (
            <TouchableOpacity
              style={styles.beneficiaryButton}
              onPress={() => setShowBeneficiaryModal(true)}>
              <Icon name="people" size={20} color={Colors.primary} />
              <Text style={styles.beneficiaryButtonText}>
                Select from Beneficiaries
              </Text>
              <Icon name="chevron-right" size={20} color={Colors.textLight} />
            </TouchableOpacity>
          )}

          {/* Bank Selection (Inter-bank only) */}
          {transferType === 'inter' && (
            <TouchableOpacity
              style={styles.bankSelector}
              onPress={() => setShowBankModal(true)}>
              <Text style={styles.inputLabel}>Select Bank</Text>
              <View style={styles.bankSelectorInput}>
                <Text
                  style={[
                    styles.bankSelectorText,
                    !selectedBank && styles.placeholderText,
                  ]}>
                  {selectedBank ? selectedBank.name : 'Choose a bank'}
                </Text>
                <Icon name="keyboard-arrow-down" size={24} color={Colors.textLight} />
              </View>
            </TouchableOpacity>
          )}

          {/* Account Number */}
          <Input
            label="Account Number"
            placeholder="Enter 10-digit account number"
            value={formatAccountNumber(accountNumber)}
            onChangeText={handleAccountNumberChange}
            keyboardType="numeric"
            maxLength={13} // 10 digits + 2 spaces
            leftIcon="credit-card"
            rightIcon={isVerifying ? 'hourglass-empty' : (verifiedAccount ? 'check-circle' : 'search')}
            onRightIconPress={() => handleVerifyAccount()}
            editable={!isVerifying}
          />

          {/* Verification Loading */}
          {isVerifying && (
            <Animatable.View
              animation="fadeIn"
              duration={300}
              style={styles.verifyingContainer}>
              <Text style={styles.verifyingText}>Verifying account...</Text>
            </Animatable.View>
          )}

          {/* Verified Account Info */}
          {verifiedAccount && (
            <Animatable.View
              animation="fadeIn"
              duration={500}
              style={styles.verifiedAccount}>
              <Icon name="verified-user" size={20} color={Colors.success} />
              <View style={styles.verifiedAccountInfo}>
                <Text style={styles.verifiedAccountName}>
                  {verifiedAccount.account_name}
                </Text>
                <Text style={styles.verifiedAccountBank}>
                  {transferType === 'inter' ? selectedBank?.name : 'Nanro Bank'}
                </Text>
              </View>
            </Animatable.View>
          )}

          {/* Amount Input */}
          <View style={styles.amountContainer}>
            <Text style={styles.inputLabel}>Amount</Text>
            <View style={styles.amountInputContainer}>
              <Text style={styles.currencySymbol}>₦</Text>
              <TextInput
                style={styles.amountInput}
                placeholder="0.00"
                placeholderTextColor={Colors.textMuted}
                value={amount}
                onChangeText={handleAmountChange}
                keyboardType="decimal-pad"
              />
            </View>
            <Text style={styles.balanceText}>
              Available Balance: {formatCurrency(balance)}
            </Text>
          </View>

          {/* Quick Amounts */}
          {renderQuickAmounts()}

          {/* Description */}
          <Input
            label="Description"
            placeholder="What's this transfer for?"
            value={description}
            onChangeText={setDescription}
            multiline
            numberOfLines={3}
            leftIcon="description"
          />

          {/* Save Beneficiary Option */}
          {verifiedAccount && !beneficiaries.find(
            b => b.account_number === accountNumber
          ) && (
            <TouchableOpacity
              style={styles.saveBeneficiaryContainer}
              onPress={() => setSaveBeneficiary(!saveBeneficiary)}>
              <View style={styles.checkbox}>
                {saveBeneficiary && (
                  <Icon name="check" size={16} color={Colors.primary} />
                )}
              </View>
              <Text style={styles.saveBeneficiaryText}>
                Save as beneficiary for future transfers
              </Text>
            </TouchableOpacity>
          )}

          {/* Transfer Button */}
          <Button
            title="Continue"
            onPress={handleTransferInitiate}
            loading={isLoading}
            disabled={!verifiedAccount || !amount || !description}
            style={styles.transferButton}
            gradient
          />

          {/* Transfer Charges Info */}
          <View style={styles.chargesInfo}>
            <Icon name="info" size={16} color={Colors.textLight} />
            <Text style={styles.chargesText}>
              {transferType === 'intra'
                ? 'Free transfers to Nanro Bank accounts'
                : 'Inter-bank transfer charge: ₦50.00'}
            </Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      {renderBankModal()}
      {renderPinModal()}
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
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: Spacing.lg,
    backgroundColor: Colors.white,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  headerTitle: {
    fontSize: 18,
    fontFamily: Fonts.semiBold,
    color: Colors.text,
  },
  content: {
    flex: 1,
    padding: Spacing.lg,
  },
  transferTypeContainer: {
    flexDirection: 'row',
    gap: Spacing.md,
    marginBottom: Spacing.lg,
  },
  transferTypeButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    borderColor: Colors.primary,
    backgroundColor: Colors.white,
  },
  transferTypeButtonActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  transferTypeText: {
    marginLeft: Spacing.xs,
    fontSize: 14,
    fontFamily: Fonts.medium,
    color: Colors.primary,
  },
  transferTypeTextActive: {
    color: Colors.white,
  },
  beneficiaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.md,
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: Spacing.lg,
  },
  beneficiaryButtonText: {
    flex: 1,
    marginLeft: Spacing.sm,
    fontSize: 14,
    fontFamily: Fonts.medium,
    color: Colors.text,
  },
  bankSelector: {
    marginBottom: Spacing.lg,
  },
  inputLabel: {
    ...Typography.label,
    color: Colors.text,
    marginBottom: Spacing.xs,
  },
  bankSelectorInput: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: Spacing.md,
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  bankSelectorText: {
    fontSize: 16,
    fontFamily: Fonts.regular,
    color: Colors.text,
    flex: 1,
  },
  placeholderText: {
    color: Colors.textMuted,
  },
  verifiedAccount: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.md,
    backgroundColor: Colors.successLight,
    borderRadius: BorderRadius.md,
    marginBottom: Spacing.lg,
  },
  verifiedAccountInfo: {
    marginLeft: Spacing.sm,
    flex: 1,
  },
  verifiedAccountName: {
    fontSize: 14,
    fontFamily: Fonts.semiBold,
    color: Colors.text,
  },
  verifiedAccountBank: {
    fontSize: 12,
    fontFamily: Fonts.regular,
    color: Colors.textLight,
    marginTop: 2,
  },
  verifyingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.sm,
    backgroundColor: Colors.infoLight,
    borderRadius: BorderRadius.md,
    marginBottom: Spacing.lg,
  },
  verifyingText: {
    fontSize: 12,
    fontFamily: Fonts.medium,
    color: Colors.primary,
    marginLeft: Spacing.xs,
  },
  amountContainer: {
    marginBottom: Spacing.lg,
  },
  amountInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    borderColor: Colors.border,
    paddingHorizontal: Spacing.md,
  },
  currencySymbol: {
    fontSize: 24,
    fontFamily: Fonts.semiBold,
    color: Colors.text,
    marginRight: Spacing.xs,
  },
  amountInput: {
    flex: 1,
    fontSize: 24,
    fontFamily: Fonts.semiBold,
    color: Colors.text,
    paddingVertical: Spacing.md,
  },
  balanceText: {
    fontSize: 12,
    fontFamily: Fonts.regular,
    color: Colors.textLight,
    marginTop: Spacing.xs,
    marginLeft: Spacing.xs,
  },
  quickAmounts: {
    marginBottom: Spacing.lg,
  },
  quickAmountsTitle: {
    fontSize: 14,
    fontFamily: Fonts.medium,
    color: Colors.text,
    marginBottom: Spacing.sm,
  },
  quickAmountsList: {
    paddingRight: Spacing.lg,
  },
  quickAmountButton: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    borderColor: Colors.border,
    backgroundColor: Colors.white,
    marginRight: Spacing.sm,
  },
  quickAmountButtonActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  quickAmountText: {
    fontSize: 14,
    fontFamily: Fonts.medium,
    color: Colors.text,
  },
  quickAmountTextActive: {
    color: Colors.white,
  },
  saveBeneficiaryContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.lg,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 1,
    borderColor: Colors.primary,
    borderRadius: 4,
    marginRight: Spacing.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
  saveBeneficiaryText: {
    fontSize: 14,
    fontFamily: Fonts.regular,
    color: Colors.text,
  },
  transferButton: {
    marginTop: Spacing.md,
  },
  chargesInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: Spacing.lg,
    padding: Spacing.md,
    backgroundColor: Colors.infoLight,
    borderRadius: BorderRadius.md,
  },
  chargesText: {
    marginLeft: Spacing.sm,
    fontSize: 12,
    fontFamily: Fonts.regular,
    color: Colors.textLight,
    flex: 1,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: Colors.white,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '70%',
    width: '100%',
    position: 'absolute',
    bottom: 0,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: Spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  modalTitle: {
    fontSize: 18,
    fontFamily: Fonts.semiBold,
    color: Colors.text,
  },
  bankItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: Spacing.lg,
  },
  bankName: {
    fontSize: 16,
    fontFamily: Fonts.regular,
    color: Colors.text,
  },
  separator: {
    height: 1,
    backgroundColor: Colors.border,
    marginHorizontal: Spacing.lg,
  },
  pinModalContent: {
    backgroundColor: Colors.white,
    borderRadius: 24,
    padding: Spacing.xl,
    alignItems: 'center',
    width: '90%',
    maxWidth: 400,
  },
  pinModalTitle: {
    fontSize: 20,
    fontFamily: Fonts.semiBold,
    color: Colors.text,
    marginBottom: Spacing.xs,
  },
  pinModalSubtitle: {
    fontSize: 14,
    fontFamily: Fonts.regular,
    color: Colors.textLight,
    textAlign: 'center',
    marginBottom: Spacing.xl,
  },
  pinDisplayContainer: {
    flexDirection: 'row',
    gap: Spacing.md,
    marginBottom: Spacing.xl,
  },
  pinBox: {
    width: 50,
    height: 50,
    borderRadius: BorderRadius.md,
    borderWidth: 2,
    borderColor: Colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.white,
  },
  pinBoxFilled: {
    borderColor: Colors.primary,
    backgroundColor: Colors.primaryLight + '20',
  },
  pinDot: {
    fontSize: 24,
    color: Colors.primary,
  },
  pinInputWrapper: {
    width: '100%',
    marginBottom: Spacing.lg,
  },
  pinInput: {
    width: '100%',
    padding: Spacing.md,
    fontSize: 16,
    fontFamily: Fonts.medium,
    color: Colors.text,
    backgroundColor: Colors.backgroundLight,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    borderColor: Colors.border,
    textAlign: 'center',
  },
  pinModalButtons: {
    flexDirection: 'row',
    gap: Spacing.md,
    width: '100%',
  },
  pinModalButton: {
    flex: 1,
  },
});

export default TransferScreen;