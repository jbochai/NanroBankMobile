import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useForm, Controller } from 'react-hook-form';
import Toast from 'react-native-toast-message';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import { Colors } from '../../styles/colors';
import { Fonts } from '../../styles/fonts';
import { Spacing } from '../../styles/spacing';

const BillPaymentDetailScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { category, provider } = route.params || {};

  const [isLoading, setIsLoading] = useState(false);
  const [verifiedCustomer, setVerifiedCustomer] = useState(null);

  const {
    control,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm({
    defaultValues: {
      customerNumber: '',
      amount: '',
      phone: '',
    },
  });

  const handleVerifyCustomer = async () => {
    const customerNumber = watch('customerNumber');
    
    if (!customerNumber) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Please enter customer number',
      });
      return;
    }

    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setVerifiedCustomer({
        name: 'John Doe',
        customerNumber: customerNumber,
        address: 'Lagos, Nigeria',
      });
      setIsLoading(false);
      Toast.show({
        type: 'success',
        text1: 'Success',
        text2: 'Customer verified successfully',
      });
    }, 1500);
  };

  const onSubmit = async (data) => {
    if (!verifiedCustomer) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Please verify customer first',
      });
      return;
    }

    setIsLoading(true);
    // Simulate payment
    setTimeout(() => {
      setIsLoading(false);
      Toast.show({
        type: 'success',
        text1: 'Payment Successful',
        text2: `${category?.name} bill paid successfully`,
      });
      navigation.goBack();
    }, 2000);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-back" size={24} color={Colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{provider || 'Bill Payment'}</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>
        
        <View style={[styles.providerCard, { backgroundColor: category?.color + '20' }]}>
          <Icon name={category?.icon || 'receipt'} size={48} color={category?.color} />
          <Text style={styles.providerName}>{provider}</Text>
          <Text style={styles.categoryName}>{category?.name}</Text>
        </View>

        <View style={styles.form}>
          <Controller
            control={control}
            name="customerNumber"
            rules={{ required: 'Customer number is required' }}
            render={({ field: { onChange, onBlur, value } }) => (
              <View>
                <Input
                  label="Customer Number"
                  placeholder="Enter customer number"
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  error={errors.customerNumber?.message}
                  keyboardType="numeric"
                  leftIcon="person"
                />
                <TouchableOpacity
                  style={styles.verifyButton}
                  onPress={handleVerifyCustomer}
                  disabled={isLoading}>
                  {isLoading ? (
                    <ActivityIndicator size="small" color={Colors.primary} />
                  ) : (
                    <Text style={styles.verifyButtonText}>Verify Customer</Text>
                  )}
                </TouchableOpacity>
              </View>
            )}
          />

          {verifiedCustomer && (
            <View style={styles.verifiedCard}>
              <Icon name="check-circle" size={24} color={Colors.success} />
              <View style={styles.verifiedInfo}>
                <Text style={styles.verifiedName}>{verifiedCustomer.name}</Text>
                <Text style={styles.verifiedDetails}>{verifiedCustomer.address}</Text>
              </View>
            </View>
          )}

          <Controller
            control={control}
            name="amount"
            rules={{ required: 'Amount is required' }}
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                label="Amount"
                placeholder="Enter amount"
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                error={errors.amount?.message}
                keyboardType="numeric"
                leftIcon="money"
              />
            )}
          />

          <Controller
            control={control}
            name="phone"
            rules={{ required: 'Phone number is required' }}
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                label="Phone Number"
                placeholder="Enter phone number"
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                error={errors.phone?.message}
                keyboardType="phone-pad"
                leftIcon="phone"
              />
            )}
          />

          <Button
            title="Pay Bill"
            onPress={handleSubmit(onSubmit)}
            loading={isLoading}
            style={styles.payButton}
          />
        </View>
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
    padding: Spacing.md,
  },
  providerCard: {
    alignItems: 'center',
    padding: Spacing.xl,
    borderRadius: 12,
    marginBottom: Spacing.lg,
  },
  providerName: {
    fontSize: 24,
    fontFamily: Fonts.bold,
    color: Colors.text,
    marginTop: Spacing.md,
  },
  categoryName: {
    fontSize: 14,
    fontFamily: Fonts.regular,
    color: Colors.textLight,
    marginTop: Spacing.xs,
  },
  form: {
    backgroundColor: Colors.white,
    borderRadius: 12,
    padding: Spacing.lg,
  },
  verifyButton: {
    alignSelf: 'flex-end',
    marginTop: -Spacing.md,
    marginBottom: Spacing.md,
  },
  verifyButtonText: {
    fontSize: 14,
    fontFamily: Fonts.semiBold,
    color: Colors.primary,
  },
  verifiedCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.successLight,
    padding: Spacing.md,
    borderRadius: 8,
    marginBottom: Spacing.md,
  },
  verifiedInfo: {
    marginLeft: Spacing.sm,
    flex: 1,
  },
  verifiedName: {
    fontSize: 16,
    fontFamily: Fonts.semiBold,
    color: Colors.text,
  },
  verifiedDetails: {
    fontSize: 14,
    fontFamily: Fonts.regular,
    color: Colors.textLight,
    marginTop: 2,
  },
  payButton: {
    marginTop: Spacing.md,
  },
});

export default BillPaymentDetailScreen;