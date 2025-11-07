import CryptoJS from 'crypto-js';
import { ENCRYPTION_KEY } from '@env';
import EncryptedStorage from 'react-native-encrypted-storage';

// Default encryption key if not provided in env
const DEFAULT_KEY = 'N@nr0B@nk2025$ecur3K3y!';
const ENCRYPTION_SECRET = ENCRYPTION_KEY || DEFAULT_KEY;

/**
 * Encrypt sensitive data
 */
export const encrypt = (text) => {
  try {
    const encrypted = CryptoJS.AES.encrypt(text, ENCRYPTION_SECRET).toString();
    return encrypted;
  } catch (error) {
    console.error('Encryption error:', error);
    throw new Error('Failed to encrypt data');
  }
};

/**
 * Decrypt sensitive data
 */
export const decrypt = (encryptedText) => {
  try {
    const decrypted = CryptoJS.AES.decrypt(encryptedText, ENCRYPTION_SECRET);
    return decrypted.toString(CryptoJS.enc.Utf8);
  } catch (error) {
    console.error('Decryption error:', error);
    throw new Error('Failed to decrypt data');
  }
};

/**
 * Hash password using SHA256
 */
export const hashPassword = async (password) => {
  try {
    const hashed = CryptoJS.SHA256(password).toString();
    return hashed;
  } catch (error) {
    console.error('Password hashing error:', error);
    throw new Error('Failed to hash password');
  }
};

/**
 * Encrypt transaction PIN
 */
export const encryptTransactionPin = async (pin) => {
  try {
    // Add salt to PIN before encryption
    const salt = Date.now().toString();
    const saltedPin = `${pin}:${salt}`;
    const encrypted = CryptoJS.AES.encrypt(saltedPin, ENCRYPTION_SECRET).toString();
    return encrypted;
  } catch (error) {
    console.error('PIN encryption error:', error);
    throw new Error('Failed to encrypt PIN');
  }
};

/**
 * Generate random string
 */
export const generateRandomString = (length = 16) => {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
};

/**
 * Generate secure OTP
 */
export const generateOTP = (length = 6) => {
  const digits = '0123456789';
  let otp = '';
  for (let i = 0; i < length; i++) {
    otp += digits.charAt(Math.floor(Math.random() * digits.length));
  }
  return otp;
};

/**
 * Secure storage operations
 */
export const SecureStorage = {
  /**
   * Store encrypted data
   */
  async setItem(key, value) {
    try {
      const encrypted = encrypt(JSON.stringify(value));
      await EncryptedStorage.setItem(key, encrypted);
      return true;
    } catch (error) {
      console.error('Secure storage set error:', error);
      return false;
    }
  },

  /**
   * Retrieve and decrypt data
   */
  async getItem(key) {
    try {
      const encrypted = await EncryptedStorage.getItem(key);
      if (!encrypted) return null;
      
      const decrypted = decrypt(encrypted);
      return JSON.parse(decrypted);
    } catch (error) {
      console.error('Secure storage get error:', error);
      return null;
    }
  },

  /**
   * Remove item from storage
   */
  async removeItem(key) {
    try {
      await EncryptedStorage.removeItem(key);
      return true;
    } catch (error) {
      console.error('Secure storage remove error:', error);
      return false;
    }
  },

  /**
   * Clear all secure storage
   */
  async clear() {
    try {
      await EncryptedStorage.clear();
      return true;
    } catch (error) {
      console.error('Secure storage clear error:', error);
      return false;
    }
  },
};

/**
 * Mask sensitive data for display
 */
export const maskData = (data, type = 'default') => {
  if (!data) return '';
  
  const dataStr = data.toString();
  
  switch (type) {
    case 'account':
      // Show first 3 and last 3 digits
      if (dataStr.length <= 6) return dataStr;
      return `${dataStr.slice(0, 3)}****${dataStr.slice(-3)}`;
      
    case 'card':
      // Show first 4 and last 4 digits
      if (dataStr.length <= 8) return dataStr;
      return `${dataStr.slice(0, 4)} **** **** ${dataStr.slice(-4)}`;
      
    case 'phone':
      // Show first 4 and last 3 digits
      if (dataStr.length <= 7) return dataStr;
      return `${dataStr.slice(0, 4)}****${dataStr.slice(-3)}`;
      
    case 'email':
      // Mask email keeping first 2 chars and domain
      const [username, domain] = dataStr.split('@');
      if (!domain) return dataStr;
      if (username.length <= 2) return dataStr;
      return `${username.slice(0, 2)}****@${domain}`;
      
    default:
      // Default masking - show first 2 and last 2 characters
      if (dataStr.length <= 4) return dataStr;
      return `${dataStr.slice(0, 2)}${'*'.repeat(dataStr.length - 4)}${dataStr.slice(-2)}`;
  }
};

/**
 * Validate PIN format
 */
export const validatePIN = (pin) => {
  // PIN should be 4-6 digits
  const pinRegex = /^\d{4,6}$/;
  return pinRegex.test(pin);
};

/**
 * Check if data is encrypted
 */
export const isEncrypted = (data) => {
  try {
    // Try to decrypt - if it fails, it's not encrypted
    decrypt(data);
    return true;
  } catch {
    return false;
  }
};

/**
 * Generate device fingerprint for additional security
 */
export const generateDeviceFingerprint = async () => {
  try {
    const DeviceInfo = require('react-native-device-info').default;
    
    const deviceId = await DeviceInfo.getUniqueId();
    const brand = await DeviceInfo.getBrand();
    const model = await DeviceInfo.getModel();
    const systemVersion = await DeviceInfo.getSystemVersion();
    
    const fingerprint = `${deviceId}:${brand}:${model}:${systemVersion}`;
    return hashPassword(fingerprint);
  } catch (error) {
    console.error('Device fingerprint error:', error);
    return generateRandomString(32);
  }
};

export default {
  encrypt,
  decrypt,
  hashPassword,
  encryptTransactionPin,
  generateRandomString,
  generateOTP,
  SecureStorage,
  maskData,
  validatePIN,
  isEncrypted,
  generateDeviceFingerprint,
};