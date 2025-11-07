import apiClient, { handleApiResponse, handleApiError } from './client';
import { encryptTransactionPin } from '../utils/encryption';

/**
 * Bill Payment API Service
 */
class BillPaymentService {
  /**
   * Buy airtime
   */
  async buyAirtime(airtimeData) {
    try {
      const encryptedPin = await encryptTransactionPin(airtimeData.transaction_pin);

      const payload = {
        provider: airtimeData.provider,
        phone_number: airtimeData.phone_number,
        amount: airtimeData.amount,
        transaction_pin: encryptedPin,
      };

      const response = await apiClient.post('/bills/airtime', payload);
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
   * Buy data bundle
   */
  async buyDataBundle(dataBundle) {
    try {
      const encryptedPin = await encryptTransactionPin(dataBundle.transaction_pin);

      const payload = {
        provider: dataBundle.provider,
        phone_number: dataBundle.phone_number,
        plan_code: dataBundle.plan_code,
        amount: dataBundle.amount,
        transaction_pin: encryptedPin,
      };

      const response = await apiClient.post('/bills/data', payload);
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
   * Get data plans
   */
  async getDataPlans(provider) {
    try {
      const response = await apiClient.get(`/bills/data-plans/${provider}`);
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
   * Pay electricity bill
   */
  async payElectricity(electricityData) {
    try {
      const encryptedPin = await encryptTransactionPin(electricityData.transaction_pin);

      const payload = {
        provider: electricityData.provider,
        meter_number: electricityData.meter_number,
        meter_type: electricityData.meter_type,
        amount: electricityData.amount,
        customer_name: electricityData.customer_name,
        transaction_pin: encryptedPin,
      };

      const response = await apiClient.post('/bills/electricity', payload);
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
   * Verify meter number
   */
  async verifyMeter(meterData) {
    try {
      const response = await apiClient.post('/bills/verify-meter', {
        provider: meterData.provider,
        meter_number: meterData.meter_number,
        meter_type: meterData.meter_type,
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
   * Pay cable TV subscription
   */
  async payCableTV(cableData) {
    try {
      const encryptedPin = await encryptTransactionPin(cableData.transaction_pin);

      const payload = {
        provider: cableData.provider,
        smartcard_number: cableData.smartcard_number,
        package_code: cableData.package_code,
        amount: cableData.amount,
        customer_name: cableData.customer_name,
        transaction_pin: encryptedPin,
      };

      const response = await apiClient.post('/bills/cable-tv', payload);
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
   * Verify smartcard number
   */
  async verifySmartcard(smartcardData) {
    try {
      const response = await apiClient.post('/bills/verify-smartcard', {
        provider: smartcardData.provider,
        smartcard_number: smartcardData.smartcard_number,
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
   * Get cable TV packages
   */
  async getCableTVPackages(provider) {
    try {
      const response = await apiClient.get(`/bills/cable-packages/${provider}`);
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
   * Pay internet subscription
   */
  async payInternet(internetData) {
    try {
      const encryptedPin = await encryptTransactionPin(internetData.transaction_pin);

      const payload = {
        provider: internetData.provider,
        account_number: internetData.account_number,
        package: internetData.package,
        amount: internetData.amount,
        transaction_pin: encryptedPin,
      };

      const response = await apiClient.post('/bills/internet', payload);
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
   * Get bill payment history
   */
  async getBillHistory(params = {}) {
    try {
      const queryParams = new URLSearchParams({
        page: params.page || 1,
        per_page: params.per_page || 20,
        ...(params.type && { type: params.type }),
        ...(params.from_date && { from_date: params.from_date }),
        ...(params.to_date && { to_date: params.to_date }),
      }).toString();

      const response = await apiClient.get(`/bills/history?${queryParams}`);
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
   * Get bill categories
   */
  async getBillCategories() {
    try {
      const response = await apiClient.get('/bills/categories');
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
   * Get bill providers
   */
  async getBillProviders(category) {
    try {
      const response = await apiClient.get(`/bills/providers/${category}`);
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
   * Save bill for quick payment
   */
  async saveBill(billData) {
    try {
      const response = await apiClient.post('/bills/save', billData);
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
   * Get saved bills
   */
  async getSavedBills() {
    try {
      const response = await apiClient.get('/bills/saved');
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
   * Delete saved bill
   */
  async deleteSavedBill(billId) {
    try {
      const response = await apiClient.delete(`/bills/saved/${billId}`);
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
   * Schedule bill payment
   */
  async scheduleBillPayment(scheduleData) {
    try {
      const encryptedPin = await encryptTransactionPin(scheduleData.transaction_pin);

      const payload = {
        ...scheduleData,
        transaction_pin: encryptedPin,
      };

      const response = await apiClient.post('/bills/schedule', payload);
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
   * Get scheduled bill payments
   */
  async getScheduledBills() {
    try {
      const response = await apiClient.get('/bills/scheduled');
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
   * Cancel scheduled bill payment
   */
  async cancelScheduledBill(scheduleId) {
    try {
      const response = await apiClient.delete(`/bills/scheduled/${scheduleId}`);
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
   * Get bill payment receipt
   */
  async getBillReceipt(reference) {
    try {
      const response = await apiClient.get(`/bills/receipt/${reference}`, {
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
}

export default new BillPaymentService();