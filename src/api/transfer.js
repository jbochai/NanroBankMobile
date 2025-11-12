import apiClient, { handleApiResponse, handleApiError } from './client';

/**
 * Transfer API Service
 * NOTE: PIN encryption is handled by the backend, not frontend
 */
class TransferService {
  /**
   * Intra-bank transfer (within Nanro Bank)
   */
  async intraBankTransfer(transferData) {
    try {
      // Send PIN as-is, backend will handle encryption and verification
       console.log('ABout to post a transaction to Backend for :', transferData );

      const response = await apiClient.post('/transfer/intra-bank', transferData);

             console.log('Back from Backend Server for :', response );

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
      // Send PIN as-is, backend will handle encryption and verification
      const response = await apiClient.post('/transfer/inter-bank', transferData);
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
      const responseData = handleApiResponse(response);
      
      // Handle nested response structure if needed
      const beneficiaries = responseData?.beneficiaries || responseData || [];

      return {
        success: true,
        data: beneficiaries,
      };
    } catch (error) {
      console.error('Failed to fetch beneficiaries:', error);
      
      // If endpoint doesn't exist or returns 404, return empty array
      if (error?.response?.status === 404 || error?.status === 404) {
        return {
          success: true,
          data: [],
        };
      }
      
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
      // Send PIN as-is for verification
      const response = await apiClient.delete(`/transfer/beneficiaries/${beneficiaryId}`, {
        data: { transaction_pin: pin }
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
      const response = await apiClient.get('/transfer/fetch-bank-list');
      const responseData = handleApiResponse(response);
      
      // Extract banks array from nested structure
      // Response format: { success: true, data: { banks: [...], total: 60 } }
      const banks = responseData?.banks || responseData || [];

      return {
        success: true,
        data: banks,
      };
    } catch (error) {
      console.error('Failed to fetch bank list:', error);
      
      // If endpoint doesn't exist or returns 404
      if (error?.response?.status === 404 || error?.status === 404) {
        console.warn('Bank list endpoint returned 404');
        return {
          success: false,
          message: 'Bank list endpoint not found',
          statusCode: 404,
        };
      }
      
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
      // Send PIN as-is
      const response = await apiClient.post('/transfer/schedule', transferData);
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
      // Send PIN as-is
      const response = await apiClient.delete(`/transfer/scheduled/${transferId}`, {
        data: { transaction_pin: pin }
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
      // Send PIN as-is
      const payload = {
        transfers,
        transaction_pin: pin,
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
        // Send PIN as-is
        payload.transaction_pin = pin;
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