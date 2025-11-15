import apiClient from './client';



class KYCService {
  /**
   * Upload KYC document
   * @param {FormData} formData - FormData containing document_type and document file
   * @returns {Promise<Object>}
   */
  uploadDocument = async (formData) => {
    try {
      console.log('📤 Uploading KYC document...');

      const response = await apiClient.post('/profile/kyc/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        // Transform request to ensure proper FormData handling
        transformRequest: (data) => data,
      });

      if (response.data?.success) {
        console.log('✅ KYC document uploaded successfully');
        return {
          success: true,
          message: response.data.message || 'Document uploaded successfully',
          data: response.data.data,
        };
      }

      return {
        success: false,
        message: response.data?.message || 'Failed to upload document',
      };
    } catch (error) {
      console.error('❌ KYC upload error:', error.response?.data || error.message);
      
      return {
        success: false,
        message: error.response?.data?.message || 'An error occurred while uploading document',
        errors: error.response?.data?.errors,
      };
    }
  };

  /**
   * Get KYC status and documents
   * @returns {Promise<Object>}
   */
  getKYCStatus = async () => {
    try {
      console.log('📋 Fetching KYC status...');

      const response = await apiClient.get('/profile/kyc/status');

      if (response.data?.success) {
        console.log('✅ KYC status retrieved');
        return {
          success: true,
          data: response.data.data,
        };
      }

      return {
        success: false,
        message: response.data?.message || 'Failed to fetch KYC status',
      };
    } catch (error) {
      console.error('❌ KYC status error:', error.response?.data || error.message);
      
      return {
        success: false,
        message: error.response?.data?.message || 'An error occurred while fetching KYC status',
      };
    }
  };

  /**
   * Get list of uploaded documents
   * @returns {Promise<Object>}
   */
  getDocuments = async () => {
    try {
      console.log('📄 Fetching KYC documents...');

      const response = await apiClient.get('/profile/kyc/documents');

      if (response.data?.success) {
        console.log('✅ Documents retrieved');
        return {
          success: true,
          data: response.data.data,
        };
      }

      return {
        success: false,
        message: response.data?.message || 'Failed to fetch documents',
      };
    } catch (error) {
      console.error('❌ Documents fetch error:', error.response?.data || error.message);
      
      return {
        success: false,
        message: error.response?.data?.message || 'An error occurred while fetching documents',
      };
    }
  };

  /**
   * Delete a KYC document
   * @param {number} documentId - Document ID to delete
   * @returns {Promise<Object>}
   */
  deleteDocument = async (documentId) => {
    try {
      console.log('🗑️ Deleting KYC document:', documentId);

      const response = await apiClient.delete(`/profile/kyc/documents/${documentId}`);

      if (response.data?.success) {
        console.log('✅ Document deleted successfully');
        return {
          success: true,
          message: response.data.message || 'Document deleted successfully',
        };
      }

      return {
        success: false,
        message: response.data?.message || 'Failed to delete document',
      };
    } catch (error) {
      console.error('❌ Document delete error:', error.response?.data || error.message);
      
      return {
        success: false,
        message: error.response?.data?.message || 'An error occurred while deleting document',
      };
    }
  };
}

export default new KYCService();