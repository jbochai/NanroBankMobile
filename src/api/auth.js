import api from './client';
import SecureStorage from '../utils/storage';
import ReactNativeBiometrics from 'react-native-biometrics';

const AuthService = {
  /**
   * Login user
   */
  async login(credentials) {
    try {
      const response = await api.post('/auth/login', credentials);
      
      if (response.data.success) {
        const { access_token, user } = response.data.data;
        
        // Store token and user data
        await SecureStorage.setAuthToken(access_token);
        await SecureStorage.setUserData(user);
        
        return {
          success: true,
          data: {
            user,
            token: access_token,
          },
        };
      }
      
      return response.data;
    } catch (error) {
      console.error('Login error:', error.response?.data || error);
      return {
        success: false,
        message: error.response?.data?.message || 'Login failed',
        errors: error.response?.data?.errors || {},
        statusCode: error.response?.status || null,
      };
    }
  },

  /**
   * Register user
   */
  async register(userData) {
    try {
      const response = await api.post('/auth/register', userData);
      
      if (response.data.success) {
        const { access_token, user } = response.data.data;
        
        // Store token and user data
        await SecureStorage.setAuthToken(access_token);
        await SecureStorage.setUserData(user);
        
        return {
          success: true,
          data: {
            user,
            token: access_token,
          },
        };
      }
      
      return response.data;
    } catch (error) {
      console.error('Registration error:', error.response?.data || error);
      return {
        success: false,
        message: error.response?.data?.message || 'Registration failed',
        errors: error.response?.data?.errors || {},
      };
    }
  },

  /**
   * Logout user
   */
  async logout() {
    try {
      await api.post('/auth/logout');
      
      // Clear stored data
      await SecureStorage.removeAuthToken();
      await SecureStorage.setUserData(null);
      
      return { success: true };
    } catch (error) {
      // Clear local data even if API fails
      await SecureStorage.removeAuthToken();
      await SecureStorage.setUserData(null);
      
      console.error('Logout error:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Logout failed',
      };
    }
  },

  /**
   * Get current user data
   */
  async getMe() {
    try {
      const response = await api.get('/auth/me');
      
      if (response.data.success) {
        const user = response.data.data;
        await SecureStorage.setUserData(user);
        
        return {
          success: true,
          data: user,
        };
      }
      
      return response.data;
    } catch (error) {
      console.error('Get me error:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to fetch user',
      };
    }
  },

  /**
   * Check if user is authenticated
   */
  async isAuthenticated() {
    try {
      const token = await SecureStorage.getAuthToken();
      return !!token;
    } catch (error) {
      return false;
    }
  },

  /**
   * Setup biometric authentication
   */
  async setupBiometric() {
    try {
      const rnBiometrics = new ReactNativeBiometrics();
      
      const { available, biometryType } = await rnBiometrics.isSensorAvailable();
      
      if (!available) {
        return {
          success: false,
          message: 'Biometric authentication not available',
        };
      }

      const { success } = await rnBiometrics.simplePrompt({
        promptMessage: 'Confirm your identity',
      });

      if (success) {
        await SecureStorage.setItem('biometric_enabled', true);
        return { success: true, data: { biometryType } };
      }

      return { success: false, message: 'Biometric authentication failed' };
    } catch (error) {
      console.error('Biometric setup error:', error);
      return {
        success: false,
        message: 'Failed to setup biometric authentication',
      };
    }
  },

  /**
   * Biometric login
   */
  async biometricLogin() {
    try {
      const rnBiometrics = new ReactNativeBiometrics();
      
      const { success } = await rnBiometrics.simplePrompt({
        promptMessage: 'Authenticate to login',
      });

      if (success) {
        // Get stored user data
        const userData = await SecureStorage.getUserData();
        const token = await SecureStorage.getAuthToken();
        
        if (userData && token) {
          return {
            success: true,
            data: {
              user: userData,
              token,
            },
          };
        }
      }

      return { success: false, message: 'Biometric authentication failed' };
    } catch (error) {
      console.error('Biometric login error:', error);
      return {
        success: false,
        message: 'Failed to authenticate with biometrics',
      };
    }
  },

  /**
   * Check if biometric is enabled
   */
  async isBiometricEnabled() {
    try {
      const enabled = await SecureStorage.getItem('biometric_enabled');
      return !!enabled;
    } catch (error) {
      return false;
    }
  },

  /**
   * Refresh token
   */
  async refreshToken() {
    try {
      const response = await api.post('/auth/refresh');
      
      if (response.data.success) {
        const { access_token } = response.data.data;
        await SecureStorage.setAuthToken(access_token);
        
        return {
          success: true,
          data: { token: access_token },
        };
      }
      
      return response.data;
    } catch (error) {
      console.error('Refresh token error:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to refresh token',
      };
    }
  },
};

export default AuthService;