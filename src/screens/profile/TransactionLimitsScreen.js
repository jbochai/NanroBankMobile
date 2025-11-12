import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
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

const TransactionLimitsScreen = () => {
  const navigation = useNavigation();
  const [isLoading, setIsLoading] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      dailyTransferLimit: '500000',
      singleTransferLimit: '100000',
      dailyWithdrawalLimit: '200000',
      dailyBillPaymentLimit: '50000',
    },
  });

  const onSubmit = async (data) => {
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      Toast.show({
        type: 'success',
        text1: 'Limits Updated',
        text2: 'Your transaction limits have been updated successfully',
      });
    }, 1500);
  };

  const currentLimits = [
    {
      icon: 'send',
      title: 'Daily Transfer Limit',
      current: '₦500,000',
      max: '₦1,000,000',
      color: Colors.primary,
    },
    {
      icon: 'payment',
      title: 'Single Transfer Limit',
      current: '₦100,000',
      max: '₦500,000',
      color: '#ff9800',
    },
    {
      icon: 'atm',
      title: 'Daily Withdrawal',
      current: '₦200,000',
      max: '₦500,000',
      color: '#4caf50',
    },
    {
      icon: 'receipt',
      title: 'Daily Bill Payment',
      current: '₦50,000',
      max: '₦100,000',
      color: '#2196f3',
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-back" size={24} color={Colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Transaction Limits</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>
        
        <View style={styles.infoCard}>
          <Icon name="info" size={24} color={Colors.primary} />
          <Text style={styles.infoText}>
            Set daily transaction limits to control your spending and enhance security.
            Limits reset at midnight daily.
          </Text>
        </View>

        <View style={styles.currentLimitsSection}>
          <Text style={styles.sectionTitle}>Current Limits</Text>
          {currentLimits.map((limit, index) => (
            <View key={index} style={styles.limitCard}>
              <View style={[styles.limitIcon, { backgroundColor: limit.color + '20' }]}>
                <Icon name={limit.icon} size={24} color={limit.color} />
              </View>
              <View style={styles.limitInfo}>
                <Text style={styles.limitTitle}>{limit.title}</Text>
                <View style={styles.limitValues}>
                  <Text style={styles.limitCurrent}>{limit.current}</Text>
                  <Text style={styles.limitMax}>Max: {limit.max}</Text>
                </View>
                <View style={styles.progressBar}>
                  <View style={[styles.progressFill, { width: '50%', backgroundColor: limit.color }]} />
                </View>
              </View>
            </View>
          ))}
        </View>

        <View style={styles.form}>
          <Text style={styles.sectionTitle}>Update Limits</Text>

          <Controller
            control={control}
            name="dailyTransferLimit"
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                label="Daily Transfer Limit (₦)"
                placeholder="Enter daily transfer limit"
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                error={errors.dailyTransferLimit?.message}
                keyboardType="numeric"
                leftIcon="send"
              />
            )}
          />

          <Controller
            control={control}
            name="singleTransferLimit"
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                label="Single Transfer Limit (₦)"
                placeholder="Enter single transfer limit"
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                error={errors.singleTransferLimit?.message}
                keyboardType="numeric"
                leftIcon="payment"
              />
            )}
          />

          <Controller
            control={control}
            name="dailyWithdrawalLimit"
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                label="Daily Withdrawal Limit (₦)"
                placeholder="Enter daily withdrawal limit"
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                error={errors.dailyWithdrawalLimit?.message}
                keyboardType="numeric"
                leftIcon="atm"
              />
            )}
          />

          <Controller
            control={control}
            name="dailyBillPaymentLimit"
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                label="Daily Bill Payment Limit (₦)"
                placeholder="Enter daily bill payment limit"
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                error={errors.dailyBillPaymentLimit?.message}
                keyboardType="numeric"
                leftIcon="receipt"
              />
            )}
          />

          <Button
            title="Update Limits"
            onPress={handleSubmit(onSubmit)}
            loading={isLoading}
            style={styles.submitButton}
          />
        </View>

        <View style={styles.warningCard}>
          <Icon name="warning" size={24} color={Colors.warning} />
          <Text style={styles.warningText}>
            Lowering your limits takes effect immediately.
            Increasing limits may require additional verification.
          </Text>
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
  currentLimitsSection: {
    marginBottom: Spacing.lg,
  },
  sectionTitle: {
    fontSize: 16,
    fontFamily: Fonts.semiBold,
    color: Colors.text,
    marginBottom: Spacing.md,
  },
  limitCard: {
    flexDirection: 'row',
    backgroundColor: Colors.white,
    borderRadius: 12,
    padding: Spacing.md,
    marginBottom: Spacing.sm,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  limitIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.md,
  },
  limitInfo: {
    flex: 1,
  },
  limitTitle: {
    fontSize: 14,
    fontFamily: Fonts.medium,
    color: Colors.text,
    marginBottom: 4,
  },
  limitValues: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.xs,
  },
  limitCurrent: {
    fontSize: 16,
    fontFamily: Fonts.semiBold,
    color: Colors.primary,
    marginRight: Spacing.sm,
  },
  limitMax: {
    fontSize: 12,
    fontFamily: Fonts.regular,
    color: Colors.textLight,
  },
  progressBar: {
    height: 4,
    backgroundColor: Colors.border,
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 2,
  },
  form: {
    backgroundColor: Colors.white,
    borderRadius: 12,
    padding: Spacing.lg,
    marginBottom: Spacing.lg,
  },
  submitButton: {
    marginTop: Spacing.md,
  },
  warningCard: {
    flexDirection: 'row',
    backgroundColor: Colors.warningLight,
    padding: Spacing.md,
    borderRadius: 8,
  },
  warningText: {
    flex: 1,
    fontSize: 12,
    fontFamily: Fonts.regular,
    color: Colors.text,
    marginLeft: Spacing.sm,
    lineHeight: 18,
  },
});

export default TransactionLimitsScreen;