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

const InvestmentsScreen = () => {
  const navigation = useNavigation();

  const portfolioValue = 1250000;
  const totalReturns = 125000;
  const returnsPercentage = 11.11;

  const investments = [
    {
      id: 1,
      name: 'Fixed Deposit',
      amount: 500000,
      returns: 45000,
      percentage: 9,
      duration: '6 months',
      icon: 'account-balance',
      color: '#4caf50',
      status: 'active',
    },
    {
      id: 2,
      name: 'Treasury Bills',
      amount: 400000,
      returns: 40000,
      percentage: 10,
      duration: '90 days',
      icon: 'trending-up',
      color: '#2196f3',
      status: 'active',
    },
    {
      id: 3,
      name: 'Mutual Funds',
      amount: 250000,
      returns: 30000,
      percentage: 12,
      duration: '1 year',
      icon: 'pie-chart',
      color: '#ff9800',
      status: 'active',
    },
    {
      id: 4,
      name: 'Bonds',
      amount: 100000,
      returns: 10000,
      percentage: 10,
      duration: '5 years',
      icon: 'description',
      color: '#9c27b0',
      status: 'matured',
    },
  ];

  const investmentOptions = [
    {
      id: 1,
      name: 'Fixed Deposit',
      minAmount: '₦100,000',
      returns: '9-12% p.a.',
      duration: '3-12 months',
      icon: 'account-balance',
      color: '#4caf50',
      risk: 'Low',
    },
    {
      id: 2,
      name: 'Treasury Bills',
      minAmount: '₦50,000',
      returns: '10-15% p.a.',
      duration: '91-364 days',
      icon: 'trending-up',
      color: '#2196f3',
      risk: 'Low',
    },
    {
      id: 3,
      name: 'Mutual Funds',
      minAmount: '₦10,000',
      returns: '12-20% p.a.',
      duration: 'Flexible',
      icon: 'pie-chart',
      color: '#ff9800',
      risk: 'Medium',
    },
    {
      id: 4,
      name: 'Bonds',
      minAmount: '₦100,000',
      returns: '10-13% p.a.',
      duration: '2-10 years',
      icon: 'description',
      color: '#9c27b0',
      risk: 'Low',
    },
  ];

  const renderInvestmentCard = (investment) => (
    <TouchableOpacity key={investment.id} style={styles.investmentCard}>
      <View style={styles.investmentHeader}>
        <View style={[styles.investmentIcon, { backgroundColor: investment.color + '20' }]}>
          <Icon name={investment.icon} size={24} color={investment.color} />
        </View>
        <View style={styles.investmentInfo}>
          <Text style={styles.investmentName}>{investment.name}</Text>
          <Text style={styles.investmentDuration}>{investment.duration}</Text>
        </View>
        <View style={[
          styles.statusBadge,
          { backgroundColor: investment.status === 'active' ? Colors.successLight : Colors.warningLight }
        ]}>
          <Text style={[
            styles.statusText,
            { color: investment.status === 'active' ? Colors.success : Colors.warning }
          ]}>
            {investment.status === 'active' ? 'Active' : 'Matured'}
          </Text>
        </View>
      </View>

      <View style={styles.investmentDetails}>
        <View style={styles.detailItem}>
          <Text style={styles.detailLabel}>Principal</Text>
          <Text style={styles.detailValue}>₦{investment.amount.toLocaleString()}</Text>
        </View>
        <View style={styles.detailItem}>
          <Text style={styles.detailLabel}>Returns</Text>
          <Text style={[styles.detailValue, { color: Colors.success }]}>
            +₦{investment.returns.toLocaleString()}
          </Text>
        </View>
        <View style={styles.detailItem}>
          <Text style={styles.detailLabel}>Rate</Text>
          <Text style={styles.detailValue}>{investment.percentage}% p.a.</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  const renderInvestmentOption = (option) => (
    <TouchableOpacity key={option.id} style={styles.optionCard}>
      <View style={[styles.optionIcon, { backgroundColor: option.color + '20' }]}>
        <Icon name={option.icon} size={32} color={option.color} />
      </View>
      <Text style={styles.optionName}>{option.name}</Text>
      <View style={styles.optionDetails}>
        <View style={styles.optionDetail}>
          <Icon name="attach-money" size={16} color={Colors.textLight} />
          <Text style={styles.optionDetailText}>{option.minAmount}</Text>
        </View>
        <View style={styles.optionDetail}>
          <Icon name="percent" size={16} color={Colors.textLight} />
          <Text style={styles.optionDetailText}>{option.returns}</Text>
        </View>
        <View style={styles.optionDetail}>
          <Icon name="schedule" size={16} color={Colors.textLight} />
          <Text style={styles.optionDetailText}>{option.duration}</Text>
        </View>
      </View>
      <View style={[
        styles.riskBadge,
        { 
          backgroundColor: option.risk === 'Low' ? Colors.successLight : 
                          option.risk === 'Medium' ? Colors.warningLight : 
                          Colors.errorLight 
        }
      ]}>
        <Text style={[
          styles.riskText,
          { 
            color: option.risk === 'Low' ? Colors.success : 
                   option.risk === 'Medium' ? Colors.warning : 
                   Colors.error 
          }
        ]}>
          {option.risk} Risk
        </Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-back" size={24} color={Colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Investments</Text>
        <TouchableOpacity>
          <Icon name="history" size={24} color={Colors.text} />
        </TouchableOpacity>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>
        
        <LinearGradient
          colors={[Colors.primary, Colors.primaryDark]}
          style={styles.portfolioCard}>
          <Text style={styles.portfolioLabel}>Total Portfolio Value</Text>
          <Text style={styles.portfolioValue}>₦{portfolioValue.toLocaleString()}</Text>
          <View style={styles.portfolioReturns}>
            <Icon name="trending-up" size={20} color={Colors.white} />
            <Text style={styles.portfolioReturnsText}>
              +₦{totalReturns.toLocaleString()} ({returnsPercentage.toFixed(2)}%)
            </Text>
          </View>
        </LinearGradient>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>My Investments</Text>
            <TouchableOpacity>
              <Text style={styles.seeAll}>See All</Text>
            </TouchableOpacity>
          </View>
          {investments.map(renderInvestmentCard)}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Investment Options</Text>
          <View style={styles.optionsGrid}>
            {investmentOptions.map(renderInvestmentOption)}
          </View>
        </View>

        <View style={styles.infoCard}>
          <Icon name="info" size={24} color={Colors.primary} />
          <Text style={styles.infoText}>
            All investments are subject to market risks. Returns are not guaranteed.
            Please read terms and conditions carefully.
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
  portfolioCard: {
    borderRadius: 16,
    padding: Spacing.xl,
    marginBottom: Spacing.lg,
  },
  portfolioLabel: {
    fontSize: 14,
    fontFamily: Fonts.regular,
    color: Colors.white,
    opacity: 0.9,
    marginBottom: Spacing.xs,
  },
  portfolioValue: {
    fontSize: 32,
    fontFamily: Fonts.bold,
    color: Colors.white,
    marginBottom: Spacing.sm,
  },
  portfolioReturns: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  portfolioReturnsText: {
    fontSize: 14,
    fontFamily: Fonts.medium,
    color: Colors.white,
    marginLeft: 4,
  },
  section: {
    marginBottom: Spacing.lg,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: Spacing.md,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: Fonts.semiBold,
    color: Colors.text,
  },
  seeAll: {
    fontSize: 14,
    fontFamily: Fonts.medium,
    color: Colors.primary,
  },
  investmentCard: {
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
  investmentHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  investmentIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.md,
  },
  investmentInfo: {
    flex: 1,
  },
  investmentName: {
    fontSize: 16,
    fontFamily: Fonts.semiBold,
    color: Colors.text,
    marginBottom: 2,
  },
  investmentDuration: {
    fontSize: 12,
    fontFamily: Fonts.regular,
    color: Colors.textLight,
  },
  statusBadge: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 11,
    fontFamily: Fonts.semiBold,
  },
  investmentDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: Spacing.md,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  detailItem: {
    alignItems: 'center',
  },
  detailLabel: {
    fontSize: 11,
    fontFamily: Fonts.regular,
    color: Colors.textLight,
    marginBottom: 4,
  },
  detailValue: {
    fontSize: 14,
    fontFamily: Fonts.semiBold,
    color: Colors.text,
  },
  optionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  optionCard: {
    width: '48%',
    backgroundColor: Colors.white,
    borderRadius: 12,
    padding: Spacing.md,
    marginBottom: Spacing.md,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  optionIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  optionName: {
    fontSize: 14,
    fontFamily: Fonts.semiBold,
    color: Colors.text,
    marginBottom: Spacing.sm,
  },
  optionDetails: {
    marginBottom: Spacing.sm,
  },
  optionDetail: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  optionDetailText: {
    fontSize: 11,
    fontFamily: Fonts.regular,
    color: Colors.textLight,
    marginLeft: 4,
  },
  riskBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: Spacing.sm,
    paddingVertical: 2,
    borderRadius: 8,
  },
  riskText: {
    fontSize: 10,
    fontFamily: Fonts.semiBold,
  },
  infoCard: {
    flexDirection: 'row',
    backgroundColor: Colors.primaryLight,
    padding: Spacing.md,
    borderRadius: 8,
  },
  infoText: {
    flex: 1,
    fontSize: 12,
    fontFamily: Fonts.regular,
    color: Colors.text,
    marginLeft: Spacing.sm,
    lineHeight: 18,
  },
});

export default InvestmentsScreen;