/**
 * Application Constants
 */

// API Endpoints
export const API_ENDPOINTS = {
  // Auth
  LOGIN: '/login',
  REGISTER: '/register',
  LOGOUT: '/logout',
  REFRESH_TOKEN: '/refresh-token',
  FORGOT_PASSWORD: '/forgot-password',
  RESET_PASSWORD: '/reset-password',
  CHANGE_PASSWORD: '/change-password',
  VERIFY_OTP: '/verify-otp',
  RESEND_OTP: '/resend-otp',
  
  // Account
  ACCOUNT_BALANCE: '/account/balance',
  ACCOUNT_DETAILS: '/account/details',
  ACCOUNT_STATEMENT: '/account/statement',
  SET_PIN: '/account/set-pin',
  CHANGE_PIN: '/account/change-pin',
  VERIFY_PIN: '/account/verify-pin',
  
  // Transfer
  TRANSFER: '/transfer',
  TRANSFER_VALIDATE: '/transfer/validate',
  TRANSFER_HISTORY: '/transfer/history',
  BENEFICIARIES: '/beneficiaries',
  
  // Bills
  BILL_CATEGORIES: '/bills/categories',
  BILL_PROVIDERS: '/bills/providers',
  BILL_VALIDATE: '/bills/validate',
  BILL_PAYMENT: '/bills/pay',
  
  // Airtime
  AIRTIME_PURCHASE: '/airtime/purchase',
  DATA_PLANS: '/data/plans',
  DATA_PURCHASE: '/data/purchase',
  
  // Cards
  CARDS: '/cards',
  CARD_DETAILS: '/cards/:id',
  CARD_TRANSACTIONS: '/cards/:id/transactions',
  BLOCK_CARD: '/cards/:id/block',
  UNBLOCK_CARD: '/cards/:id/unblock',
  
  // Transactions
  TRANSACTIONS: '/transactions',
  TRANSACTION_DETAILS: '/transactions/:id',
  TRANSACTION_RECEIPT: '/transactions/:id/receipt',
};

// Transaction Types
export const TRANSACTION_TYPES = {
  TRANSFER: 'transfer',
  DEPOSIT: 'deposit',
  WITHDRAWAL: 'withdrawal',
  BILL_PAYMENT: 'bill_payment',
  AIRTIME: 'airtime',
  DATA: 'data',
  CARD_PAYMENT: 'card_payment',
  SALARY: 'salary',
  REFUND: 'refund',
};

// Transaction Status
export const TRANSACTION_STATUS = {
  PENDING: 'pending',
  SUCCESS: 'success',
  FAILED: 'failed',
  REVERSED: 'reversed',
  CANCELLED: 'cancelled',
};

// Bill Categories
export const BILL_CATEGORIES = {
  ELECTRICITY: 'electricity',
  TV: 'tv',
  INTERNET: 'internet',
  EDUCATION: 'education',
  BETTING: 'betting',
};

// Network Providers
export const NETWORK_PROVIDERS = {
  MTN: 'mtn',
  GLO: 'glo',
  AIRTEL: 'airtel',
  NINE_MOBILE: '9mobile',
};

// Card Types
export const CARD_TYPES = {
  PHYSICAL: 'physical',
  VIRTUAL: 'virtual',
};

// Card Status
export const CARD_STATUS = {
  ACTIVE: 'active',
  INACTIVE: 'inactive',
  BLOCKED: 'blocked',
  EXPIRED: 'expired',
  REQUESTED: 'requested',
};

// Account Types
export const ACCOUNT_TYPES = {
  SAVINGS: 'savings',
  CURRENT: 'current',
  FIXED_DEPOSIT: 'fixed_deposit',
};

// Limits
export const LIMITS = {
  MIN_TRANSFER_AMOUNT: 100,
  MAX_TRANSFER_AMOUNT: 5000000,
  MAX_DAILY_TRANSFER: 5000000,
  MIN_AIRTIME_AMOUNT: 50,
  MAX_AIRTIME_AMOUNT: 50000,
  MIN_BILL_AMOUNT: 100,
  MAX_BILL_AMOUNT: 500000,
  MAX_PIN_ATTEMPTS: 3,
  MAX_LOGIN_ATTEMPTS: 3,
  SESSION_TIMEOUT: 300000, // 5 minutes in milliseconds
  PIN_LENGTH: 4,
  OTP_LENGTH: 6,
};

