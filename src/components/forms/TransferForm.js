import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import Input from '../common/Input';
import Button from '../common/Button';
import { validateAccountNumber, validateAmount, validateNarration } from '../../utils/validation';
import { Spacing } from '../../styles/spacing';

const TransferForm = ({ onSubmit, loading = false }) => {
  const [formData, setFormData] = useState({
    accountNumber: '',
    accountName: '',
    amount: '',
    narration: '',
    bankCode: '',
  });

  const [errors, setErrors] = useState({});

  const handleChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors({ ...errors, [field]: null });
    }
  };

  const validate = () => {
    const newErrors = {};

    const accountValidation = validateAccountNumber(formData.accountNumber);
    if (!accountValidation.isValid) {
      newErrors.accountNumber = accountValidation.error;
    }

    const amountValidation = validateAmount(formData.amount);
    if (!amountValidation.isValid) {
      newErrors.amount = amountValidation.error;
    }

    const narrationValidation = validateNarration(formData.narration);
    if (!narrationValidation.isValid) {
      newErrors.narration = narrationValidation.error;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validate()) {
      onSubmit && onSubmit(formData);
    }
  };

  return (
    <View style={styles.container}>
      <Input
        label="Account Number"
        placeholder="Enter 10-digit account number"
        value={formData.accountNumber}
        onChangeText={(value) => handleChange('accountNumber', value)}
        keyboardType="number-pad"
        maxLength={10}
        error={errors.accountNumber}
      />

      <Input
        label="Amount"
        placeholder="Enter amount"
        value={formData.amount}
        onChangeText={(value) => handleChange('amount', value)}
        keyboardType="decimal-pad"
        error={errors.amount}
      />

      <Input
        label="Narration (Optional)"
        placeholder="What's this for?"
        value={formData.narration}
        onChangeText={(value) => handleChange('narration', value)}
        multiline
        maxLength={100}
        error={errors.narration}
      />

      <Button
        title="Continue"
        onPress={handleSubmit}
        loading={loading}
        gradient
        style={styles.submitButton}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: Spacing.lg,
  },
  submitButton: {
    marginTop: Spacing.lg,
  },
});

export default TransferForm;