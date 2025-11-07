import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Toast from 'react-native-toast-message';

import Header from '../../components/common/Header';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import Card from '../../components/common/Card';
import Loader from '../../components/common/Loader';
import Alert from '../../components/common/Alert';
import { selectBalance } from '../../store/account/accountSlice';
import { validatePhone, validateAmount } from '../../utils/validation';
import { formatCurrency } from '../../utils/formatting';
import { Colors } from '../../styles/colors';
import { Fonts } from '../../styles/fonts';
import { Spacing, BorderRadius } from '../../styles/spacing';

const AirtimeScreen = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  
  const balance = useSelector(selectBalance);
  
  const [loading, setLoading] = useState(false);
  const [selectedNetwork, setSelectedNetwork] = useState(null);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [amount, setAmount] = useState('');
  const [errors, setErrors] = useState({});
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);

  const networks = [
    { id: 'mtn', name: 'MTN', color: '#FFCC00', icon: 'phone-android' },
    { id: 'glo', name: 'Glo', color: '#00B140', icon: 'phone-android' },
    { id: 'airtel', name: 'Airtel', color: '#ED1C24', icon: 'phone-android' },
    { id: '9mobile', name: '9mobile', color: '#00A65A', icon: 'phone-android' },
  ];

  const quickAmounts = [100, 200, 500, 1000, 2000, 5000];

  const handleNetworkSelect = (network) => {
    setSelectedNetwork(network);
    setErrors({ ...errors, network: null });
  };

  const handleQuickAmount = (value) => {
    setAmount(value.toString());
    setErrors({ ...errors, amount: null });
  };

  const validateForm = () => {
    const newErrors = {};

    if (!selectedNetwork) {
      newErrors.network = 'Please select a network';
    }

    const phoneValidation = validatePhone(phoneNumber);
    if (!phoneValidation.isValid) {
      newErrors.phoneNumber = phoneValidation.error;
    }

    const amountValidation = validateAmount(amount, 50, 50000);
    if (!amountValidation.isValid) {
      newErrors.amount = amountValidation.error;
    }

    const amountNum = parseFloat(amount);
    if (amountNum > balance) {
      newErrors.amount = 'Insufficient balance';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handlePurchase = () => {
    if (validateForm()) {
      setShowConfirmDialog(true);
    }
  };

  const handleConfirmPurchase = async () => {
    setShowConfirmDialog(false);
    setLoading(true);

    try {
      // Purchase airtime API call
      // const result = await dispatch(purchaseAirtime({
      //   network: selectedNetwork.id,
      //   phoneNumber,
      //   amount: parseFloat(amount),
      // })).unwrap();

      Toast.show({
        type: 'success',
        text1: 'Purchase Successful',
        text2: `${formatCurrency(parseFloat(amount))} airtime sent to ${phoneNumber}`,
      });

      // Reset form
      setSelectedNetwork(null);
      setPhoneNumber('');
      setAmount('');
      
      navigation.goBack();
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Purchase Failed',
        text2: error.message || 'Failed to purchase airtime',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <Header title="Buy Airtime" showBack={true} />

      <ScrollView style={styles.scrollView} keyboardShouldPersistTaps="handled">
        <View style={styles.content}>
          {/* Balance Card */}
          <Card style={styles.balanceCard}>
            <Text style={styles.balanceLabel}>Available Balance</Text>
            <Text style={styles.balanceAmount}>{formatCurrency(balance)}</Text>
          </Card>

          {/* Network Selection */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Select Network</Text>
            {errors.network && <Text style={styles.errorText}>{errors.network}</Text>}
            <View style={styles.networksGrid}>
              {networks.map((network) => (
                <TouchableOpacity
                  key={network.id}
                  style={[
                    styles.networkCard,
                    selectedNetwork?.id === network.id && styles.networkCardSelected,
                  ]}
                  onPress={() => handleNetworkSelect(network)}
                  activeOpacity={0.7}>
                  <View style={[styles.networkIcon, { backgroundColor: `${network.color}20` }]}>
                    <Icon name={network.icon} size={24} color={network.color} />
                  </View>
                  <Text style={styles.networkName}>{network.name}</Text>
                  {selectedNetwork?.id === network.id && (
                    <View style={styles.checkmark}>
                      <Icon name="check-circle" size={20} color={Colors.success} />
                    </View>
                  )}
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Phone Number */}
          <View style={styles.section}>
            <Input
              label="Phone Number"
              placeholder="e.g., 08012345678"
              value={phoneNumber}
              onChangeText={(text) => {
                setPhoneNumber(text);
                setErrors({ ...errors, phoneNumber: null });
              }}
              keyboardType="phone-pad"
              maxLength={11}
              error={errors.phoneNumber}
              icon="phone"
            />
          </View>

          {/* Amount */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Enter Amount</Text>
            <Input
              placeholder="Enter amount (₦50 - ₦50,000)"
              value={amount}
              onChangeText={(text) => {
                setAmount(text);
                setErrors({ ...errors, amount: null });
              }}
              keyboardType="decimal-pad"
              error={errors.amount}
              icon="payments"
            />

            <Text style={styles.quickAmountLabel}>Quick Amounts</Text>
            <View style={styles.quickAmountsGrid}>
              {quickAmounts.map((value) => (
                <TouchableOpacity
                  key={value}
                  style={[
                    styles.quickAmountButton,
                    amount === value.toString() && styles.quickAmountButtonSelected,
                  ]}
                  onPress={() => handleQuickAmount(value)}
                  activeOpacity={0.7}>
                  <Text
                    style={[
                      styles.quickAmountText,
                      amount === value.toString() && styles.quickAmountTextSelected,
                    ]}>
                    ₦{value.toLocaleString()}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Purchase Button */}
          <Button
            title="Purchase Airtime"
            onPress={handlePurchase}
            loading={loading}
            gradient
            size="large"
            style={styles.purchaseButton}
          />
        </View>
      </ScrollView>

      {/* Confirmation Dialog */}
      <Alert
        visible={showConfirmDialog}
        type="info"
        title="Confirm Purchase"
        message={`You are about to purchase ${formatCurrency(parseFloat(amount || 0))} ${selectedNetwork?.name} airtime for ${phoneNumber}`}
        confirmText="Confirm"
        cancelText="Cancel"
        showCancel={true}
        onConfirm={handleConfirmPurchase}
        onClose={() => setShowConfirmDialog(false)}
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
  scrollView: {
    flex: 1,
  },
  content: {
    padding: Spacing.lg,
  },
  balanceCard: {
    padding: Spacing.lg,
    backgroundColor: Colors.primary,
    marginBottom: Spacing.lg,
  },
  balanceLabel: {
    fontSize: 14,
    fontFamily: Fonts.regular,
    color: Colors.white,
    opacity: 0.9,
    marginBottom: Spacing.xs,
  },
  balanceAmount: {
    fontSize: 28,
    fontFamily: Fonts.bold,
    color: Colors.white,
  },
  section: {
    marginBottom: Spacing.lg,
  },
  sectionTitle: {
    fontSize: 16,
    fontFamily: Fonts.semiBold,
    color: Colors.text,
    marginBottom: Spacing.md,
  },
  errorText: {
    fontSize: 12,
    fontFamily: Fonts.regular,
    color: Colors.error,
    marginBottom: Spacing.sm,
  },
  networksGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -Spacing.xs,
  },
  networkCard: {
    width: '48%',
    margin: Spacing.xs,
    padding: Spacing.md,
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.md,
    borderWidth: 2,
    borderColor: 'transparent',
    alignItems: 'center',
    position: 'relative',
  },
  networkCardSelected: {
    borderColor: Colors.success,
    backgroundColor: Colors.successLight,
  },
  networkIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  networkName: {
    fontSize: 14,
    fontFamily: Fonts.semiBold,
    color: Colors.text,
  },
  checkmark: {
    position: 'absolute',
    top: Spacing.xs,
    right: Spacing.xs,
  },
  quickAmountLabel: {
    fontSize: 14,
    fontFamily: Fonts.medium,
    color: Colors.text,
    marginTop: Spacing.md,
    marginBottom: Spacing.sm,
  },
  quickAmountsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -Spacing.xs,
  },
  quickAmountButton: {
    width: '31%',
    margin: Spacing.xs,
    padding: Spacing.md,
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.sm,
    borderWidth: 1,
    borderColor: Colors.border,
    alignItems: 'center',
  },
  quickAmountButtonSelected: {
    borderColor: Colors.primary,
    backgroundColor: Colors.primaryLight,
  },
  quickAmountText: {
    fontSize: 14,
    fontFamily: Fonts.semiBold,
    color: Colors.text,
  },
  quickAmountTextSelected: {
    color: Colors.primary,
  },
  purchaseButton: {
    marginTop: Spacing.lg,
  },
});

export default AirtimeScreen;
