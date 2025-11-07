import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useNavigation } from '@react-navigation/native';
import Toast from 'react-native-toast-message';
import Button from '../../components/common/Button';
import { Colors } from '../../styles/colors';
import { Fonts } from '../../styles/fonts';
import { Spacing } from '../../styles/spacing';
import api from '../../api/client';

const ChangePinScreen = () => {
  const navigation = useNavigation();
  const [isLoading, setIsLoading] = useState(false);
  const [currentPin, setCurrentPin] = useState(['', '', '', '']);
  const [newPin, setNewPin] = useState(['', '', '', '']);
  const [confirmPin, setConfirmPin] = useState(['', '', '', '']);
  
  const currentPinRefs = useRef([]);
  const newPinRefs = useRef([]);
  const confirmPinRefs = useRef([]);

  const handlePinChange = (value, index, pinArray, setPinArray, refs) => {
    if (!/^\d*$/.test(value)) return;

    const newPinArray = [...pinArray];
    newPinArray[index] = value;
    setPinArray(newPinArray);

    if (value && index < 3) {
      refs.current[index + 1]?.focus();
    }
  };

  const handlePinKeyPress = (e, index, pinArray, setPinArray, refs) => {
    if (e.nativeEvent.key === 'Backspace' && !pinArray[index] && index > 0) {
      refs.current[index - 1]?.focus();
    }
  };

  const handleSubmit = async () => {
    const currentPinValue = currentPin.join('');
    const newPinValue = newPin.join('');
    const confirmPinValue = confirmPin.join('');

    if (currentPinValue.length !== 4) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Please enter current PIN',
      });
      return;
    }

    if (newPinValue.length !== 4) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Please enter new PIN',
      });
      return;
    }

    if (confirmPinValue.length !== 4) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Please confirm new PIN',
      });
      return;
    }

    if (newPinValue !== confirmPinValue) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'PINs do not match',
      });
      return;
    }

    if (currentPinValue === newPinValue) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'New PIN must be different from current PIN',
      });
      return;
    }

    setIsLoading(true);

    try {
      const response = await api.post('/auth/change-pin', {
        current_pin: currentPinValue,
        new_pin: newPinValue,
        new_pin_confirmation: confirmPinValue,
      });

      if (response.data.success) {
        Toast.show({
          type: 'success',
          text1: 'PIN Changed',
          text2: 'Your transaction PIN has been updated successfully',
        });
        navigation.goBack();
      }
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: error.response?.data?.message || 'Failed to change PIN',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const renderPinInput = (pinArray, setPinArray, refs, label) => (
    <View style={styles.pinSection}>
      <Text style={styles.pinLabel}>{label}</Text>
      <View style={styles.pinContainer}>
        {pinArray.map((digit, index) => (
          <TextInput
            key={index}
            ref={(ref) => (refs.current[index] = ref)}
            style={styles.pinInput}
            value={digit}
            onChangeText={(value) => handlePinChange(value, index, pinArray, setPinArray, refs)}
            onKeyPress={(e) => handlePinKeyPress(e, index, pinArray, setPinArray, refs)}
            keyboardType="number-pad"
            maxLength={1}
            secureTextEntry
            selectTextOnFocus
          />
        ))}
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-back" size={24} color={Colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Change PIN</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>
        
        <View style={styles.infoCard}>
          <Icon name="info" size={24} color={Colors.primary} />
          <Text style={styles.infoText}>
            Your transaction PIN is used to authorize payments and transfers.
            Choose a PIN that's easy to remember but hard to guess.
          </Text>
        </View>

        <View style={styles.form}>
          <View style={styles.iconContainer}>
            <Icon name="lock" size={48} color={Colors.primary} />
          </View>

          {renderPinInput(currentPin, setCurrentPin, currentPinRefs, 'Current PIN')}
          {renderPinInput(newPin, setNewPin, newPinRefs, 'New PIN')}
          {renderPinInput(confirmPin, setConfirmPin, confirmPinRefs, 'Confirm New PIN')}

          <View style={styles.tipsCard}>
            <Text style={styles.tipsTitle}>PIN Tips:</Text>
            <View style={styles.tipItem}>
              <Icon name="check" size={16} color={Colors.success} />
              <Text style={styles.tipText}>Use a unique 4-digit PIN</Text>
            </View>
            <View style={styles.tipItem}>
              <Icon name="check" size={16} color={Colors.success} />
              <Text style={styles.tipText}>Avoid sequential numbers (1234)</Text>
            </View>
            <View style={styles.tipItem}>
              <Icon name="check" size={16} color={Colors.success} />
              <Text style={styles.tipText}>Don't use birthdays or obvious dates</Text>
            </View>
          </View>

          <Button
            title="Change PIN"
            onPress={handleSubmit}
            loading={isLoading}
            style={styles.submitButton}
          />
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
  form: {
    backgroundColor: Colors.white,
    borderRadius: 12,
    padding: Spacing.lg,
  },
  iconContainer: {
    alignSelf: 'center',
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: Colors.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.xl,
  },
  pinSection: {
    marginBottom: Spacing.xl,
  },
  pinLabel: {
    fontSize: 14,
    fontFamily: Fonts.medium,
    color: Colors.text,
    marginBottom: Spacing.sm,
  },
  pinContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  pinInput: {
    width: 60,
    height: 60,
    borderWidth: 2,
    borderColor: Colors.border,
    borderRadius: 8,
    fontSize: 24,
    fontFamily: Fonts.bold,
    textAlign: 'center',
    color: Colors.text,
  },
  tipsCard: {
    backgroundColor: Colors.background,
    padding: Spacing.md,
    borderRadius: 8,
    marginBottom: Spacing.lg,
  },
  tipsTitle: {
    fontSize: 14,
    fontFamily: Fonts.semiBold,
    color: Colors.text,
    marginBottom: Spacing.sm,
  },
  tipItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: Spacing.xs,
  },
  tipText: {
    fontSize: 12,
    fontFamily: Fonts.regular,
    color: Colors.textLight,
    marginLeft: Spacing.xs,
  },
  submitButton: {
    marginTop: Spacing.md,
  },
});

export default ChangePinScreen;