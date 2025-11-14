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
        
        // if (user.biometric_enabled) {
        //   await SecureStorage.setItem('biometric_enabled', 'true');
          
        //   // If user had biometric keys before, keep them
        //   // If not, they need to set up biometric again
        //   if (!hadBiometricKeys) {
        //     console.log('Login - Biometric enabled on backend but no local keys');
        //   }
        // } else {
        //   await SecureStorage.setItem('biometric_enabled', 'false');
        //   // Clear biometric data if disabled on backend
        //   await EncryptedStorage.removeItem('biometric_public_key');
        //   await EncryptedStorage.removeItem('biometric_signature');
        // }

        // Around line 35
if (user.biometric_enabled) {
  await EncryptedStorage.setItem('biometric_enabled', 'true'); // ← Use EncryptedStorage
  
  if (!hadBiometricKeys) {
    console.log('Login - Biometric enabled on backend but no local keys');
  }
} else {
  await EncryptedStorage.setItem('biometric_enabled', 'false'); // ← Use EncryptedStorage
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
  // async logout() {
  //   try {
  //     await api.post('/auth/logout');
      
  //     // Clear stored data
  //     await SecureStorage.removeAuthToken();
  //     await SecureStorage.setUserData(null);
  //     await this.removeStoredPassword();
  //     await SecureStorage.setItem('biometric_enabled', 'false');
      
  //     return { success: true };
  //   } catch (error) {
  //     // Clear local data even if API fails
  //     await SecureStorage.removeAuthToken();
  //     await SecureStorage.setUserData(null);
  //     await this.removeStoredPassword();
  //     await SecureStorage.setItem('biometric_enabled', 'false');
      
  //     console.error('Logout error:', error);
  //     return {
  //       success: false,
  //       message: error.response?.data?.message || 'Logout failed',
  //     };
  //   }
  // },


  /**
 * Logout user
 */
async logout() {
  try {
    console.log('=== Logging Out ===');
    
    // Call logout API
    try {
      await api.post('/auth/logout');
      console.log('Backend logout successful');
    } catch (apiError) {
      console.log('Backend logout failed (non-critical):', apiError.message);
      // Continue with local logout even if API fails
    }
    
    // Clear auth data but preserve biometric
    await this.clearAuthData(true); // true = preserve biometric
    
    // Verify biometric was preserved
    const stillEnabled = await SecureStorage.getItem('biometric_enabled');
    const stillHasSignature = await EncryptedStorage.getItem('biometric_signature');
    
    console.log('After logout verification:');
    console.log('- biometric_enabled:', stillEnabled);
    console.log('- has signature:', !!stillHasSignature);
    
    console.log('Logout successful');
    
    return { success: true };
  } catch (error) {
    console.error('Logout error:', error);
    
    // Even if logout fails, try to clear local data
    await this.clearAuthData(true);
    
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
            // await EncryptedStorage.setItem('biometric_public_key', publicKey);
            // await EncryptedStorage.setItem('biometric_signature', signature || publicKey);
            
            // console.log('setupBiometric - Stored publicKey:', publicKey);
            // console.log('setupBiometric - Stored signature:', signature || publicKey);
             // Store these in EncryptedStorage for consistency
  await EncryptedStorage.setItem('biometric_public_key', publicKey);
  await EncryptedStorage.setItem('biometric_signature', signature || publicKey);
  await EncryptedStorage.setItem('biometric_enabled', 'true'); // ← CHANGED
  
  console.log('setupBiometric - Stored publicKey:', publicKey);
  console.log('setupBiometric - Stored signature:', signature || publicKey);
  console.log('setupBiometric - Stored biometric_enabled: true');

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
  // async biometricLogin() {
  //   try {
  //     const rnBiometrics = new ReactNativeBiometrics();
      
  //     // Check if biometric is enabled in settings
  //     const isEnabled = await this.isBiometricEnabled();
  //     console.log('biometricLogin - isEnabled:', isEnabled);
      
  //     if (!isEnabled) {
  //       return {
  //         success: false,
  //         message: 'Biometric login not enabled. Please enable it in settings.',
  //       };
  //     }

  //     // Check if keys exist
  //     const { keysExist } = await rnBiometrics.biometricKeysExist();
  //     console.log('biometricLogin - keysExist:', keysExist);
      
  //     if (!keysExist) {
  //       // Keys don't exist but backend says enabled - need to re-setup
  //       console.log('Keys missing - biometric needs to be re-enabled in settings');
  //       return { 
  //         success: false, 
  //         message: 'Biometric setup incomplete. Please re-enable in Security Settings.',
  //       };
  //     }

  //     // Get stored signature
  //     const storedSignature = await EncryptedStorage.getItem('biometric_signature');
  //     const publicKey = await EncryptedStorage.getItem('biometric_public_key');
      
  //     console.log('biometricLogin - Has signature:', !!storedSignature);
  //     console.log('biometricLogin - Has publicKey:', !!publicKey);

  //     if (!storedSignature && !publicKey) {
  //       return {
  //         success: false,
  //         message: 'Biometric setup incomplete. Please re-enable in Security Settings.',
  //       };
  //     }

  //     // Authenticate with biometrics
  //     const epoch = (new Date()).getTime();
  //     const payload = epoch.toString();
      
  //     const { success, signature } = await rnBiometrics.createSignature({
  //       promptMessage: 'Authenticate to login',
  //       payload: payload,
  //     });

  //     if (success) {
  //       // Use the stored signature for login
  //       const biometricToken = storedSignature || signature || publicKey;
        
  //       console.log('biometricLogin - Attempting login with token');
        
  //       // Try backend authentication WITHOUT Bearer token (public endpoint)
  //       try {
  //         const response = await api.post('/auth/login/biometric', {
  //           biometric_token: biometricToken,
  //         });
          
  //         if (response.data.success) {
  //           const { access_token, user } = response.data.data;
            
  //           // Store token and user data
  //           await SecureStorage.setAuthToken(access_token);
  //           await SecureStorage.setUserData(user);
            
  //           // Sync biometric status
  //           if (user.biometric_enabled) {
  //             await SecureStorage.setItem('biometric_enabled', 'true');
  //           }
            
  //           console.log('biometricLogin - Success!');
            
  //           return {
  //             success: true,
  //             data: {
  //               user,
  //               token: access_token,
  //             },
  //           };
  //         }
          
  //         return {
  //           success: false,
  //           message: response.data.message || 'Biometric login failed',
  //         };
  //       } catch (apiError) {
  //         console.error('Backend biometric login failed:', apiError.response?.data || apiError);
          
  //         return {
  //           success: false,
  //           message: apiError.response?.data?.message || 'Biometric login failed',
  //         };
  //       }
  //     }

  //     return { success: false, message: 'Biometric authentication cancelled' };
  //   } catch (error) {
  //     console.error('Biometric login error:', error);
  //     return {
  //       success: false,
  //       message: 'Failed to authenticate with biometrics',
  //     };
  //   }
  // },

/**
 * Biometric login using stored token
 * This REQUIRES an existing valid token for re-authentication
 */
// async biometricLogin() {
//   try {
//     const rnBiometrics = new ReactNativeBiometrics();
    
//     // Check if biometric is enabled
//     const isEnabled = await this.isBiometricEnabled();
//     console.log('biometricLogin - isEnabled:', isEnabled);
    
//     if (!isEnabled) {
//       return {
//         success: false,
//         message: 'Biometric login not enabled. Please enable it in settings.',
//       };
//     }

//     // Check if keys exist
//     const { keysExist } = await rnBiometrics.biometricKeysExist();
//     console.log('biometricLogin - keysExist:', keysExist);
    
//     if (!keysExist) {
//       return { 
//         success: false, 
//         message: 'Biometric setup incomplete. Please re-enable in Security Settings.',
//       };
//     }

//     // Get stored biometric token
//     const biometricToken = await EncryptedStorage.getItem('biometric_signature');
    
//     console.log('biometricLogin - Has token:', !!biometricToken);

//     if (!biometricToken) {
//       return {
//         success: false,
//         message: 'Biometric token not found. Please re-enable in Security Settings.',
//       };
//     }

//     // Get current auth token (REQUIRED by backend)
//     const authToken = await SecureStorage.getAuthToken();
    
//     if (!authToken) {
//       return {
//         success: false,
//         message: 'No active session. Please login with password first.',
//       };
//     }

//     // Authenticate with biometrics (show fingerprint UI)
//     const { success } = await rnBiometrics.simplePrompt({
//       promptMessage: 'Authenticate to login',
//       cancelButtonText: 'Cancel',
//     });

//     if (!success) {
//       return { 
//         success: false, 
//         message: 'Biometric authentication cancelled' 
//       };
//     }

//     console.log('biometricLogin - Biometric verified, calling API...');
    
//     // Call backend with biometric token
//     try {
//       const response = await api.post('/auth/login/biometric', {
//         biometric_token: biometricToken,
//       }, {
//         headers: {
//           'Authorization': `Bearer ${authToken}`,
//         }
//       });
      
//       if (response.data.success) {
//         const { access_token, user } = response.data.data;
        
//         // Store new token and user data
//         await SecureStorage.setAuthToken(access_token);
//         await SecureStorage.setUserData(user);
        
//         console.log('biometricLogin - Success!');
        
//         return {
//           success: true,
//           data: {
//             user,
//             token: access_token,
//           },
//         };
//       }
      
//       return {
//         success: false,
//         message: response.data.message || 'Biometric login failed',
//       };
//     } catch (apiError) {
//       console.error('Backend biometric login failed:', apiError.response?.data || apiError);
      
//       // If token expired, user needs to login with password again
//       if (apiError.response?.status === 401) {
//         return {
//           success: false,
//           message: 'Session expired. Please login with password.',
//         };
//       }
      
//       return {
//         success: false,
//         message: apiError.response?.data?.message || 'Biometric login failed',
//       };
//     }
//   } catch (error) {
//     console.error('Biometric login error:', error);
//     return {
//       success: false,
//       message: 'Failed to authenticate with biometrics',
//     };
//   }
// },


/**
 * Biometric login - Re-authenticate using stored biometric token
 * REQUIRES: Existing valid Bearer token
 * NOT FOR: Initial login (use password for that)
 */
// async biometricLogin() {
//   try {
//     const rnBiometrics = new ReactNativeBiometrics();
    
//     console.log('=== Biometric Login Attempt ===');
    
//     // Step 1: Check if biometric is enabled
//     const isEnabled = await SecureStorage.getItem('biometric_enabled');
//     console.log('1. Biometric enabled:', isEnabled === 'true');
    
//     if (isEnabled !== 'true') {
//       return {
//         success: false,
//         message: 'Biometric not enabled. Please enable in Security Settings.',
//       };
//     }

//     // Step 2: Check if we have biometric keys
//     const { keysExist } = await rnBiometrics.biometricKeysExist();
//     console.log('2. Biometric keys exist:', keysExist);
    
//     if (!keysExist) {
//       return { 
//         success: false, 
//         message: 'Biometric keys missing. Please re-enable in Security Settings.',
//       };
//     }

//     // Step 3: Get stored biometric token (from when user enabled biometric)
//     const biometricToken = await EncryptedStorage.getItem('biometric_signature');
//     console.log('3. Has biometric token:', !!biometricToken);

//     if (!biometricToken) {
//       return {
//         success: false,
//         message: 'Biometric token not found. Please re-enable in Security Settings.',
//       };
//     }

//     // Step 4: Get current auth token (REQUIRED by backend)
//     const authToken = await SecureStorage.getAuthToken();
//     console.log('4. Has auth token:', !!authToken);
    
//     if (!authToken) {
//       return {
//         success: false,
//         message: 'No active session. Please login with password first.',
//       };
//     }

//     // Step 5: Show biometric prompt (fingerprint/face ID)
//     console.log('5. Showing biometric prompt...');
//     const { success } = await rnBiometrics.simplePrompt({
//       promptMessage: 'Authenticate to login',
//       cancelButtonText: 'Cancel',
//     });

//     if (!success) {
//       console.log('6. Biometric authentication cancelled');
//       return { 
//         success: false, 
//         message: 'Authentication cancelled' 
//       };
//     }

//     console.log('6. Biometric verified! Calling backend...');
    
//     // Step 6: Call backend with biometric token + Bearer token
//     try {

//             console.log('6. calling backend with fingerprint:', biometricToken);

//       const response = await api.post('/auth/login/biometric', {
//         biometric_token: biometricToken,
//       }, {
//         headers: {
//           'Authorization': `Bearer ${authToken}`,
//         }
//       });
      
//       console.log('7. Backend response:', response.data.success);
      
//       if (response.data.success) {
//         const { access_token, user } = response.data.data;
        
//         // Store new token and user data
//         await SecureStorage.setAuthToken(access_token);
//         await SecureStorage.setUserData(user);
        
//         console.log('✅ Biometric login successful!');
        
//         return {
//           success: true,
//           data: {
//             user,
//             token: access_token,
//           },
//         };
//       }
      
//       return {
//         success: false,
//         message: response.data.message || 'Biometric login failed',
//       };
//     } catch (apiError) {
//       console.error('Backend biometric login error:', apiError.response?.data || apiError);
      
//       // Handle token expiration
//       if (apiError.response?.status === 401) {
//         // Clear the expired token
//         await SecureStorage.removeAuthToken();
        
//         return {
//           success: false,
//           message: 'Session expired. Please login with password.',
//         };
//       }
      
//       return {
//         success: false,
//         message: apiError.response?.data?.message || 'Biometric login failed',
//       };
//     }
//   } catch (error) {
//     console.error('Biometric login error:', error);
//     return {
//       success: false,
//       message: 'Failed to authenticate with biometrics',
//     };
//   }
// },
// async biometricLogin() {
//   try {
//     const rnBiometrics = new ReactNativeBiometrics();
    
//     console.log('=== Biometric Login Attempt ===');
    
//     // Step 1: Check if biometric is enabled
//     const isEnabled = await SecureStorage.getItem('biometric_enabled');
//     console.log('1. Biometric enabled:', isEnabled === 'true');
    
//     if (isEnabled !== 'true') {
//       return {
//         success: false,
//         message: 'Biometric not enabled. Please enable in Security Settings.',
//       };
//     }

//     // Step 2: Get stored biometric token FIRST (before checking auth token)
//     const biometricToken = await EncryptedStorage.getItem('biometric_signature');
//     console.log('2. Has biometric token:', !!biometricToken);

//     if (!biometricToken) {
//       return {
//         success: false,
//         message: 'Biometric token not found. Please re-enable in Security Settings.',
//       };
//     }

//     // Step 3: Check if we have biometric keys
//     const { keysExist } = await rnBiometrics.biometricKeysExist();
//     console.log('3. Biometric keys exist:', keysExist);
    
//     if (!keysExist) {
//       return { 
//         success: false, 
//         message: 'Biometric keys missing. Please re-enable in Security Settings.',
//       };
//     }

//     // Step 4: Get current auth token (REQUIRED by backend)
//     const authToken = await SecureStorage.getAuthToken();
//     console.log('4. Has auth token:', !!authToken);
    
//     if (!authToken) {
//       // Check if this is right after logout or first time
//       // User has biometric set up but needs to login with password first
//       return {
//         success: false,
//         message: 'Please login with password first, then you can use biometric.',
//       };
//     }

//     // Step 5: Show biometric prompt (fingerprint/face ID)
//     console.log('5. Showing biometric prompt...');
//     const { success } = await rnBiometrics.simplePrompt({
//       promptMessage: 'Authenticate to login',
//       cancelButtonText: 'Cancel',
//     });

//     if (!success) {
//       console.log('6. Biometric authentication cancelled');
//       return { 
//         success: false, 
//         message: 'Authentication cancelled' 
//       };
//     }

//     console.log('6. Biometric verified! Calling backend...');
//     console.log('   - Biometric token:', biometricToken.substring(0, 20) + '...');
//     console.log('   - Auth token:', authToken.substring(0, 20) + '...');
    
//     // Step 6: Call backend with biometric token + Bearer token
//     try {
//       const response = await api.post('/auth/login/biometric', {
//         biometric_token: biometricToken,
//       }, {
//         headers: {
//           'Authorization': `Bearer ${authToken}`,
//         }
//       });
      
//       console.log('7. Backend response:', response.data);
      
//       if (response.data.success) {
//         const { access_token, user } = response.data.data;
        
//         // Store new token and user data
//         await SecureStorage.setAuthToken(access_token);
//         await SecureStorage.setUserData(user);
        
//         console.log('✅ Biometric login successful!');
//         console.log('   - New token received');
//         console.log('   - User:', user.email || user.phone);
        
//         return {
//           success: true,
//           data: {
//             user,
//             token: access_token,
//           },
//         };
//       }
      
//       console.error('❌ Backend returned success: false');
//       return {
//         success: false,
//         message: response.data.message || 'Biometric login failed',
//       };
//     } catch (apiError) {
//       console.error('❌ Backend biometric login error:', apiError.response?.data || apiError.message);
      
//       // Handle token expiration
//       if (apiError.response?.status === 401) {
//         console.log('Token expired - clearing token');
//         // Clear the expired token
//         await SecureStorage.removeAuthToken();
        
//         return {
//           success: false,
//           message: 'Session expired. Please login with password.',
//         };
//       }
      
//       // Handle invalid biometric token
//       if (apiError.response?.status === 422) {
//         return {
//           success: false,
//           message: 'Invalid biometric token. Please re-enable biometric in Settings.',
//         };
//       }
      
//       return {
//         success: false,
//         message: apiError.response?.data?.message || 'Biometric login failed. Try password login.',
//       };
//     }
//   } catch (error) {
//     console.error('❌ Biometric login error:', error);
//     return {
//       success: false,
//       message: 'Failed to authenticate with biometrics',
//     };
//   }
// },  

/**
 * Biometric login - For LOGIN screen (no auth token required initially)
 * Flow:
 * 1. Check if biometric is enabled (from EncryptedStorage - no auth token needed)
 * 2. Check if biometric keys exist
 * 3. Get stored biometric token
 * 4. Show biometric prompt
 * 5. Call backend (may need valid token OR allow public login)
 */
async biometricLogin() {
  try {
    const rnBiometrics = new ReactNativeBiometrics();
    
    console.log('=== Biometric Login Attempt ===');
    
    // Step 1: Check if biometric is enabled (from EncryptedStorage - no auth token required)
    const isEnabled = await EncryptedStorage.getItem('biometric_enabled');
    console.log('1. Biometric enabled (from storage):', isEnabled === 'true');
    
    if (isEnabled !== 'true') {
      return {
        success: false,
        message: 'Biometric not enabled. Please enable in Security Settings.',
      };
    }

    // Step 2: Get stored biometric token FIRST (before checking keys)
    const biometricToken = await EncryptedStorage.getItem('biometric_signature');
    console.log('2. Has biometric token:', !!biometricToken);

    if (!biometricToken) {
      return {
        success: false,
        message: 'Biometric token not found. Please re-enable in Security Settings.',
      };
    }

    // Step 3: Check if we have biometric keys
    const { keysExist } = await rnBiometrics.biometricKeysExist();
    console.log('3. Biometric keys exist:', keysExist);
    
    if (!keysExist) {
      return { 
        success: false, 
        message: 'Biometric keys missing. Please re-enable in Security Settings.',
      };
    }

    // Step 4: Get current auth token (may or may not exist)
    const authToken = await SecureStorage.getAuthToken();
    console.log('4. Has auth token:', !!authToken);
    
    // For fresh login (no token), we should still try
    // Backend needs to support biometric login without Bearer token
    // OR we accept that user needs to login with password first after logout

    // Step 5: Show biometric prompt (fingerprint/face ID)
    console.log('5. Showing biometric prompt...');
    const { success } = await rnBiometrics.simplePrompt({
      promptMessage: 'Authenticate to login',
      cancelButtonText: 'Cancel',
    });

    if (!success) {
      console.log('6. Biometric authentication cancelled');
      return { 
        success: false, 
        message: 'Authentication cancelled' 
      };
    }

    console.log('6. Biometric verified! Calling backend...');
    console.log('   - Biometric token:', biometricToken.substring(0, 20) + '...');
    console.log('   - Auth token:', authToken ? authToken.substring(0, 20) + '...' : 'none');
    
    // Step 6: Call backend with biometric token
    try {
      const headers = {};
      if (authToken) {
        headers['Authorization'] = `Bearer ${authToken}`;
      }

      const response = await api.post('/auth/login/biometric', {
        biometric_token: biometricToken,
      }, {
        headers: headers,
      });
      
      console.log('7. Backend response:', response.data);
      
      if (response.data.success) {
        const { access_token, user } = response.data.data;
        
        // Store new token and user data
        await SecureStorage.setAuthToken(access_token);
        await SecureStorage.setUserData(user);
        
        console.log('✅ Biometric login successful!');
        console.log('   - New token received');
        console.log('   - User:', user.email || user.phone);
        
        return {
          success: true,
          data: {
            user,
            token: access_token,
          },
        };
      }
      
      console.error('❌ Backend returned success: false');
      return {
        success: false,
        message: response.data.message || 'Biometric login failed',
      };
    } catch (apiError) {
      console.error('❌ Backend biometric login error:', apiError.response?.data || apiError.message);
      
      // Handle different error cases
      if (apiError.response?.status === 401) {
        // If backend requires valid token but we don't have one
        return {
          success: false,
          message: 'Please login with password first, then you can use biometric.',
        };
      }
      
      // Handle invalid biometric token
      if (apiError.response?.status === 422) {
        return {
          success: false,
          message: 'Invalid biometric token. Please re-enable biometric in Settings.',
        };
      }
      
      return {
        success: false,
        message: apiError.response?.data?.message || 'Biometric login failed. Try password login.',
      };
    }
  } catch (error) {
    console.error('❌ Biometric login error:', error);
    return {
      success: false,
      message: 'Failed to authenticate with biometrics',
    };
  }
},


/**
   * Check if biometric is enabled
   */
/**
 * Check if biometric is enabled
 */
// async isBiometricEnabled() {
//   try {
//     // Check local storage directly (don't depend on user data)
//     const enabled = await EncryptedStorage.getItem('biometric_enabled');
//     const hasCredentials = await EncryptedStorage.getItem('biometric_credentials');
    
//     console.log('isBiometricEnabled - Storage check:', enabled, hasCredentials ? 'Has credentials' : 'No credentials');
    
//     return enabled === 'true' && hasCredentials !== null;
//   } catch (error) {
//     console.error('Error checking biometric enabled:', error);
//     return false;
//   }
// },

/**
 * Check if biometric is enabled
 * For your backend flow, check if we have the biometric token
 */
// async isBiometricEnabled() {
//   try {
//     const enabled = await SecureStorage.getItem('biometric_enabled');
//     const hasToken = await EncryptedStorage.getItem('biometric_signature');
//     const hasAuthToken = await SecureStorage.getAuthToken();
    
//     console.log('isBiometricEnabled:');
//     console.log('- Enabled flag:', enabled === 'true');
//     console.log('- Has biometric token:', !!hasToken);
//     console.log('- Has auth token:', !!hasAuthToken);
    
//     // All three must be present for biometric login
//     return enabled === 'true' && hasToken !== null && hasAuthToken !== null;
//   } catch (error) {
//     console.error('Error checking biometric:', error);
//     return false;
//   }
// },


/**
 * Check if biometric is enabled
 * For backend biometric, we need:
 * 1. Biometric enabled flag
 * 2. Biometric token stored
 * 3. Valid auth token (for re-authentication)
 */
// async isBiometricEnabled() {
//   try {
//     const enabled = await SecureStorage.getItem('biometric_enabled');
//     const hasToken = await EncryptedStorage.getItem('biometric_signature');
//     const hasAuthToken = await SecureStorage.getAuthToken();
    
//     const result = enabled === 'true' && hasToken !== null && hasAuthToken !== null;
    
//     console.log('isBiometricEnabled:');
//     console.log('- Enabled flag:', enabled === 'true');
//     console.log('- Has biometric token:', !!hasToken);
//     console.log('- Has auth token:', !!hasAuthToken);
//     console.log('- Result:', result);
    
//     return result;
//   } catch (error) {
//     console.error('Error checking biometric:', error);
//     return false;
//   }
// },
  
/**
 * Check if biometric is enabled
 * For backend biometric flow:
 * - Must have biometric_enabled flag
 * - Must have biometric_signature (from setup)
 * - For LOGIN: Must have valid auth_token (for re-auth)
 * - For CHECKING if user has it enabled: Don't require auth_token
 */
// async isBiometricEnabled(requireAuthToken = true) {
//   try {
//     const enabled = await SecureStorage.getItem('biometric_enabled');
//     const hasSignature = await EncryptedStorage.getItem('biometric_signature');
//     const hasAuthToken = await SecureStorage.getAuthToken();
    
//     console.log('isBiometricEnabled:');
//     console.log('- Enabled flag:', enabled === 'true');
//     console.log('- Has biometric signature:', !!hasSignature);
//     console.log('- Has auth token:', !!hasAuthToken);
//     console.log('- Require auth token:', requireAuthToken);
    
//     // For login - needs all three
//     if (requireAuthToken) {
//       const result = enabled === 'true' && hasSignature !== null && hasAuthToken !== null;
//       console.log('- Result (with auth check):', result);
//       return result;
//     }
    
//     // For UI display (Settings toggle) - just check if enabled and has signature
//     const result = enabled === 'true' && hasSignature !== null;
//     console.log('- Result (without auth check):', result);
//     return result;
//   } catch (error) {
//     console.error('Error checking biometric:', error);
//     return false;
//   }
// },

/**
 * Check if biometric is enabled
 * For backend biometric flow:
 * - Must have biometric_enabled flag
 * - Must have biometric_signature (from setup)
 * - For LOGIN: Must have valid auth_token (for re-auth)
 * - For CHECKING if user has it enabled: Don't require auth_token
 */
async isBiometricEnabled(requireAuthToken = true) {
  try {
    // Check EncryptedStorage for biometric_enabled flag
    const enabled = await EncryptedStorage.getItem('biometric_enabled');
    const hasSignature = await EncryptedStorage.getItem('biometric_signature');
    const hasAuthToken = await SecureStorage.getAuthToken();
    
    console.log('isBiometricEnabled:');
    console.log('- Enabled flag:', enabled === 'true');
    console.log('- Has biometric signature:', !!hasSignature);
    console.log('- Has auth token:', !!hasAuthToken);
    console.log('- Require auth token:', requireAuthToken);
    
    // For login - needs all three
    if (requireAuthToken) {
      const result = enabled === 'true' && hasSignature !== null && hasAuthToken !== null;
      console.log('- Result (with auth check):', result);
      return result;
    }
    
    // For UI display (Settings toggle) - just check if enabled and has signature
    const result = enabled === 'true' && hasSignature !== null;
    console.log('- Result (without auth check):', result);
    return result;
  } catch (error) {
    console.error('Error checking biometric:', error);
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
  // async disableBiometric(transactionPin) {
  //   try {
  //     // Get auth token
  //     const authToken = await SecureStorage.getAuthToken();
      
  //     if (!authToken) {
  //       return {
  //         success: false,
  //         message: 'Authentication required.',
  //       };
  //     }

  //     // Try to notify backend
  //     try {
  //       const response = await api.post('/profile/biometric/disable', {
  //         transaction_pin: transactionPin,
  //       }, {
  //         headers: {
  //           'Authorization': `Bearer ${authToken}`,
  //         }
  //       });

  //       if (!response.data.success) {
  //         return {
  //           success: false,
  //           message: response.data.message || 'Failed to disable biometric',
  //         };
  //       }
  //     } catch (apiError) {
  //       console.error('Backend disable failed:', apiError.response?.data || apiError);
  //       return {
  //         success: false,
  //         message: apiError.response?.data?.message || 'Failed to disable biometric on server',
  //       };
  //     }
      
  //     // Disable locally after backend confirms
  //     await SecureStorage.setItem('biometric_enabled', 'false');
      
  //     // Update user data
  //     const userData = await SecureStorage.getUserData();
  //     if (userData) {
  //       userData.biometric_enabled = false;
  //       await SecureStorage.setUserData(userData);
  //     }
      
  //     // Delete biometric keys
  //     const rnBiometrics = new ReactNativeBiometrics();
  //     await rnBiometrics.deleteKeys();
      
  //     // Remove stored keys
  //     await EncryptedStorage.removeItem('biometric_public_key');
  //     await EncryptedStorage.removeItem('biometric_signature');
      
  //     return { success: true };
  //   } catch (error) {
  //     console.error('Error disabling biometric:', error);
  //     return { 
  //       success: false,
  //       message: 'Failed to disable biometric authentication',
  //     };
  //   }
  // },

  async disableBiometric(transactionPin) {
  try {
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
    // Use EncryptedStorage for consistency
    await EncryptedStorage.setItem('biometric_enabled', 'false');
    
    // Update user data
    const userData = await SecureStorage.getUserData();
    if (userData) {
      userData.biometric_enabled = false;
      await SecureStorage.setUserData(userData);
    }
    
    // Delete biometric keys
    const rnBiometrics = new ReactNativeBiometrics();
    await rnBiometrics.deleteKeys();
    
    // Remove stored keys from EncryptedStorage
    await EncryptedStorage.removeItem('biometric_public_key');
    await EncryptedStorage.removeItem('biometric_signature');
    
    console.log('disableBiometric - Removed all biometric data from EncryptedStorage');
    
    return { success: true };
  } catch (error) {
    console.error('Error disabling biometric:', error);
    return { 
      success: false,
      message: 'Failed to disable biometric authentication',
    };
  }
},
   /**
   * Store credentials for biometric login
   */
  async storeBiometricCredentials(email, password) {
    try {
      const credentials = JSON.stringify({ email, password });
      await EncryptedStorage.setItem('biometric_credentials', credentials);
      await EncryptedStorage.setItem('biometric_enabled', 'true');
      return true;
    } catch (error) {
      console.error('Error storing biometric credentials:', error);
      return false;
    }
  },
    /**
   * Get stored credentials for biometric login
   */
  async getBiometricCredentials() {
    try {
      const credentials = await EncryptedStorage.getItem('biometric_credentials');
      return credentials ? JSON.parse(credentials) : null;
    } catch (error) {
      console.error('Error getting biometric credentials:', error);
      return null;
    }
  },
  /**
   * Enable biometric authentication
   */
  async enableBiometric(email, password) {
    try {

          const rnBiometrics = new ReactNativeBiometrics(); // ← ADD THIS LINE!

      // Check if biometric is available
      const { available } = await rnBiometrics.isSensorAvailable();
      
      if (!available) {
        return { success: false, error: 'Biometric not available' };
      }

      // Prompt for biometric to confirm setup
      const { success } = await rnBiometrics.simplePrompt({
        promptMessage: 'Verify your identity to enable biometric login',
        cancelButtonText: 'Cancel',
      });

      if (!success) {
        return { success: false, error: 'Biometric verification failed' };
      }

      // Store credentials
      await this.storeBiometricCredentials(email, password);
      
      return { success: true };
    } catch (error) {
      console.error('Error enabling biometric:', error);
      return { success: false, error: error.message };
    }
  },

  /**
 * Clear auth data (selective removal - NOT EncryptedStorage.clear())
 */
// async clearAuthData(preserveBiometric = true) {
//   try {
//     console.log('=== Clearing Auth Data ===');
//     console.log('Preserve Biometric:', preserveBiometric);
    
//     // Keys to remove (NOT including biometric keys)
//     const keysToRemove = [
//       'auth_token',
//       'refresh_token',
//       'user_data',
//       'session_data',
//     ];
    
//     // Remove only auth keys
//     for (const key of keysToRemove) {
//       await EncryptedStorage.removeItem(key);
//     }
    
//     // Only remove biometric if explicitly requested
//     if (!preserveBiometric) {
//       await EncryptedStorage.removeItem('biometric_credentials');
//       await EncryptedStorage.removeItem('biometric_enabled');
//     } else {
//       // Verify biometric data is still there
//       const hasCredentials = await EncryptedStorage.getItem('biometric_credentials');
//       console.log('Biometric preserved:', hasCredentials ? 'Yes' : 'No');
//     }
    
//     return true;
//   } catch (error) {
//     console.error('Error clearing auth data:', error);
//     return false;
//   }
// }
/**
 * Clear auth data on logout
 * @param {boolean} preserveBiometric - Whether to keep biometric settings
 */
// async clearAuthData(preserveBiometric = true) {
//   try {
//     console.log('=== Clearing Auth Data ===');
//     console.log('Preserve Biometric:', preserveBiometric);
    
//     if (preserveBiometric) {
//       // Get biometric data BEFORE clearing
//       const biometricEnabled = await SecureStorage.getItem('biometric_enabled');
//       const biometricSignature = await EncryptedStorage.getItem('biometric_signature');
//       const biometricPublicKey = await EncryptedStorage.getItem('biometric_public_key');
      
//       console.log('Before clear - biometric_enabled:', biometricEnabled);
//       console.log('Before clear - has signature:', !!biometricSignature);
//       console.log('Before clear - has public key:', !!biometricPublicKey);
      
//       // Keys to remove (NOT including biometric keys)
//       const keysToRemove = [
//         'auth_token',
//         'refresh_token',
//         'user_data',
//         'session_data',
//         'user_password', // Clear password but keep biometric
//       ];
      
//       // Remove only auth keys
//       for (const key of keysToRemove) {
//         await SecureStorage.removeItem(key);
//       }
      
//       // Restore biometric data if it existed
//       if (biometricEnabled === 'true' && (biometricSignature || biometricPublicKey)) {
//         // Re-set biometric data
//         await SecureStorage.setItem('biometric_enabled', 'true');
        
//         if (biometricSignature) {
//           await EncryptedStorage.setItem('biometric_signature', biometricSignature);
//         }
        
//         if (biometricPublicKey) {
//           await EncryptedStorage.setItem('biometric_public_key', biometricPublicKey);
//         }
        
//         console.log('✅ Biometric preserved:');
//         console.log('   - biometric_enabled: true');
//         console.log('   - has signature:', !!biometricSignature);
//         console.log('   - has public key:', !!biometricPublicKey);
//       } else {
//         console.log('⚠️ No biometric data to preserve');
//       }
//     } else {
//       // Clear everything including biometric
//       const keysToRemove = [
//         'auth_token',
//         'refresh_token',
//         'user_data',
//         'session_data',
//         'user_password',
//         'biometric_enabled',
//       ];
      
//       for (const key of keysToRemove) {
//         await SecureStorage.removeItem(key);
//       }
      
//       await EncryptedStorage.removeItem('biometric_signature');
//       await EncryptedStorage.removeItem('biometric_public_key');
      
//       console.log('🧹 All data cleared including biometric');
//     }
    
//     return true;
//   } catch (error) {
//     console.error('Error clearing auth data:', error);
//     return false;
//   }
// }

// async clearAuthData(preserveBiometric = true) {
//   try {
//     console.log('=== Clearing Auth Data ===');
//     console.log('Preserve Biometric:', preserveBiometric);
    
//     if (preserveBiometric) {
//       // Step 1: Get biometric data BEFORE clearing
//       const biometricEnabled = await SecureStorage.getItem('biometric_enabled');
//       const biometricSignature = await EncryptedStorage.getItem('biometric_signature');
//       const biometricPublicKey = await EncryptedStorage.getItem('biometric_public_key');
      
//       console.log('📥 Before clear:');
//       console.log('   - biometric_enabled:', biometricEnabled);
//       console.log('   - has signature:', !!biometricSignature);
//       console.log('   - has public key:', !!biometricPublicKey);
      
//       // Step 2: Remove only auth keys
//       const keysToRemove = [
//         'auth_token',
//         'refresh_token',
//         'user_data',
//         'session_data',
//         'user_password',
//       ];
      
//       for (const key of keysToRemove) {
//         await SecureStorage.removeItem(key);
//       }
      
//       console.log('🗑️  Removed auth keys');
      
//       // Step 3: Restore biometric data if it existed
//       if (biometricEnabled === 'true' && (biometricSignature || biometricPublicKey)) {
//         await SecureStorage.setItem('biometric_enabled', 'true');
        
//         if (biometricSignature) {
//           await EncryptedStorage.setItem('biometric_signature', biometricSignature);
//         }
        
//         if (biometricPublicKey) {
//           await EncryptedStorage.setItem('biometric_public_key', biometricPublicKey);
//         }
        
//         console.log('✅ Biometric data restored:');
//         console.log('   - biometric_enabled: true');
//         console.log('   - signature restored:', !!biometricSignature);
//         console.log('   - public key restored:', !!biometricPublicKey);
        
//         // Verify restoration
//         const verifyEnabled = await SecureStorage.getItem('biometric_enabled');
//         const verifySignature = await EncryptedStorage.getItem('biometric_signature');
        
//         console.log('🔍 Verification:');
//         console.log('   - biometric_enabled:', verifyEnabled);
//         console.log('   - has signature:', !!verifySignature);
//       } else {
//         console.log('⚠️  No biometric data to preserve');
//       }
//     } else {
//       // Clear everything including biometric
//       const keysToRemove = [
//         'auth_token',
//         'refresh_token',
//         'user_data',
//         'session_data',
//         'user_password',
//         'biometric_enabled',
//       ];
      
//       for (const key of keysToRemove) {
//         await SecureStorage.removeItem(key);
//       }
      
//       await EncryptedStorage.removeItem('biometric_signature');
//       await EncryptedStorage.removeItem('biometric_public_key');
      
//       console.log('🧹 All data cleared including biometric');
//     }
    
//     return true;
//   } catch (error) {
//     console.error('❌ Error clearing auth data:', error);
//     return false;
//   }
// }
async clearAuthData(preserveBiometric = true) {
  try {
    console.log('=== Clearing Auth Data ===');
    console.log('Preserve Biometric:', preserveBiometric);
    
    if (preserveBiometric) {
      // Get biometric data BEFORE clearing (from EncryptedStorage)
      const biometricEnabled = await EncryptedStorage.getItem('biometric_enabled');
      const biometricSignature = await EncryptedStorage.getItem('biometric_signature');
      const biometricPublicKey = await EncryptedStorage.getItem('biometric_public_key');
      
      console.log('📥 Before clear (all from EncryptedStorage):');
      console.log('   - biometric_enabled:', biometricEnabled);
      console.log('   - has signature:', !!biometricSignature);
      console.log('   - has public key:', !!biometricPublicKey);
      
      // Remove only auth keys from SecureStorage
      const keysToRemove = [
        'auth_token',
        'refresh_token',
        'user_data',
        'session_data',
        'user_password',
      ];
      
      for (const key of keysToRemove) {
        await SecureStorage.removeItem(key);
      }
      
      console.log('🗑️  Removed auth keys from SecureStorage');
      
      // Restore biometric data in EncryptedStorage if it existed
      if (biometricEnabled === 'true' && (biometricSignature || biometricPublicKey)) {
        // All biometric data stays in EncryptedStorage
        await EncryptedStorage.setItem('biometric_enabled', 'true');
        
        if (biometricSignature) {
          await EncryptedStorage.setItem('biometric_signature', biometricSignature);
        }
        
        if (biometricPublicKey) {
          await EncryptedStorage.setItem('biometric_public_key', biometricPublicKey);
        }
        
        console.log('✅ Biometric data preserved in EncryptedStorage:');
        console.log('   - biometric_enabled: true');
        console.log('   - signature preserved:', !!biometricSignature);
        console.log('   - public key preserved:', !!biometricPublicKey);
        
        // Verify restoration
        const verifyEnabled = await EncryptedStorage.getItem('biometric_enabled');
        const verifySignature = await EncryptedStorage.getItem('biometric_signature');
        
        console.log('🔍 Verification (from EncryptedStorage):');
        console.log('   - biometric_enabled:', verifyEnabled);
        console.log('   - has signature:', !!verifySignature);
      } else {
        console.log('⚠️  No biometric data to preserve');
      }
    } else {
      // Clear everything including biometric
      const keysToRemove = [
        'auth_token',
        'refresh_token',
        'user_data',
        'session_data',
        'user_password',
      ];
      
      for (const key of keysToRemove) {
        await SecureStorage.removeItem(key);
      }
      
      await EncryptedStorage.removeItem('biometric_enabled');
      await EncryptedStorage.removeItem('biometric_signature');
      await EncryptedStorage.removeItem('biometric_public_key');
      
      console.log('🧹 All data cleared including biometric');
    }
    
    return true;
  } catch (error) {
    console.error('❌ Error clearing auth data:', error);
    return false;
  }
},
/**
 * Setup transaction PIN for the first time
 * @param {string} pin - 4-digit PIN
 * @param {string} pinConfirmation - Confirmation PIN
 * @returns {Promise<Object>} - Response with success status
 */
async setupPin(pin, pinConfirmation) {
  try {
    console.log('🔐 Setting up transaction PIN...');

    const response = await api.post('/account/set-pin', {
      pin,
      pin_confirmation: pinConfirmation,
    });

    if (response.data?.success) {
      console.log('✅ PIN setup successful');
      return {
        success: true,
        message: response.data.message || 'PIN setup successful',
      };
    }

    return {
      success: false,
      message: response.data?.message || 'Failed to setup PIN',
    };
  } catch (error) {
    console.error('❌ Setup PIN error:', error.response?.data || error.message);
    
    return {
      success: false,
      message: error.response?.data?.message || 'An error occurred while setting up PIN',
    };
  }
},

/**
 * Check if user has set up their transaction PIN
 * @returns {Promise<boolean>}
 */
async hasPinSetup() {
  try {
    // You might need to add an API endpoint to check this
    // For now, we can try to get user profile and check if pin is set
    const response = await api.get('/user/profile');
    
    // Assuming API returns has_pin or similar field
    return response.data?.data?.has_pin || false;
  } catch (error) {
    console.error('Error checking PIN setup:', error);
    return false;
  }
}
};

export default AuthService;