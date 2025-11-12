import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import TransferService from '../../api/transfer';

// Initial state
const initialState = {
  beneficiaries: [],
  banks: [],
  transferLimits: {
    daily: 1000000,
    single: 500000,
    dailyUsed: 0,
  },
  currentTransfer: null,
  transferHistory: [],
  verifiedAccount: null,
  isLoading: false,
  error: null,
};

// Async thunks
export const intraBankTransfer = createAsyncThunk(
  'transfer/intra-bank',
  async (transferData, { rejectWithValue }) => {
    try {
      const response = await TransferService.intraBankTransfer(transferData);
      if (response.success) {
        return response.data;
      } else {
        return rejectWithValue(response.message || 'Transfer failed');
      }
    } catch (error) {
      return rejectWithValue(error?.response?.data?.message || error.message || 'Transfer failed');
    }
  }
);

export const interBankTransfer = createAsyncThunk(
  'transfer/inter-bank',
  async (transferData, { rejectWithValue }) => {
    try {
      const response = await TransferService.interBankTransfer(transferData);
      if (response.success) {
        return response.data;
      } else {
        return rejectWithValue(response.message || 'Transfer failed');
      }
    } catch (error) {
      return rejectWithValue(error?.response?.data?.message || error.message || 'Transfer failed');
    }
  }
);

export const verifyAccount = createAsyncThunk(
  'transfer/verify-account',
  async (accountData, { rejectWithValue }) => {
    try {
      const response = await TransferService.verifyAccount(accountData);
      if (response.success) {
        return response.data;
      } else {
        return rejectWithValue(response.message || 'Account verification failed');
      }
    } catch (error) {
      return rejectWithValue(error?.response?.data?.message || error.message || 'Account verification failed');
    }
  }
);

export const fetchBeneficiaries = createAsyncThunk(
  'transfer/fetchBeneficiaries',
  async (filters = {}, { rejectWithValue }) => {
    try {
      const response = await TransferService.getBeneficiaries(filters);
      if (response.success) {
        return response.data;
      } else {
        return rejectWithValue(response.message || 'Failed to fetch beneficiaries');
      }
    } catch (error) {
      // Check if it's a 404 error - beneficiaries endpoint might not exist yet
      if (error?.response?.status === 404 || error?.statusCode === 404) {
        // Return empty array instead of failing
        console.warn('Beneficiaries endpoint not found, returning empty array');
        return [];
      }
      return rejectWithValue(error?.response?.data?.message || error.message || 'Failed to fetch beneficiaries');
    }
  }
);

export const addBeneficiary = createAsyncThunk(
  'transfer/addBeneficiary',
  async (beneficiaryData, { rejectWithValue }) => {
    try {
      const response = await TransferService.addBeneficiary(beneficiaryData);
      if (response.success) {
        return response.data;
      } else {
        return rejectWithValue(response.message || 'Failed to add beneficiary');
      }
    } catch (error) {
      return rejectWithValue(error?.response?.data?.message || error.message || 'Failed to add beneficiary');
    }
  }
);

export const deleteBeneficiary = createAsyncThunk(
  'transfer/deleteBeneficiary',
  async ({ beneficiaryId, pin }, { rejectWithValue }) => {
    try {
      const response = await TransferService.deleteBeneficiary(beneficiaryId, pin);
      if (response.success) {
        return { id: beneficiaryId };
      } else {
        return rejectWithValue(response.message || 'Failed to delete beneficiary');
      }
    } catch (error) {
      return rejectWithValue(error?.response?.data?.message || error.message || 'Failed to delete beneficiary');
    }
  }
);

export const fetchBankList = createAsyncThunk(
  'transfer/fetch-bank-list',
  async (_, { rejectWithValue }) => {
    try {
      const response = await TransferService.getBankList();
      if (response.success) {
        return response.data;
      } else {
        return rejectWithValue(response.message || 'Failed to fetch banks');
      }
    } catch (error) {
      // Check if it's a 404 error - bank list endpoint might not exist yet
      if (error?.response?.status === 404 || error?.statusCode === 404) {
        console.warn('Bank list endpoint not found, returning empty array');
        return [];
      }
      return rejectWithValue(error?.response?.data?.message || error.message || 'Failed to fetch banks');
    }
  }
);

export const fetchTransferLimits = createAsyncThunk(
  'transfer/fetchTransferLimits',
  async (_, { rejectWithValue }) => {
    try {
      const response = await TransferService.getTransferLimits();
      if (response.success) {
        return response.data;
      } else {
        return rejectWithValue(response.message || 'Failed to fetch transfer limits');
      }
    } catch (error) {
      return rejectWithValue(error?.response?.data?.message || error.message || 'Failed to fetch transfer limits');
    }
  }
);

