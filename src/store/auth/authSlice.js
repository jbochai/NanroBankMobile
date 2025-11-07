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

export const checkAuthStatus = createAsyncThunk(
  'auth/checkStatus',
  async (_, { rejectWithValue }) => {
    try {
      const isAuth = await AuthService.isAuthenticated();
      if (isAuth) {
        const userData = await EncryptedStorage.getItem('user_data');
        const biometricEnabled = await AuthService.isBiometricEnabled();
        return {
          user: userData ? JSON.parse(userData) : null,
          biometricEnabled,
        };
      }
      return null;
    } catch (error) {
      return rejectWithValue(error.message);
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
        state.lockoutEndTime = Date.now() + 2 * 60 * 1000; // 2 minutes lockout // 30 * 60 * 1000 = 30mins
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
        state.error = null;
      })
      .addCase(logout.rejected, (state) => {
        // Even if logout fails, clear local state
        state.isLoading = false;
        state.user = null;
        state.isAuthenticated = false;
        state.biometricEnabled = false;
        state.sessionTimeout = null;
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
  },
});

// Export actions
export const {
  clearError,
  resetLoginAttempts,
  incrementLoginAttempts,
  updateSessionTimeout,
  sessionExpired,
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