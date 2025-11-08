import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import AuthService from '../../api/auth';
import EncryptedStorage from 'react-native-encrypted-storage';

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
        return rejectWithValue(response);
      }
    } catch (error) {
      return rejectWithValue(error.message);
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
  async (_, { rejectWithValue }) => {
    try {
      const response = await AuthService.logout();
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

// export const checkAuthStatus = createAsyncThunk(
//   'auth/checkStatus',
//   async (_, { rejectWithValue }) => {
//     try {
//       const isAuth = await AuthService.isAuthenticated();
//       if (isAuth) {
//         const userData = await EncryptedStorage.getItem('user_data');
//         const biometricEnabled = await AuthService.isBiometricEnabled();
//         return {
//           user: userData ? JSON.parse(userData) : null,
//           biometricEnabled,
//         };
//       }
//       return null;
//     } catch (error) {
//       return rejectWithValue(error.message);
//     }
//   }
// );
export const checkAuthStatus = createAsyncThunk(
  'auth/checkStatus',
  async (_, { rejectWithValue }) => {
    try {
      const isAuth = await AuthService.isAuthenticated();
      if (isAuth) {
        const userData = await EncryptedStorage.getItem('user_data');
        const user = userData ? JSON.parse(userData) : null;
        
        // Sync biometric enabled from user data
        const biometricEnabled = user?.biometric_enabled || false;
        
        // Also check local storage
        const localBiometricEnabled = await AuthService.isBiometricEnabled();
        
        console.log('CheckAuthStatus - User biometric_enabled:', user?.biometric_enabled);
        console.log('CheckAuthStatus - Local biometric enabled:', localBiometricEnabled);
        
        return {
          user: user,
          biometricEnabled: biometricEnabled || localBiometricEnabled,
        };
      }
      return null;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);
// New: Unlock screen after idle timeout
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
      
      // Optionally verify with backend
      // const response = await AuthService.verifyPassword({
      //   email: user.email,
      //   password: password,
      // });
      // if (response.success) {
      //   return { success: true };
      // }
      
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
        state.isLoading = false;
        state.user = null;
        state.isAuthenticated = false;
        state.biometricEnabled = false;
        state.sessionTimeout = null;
        state.isLocked = false;
        state.error = null;
      })
      .addCase(logout.rejected, (state) => {
        // Even if logout fails, clear local state
        state.isLoading = false;
        state.user = null;
        state.isAuthenticated = false;
        state.biometricEnabled = false;
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
      })
      .addCase(getMe.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload?.message || 'Failed to fetch user data';
      });

    // Setup Biometric
    builder
      .addCase(setupBiometric.fulfilled, (state) => {
        state.biometricEnabled = true;
      })
      .addCase(setupBiometric.rejected, (state) => {
        state.biometricEnabled = false;
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
          state.isAuthenticated = true;
          state.biometricEnabled = action.payload.biometricEnabled;
        }
      })
      .addCase(checkAuthStatus.rejected, (state) => {
        state.isLoading = false;
        state.isAuthenticated = false;
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