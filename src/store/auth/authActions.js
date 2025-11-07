import { createAsyncThunk } from '@reduxjs/toolkit';
import AuthService from '../../api/auth';
import SecureStorage from '../../utils/storage';

/**
 * Additional Auth Actions
 * Extends the auth slice with extra async actions
 */

/**
 * Verify OTP
 */
export const verifyOTP = createAsyncThunk(
  'auth/verifyOTP',
  async (otp, { rejectWithValue }) => {
    try {
      const response = await AuthService.verifyOTP(otp);
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

/**
 * Resend OTP
 */
export const resendOTP = createAsyncThunk(
  'auth/resendOTP',
  async (_, { rejectWithValue }) => {
    try {
      const response = await AuthService.resendOTP();
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

/**
 * Forgot password
 */
export const forgotPassword = createAsyncThunk(
  'auth/forgotPassword',
  async (email, { rejectWithValue }) => {
    try {
      const response = await AuthService.forgotPassword(email);
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

/**
 * Reset password
 */
export const resetPassword = createAsyncThunk(
  'auth/resetPassword',
  async (data, { rejectWithValue }) => {
    try {
      const response = await AuthService.resetPassword(data);
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

/**
 * Change password
 */
export const changePassword = createAsyncThunk(
  'auth/changePassword',
  async (data, { rejectWithValue }) => {
    try {
      const response = await AuthService.changePassword(data);
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

/**
 * Update profile
 */
export const updateProfile = createAsyncThunk(
  'auth/updateProfile',
  async (profileData, { rejectWithValue }) => {
    try {
      // Call update profile API (assuming it exists)
      const response = await AuthService.updateProfile(profileData);
      if (response.success) {
        // Update stored user data
        await SecureStorage.setUserData(response.data);
        return response.data;
      } else {
        return rejectWithValue(response);
      }
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

/**
 * Enable two-factor authentication
 */
export const enableTwoFactor = createAsyncThunk(
  'auth/enableTwoFactor',
  async (_, { rejectWithValue }) => {
    try {
      // Call enable 2FA API (assuming it exists)
      const response = await AuthService.enableTwoFactor();
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

/**
 * Disable two-factor authentication
 */
export const disableTwoFactor = createAsyncThunk(
  'auth/disableTwoFactor',
  async (_, { rejectWithValue }) => {
    try {
      // Call disable 2FA API (assuming it exists)
      const response = await AuthService.disableTwoFactor();
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

/**
 * Refresh session
 */
export const refreshSession = createAsyncThunk(
  'auth/refreshSession',
  async (_, { rejectWithValue }) => {
    try {
      const response = await AuthService.getMe();
      if (response.success) {
        await SecureStorage.setUserData(response.data);
        return response.data;
      } else {
        return rejectWithValue(response);
      }
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

/**
 * Delete account
 */
export const deleteAccount = createAsyncThunk(
  'auth/deleteAccount',
  async (password, { rejectWithValue }) => {
    try {
      // Call delete account API (assuming it exists)
      const response = await AuthService.deleteAccount(password);
      if (response.success) {
        // Clear all local data
        await SecureStorage.clear();
        return response.data;
      } else {
        return rejectWithValue(response);
      }
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

/**
 * Verify email
 */
export const verifyEmail = createAsyncThunk(
  'auth/verifyEmail',
  async (token, { rejectWithValue }) => {
    try {
      // Call verify email API (assuming it exists)
      const response = await AuthService.verifyEmail(token);
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

/**
 * Resend verification email
 */
export const resendVerificationEmail = createAsyncThunk(
  'auth/resendVerificationEmail',
  async (_, { rejectWithValue }) => {
    try {
      // Call resend verification email API (assuming it exists)
      const response = await AuthService.resendVerificationEmail();
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

/**
 * Check security questions
 */
export const checkSecurityQuestions = createAsyncThunk(
  'auth/checkSecurityQuestions',
  async (_, { rejectWithValue }) => {
    try {
      // Check if user has set security questions
      const userData = await SecureStorage.getUserData();
      return {
        hasSecurityQuestions: userData?.has_security_questions || false,
      };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

/**
 * Set security questions
 */
export const setSecurityQuestions = createAsyncThunk(
  'auth/setSecurityQuestions',
  async (questionsData, { rejectWithValue }) => {
    try {
      // Call set security questions API (assuming it exists)
      const response = await AuthService.setSecurityQuestions(questionsData);
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

/**
 * Verify security questions
 */
export const verifySecurityQuestions = createAsyncThunk(
  'auth/verifySecurityQuestions',
  async (answers, { rejectWithValue }) => {
    try {
      // Call verify security questions API (assuming it exists)
      const response = await AuthService.verifySecurityQuestions(answers);
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

export default {
  verifyOTP,
  resendOTP,
  forgotPassword,
  resetPassword,
  changePassword,
  updateProfile,
  enableTwoFactor,
  disableTwoFactor,
  refreshSession,
  deleteAccount,
  verifyEmail,
  resendVerificationEmail,
  checkSecurityQuestions,
  setSecurityQuestions,
  verifySecurityQuestions,
};