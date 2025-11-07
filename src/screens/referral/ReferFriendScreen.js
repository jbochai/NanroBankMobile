import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Share,
  Clipboard,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useNavigation } from '@react-navigation/native';
import { useSelector } from 'react-redux';
import LinearGradient from 'react-native-linear-gradient';
import Toast from 'react-native-toast-message';
import { selectUser } from '../../store/auth/authSlice';
import { Colors } from '../../styles/colors';
import { Fonts } from '../../styles/fonts';
import { Spacing } from '../../styles/spacing';

const ReferFriendScreen = () => {
  const navigation = useNavigation();
  const user = useSelector(selectUser);
  
  const referralCode = user?.id ? `NANRO${user.id.toString().padStart(6, '0')}` : 'NANRO000001';
  const referralLink = `https://nanrobank.com/ref/${referralCode}`;

  const stats = {
    totalReferrals: 12,
    successfulReferrals: 8,
    pendingReferrals: 4,
    totalEarnings: 40000,
  };

  const referrals = [
    {
      id: 1,
      name: 'John Doe',
      status: 'completed',
      reward: 5000,
      date: 'Nov 15, 2024',
    },
    {
      id: 2,
      name: 'Jane Smith',
      status: 'completed',
      reward: 5000,
      date: 'Nov 10, 2024',
    },
    {
      id: 3,
      name: 'Mike Johnson',
      status: 'pending',
      reward: 5000,
      date: 'Nov 5, 2024',
    },
  ];

  const handleCopyCode = () => {
    Clipboard.setString(referralCode);
    Toast.show({
      type: 'success',
      text1: 'Copied!',
      text2: 'Referral code copied to clipboard',
    });
  };

  const handleCopyLink = () => {
    Clipboard.setString(referralLink);
    Toast.show({
      type: 'success',
      text1: 'Copied!',
      text2: 'Referral link copied to clipboard',
    });
  };

  const handleShare = async () => {
    try {
      await Share.share({
        message: `Join Nanro Bank and get ₦5,000 bonus! Use my referral code: ${referralCode}\n\n${referralLink}`,
        title: 'Join Nanro Bank',
      });
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };

  const renderReferral = (referral) => (
    <View key={referral.id} style={styles.referralCard}>
      <View style={styles.referralAvatar}>
        <Text style={styles.referralAvatarText}>
          {referral.name.split(' ').map(n => n[0]).join('')}
        </Text>
      </View>
      <View style={styles.referralInfo}>
        <Text style={styles.referralName}>{referral.name}</Text>
        <Text style={styles.referralDate}>{referral.date}</Text>
      </View>
      <View style={styles.referralRight}>
        <Text style={styles.referralReward}>+₦{referral.reward.toLocaleString()}</Text>
        <View style={[
          styles.statusBadge,
          { backgroundColor: referral.status === 'completed' ? Colors.successLight : Colors.warningLight }
        ]}>
          <Text style={[
            styles.statusText,
            { color: referral.status === 'completed' ? Colors.success : Colors.warning }
          ]}>
            {referral.status === 'completed' ? 'Completed' : 'Pending'}
          </Text>
        </View>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-back" size={24} color={Colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Refer a Friend</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>
        
        <LinearGradient
          colors={[Colors.primary, Colors.primaryDark]}
          style={styles.heroCard}>
          <Icon name="card-giftcard" size={64} color={Colors.white} />
          <Text style={styles.heroTitle}>Earn ₦5,000 Per Referral!</Text>
          <Text style={styles.heroSubtitle}>
            Invite friends and earn rewards when they sign up and complete their first transaction
          </Text>
        </LinearGradient>

        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <Icon name="people" size={24} color={Colors.primary} />
            <Text style={styles.statValue}>{stats.totalReferrals}</Text>
            <Text style={styles.statLabel}>Total Referrals</Text>
          </View>
          <View style={styles.statCard}>
            <Icon name="check-circle" size={24} color={Colors.success} />
            <Text style={styles.statValue}>{stats.successfulReferrals}</Text>
            <Text style={styles.statLabel}>Successful</Text>
          </View>
          <View style={styles.statCard}>
            <Icon name="schedule" size={24} color={Colors.warning} />
            <Text style={styles.statValue}>{stats.pendingReferrals}</Text>
            <Text style={styles.statLabel}>Pending</Text>
          </View>
          <View style={styles.statCard}>
            <Icon name="account-balance-wallet" size={24} color={Colors.primary} />
            <Text style={styles.statValue}>₦{(stats.totalEarnings / 1000).toFixed(0)}k</Text>
            <Text style={styles.statLabel}>Earned</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Your Referral Code</Text>
          <View style={styles.codeCard}>
            <Text style={styles.codeText}>{referralCode}</Text>
            <TouchableOpacity style={styles.copyButton} onPress={handleCopyCode}>
              <Icon name="content-copy" size={20} color={Colors.primary} />
              <Text style={styles.copyButtonText}>Copy</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Referral Link</Text>
          <View style={styles.linkCard}>
            <Text style={styles.linkText} numberOfLines={1}>{referralLink}</Text>
            <TouchableOpacity style={styles.copyButton} onPress={handleCopyLink}>
              <Icon name="content-copy" size={20} color={Colors.primary} />
              <Text style={styles.copyButtonText}>Copy</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.shareSection}>
          <TouchableOpacity style={styles.shareButton} onPress={handleShare}>
            <Icon name="share" size={24} color={Colors.white} />
            <Text style={styles.shareButtonText}>Share Referral Link</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>How It Works</Text>
          <View style={styles.stepsContainer}>
            <View style={styles.stepItem}>
              <View style={styles.stepNumber}>
                <Text style={styles.stepNumberText}>1</Text>
              </View>
              <View style={styles.stepContent}>
                <Text style={styles.stepTitle}>Share Your Code</Text>
                <Text style={styles.stepDescription}>
                  Share your unique referral code or link with friends
                </Text>
              </View>
            </View>

            <View style={styles.stepItem}>
              <View style={styles.stepNumber}>
                <Text style={styles.stepNumberText}>2</Text>
              </View>
              <View style={styles.stepContent}>
                <Text style={styles.stepTitle}>Friend Signs Up</Text>
                <Text style={styles.stepDescription}>
                  Your friend registers using your referral code
                </Text>
              </View>
            </View>

            <View style={styles.stepItem}>
              <View style={styles.stepNumber}>
                <Text style={styles.stepNumberText}>3</Text>
              </View>
              <View style={styles.stepContent}>
                <Text style={styles.stepTitle}>Complete Transaction</Text>
                <Text style={styles.stepDescription}>
                  They make their first transaction of ₦1,000 or more
                </Text>
              </View>
            </View>

            <View style={styles.stepItem}>
              <View style={styles.stepNumber}>
                <Text style={styles.stepNumberText}>4</Text>
              </View>
              <View style={styles.stepContent}>
                <Text style={styles.stepTitle}>Get Rewarded</Text>
                <Text style={styles.stepDescription}>
                  Both of you receive ₦5,000 bonus instantly!
                </Text>
              </View>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Recent Referrals</Text>
          {referrals.length > 0 ? (
            referrals.map(renderReferral)
          ) : (
            <View style={styles.emptyState}>
              <Icon name="people-outline" size={48} color={Colors.textLight} />
              <Text style={styles.emptyStateText}>No referrals yet</Text>
            </View>
          )}
        </View>

        <View style={styles.termsCard}>
          <Icon name="info" size={20} color={Colors.textLight} />
          <Text style={styles.termsText}>
            Terms & Conditions apply. Maximum of 50 referrals per month.
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
  heroCard: {
    borderRadius: 16,
    padding: Spacing.xl,
    alignItems: 'center',
    marginBottom: Spacing.lg,
  },
  heroTitle: {
    fontSize: 24,
    fontFamily: Fonts.bold,
    color: Colors.white,
    marginTop: Spacing.md,
    marginBottom: Spacing.xs,
    textAlign: 'center',
  },
  heroSubtitle: {
    fontSize: 14,
    fontFamily: Fonts.regular,
    color: Colors.white,
    textAlign: 'center',
    opacity: 0.9,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: Spacing.lg,
  },
  statCard: {
    flex: 1,
    backgroundColor: Colors.white,
    borderRadius: 12,
    padding: Spacing.md,
    alignItems: 'center',
    marginHorizontal: 4,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  statValue: {
    fontSize: 18,
    fontFamily: Fonts.bold,
    color: Colors.text,
    marginTop: Spacing.xs,
  },
  statLabel: {
    fontSize: 10,
    fontFamily: Fonts.regular,
    color: Colors.textLight,
    marginTop: 2,
    textAlign: 'center',
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
  codeCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.white,
    borderRadius: 12,
    padding: Spacing.md,
    borderWidth: 2,
    borderColor: Colors.primary,
    borderStyle: 'dashed',
  },
  codeText: {
    fontSize: 24,
    fontFamily: Fonts.bold,
    color: Colors.primary,
    letterSpacing: 2,
  },
  linkCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.white,
    borderRadius: 12,
    padding: Spacing.md,
  },
  linkText: {
    flex: 1,
    fontSize: 12,
    fontFamily: Fonts.regular,
    color: Colors.textLight,
    marginRight: Spacing.sm,
  },
  copyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
  },
  copyButtonText: {
    fontSize: 12,
    fontFamily: Fonts.medium,
    color: Colors.primary,
    marginLeft: 4,
  },
  shareSection: {
    marginBottom: Spacing.lg,
  },
  shareButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.primary,
    borderRadius: 12,
    paddingVertical: Spacing.md,
  },
  shareButtonText: {
    fontSize: 16,
    fontFamily: Fonts.semiBold,
    color: Colors.white,
    marginLeft: Spacing.sm,
  },
  stepsContainer: {
    backgroundColor: Colors.white,
    borderRadius: 12,
    padding: Spacing.md,
  },
  stepItem: {
    flexDirection: 'row',
    marginBottom: Spacing.md,
  },
  stepNumber: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.md,
  },
  stepNumberText: {
    fontSize: 14,
    fontFamily: Fonts.bold,
    color: Colors.primary,
  },
  stepContent: {
    flex: 1,
  },
  stepTitle: {
    fontSize: 14,
    fontFamily: Fonts.semiBold,
    color: Colors.text,
    marginBottom: 2,
  },
  stepDescription: {
    fontSize: 12,
    fontFamily: Fonts.regular,
    color: Colors.textLight,
    lineHeight: 18,
  },
  referralCard: {
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
  referralAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.md,
  },
  referralAvatarText: {
    fontSize: 14,
    fontFamily: Fonts.semiBold,
    color: Colors.primary,
  },
  referralInfo: {
    flex: 1,
  },
  referralName: {
    fontSize: 14,
    fontFamily: Fonts.medium,
    color: Colors.text,
    marginBottom: 2,
  },
  referralDate: {
    fontSize: 11,
    fontFamily: Fonts.regular,
    color: Colors.textLight,
  },
  referralRight: {
    alignItems: 'flex-end',
  },
  referralReward: {
    fontSize: 14,
    fontFamily: Fonts.semiBold,
    color: Colors.success,
    marginBottom: 4,
  },
  statusBadge: {
    paddingHorizontal: Spacing.xs,
    paddingVertical: 2,
    borderRadius: 8,
  },
  statusText: {
    fontSize: 10,
    fontFamily: Fonts.semiBold,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: Spacing.xl,
  },
  emptyStateText: {
    fontSize: 14,
    fontFamily: Fonts.regular,
    color: Colors.textLight,
    marginTop: Spacing.sm,
  },
  termsCard: {
    flexDirection: 'row',
    backgroundColor: Colors.background,
    padding: Spacing.md,
    borderRadius: 8,
  },
  termsText: {
    flex: 1,
    fontSize: 11,
    fontFamily: Fonts.regular,
    color: Colors.textLight,
    marginLeft: Spacing.sm,
    lineHeight: 16,
  },
});

export default ReferFriendScreen;