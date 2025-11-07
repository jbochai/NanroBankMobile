import ReactNativeBiometrics from 'react-native-biometrics';
import SecureStorage from './storage';
import { Platform } from 'react-native';

const rnBiometrics = new ReactNativeBiometrics({ allowDeviceCredentials: true });

/**
 * Biometric Authentication Utility
 */

/**
 * Check if biometric hardware is available
 */
export const isBiometricAvailable = async () => {
  try {
    const { available, biometryType } = await rnBiometrics.isSensorAvailable();
    
    return {
      available,
      biometryType, // 'TouchID', 'FaceID', 'Biometrics'
      biometryName: getBiometryName(biometryType),
    };
  } catch (error) {
    console.error('Error checking biometric availability:', error);
    return {
      available: false,
      biometryType: null,
      biometryName: null,
    };
  }
};

/**
 * Get human-readable biometry name
 */
const getBiometryName = (biometryType) => {
  switch (biometryType) {
    case 'TouchID':
      return 'Touch ID';
    case 'FaceID':
      return 'Face ID';
    case 'Biometrics':
      return Platform.OS === 'android' ? 'Fingerprint' : 'Biometrics';
    default:
      return 'Biometric Authentication';
  }
};

/**
 * Create biometric keys
 */
export const createBiometricKeys = async () => {
  try {
    const { publicKey } = await rnBiometrics.createKeys();
    return { success: true, publicKey };
  } catch (error) {
    console.error('Error creating biometric keys:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Delete biometric keys
 */
export const deleteBiometricKeys = async () => {
  try {
    const { keysDeleted } = await rnBiometrics.deleteKeys();
    return { success: keysDeleted };
  } catch (error) {
    console.error('Error deleting biometric keys:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Check if biometric keys exist
 */
export const biometricKeysExist = async () => {
  try {
    const { keysExist } = await rnBiometrics.biometricKeysExist();
    return keysExist;
  } catch (error) {
    console.error('Error checking biometric keys:', error);
    return false;
  }
};

/**
 * Prompt for biometric authentication
 */
export const promptBiometric = async (config = {}) => {
  try {
    const { biometryType } = await isBiometricAvailable();
    const biometryName = getBiometryName(biometryType);

    const defaultConfig = {
      promptMessage: `Authenticate with ${biometryName}`,
      cancelButtonText: 'Cancel',
      fallbackPromptMessage: 'Use passcode',
    };

    const mergedConfig = { ...defaultConfig, ...config };

    const { success } = await rnBiometrics.simplePrompt(mergedConfig);
    
    return { success };
  } catch (error) {
    console.error('Error with biometric prompt:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Create signature with biometric
 */
export const createBiometricSignature = async (payload, config = {}) => {
  try {
    const { biometryType } = await isBiometricAvailable();
    const biometryName = getBiometryName(biometryType);

    const defaultConfig = {
      promptMessage: `Sign with ${biometryName}`,
      cancelButtonText: 'Cancel',
      payload: payload || Date.now().toString(),
    };

    const mergedConfig = { ...defaultConfig, ...config };

    const { success, signature } = await rnBiometrics.createSignature(mergedConfig);
    
    if (success) {
      return { success: true, signature };
    } else {
      return { success: false, error: 'Signature creation failed' };
    }
  } catch (error) {
    console.error('Error creating biometric signature:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Enable biometric authentication
 */
export const enableBiometric = async () => {
  try {
    // Check if biometric is available
    const { available } = await isBiometricAvailable();
    if (!available) {
      return {
        success: false,
        error: 'Biometric authentication is not available on this device',
      };
    }

    // Create biometric keys
    const { success, publicKey } = await createBiometricKeys();
    if (!success) {
      return {
        success: false,
        error: 'Failed to create biometric keys',
      };
    }

    // Prompt for biometric authentication
    const promptResult = await promptBiometric({
      promptMessage: 'Enable biometric authentication',
    });

    if (!promptResult.success) {
      await deleteBiometricKeys();
      return {
        success: false,
        error: 'Biometric authentication failed',
      };
    }

    // Store biometric enabled flag
    await SecureStorage.setItem('biometric_enabled', true);
    
    return {
      success: true,
      publicKey,
    };
  } catch (error) {
    console.error('Error enabling biometric:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Disable biometric authentication
 */
export const disableBiometric = async () => {
  try {
    await deleteBiometricKeys();
    await SecureStorage.removeItem('biometric_enabled');
    await SecureStorage.removeBiometricToken();
    
    return { success: true };
  } catch (error) {
    console.error('Error disabling biometric:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Check if biometric is enabled
 */
export const isBiometricEnabled = async () => {
  try {
    const enabled = await SecureStorage.getItem('biometric_enabled');
    const keysExist = await biometricKeysExist();
    
    return enabled === true && keysExist;
  } catch (error) {
    console.error('Error checking biometric status:', error);
    return false;
  }
};

/**
 * Authenticate with biometric
 */
export const authenticateWithBiometric = async () => {
  try {
    const enabled = await isBiometricEnabled();
    if (!enabled) {
      return {
        success: false,
        error: 'Biometric authentication is not enabled',
      };
    }

    const result = await promptBiometric({
      promptMessage: 'Authenticate to continue',
    });

    return result;
  } catch (error) {
    console.error('Error authenticating with biometric:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Verify transaction with biometric
 */
export const verifyTransactionWithBiometric = async (amount) => {
  try {
    const formattedAmount = new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
    }).format(amount);

    const result = await promptBiometric({
      promptMessage: `Authorize transaction of ${formattedAmount}`,
    });

    return result;
  } catch (error) {
    console.error('Error verifying transaction:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Get biometric enrollment guidance
 */
export const getBiometricEnrollmentGuidance = async () => {
  const { available, biometryType } = await isBiometricAvailable();

  if (!available) {
    return {
      canEnroll: false,
      message: 'Biometric authentication is not available on this device',
      steps: [],
    };
  }

  let steps = [];
  if (Platform.OS === 'ios') {
    if (biometryType === 'FaceID') {
      steps = [
        'Open Settings',
        'Tap "Face ID & Passcode"',
        'Enter your passcode',
        'Set up Face ID',
      ];
    } else if (biometryType === 'TouchID') {
      steps = [
        'Open Settings',
        'Tap "Touch ID & Passcode"',
        'Enter your passcode',
        'Add a fingerprint',
      ];
    }
  } else {
    steps = [
      'Open Settings',
      'Tap "Security" or "Biometrics"',
      'Add fingerprint or face data',
      'Follow the on-screen instructions',
    ];
  }

  return {
    canEnroll: true,
    message: `Set up ${getBiometryName(biometryType)} to enable quick and secure authentication`,
    steps,
  };
};