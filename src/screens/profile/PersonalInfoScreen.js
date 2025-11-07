import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useNavigation } from '@react-navigation/native';
import { useSelector } from 'react-redux';
import { selectUser } from '../../store/auth/authSlice';
import { Colors } from '../../styles/colors';
import { Fonts } from '../../styles/fonts';
import { Spacing } from '../../styles/spacing';

const PersonalInfoScreen = () => {
  const navigation = useNavigation();
  const user = useSelector(selectUser);

  const infoItems = [
    {
      label: 'Full Name',
      value: user?.full_name || 'N/A',
      icon: 'person',
      editable: true,
    },
    {
      label: 'Email Address',
      value: user?.email || 'N/A',
      icon: 'email',
      editable: false,
    },
    {
      label: 'Phone Number',
      value: user?.phone || 'N/A',
      icon: 'phone',
      editable: true,
    },
    {
      label: 'Date of Birth',
      value: user?.date_of_birth ? new Date(user.date_of_birth).toLocaleDateString() : 'N/A',
      icon: 'cake',
      editable: true,
    },
    {
      label: 'Gender',
      value: user?.gender ? user.gender.charAt(0).toUpperCase() + user.gender.slice(1) : 'N/A',
      icon: 'wc',
      editable: true,
    },
    {
      label: 'Address',
      value: user?.address || 'N/A',
      icon: 'location-on',
      editable: true,
    },
    {
      label: 'City',
      value: user?.city || 'N/A',
      icon: 'location-city',
      editable: true,
    },
    {
      label: 'State',
      value: user?.state || 'N/A',
      icon: 'map',
      editable: true,
    },
    {
      label: 'BVN',
      value: user?.bvn || 'Not Linked',
      icon: 'fingerprint',
      editable: false,
    },
    {
      label: 'NIN',
      value: user?.nin || 'Not Linked',
      icon: 'badge',
      editable: false,
    },
  ];

  const renderInfoItem = (item, index) => (
    <View key={index} style={styles.infoItem}>
      <View style={styles.infoLeft}>
        <View style={styles.iconContainer}>
          <Icon name={item.icon} size={20} color={Colors.primary} />
        </View>
        <View style={styles.infoTextContainer}>
          <Text style={styles.infoLabel}>{item.label}</Text>
          <Text style={styles.infoValue}>{item.value}</Text>
        </View>
      </View>
      {item.editable && (
        <TouchableOpacity onPress={() => {}}>
          <Icon name="edit" size={20} color={Colors.textLight} />
        </TouchableOpacity>
      )}
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-back" size={24} color={Colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Personal Information</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>
        
        <View style={styles.profileSection}>
          <View style={styles.avatarContainer}>
            {user?.profile_photo ? (
              <Image
                source={{ uri: user.profile_photo }}
                style={styles.avatar}
              />
            ) : (
              <View style={styles.avatarPlaceholder}>
                <Text style={styles.avatarText}>
                  {user?.first_name?.charAt(0)}{user?.last_name?.charAt(0)}
                </Text>
              </View>
            )}
            <TouchableOpacity style={styles.cameraButton}>
              <Icon name="camera-alt" size={16} color={Colors.white} />
            </TouchableOpacity>
          </View>
          <Text style={styles.userName}>{user?.full_name}</Text>
          <View style={styles.kycBadge}>
            <Icon name="verified" size={16} color={Colors.success} />
            <Text style={styles.kycText}>
              KYC Level: {user?.kyc_level?.toUpperCase() || 'TIER1'}
            </Text>
          </View>
        </View>

        <View style={styles.infoSection}>
          <Text style={styles.sectionTitle}>Account Information</Text>
          {infoItems.map(renderInfoItem)}
        </View>

        <View style={styles.verificationSection}>
          <Text style={styles.sectionTitle}>Verification Status</Text>
          
          <View style={styles.verificationItem}>
            <View style={styles.verificationLeft}>
              <Icon 
                name={user?.email_verified_at ? 'check-circle' : 'cancel'} 
                size={24} 
                color={user?.email_verified_at ? Colors.success : Colors.error} 
              />
              <Text style={styles.verificationText}>Email Verification</Text>
            </View>
            {!user?.email_verified_at && (
              <TouchableOpacity>
                <Text style={styles.verifyButton}>Verify</Text>
              </TouchableOpacity>
            )}
          </View>

          <View style={styles.verificationItem}>
            <View style={styles.verificationLeft}>
              <Icon 
                name={user?.phone_verified_at ? 'check-circle' : 'cancel'} 
                size={24} 
                color={user?.phone_verified_at ? Colors.success : Colors.error} 
              />
              <Text style={styles.verificationText}>Phone Verification</Text>
            </View>
            {!user?.phone_verified_at && (
              <TouchableOpacity>
                <Text style={styles.verifyButton}>Verify</Text>
              </TouchableOpacity>
            )}
          </View>

          <View style={styles.verificationItem}>
            <View style={styles.verificationLeft}>
              <Icon 
                name={user?.bvn ? 'check-circle' : 'cancel'} 
                size={24} 
                color={user?.bvn ? Colors.success : Colors.error} 
              />
              <Text style={styles.verificationText}>BVN Verification</Text>
            </View>
            {!user?.bvn && (
              <TouchableOpacity>
                <Text style={styles.verifyButton}>Link</Text>
              </TouchableOpacity>
            )}
          </View>
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
    paddingBottom: Spacing.xl,
  },
  profileSection: {
    alignItems: 'center',
    paddingVertical: Spacing.xl,
    backgroundColor: Colors.white,
    marginBottom: Spacing.md,
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: Spacing.md,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  avatarPlaceholder: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontSize: 32,
    fontFamily: Fonts.bold,
    color: Colors.white,
  },
  cameraButton: {
    position: 'absolute',
    right: 0,
    bottom: 0,
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
    fontSize: 20,
    fontFamily: Fonts.bold,
    color: Colors.text,
    marginBottom: Spacing.xs,
  },
  kycBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.successLight,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    borderRadius: 16,
  },
  kycText: {
    fontSize: 12,
    fontFamily: Fonts.medium,
    color: Colors.success,
    marginLeft: 4,
  },
  infoSection: {
    backgroundColor: Colors.white,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.lg,
    marginBottom: Spacing.md,
  },
  sectionTitle: {
    fontSize: 16,
    fontFamily: Fonts.semiBold,
    color: Colors.text,
    marginBottom: Spacing.md,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  infoLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.md,
  },
  infoTextContainer: {
    flex: 1,
  },
  infoLabel: {
    fontSize: 12,
    fontFamily: Fonts.regular,
    color: Colors.textLight,
    marginBottom: 2,
  },
  infoValue: {
    fontSize: 14,
    fontFamily: Fonts.medium,
    color: Colors.text,
  },
  verificationSection: {
    backgroundColor: Colors.white,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.lg,
  },
  verificationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  verificationLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  verificationText: {
    fontSize: 14,
    fontFamily: Fonts.medium,
    color: Colors.text,
    marginLeft: Spacing.sm,
  },
  verifyButton: {
    fontSize: 14,
    fontFamily: Fonts.semiBold,
    color: Colors.primary,
  },
});

export default PersonalInfoScreen;