// Transfer slice
const transferSlice = createSlice({
  name: 'transfer',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearVerifiedAccount: (state) => {
      state.verifiedAccount = null;
    },
    setCurrentTransfer: (state, action) => {
      state.currentTransfer = action.payload;
    },
    clearCurrentTransfer: (state) => {
      state.currentTransfer = null;
    },
    updateDailyUsedLimit: (state, action) => {
      state.transferLimits.dailyUsed += action.payload;
    },
    resetTransfer: (state) => {
      state.currentTransfer = null;
      state.verifiedAccount = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Intra-bank Transfer
    builder
      .addCase(intraBankTransfer.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(intraBankTransfer.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentTransfer = action.payload;
        state.transferHistory.unshift(action.payload);
        state.transferLimits.dailyUsed += parseFloat(action.payload.amount);
      })
      .addCase(intraBankTransfer.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || 'Transfer failed';
      });

    // Inter-bank Transfer
    builder
      .addCase(interBankTransfer.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(interBankTransfer.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentTransfer = action.payload;
        state.transferHistory.unshift(action.payload);
        state.transferLimits.dailyUsed += parseFloat(action.payload.amount);
      })
      .addCase(interBankTransfer.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || 'Transfer failed';
      });

    // Verify Account
    builder
      .addCase(verifyAccount.pending, (state) => {
        state.isLoading = true;
        state.error = null;
        state.verifiedAccount = null;
      })
      .addCase(verifyAccount.fulfilled, (state, action) => {
        state.isLoading = false;
        state.verifiedAccount = action.payload;
      })
      .addCase(verifyAccount.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || 'Account verification failed';
        state.verifiedAccount = null;
      });

    // Fetch Beneficiaries
    builder
      .addCase(fetchBeneficiaries.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchBeneficiaries.fulfilled, (state, action) => {
        state.isLoading = false;
        state.beneficiaries = action.payload || [];
      })
      .addCase(fetchBeneficiaries.rejected, (state, action) => {
        state.isLoading = false;
        // Don't set error for beneficiaries - just use empty array
        state.beneficiaries = [];
      });

    // Add Beneficiary
    builder
      .addCase(addBeneficiary.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(addBeneficiary.fulfilled, (state, action) => {
        state.isLoading = false;
        state.beneficiaries.push(action.payload);
      })
      .addCase(addBeneficiary.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || 'Failed to add beneficiary';
      });

    // Delete Beneficiary
    builder
      .addCase(deleteBeneficiary.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(deleteBeneficiary.fulfilled, (state, action) => {
        state.isLoading = false;
        state.beneficiaries = state.beneficiaries.filter(
          (b) => b.id !== action.payload.id
        );
      })
      .addCase(deleteBeneficiary.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || 'Failed to delete beneficiary';
      });

    // Fetch Bank List
    builder
      .addCase(fetchBankList.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchBankList.fulfilled, (state, action) => {
        state.isLoading = false;
        state.banks = action.payload || [];
      })
      .addCase(fetchBankList.rejected, (state, action) => {
        state.isLoading = false;
        // Don't set error for banks - just use empty array
        state.banks = [];
      });

    // Fetch Transfer Limits
    builder
      .addCase(fetchTransferLimits.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchTransferLimits.fulfilled, (state, action) => {
        state.isLoading = false;
        state.transferLimits = {
          ...state.transferLimits,
          ...action.payload,
        };
      })
      .addCase(fetchTransferLimits.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || 'Failed to fetch transfer limits';
      });
  },
});

// Export actions
export const {
  clearError,
  clearVerifiedAccount,
  setCurrentTransfer,
  clearCurrentTransfer,
  updateDailyUsedLimit,
  resetTransfer,
} = transferSlice.actions;

// Export reducer
export default transferSlice.reducer;

// Selectors
export const selectBeneficiaries = (state) => state.transfer.beneficiaries;
export const selectBanks = (state) => state.transfer.banks;
export const selectTransferLimits = (state) => state.transfer.transferLimits;
export const selectCurrentTransfer = (state) => state.transfer.currentTransfer;
export const selectVerifiedAccount = (state) => state.transfer.verifiedAccount;
export const selectTransferLoading = (state) => state.transfer.isLoading;
export const selectTransferError = (state) => state.transfer.error;
export const selectCanTransfer = (state) => {
  const { daily, dailyUsed } = state.transfer.transferLimits;
  return dailyUsed < daily;
};