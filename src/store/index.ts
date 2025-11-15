import { configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { combineReducers } from 'redux';

// Import reducers
import authReducer from './auth/authSlice';
import accountReducer from './account/accountSlice';
import transactionReducer from './transaction/transactionSlice';
import transferReducer from './transfer/transferSlice';
import billPaymentReducer from './bill/billPaymentSlice';
import notificationReducer from './notification/notificationSlice';


// Persist config
const persistConfig = {
  key: 'root',
  storage: AsyncStorage,
  whitelist: ['auth'], // Only persist auth state
  blacklist: ['account', 'transaction', 'transfer', 'billPayment', 'notification'], // Don't persist these
};

// Combine reducers
const rootReducer = combineReducers({
  auth: authReducer,
  account: accountReducer,
  transaction: transactionReducer,
  transfer: transferReducer,
  billPayment: billPaymentReducer,
  notification: notificationReducer, // Added notification reducer
});

// Create persisted reducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

// Configure store
const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
        ignoredPaths: ['register', 'rehydrate'],
      },
      immutableCheck: {
        warnAfter: 128,
      },
    }),
  devTools: __DEV__, // Enable Redux DevTools in development mode
});

// Create persistor
const persistor = persistStore(store);

// Setup Axios interceptors with store
import { setupAxiosInterceptors } from '../api/client';
setupAxiosInterceptors(store);

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

// Export store and persistor
export { store, persistor };
export default store;