// Time Constants
export const TIME_CONSTANTS = {
  SPLASH_DURATION: 3000,
  TOAST_DURATION: 3000,
  DEBOUNCE_DELAY: 500,
  API_TIMEOUT: 30000,
  CACHE_EXPIRY: 3600000, // 1 hour
  SESSION_CHECK_INTERVAL: 60000, // 1 minute
};

// Storage Keys
export const STORAGE_KEYS = {
  AUTH_TOKEN: 'auth_token',
  USER_DATA: 'user_data',
  BIOMETRIC_TOKEN: 'biometric_token',
  TRANSACTION_PIN: 'transaction_pin',
  DEVICE_ID: 'device_id',
  THEME: 'theme_preference',
  LANGUAGE: 'language_preference',
  NOTIFICATIONS: 'notification_settings',
  BENEFICIARIES: 'beneficiaries',
  RECENT_SEARCHES: 'recent_searches',
};

// Error Messages
export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'No internet connection. Please check your network.',
  TIMEOUT_ERROR: 'Request timed out. Please try again.',
  SERVER_ERROR: 'Something went wrong. Please try again later.',
  INVALID_CREDENTIALS: 'Invalid email or password.',
  SESSION_EXPIRED: 'Your session has expired. Please login again.',
  INSUFFICIENT_FUNDS: 'Insufficient account balance.',
  INVALID_PIN: 'Invalid transaction PIN.',
  ACCOUNT_LOCKED: 'Your account has been temporarily locked. Please try again later.',
  INVALID_OTP: 'Invalid or expired OTP.',
  GENERIC_ERROR: 'An error occurred. Please try again.',
};

// Success Messages
export const SUCCESS_MESSAGES = {
  LOGIN_SUCCESS: 'Login successful',
  REGISTER_SUCCESS: 'Registration successful',
  TRANSFER_SUCCESS: 'Transfer completed successfully',
  BILL_PAYMENT_SUCCESS: 'Bill payment successful',
  AIRTIME_SUCCESS: 'Airtime purchase successful',
  DATA_SUCCESS: 'Data purchase successful',
  PIN_CHANGED: 'PIN changed successfully',
  PASSWORD_CHANGED: 'Password changed successfully',
  CARD_BLOCKED: 'Card blocked successfully',
  CARD_UNBLOCKED: 'Card unblocked successfully',
};

// Validation Patterns
export const VALIDATION_PATTERNS = {
  EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  PHONE: /^(\+234|0)[789]\d{9}$/,
  ACCOUNT_NUMBER: /^\d{10}$/,
  BVN: /^\d{11}$/,
  NIN: /^\d{11}$/,
  PIN: /^\d{4}$/,
  OTP: /^\d{6}$/,
};

// Date Formats
export const DATE_FORMATS = {
  DISPLAY: 'MMM DD, YYYY',
  DISPLAY_WITH_TIME: 'MMM DD, YYYY h:mm A',
  INPUT: 'YYYY-MM-DD',
  TIME: 'h:mm A',
  MONTH_YEAR: 'MMMM YYYY',
  SHORT: 'DD/MM/YYYY',
};

// Currency
export const CURRENCY = {
  CODE: 'NGN',
  SYMBOL: '₦',
  NAME: 'Nigerian Naira',
};

// App Info
export const APP_INFO = {
  NAME: 'Nanro Bank',
  VERSION: '1.0.0',
  BUILD: '1',
  SUPPORT_EMAIL: 'support@nanrobank.com',
  SUPPORT_PHONE: '+234 800 000 0000',
  WEBSITE: 'https://www.nanrobank.com',
  TERMS_URL: 'https://www.nanrobank.com/terms',
  PRIVACY_URL: 'https://www.nanrobank.com/privacy',
};

// Notification Types
export const NOTIFICATION_TYPES = {
  TRANSACTION: 'transaction',
  SECURITY: 'security',
  PROMOTION: 'promotion',
  SYSTEM: 'system',
};

