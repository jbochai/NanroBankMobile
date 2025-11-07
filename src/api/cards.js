import apiClient, { handleApiResponse, handleApiError } from './client';

/**
 * Cards API Service
 */
class CardsService {
  /**
   * Get all user cards
   */
  async getCards() {
    try {
      const response = await apiClient.get('/cards');
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
   * Get card details
   */
  async getCardDetails(cardId) {
    try {
      const response = await apiClient.get(`/cards/${cardId}`);
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
   * Request new card
   */
  async requestCard(cardData) {
    try {
      const response = await apiClient.post('/cards/request', cardData);
      const data = handleApiResponse(response);

      return {
        success: true,
        data,
        message: 'Card request submitted successfully',
      };
    } catch (error) {
      return handleApiError(error);
    }
  }

  /**
   * Activate card
   */
  async activateCard(cardId, activationData) {
    try {
      const response = await apiClient.post(`/cards/${cardId}/activate`, activationData);
      const data = handleApiResponse(response);

      return {
        success: true,
        data,
        message: 'Card activated successfully',
      };
    } catch (error) {
      return handleApiError(error);
    }
  }

  /**
   * Block/Freeze card
   */
  async blockCard(cardId, reason) {
    try {
      const response = await apiClient.post(`/cards/${cardId}/block`, { reason });
      const data = handleApiResponse(response);

      return {
        success: true,
        data,
        message: 'Card blocked successfully',
      };
    } catch (error) {
      return handleApiError(error);
    }
  }

  /**
   * Unblock card
   */
  async unblockCard(cardId) {
    try {
      const response = await apiClient.post(`/cards/${cardId}/unblock`);
      const data = handleApiResponse(response);

      return {
        success: true,
        data,
        message: 'Card unblocked successfully',
      };
    } catch (error) {
      return handleApiError(error);
    }
  }

  /**
   * Set card PIN
   */
  async setCardPin(cardId, pin) {
    try {
      const response = await apiClient.post(`/cards/${cardId}/set-pin`, { pin });
      const data = handleApiResponse(response);

      return {
        success: true,
        data,
        message: 'Card PIN set successfully',
      };
    } catch (error) {
      return handleApiError(error);
    }
  }

  /**
   * Change card PIN
   */
  async changeCardPin(cardId, oldPin, newPin) {
    try {
      const response = await apiClient.post(`/cards/${cardId}/change-pin`, {
        old_pin: oldPin,
        new_pin: newPin,
      });
      const data = handleApiResponse(response);

      return {
        success: true,
        data,
        message: 'Card PIN changed successfully',
      };
    } catch (error) {
      return handleApiError(error);
    }
  }

  /**
   * Get card transactions
   */
  async getCardTransactions(cardId, params = {}) {
    try {
      const response = await apiClient.get(`/cards/${cardId}/transactions`, { params });
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
   * Set card spending limit
   */
  async setSpendingLimit(cardId, limit) {
    try {
      const response = await apiClient.post(`/cards/${cardId}/spending-limit`, {
        daily_limit: limit.daily,
        weekly_limit: limit.weekly,
        monthly_limit: limit.monthly,
      });
      const data = handleApiResponse(response);

      return {
        success: true,
        data,
        message: 'Spending limit updated successfully',
      };
    } catch (error) {
      return handleApiError(error);
    }
  }

  /**
   * Create virtual card
   */
  async createVirtualCard(cardData) {
    try {
      const response = await apiClient.post('/cards/virtual', cardData);
      const data = handleApiResponse(response);

      return {
        success: true,
        data,
        message: 'Virtual card created successfully',
      };
    } catch (error) {
      return handleApiError(error);
    }
  }

  /**
   * Delete virtual card
   */
  async deleteVirtualCard(cardId) {
    try {
      const response = await apiClient.delete(`/cards/virtual/${cardId}`);
      const data = handleApiResponse(response);

      return {
        success: true,
        data,
        message: 'Virtual card deleted successfully',
      };
    } catch (error) {
      return handleApiError(error);
    }
  }

  /**
   * Get card CVV (temporary reveal)
   */
  async revealCardCVV(cardId) {
    try {
      const response = await apiClient.post(`/cards/${cardId}/reveal-cvv`);
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
   * Report card lost/stolen
   */
  async reportCard(cardId, reportData) {
    try {
      const response = await apiClient.post(`/cards/${cardId}/report`, reportData);
      const data = handleApiResponse(response);

      return {
        success: true,
        data,
        message: 'Card reported successfully. A replacement will be issued.',
      };
    } catch (error) {
      return handleApiError(error);
    }
  }

  /**
   * Enable/disable contactless payments
   */
  async toggleContactless(cardId, enabled) {
    try {
      const response = await apiClient.post(`/cards/${cardId}/contactless`, { enabled });
      const data = handleApiResponse(response);

      return {
        success: true,
        data,
        message: `Contactless payments ${enabled ? 'enabled' : 'disabled'} successfully`,
      };
    } catch (error) {
      return handleApiError(error);
    }
  }

  /**
   * Enable/disable online payments
   */
  async toggleOnlinePayments(cardId, enabled) {
    try {
      const response = await apiClient.post(`/cards/${cardId}/online-payments`, { enabled });
      const data = handleApiResponse(response);

      return {
        success: true,
        data,
        message: `Online payments ${enabled ? 'enabled' : 'disabled'} successfully`,
      };
    } catch (error) {
      return handleApiError(error);
    }
  }

  /**
   * Enable/disable international transactions
   */
  async toggleInternational(cardId, enabled) {
    try {
      const response = await apiClient.post(`/cards/${cardId}/international`, { enabled });
      const data = handleApiResponse(response);

      return {
        success: true,
        data,
        message: `International transactions ${enabled ? 'enabled' : 'disabled'} successfully`,
      };
    } catch (error) {
      return handleApiError(error);
    }
  }
}

export default new CardsService();