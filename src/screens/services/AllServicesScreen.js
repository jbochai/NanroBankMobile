import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useNavigation } from '@react-navigation/native';
import { Colors } from '../../styles/colors';
import { Fonts } from '../../styles/fonts';
import { Spacing } from '../../styles/spacing';

const AllServicesScreen = () => {
  const navigation = useNavigation();

  const services = [
    {
      id: 1,
      name: 'Transfer Money',
      icon: 'send',
      color: Colors.primary,
      screen: 'Transfer',
    },
    {
      id: 2,
      name: 'Pay Bills',
      icon: 'receipt',
      color: '#f44336',
      screen: 'BillPayment',
    },
    {
      id: 3,
      name: 'Buy Airtime',
      icon: 'phone',
      color: '#4caf50',
      screen: 'Airtime',
    },
    {
      id: 4,
      name: 'Buy Data',
      icon: 'wifi',
      color: '#2196f3',
      screen: 'Data',
    },
    {
      id: 5,
      name: 'Investments',
      icon: 'trending-up',
      color: '#ff9800',
      screen: 'Investments',
    },
    {
      id: 6,
      name: 'Savings',
      icon: 'account-balance',
      color: '#9c27b0',
      screen: 'Savings',
    },
    {
      id: 7,
      name: 'Loans',
      icon: 'money',
      color: '#795548',
      screen: 'Loans',
    },
    {
      id: 8,
      name: 'Request Card',
      icon: 'credit-card',
      color: '#607d8b',
      screen: 'RequestCard',
    },
    {
      id: 9,
      name: 'Account Statement',
      icon: 'description',
      color: '#e91e63',
      screen: 'AccountStatement',
    },
    {
      id: 10,
      name: 'Beneficiaries',
      icon: 'people',
      color: '#00bcd4',
      screen: 'Beneficiaries',
    },
    {
      id: 11,
      name: 'Refer a Friend',
      icon: 'share',
      color: '#8bc34a',
      screen: 'ReferFriend',
    },
    {
      id: 12,
      name: 'Support',
      icon: 'help',
      color: '#ffc107',
      screen: 'Support',
    },
  ];

  const renderServiceItem = (service) => (
    <TouchableOpacity
      key={service.id}
      style={styles.serviceItem}
      onPress={() => navigation.navigate(service.screen)}>
      <View style={[styles.iconContainer, { backgroundColor: service.color + '20' }]}>
        <Icon name={service.icon} size={32} color={service.color} />
      </View>
      <Text style={styles.serviceName}>{service.name}</Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-back" size={24} color={Colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>All Services</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>
        <View style={styles.servicesGrid}>
          {services.map(renderServiceItem)}
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
  servicesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  serviceItem: {
    width: '48%',
    backgroundColor: Colors.white,
    borderRadius: 12,
    padding: Spacing.lg,
    marginBottom: Spacing.md,
    alignItems: 'center',
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  iconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  serviceName: {
    fontSize: 14,
    fontFamily: Fonts.medium,
    color: Colors.text,
    textAlign: 'center',
  },
});

export default AllServicesScreen;