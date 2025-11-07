import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/MaterialIcons';

// Import screens
import DashboardScreen from '../screens/dashboard/DashboardScreen';
import TransactionsScreen from '../screens/transactions/TransactionsScreen';
import CardsScreen from '../screens/cards/CardsScreen';
import ProfileScreen from '../screens/profile/ProfileScreen';

import { Colors } from '../styles/colors';
import { Fonts } from '../styles/fonts';

const Tab = createBottomTabNavigator();

const TabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: Colors.primary,
        tabBarInactiveTintColor: Colors.textLight,
        tabBarStyle: {
          height: 60,
          paddingBottom: 8,
          paddingTop: 8,
          borderTopWidth: 1,
          borderTopColor: Colors.border,
          backgroundColor: Colors.white,
        },
        tabBarLabelStyle: {
          fontFamily: Fonts.medium,
          fontSize: 12,
        },
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'Dashboard') {
            iconName = 'home';
          } else if (route.name === 'Transactions') {
            iconName = 'receipt';
          } else if (route.name === 'Cards') {
            iconName = 'credit-card';
          } else if (route.name === 'Profile') {
            iconName = 'person';
          }

          return <Icon name={iconName} size={size} color={color} />;
        },
      })}>
      <Tab.Screen name="Dashboard" component={DashboardScreen} />
      <Tab.Screen name="Transactions" component={TransactionsScreen} />
      <Tab.Screen name="Cards" component={CardsScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
};

export default TabNavigator;