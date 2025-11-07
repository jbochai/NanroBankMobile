import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import Icon from 'react-native-vector-icons/MaterialIcons';
import LinearGradient from 'react-native-linear-gradient';
import Toast from 'react-native-toast-message';

import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Loader from '../../components/common/Loader';
import Alert from '../../components/common/Alert';
import { selectUser } from '../../store/auth/authSlice';
import { logout } from '../../store/auth/authSlice';
import { Colors, Gradients } from '../../styles/colors';
import { Fonts } from '../../styles/fonts';
import { Spacing, BorderRadius } from '../../styles/spacing';

const ProfileScreen = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  
  const user = useSelector(selectUser);
  
  const [loading, setLoading] = useState(false);
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);

  const menuItems = [
    {
      id: 'personal',
      title: 'Personal Information',
      icon: 'person',
      color: Colors.primary,
      onPress: () => navigation.navigate('PersonalInfo'),
    },
    {
      id: 'security',
      title: 'Security Settings',
      icon: 'security',
      color: Colors.success,
      onPress: () => navigation.navigate('SecuritySettings'),
    },
    {
      id: 'settings',
      title: 'App Settings',
      icon: 'settings',
      color: Colors.info,
      onPress: () => navigation.navigate('Settings'),
    },
    {
      id: 'notifications',
      title: 'Notifications',
      icon: 'notifications',
      color: Colors.warning,
      onPress: () => navigation.navigate('NotificationSettings'),
    },
    {
      id: 'limits',
      title: 'Transaction Limits',
      icon: 'account-balance-wallet',
      color: Colors.secondary,
      onPress: () => navigation.navigate('TransactionLimits'),
    },
    {
      id: 'linked',
      title: 'Linked Accounts',
      icon: 'link',
      color: Colors.primary,
      onPress: () => navigation.navigate('LinkedAccounts'),
    },
    {
      id: 'support',
      title: 'Help & Support',
      icon: 'help',
      color: Colors.info,
      onPress: () => navigation.navigate('Support'),
    },
    {
      id: 'about',
      title: 'About',
      icon: 'info',
      color: Colors.textLight,
      onPress: () => navigation.navigate('About'),
    },
  ];

  const handleLogout = async () => {
    setShowLogoutDialog(false);
    setLoading(true);

    try {
      await dispatch(logout()).unwrap();
      
      Toast.show({
        type: 'success',
        text1: 'Logged Out',
        text2: 'You have been logged out successfully',
      });
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: error.message || 'Failed to logout',
      });
    } finally {
      setLoading(false);
    }
  };

  const renderMenuItem = (item) => (
    <TouchableOpacity
      key={item.id}
      style={styles.menuItem}
      onPress={item.onPress}
      activeOpacity={0.7}>
      <View style={[styles.menuIcon, { backgroundColor: `${item.color}20` }]}>
        <Icon name={item.icon} size={24} color={item.color} />
      </View>
      <Text style={styles.menuTitle}>{item.title}</Text>
      <Icon name="chevron-right" size={24} color={Colors.textLight} />
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <ScrollView style={styles.scrollView}>
        {/* Profile Header */}
        <LinearGradient
          colors={Gradients.primary}
          style={styles.profileHeader}>
          <TouchableOpacity
            style={styles.editButton}
            onPress={() => navigation.navigate('EditProfile')}>
            <Icon name="edit" size={20} color={Colors.white} />
          </TouchableOpacity>

          <View style={styles.avatarContainer}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>
                {user?.first_name?.charAt(0)}{user?.last_name?.charAt(0)}
              </Text>
            </View>
            <TouchableOpacity style={styles.cameraButton}>
              <Icon name="camera-alt" size={16} color={Colors.white} />
            </TouchableOpacity>
          </View>

          <Text style={styles.userName}>
            {user?.first_name} {user?.last_name}
          </Text>
          <Text style={styles.userEmail}>{user?.email}</Text>
          <Text style={styles.userPhone}>{user?.phone}</Text>

          {/* Account Tier Badge */}
          <View style={styles.tierBadge}>
            <Icon name="verified" size={16} color={Colors.warning} />
            <Text style={styles.tierText}>Tier {user?.tier || '1'} Account</Text>
          </View>
        </LinearGradient>

        {/* Quick Actions */}
        <View style={styles.quickActions}>
          <TouchableOpacity
            style={styles.quickActionButton}
            onPress={() => navigation.navigate('AccountStatement')}>
            <Icon name="description" size={24} color={Colors.primary} />
            <Text style={styles.quickActionText}>Statement</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.quickActionButton}
            onPress={() => navigation.navigate('ReferFriend')}>
            <Icon name="share" size={24} color={Colors.success} />
            <Text style={styles.quickActionText}>Refer</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.quickActionButton}
            onPress={() => navigation.navigate('Rewards')}>
            <Icon name="card-giftcard" size={24} color={Colors.warning} />
            <Text style={styles.quickActionText}>Rewards</Text>
          </TouchableOpacity>
        </View>

        {/* Menu Items */}
        <View style={styles.menuSection}>
          <Text style={styles.sectionTitle}>Account Settings</Text>
          <Card style={styles.menuCard}>
            {menuItems.map(renderMenuItem)}
          </Card>
        </View>

        {/* Logout Button */}
        <View style={styles.logoutSection}>
          <Button
            title="Logout"
            onPress={() => setShowLogoutDialog(true)}
            variant="outline"
            icon="logout"
            style={styles.logoutButton}
            textStyle={styles.logoutText}
          />
        </View>

        {/* App Version */}
        <Text style={styles.versionText}>Version 1.0.0</Text>
      </ScrollView>

      {/* Logout Confirmation */}
      <Alert
        visible={showLogoutDialog}
        type="warning"
        title="Logout"
        message="Are you sure you want to logout?"
        confirmText="Yes, Logout"
        cancelText="Cancel"
        showCancel={true}
        onConfirm={handleLogout}
        onClose={() => setShowLogoutDialog(false)}
      />

      <Loader visible={loading} />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scrollView: {
    flex: 1,
  },
  profileHeader: {
    padding: Spacing.xl,
    alignItems: 'center',
    position: 'relative',
  },
  editButton: {
    position: 'absolute',
    top: Spacing.lg,
    right: Spacing.lg,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: Spacing.md,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: Colors.white,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 4,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  avatarText: {
    fontSize: 36,
    fontFamily: Fonts.bold,
    color: Colors.primary,
  },
  cameraButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: Colors.white,
  },
  userName: {
    fontSize: 24,
    fontFamily: Fonts.semiBold,
    color: Colors.white,
    marginBottom: Spacing.xs,
  },
  userEmail: {
    fontSize: 14,
    fontFamily: Fonts.regular,
    color: Colors.white,
    opacity: 0.9,
    marginBottom: 4,
  },
  userPhone: {
    fontSize: 14,
    fontFamily: Fonts.regular,
    color: Colors.white,
    opacity: 0.9,
    marginBottom: Spacing.md,
  },
  tierBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.pill,
    gap: Spacing.xs,
  },
  tierText: {
    fontSize: 12,
    fontFamily: Fonts.semiBold,
    color: Colors.white,
  },
  quickActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: Spacing.lg,
    backgroundColor: Colors.white,
    marginTop: -30,
    marginHorizontal: Spacing.lg,
    borderRadius: BorderRadius.md,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  quickActionButton: {
    alignItems: 'center',
  },
  quickActionText: {
    fontSize: 12,
    fontFamily: Fonts.medium,
    color: Colors.text,
    marginTop: Spacing.xs,
  },
  menuSection: {
    padding: Spacing.lg,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: Fonts.semiBold,
    color: Colors.text,
    marginBottom: Spacing.md,
  },
  menuCard: {
    padding: 0,
    overflow: 'hidden',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  menuIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.md,
  },
  menuTitle: {
    flex: 1,
    fontSize: 15,
    fontFamily: Fonts.medium,
    color: Colors.text,
  },
  logoutSection: {
    padding: Spacing.lg,
  },
  logoutButton: {
    borderColor: Colors.error,
  },
  logoutText: {
    color: Colors.error,
  },
  versionText: {
    fontSize: 12,
    fontFamily: Fonts.regular,
    color: Colors.textMuted,
    textAlign: 'center',
    marginBottom: Spacing.xl,
  },
});

export default ProfileScreen;
