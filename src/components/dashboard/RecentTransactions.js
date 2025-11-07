import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import moment from 'moment';
import { Colors } from '../../styles/colors';
import { Fonts } from '../../styles/fonts';
import { Spacing } from '../../styles/spacing';
import { formatCurrency } from '../../utils/formatting';

const RecentTransactions = ({ transactions = [], onTransactionPress, onViewAll }) => {
  const renderTransaction = ({ item }) => {
    const isCredit = item.type === 'credit' || item.type === 'deposit';
    const iconName = isCredit ? 'arrow-downward' : 'arrow-upward';
    const iconColor = isCredit ? Colors.success : Colors.error;

    return (
      <TouchableOpacity
        style={styles.transactionItem}
        onPress={() => onTransactionPress && onTransactionPress(item)}
        activeOpacity={0.7}>
        <View style={[styles.iconContainer, { backgroundColor: `${iconColor}20` }]}>
          <Icon name={iconName} size={20} color={iconColor} />
        </View>
        
        <View style={styles.detailsContainer}>
          <Text style={styles.title} numberOfLines={1}>{item.narration || item.type}</Text>
          <Text style={styles.date}>{moment(item.created_at).format('MMM DD, h:mm A')}</Text>
        </View>

        <View style={styles.amountContainer}>
          <Text style={[styles.amount, { color: iconColor }]}>
            {isCredit ? '+' : '-'}{formatCurrency(item.amount)}
          </Text>
          <Text style={styles.status}>{item.status}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Recent Transactions</Text>
        {onViewAll && (
          <TouchableOpacity onPress={onViewAll}>
            <Text style={styles.viewAll}>View All</Text>
          </TouchableOpacity>
        )}
      </View>

      {transactions.length > 0 ? (
        <FlatList
          data={transactions}
          renderItem={renderTransaction}
          keyExtractor={(item) => item.id.toString()}
          scrollEnabled={false}
        />
      ) : (
        <View style={styles.emptyState}>
          <Icon name="receipt-long" size={48} color={Colors.textMuted} />
          <Text style={styles.emptyText}>No recent transactions</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: Spacing.lg,
    backgroundColor: Colors.white,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
  },
  headerTitle: {
    fontSize: 18,
    fontFamily: Fonts.semiBold,
    color: Colors.text,
  },
  viewAll: {
    fontSize: 14,
    fontFamily: Fonts.medium,
    color: Colors.primary,
  },
  transactionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.md,
  },
  detailsContainer: {
    flex: 1,
  },
  title: {
    fontSize: 14,
    fontFamily: Fonts.medium,
    color: Colors.text,
    marginBottom: 2,
  },
  date: {
    fontSize: 12,
    fontFamily: Fonts.regular,
    color: Colors.textLight,
  },
  amountContainer: {
    alignItems: 'flex-end',
  },
  amount: {
    fontSize: 16,
    fontFamily: Fonts.semiBold,
    marginBottom: 2,
  },
  status: {
    fontSize: 10,
    fontFamily: Fonts.regular,
    color: Colors.textLight,
    textTransform: 'capitalize',
  },
  emptyState: {
    alignItems: 'center',
    padding: Spacing.xl * 2,
  },
  emptyText: {
    marginTop: Spacing.md,
    fontSize: 14,
    fontFamily: Fonts.regular,
    color: Colors.textMuted,
  },
});

export default RecentTransactions;