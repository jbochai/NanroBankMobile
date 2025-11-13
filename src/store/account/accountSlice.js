import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import AccountService from '../../api/account';

// Initial state
const initialState = {
  balance: 0,
  availableBalance: 0,
  accountNumber: null,
  accountType: 'savings',
  accountStatus: 'active',
  transactionPin: false,
  dailyTransferLimit: 1000000,
  dailyTransferUsed: 0,
  isLoading: false,
  error: null,
  accounts: [],
  primaryAccount: null,
};

// Async thunks
export const fetchAccountBalance = createAsyncThunk(
  'account/fetchBalance',
  async (_, { rejectWithValue }) => {
    try {
      const response = await AccountService.getBalance();
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

export const fetchAccountDetails = createAsyncThunk(
  'account/fetchDetails',
  async (_, { rejectWithValue }) => {
    try {
      const response = await AccountService.getAccountDetails();
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

export const setTransactionPin = createAsyncThunk(
  'account/setPin',
  async (pinData, { rejectWithValue }) => {
    try {
      const response = await AccountService.setTransactionPin(pinData);
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

export const changeTransactionPin = createAsyncThunk(
  'account/changePin',
  async (pinData, { rejectWithValue }) => {
    try {
      const response = await AccountService.changeTransactionPin(pinData);
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

export const validateTransactionPin = createAsyncThunk(
  'account/validatePin',
  async (pin, { rejectWithValue }) => {
    try {
      const response = await AccountService.validatePin(pin);
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

// Account slice
const accountSlice = createSlice({
  name: 'account',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    updateBalance: (state, action) => {
      state.balance = action.payload.balance;
      state.availableBalance = action.payload.availableBalance || action.payload.balance;
    },
    updateDailyTransferUsed: (state, action) => {
      state.dailyTransferUsed = action.payload;
    },
    resetAccount: (state) => {
      Object.assign(state, initialState);
    },
  },
  extraReducers: (builder) => {
    // Fetch Balance
    builder
      .addCase(fetchAccountBalance.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchAccountBalance.fulfilled, (state, action) => {
        state.isLoading = false;
        state.balance = action.payload.balance;
        state.availableBalance = action.payload.available_balance || action.payload.balance;
        state.accountNumber = action.payload.account_number;
      })
      .addCase(fetchAccountBalance.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload?.message || 'Failed to fetch balance';
      });

    // Fetch Account Details
    builder
      .addCase(fetchAccountDetails.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchAccountDetails.fulfilled, (state, action) => {
        state.isLoading = false;
        state.accountNumber = action.payload.account_number;
        state.accountType = action.payload.account_type;
        state.accountStatus = action.payload.status;
        state.balance = action.payload.balance;
        state.availableBalance = action.payload.available_balance;
        state.dailyTransferLimit = action.payload.daily_transfer_limit;
        state.dailyTransferUsed = action.payload.daily_transfer_used;
        state.transactionPin = action.payload.has_transaction_pin;
      })
      .addCase(fetchAccountDetails.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload?.message || 'Failed to fetch account details';
      });

    // Set Transaction PIN
    builder
      .addCase(setTransactionPin.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(setTransactionPin.fulfilled, (state) => {
        state.isLoading = false;
        state.transactionPin = true;
      })
      .addCase(setTransactionPin.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload?.message || 'Failed to set PIN';
      });

    // Change Transaction PIN
    builder
      .addCase(changeTransactionPin.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(changeTransactionPin.fulfilled, (state) => {
        state.isLoading = false;
      })
      .addCase(changeTransactionPin.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload?.message || 'Failed to change PIN';
      });

    // Validate Transaction PIN
    builder
      .addCase(validateTransactionPin.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(validateTransactionPin.fulfilled, (state) => {
        state.isLoading = false;
      })
      .addCase(validateTransactionPin.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload?.message || 'Invalid PIN';
      });
  },
});

// Export actions
export const { clearError, updateBalance, updateDailyTransferUsed, resetAccount } = accountSlice.actions;

// Export reducer
export default accountSlice.reducer;

// Selectors
export const selectAccount = (state) => state.account;
export const selectBalance = (state) => state.account.balance;
export const selectAvailableBalance = (state) => state.account.availableBalance;
export const selectAccountNumber = (state) => state.account.accountNumber;
export const selectAccountType = (state) => state.account.accountType;
export const selectHasTransactionPin = (state) => state.account.transactionPin;
export const selectDailyTransferLimit = (state) => state.account.dailyTransferLimit;
export const selectDailyTransferUsed = (state) => state.account.dailyTransferUsed;
export const selectAccountLoading = (state) => state.account.isLoading;
export const selectAccountError = (state) => state.account.error;
export const selectPrimaryAccount = (state) => state.account.primaryAccount;
// Should have these selectors at the bottom:
export const selectAccounts = (state) => state.account.accounts;
