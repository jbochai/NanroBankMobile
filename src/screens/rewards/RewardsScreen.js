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

const RewardsScreen = () => {
  const navigation = useNavigation();

  const totalPoints = 12500;
  const tierLevel = 'Gold';
  const pointsToNextTier = 2500;

  const rewards = [
    {
      id: 1,
      title: '₦1,000 Cashback',
      description: 'Redeem 1,000 points for ₦1,000',
      points: 1000,
      icon: 'account-balance-wallet',
      color: '#4caf50',
      available: true,
    },
    {
      id: 2,
      title: '5% Transfer Discount',
      description: 'Get 5% discount on next 5 transfers',
      points: 2000,
      icon: 'send',
      color: Colors.primary,
      available: true,
    },
    {
      id: 3,
      title: 'Free Bill Payment',
      description: 'One free bill payment transaction',
      points: 500,
      icon: 'receipt',
      color: '#ff9800',
      available: true,
    },
    {
      id: 4,
      title: '₦5,000 Cashback',
      description: 'Redeem 5,000 points for ₦5,000',
      points: 5000,
      icon: 'account-balance-wallet',
      color: '#4caf50',
      available: true,
    },
    {
      id: 5,
      title: 'Premium Support',
      description: '3 months of priority customer support',
      points: 10000,
      icon: 'support-agent',
      color: '#9c27b0',
      available: true,
    },
    {
      id: 6,
      title: '₦20,000 Cashback',
      description: 'Redeem 20,000 points for ₦20,000',
      points: 20000,
      icon: 'account-balance-wallet',
      color: '#4caf50',
      available: false,
    },
  ];

  const pointsHistory = [
    {
      id: 1,
      description: 'Transfer to John Doe',
      points: '+50',
      date: '2024-11-25',
      type: 'earned',
    },
    {
      id: 2,
      description: 'Bill Payment - DSTV',
      points: '+25',
      date: '2024-11-23',
      type: 'earned',
    },
    {
      id: 3,
      description: 'Redeemed: ₦1,000 Cashback',
      points: '-1000',
      date: '2024-11-20',
      type: 'redeemed',
    },
    {
      id: 4,
      description: 'Referral Bonus',
      points: '+500',
      date: '2024-11-15',
      type: 'earned',
    },
  ];

  const earnMethods = [
    {
      id: 1,
      title: 'Transfers',
      points: '5 points per ₦1,000',
      icon: 'send',
    },
    {
      id: 2,
      title: 'Bill Payments',
      points: '3 points per transaction',
      icon: 'receipt',
    },
    {
      id: 3,
      title: 'Referrals',
      points: '500 points per referral',
      icon: 'people',
    },
    {
      id: 4,
      title: 'Savings',
      points: '10 points per ₦10,000',
      icon: 'savings',
    },
  ];

  const renderRewardCard = (reward) => (
    <TouchableOpacity
      key={reward.id}
      style={[
        styles.rewardCard,
        !reward.available && styles.rewardCardDisabled,
      ]}
      disabled={!reward.available || totalPoints < reward.points}>
      <View style={[styles.rewardIcon, { backgroundColor: reward.color + '20' }]}>
        <Icon name={reward.icon} size={32} color={reward.color} />
      </View>
      <View style={styles.rewardContent}>
        <Text style={styles.rewardTitle}>{reward.title}</Text>
        <Text style={styles.rewardDescription}>{reward.description}</Text>
        <View style={styles.rewardFooter}>
          <View style={styles.pointsBadge}>
            <Icon name="stars" size={16} color={Colors.warning} />
            <Text style={styles.pointsText}>{reward.points} points</Text>
          </View>
          {totalPoints >= reward.points && reward.available ? (
            <Text style={styles.redeemText}>Redeem →</Text>
          ) : (
            <Text style={styles.lockedText}>
              {reward.available ? 'Locked' : 'Not Available'}
            </Text>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );

  const renderHistoryItem = (item) => (
    <View key={item.id} style={styles.historyItem}>
      <View style={[
        styles.historyIcon,
        { backgroundColor: item.type === 'earned' ? Colors.successLight : Colors.errorLight }
      ]}>
        <Icon
          name={item.type === 'earned' ? 'add' : 'remove'}
          size={20}
          color={item.type === 'earned' ? Colors.success : Colors.error}
        />
      </View>
      <View style={styles.historyContent}>
        <Text style={styles.historyDescription}>{item.description}</Text>
        <Text style={styles.historyDate}>{item.date}</Text>
      </View>
      <Text style={[
        styles.historyPoints,
        { color: item.type === 'earned' ? Colors.success : Colors.error }
      ]}>
        {item.points}
      </Text>
    </View>
  );

  const renderEarnMethod = (method) => (
    <View key={method.id} style={styles.earnMethodCard}>
      <Icon name={method.icon} size={24} color={Colors.primary} />
      <View style={styles.earnMethodContent}>
        <Text style={styles.earnMethodTitle}>{method.title}</Text>
        <Text style={styles.earnMethodPoints}>{method.points}</Text>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-back" size={24} color={Colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Rewards</Text>
        <TouchableOpacity>
          <Icon name="history" size={24} color={Colors.text} />
        </TouchableOpacity>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>
        
        <LinearGradient
          colors={[Colors.primary, Colors.primaryDark]}
          style={styles.pointsCard}>
          <View style={styles.pointsHeader}>
            <View>
              <Text style={styles.pointsLabel}>Your Points</Text>
              <Text style={styles.pointsValue}>{totalPoints.toLocaleString()}</Text>
            </View>
            <View style={styles.tierBadge}>
              <Icon name="stars" size={20} color={Colors.warning} />
              <Text style={styles.tierText}>{tierLevel}</Text>
            </View>
          </View>
          <View style={styles.progressContainer}>
            <View style={styles.progressBar}>
              <View style={[styles.progressFill, { width: '80%' }]} />
            </View>
            <Text style={styles.progressText}>
              {pointsToNextTier} points to Platinum tier
            </Text>
          </View>
        </LinearGradient>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Redeem Rewards</Text>
          {rewards.map(renderRewardCard)}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>How to Earn Points</Text>
          {earnMethods.map(renderEarnMethod)}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Points History</Text>
          {pointsHistory.map(renderHistoryItem)}
        </View>

        <View style={styles.infoCard}>
          <Icon name="info" size={20} color={Colors.primary} />
          <Text style={styles.infoText}>
            Points expire after 12 months of inactivity. Keep using your account to maintain your points!
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
  pointsCard: {
    borderRadius: 16,
    padding: Spacing.xl,
    marginBottom: Spacing.lg,
  },
  pointsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: Spacing.lg,
  },
  pointsLabel: {
    fontSize: 14,
    fontFamily: Fonts.regular,
    color: Colors.white,
    opacity: 0.9,
    marginBottom: Spacing.xs,
  },
  pointsValue: {
    fontSize: 36,
    fontFamily: Fonts.bold,
    color: Colors.white,
  },
  tierBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    borderRadius: 20,
  },
  tierText: {
    fontSize: 14,
    fontFamily: Fonts.semiBold,
    color: Colors.white,
    marginLeft: 4,
  },
  progressContainer: {
    marginTop: Spacing.sm,
  },
  progressBar: {
    height: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: Spacing.xs,
  },
  progressFill: {
    height: '100%',
    backgroundColor: Colors.white,
    borderRadius: 4,
  },
  progressText: {
    fontSize: 12,
    fontFamily: Fonts.regular,
    color: Colors.white,
    opacity: 0.9,
  },
  section: {
    marginBottom: Spacing.lg,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: Fonts.semiBold,
    color: Colors.text,
    marginBottom: Spacing.md,
  },
  rewardCard: {
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
  rewardCardDisabled: {
    opacity: 0.6,
  },
  rewardIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.md,
  },
  rewardContent: {
    flex: 1,
  },
  rewardTitle: {
    fontSize: 15,
    fontFamily: Fonts.semiBold,
    color: Colors.text,
    marginBottom: 2,
  },
  rewardDescription: {
    fontSize: 12,
    fontFamily: Fonts.regular,
    color: Colors.textLight,
    marginBottom: Spacing.sm,
  },
  rewardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  pointsBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.warningLight,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 4,
    borderRadius: 12,
  },
  pointsText: {
    fontSize: 11,
    fontFamily: Fonts.semiBold,
    color: Colors.warning,
    marginLeft: 4,
  },
  redeemText: {
    fontSize: 12,
    fontFamily: Fonts.semiBold,
    color: Colors.primary,
  },
  lockedText: {
    fontSize: 12,
    fontFamily: Fonts.regular,
    color: Colors.textLight,
  },
  earnMethodCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    borderRadius: 12,
    padding: Spacing.md,
    marginBottom: Spacing.sm,
  },
  earnMethodContent: {
    marginLeft: Spacing.md,
  },
  earnMethodTitle: {
    fontSize: 14,
    fontFamily: Fonts.semiBold,
    color: Colors.text,
    marginBottom: 2,
  },
  earnMethodPoints: {
    fontSize: 12,
    fontFamily: Fonts.regular,
    color: Colors.textLight,
  },
  historyItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    borderRadius: 12,
    padding: Spacing.md,
    marginBottom: Spacing.sm,
  },
  historyIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.md,
  },
  historyContent: {
    flex: 1,
  },
  historyDescription: {
    fontSize: 13,
    fontFamily: Fonts.medium,
    color: Colors.text,
    marginBottom: 2,
  },
  historyDate: {
    fontSize: 11,
    fontFamily: Fonts.regular,
    color: Colors.textLight,
  },
  historyPoints: {
    fontSize: 14,
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

export default RewardsScreen;