import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  RefreshControl,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import Icon from 'react-native-vector-icons/MaterialIcons';
import moment from 'moment';
import Toast from 'react-native-toast-message';

import Header from '../../components/common/Header';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import EmptyState from '../../components/common/EmptyState';
import TransactionFilterModal from '../../components/transactions/TransactionFilterModal';
import { formatCurrency } from '../../utils/formatting';
import { Colors } from '../../styles/colors';
import { Fonts } from '../../styles/fonts';
import { Spacing, BorderRadius } from '../../styles/spacing';
import {
  fetchTransactions,
  loadMoreTransactions,
  setFilters,
  clearFilters,
  selectTransactions,
  selectTransactionLoading,
  selectTransactionLoadingMore,
  selectTransactionError,
  selectTransactionFilters,
  selectTransactionPagination,
  selectHasMoreTransactions,
} from '../../store/transaction/transactionSlice';

const TransactionsScreen = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();

  // Redux state
  const transactions = useSelector(selectTransactions);
  const isLoading = useSelector(selectTransactionLoading);
  const isLoadingMore = useSelector(selectTransactionLoadingMore);
  const error = useSelector(selectTransactionError);
  const filters = useSelector(selectTransactionFilters);
  const pagination = useSelector(selectTransactionPagination);
  const hasMore = useSelector(selectHasMoreTransactions);

  // Local state
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  // Load transactions on mount
  useEffect(() => {
    loadTransactions();
  }, []);

  // Show error toast
  useEffect(() => {
    if (error) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: error,
      });
    }
  }, [error]);

  const loadTransactions = useCallback(async () => {
    try {
      await dispatch(fetchTransactions({ ...filters, page: 1 })).unwrap();
    } catch (err) {
      console.error('Failed to load transactions:', err);
    }
  }, [dispatch, filters]);

  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      await dispatch(fetchTransactions({ ...filters, page: 1 })).unwrap();
    } catch (err) {
      console.error('Failed to refresh:', err);
    } finally {
      setRefreshing(false);
    }
  }, [dispatch, filters]);

  const handleLoadMore = useCallback(() => {
    if (!isLoadingMore && hasMore) {
      dispatch(loadMoreTransactions());
    }
  }, [dispatch, isLoadingMore, hasMore]);

  const handleApplyFilters = useCallback((newFilters) => {
    dispatch(setFilters(newFilters));
    setShowFilterModal(false);
    // Reload transactions with new filters
    setTimeout(() => {
      dispatch(fetchTransactions({ ...newFilters, page: 1 }));
    }, 100);
  }, [dispatch]);

  const handleClearFilters = useCallback(() => {
    dispatch(clearFilters());
    setShowFilterModal(false);
    // Reload transactions without filters
    setTimeout(() => {
      dispatch(fetchTransactions({ page: 1 }));
    }, 100);
  }, [dispatch]);

  const handleTransactionPress = useCallback((transaction) => {
    navigation.navigate('TransactionDetail', { transaction });
  }, [navigation]);

  const getTransactionIcon = (type) => {
    switch (type) {
      case 'credit':
      case 'deposit':
        return 'arrow-downward';
      case 'debit':
      case 'transfer':
        return 'arrow-upward';
      case 'airtime':
        return 'phone-android';
      case 'data':
        return 'wifi';
      case 'bills':
        return 'receipt';
      case 'withdrawal':
        return 'account-balance-wallet';
      case 'loan':
        return 'monetization-on';
      default:
        return 'sync-alt';
    }
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'completed':
      case 'success':
        return Colors.success;
      case 'pending':
      case 'processing':
        return Colors.warning;
      case 'failed':
        return Colors.error;
      case 'reversed':
        return Colors.info;
      default:
        return Colors.textLight;
    }
  };

  const renderTransactionItem = ({ item }) => {
    const isCredit = item.type === 'credit' || item.type === 'deposit';
    const statusColor = getStatusColor(item.status);

    return (
      <TouchableOpacity
        activeOpacity={0.7}
        onPress={() => handleTransactionPress(item)}
        style={styles.transactionItem}>
        <View style={styles.transactionLeft}>
          <View
            style={[
              styles.iconContainer,
              {
                backgroundColor: isCredit
                  ? `${Colors.success}20`
                  : `${Colors.error}20`,
              },
            ]}>
            <Icon
              name={getTransactionIcon(item.type)}
              size={24}
              color={isCredit ? Colors.success : Colors.error}
            />
          </View>
          <View style={styles.transactionDetails}>
            <Text style={styles.transactionTitle} numberOfLines={1}>
              {item.description ||
                item.recipient_account_name ||
                item.type?.replace('_', ' ').toUpperCase()}
            </Text>
            <View style={styles.transactionMeta}>
              <Text style={styles.transactionDate}>
                {moment(item.created_at).format('MMM DD, YYYY • h:mm A')}
              </Text>
              <View
                style={[styles.statusBadge, { backgroundColor: `${statusColor}20` }]}>
                <Text style={[styles.statusText, { color: statusColor }]}>
                  {item.status}
                </Text>
              </View>
            </View>
            {item.recipient_account_number && (
              <Text style={styles.transactionSubtitle} numberOfLines={1}>
                {item.recipient_account_number} • {item.recipient_bank_name}
              </Text>
            )}
          </View>
        </View>
        <View style={styles.transactionRight}>
          <Text
            style={[
              styles.transactionAmount,
              { color: isCredit ? Colors.success : Colors.error },
            ]}>
            {isCredit ? '+' : '-'}
            {formatCurrency(item.amount)}
          </Text>
          {parseFloat(item.fee) > 0 && (
            <Text style={styles.transactionFee}>Fee: {formatCurrency(item.fee)}</Text>
          )}
        </View>
      </TouchableOpacity>
    );
  };

  const renderListHeader = () => {
    // Show active filters
    const activeFilters = [];
    if (filters.type) activeFilters.push(`Type: ${filters.type}`);
    if (filters.status) activeFilters.push(`Status: ${filters.status}`);
    if (filters.fromDate) activeFilters.push(`From: ${filters.fromDate}`);
    if (filters.toDate) activeFilters.push(`To: ${filters.toDate}`);

    if (activeFilters.length === 0) return null;

    return (
      <View style={styles.activeFiltersContainer}>
        <Text style={styles.activeFiltersTitle}>Active Filters:</Text>
        <View style={styles.filterTagsContainer}>
          {activeFilters.map((filter, index) => (
            <View key={index} style={styles.filterTag}>
              <Text style={styles.filterTagText}>{filter}</Text>
            </View>
          ))}
          <TouchableOpacity
            onPress={handleClearFilters}
            style={styles.clearFiltersButton}>
            <Text style={styles.clearFiltersText}>Clear All</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  const renderListFooter = () => {
    if (!isLoadingMore) return null;

    return (
      <View style={styles.loadingMore}>
        <ActivityIndicator size="small" color={Colors.primary} />
        <Text style={styles.loadingMoreText}>Loading more...</Text>
      </View>
    );
  };

  const renderEmptyState = () => {
    if (isLoading) {
      return (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={Colors.primary} />
          <Text style={styles.loadingText}>Loading transactions...</Text>
        </View>
      );
    }

    return (
      <EmptyState
        icon="receipt-long"
        title="No Transactions Yet"
        message={
          Object.values(filters).some((f) => f !== null)
            ? 'No transactions found matching your filters. Try adjusting your filter criteria.'
            : 'Your transaction history will appear here once you start making transactions.'
        }
        action={
          Object.values(filters).some((f) => f !== null)
            ? {
                label: 'Clear Filters',
                onPress: handleClearFilters,
              }
            : undefined
        }
      />
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <Header
        title="Transactions"
        rightComponent={
          <TouchableOpacity
            onPress={() => setShowFilterModal(true)}
            style={styles.filterButton}>
            <Icon name="filter-list" size={24} color={Colors.primary} />
            {Object.values(filters).some((f) => f !== null) && (
              <View style={styles.filterBadge} />
            )}
          </TouchableOpacity>
        }
      />

      {/* Summary Card */}
      {!isLoading && transactions.length > 0 && (
        <Card style={styles.summaryCard}>
          <View style={styles.summaryRow}>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryLabel}>Total Transactions</Text>
              <Text style={styles.summaryValue}>{pagination.total || 0}</Text>
            </View>
            <View style={styles.summaryDivider} />
            <View style={styles.summaryItem}>
              <Text style={styles.summaryLabel}>This Page</Text>
              <Text style={styles.summaryValue}>{transactions.length}</Text>
            </View>
            <View style={styles.summaryDivider} />
            <View style={styles.summaryItem}>
              <Text style={styles.summaryLabel}>Pages</Text>
              <Text style={styles.summaryValue}>
                {pagination.currentPage} / {pagination.totalPages}
              </Text>
            </View>
          </View>
        </Card>
      )}

      {/* Transaction List */}
      <FlatList
        data={transactions}
        keyExtractor={(item) => item.id?.toString() || item.reference}
        renderItem={renderTransactionItem}
        ListHeaderComponent={renderListHeader}
        ListEmptyComponent={renderEmptyState}
        ListFooterComponent={renderListFooter}
        contentContainerStyle={[
          styles.listContent,
          transactions.length === 0 && styles.emptyListContent,
        ]}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            colors={[Colors.primary]}
            tintColor={Colors.primary}
          />
        }
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.5}
        showsVerticalScrollIndicator={false}
      />

      {/* Filter Modal */}
      <TransactionFilterModal
        visible={showFilterModal}
        filters={filters}
        onApply={handleApplyFilters}
        onClear={handleClearFilters}
        onClose={() => setShowFilterModal(false)}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  filterButton: {
    position: 'relative',
    padding: Spacing.xs,
  },
  filterBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.error,
  },
  summaryCard: {
    marginHorizontal: Spacing.lg,
    marginBottom: Spacing.md,
    padding: Spacing.md,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  summaryItem: {
    flex: 1,
    alignItems: 'center',
  },
  summaryLabel: {
    fontSize: 12,
    fontFamily: Fonts.regular,
    color: Colors.textLight,
    marginBottom: Spacing.xs,
  },
  summaryValue: {
    fontSize: 18,
    fontFamily: Fonts.bold,
    color: Colors.text,
  },
  summaryDivider: {
    width: 1,
    height: 40,
    backgroundColor: Colors.border,
  },
  activeFiltersContainer: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    backgroundColor: Colors.backgroundLight,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  activeFiltersTitle: {
    fontSize: 12,
    fontFamily: Fonts.semiBold,
    color: Colors.textLight,
    marginBottom: Spacing.sm,
  },
  filterTagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
  },
  filterTag: {
    backgroundColor: Colors.primary + '20',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.sm,
  },
  filterTagText: {
    fontSize: 12,
    fontFamily: Fonts.medium,
    color: Colors.primary,
  },
  clearFiltersButton: {
    backgroundColor: Colors.error + '20',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.sm,
  },
  clearFiltersText: {
    fontSize: 12,
    fontFamily: Fonts.medium,
    color: Colors.error,
  },
  listContent: {
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.xl,
  },
  emptyListContent: {
    flexGrow: 1,
  },
  transactionItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: Colors.white,
    padding: Spacing.md,
    marginBottom: Spacing.md,
    borderRadius: BorderRadius.md,
    ...Platform.select({
      ios: {
        shadowColor: Colors.shadow,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  transactionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: Spacing.md,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: BorderRadius.md,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.md,
  },
  transactionDetails: {
    flex: 1,
  },
  transactionTitle: {
    fontSize: 15,
    fontFamily: Fonts.semiBold,
    color: Colors.text,
    marginBottom: Spacing.xs,
  },
  transactionMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.xs,
    gap: Spacing.sm,
  },
  transactionDate: {
    fontSize: 12,
    fontFamily: Fonts.regular,
    color: Colors.textLight,
  },
  statusBadge: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: 2,
    borderRadius: BorderRadius.sm,
  },
  statusText: {
    fontSize: 10,
    fontFamily: Fonts.medium,
    textTransform: 'capitalize',
  },
  transactionSubtitle: {
    fontSize: 12,
    fontFamily: Fonts.regular,
    color: Colors.textLight,
  },
  transactionRight: {
    alignItems: 'flex-end',
  },
  transactionAmount: {
    fontSize: 16,
    fontFamily: Fonts.bold,
    marginBottom: Spacing.xs,
  },
  transactionFee: {
    fontSize: 11,
    fontFamily: Fonts.regular,
    color: Colors.textLight,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.xl,
  },
  loadingText: {
    marginTop: Spacing.md,
    fontSize: 14,
    fontFamily: Fonts.regular,
    color: Colors.textLight,
  },
  loadingMore: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: Spacing.lg,
    gap: Spacing.sm,
  },
  loadingMoreText: {
    fontSize: 14,
    fontFamily: Fonts.regular,
    color: Colors.textLight,
  },
});

export default TransactionsScreen;