import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialIcons';
import * as Animatable from 'react-native-animatable';
import { Colors, Gradients } from '../../styles/colors';
import { Fonts } from '../../styles/fonts';
import { Spacing, BorderRadius, Shadows } from '../../styles/spacing';
import { formatCurrency } from '../../utils/formatting';

const BalanceCard = ({
  balance = 0,
  availableBalance,
  accountNumber,
  accountType = 'Savings Account',
  showActions = true,
  onRefresh,
}) => {
  const [balanceVisible, setBalanceVisible] = useState(true);

  return (
    <Animatable.View animation="fadeInUp" duration={800} style={styles.container}>
      <LinearGradient
        colors={Gradients.primary}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.card}>
        
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.accountType}>{accountType}</Text>
          <View style={styles.actions}>
            {onRefresh && (
              <TouchableOpacity
                style={styles.actionButton}
                onPress={onRefresh}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
                <Icon name="refresh" size={20} color={Colors.white} />
              </TouchableOpacity>
            )}
            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => setBalanceVisible(!balanceVisible)}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
              <Icon
                name={balanceVisible ? 'visibility' : 'visibility-off'}
                size={20}
                color={Colors.white}
              />
            </TouchableOpacity>
          </View>
        </View>

        {/* Balance */}
        <View style={styles.balanceSection}>
          <Text style={styles.balanceLabel}>Total Balance</Text>
          <Text style={styles.balanceAmount}>
            {balanceVisible ? formatCurrency(balance) : '₦ ****.**'}
          </Text>
        </View>

        {/* Account Details */}
        <View style={styles.footer}>
          <View style={styles.accountInfo}>
            <Text style={styles.infoLabel}>Account Number</Text>
            <Text style={styles.infoValue}>
              {accountNumber || 'Loading...'}
            </Text>
          </View>
          
          {availableBalance !== undefined && (
            <View style={styles.accountInfo}>
              <Text style={styles.infoLabel}>Available Balance</Text>
              <Text style={styles.infoValue}>
                {balanceVisible ? formatCurrency(availableBalance) : '₦ ****.**'}
              </Text>
            </View>
          )}
        </View>

        {/* Decorative Elements */}
        <View style={styles.decoration}>
          <View style={styles.circle1} />
          <View style={styles.circle2} />
        </View>
      </LinearGradient>
    </Animatable.View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginHorizontal: Spacing.lg,
    marginVertical: Spacing.md,
  },
  card: {
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    ...Shadows.lg,
    position: 'relative',
    overflow: 'hidden',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  accountType: {
    fontSize: 14,
    fontFamily: Fonts.medium,
    color: Colors.white,
    opacity: 0.9,
  },
  actions: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  actionButton: {
    padding: 4,
  },
  balanceSection: {
    marginBottom: Spacing.lg,
  },
  balanceLabel: {
    fontSize: 14,
    fontFamily: Fonts.regular,
    color: Colors.white,
    opacity: 0.8,
    marginBottom: 4,
  },
  balanceAmount: {
    fontSize: 32,
    fontFamily: Fonts.bold,
    color: Colors.white,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  accountInfo: {
    flex: 1,
  },
  infoLabel: {
    fontSize: 12,
    fontFamily: Fonts.regular,
    color: Colors.white,
    opacity: 0.8,
    marginBottom: 2,
  },
  infoValue: {
    fontSize: 14,
    fontFamily: Fonts.semiBold,
    color: Colors.white,
  },
  decoration: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: '100%',
    height: '100%',
  },
  circle1: {
    position: 'absolute',
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    top: -30,
    right: -30,
  },
  circle2: {
    position: 'absolute',
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    bottom: -20,
    left: -20,
  },
});

export default BalanceCard;