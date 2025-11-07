import apiClient, { handleApiResponse, handleApiError } from './client';
import { encryptTransactionPin } from '../utils/encryption';

/**
 * Transfer API Service
 */
class TransferService {
  /**
   * Intra-bank transfer (within Nanro Bank)
   */
  async intraBankTransfer(transferData) {
    try {
      // Encrypt transaction PIN
      const encryptedPin = await encryptTransactionPin(transferData.transaction_pin);

      const payload = {
        ...transferData,
        transaction_pin: encryptedPin,
      };

      const response = await apiClient.post('/transfer/intra-bank', payload);
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
   * Inter-bank transfer (to other banks)
   */
  async interBankTransfer(transferData) {
    try {
      // Encrypt transaction PIN
      const encryptedPin = await encryptTransactionPin(transferData.transaction_pin);

      const payload = {
        ...transferData,
        transaction_pin: encryptedPin,
      };

      const response = await apiClient.post('/transfer/inter-bank', payload);
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
   * Verify account number
   */
  async verifyAccount(accountData) {
    try {
      const response = await apiClient.post('/transfer/verify-account', accountData);
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
   * Get list of beneficiaries
   */
  async getBeneficiaries(filters = {}) {
    try {
      const params = new URLSearchParams(filters).toString();
      const response = await apiClient.get(`/transfer/beneficiaries${params ? '?' + params : ''}`);
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
   * Add new beneficiary
   */
  async addBeneficiary(beneficiaryData) {
    try {
      const response = await apiClient.post('/transfer/beneficiaries', beneficiaryData);
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
   * Update beneficiary
   */
  async updateBeneficiary(beneficiaryId, beneficiaryData) {
    try {
      const response = await apiClient.put(`/transfer/beneficiaries/${beneficiaryId}`, beneficiaryData);
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
   * Delete beneficiary
   */
  async deleteBeneficiary(beneficiaryId, pin) {
    try {
      const encryptedPin = await encryptTransactionPin(pin);

      const response = await apiClient.delete(`/transfer/beneficiaries/${beneficiaryId}`, {
        data: { transaction_pin: encryptedPin }
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
   * Get list of banks
   */
  async getBankList() {
    try {
      const response = await apiClient.get('/transfer/banks');
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
   * Get transfer limits
   */
  async getTransferLimits() {
    try {
      const response = await apiClient.get('/transfer/limits');
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
   * Schedule a transfer
   */
  async scheduleTransfer(transferData) {
    try {
      const encryptedPin = await encryptTransactionPin(transferData.transaction_pin);

      const payload = {
        ...transferData,
        transaction_pin: encryptedPin,
      };

      const response = await apiClient.post('/transfer/schedule', payload);
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
   * Get scheduled transfers
   */
  async getScheduledTransfers() {
    try {
      const response = await apiClient.get('/transfer/scheduled');
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
   * Cancel scheduled transfer
   */
  async cancelScheduledTransfer(transferId, pin) {
    try {
      const encryptedPin = await encryptTransactionPin(pin);

      const response = await apiClient.delete(`/transfer/scheduled/${transferId}`, {
        data: { transaction_pin: encryptedPin }
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
   * Bulk transfer
   */
  async bulkTransfer(transfers, pin) {
    try {
      const encryptedPin = await encryptTransactionPin(pin);

      const payload = {
        transfers,
        transaction_pin: encryptedPin,
      };

      const response = await apiClient.post('/transfer/bulk', payload);
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
   * Get transfer charges
   */
  async getTransferCharges(amount, transferType = 'intra-bank') {
    try {
      const response = await apiClient.post('/transfer/charges', {
        amount,
        transfer_type: transferType,
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
   * Validate transfer before processing
   */
  async validateTransfer(transferData) {
    try {
      const response = await apiClient.post('/transfer/validate', transferData);
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
   * Get transfer status
   */
  async getTransferStatus(reference) {
    try {
      const response = await apiClient.get(`/transfer/status/${reference}`);
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
   * Request money from another user
   */
  async requestMoney(requestData) {
    try {
      const response = await apiClient.post('/transfer/request-money', requestData);
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
   * Get money requests
   */
  async getMoneyRequests(type = 'received') {
    try {
      const response = await apiClient.get(`/transfer/money-requests?type=${type}`);
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
   * Respond to money request
   */
  async respondToMoneyRequest(requestId, action, pin = null) {
    try {
      const payload = { action };
      
      if (action === 'approve' && pin) {
        payload.transaction_pin = await encryptTransactionPin(pin);
      }

      const response = await apiClient.post(`/transfer/money-requests/${requestId}/respond`, payload);
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

export default new TransferService();