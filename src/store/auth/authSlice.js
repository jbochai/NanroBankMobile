import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import AuthService from '../../api/auth';
import EncryptedStorage from 'react-native-encrypted-storage';
import ReactNativeBiometrics from 'react-native-biometrics';

// Initial state
const initialState = {
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
  biometricEnabled: false,
  sessionTimeout: null,
  loginAttempts: 0,
  maxLoginAttempts: 3,
  isAccountLocked: false,
  lockoutEndTime: null,
  isLocked: false, // Added for idle timeout screen lock
};

// Async thunks
export const login = createAsyncThunk(
  'auth/login',
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await AuthService.login(credentials);
      if (response.success) {
        return response.data;
      } else {
        return rejectWithValue(response);
      }
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const biometricLogin = createAsyncThunk(
  'auth/biometricLogin',
  async (_, { rejectWithValue }) => {
    try {
      const response = await AuthService.biometricLogin();
      
      if (response.success) {
        return response.data;
      } else {
        return rejectWithValue(response.message);
      }
    } catch (error) {
      console.error('Biometric login thunk error:', error);
      return rejectWithValue(error.message || 'Biometric authentication failed');
    }
  }
);

export const register = createAsyncThunk(
  'auth/register',
  async (userData, { rejectWithValue }) => {
    try {
      const response = await AuthService.register(userData);
      if (response.success) {
        return response.data;
      } else {
        return rejectWithValue(response);
      }
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const logout = createAsyncThunk(
  'auth/logout',
  async (_, { dispatch }) => {
    try {
      console.log('=== Logout Thunk ===');
      
      // Call logout API
      await AuthService.logout();
      
      // Clear auth data but preserve biometric settings
      await AuthService.clearAuthData(true); // true = preserve biometric
      
      console.log('Logout thunk completed');
      
      return true;
    } catch (error) {
      console.error('Logout thunk error:', error);
      // Even if API call fails, clear local data
      await AuthService.clearAuthData(true);
      return true;
    }
  }
);

export const getMe = createAsyncThunk(
  'auth/getMe',
  async (_, { rejectWithValue }) => {
    try {
      const response = await AuthService.getMe();
      if (response.success) {
        return response.data;
      } else {
        return rejectWithValue(response);
      }
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const setupBiometric = createAsyncThunk(
  'auth/setupBiometric',
  async (_, { rejectWithValue }) => {
    try {
      const response = await AuthService.setupBiometric();
      if (response.success) {
        return response.data;
      } else {
        return rejectWithValue(response);
      }
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const checkAuthStatus = createAsyncThunk(
  'auth/checkStatus',
  async (_, { rejectWithValue }) => {
    try {
      const isAuth = await AuthService.isAuthenticated();
      
      // Always check biometric status regardless of auth state
      const biometricEnabled = await AuthService.isBiometricEnabled(false);
      
      if (isAuth) {
        const userData = await EncryptedStorage.getItem('user_data');
        const user = userData ? JSON.parse(userData) : null;
        
        console.log('CheckAuthStatus - Authenticated:');
        console.log('  - User biometric_enabled:', user?.biometric_enabled);
        console.log('  - Storage biometric enabled:', biometricEnabled);
        
        return {
          user: user,
          biometricEnabled: biometricEnabled,
        };
      } else {
        // User not authenticated, but preserve biometric setting
        console.log('CheckAuthStatus - Not authenticated:');
        console.log('  - Biometric enabled:', biometricEnabled);
        
        return {
          user: null,
          biometricEnabled: biometricEnabled,
        };
      }
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Unlock screen after idle timeout
export const unlockScreen = createAsyncThunk(
  'auth/unlockScreen',
  async (password, { rejectWithValue, getState }) => {
    try {
      const { user } = getState().auth;
      
      // If biometric unlock
      if (password?.biometric) {
        return { success: true };
      }
      
      // Verify password with stored credentials or backend
      const storedPassword = await EncryptedStorage.getItem('user_password');
      
      if (storedPassword === password) {
        return { success: true };
      }
      
      return rejectWithValue('Invalid password');
    } catch (error) {
      return rejectWithValue(error.message || 'Invalid password');
    }
  }
);

// Auth slice
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    resetLoginAttempts: (state) => {
      state.loginAttempts = 0;
      state.isAccountLocked = false;
      state.lockoutEndTime = null;
    },
    incrementLoginAttempts: (state) => {
      state.loginAttempts += 1;
      if (state.loginAttempts >= state.maxLoginAttempts) {
        state.isAccountLocked = true;
        state.lockoutEndTime = Date.now() + 2 * 60 * 1000; // 2 minutes lockout
      }
    },
    updateSessionTimeout: (state, action) => {
      state.sessionTimeout = action.payload;
    },
    sessionExpired: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.sessionTimeout = null;
      // Keep biometricEnabled
    },
    lockScreen: (state) => {
      state.isLocked = true;
    },
    unlockScreenSuccess: (state) => {
      state.isLocked = false;
      state.error = null;
    },
    setBiometricEnabled: (state, action) => {
      state.biometricEnabled = action.payload;
      console.log('Redux - setBiometricEnabled:', action.payload);
    },
  },
  extraReducers: (builder) => {
    // Login
    builder
      .addCase(login.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user;
        state.isAuthenticated = true;
        state.isLocked = false;
        state.loginAttempts = 0;
        state.isAccountLocked = false;
        state.lockoutEndTime = null;
        state.sessionTimeout = Date.now() + 5 * 60 * 1000; // 5 minutes
        
        // Update biometricEnabled from user data if available
        if (action.payload.user?.biometric_enabled !== undefined) {
          state.biometricEnabled = action.payload.user.biometric_enabled;
        }
      })
      .addCase(login.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload?.message || 'Login failed';
        state.loginAttempts += 1;
        if (state.loginAttempts >= state.maxLoginAttempts) {
          state.isAccountLocked = true;
          state.lockoutEndTime = Date.now() + 2 * 60 * 1000;
        }
      });

    // Biometric Login
    builder
      .addCase(biometricLogin.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(biometricLogin.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user;
        state.isAuthenticated = true;
        state.isLocked = false;
        state.sessionTimeout = Date.now() + 5 * 60 * 1000;
        
        // Biometric is obviously enabled if login succeeded
        state.biometricEnabled = true;
      })
      .addCase(biometricLogin.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload?.message || 'Biometric login failed';
      });

    // Register
    builder
      .addCase(register.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user;
        state.isAuthenticated = true;
        state.isLocked = false;
        state.sessionTimeout = Date.now() + 5 * 60 * 1000;
      })
      .addCase(register.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload?.message || 'Registration failed';
      });

    // Logout
    builder
      .addCase(logout.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(logout.fulfilled, (state) => {
        console.log('Redux - logout.fulfilled - preserving biometricEnabled:', state.biometricEnabled);
        
        state.isLoading = false;
        state.user = null;
        state.isAuthenticated = false;
        // DON'T clear biometricEnabled - it's preserved in storage!
        // state.biometricEnabled stays as is
        state.sessionTimeout = null;
        state.isLocked = false;
        state.error = null;
        
        console.log('Redux - After logout - biometricEnabled:', state.biometricEnabled);
      })
      .addCase(logout.rejected, (state) => {
        console.log('Redux - logout.rejected - preserving biometricEnabled:', state.biometricEnabled);
        
        // Even if logout fails, clear local state
        state.isLoading = false;
        state.user = null;
        state.isAuthenticated = false;
        // DON'T clear biometricEnabled
        // state.biometricEnabled stays as is
        state.sessionTimeout = null;
        state.isLocked = false;
      });

    // Get Me
    builder
      .addCase(getMe.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getMe.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
        
        // Sync biometric status from user data
        if (action.payload?.biometric_enabled !== undefined) {
          state.biometricEnabled = action.payload.biometric_enabled;
        }
      })
      .addCase(getMe.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload?.message || 'Failed to fetch user data';
      });

    // Setup Biometric
    builder
      .addCase(setupBiometric.fulfilled, (state) => {
        state.biometricEnabled = true;
        console.log('Redux - setupBiometric.fulfilled - biometricEnabled: true');
      })
      .addCase(setupBiometric.rejected, (state) => {
        // Don't change state on rejection
        console.log('Redux - setupBiometric.rejected');
      });

    // Check Auth Status
    builder
      .addCase(checkAuthStatus.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(checkAuthStatus.fulfilled, (state, action) => {
        state.isLoading = false;
        if (action.payload) {
          state.user = action.payload.user;
          state.isAuthenticated = !!action.payload.user;
          // ALWAYS update biometricEnabled from storage (even if no user)
          state.biometricEnabled = action.payload.biometricEnabled;
          
          console.log('Redux - checkAuthStatus.fulfilled:');
          console.log('  - isAuthenticated:', state.isAuthenticated);
          console.log('  - biometricEnabled:', state.biometricEnabled);
        }
      })
      .addCase(checkAuthStatus.rejected, (state) => {
        state.isLoading = false;
        state.isAuthenticated = false;
        // DON'T clear biometricEnabled here
        console.log('Redux - checkAuthStatus.rejected - biometricEnabled preserved');
      });

    // Unlock Screen
    builder
      .addCase(unlockScreen.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(unlockScreen.fulfilled, (state) => {
        state.isLoading = false;
        state.isLocked = false;
        state.error = null;
      })
      .addCase(unlockScreen.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

// Export actions
export const {
  clearError,
  resetLoginAttempts,
  incrementLoginAttempts,
  updateSessionTimeout,
  sessionExpired,
  lockScreen,
  unlockScreenSuccess,
  setBiometricEnabled,
} = authSlice.actions;

// Export reducer
export default authSlice.reducer;

// Selectors
export const selectAuth = (state) => state.auth;
export const selectUser = (state) => state.auth.user;
export const selectIsAuthenticated = (state) => state.auth.isAuthenticated;
export const selectIsLoading = (state) => state.auth.isLoading;
export const selectError = (state) => state.auth.error;
export const selectBiometricEnabled = (state) => state.auth.biometricEnabled;
export const selectIsAccountLocked = (state) => state.auth.isAccountLocked;
export const selectLockoutEndTime = (state) => state.auth.lockoutEndTime;
export const selectIsLocked = (state) => state.auth.isLocked;