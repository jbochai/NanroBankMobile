import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import TransactionService from '../../api/transaction';

// Initial state
const initialState = {
  transactions: [],
  recentTransactions: [],
  currentTransaction: null,
  filters: {
    type: null,
    status: null,
    fromDate: null,
    toDate: null,
  },
  pagination: {
    currentPage: 1,
    totalPages: 1,
    perPage: 20,
    total: 0,
  },
  isLoading: false,
  isLoadingMore: false,
  error: null,
};

// Async thunks
export const fetchTransactions = createAsyncThunk(
  'transaction/fetchTransactions',
  async (params = {}, { rejectWithValue }) => {
    try {
      const response = await TransactionService.getTransactions(params);
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

export const fetchRecentTransactions = createAsyncThunk(
  'transaction/fetchRecent',
  async (params = { limit: 5 }, { rejectWithValue }) => {
    try {
      const response = await TransactionService.getRecentTransactions(params);
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

export const fetchTransactionDetails = createAsyncThunk(
  'transaction/fetchDetails',
  async (reference, { rejectWithValue }) => {
    try {
      const response = await TransactionService.getTransactionDetails(reference);
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

export const downloadReceipt = createAsyncThunk(
  'transaction/downloadReceipt',
  async (reference, { rejectWithValue }) => {
    try {
      const response = await TransactionService.downloadReceipt(reference);
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

export const loadMoreTransactions = createAsyncThunk(
  'transaction/loadMore',
  async (_, { getState, rejectWithValue }) => {
    try {
      const state = getState();
      const nextPage = state.transaction.pagination.currentPage + 1;
      const filters = state.transaction.filters;
      
      const params = {
        page: nextPage,
        per_page: state.transaction.pagination.perPage,
        ...filters,
      };
      
      const response = await TransactionService.getTransactions(params);
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

// Transaction slice
const transactionSlice = createSlice({
  name: 'transaction',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
      state.pagination.currentPage = 1;
    },
    clearFilters: (state) => {
      state.filters = {
        type: null,
        status: null,
        fromDate: null,
        toDate: null,
      };
      state.pagination.currentPage = 1;
    },
    addNewTransaction: (state, action) => {
      state.transactions.unshift(action.payload);
      state.recentTransactions.unshift(action.payload);
      if (state.recentTransactions.length > 5) {
        state.recentTransactions.pop();
      }
    },
    updateTransaction: (state, action) => {
      const index = state.transactions.findIndex(
        (t) => t.reference === action.payload.reference
      );
      if (index !== -1) {
        state.transactions[index] = action.payload;
      }
    },
    resetTransactions: (state) => {
      Object.assign(state, initialState);
    },
  },
  extraReducers: (builder) => {
    // Fetch Transactions
    builder
      .addCase(fetchTransactions.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchTransactions.fulfilled, (state, action) => {
        state.isLoading = false;
        state.transactions = action.payload.data || [];
        state.pagination = {
          currentPage: action.payload.current_page || 1,
          totalPages: action.payload.last_page || 1,
          perPage: action.payload.per_page || 20,
          total: action.payload.total || 0,
        };
      })
      .addCase(fetchTransactions.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload?.message || 'Failed to fetch transactions';
      });

    // Fetch Recent Transactions
    builder
      .addCase(fetchRecentTransactions.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchRecentTransactions.fulfilled, (state, action) => {
        state.isLoading = false;
        state.recentTransactions = action.payload || [];
      })
      .addCase(fetchRecentTransactions.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload?.message || 'Failed to fetch recent transactions';
      });

    // Fetch Transaction Details
    builder
      .addCase(fetchTransactionDetails.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchTransactionDetails.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentTransaction = action.payload;
      })
      .addCase(fetchTransactionDetails.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload?.message || 'Failed to fetch transaction details';
      });

    // Load More Transactions
    builder
      .addCase(loadMoreTransactions.pending, (state) => {
        state.isLoadingMore = true;
        state.error = null;
      })
      .addCase(loadMoreTransactions.fulfilled, (state, action) => {
        state.isLoadingMore = false;
        state.transactions = [...state.transactions, ...(action.payload.data || [])];
        state.pagination = {
          currentPage: action.payload.current_page || 1,
          totalPages: action.payload.last_page || 1,
          perPage: action.payload.per_page || 20,
          total: action.payload.total || 0,
        };
      })
      .addCase(loadMoreTransactions.rejected, (state, action) => {
        state.isLoadingMore = false;
        state.error = action.payload?.message || 'Failed to load more transactions';
      });

    // Download Receipt
    builder
      .addCase(downloadReceipt.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(downloadReceipt.fulfilled, (state) => {
        state.isLoading = false;
      })
      .addCase(downloadReceipt.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload?.message || 'Failed to download receipt';
      });
  },
});

// Export actions
export const {
  clearError,
  setFilters,
  clearFilters,
  addNewTransaction,
  updateTransaction,
  resetTransactions,
} = transactionSlice.actions;

// Export reducer
export default transactionSlice.reducer;

// Selectors
export const selectTransactions = (state) => state.transaction.transactions;
export const selectRecentTransactions = (state) => state.transaction.recentTransactions;
export const selectCurrentTransaction = (state) => state.transaction.currentTransaction;
export const selectTransactionFilters = (state) => state.transaction.filters;
export const selectTransactionPagination = (state) => state.transaction.pagination;
export const selectTransactionLoading = (state) => state.transaction.isLoading;
export const selectTransactionLoadingMore = (state) => state.transaction.isLoadingMore;
export const selectTransactionError = (state) => state.transaction.error;
export const selectHasMoreTransactions = (state) => 
  state.transaction.pagination.currentPage < state.transaction.pagination.totalPages;