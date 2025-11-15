import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert,
  Platform,
  PermissionsAndroid,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useNavigation } from '@react-navigation/native';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import Toast from 'react-native-toast-message';

import Button from '../../components/common/Button';
import KYCService from '../../api/kyc';
import { Colors } from '../../styles/colors';
import { Fonts } from '../../styles/fonts';
import { Spacing } from '../../styles/spacing';

const KYCScreen = () => {
  const navigation = useNavigation();
  const [selectedDocumentType, setSelectedDocumentType] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [isUploading, setIsUploading] = useState(false);

  const documentTypes = [
    {
      id: 'passport',
      title: 'International Passport',
      description: 'Upload your passport photo page',
      icon: 'card-travel',
      color: '#2196f3',
    },
    {
      id: 'id_card',
      title: 'National ID Card',
      description: 'Upload your national identity card',
      icon: 'credit-card',
      color: '#4caf50',
    },
    {
      id: 'drivers_license',
      title: "Driver's License",
      description: 'Upload your valid driver\'s license',
      icon: 'directions-car',
      color: '#ff9800',
    },
    {
      id: 'utility_bill',
      title: 'Utility Bill',
      description: 'Recent utility bill (not older than 3 months)',
      icon: 'receipt',
      color: '#9c27b0',
    },
  ];

  const handleDocumentTypeSelect = (type) => {
    setSelectedDocumentType(type);
    setSelectedImage(null); // Reset image when changing document type
  };

  /**
   * Request camera permission for Android
   */
  const requestCameraPermission = async () => {
    if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.CAMERA,
          {
            title: 'Camera Permission',
            message: 'Nanro Bank needs access to your camera to capture KYC documents',
            buttonNeutral: 'Ask Me Later',
            buttonNegative: 'Cancel',
            buttonPositive: 'OK',
          }
        );

        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          console.log('✅ Camera permission granted');
          return true;
        } else {
          console.log('❌ Camera permission denied');
          Toast.show({
            type: 'error',
            text1: 'Permission Denied',
            text2: 'Camera permission is required to capture documents',
          });
          return false;
        }
      } catch (err) {
        console.error('Permission error:', err);
        return false;
      }
    }
    // iOS permissions are handled in Info.plist
    return true;
  };

  const handleImagePicker = () => {
    Alert.alert(
      'Select Image Source',
      'Choose how you want to provide the document',
      [
        {
          text: 'Take Photo',
          onPress: handleCamera,
        },
        {
          text: 'Choose from Gallery',
          onPress: handleGallery,
        },
        {
          text: 'Cancel',
          style: 'cancel',
        },
      ]
    );
  };

  const handleCamera = async () => {
    // Request permission first
    const hasPermission = await requestCameraPermission();
    if (!hasPermission) {
      return;
    }

    try {
      const result = await launchCamera({
        mediaType: 'photo',
        quality: 0.8,
        saveToPhotos: false, // Changed to false to avoid storage permission issues
        cameraType: 'back',
        includeBase64: false,
      });

      if (result.didCancel) {
        console.log('User cancelled camera');
        return;
      }

      if (result.errorCode) {
        console.error('Camera error:', result.errorCode, result.errorMessage);
        Toast.show({
          type: 'error',
          text1: 'Camera Error',
          text2: result.errorMessage || 'Failed to open camera',
        });
        return;
      }

      if (result.assets && result.assets[0]) {
        console.log('✅ Image captured:', result.assets[0].fileName);
        setSelectedImage(result.assets[0]);
      }
    } catch (error) {
      console.error('Camera error:', error);
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Failed to capture image',
      });
    }
  };

  const handleGallery = async () => {
    try {
      const result = await launchImageLibrary({
        mediaType: 'photo',
        quality: 0.8,
        selectionLimit: 1,
        includeBase64: false,
      });

      if (result.didCancel) {
        console.log('User cancelled gallery');
        return;
      }

      if (result.errorCode) {
        console.error('Gallery error:', result.errorCode, result.errorMessage);
        Toast.show({
          type: 'error',
          text1: 'Gallery Error',
          text2: result.errorMessage || 'Failed to open gallery',
        });
        return;
      }

      if (result.assets && result.assets[0]) {
        console.log('✅ Image selected:', result.assets[0].fileName);
        setSelectedImage(result.assets[0]);
      }
    } catch (error) {
      console.error('Gallery error:', error);
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Failed to select image',
      });
    }
  };

  const handleUpload = async () => {
    if (!selectedDocumentType) {
      Toast.show({
        type: 'error',
        text1: 'Document Type Required',
        text2: 'Please select a document type',
      });
      return;
    }

    if (!selectedImage) {
      Toast.show({
        type: 'error',
        text1: 'Image Required',
        text2: 'Please select or capture a document image',
      });
      return;
    }

    try {
      setIsUploading(true);

      // Create FormData
      const formData = new FormData();
      formData.append('document_type', selectedDocumentType);
      
      // Prepare file object
      const fileUri = Platform.OS === 'android' 
        ? selectedImage.uri 
        : selectedImage.uri.replace('file://', '');
      
      const fileName = selectedImage.fileName || `kyc_${selectedDocumentType}_${Date.now()}.jpg`;
      const fileType = selectedImage.type || 'image/jpeg';

      formData.append('document', {
        uri: fileUri,
        type: fileType,
        name: fileName,
      });

      console.log('📤 Uploading KYC document:', {
        document_type: selectedDocumentType,
        fileName: fileName,
        fileSize: selectedImage.fileSize,
        fileType: fileType,
      });

      const response = await KYCService.uploadDocument(formData);

      if (response.success) {
        Toast.show({
          type: 'success',
          text1: 'Upload Successful',
          text2: response.message || 'Your document has been uploaded successfully',
        });

        // Reset form
        setSelectedDocumentType(null);
        setSelectedImage(null);

        // Navigate back or to success screen
        setTimeout(() => {
          navigation.goBack();
        }, 1500);
      } else {
        Toast.show({
          type: 'error',
          text1: 'Upload Failed',
          text2: response.message || 'Failed to upload document',
        });
      }
    } catch (error) {
      console.error('Upload error:', error);
      Toast.show({
        type: 'error',
        text1: 'Upload Failed',
        text2: error.message || 'An error occurred while uploading',
      });
    } finally {
      setIsUploading(false);
    }
  };

  const renderDocumentType = (type) => {
    const isSelected = selectedDocumentType === type.id;

    return (
      <TouchableOpacity
        key={type.id}
        style={[
          styles.documentTypeCard,
          isSelected && styles.documentTypeCardSelected,
        ]}
        onPress={() => handleDocumentTypeSelect(type.id)}
        activeOpacity={0.7}>
        <View style={[styles.documentTypeIcon, { backgroundColor: type.color + '20' }]}>
          <Icon name={type.icon} size={32} color={type.color} />
        </View>
        <View style={styles.documentTypeContent}>
          <Text style={styles.documentTypeTitle}>{type.title}</Text>
          <Text style={styles.documentTypeDescription}>{type.description}</Text>
        </View>
        {isSelected && (
          <Icon name="check-circle" size={24} color={Colors.primary} />
        )}
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-back" size={24} color={Colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>KYC Verification</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>
        
        {/* Info Card */}
        <View style={styles.infoCard}>
          <Icon name="info" size={24} color={Colors.primary} />
          <View style={styles.infoTextContainer}>
            <Text style={styles.infoTitle}>Why KYC?</Text>
            <Text style={styles.infoText}>
              KYC verification helps us keep your account secure and comply with regulations.
              Your information is protected and encrypted.
            </Text>
          </View>
        </View>

        {/* Document Type Selection */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Select Document Type</Text>
          <Text style={styles.sectionDescription}>
            Choose the type of document you want to upload
          </Text>
          {documentTypes.map(renderDocumentType)}
        </View>

        {/* Image Upload Section */}
        {selectedDocumentType && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Upload Document</Text>
            <Text style={styles.sectionDescription}>
              Take a clear photo or select from gallery
            </Text>

            {selectedImage ? (
              <View style={styles.imagePreviewContainer}>
                <Image
                  source={{ uri: selectedImage.uri }}
                  style={styles.imagePreview}
                  resizeMode="cover"
                />
                <TouchableOpacity
                  style={styles.changeImageButton}
                  onPress={handleImagePicker}>
                  <Icon name="edit" size={20} color={Colors.white} />
                  <Text style={styles.changeImageText}>Change Image</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <TouchableOpacity
                style={styles.uploadButton}
                onPress={handleImagePicker}
                activeOpacity={0.7}>
                <Icon name="cloud-upload" size={48} color={Colors.primary} />
                <Text style={styles.uploadButtonTitle}>Upload Document</Text>
                <Text style={styles.uploadButtonDescription}>
                  Take a photo or choose from gallery
                </Text>
              </TouchableOpacity>
            )}
          </View>
        )}

        {/* Requirements */}
        {selectedDocumentType && (
          <View style={styles.requirementsCard}>
            <Text style={styles.requirementsTitle}>Document Requirements:</Text>
            <View style={styles.requirementItem}>
              <Icon name="check-circle" size={16} color={Colors.success} />
              <Text style={styles.requirementText}>Clear and readable</Text>
            </View>
            <View style={styles.requirementItem}>
              <Icon name="check-circle" size={16} color={Colors.success} />
              <Text style={styles.requirementText}>All corners visible</Text>
            </View>
            <View style={styles.requirementItem}>
              <Icon name="check-circle" size={16} color={Colors.success} />
              <Text style={styles.requirementText}>Not expired</Text>
            </View>
            <View style={styles.requirementItem}>
              <Icon name="check-circle" size={16} color={Colors.success} />
              <Text style={styles.requirementText}>Well-lit photo</Text>
            </View>
          </View>
        )}

        {/* Upload Button */}
        {selectedDocumentType && selectedImage && (
          <View style={styles.buttonContainer}>
            <Button
              title="Upload Document"
              onPress={handleUpload}
              loading={isUploading}
              icon="upload"
            />
          </View>
        )}
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
  infoCard: {
    flexDirection: 'row',
    backgroundColor: Colors.primaryLight,
    padding: Spacing.md,
    marginHorizontal: Spacing.md,
    marginTop: Spacing.md,
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: Colors.primary,
  },
  infoTextContainer: {
    flex: 1,
    marginLeft: Spacing.sm,
  },
  infoTitle: {
    fontSize: 14,
    fontFamily: Fonts.semiBold,
    color: Colors.text,
    marginBottom: Spacing.xs,
  },
  infoText: {
    fontSize: 12,
    fontFamily: Fonts.regular,
    color: Colors.textLight,
    lineHeight: 18,
  },
  section: {
    backgroundColor: Colors.white,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.lg,
    marginTop: Spacing.md,
  },
  sectionTitle: {
    fontSize: 16,
    fontFamily: Fonts.semiBold,
    color: Colors.text,
    marginBottom: Spacing.xs,
  },
  sectionDescription: {
    fontSize: 14,
    fontFamily: Fonts.regular,
    color: Colors.textLight,
    marginBottom: Spacing.md,
  },
  documentTypeCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.md,
    borderWidth: 2,
    borderColor: Colors.border,
    borderRadius: 12,
    marginBottom: Spacing.sm,
  },
  documentTypeCardSelected: {
    borderColor: Colors.primary,
    backgroundColor: Colors.primaryLight,
  },
  documentTypeIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.md,
  },
  documentTypeContent: {
    flex: 1,
  },
  documentTypeTitle: {
    fontSize: 14,
    fontFamily: Fonts.semiBold,
    color: Colors.text,
    marginBottom: 4,
  },
  documentTypeDescription: {
    fontSize: 12,
    fontFamily: Fonts.regular,
    color: Colors.textLight,
  },
  uploadButton: {
    borderWidth: 2,
    borderColor: Colors.border,
    borderStyle: 'dashed',
    borderRadius: 12,
    padding: Spacing.xl,
    alignItems: 'center',
    backgroundColor: Colors.background,
  },
  uploadButtonTitle: {
    fontSize: 16,
    fontFamily: Fonts.semiBold,
    color: Colors.text,
    marginTop: Spacing.sm,
  },
  uploadButtonDescription: {
    fontSize: 12,
    fontFamily: Fonts.regular,
    color: Colors.textLight,
    marginTop: Spacing.xs,
    textAlign: 'center',
  },
  imagePreviewContainer: {
    borderRadius: 12,
    overflow: 'hidden',
    position: 'relative',
  },
  imagePreview: {
    width: '100%',
    height: 250,
    borderRadius: 12,
  },
  changeImageButton: {
    position: 'absolute',
    bottom: Spacing.md,
    right: Spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.primary,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: 20,
  },
  changeImageText: {
    fontSize: 12,
    fontFamily: Fonts.semiBold,
    color: Colors.white,
    marginLeft: Spacing.xs,
  },
  requirementsCard: {
    backgroundColor: Colors.successLight,
    padding: Spacing.md,
    marginHorizontal: Spacing.md,
    marginTop: Spacing.md,
    borderRadius: 8,
  },
  requirementsTitle: {
    fontSize: 14,
    fontFamily: Fonts.semiBold,
    color: Colors.text,
    marginBottom: Spacing.sm,
  },
  requirementItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.xs,
  },
  requirementText: {
    fontSize: 12,
    fontFamily: Fonts.regular,
    color: Colors.text,
    marginLeft: Spacing.xs,
  },
  buttonContainer: {
    paddingHorizontal: Spacing.md,
    marginTop: Spacing.lg,
  },
});

export default KYCScreen;