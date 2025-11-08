import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Platform,
  PermissionsAndroid,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import Icon from 'react-native-vector-icons/MaterialIcons';
import LinearGradient from 'react-native-linear-gradient';
import Toast from 'react-native-toast-message';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';

import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Loader from '../../components/common/Loader';
import Alert from '../../components/common/Alert';
import { selectUser } from '../../store/auth/authSlice';
import { logout, getMe } from '../../store/auth/authSlice';
import { Colors, Gradients } from '../../styles/colors';
import { Fonts } from '../../styles/fonts';
import { Spacing, BorderRadius } from '../../styles/spacing';
import api, { getImageUrl } from '../../api/client';

const ProfileScreen = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  
  const user = useSelector(selectUser);
  
  const [loading, setLoading] = useState(false);
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);
  const [showPhotoOptions, setShowPhotoOptions] = useState(false);

  useEffect(() => {
    console.log('=== ProfileScreen User Data ===');
    console.log('User:', user);
    console.log('Profile Photo Path:', user?.profile_photo);
    console.log('Profile Photo Full URL:', getImageUrl(user?.profile_photo));
    console.log('=============================');
  }, [user]);

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

  const requestCameraPermission = async () => {
    if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.CAMERA,
          {
            title: 'Camera Permission',
            message: 'Nanro Bank needs access to your camera to take photos',
            buttonNeutral: 'Ask Me Later',
            buttonNegative: 'Cancel',
            buttonPositive: 'OK',
          }
        );
        console.log('Camera permission granted:', granted === PermissionsAndroid.RESULTS.GRANTED);
        return granted === PermissionsAndroid.RESULTS.GRANTED;
      } catch (err) {
        console.error('Camera permission error:', err);
        return false;
      }
    }
    return true;
  };

  const handleTakePhoto = async () => {
    console.log('=== Taking Photo ===');
    setShowPhotoOptions(false);
    
    const hasPermission = await requestCameraPermission();
    if (!hasPermission) {
      console.log('Camera permission denied');
      Toast.show({
        type: 'error',
        text1: 'Permission Denied',
        text2: 'Camera permission is required to take photos',
      });
      return;
    }

    const options = {
      mediaType: 'photo',
      quality: 0.8,
      maxWidth: 1024,
      maxHeight: 1024,
      saveToPhotos: false,
    };

    console.log('Launching camera with options:', options);
    
    launchCamera(options, (response) => {
      console.log('Camera response:', response);
      
      if (response.didCancel) {
        console.log('User cancelled camera');
      } else if (response.errorCode) {
        console.error('Camera error code:', response.errorCode);
        console.error('Camera error message:', response.errorMessage);
        Toast.show({
          type: 'error',
          text1: 'Camera Error',
          text2: response.errorMessage || 'Failed to open camera',
        });
      } else if (response.assets && response.assets.length > 0) {
        console.log('Photo taken successfully:', response.assets[0]);
        uploadPhoto(response.assets[0]);
      }
    });
  };

  const handleChoosePhoto = () => {
    console.log('=== Choosing Photo from Gallery ===');
    setShowPhotoOptions(false);
    
    const options = {
      mediaType: 'photo',
      quality: 0.8,
      maxWidth: 1024,
      maxHeight: 1024,
      selectionLimit: 1,
    };

    console.log('Launching image library with options:', options);

    launchImageLibrary(options, (response) => {
      console.log('Image library response:', response);
      
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.errorCode) {
        console.error('Image picker error code:', response.errorCode);
        console.error('Image picker error message:', response.errorMessage);
        Toast.show({
          type: 'error',
          text1: 'Image Picker Error',
          text2: response.errorMessage || 'Failed to pick image',
        });
      } else if (response.assets && response.assets.length > 0) {
        console.log('Photo selected successfully:', response.assets[0]);
        uploadPhoto(response.assets[0]);
      }
    });
  };

  const uploadPhoto = async (photo) => {
    console.log('=== Starting Photo Upload ===');
    console.log('Photo URI:', photo.uri);
    console.log('Photo Type:', photo.type);
    console.log('Photo File Name:', photo.fileName);
    
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append('photo', {
        uri: Platform.OS === 'android' ? photo.uri : photo.uri.replace('file://', ''),
        type: photo.type || 'image/jpeg',
        name: photo.fileName || `profile_${Date.now()}.jpg`,
      });

      console.log('FormData prepared, sending request...');

      const response = await api.post('/profile/upload-photo', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      console.log('Upload response:', response.data);

      if (response.data.success) {
        console.log('Photo uploaded successfully, refreshing user data...');
        
        // Refresh user data
        const updatedUser = await dispatch(getMe()).unwrap();
        console.log('User data refreshed:', updatedUser);
        console.log('New profile photo path:', updatedUser?.profile_photo);
        
        Toast.show({
          type: 'success',
          text1: 'Photo Updated',
          text2: 'Your profile photo has been updated successfully',
        });
      } else {
        console.error('Upload failed:', response.data.message);
        Toast.show({
          type: 'error',
          text1: 'Upload Failed',
          text2: response.data.message || 'Failed to upload photo',
        });
      }
    } catch (error) {
      console.error('Photo upload error:', error);
      console.error('Error response:', error.response?.data);
      console.error('Error status:', error.response?.status);
      
      Toast.show({
        type: 'error',
        text1: 'Upload Failed',
        text2: error.response?.data?.message || 'Failed to upload photo',
      });
    } finally {
      setLoading(false);
      console.log('=== Photo Upload Complete ===');
    }
  };

  const handleLogout = async () => {
    console.log('=== Logging Out ===');
    setShowLogoutDialog(false);
    setLoading(true);

    try {
      await dispatch(logout()).unwrap();
      
      console.log('Logout successful');
      Toast.show({
        type: 'success',
        text1: 'Logged Out',
        text2: 'You have been logged out successfully',
      });
    } catch (error) {
      console.error('Logout error:', error);
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
            {user?.profile_photo ? (
              <Image 
                source={{ uri: getImageUrl(user.profile_photo) }} 
                style={styles.avatar}
                onLoadStart={() => console.log('Image loading started...')}
                onLoad={() => console.log('Image loaded successfully')}
                onError={(error) => {
                  console.error('Image load error:', error.nativeEvent.error);
                  console.error('Failed image URL:', getImageUrl(user.profile_photo));
                }}
                resizeMode="cover"
              />
            ) : (
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>
                  {user?.first_name?.charAt(0)}{user?.last_name?.charAt(0)}
                </Text>
              </View>
            )}
            <TouchableOpacity 
              style={styles.cameraButton}
              onPress={() => {
                console.log('Camera button pressed');
                setShowPhotoOptions(true);
              }}>
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
            <Text style={styles.tierText}>Tier {user?.kyc_level || '1'} Account</Text>
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
            fullWidth={true}
          />
        </View>

        {/* App Version */}
        <Text style={styles.versionText}>Version 1.0.0</Text>
      </ScrollView>

      {/* Photo Options Dialog */}
      <Alert
        visible={showPhotoOptions}
        type="info"
        title="Update Profile Photo"
        message="Choose how you want to update your profile photo"
        confirmText="Take Photo"
        cancelText="Choose from Gallery"
        showCancel={true}
        onConfirm={handleTakePhoto}
        onCancel={handleChoosePhoto}
        onClose={() => setShowPhotoOptions(false)}
      />

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