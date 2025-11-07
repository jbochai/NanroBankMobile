import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  View,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialIcons';
import * as Animatable from 'react-native-animatable';

import { Colors, Gradients } from '../../styles/colors';
import { Typography } from '../../styles/fonts';
import { Spacing, BorderRadius, Shadows } from '../../styles/spacing';

const Button = ({
  title,
  onPress,
  disabled = false,
  loading = false,
  variant = 'primary', // primary, secondary, outline, ghost, danger
  size = 'medium', // small, medium, large
  icon,
  iconPosition = 'left',
  fullWidth = true,
  gradient = false,
  style,
  textStyle,
  loadingColor,
  children,
  ...props
}) => {
  const isDisabled = disabled || loading;

  const getButtonStyles = () => {
    const baseStyles = [styles.button, styles[`button_${size}`]];
    
    // Modified: Only add fullWidth style if explicitly true
    if (fullWidth === true) {
      baseStyles.push(styles.fullWidth);
    } else if (fullWidth === false) {
      baseStyles.push(styles.flexWidth);
    }
    
    if (variant === 'outline') baseStyles.push(styles.outlineButton);
    if (variant === 'ghost') baseStyles.push(styles.ghostButton);
    if (variant === 'secondary') baseStyles.push(styles.secondaryButton);
    if (variant === 'danger') baseStyles.push(styles.dangerButton);
    if (isDisabled) baseStyles.push(styles.disabledButton);
    
    return [...baseStyles, style];
  };

  const getTextStyles = () => {
    const baseStyles = [styles.text, styles[`text_${size}`]];
    
    if (variant === 'outline') baseStyles.push(styles.outlineText);
    if (variant === 'ghost') baseStyles.push(styles.ghostText);
    if (variant === 'secondary') baseStyles.push(styles.secondaryText);
    if (variant === 'danger' && variant !== 'outline') baseStyles.push(styles.dangerTextSolid);
    if (isDisabled) baseStyles.push(styles.disabledText);
    
    return [...baseStyles, textStyle];
  };

  const getLoadingColor = () => {
    if (loadingColor) return loadingColor;
    if (variant === 'outline' || variant === 'ghost') return Colors.primary;
    if (variant === 'danger') return Colors.white;
    return Colors.white;
  };

  const getIconColor = () => {
    if (variant === 'outline' || variant === 'ghost') return Colors.primary;
    if (variant === 'secondary') return Colors.primary;
    return Colors.white;
  };

  const renderContent = () => (
    <>
      {loading ? (
        <ActivityIndicator color={getLoadingColor()} size="small" />
      ) : (
        <>
          {icon && iconPosition === 'left' && (
            <Icon
              name={icon}
              size={size === 'small' ? 16 : size === 'large' ? 24 : 20}
              color={getIconColor()}
              style={styles.leftIcon}
            />
          )}
          
          {children || <Text style={getTextStyles()}>{title}</Text>}
          
          {icon && iconPosition === 'right' && (
            <Icon
              name={icon}
              size={size === 'small' ? 16 : size === 'large' ? 24 : 20}
              color={getIconColor()}
              style={styles.rightIcon}
            />
          )}
        </>
      )}
    </>
  );

  // Modified: Container view styling
  const containerStyle = fullWidth === true ? styles.fullWidth : fullWidth === false ? styles.flexWidth : null;

  if (gradient && variant === 'primary' && !isDisabled) {
    return (
      <Animatable.View
        animation="fadeIn"
        duration={300}
        style={containerStyle}>
        <TouchableOpacity
          onPress={onPress}
          disabled={isDisabled}
          activeOpacity={0.8}
          {...props}>
          <LinearGradient
            colors={Gradients.primary}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={getButtonStyles()}>
            {renderContent()}
          </LinearGradient>
        </TouchableOpacity>
      </Animatable.View>
    );
  }

  return (
    <Animatable.View
      animation="fadeIn"
      duration={300}
      style={containerStyle}>
      <TouchableOpacity
        style={getButtonStyles()}
        onPress={onPress}
        disabled={isDisabled}
        activeOpacity={0.7}
        {...props}>
        {renderContent()}
      </TouchableOpacity>
    </Animatable.View>
  );
};

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: BorderRadius.button,
    backgroundColor: Colors.primary,
    ...Shadows.sm,
  },
  fullWidth: {
    width: '100%',
  },
  flexWidth: {
    flex: 1, // Added: Allows button to take flex space from parent
  },
  
  // Size variations
  button_small: {
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
    minHeight: 36,
  },
  button_medium: {
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.lg,
    minHeight: 48,
  },
  button_large: {
    paddingVertical: Spacing.lg,
    paddingHorizontal: Spacing.xl,
    minHeight: 56,
  },
  
  // Variant styles
  outlineButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: Colors.primary,
    ...Shadows.none,
  },
  ghostButton: {
    backgroundColor: 'transparent',
    ...Shadows.none,
  },
  secondaryButton: {
    backgroundColor: Colors.secondary,
  },
  dangerButton: {
    backgroundColor: Colors.error,
  },
  disabledButton: {
    backgroundColor: Colors.borderDark,
    ...Shadows.none,
  },
  
  // Text styles
  text: {
    ...Typography.button,
    color: Colors.white,
  },
  text_small: {
    fontSize: 14,
  },
  text_medium: {
    fontSize: 16,
  },
  text_large: {
    fontSize: 18,
  },
  outlineText: {
    color: Colors.primary,
  },
  ghostText: {
    color: Colors.primary,
  },
  secondaryText: {
    color: Colors.primary,
  },
  dangerTextSolid: {
    color: Colors.white,
  },
  disabledText: {
    color: Colors.textMuted,
  },
  
  // Icon styles
  leftIcon: {
    marginRight: Spacing.xs,
  },
  rightIcon: {
    marginLeft: Spacing.xs,
  },
});

export default Button;