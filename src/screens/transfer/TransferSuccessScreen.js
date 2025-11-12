import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  Easing,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute, CommonActions } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { Colors } from '../../styles/colors';
import { Fonts } from '../../styles/fonts';
import { Spacing } from '../../styles/spacing';
import { formatCurrency } from '../../utils/formatting';

const TransferSuccessScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const [scaleAnim] = useState(new Animated.Value(0));
  const [fadeAnim] = useState(new Animated.Value(0));

  useEffect(() => {
    // Animate the success icon
    Animated.parallel([
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 50,
        friction: 7,
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        easing: Easing.ease,
        useNativeDriver: true,
      }),
    ]).start();

    // Navigate to TransactionDetail after animation
    const timer = setTimeout(() => {
      const { transfer } = route.params || {};

      if (transfer) {
        // Reset navigation stack and go to TransactionDetail
        navigation.dispatch(
          CommonActions.reset({
            index: 1,
            routes: [
              { name: 'Home' },
              {
                name: 'TransactionDetail',
                params: { transaction: transfer },
              },
            ],
          })
        );
      } else {
        navigation.navigate('Home');
      }
    }, 2000); // Show success screen for 2 seconds

    return () => clearTimeout(timer);
  }, [navigation, route.params, scaleAnim, fadeAnim]);

  const { transfer, amount, recipient } = route.params || {};

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <View style={styles.content}>
        <Animated.View
          style={[
            styles.iconContainer,
            {
              transform: [{ scale: scaleAnim }],
              opacity: fadeAnim,
            },
          ]}>
          <Icon name="check-circle" size={100} color={Colors.success} />
        </Animated.View>

        <Animated.View style={{ opacity: fadeAnim }}>
          <Text style={styles.title}>Transfer Successful!</Text>
          
          {amount && (
            <Text style={styles.amount}>
              {formatCurrency(amount)}
            </Text>
          )}
          
          {recipient && (
            <Text style={styles.recipient}>
              sent to {recipient}
            </Text>
          )}
          
          <Text style={styles.message}>
            Preparing your receipt...
          </Text>
        </Animated.View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.xl,
  },
  iconContainer: {
    marginBottom: Spacing.xl,
  },
  title: {
    fontSize: 28,
    fontFamily: Fonts.bold,
    color: Colors.text,
    textAlign: 'center',
    marginBottom: Spacing.md,
  },
  amount: {
    fontSize: 36,
    fontFamily: Fonts.bold,
    color: Colors.success,
    textAlign: 'center',
    marginBottom: Spacing.sm,
  },
  recipient: {
    fontSize: 16,
    fontFamily: Fonts.medium,
    color: Colors.textLight,
    textAlign: 'center',
    marginBottom: Spacing.xl,
  },
  message: {
    fontSize: 14,
    fontFamily: Fonts.regular,
    color: Colors.textLight,
    textAlign: 'center',
  },
});

export default TransferSuccessScreen;