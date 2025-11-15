import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
  TouchableOpacity,
  FlatList,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialIcons';
import * as Animatable from 'react-native-animatable';
import moment from 'moment';
import Toast from 'react-native-toast-message';

import { selectUser } from '../../store/auth/authSlice';
import { 
  fetchAccountBalance, 
  selectBalance,
  selectAvailableBalance,
  selectAccountNumber,
} from '../../store/account/accountSlice';
import { 
  fetchRecentTransactions,
  selectRecentTransactions,
  selectRecentTransactionsMemoized,
} from '../../store/transaction/transactionSlice';
import { Colors } from '../../styles/colors';
import { Fonts, Typography } from '../../styles/fonts';
import { Spacing, BorderRadius, Shadows } from '../../styles/spacing';
import { formatCurrency, formatRelativeTime } from '../../utils/formatting';
import { fetchUnreadCount, selectUnreadCount,} from '../../store/notification/notificationSlice';

const DashboardScreen = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const user = useSelector(selectUser);
  const balance = useSelector(selectBalance);
  const availableBalance = useSelector(selectAvailableBalance);
  const accountNumber = useSelector(selectAccountNumber);
  //const recentTransactions = useSelector(selectRecentTransactions);
  const recentTransactions = useSelector(selectRecentTransactionsMemoized);
  const [refreshing, setRefreshing] = useState(false);
  const [balanceVisible, setBalanceVisible] = useState(true);
  const unreadCount = useSelector(selectUnreadCount); // ← ADD THIS
  const [selectedService, setSelectedService] = useState(null);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      await Promise.all([
        dispatch(fetchAccountBalance()).unwrap(),
        dispatch(fetchRecentTransactions({ limit: 5 })).unwrap(),
        dispatch(fetchUnreadCount()).unwrap(), 

      ]);
    } catch (error) {
      console.log('Dashboard data load error:', error);
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Failed to load dashboard data',
      });
    }
  };

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadDashboardData();
    setRefreshing(false);
  }, []);

  const getGreeting = () => {
    const hour = moment().hour();
    if (hour < 12) return 'Good Morning';
    if (hour < 17) return 'Good Afternoon';
    return 'Good Evening';
  };

  const quickActions = [
    {
      id: 'transfer',
      title: 'Transfer',
      icon: 'send',
      color: Colors.primary,
      onPress: () => navigation.navigate('Transfer'),
    },
    {
      id: 'airtime',
      title: 'Airtime',
      icon: 'phone-android',
      color: Colors.success,
      onPress: () => navigation.navigate('Airtime'),
    },
    {
      id: 'bills',
      title: 'Pay Bills',
      icon: 'receipt',
      color: Colors.warning,
      onPress: () => navigation.navigate('BillPayment'),
    },
    {
      id: 'cards',
      title: 'Cards',
      icon: 'credit-card',
      color: Colors.info,
      onPress: () => navigation.navigate('Cards'),
    },
    {
      id: 'loans',
      title: 'Loans',
      icon: 'account-balance',
      color: Colors.secondary,
      onPress: () => navigation.navigate('Loans'),
    },
    {
      id: 'more',
      title: 'More',
      icon: 'apps',
      color: Colors.textLight,
      onPress: () => navigation.navigate('Services'),
    },
  ];

  const services = [
    {
      id: 'investments',
      title: 'Investments',
      description: 'Grow your wealth with smart investments',
      icon: 'trending-up',
      color: Colors.success,
      badge: 'New',
      onPress: () => navigation.navigate('Investments'),
    },
    {
      id: 'savings',
      title: 'Savings Goals',
      description: 'Save for your dreams and future',
      icon: 'savings',
      color: Colors.primary,
      onPress: () => navigation.navigate('Savings'),
    },
    {
      id: 'budgets',
      title: 'Budget Planner',
      description: 'Track and manage your expenses',
      icon: 'pie-chart',
      color: Colors.warning,
      onPress: () => navigation.navigate('Budgets'),
    },
    {
      id: 'statements',
      title: 'Account Statement',
      description: 'Download your transaction history',
      icon: 'description',
      color: Colors.info,
      onPress: () => navigation.navigate('Statements'),
    },
  ];

  const announcements = [
    {
      id: 1,
      title: 'New Feature: Virtual Cards',
      description: 'Create virtual cards for online shopping',
      image: require('../../assets/images/virtual-card.png'),
    },
    {
      id: 2,
      title: 'Earn 5% on Savings',
      description: 'Open a savings account today',
      image: require('../../assets/images/savings-promo.png'),
    },
  ];

  const renderHeader = () => (
    <>
      {/* Welcome Section */}
      <LinearGradient
        colors={[Colors.primary, Colors.primaryDark]}
        style={styles.headerGradient}>
        
        {/* User Greeting */}
        <View style={styles.headerContent}>
          <View style={styles.greetingContainer}>
            <Text style={styles.greetingText}>{getGreeting()},</Text>
            <Text style={styles.userName}>{user?.first_name} 👋</Text>
          </View>
          <View style={styles.headerActions}>
            <TouchableOpacity
              style={styles.headerButton}
              onPress={() => navigation.navigate('QRScanner')}>
              <Icon name="qr-code-scanner" size={24} color={Colors.white} />
            </TouchableOpacity>
          <TouchableOpacity
          style={styles.headerButton}
          onPress={() => navigation.navigate('Notifications')}>
          <Icon name="notifications" size={24} color={Colors.white} />
          {unreadCount > 0 && (
          <View style={styles.notificationBadge}>
          <Text style={styles.badgeText}>{unreadCount > 99 ? '99+' : unreadCount}</Text>
          </View>
          )}
          </TouchableOpacity>
          </View>
        </View>

        {/* Balance Card */}
        <Animatable.View animation="fadeInUp" duration={800}>
          <TouchableOpacity
            activeOpacity={0.9}
            onPress={() => setBalanceVisible(!balanceVisible)}
            style={styles.balanceCard}>
            
            <View style={styles.balanceHeader}>
              <View>
                <Text style={styles.balanceLabel}>Total Balance</Text>
                <Text style={styles.balanceAmount}>
                  {balanceVisible
                    ? formatCurrency(balance || 0)
                    : '₦ ****.**'}
                </Text>
              </View>
              <TouchableOpacity
                onPress={() => setBalanceVisible(!balanceVisible)}
                style={styles.visibilityButton}>
                <Icon
                  name={balanceVisible ? 'visibility' : 'visibility-off'}
                  size={20}
                  color={Colors.white}
                />
              </TouchableOpacity>
            </View>

            <View style={styles.balanceFooter}>
              <View style={styles.accountInfo}>
                <Text style={styles.accountLabel}>Account Number</Text>
                <Text style={styles.accountNumber}>
                  {accountNumber || 'Loading...'}
                </Text>
              </View>
              <View style={styles.accountInfo}>
                <Text style={styles.accountLabel}>Available</Text>
                <Text style={styles.accountNumber}>
                  {balanceVisible
                    ? formatCurrency(availableBalance || balance || 0)
                    : '₦ ****.**'}
                </Text>
              </View>
            </View>

            {/* Card Design Elements */}
            <View style={styles.cardDesign}>
              <View style={styles.cardCircle1} />
              <View style={styles.cardCircle2} />
            </View>
          </TouchableOpacity>
        </Animatable.View>

        {/* Quick Stats */}
        <View style={styles.quickStats}>
          <View style={styles.statItem}>
            <Icon name="arrow-upward" size={20} color={Colors.success} />
            <View style={styles.statInfo}>
              <Text style={styles.statValue}>₦25,000</Text>
              <Text style={styles.statLabel}>Income</Text>
            </View>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Icon name="arrow-downward" size={20} color={Colors.error} />
            <View style={styles.statInfo}>
              <Text style={styles.statValue}>₦12,500</Text>
              <Text style={styles.statLabel}>Expense</Text>
            </View>
          </View>
        </View>
      </LinearGradient>

      {/* Quick Actions */}
      <View style={styles.quickActionsSection}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <TouchableOpacity onPress={() => navigation.navigate('AllServices')}>
            <Text style={styles.seeAll}>See All</Text>
          </TouchableOpacity>
        </View>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.actionsContainer}>
          {quickActions.map((action) => (
            <TouchableOpacity
              key={action.id}
              style={styles.actionButton}
              onPress={action.onPress}>
              <View
                style={[styles.actionIcon, { backgroundColor: action.color + '20' }]}>
                <Icon name={action.icon} size={24} color={action.color} />
              </View>
              <Text style={styles.actionText}>{action.title}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Announcements Carousel */}
      <View style={styles.announcementsSection}>
        <ScrollView
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.announcementsContainer}>
          {announcements.map((announcement) => (
            <TouchableOpacity
              key={announcement.id}
              style={styles.announcementCard}
              onPress={() => navigation.navigate('AnnouncementDetail', { announcement })}>
              <LinearGradient
                colors={[Colors.primary, Colors.primaryLight]}
                style={styles.announcementGradient}>
                <View style={styles.announcementContent}>
                  <Text style={styles.announcementTitle}>{announcement.title}</Text>
                  <Text style={styles.announcementDescription}>
                    {announcement.description}
                  </Text>
                  <View style={styles.announcementButton}>
                    <Text style={styles.announcementButtonText}>Learn More</Text>
                    <Icon name="arrow-forward" size={16} color={Colors.white} />
                  </View>
                </View>
                {/* Placeholder for image */}
                <View style={styles.announcementImage} />
              </LinearGradient>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Banking Services */}
      <View style={styles.servicesSection}>
        <Text style={styles.sectionTitle}>Banking Services</Text>
        <View style={styles.servicesGrid}>
          {services.map((service) => (
            <TouchableOpacity
              key={service.id}
              style={styles.serviceCard}
              onPress={service.onPress}
              activeOpacity={0.7}>
              <View
                style={[styles.serviceIcon, { backgroundColor: service.color + '20' }]}>
                <Icon name={service.icon} size={28} color={service.color} />
              </View>
              {service.badge && (
                <View style={styles.serviceBadge}>
                  <Text style={styles.serviceBadgeText}>{service.badge}</Text>
                </View>
              )}
              <Text style={styles.serviceTitle}>{service.title}</Text>
              <Text style={styles.serviceDescription} numberOfLines={2}>
                {service.description}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Recent Transactions Header */}
      <View style={styles.transactionHeader}>
        <Text style={styles.sectionTitle}>Recent Transactions</Text>
        <TouchableOpacity onPress={() => navigation.navigate('Transactions')}>
          <Text style={styles.seeAll}>View All</Text>
        </TouchableOpacity>
      </View>
    </>
  );

  const renderTransaction = ({ item }) => {
    // Determine if transaction is credit based on type or amount
    const isCredit = item.type === 'credit' || 
                     item.type === 'deposit' || 
                     (item.metadata && item.metadata.transfer_type === 'intra_bank_credit');
    
    const getTransactionIcon = () => {
      // Use the type field to determine icon
      switch (item.type) {
        case 'transfer': return 'swap-horiz';
        case 'airtime': return 'phone-android';
        case 'bill_payment': return 'receipt';
        case 'deposit': return 'account-balance-wallet';
        case 'withdrawal': return 'money';
        default: return isCredit ? 'arrow-downward' : 'arrow-upward';
      }
    };

    // Get display text for transaction
    const getTransactionTitle = () => {
      if (item.description) return item.description;
      if (item.recipient_account_name) return item.recipient_account_name;
      
      // Fallback to type-based title
      switch (item.type) {
        case 'transfer': return 'Transfer';
        case 'airtime': return 'Airtime Purchase';
        case 'bill_payment': return 'Bill Payment';
        case 'deposit': return 'Deposit';
        case 'withdrawal': return 'Withdrawal';
        default: return item.type || 'Transaction';
      }
    };

    return (
      <TouchableOpacity
        style={styles.transactionItem}
        onPress={() => navigation.navigate('TransactionDetail', { transaction: item })}>
        <View style={styles.transactionLeft}>
          <View
            style={[
              styles.transactionIcon,
              { backgroundColor: isCredit ? Colors.successLight : Colors.errorLight },
            ]}>
            <Icon
              name={getTransactionIcon()}
              size={20}
              color={isCredit ? Colors.success : Colors.error}
            />
          </View>
          <View style={styles.transactionDetails}>
            <Text style={styles.transactionTitle} numberOfLines={1}>
              {getTransactionTitle()}
            </Text>
            <Text style={styles.transactionDate}>
              {formatRelativeTime(item.created_at)}
            </Text>
          </View>
        </View>
        <View style={styles.transactionRight}>
          <Text
            style={[
              styles.transactionAmount,
              { color: isCredit ? Colors.success : Colors.text },
            ]}>
            {isCredit ? '+' : '-'}
            {formatCurrency(Math.abs(parseFloat(item.amount)))}
          </Text>
          <Text style={styles.transactionStatus}>
            {item.status || 'completed'}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <FlatList
        data={recentTransactions}
        renderItem={renderTransaction}
        keyExtractor={(item) => item.reference || item.id?.toString()}
        ListHeaderComponent={renderHeader}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Icon name="receipt-long" size={48} color={Colors.textLight} />
            <Text style={styles.emptyText}>No recent transactions</Text>
            <Text style={styles.emptySubtext}>
              Your recent transactions will appear here
            </Text>
          </View>
        }
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[Colors.primary]}
            tintColor={Colors.primary}
          />
        }
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  listContent: {
    paddingBottom: 100,
  },
  headerGradient: {
    paddingTop: Spacing.md,
    paddingBottom: Spacing.xl,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    marginBottom: Spacing.lg,
  },
  greetingContainer: {
    flex: 1,
  },
  greetingText: {
    fontSize: 14,
    fontFamily: Fonts.regular,
    color: Colors.white,
    opacity: 0.9,
  },
  userName: {
    fontSize: 24,
    fontFamily: Fonts.semiBold,
    color: Colors.white,
    marginTop: 2,
  },
  headerActions: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  headerButton: {
    position: 'relative',
    padding: Spacing.sm,
  },
  notificationBadge: {
    position: 'absolute',
    top: 5,
    right: 5,
    backgroundColor: Colors.error,
    borderRadius: 10,
    width: 18,
    height: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeText: {
    fontSize: 10,
    fontFamily: Fonts.semiBold,
    color: Colors.white,
  },
  balanceCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    marginHorizontal: Spacing.lg,
    padding: Spacing.lg,
    borderRadius: 20,
    backdropFilter: 'blur(10px)',
    overflow: 'hidden',
  },
  balanceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: Spacing.md,
  },
  balanceLabel: {
    fontSize: 12,
    fontFamily: Fonts.regular,
    color: Colors.white,
    opacity: 0.8,
    marginBottom: Spacing.xs,
  },
  balanceAmount: {
    fontSize: 32,
    fontFamily: Fonts.bold,
    color: Colors.white,
  },
  visibilityButton: {
    padding: Spacing.xs,
  },
  balanceFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.2)',
    paddingTop: Spacing.md,
  },
  accountInfo: {
    flex: 1,
  },
  accountLabel: {
    fontSize: 10,
    fontFamily: Fonts.regular,
    color: Colors.white,
    opacity: 0.7,
    marginBottom: 2,
  },
  accountNumber: {
    fontSize: 14,
    fontFamily: Fonts.medium,
    color: Colors.white,
  },
  cardDesign: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: '100%',
    height: '100%',
    overflow: 'hidden',
  },
  cardCircle1: {
    position: 'absolute',
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    top: -30,
    right: -30,
  },
  cardCircle2: {
    position: 'absolute',
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    bottom: -20,
    left: -20,
  },
  quickStats: {
    flexDirection: 'row',
    marginHorizontal: Spacing.lg,
    marginTop: Spacing.lg,
    padding: Spacing.md,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 12,
  },
  statItem: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  statInfo: {
    marginLeft: Spacing.sm,
  },
  statValue: {
    fontSize: 16,
    fontFamily: Fonts.semiBold,
    color: Colors.white,
  },
  statLabel: {
    fontSize: 10,
    fontFamily: Fonts.regular,
    color: Colors.white,
    opacity: 0.7,
  },
  statDivider: {
    width: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    marginHorizontal: Spacing.md,
  },
  quickActionsSection: {
    marginTop: Spacing.lg,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
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
  actionsContainer: {
    paddingHorizontal: Spacing.lg,
  },
  actionButton: {
    alignItems: 'center',
    marginRight: Spacing.lg,
  },
  actionIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.xs,
  },
  actionText: {
    fontSize: 12,
    fontFamily: Fonts.medium,
    color: Colors.text,
  },
  announcementsSection: {
    marginTop: Spacing.lg,
    height: 140,
  },
  announcementsContainer: {
    paddingHorizontal: Spacing.lg,
  },
  announcementCard: {
    width: 320,
    marginRight: Spacing.md,
  },
  announcementGradient: {
    height: 140,
    borderRadius: 16,
    padding: Spacing.lg,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  announcementContent: {
    flex: 1,
    justifyContent: 'space-between',
  },
  announcementTitle: {
    fontSize: 16,
    fontFamily: Fonts.semiBold,
    color: Colors.white,
    marginBottom: Spacing.xs,
  },
  announcementDescription: {
    fontSize: 12,
    fontFamily: Fonts.regular,
    color: Colors.white,
    opacity: 0.9,
    marginBottom: Spacing.sm,
  },
  announcementButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  announcementButtonText: {
    fontSize: 12,
    fontFamily: Fonts.medium,
    color: Colors.white,
    marginRight: Spacing.xs,
  },
  announcementImage: {
    width: 80,
    height: '100%',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 8,
  },
  servicesSection: {
    padding: Spacing.lg,
  },
  servicesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: Spacing.md,
    marginHorizontal: -Spacing.xs,
  },
  serviceCard: {
    width: '50%',
    padding: Spacing.xs,
  },
  serviceCardInner: {
    backgroundColor: Colors.white,
    borderRadius: 12,
    padding: Spacing.md,
    alignItems: 'center',
    ...Shadows.sm,
    position: 'relative',
  },
  serviceIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.sm,
  },
  serviceBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: Colors.error,
    borderRadius: 8,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  serviceBadgeText: {
    fontSize: 9,
    fontFamily: Fonts.semiBold,
    color: Colors.white,
  },
  serviceTitle: {
    fontSize: 14,
    fontFamily: Fonts.semiBold,
    color: Colors.text,
    marginBottom: Spacing.xs,
    textAlign: 'center',
  },
  serviceDescription: {
    fontSize: 11,
    fontFamily: Fonts.regular,
    color: Colors.textLight,
    textAlign: 'center',
    lineHeight: 14,
  },
  transactionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    marginTop: Spacing.md,
    marginBottom: Spacing.sm,
  },
  transactionItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: Colors.white,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  transactionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  transactionIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.md,
  },
  transactionDetails: {
    flex: 1,
  },
  transactionTitle: {
    fontSize: 14,
    fontFamily: Fonts.medium,
    color: Colors.text,
    marginBottom: 2,
  },
  transactionDate: {
    fontSize: 12,
    fontFamily: Fonts.regular,
    color: Colors.textLight,
  },
  transactionRight: {
    alignItems: 'flex-end',
  },
  transactionAmount: {
    fontSize: 16,
    fontFamily: Fonts.semiBold,
    marginBottom: 2,
  },
  transactionStatus: {
    fontSize: 10,
    fontFamily: Fonts.regular,
    color: Colors.textLight,
    textTransform: 'capitalize',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.xl * 2,
    backgroundColor: Colors.white,
  },
  emptyText: {
    marginTop: Spacing.md,
    fontSize: 16,
    fontFamily: Fonts.medium,
    color: Colors.text,
  },
  emptySubtext: {
    marginTop: Spacing.xs,
    fontSize: 14,
    fontFamily: Fonts.regular,
    color: Colors.textLight,
  },
});

export default DashboardScreen;