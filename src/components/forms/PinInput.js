import React, { useState, useRef, useEffect } from 'react';
import { View, TextInput, StyleSheet } from 'react-native';
import { Colors } from '../../styles/colors';
import { Spacing, BorderRadius } from '../../styles/spacing';

const PinInput = ({ length = 4, value, onChangeText, onComplete, secureTextEntry = true }) => {
  const [pin, setPin] = useState(value || '');
  const inputRefs = useRef([]);

  useEffect(() => {
    if (value !== undefined) {
      setPin(value);
    }
  }, [value]);

  const handleChange = (text, index) => {
    // Only allow numbers
    const numericText = text.replace(/[^0-9]/g, '');
    
    if (numericText.length > 1) {
      // Handle paste
      const pastedPin = numericText.slice(0, length);
      setPin(pastedPin);
      onChangeText && onChangeText(pastedPin);
      
      if (pastedPin.length === length) {
        onComplete && onComplete(pastedPin);
        inputRefs.current[length - 1]?.blur();
      } else {
        inputRefs.current[pastedPin.length]?.focus();
      }
    } else if (numericText.length === 1) {
      const newPin = pin.substring(0, index) + numericText + pin.substring(index + 1);
      setPin(newPin);
      onChangeText && onChangeText(newPin);

      if (index < length - 1) {
        inputRefs.current[index + 1]?.focus();
      } else {
        inputRefs.current[index]?.blur();
        onComplete && onComplete(newPin);
      }
    } else if (numericText.length === 0 && pin[index]) {
      // Backspace
      const newPin = pin.substring(0, index) + pin.substring(index + 1);
      setPin(newPin);
      onChangeText && onChangeText(newPin);

      if (index > 0) {
        inputRefs.current[index - 1]?.focus();
      }
    }
  };

  const handleKeyPress = (e, index) => {
    if (e.nativeEvent.key === 'Backspace' && !pin[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  return (
    <View style={styles.container}>
      {Array.from({ length }).map((_, index) => (
        <TextInput
          key={index}
          ref={(ref) => (inputRefs.current[index] = ref)}
          style={[styles.input, pin[index] && styles.inputFilled]}
          value={pin[index] || ''}
          onChangeText={(text) => handleChange(text, index)}
          onKeyPress={(e) => handleKeyPress(e, index)}
          keyboardType="number-pad"
          maxLength={1}
          secureTextEntry={secureTextEntry}
          selectTextOnFocus
        />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: Spacing.md,
  },
  input: {
    width: 56,
    height: 64,
    borderWidth: 2,
    borderColor: Colors.border,
    borderRadius: BorderRadius.md,
    fontSize: 24,
    textAlign: 'center',
    color: Colors.text,
    backgroundColor: Colors.white,
  },
  inputFilled: {
    borderColor: Colors.primary,
    backgroundColor: Colors.primaryLight,
  },
});

export default PinInput;