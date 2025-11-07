import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { Colors } from '../../styles/colors';
import { Fonts } from '../../styles/fonts';
import { Spacing } from '../../styles/spacing';

const QuickActions = ({ actions = [], onActionPress }) => {
  const defaultActions = [
    { id: 'transfer', icon: 'send', label: 'Transfer', color: Colors.primary },
    { id: 'airtime', icon: 'phone-android', label: 'Airtime', color: Colors.success },
    { id: 'bills', icon: 'receipt', label: 'Pay Bills', color: Colors.warning },
    { id: 'cards', icon: 'credit-card', label: 'Cards', color: Colors.info },
  ];

  const actionsToRender = actions.length > 0 ? actions : defaultActions;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Quick Actions</Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}>
        {actionsToRender.map((action) => (
          <TouchableOpacity
            key={action.id}
            style={styles.actionButton}
            onPress={() => onActionPress && onActionPress(action.id)}
            activeOpacity={0.7}>
            <View style={[styles.iconContainer, { backgroundColor: `${action.color}20` }]}>
              <Icon name={action.icon} size={24} color={action.color} />
            </View>
            <Text style={styles.label}>{action.label}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: Spacing.lg,
  },
  title: {
    fontSize: 18,
    fontFamily: Fonts.semiBold,
    color: Colors.text,
    marginBottom: Spacing.md,
    paddingHorizontal: Spacing.lg,
  },
  scrollContent: {
    paddingHorizontal: Spacing.lg,
  },
  actionButton: {
    alignItems: 'center',
    marginRight: Spacing.lg,
    width: 72,
  },
  iconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.xs,
  },
  label: {
    fontSize: 12,
    fontFamily: Fonts.medium,
    color: Colors.text,
    textAlign: 'center',
  },
});

export default QuickActions;