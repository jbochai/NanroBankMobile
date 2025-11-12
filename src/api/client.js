import axios from 'axios';
import SecureStorage from '../utils/storage';
import NetInfo from '@react-native-community/netinfo';
import Toast from 'react-native-toast-message';

// Hardcoded for now to avoid env issues
const BASE_API_URL = 'https://nanroinventory.pncitservdesk.com/nanrobankapi/api/v1';
const BASE_URL = 'https://nanroinventory.pncitservdesk.com/nanrobankapi';
export const STORAGE_BASE_URL = `${BASE_URL}/storage/app/public`;

console.log('=== API Client Configuration ===');
console.log('BASE_API_URL:', BASE_API_URL);
console.log('BASE_URL:', BASE_URL);
console.log('STORAGE_BASE_URL:', STORAGE_BASE_URL);
console.log('===============================');

// Create axios instance
const api = axios.create({
  baseURL: BASE_API_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

console.log('API client created:', !!api);

// Token management
let isRefreshing = false;
let refreshSubscribers = [];

const subscribeTokenRefresh = (callback) => {
  refreshSubscribers.push(callback);
};

const onTokenRefreshed = (token) => {
  refreshSubscribers.forEach((callback) => callback(token));
  refreshSubscribers = [];
};

// Refresh token
const refreshAuthToken = async () => {
  try {
    const token = await SecureStorage.getAuthToken();
    if (!token) {
      throw new Error('No token available');
    }

    const response = await axios.post(
      `${BASE_API_URL}/auth/refresh`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (response.data.success) {
      const newToken = response.data.data.access_token;
      await SecureStorage.setAuthToken(newToken);
      return newToken;
    }

    throw new Error('Failed to refresh token');
  } catch (error) {
    // Clear token and redirect to login
    await SecureStorage.removeAuthToken();
    await SecureStorage.setUserData(null);
    throw error;
  }
};

// Helper function to get full image URL
export const getImageUrl = (path) => {
  if (!path) {
    console.log('getImageUrl - No path provided');
    return null;
  }
  
  // If already a full URL, return as is
  if (path.startsWith('http://') || path.startsWith('https://')) {
    console.log('getImageUrl - Already full URL:', path);
    return path;
  }
  
  // Remove leading slash if present
  const cleanPath = path.startsWith('/') ? path.substring(1) : path;
  
  // Construct full URL
  const fullUrl = `${STORAGE_BASE_URL}/${cleanPath}`;
  
  console.log('getImageUrl - Input:', path);
  console.log('getImageUrl - Output:', fullUrl);
  
  return fullUrl;
};

// Setup interceptors
export const setupAxiosInterceptors = (store) => {
  console.log('Setting up axios interceptors...');
  
  // Request interceptor
  api.interceptors.request.use(
    async (config) => {
      // Check network connectivity
      const netInfo = await NetInfo.fetch();
      if (!netInfo.isConnected) {
        return Promise.reject(new Error('No internet connection'));
      }

      // Skip token for login/register/biometric endpoints
      const isAuthEndpoint = 
        config.url?.includes('/auth/login') || 
        config.url?.includes('/auth/register') ||
        (config.url?.includes('/auth/login/biometric') && config.method === 'post' && !config.headers.Authorization);

      if (!isAuthEndpoint) {
        // Add auth token to headers for other endpoints
        const token = await SecureStorage.getAuthToken();
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
      }

      // Add device info headers (optional)
      try {
        const deviceId = store.getState().device?.deviceId || 'unknown';
        const appVersion = store.getState().app?.version || '1.0.0';
        const platform = store.getState().device?.platform || 'unknown';
        
        config.headers['X-Device-Id'] = deviceId;
        config.headers['X-App-Version'] = appVersion;
        config.headers['X-Platform'] = platform;
      } catch (error) {
        // Ignore if device state not available
      }

      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  // Response interceptor
  api.interceptors.response.use(
    (response) => {
      // Handle successful response
      return response;
    },
    async (error) => {
      const originalRequest = error.config;

      // Handle network errors
      if (error.message === 'No internet connection') {
        Toast.show({
          type: 'error',
          text1: 'No Internet',
          text2: 'Please check your internet connection',
        });
        return Promise.reject(error);
      }

      // Handle timeout errors
      if (error.code === 'ECONNABORTED') {
        Toast.show({
          type: 'error',
          text1: 'Request Timeout',
          text2: 'The request took too long. Please try again.',
        });
        return Promise.reject(error);
      }

      // Skip token refresh for auth endpoints
      const isAuthEndpoint = 
        originalRequest.url?.includes('/auth/login') || 
        originalRequest.url?.includes('/auth/register') ||
        originalRequest.url?.includes('/auth/login/biometric');

      // Handle 401 Unauthorized (token expired)
      if (error.response?.status === 401 && !originalRequest._retry && !isAuthEndpoint) {
        if (!isRefreshing) {
          isRefreshing = true;
          originalRequest._retry = true;

          try {
            const newToken = await refreshAuthToken();
            isRefreshing = false;
            onTokenRefreshed(newToken);
            
            // Retry original request with new token
            originalRequest.headers.Authorization = `Bearer ${newToken}`;
            return api(originalRequest);
          } catch (refreshError) {
            isRefreshing = false;
            // Redirect to login
            store.dispatch({ type: 'auth/sessionExpired' });
            Toast.show({
              type: 'error',
              text1: 'Session Expired',
              text2: 'Please login again',
            });
            return Promise.reject(refreshError);
          }
        }

        // Token is being refreshed, queue this request
        return new Promise((resolve, reject) => {
          subscribeTokenRefresh((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            resolve(api(originalRequest));
          });
        });
      }

      // Handle 403 Forbidden
      if (error.response?.status === 403) {
        Toast.show({
          type: 'error',
          text1: 'Access Denied',
          text2: error.response.data?.message || 'You do not have permission to perform this action',
        });
      }

      // Handle 422 Validation errors
      if (error.response?.status === 422) {
        const errors = error.response.data?.errors;
        if (errors) {
          const firstError = Object.values(errors)[0];
          Toast.show({
            type: 'error',
            text1: 'Validation Error',
            text2: Array.isArray(firstError) ? firstError[0] : firstError,
          });
        }
      }

      // Handle 429 Rate limiting
      if (error.response?.status === 429) {
        Toast.show({
          type: 'error',
          text1: 'Too Many Requests',
          text2: 'Please wait a moment before trying again',
        });
      }

      // Handle 500 Server errors
      if (error.response?.status >= 500) {
        Toast.show({
          type: 'error',
          text1: 'Server Error',
          text2: 'Something went wrong. Please try again later.',
        });
      }

      return Promise.reject(error);
    }
  );
  
  console.log('Axios interceptors setup complete');
};

// API response handler
export const handleApiResponse = (response) => {
  if (response.data.success) {
    return response.data.data;
  } else {
    throw new Error(response.data.message || 'An error occurred');
  }
};

// API error handler
export const handleApiError = (error) => {
  if (error.response) {
    // Server responded with error
    const message = error.response.data?.message || 'An error occurred';
    const errors = error.response.data?.errors || {};
    
    return {
      success: false,
      message,
      errors,
      statusCode: error.response.status,
    };
  } else if (error.request) {
    // Request was made but no response
    return {
      success: false,
      message: 'No response from server. Please check your internet connection.',
      errors: {},
      statusCode: null,
    };
  } else {
    // Something else happened
    return {
      success: false,
      message: error.message || 'An unexpected error occurred',
      errors: {},
      statusCode: null,
    };
  }
};

// Export base URL for use in other files
export const BASE_URL_EXPORT = BASE_URL;

console.log('Exporting API client...');
export default api;