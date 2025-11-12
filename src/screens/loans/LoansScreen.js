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
import LinearGradient from 'react-native-linear-gradient';
import { Colors } from '../../styles/colors';
import { Fonts } from '../../styles/fonts';
import { Spacing } from '../../styles/spacing';

const LoansScreen = () => {
  const navigation = useNavigation();
  const [activeLoan, setActiveLoan] = useState(null);

  const loanProducts = [
    {
      id: 1,
      name: 'Quick Loan',
      amount: '₦50,000 - ₦500,000',
      duration: '1 - 6 months',
      interest: '5% monthly',
      icon: 'flash-on',
      color: '#ff9800',
    },
    {
      id: 2,
      name: 'Salary Advance',
      amount: 'Up to 50% of salary',
      duration: '1 month',
      interest: '3% monthly',
      icon: 'account-balance-wallet',
      color: '#4caf50',
    },
    {
      id: 3,
      name: 'Business Loan',
      amount: '₦500,000 - ₦5,000,000',
      duration: '6 - 24 months',
      interest: '7% monthly',
      icon: 'business',
      color: '#2196f3',
    },
    {
      id: 4,
      name: 'Emergency Loan',
      amount: '₦10,000 - ₦100,000',
      duration: '1 - 3 months',
      interest: '4% monthly',
      icon: 'medical-services',
      color: '#f44336',
    },
  ];

  const renderLoanProduct = (loan) => (
    <TouchableOpacity
      key={loan.id}
      style={styles.loanCard}
      onPress={() => {}}>
      <View style={[styles.loanIcon, { backgroundColor: loan.color + '20' }]}>
        <Icon name={loan.icon} size={32} color={loan.color} />
      </View>
      <View style={styles.loanInfo}>
        <Text style={styles.loanName}>{loan.name}</Text>
        <Text style={styles.loanAmount}>{loan.amount}</Text>
        <View style={styles.loanDetails}>
          <View style={styles.loanDetail}>
            <Icon name="schedule" size={16} color={Colors.textLight} />
            <Text style={styles.loanDetailText}>{loan.duration}</Text>
          </View>
          <View style={styles.loanDetail}>
            <Icon name="percent" size={16} color={Colors.textLight} />
            <Text style={styles.loanDetailText}>{loan.interest}</Text>
          </View>
        </View>
      </View>
      <Icon name="chevron-right" size={24} color={Colors.textLight} />
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-back" size={24} color={Colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Loans</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>
        
        <LinearGradient
          colors={[Colors.primary, Colors.primaryDark]}
          style={styles.eligibilityCard}>
          <Icon name="account-balance" size={48} color={Colors.white} />
          <Text style={styles.eligibilityTitle}>Your Loan Eligibility</Text>
          <Text style={styles.eligibilityAmount}>₦500,000</Text>
          <Text style={styles.eligibilitySubtext}>
            Based on your account activity
          </Text>
        </LinearGradient>

        {activeLoan && (
          <View style={styles.activeLoanCard}>
            <View style={styles.activeLoanHeader}>
              <Text style={styles.activeLoanTitle}>Active Loan</Text>
              <View style={[styles.statusBadge, { backgroundColor: Colors.warningLight }]}>
                <Text style={styles.statusText}>In Progress</Text>
              </View>
            </View>
            <View style={styles.activeLoanDetails}>
              <View style={styles.activeLoanRow}>
                <Text style={styles.activeLoanLabel}>Loan Amount:</Text>
                <Text style={styles.activeLoanValue}>₦200,000</Text>
              </View>
              <View style={styles.activeLoanRow}>
                <Text style={styles.activeLoanLabel}>Outstanding:</Text>
                <Text style={[styles.activeLoanValue, { color: Colors.error }]}>
                  ₦150,000
                </Text>
              </View>
              <View style={styles.activeLoanRow}>
                <Text style={styles.activeLoanLabel}>Next Payment:</Text>
                <Text style={styles.activeLoanValue}>Dec 15, 2025</Text>
              </View>
            </View>
            <TouchableOpacity style={styles.repayButton}>
              <Text style={styles.repayButtonText}>Make Payment</Text>
            </TouchableOpacity>
          </View>
        )}

        <Text style={styles.sectionTitle}>Available Loan Products</Text>
        <View style={styles.loansList}>
          {loanProducts.map(renderLoanProduct)}
        </View>

        <View style={styles.infoCard}>
          <Icon name="info" size={24} color={Colors.primary} />
          <Text style={styles.infoText}>
            Loan approval is subject to your account history and creditworthiness.
            Interest rates and terms may vary.
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
  },
  eligibilityCard: {
    borderRadius: 16,
    padding: Spacing.xl,
    alignItems: 'center',
    marginBottom: Spacing.lg,
  },
  eligibilityTitle: {
    fontSize: 16,
    fontFamily: Fonts.regular,
    color: Colors.white,
    marginTop: Spacing.md,
    opacity: 0.9,
  },
  eligibilityAmount: {
    fontSize: 36,
    fontFamily: Fonts.bold,
    color: Colors.white,
    marginTop: Spacing.sm,
  },
  eligibilitySubtext: {
    fontSize: 14,
    fontFamily: Fonts.regular,
    color: Colors.white,
    marginTop: Spacing.xs,
    opacity: 0.8,
  },
  activeLoanCard: {
    backgroundColor: Colors.white,
    borderRadius: 12,
    padding: Spacing.lg,
    marginBottom: Spacing.lg,
    borderLeftWidth: 4,
    borderLeftColor: Colors.warning,
  },
  activeLoanHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  activeLoanTitle: {
    fontSize: 18,
    fontFamily: Fonts.semiBold,
    color: Colors.text,
  },
  statusBadge: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    fontFamily: Fonts.medium,
    color: Colors.warning,
  },
  activeLoanDetails: {
    marginBottom: Spacing.md,
  },
  activeLoanRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: Spacing.sm,
  },
  activeLoanLabel: {
    fontSize: 14,
    fontFamily: Fonts.regular,
    color: Colors.textLight,
  },
  activeLoanValue: {
    fontSize: 14,
    fontFamily: Fonts.semiBold,
    color: Colors.text,
  },
  repayButton: {
    backgroundColor: Colors.primary,
    paddingVertical: Spacing.sm,
    borderRadius: 8,
    alignItems: 'center',
  },
  repayButtonText: {
    fontSize: 14,
    fontFamily: Fonts.semiBold,
    color: Colors.white,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: Fonts.semiBold,
    color: Colors.text,
    marginBottom: Spacing.md,
  },
  loansList: {
    marginBottom: Spacing.lg,
  },
  loanCard: {
    flexDirection: 'row',
    alignItems: 'center',
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
  loanIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.md,
  },
  loanInfo: {
    flex: 1,
  },
  loanName: {
    fontSize: 16,
    fontFamily: Fonts.semiBold,
    color: Colors.text,
    marginBottom: 4,
  },
  loanAmount: {
    fontSize: 14,
    fontFamily: Fonts.medium,
    color: Colors.primary,
    marginBottom: Spacing.xs,
  },
  loanDetails: {
    flexDirection: 'row',
    gap: Spacing.md,
  },
  loanDetail: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  loanDetailText: {
    fontSize: 12,
    fontFamily: Fonts.regular,
    color: Colors.textLight,
    marginLeft: 4,
  },
  infoCard: {
    flexDirection: 'row',
    backgroundColor: Colors.primaryLight,
    padding: Spacing.md,
    borderRadius: 8,
  },
  infoText: {
    flex: 1,
    fontSize: 13,
    fontFamily: Fonts.regular,
    color: Colors.text,
    marginLeft: Spacing.sm,
    lineHeight: 20,
  },
});

export default LoansScreen;