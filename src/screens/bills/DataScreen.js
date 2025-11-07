import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  FlatList,
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
import { validatePhone } from '../../utils/validation';
import { formatCurrency } from '../../utils/formatting';
import { Colors } from '../../styles/colors';
import { Fonts } from '../../styles/fonts';
import { Spacing, BorderRadius } from '../../styles/spacing';

const DataScreen = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  
  const balance = useSelector(selectBalance);
  
  const [loading, setLoading] = useState(false);
  const [selectedNetwork, setSelectedNetwork] = useState(null);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [errors, setErrors] = useState({});
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);

  const networks = [
    { id: 'mtn', name: 'MTN', color: '#FFCC00', icon: 'phone-android' },
    { id: 'glo', name: 'Glo', color: '#00B140', icon: 'phone-android' },
    { id: 'airtel', name: 'Airtel', color: '#ED1C24', icon: 'phone-android' },
    { id: '9mobile', name: '9mobile', color: '#00A65A', icon: 'phone-android' },
  ];

  const dataPlans = {
    mtn: [
      { id: '1', size: '1GB', validity: '1 Day', price: 300 },
      { id: '2', size: '2GB', validity: '7 Days', price: 500 },
      { id: '3', size: '3GB', validity: '30 Days', price: 1200 },
      { id: '4', size: '5GB', validity: '30 Days', price: 1500 },
      { id: '5', size: '10GB', validity: '30 Days', price: 2500 },
      { id: '6', size: '20GB', validity: '30 Days', price: 4000 },
    ],
    glo: [
      { id: '1', size: '1.6GB', validity: '7 Days', price: 500 },
      { id: '2', size: '3.9GB', validity: '14 Days', price: 1000 },
      { id: '3', size: '5.8GB', validity: '30 Days', price: 1500 },
      { id: '4', size: '7.7GB', validity: '30 Days', price: 2000 },
      { id: '5', size: '10GB', validity: '30 Days', price: 2500 },
      { id: '6', size: '15GB', validity: '30 Days', price: 3500 },
    ],
    airtel: [
      { id: '1', size: '1.5GB', validity: '30 Days', price: 1000 },
      { id: '2', size: '3GB', validity: '30 Days', price: 1500 },
      { id: '3', size: '6GB', validity: '30 Days', price: 2500 },
      { id: '4', size: '10GB', validity: '30 Days', price: 3000 },
      { id: '5', size: '20GB', validity: '30 Days', price: 5000 },
      { id: '6', size: '40GB', validity: '30 Days', price: 10000 },
    ],
    '9mobile': [
      { id: '1', size: '1.5GB', validity: '30 Days', price: 1000 },
      { id: '2', size: '2GB', validity: '30 Days', price: 1200 },
      { id: '3', size: '4.5GB', validity: '30 Days', price: 2000 },
      { id: '4', size: '11GB', validity: '30 Days', price: 3000 },
      { id: '5', size: '15GB', validity: '30 Days', price: 4000 },
      { id: '6', size: '27.5GB', validity: '30 Days', price: 8000 },
    ],
  };

  const handleNetworkSelect = (network) => {
    setSelectedNetwork(network);
    setSelectedPlan(null);
    setErrors({ ...errors, network: null });
  };

  const handlePlanSelect = (plan) => {
    setSelectedPlan(plan);
    setErrors({ ...errors, plan: null });
  };

  const validateForm = () => {
    const newErrors = {};

    if (!selectedNetwork) {
      newErrors.network = 'Please select a network';
    }

    if (!selectedPlan) {
      newErrors.plan = 'Please select a data plan';
    }

    const phoneValidation = validatePhone(phoneNumber);
    if (!phoneValidation.isValid) {
      newErrors.phoneNumber = phoneValidation.error;
    }

    if (selectedPlan && selectedPlan.price > balance) {
      newErrors.balance = 'Insufficient balance';
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
      // Purchase data API call
      // const result = await dispatch(purchaseData({
      //   network: selectedNetwork.id,
      //   phoneNumber,
      //   planId: selectedPlan.id,
      //   amount: selectedPlan.price,
      // })).unwrap();

      Toast.show({
        type: 'success',
        text1: 'Purchase Successful',
        text2: `${selectedPlan.size} data sent to ${phoneNumber}`,
      });

      // Reset form
      setSelectedNetwork(null);
      setSelectedPlan(null);
      setPhoneNumber('');
      
      navigation.goBack();
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Purchase Failed',
        text2: error.message || 'Failed to purchase data',
      });
    } finally {
      setLoading(false);
    }
  };

  const renderPlanItem = ({ item }) => (
    <TouchableOpacity
      style={[
        styles.planCard,
        selectedPlan?.id === item.id && styles.planCardSelected,
      ]}
      onPress={() => handlePlanSelect(item)}
      activeOpacity={0.7}>
      <View style={styles.planHeader}>
        <Text style={styles.planSize}>{item.size}</Text>
        {selectedPlan?.id === item.id && (
          <Icon name="check-circle" size={20} color={Colors.success} />
        )}
      </View>
      <Text style={styles.planValidity}>{item.validity}</Text>
      <Text style={styles.planPrice}>{formatCurrency(item.price)}</Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <Header title="Buy Data" showBack={true} />

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

          {/* Data Plans */}
          {selectedNetwork && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Select Data Plan</Text>
              {errors.plan && <Text style={styles.errorText}>{errors.plan}</Text>}
              <FlatList
                data={dataPlans[selectedNetwork.id] || []}
                renderItem={renderPlanItem}
                keyExtractor={(item) => item.id}
                numColumns={2}
                scrollEnabled={false}
                contentContainerStyle={styles.plansGrid}
              />
            </View>
          )}

          {errors.balance && (
            <Text style={styles.balanceError}>{errors.balance}</Text>
          )}

          {/* Purchase Button */}
          <Button
            title="Purchase Data"
            onPress={handlePurchase}
            loading={loading}
            gradient
            size="large"
            style={styles.purchaseButton}
            disabled={!selectedNetwork || !selectedPlan || !phoneNumber}
          />
        </View>
      </ScrollView>

      {/* Confirmation Dialog */}
      <Alert
        visible={showConfirmDialog}
        type="info"
        title="Confirm Purchase"
        message={`You are about to purchase ${selectedPlan?.size} ${selectedNetwork?.name} data for ${phoneNumber}. Amount: ${formatCurrency(selectedPlan?.price || 0)}`}
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
  balanceError: {
    fontSize: 14,
    fontFamily: Fonts.medium,
    color: Colors.error,
    textAlign: 'center',
    marginBottom: Spacing.md,
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
  plansGrid: {
    marginHorizontal: -Spacing.xs,
  },
  planCard: {
    width: '48%',
    margin: Spacing.xs,
    padding: Spacing.md,
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.md,
    borderWidth: 2,
    borderColor: Colors.border,
  },
  planCardSelected: {
    borderColor: Colors.primary,
    backgroundColor: Colors.primaryLight,
  },
  planHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.xs,
  },
  planSize: {
    fontSize: 18,
    fontFamily: Fonts.bold,
    color: Colors.text,
  },
  planValidity: {
    fontSize: 12,
    fontFamily: Fonts.regular,
    color: Colors.textLight,
    marginBottom: Spacing.xs,
  },
  planPrice: {
    fontSize: 16,
    fontFamily: Fonts.semiBold,
    color: Colors.primary,
  },
  purchaseButton: {
    marginTop: Spacing.lg,
  },
});

export default DataScreen;
