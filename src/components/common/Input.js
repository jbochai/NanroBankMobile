import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Platform,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import * as Animatable from 'react-native-animatable';

import { Colors } from '../../styles/colors';
import { Fonts, Typography } from '../../styles/fonts';
import { Spacing, BorderRadius } from '../../styles/spacing';

const Input = ({
  label,
  placeholder,
  value,
  onChangeText,
  onBlur,
  onFocus,
  error,
  secureTextEntry = false,
  keyboardType = 'default',
  autoCapitalize = 'sentences',
  autoCorrect = true,
  editable = true,
  multiline = false,
  numberOfLines = 1,
  maxLength,
  leftIcon,
  rightIcon,
  onLeftIconPress,
  onRightIconPress,
  containerStyle,
  inputStyle,
  labelStyle,
  errorStyle,
  showErrorIcon = true,
  required = false,
  ...props
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [isSecure, setIsSecure] = useState(secureTextEntry);

  const handleFocus = () => {
    setIsFocused(true);
    if (onFocus) onFocus();
  };

  const handleBlur = () => {
    setIsFocused(false);
    if (onBlur) onBlur();
  };

  const toggleSecureEntry = () => {
    setIsSecure(!isSecure);
  };

  const getBorderColor = () => {
    if (error) return Colors.error;
    if (isFocused) return Colors.primary;
    return Colors.border;
  };

  const getBackgroundColor = () => {
    if (!editable) return Colors.backgroundLight;
    if (isFocused) return Colors.white;
    return Colors.white;
  };

  return (
    <View style={[styles.container, containerStyle]}>
      {label && (
        <Text style={[styles.label, labelStyle]}>
          {label}
          {required && <Text style={styles.required}> *</Text>}
        </Text>
      )}
      
      <Animatable.View
        animation={error ? 'shake' : undefined}
        duration={500}
        style={[
          styles.inputContainer,
          {
            borderColor: getBorderColor(),
            backgroundColor: getBackgroundColor(),
          },
          !editable && styles.disabledContainer,
        ]}>
        
        {leftIcon && (
          <TouchableOpacity
            onPress={onLeftIconPress}
            disabled={!onLeftIconPress}
            style={styles.leftIconContainer}>
            <Icon
              name={leftIcon}
              size={20}
              color={isFocused ? Colors.primary : Colors.textLight}
            />
          </TouchableOpacity>
        )}
        
        <TextInput
          style={[
            styles.input,
            inputStyle,
            multiline && styles.multilineInput,
            leftIcon && styles.inputWithLeftIcon,
            rightIcon && styles.inputWithRightIcon,
          ]}
          placeholder={placeholder}
          placeholderTextColor={Colors.textMuted}
          value={value}
          onChangeText={onChangeText}
          onFocus={handleFocus}
          onBlur={handleBlur}
          secureTextEntry={isSecure}
          keyboardType={keyboardType}
          autoCapitalize={autoCapitalize}
          autoCorrect={autoCorrect}
          editable={editable}
          multiline={multiline}
          numberOfLines={numberOfLines}
          maxLength={maxLength}
          selectionColor={Colors.primary}
          {...props}
        />
        
        {secureTextEntry && (
          <TouchableOpacity
            onPress={toggleSecureEntry}
            style={styles.rightIconContainer}>
            <Icon
              name={isSecure ? 'visibility' : 'visibility-off'}
              size={20}
              color={Colors.textLight}
            />
          </TouchableOpacity>
        )}
        
        {rightIcon && !secureTextEntry && (
          <TouchableOpacity
            onPress={onRightIconPress}
            disabled={!onRightIconPress}
            style={styles.rightIconContainer}>
            <Icon
              name={rightIcon}
              size={20}
              color={isFocused ? Colors.primary : Colors.textLight}
            />
          </TouchableOpacity>
        )}
        
        {error && showErrorIcon && (
          <View style={styles.errorIconContainer}>
            <Icon name="error-outline" size={20} color={Colors.error} />
          </View>
        )}
      </Animatable.View>
      
      {error && (
        <Animatable.Text
          animation="fadeIn"
          duration={300}
          style={[styles.errorText, errorStyle]}>
          {error}
        </Animatable.Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: Spacing.lg,
  },
  label: {
    ...Typography.label,
    color: Colors.text,
    marginBottom: Spacing.xs,
  },
  required: {
    color: Colors.error,
    fontSize: 14,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: BorderRadius.input,
    backgroundColor: Colors.white,
    minHeight: 48,
    overflow: 'hidden',
  },
  disabledContainer: {
    opacity: 0.6,
  },
  leftIconContainer: {
    paddingLeft: Spacing.md,
    paddingRight: Spacing.xs,
  },
  rightIconContainer: {
    paddingRight: Spacing.md,
    paddingLeft: Spacing.xs,
  },
  errorIconContainer: {
    paddingRight: Spacing.md,
    paddingLeft: Spacing.xs,
  },
  input: {
    flex: 1,
    ...Typography.input,
    color: Colors.text,
    paddingVertical: Platform.OS === 'ios' ? Spacing.md : Spacing.sm,
    paddingHorizontal: Spacing.md,
  },
  multilineInput: {
    minHeight: 100,
    textAlignVertical: 'top',
    paddingTop: Spacing.md,
  },
  inputWithLeftIcon: {
    paddingLeft: 0,
  },
  inputWithRightIcon: {
    paddingRight: 0,
  },
  errorText: {
    ...Typography.caption,
    color: Colors.error,
    marginTop: Spacing.xs,
    marginLeft: Spacing.xs,
  },
});

export default Input;