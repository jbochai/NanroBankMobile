import EncryptedStorage from 'react-native-encrypted-storage';
import { encryptData, decryptData } from './encryption';

/**
 * Secure Storage Utility
 * Handles encrypted storage operations
 */

const STORAGE_KEYS = {
  AUTH_TOKEN: 'auth_token',
  USER_DATA: 'user_data',
  BIOMETRIC_TOKEN: 'biometric_token',
  TRANSACTION_PIN: 'transaction_pin',
  DEVICE_ID: 'device_id',
  THEME_PREFERENCE: 'theme_preference',
  LANGUAGE_PREFERENCE: 'language_preference',
  NOTIFICATION_SETTINGS: 'notification_settings',
  BENEFICIARIES: 'beneficiaries',
  RECENT_SEARCHES: 'recent_searches',
  CACHED_DATA: 'cached_data',
  SESSION_DATA: 'session_data',
};

class SecureStorage {
  /**
   * Store data securely
   */
  async setItem(key, value, encrypt = false) {
    try {
      let dataToStore = value;
      
      if (typeof value === 'object') {
        dataToStore = JSON.stringify(value);
      }

      if (encrypt) {
        dataToStore = await encryptData(dataToStore);
      }

      await EncryptedStorage.setItem(key, dataToStore);
      return { success: true };
    } catch (error) {
      console.error(`Error storing ${key}:`, error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Retrieve data securely
   */
  async getItem(key, decrypt = false) {
    try {
      let data = await EncryptedStorage.getItem(key);
      
      if (!data) return null;

      if (decrypt) {
        data = await decryptData(data);
      }

      try {
        return JSON.parse(data);
      } catch {
        return data;
      }
    } catch (error) {
      console.error(`Error retrieving ${key}:`, error);
      return null;
    }
  }

  /**
   * Remove item from storage
   */
  async removeItem(key) {
    try {
      await EncryptedStorage.removeItem(key);
      return { success: true };
    } catch (error) {
      console.error(`Error removing ${key}:`, error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Clear all storage
   */
  async clear() {
    try {
      await EncryptedStorage.clear();
      return { success: true };
    } catch (error) {
      console.error('Error clearing storage:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Check if key exists
   */
  async hasItem(key) {
    try {
      const value = await EncryptedStorage.getItem(key);
      return value !== null;
    } catch (error) {
      console.error(`Error checking ${key}:`, error);
      return false;
    }
  }

  /**
   * Store multiple items at once
   */
  async setMultiple(items) {
    try {
      const promises = items.map(({ key, value, encrypt }) =>
        this.setItem(key, value, encrypt)
      );
      await Promise.all(promises);
      return { success: true };
    } catch (error) {
      console.error('Error storing multiple items:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Get multiple items at once
   */
  async getMultiple(keys) {
    try {
      const promises = keys.map((key) => this.getItem(key));
      const results = await Promise.all(promises);
      
      const data = {};
      keys.forEach((key, index) => {
        data[key] = results[index];
      });
      
      return data;
    } catch (error) {
      console.error('Error retrieving multiple items:', error);
      return {};
    }
  }

  // Specific storage methods
  async setAuthToken(token) {
    return this.setItem(STORAGE_KEYS.AUTH_TOKEN, token);
  }

  async getAuthToken() {
    return this.getItem(STORAGE_KEYS.AUTH_TOKEN);
  }

  async removeAuthToken() {
    return this.removeItem(STORAGE_KEYS.AUTH_TOKEN);
  }

  async setUserData(userData) {
    return this.setItem(STORAGE_KEYS.USER_DATA, userData);
  }

  async getUserData() {
    return this.getItem(STORAGE_KEYS.USER_DATA);
  }

  async setBiometricToken(token) {
    return this.setItem(STORAGE_KEYS.BIOMETRIC_TOKEN, token, true);
  }

  async getBiometricToken() {
    return this.getItem(STORAGE_KEYS.BIOMETRIC_TOKEN, true);
  }

  async setTransactionPin(pin) {
    return this.setItem(STORAGE_KEYS.TRANSACTION_PIN, pin, true);
  }

  async getTransactionPin() {
    return this.getItem(STORAGE_KEYS.TRANSACTION_PIN, true);
  }

  async setDeviceId(deviceId) {
    return this.setItem(STORAGE_KEYS.DEVICE_ID, deviceId);
  }

  async getDeviceId() {
    return this.getItem(STORAGE_KEYS.DEVICE_ID);
  }

  async setThemePreference(theme) {
    return this.setItem(STORAGE_KEYS.THEME_PREFERENCE, theme);
  }

  async getThemePreference() {
    return this.getItem(STORAGE_KEYS.THEME_PREFERENCE);
  }

  async setLanguagePreference(language) {
    return this.setItem(STORAGE_KEYS.LANGUAGE_PREFERENCE, language);
  }

  async getLanguagePreference() {
    return this.getItem(STORAGE_KEYS.LANGUAGE_PREFERENCE);
  }

  async setNotificationSettings(settings) {
    return this.setItem(STORAGE_KEYS.NOTIFICATION_SETTINGS, settings);
  }

  async getNotificationSettings() {
    return this.getItem(STORAGE_KEYS.NOTIFICATION_SETTINGS);
  }

  async saveBeneficiaries(beneficiaries) {
    return this.setItem(STORAGE_KEYS.BENEFICIARIES, beneficiaries);
  }

  async getBeneficiaries() {
    return this.getItem(STORAGE_KEYS.BENEFICIARIES) || [];
  }

  async addBeneficiary(beneficiary) {
    const beneficiaries = await this.getBeneficiaries();
    beneficiaries.push(beneficiary);
    return this.saveBeneficiaries(beneficiaries);
  }

  async removeBeneficiary(accountNumber) {
    const beneficiaries = await this.getBeneficiaries();
    const filtered = beneficiaries.filter(b => b.account_number !== accountNumber);
    return this.saveBeneficiaries(filtered);
  }

  async saveRecentSearches(searches) {
    return this.setItem(STORAGE_KEYS.RECENT_SEARCHES, searches);
  }

  async getRecentSearches() {
    return this.getItem(STORAGE_KEYS.RECENT_SEARCHES) || [];
  }

  async addRecentSearch(search) {
    const searches = await this.getRecentSearches();
    const filtered = searches.filter(s => s !== search);
    filtered.unshift(search);
    const limited = filtered.slice(0, 10); // Keep only 10 recent searches
    return this.saveRecentSearches(limited);
  }

  async setCachedData(key, data, ttl = 3600000) { // Default 1 hour TTL
    const cacheData = {
      data,
      timestamp: Date.now(),
      ttl,
    };
    return this.setItem(`${STORAGE_KEYS.CACHED_DATA}_${key}`, cacheData);
  }

  async getCachedData(key) {
    const cacheData = await this.getItem(`${STORAGE_KEYS.CACHED_DATA}_${key}`);
    
    if (!cacheData) return null;

    const { data, timestamp, ttl } = cacheData;
    const isExpired = Date.now() - timestamp > ttl;

    if (isExpired) {
      await this.removeItem(`${STORAGE_KEYS.CACHED_DATA}_${key}`);
      return null;
    }

    return data;
  }

  async clearCache() {
    try {
      const allKeys = await EncryptedStorage.getAllKeys();
      const cacheKeys = allKeys.filter(key => key.startsWith(STORAGE_KEYS.CACHED_DATA));
      
      await Promise.all(cacheKeys.map(key => this.removeItem(key)));
      return { success: true };
    } catch (error) {
      console.error('Error clearing cache:', error);
      return { success: false, error: error.message };
    }
  }

  async setSessionData(data) {
    return this.setItem(STORAGE_KEYS.SESSION_DATA, data);
  }

  async getSessionData() {
    return this.getItem(STORAGE_KEYS.SESSION_DATA);
  }

  async clearSessionData() {
    return this.removeItem(STORAGE_KEYS.SESSION_DATA);
  }
}

export default new SecureStorage();
export { STORAGE_KEYS };