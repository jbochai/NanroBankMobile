import apiClient, { handleApiResponse, handleApiError } from './client';

/**
 * Transaction API Service
 */
class TransactionService {
  /**
   * Get transactions with filters
   */
  async getTransactions(params = {}) {
    try {
      const queryParams = new URLSearchParams({
        page: params.page || 1,
        per_page: params.per_page || 20,
        ...(params.type && { type: params.type }),
        ...(params.status && { status: params.status }),
        ...(params.from_date && { from_date: params.from_date }),
        ...(params.to_date && { to_date: params.to_date }),
        ...(params.search && { search: params.search }),
      }).toString();

      const response = await apiClient.get(`/transactions?${queryParams}`);
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
   * Get recent transactions
   */
  async getRecentTransactions(params = {}) {
    try {
      const queryParams = new URLSearchParams({
        limit: params.limit || 5,
      }).toString();

      const response = await apiClient.get(`/transactions/recent?${queryParams}`);
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
   * Get transaction details by reference
   */
  async getTransactionDetails(reference) {
    try {
      const response = await apiClient.get(`/transactions/${reference}`);
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
   * Download transaction receipt
   */
  async downloadReceipt(reference) {
    try {
      const response = await apiClient.get(`/transactions/download/receipt/${reference}`, {
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
   * Get transaction summary
   */
  async getTransactionSummary(period = 'month') {
    try {
      const response = await apiClient.get(`/transactions/summary?period=${period}`);
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
   * Get transaction statistics
   */
  async getTransactionStats() {
    try {
      const response = await apiClient.get('/transactions/stats');
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
   * Search transactions
   */
  async searchTransactions(searchQuery) {
    try {
      const response = await apiClient.get(`/transactions/search?q=${encodeURIComponent(searchQuery)}`);
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
   * Get transaction categories
   */
  async getTransactionCategories() {
    try {
      const response = await apiClient.get('/transactions/categories');
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
   * Export transactions
   */
  async exportTransactions(params) {
    try {
      const queryParams = new URLSearchParams({
        format: params.format || 'pdf',
        from_date: params.from_date,
        to_date: params.to_date,
        ...(params.type && { type: params.type }),
      }).toString();

      const response = await apiClient.get(`/transactions/export?${queryParams}`, {
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
   * Get pending transactions
   */
  async getPendingTransactions() {
    try {
      const response = await apiClient.get('/transactions/pending');
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
   * Retry failed transaction
   */
  async retryTransaction(reference) {
    try {
      const response = await apiClient.post(`/transactions/${reference}/retry`);
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
   * Cancel pending transaction
   */
  async cancelTransaction(reference) {
    try {
      const response = await apiClient.post(`/transactions/${reference}/cancel`);
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
   * Dispute transaction
   */
  async disputeTransaction(reference, disputeData) {
    try {
      const response = await apiClient.post(`/transactions/${reference}/dispute`, disputeData);
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
   * Get transaction disputes
   */
  async getDisputes() {
    try {
      const response = await apiClient.get('/transactions/disputes');
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
   * Share transaction receipt
   */
  async shareReceipt(reference) {
    try {
      const response = await apiClient.post(`/transactions/${reference}/share`);
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

export default new TransactionService();