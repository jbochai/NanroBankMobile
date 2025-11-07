import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import BillPaymentService from '../../api/billPayment';

// Initial state
const initialState = {
  dataPlans: [],
  cablePackages: [],
  electricityProviders: [],
  savedBills: [],
  scheduledBills: [],
  billHistory: [],
  verifiedMeter: null,
  verifiedSmartcard: null,
  currentBill: null,
  isLoading: false,
  error: null,
};

// Async thunks
export const buyAirtime = createAsyncThunk(
  'billPayment/buyAirtime',
  async (airtimeData, { rejectWithValue }) => {
    try {
      const response = await BillPaymentService.buyAirtime(airtimeData);
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

export const buyDataBundle = createAsyncThunk(
  'billPayment/buyDataBundle',
  async (dataBundle, { rejectWithValue }) => {
    try {
      const response = await BillPaymentService.buyDataBundle(dataBundle);
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

export const fetchDataPlans = createAsyncThunk(
  'billPayment/fetchDataPlans',
  async (provider, { rejectWithValue }) => {
    try {
      const response = await BillPaymentService.getDataPlans(provider);
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

export const payElectricity = createAsyncThunk(
  'billPayment/payElectricity',
  async (electricityData, { rejectWithValue }) => {
    try {
      const response = await BillPaymentService.payElectricity(electricityData);
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

export const verifyMeter = createAsyncThunk(
  'billPayment/verifyMeter',
  async (meterData, { rejectWithValue }) => {
    try {
      const response = await BillPaymentService.verifyMeter(meterData);
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

export const payCableTV = createAsyncThunk(
  'billPayment/payCableTV',
  async (cableData, { rejectWithValue }) => {
    try {
      const response = await BillPaymentService.payCableTV(cableData);
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

export const verifySmartcard = createAsyncThunk(
  'billPayment/verifySmartcard',
  async (smartcardData, { rejectWithValue }) => {
    try {
      const response = await BillPaymentService.verifySmartcard(smartcardData);
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

export const fetchCableTVPackages = createAsyncThunk(
  'billPayment/fetchCableTVPackages',
  async (provider, { rejectWithValue }) => {
    try {
      const response = await BillPaymentService.getCableTVPackages(provider);
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

export const fetchBillHistory = createAsyncThunk(
  'billPayment/fetchBillHistory',
  async (params = {}, { rejectWithValue }) => {
    try {
      const response = await BillPaymentService.getBillHistory(params);
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

export const fetchSavedBills = createAsyncThunk(
  'billPayment/fetchSavedBills',
  async (_, { rejectWithValue }) => {
    try {
      const response = await BillPaymentService.getSavedBills();
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

export const saveBill = createAsyncThunk(
  'billPayment/saveBill',
  async (billData, { rejectWithValue }) => {
    try {
      const response = await BillPaymentService.saveBill(billData);
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

export const deleteSavedBill = createAsyncThunk(
  'billPayment/deleteSavedBill',
  async (billId, { rejectWithValue }) => {
    try {
      const response = await BillPaymentService.deleteSavedBill(billId);
      if (response.success) {
        return { id: billId };
      } else {
        return rejectWithValue(response);
      }
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Bill payment slice
const billPaymentSlice = createSlice({
  name: 'billPayment',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearVerifiedMeter: (state) => {
      state.verifiedMeter = null;
    },
    clearVerifiedSmartcard: (state) => {
      state.verifiedSmartcard = null;
    },
    setCurrentBill: (state, action) => {
      state.currentBill = action.payload;
    },
    clearCurrentBill: (state) => {
      state.currentBill = null;
    },
    resetBillPayment: (state) => {
      state.verifiedMeter = null;
      state.verifiedSmartcard = null;
      state.currentBill = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Buy Airtime
    builder
      .addCase(buyAirtime.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(buyAirtime.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentBill = action.payload;
        state.billHistory.unshift(action.payload);
      })
      .addCase(buyAirtime.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload?.message || 'Airtime purchase failed';
      });

    // Buy Data Bundle
    builder
      .addCase(buyDataBundle.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(buyDataBundle.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentBill = action.payload;
        state.billHistory.unshift(action.payload);
      })
      .addCase(buyDataBundle.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload?.message || 'Data purchase failed';
      });

    // Fetch Data Plans
    builder
      .addCase(fetchDataPlans.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchDataPlans.fulfilled, (state, action) => {
        state.isLoading = false;
        state.dataPlans = action.payload;
      })
      .addCase(fetchDataPlans.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload?.message || 'Failed to fetch data plans';
      });

    // Pay Electricity
    builder
      .addCase(payElectricity.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(payElectricity.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentBill = action.payload;
        state.billHistory.unshift(action.payload);
        state.verifiedMeter = null;
      })
      .addCase(payElectricity.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload?.message || 'Electricity payment failed';
      });

    // Verify Meter
    builder
      .addCase(verifyMeter.pending, (state) => {
        state.isLoading = true;
        state.error = null;
        state.verifiedMeter = null;
      })
      .addCase(verifyMeter.fulfilled, (state, action) => {
        state.isLoading = false;
        state.verifiedMeter = action.payload;
      })
      .addCase(verifyMeter.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload?.message || 'Meter verification failed';
        state.verifiedMeter = null;
      });

    // Pay Cable TV
    builder
      .addCase(payCableTV.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(payCableTV.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentBill = action.payload;
        state.billHistory.unshift(action.payload);
        state.verifiedSmartcard = null;
      })
      .addCase(payCableTV.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload?.message || 'Cable TV payment failed';
      });

    // Verify Smartcard
    builder
      .addCase(verifySmartcard.pending, (state) => {
        state.isLoading = true;
        state.error = null;
        state.verifiedSmartcard = null;
      })
      .addCase(verifySmartcard.fulfilled, (state, action) => {
        state.isLoading = false;
        state.verifiedSmartcard = action.payload;
      })
      .addCase(verifySmartcard.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload?.message || 'Smartcard verification failed';
        state.verifiedSmartcard = null;
      });

    // Fetch Cable TV Packages
    builder
      .addCase(fetchCableTVPackages.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchCableTVPackages.fulfilled, (state, action) => {
        state.isLoading = false;
        state.cablePackages = action.payload;
      })
      .addCase(fetchCableTVPackages.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload?.message || 'Failed to fetch cable packages';
      });

    // Fetch Bill History
    builder
      .addCase(fetchBillHistory.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchBillHistory.fulfilled, (state, action) => {
        state.isLoading = false;
        state.billHistory = action.payload.data || action.payload;
      })
      .addCase(fetchBillHistory.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload?.message || 'Failed to fetch bill history';
      });

    // Fetch Saved Bills
    builder
      .addCase(fetchSavedBills.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchSavedBills.fulfilled, (state, action) => {
        state.isLoading = false;
        state.savedBills = action.payload;
      })
      .addCase(fetchSavedBills.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload?.message || 'Failed to fetch saved bills';
      });

    // Save Bill
    builder
      .addCase(saveBill.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(saveBill.fulfilled, (state, action) => {
        state.isLoading = false;
        state.savedBills.push(action.payload);
      })
      .addCase(saveBill.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload?.message || 'Failed to save bill';
      });

    // Delete Saved Bill
    builder
      .addCase(deleteSavedBill.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(deleteSavedBill.fulfilled, (state, action) => {
        state.isLoading = false;
        state.savedBills = state.savedBills.filter(
          (bill) => bill.id !== action.payload.id
        );
      })
      .addCase(deleteSavedBill.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload?.message || 'Failed to delete saved bill';
      });
  },
});

// Export actions
export const {
  clearError,
  clearVerifiedMeter,
  clearVerifiedSmartcard,
  setCurrentBill,
  clearCurrentBill,
  resetBillPayment,
} = billPaymentSlice.actions;

// Export reducer
export default billPaymentSlice.reducer;

// Selectors
export const selectDataPlans = (state) => state.billPayment.dataPlans;
export const selectCablePackages = (state) => state.billPayment.cablePackages;
export const selectSavedBills = (state) => state.billPayment.savedBills;
export const selectBillHistory = (state) => state.billPayment.billHistory;
export const selectVerifiedMeter = (state) => state.billPayment.verifiedMeter;
export const selectVerifiedSmartcard = (state) => state.billPayment.verifiedSmartcard;
export const selectCurrentBill = (state) => state.billPayment.currentBill;
export const selectBillPaymentLoading = (state) => state.billPayment.isLoading;
export const selectBillPaymentError = (state) => state.billPayment.error;