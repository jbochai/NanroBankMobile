import api from './client';
import SecureStorage from '../utils/storage';
import ReactNativeBiometrics from 'react-native-biometrics';
import EncryptedStorage from 'react-native-encrypted-storage';

const AuthService = {
  /**
   * Login user
   */
  async login(credentials) {
    try {
       console.log('=== Login Attempt ===');
      console.log('Credentials:', { ...credentials, password: '***' });
      console.log('API client check:', !!api);
      console.log('API client post method:', typeof api?.post);
      
      if (!api || typeof api.post !== 'function') {
        throw new Error('API client not initialized properly');
      }
      
      const response = await api.post('/auth/login', credentials);
      
      console.log('Login response:', response.data);
      
      if (response.data.success) {
        const { access_token, user } = response.data.data;
        
        // Check if biometric keys exist before login
        const hadBiometricKeys = await EncryptedStorage.getItem('biometric_public_key');
        
        // Store token and user data
        await SecureStorage.setAuthToken(access_token);
        await SecureStorage.setUserData(user);
        
        // Store password for unlock screen (encrypted)
        await this.storePassword(credentials.password);
        
        // Sync biometric enabled status from backend
        console.log('Login - User biometric_enabled:', user.biometric_enabled);
        
        if (user.biometric_enabled) {
          await SecureStorage.setItem('biometric_enabled', 'true');
          
          // If user had biometric keys before, keep them
          // If not, they need to set up biometric again
          if (!hadBiometricKeys) {
            console.log('Login - Biometric enabled on backend but no local keys');
          }
        } else {
          await SecureStorage.setItem('biometric_enabled', 'false');
          // Clear biometric data if disabled on backend
          await EncryptedStorage.removeItem('biometric_public_key');
          await EncryptedStorage.removeItem('biometric_signature');
        }
        
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
      console.error('Login error:', error);
      console.error('Login error response:', error.response?.data);
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
      console.log('=== Registration Attempt ===');
      
      const response = await api.post('/auth/register', userData);
      
      console.log('Registration response:', response.data);
      
      if (response.data.success) {
        const { access_token, user } = response.data.data;
        
        // Store token and user data
        await SecureStorage.setAuthToken(access_token);
        await SecureStorage.setUserData(user);
        
        // Store password for unlock screen (encrypted)
        await this.storePassword(userData.password);
        
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
      await this.removeStoredPassword();
      await SecureStorage.setItem('biometric_enabled', 'false');
      
      return { success: true };
    } catch (error) {
      // Clear local data even if API fails
      await SecureStorage.removeAuthToken();
      await SecureStorage.setUserData(null);
      await this.removeStoredPassword();
      await SecureStorage.setItem('biometric_enabled', 'false');
      
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
        
        // Sync biometric enabled status from backend
        if (user.biometric_enabled) {
          await SecureStorage.setItem('biometric_enabled', 'true');
        } else {
          await SecureStorage.setItem('biometric_enabled', 'false');
        }
        
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
   * Requires transaction PIN for security
   */
  async setupBiometric(transactionPin) {
    try {
      const rnBiometrics = new ReactNativeBiometrics();
      
      const { available, biometryType } = await rnBiometrics.isSensorAvailable();
      
      if (!available) {
        return {
          success: false,
          message: 'Biometric authentication not available',
        };
      }

      // Create biometric keys
      const { publicKey } = await rnBiometrics.createKeys();
      console.log('setupBiometric - publicKey created:', !!publicKey);

      // Prompt user to authenticate
      const { success } = await rnBiometrics.simplePrompt({
        promptMessage: 'Confirm your identity',
      });

      if (success) {
        // Create signature/token for backend
        const epoch = (new Date()).getTime();
        const payload = epoch.toString();
        
        const { signature } = await rnBiometrics.createSignature({
          promptMessage: 'Confirm biometric setup',
          payload: payload,
        });

        console.log('setupBiometric - signature created:', !!signature);

        // Get current auth token
        const authToken = await SecureStorage.getAuthToken();
        
        if (!authToken) {
          return {
            success: false,
            message: 'Authentication required. Please login first.',
          };
        }

        // Send biometric token to backend with Bearer token and transaction PIN
        try {
          const response = await api.post('/profile/biometric/enable', {
            biometric_token: signature || publicKey,
            transaction_pin: transactionPin,
          }, {
            headers: {
              'Authorization': `Bearer ${authToken}`,
            }
          });

          if (response.data.success) {
            // IMPORTANT: Store these BEFORE updating other data
            await EncryptedStorage.setItem('biometric_public_key', publicKey);
            await EncryptedStorage.setItem('biometric_signature', signature || publicKey);
            
            console.log('setupBiometric - Stored publicKey:', publicKey);
            console.log('setupBiometric - Stored signature:', signature || publicKey);
            
            // Store biometric enabled flag
            await SecureStorage.setItem('biometric_enabled', 'true');
            
            // Update user data with new biometric status
            const userData = await SecureStorage.getUserData();
            if (userData) {
              userData.biometric_enabled = true;
              await SecureStorage.setUserData(userData);
              console.log('setupBiometric - Updated user data');
            }
            
            // Verify storage
            const storedKey = await EncryptedStorage.getItem('biometric_public_key');
            const storedSig = await EncryptedStorage.getItem('biometric_signature');
            console.log('setupBiometric - Verification - Has publicKey:', !!storedKey);
            console.log('setupBiometric - Verification - Has signature:', !!storedSig);
            
            return { 
              success: true, 
              data: { 
                biometryType,
                publicKey,
                signature,
              } 
            };
          }
          
          return {
            success: false,
            message: response.data.message || 'Failed to enable biometric',
          };
        } catch (apiError) {
          console.error('Backend biometric enable error:', apiError.response?.data || apiError);
          
          return { 
            success: false, 
            message: apiError.response?.data?.message || 'Failed to enable biometric on server',
          };
        }
      }

      return { success: false, message: 'Biometric authentication cancelled' };
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
   * This uses the biometric login endpoint WITHOUT Bearer token (public login)
   */
  async biometricLogin() {
    try {
      const rnBiometrics = new ReactNativeBiometrics();
      
      // Check if biometric is enabled in settings
      const isEnabled = await this.isBiometricEnabled();
      console.log('biometricLogin - isEnabled:', isEnabled);
      
      if (!isEnabled) {
        return {
          success: false,
          message: 'Biometric login not enabled. Please enable it in settings.',
        };
      }

      // Check if keys exist
      const { keysExist } = await rnBiometrics.biometricKeysExist();
      console.log('biometricLogin - keysExist:', keysExist);
      
      if (!keysExist) {
        // Keys don't exist but backend says enabled - need to re-setup
        console.log('Keys missing - biometric needs to be re-enabled in settings');
        return { 
          success: false, 
          message: 'Biometric setup incomplete. Please re-enable in Security Settings.',
        };
      }

      // Get stored signature
      const storedSignature = await EncryptedStorage.getItem('biometric_signature');
      const publicKey = await EncryptedStorage.getItem('biometric_public_key');
      
      console.log('biometricLogin - Has signature:', !!storedSignature);
      console.log('biometricLogin - Has publicKey:', !!publicKey);

      if (!storedSignature && !publicKey) {
        return {
          success: false,
          message: 'Biometric setup incomplete. Please re-enable in Security Settings.',
        };
      }

      // Authenticate with biometrics
      const epoch = (new Date()).getTime();
      const payload = epoch.toString();
      
      const { success, signature } = await rnBiometrics.createSignature({
        promptMessage: 'Authenticate to login',
        payload: payload,
      });

      if (success) {
        // Use the stored signature for login
        const biometricToken = storedSignature || signature || publicKey;
        
        console.log('biometricLogin - Attempting login with token');
        
        // Try backend authentication WITHOUT Bearer token (public endpoint)
        try {
          const response = await api.post('/auth/login/biometric', {
            biometric_token: biometricToken,
          });
          
          if (response.data.success) {
            const { access_token, user } = response.data.data;
            
            // Store token and user data
            await SecureStorage.setAuthToken(access_token);
            await SecureStorage.setUserData(user);
            
            // Sync biometric status
            if (user.biometric_enabled) {
              await SecureStorage.setItem('biometric_enabled', 'true');
            }
            
            console.log('biometricLogin - Success!');
            
            return {
              success: true,
              data: {
                user,
                token: access_token,
              },
            };
          }
          
          return {
            success: false,
            message: response.data.message || 'Biometric login failed',
          };
        } catch (apiError) {
          console.error('Backend biometric login failed:', apiError.response?.data || apiError);
          
          return {
            success: false,
            message: apiError.response?.data?.message || 'Biometric login failed',
          };
        }
      }

      return { success: false, message: 'Biometric authentication cancelled' };
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
      // First check user data from backend (most reliable)
      const userData = await SecureStorage.getUserData();
      
      console.log('isBiometricEnabled - User data:', userData);
      console.log('isBiometricEnabled - User biometric_enabled:', userData?.biometric_enabled);
      
      if (userData && typeof userData.biometric_enabled === 'boolean') {
        // Sync local storage with backend status
        await SecureStorage.setItem('biometric_enabled', userData.biometric_enabled ? 'true' : 'false');
        return userData.biometric_enabled;
      }
      
      // Fallback to local storage
      const localEnabled = await SecureStorage.getItem('biometric_enabled');
      console.log('isBiometricEnabled - Local storage:', localEnabled);
      
      return localEnabled === 'true' || localEnabled === true;
    } catch (error) {
      console.error('isBiometricEnabled error:', error);
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

  /**
   * Store password securely (for unlock screen verification)
   */
  async storePassword(password) {
    try {
      await EncryptedStorage.setItem('user_password', password);
      return { success: true };
    } catch (error) {
      console.error('Error storing password:', error);
      return { success: false, message: 'Failed to store password' };
    }
  },

  /**
   * Get stored password
   */
  async getStoredPassword() {
    try {
      const password = await EncryptedStorage.getItem('user_password');
      return password;
    } catch (error) {
      console.error('Error retrieving password:', error);
      return null;
    }
  },

  /**
   * Verify password for unlock screen
   */
  async verifyPassword(password) {
    try {
      // First, try to verify with stored password (offline verification)
      const storedPassword = await this.getStoredPassword();
      
      if (storedPassword && storedPassword === password) {
        return { success: true };
      }

      // If offline verification fails, try backend verification (online)
      try {
        const userData = await SecureStorage.getUserData();
        if (userData && userData.email) {
          const response = await api.post('/auth/verify-password', {
            email: userData.email,
            password: password,
          });
          
          if (response.data.success) {
            // Update stored password if backend verification succeeds
            await this.storePassword(password);
            return { success: true };
          }
        }
      } catch (apiError) {
        console.log('Backend verification unavailable, using offline mode');
      }

      return { 
        success: false, 
        message: 'Invalid password' 
      };
    } catch (error) {
      console.error('Password verification error:', error);
      return {
        success: false,
        message: 'Failed to verify password',
      };
    }
  },

  /**
   * Remove stored password
   */
  async removeStoredPassword() {
    try {
      await EncryptedStorage.removeItem('user_password');
      await EncryptedStorage.removeItem('biometric_public_key');
      await EncryptedStorage.removeItem('biometric_signature');
      return { success: true };
    } catch (error) {
      console.error('Error removing password:', error);
      return { success: false };
    }
  },

  /**
   * Disable biometric authentication
   * Requires transaction PIN for security
   */
  async disableBiometric(transactionPin) {
    try {
      // Get auth token
      const authToken = await SecureStorage.getAuthToken();
      
      if (!authToken) {
        return {
          success: false,
          message: 'Authentication required.',
        };
      }

      // Try to notify backend
      try {
        const response = await api.post('/profile/biometric/disable', {
          transaction_pin: transactionPin,
        }, {
          headers: {
            'Authorization': `Bearer ${authToken}`,
          }
        });

        if (!response.data.success) {
          return {
            success: false,
            message: response.data.message || 'Failed to disable biometric',
          };
        }
      } catch (apiError) {
        console.error('Backend disable failed:', apiError.response?.data || apiError);
        return {
          success: false,
          message: apiError.response?.data?.message || 'Failed to disable biometric on server',
        };
      }
      
      // Disable locally after backend confirms
      await SecureStorage.setItem('biometric_enabled', 'false');
      
      // Update user data
      const userData = await SecureStorage.getUserData();
      if (userData) {
        userData.biometric_enabled = false;
        await SecureStorage.setUserData(userData);
      }
      
      // Delete biometric keys
      const rnBiometrics = new ReactNativeBiometrics();
      await rnBiometrics.deleteKeys();
      
      // Remove stored keys
      await EncryptedStorage.removeItem('biometric_public_key');
      await EncryptedStorage.removeItem('biometric_signature');
      
      return { success: true };
    } catch (error) {
      console.error('Error disabling biometric:', error);
      return { 
        success: false,
        message: 'Failed to disable biometric authentication',
      };
    }
  },
};

export default AuthService;