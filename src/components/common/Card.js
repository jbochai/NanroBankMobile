import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Colors } from '../../styles/colors';
import { Spacing, BorderRadius, Shadows } from '../../styles/spacing';

const Card = ({
  children,
  style,
  onPress,
  elevated = true,
  padding = Spacing.md,
  ...props
}) => {
  const CardComponent = onPress ? TouchableOpacity : View;

  return (
    <CardComponent
      style={[
        styles.card,
        elevated && styles.elevated,
        { padding },
        style,
      ]}
      onPress={onPress}
      activeOpacity={onPress ? 0.7 : 1}
      {...props}>
      {children}
    </CardComponent>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.md,
    overflow: 'hidden',
  },
  elevated: {
    ...Shadows.sm,
  },
});

export default Card;