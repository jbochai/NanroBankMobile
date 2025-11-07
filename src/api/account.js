import apiClient, { handleApiResponse, handleApiError } from './client';
import { encryptTransactionPin } from '../utils/encryption';
import EncryptedStorage from 'react-native-encrypted-storage';

/**
 * Account API Service
 */
class AccountService {
  /**
   * Get account balance
   */
  async getBalance() {
    try {
      const response = await apiClient.get('/account/balance');
      const data = handleApiResponse(response);

      return {
        success: true,
        data,
      };
    } catch (error) {
      return handleApiError(error);
    }
  }

  /**
   * Get account details
   */
  async getAccountDetails() {
    try {
      const response = await apiClient.get('/account/details');
      const data = handleApiResponse(response);

      return {
        success: true,
        data,
      };
    } catch (error) {
      return handleApiError(error);
    }
  }

  /**
   * Get all accounts
   */
  async getAccounts() {
    try {
      const response = await apiClient.get('/accounts');
      const data = handleApiResponse(response);

      return {
        success: true,
        data,
      };
    } catch (error) {
      return handleApiError(error);
    }
  }

  /**
   * Set transaction PIN
   */
  async setTransactionPin(pinData) {
    try {
      const encryptedPin = await encryptTransactionPin(pinData.pin);
      const encryptedConfirmation = await encryptTransactionPin(pinData.pin_confirmation);

      const payload = {
        pin: encryptedPin,
        pin_confirmation: encryptedConfirmation,
      };

      const response = await apiClient.post('/account/set-pin', payload);
      const data = handleApiResponse(response);

      // Store PIN status locally
      await EncryptedStorage.setItem('has_transaction_pin', 'true');

      return {
        success: true,
        data,
      };
    } catch (error) {
      return handleApiError(error);
    }
  }

  /**
   * Change transaction PIN
   */
  async changeTransactionPin(pinData) {
    try {
      const encryptedOldPin = await encryptTransactionPin(pinData.old_pin);
      const encryptedNewPin = await encryptTransactionPin(pinData.new_pin);
      const encryptedConfirmation = await encryptTransactionPin(pinData.new_pin_confirmation);

      const payload = {
        old_pin: encryptedOldPin,
        new_pin: encryptedNewPin,
        new_pin_confirmation: encryptedConfirmation,
      };

      const response = await apiClient.post('/account/change-pin', payload);
      const data = handleApiResponse(response);

      return {
        success: true,
        data,
      };
    } catch (error) {
      return handleApiError(error);
    }
  }

  /**
   * Reset transaction PIN
   */
  async resetTransactionPin(resetData) {
    try {
      const response = await apiClient.post('/account/reset-pin', resetData);
      const data = handleApiResponse(response);

      return {
        success: true,
        data,
      };
    } catch (error) {
      return handleApiError(error);
    }
  }

  /**
   * Validate transaction PIN
   */
  async validatePin(pin) {
    try {
      const encryptedPin = await encryptTransactionPin(pin);

      const response = await apiClient.post('/account/validate-pin', {
        pin: encryptedPin,
      });
      const data = handleApiResponse(response);

      return {
        success: true,
        data,
      };
    } catch (error) {
      return handleApiError(error);
    }
  }

  /**
   * Get account statement
   */
  async getAccountStatement(params) {
    try {
      const queryParams = new URLSearchParams(params).toString();
      const response = await apiClient.get(`/account/statement?${queryParams}`);
      const data = handleApiResponse(response);

      return {
        success: true,
        data,
      };
    } catch (error) {
      return handleApiError(error);
    }
  }

  /**
   * Download account statement
   */
  async downloadStatement(params) {
    try {
      const queryParams = new URLSearchParams(params).toString();
      const response = await apiClient.get(`/account/statement/download?${queryParams}`, {
        responseType: 'blob',
      });

      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      return handleApiError(error);
    }
  }

  /**
   * Get account limits
   */
  async getAccountLimits() {
    try {
      const response = await apiClient.get('/account/limits');
      const data = handleApiResponse(response);

      return {
        success: true,
        data,
      };
    } catch (error) {
      return handleApiError(error);
    }
  }

  /**
   * Update account limits
   */
  async updateAccountLimits(limits, pin) {
    try {
      const encryptedPin = await encryptTransactionPin(pin);

      const payload = {
        ...limits,
        transaction_pin: encryptedPin,
      };

      const response = await apiClient.post('/account/limits', payload);
      const data = handleApiResponse(response);

      return {
        success: true,
        data,
      };
    } catch (error) {
      return handleApiError(error);
    }
  }

  /**
   * Freeze account
   */
  async freezeAccount(reason, pin) {
    try {
      const encryptedPin = await encryptTransactionPin(pin);

      const payload = {
        reason,
        transaction_pin: encryptedPin,
      };

      const response = await apiClient.post('/account/freeze', payload);
      const data = handleApiResponse(response);

      return {
        success: true,
        data,
      };
    } catch (error) {
      return handleApiError(error);
    }
  }

  /**
   * Unfreeze account
   */
  async unfreezeAccount(pin) {
    try {
      const encryptedPin = await encryptTransactionPin(pin);

      const payload = {
        transaction_pin: encryptedPin,
      };

      const response = await apiClient.post('/account/unfreeze', payload);
      const data = handleApiResponse(response);

      return {
        success: true,
        data,
      };
    } catch (error) {
      return handleApiError(error);
    }
  }

  /**
   * Get mini statement
   */
  async getMiniStatement() {
    try {
      const response = await apiClient.get('/account/mini-statement');
      const data = handleApiResponse(response);

      return {
        success: true,
        data,
      };
    } catch (error) {
      return handleApiError(error);
    }
  }

  /**
   * Check if user has transaction PIN
   */
  async hasTransactionPin() {
    try {
      const hasPinStored = await EncryptedStorage.getItem('has_transaction_pin');
      if (hasPinStored) {
        return hasPinStored === 'true';
      }

      // Check with server
      const response = await apiClient.get('/account/has-pin');
      const data = handleApiResponse(response);
      
      // Store locally
      await EncryptedStorage.setItem('has_transaction_pin', data.has_pin ? 'true' : 'false');
      
      return data.has_pin;
    } catch (error) {
      return false;
    }
  }

  /**
   * Add account (for multiple accounts)
   */
  async addAccount(accountData) {
    try {
      const response = await apiClient.post('/accounts/add', accountData);
      const data = handleApiResponse(response);

      return {
        success: true,
        data,
      };
    } catch (error) {
      return handleApiError(error);
    }
  }

  /**
   * Switch primary account
   */
  async switchPrimaryAccount(accountId, pin) {
    try {
      const encryptedPin = await encryptTransactionPin(pin);

      const payload = {
        account_id: accountId,
        transaction_pin: encryptedPin,
      };

      const response = await apiClient.post('/accounts/switch-primary', payload);
      const data = handleApiResponse(response);

      return {
        success: true,
        data,
      };
    } catch (error) {
      return handleApiError(error);
    }
  }
}

export default new AccountService();