// Notification Settings
export const NOTIFICATION_SETTINGS = {
  PUSH_ENABLED: true,
  EMAIL_ENABLED: true,
  SMS_ENABLED: true,
  TRANSACTION_ALERTS: true,
  SECURITY_ALERTS: true,
  PROMOTIONAL_ALERTS: false,
};

// Theme
export const THEMES = {
  LIGHT: 'light',
  DARK: 'dark',
  SYSTEM: 'system',
};

// Languages
export const LANGUAGES = {
  ENGLISH: 'en',
  YORUBA: 'yo',
  HAUSA: 'ha',
  IGBO: 'ig',
};

// HTTP Status Codes
export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  UNPROCESSABLE_ENTITY: 422,
  TOO_MANY_REQUESTS: 429,
  INTERNAL_SERVER_ERROR: 500,
  SERVICE_UNAVAILABLE: 503,
};

// Animation Durations
export const ANIMATION = {
  FAST: 200,
  NORMAL: 300,
  SLOW: 500,
};

// Platform Specific
export const PLATFORM_CONFIG = {
  IOS_MINIMUM_VERSION: '13.0',
  ANDROID_MINIMUM_VERSION: '23',
  STORE_URL_IOS: 'https://apps.apple.com/app/nanrobank',
  STORE_URL_ANDROID: 'https://play.google.com/store/apps/details?id=com.nanrobank',
};

// Feature Flags
export const FEATURES = {
  BIOMETRIC_AUTH: true,
  VIRTUAL_CARDS: true,
  BILL_PAYMENTS: true,
  INVESTMENTS: false,
  LOANS: false,
  SAVINGS: true,
  QR_PAYMENTS: true,
  CARDLESS_WITHDRAWAL: false,
};

// Quick Transfer Amounts
export const QUICK_AMOUNTS = [500, 1000, 2000, 5000, 10000, 20000];

// Quick Airtime Amounts
export const QUICK_AIRTIME_AMOUNTS = [100, 200, 500, 1000, 2000, 5000];

// Pagination
export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 20,
  MAX_PAGE_SIZE: 100,
};

// File Upload
export const FILE_UPLOAD = {
  MAX_SIZE: 5242880, // 5MB
  ALLOWED_TYPES: ['image/jpeg', 'image/png', 'image/jpg', 'application/pdf'],
  MAX_FILES: 5,
};

// Rating
export const RATING = {
  MIN: 1,
  MAX: 5,
};

// Security
export const SECURITY = {
  PASSWORD_MIN_LENGTH: 8,
  PASSWORD_MAX_LENGTH: 128,
  LOCKOUT_DURATION: 1800000, // 30 minutes
  TOKEN_REFRESH_THRESHOLD: 300000, // 5 minutes before expiry
};

// Beneficiary Types
export const BENEFICIARY_TYPES = {
  NANRO: 'nanro',
  OTHER_BANKS: 'other_banks',
};

// Transfer Types
export const TRANSFER_TYPES = {
  NANRO_TRANSFER: 'nanro',
  INTERBANK_TRANSFER: 'interbank',
  INTERNATIONAL_TRANSFER: 'international',
};

export default {
  API_ENDPOINTS,
  TRANSACTION_TYPES,
  TRANSACTION_STATUS,
  BILL_CATEGORIES,
  NETWORK_PROVIDERS,
  CARD_TYPES,
  CARD_STATUS,
  ACCOUNT_TYPES,
  LIMITS,
  TIME_CONSTANTS,
  STORAGE_KEYS,
  ERROR_MESSAGES,
  SUCCESS_MESSAGES,
  VALIDATION_PATTERNS,
  DATE_FORMATS,
  CURRENCY,
  APP_INFO,
  NOTIFICATION_TYPES,
  NOTIFICATION_SETTINGS,
  THEMES,
  LANGUAGES,
  HTTP_STATUS,
  ANIMATION,
  PLATFORM_CONFIG,
  FEATURES,
  QUICK_AMOUNTS,
  QUICK_AIRTIME_AMOUNTS,
  PAGINATION,
  FILE_UPLOAD,
  RATING,
  SECURITY,
  BENEFICIARY_TYPES,
  TRANSFER_TYPES,
};