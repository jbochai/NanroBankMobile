import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useNavigation } from '@react-navigation/native';
import { Colors } from '../../styles/colors';
import { Fonts } from '../../styles/fonts';
import { Spacing } from '../../styles/spacing';

const PlaceholderScreen = ({ title = 'Coming Soon' }) => {
  const navigation = useNavigation();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton} 
          onPress={() => navigation.goBack()}>
          <Icon name="arrow-back" size={24} color={Colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{title}</Text>
        <View style={styles.placeholder} />
      </View>
      
      <View style={styles.content}>
        <View style={styles.iconContainer}>
          <Icon name="construction" size={80} color={Colors.primary} />
        </View>
        <Text style={styles.title}>Coming Soon</Text>
        <Text style={styles.subtitle}>
          This feature will be available soon.{'\n'}
          We're working hard to bring it to you!
        </Text>
        
        <TouchableOpacity 
          style={styles.button}
          onPress={() => navigation.navigate('HomeTabs')}>
          <Text style={styles.buttonText}>Go to Dashboard</Text>
        </TouchableOpacity>
      </View>
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
  backButton: {
    padding: Spacing.xs,
  },
  headerTitle: {
    fontSize: 18,
    fontFamily: Fonts.semiBold,
    color: Colors.text,
    flex: 1,
    textAlign: 'center',
  },
  placeholder: {
    width: 40,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.xl,
  },
  iconContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: Colors.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.xl,
  },
  title: {
    fontSize: 28,
    fontFamily: Fonts.bold,
    color: Colors.text,
    marginBottom: Spacing.md,
  },
  subtitle: {
    fontSize: 16,
    fontFamily: Fonts.regular,
    color: Colors.textLight,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: Spacing.xl * 2,
  },
  button: {
    backgroundColor: Colors.primary,
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.md,
    borderRadius: 8,
    minWidth: 200,
  },
  buttonText: {
    fontSize: 16,
    fontFamily: Fonts.semiBold,
    color: Colors.white,
    textAlign: 'center',
  },
});

export default PlaceholderScreen;