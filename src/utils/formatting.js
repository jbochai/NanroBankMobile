import moment from 'moment';

/**
 * Format currency with Naira symbol
 */
export const formatCurrency = (amount, showSymbol = true, decimals = 2) => {
  if (amount === null || amount === undefined) return showSymbol ? '₦0.00' : '0.00';
  
  const numAmount = parseFloat(amount);
  if (isNaN(numAmount)) return showSymbol ? '₦0.00' : '0.00';
  
  const formatted = numAmount.toLocaleString('en-NG', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
  
  return showSymbol ? `₦${formatted}` : formatted;
};

/**
 * Format account number with spaces
 */
export const formatAccountNumber = (accountNumber) => {
  if (!accountNumber) return '';
  const cleaned = accountNumber.toString().replace(/\s/g, '');
  const chunks = cleaned.match(/.{1,4}/g) || [];
  return chunks.join(' ');
};

/**
 * Format phone number
 */
export const formatPhoneNumber = (phoneNumber) => {
  if (!phoneNumber) return '';
  
  let cleaned = phoneNumber.toString().replace(/\D/g, '');
  
  // Handle Nigerian phone numbers
  if (cleaned.startsWith('234')) {
    cleaned = '0' + cleaned.slice(3);
  }
  
  // Format as 0803 456 7890
  if (cleaned.length === 11 && cleaned.startsWith('0')) {
    return `${cleaned.slice(0, 4)} ${cleaned.slice(4, 7)} ${cleaned.slice(7)}`;
  }
  
  return phoneNumber;
};

/**
 * Format card number with spaces and masking
 */
export const formatCardNumber = (cardNumber, mask = true) => {
  if (!cardNumber) return '';
  
  const cleaned = cardNumber.toString().replace(/\s/g, '');
  
  if (mask && cleaned.length >= 12) {
    // Show first 4 and last 4 digits
    const masked = `${cleaned.slice(0, 4)} **** **** ${cleaned.slice(-4)}`;
    return masked;
  }
  
  // Format as 1234 5678 9012 3456
  const chunks = cleaned.match(/.{1,4}/g) || [];
  return chunks.join(' ');
};

/**
 * Format date
 */
export const formatDate = (date, format = 'MMM DD, YYYY') => {
  if (!date) return '';
  return moment(date).format(format);
};

/**
 * Format date time
 */
export const formatDateTime = (date, format = 'MMM DD, YYYY • hh:mm A') => {
  if (!date) return '';
  return moment(date).format(format);
};

/**
 * Format relative time (e.g., "2 hours ago")
 */
export const formatRelativeTime = (date) => {
  if (!date) return '';
  return moment(date).fromNow();
};

/**
 * Format transaction reference
 */
export const formatReference = (reference) => {
  if (!reference) return '';
  // Format as TXN-1234-5678-9012
  const cleaned = reference.toString().replace(/-/g, '');
  const chunks = cleaned.match(/.{1,4}/g) || [];
  return chunks.join('-');
};

/**
 * Format percentage
 */
export const formatPercentage = (value, decimals = 2) => {
  if (value === null || value === undefined) return '0%';
  const numValue = parseFloat(value);
  if (isNaN(numValue)) return '0%';
  return `${numValue.toFixed(decimals)}%`;
};

/**
 * Format file size
 */
export const formatFileSize = (bytes) => {
  if (!bytes || bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

/**
 * Truncate text
 */
export const truncateText = (text, maxLength = 50, suffix = '...') => {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength - suffix.length) + suffix;
};

/**
 * Format name (capitalize first letter)
 */
export const formatName = (name) => {
  if (!name) return '';
  return name
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
};

/**
 * Format transaction type
 */
export const formatTransactionType = (type) => {
  const types = {
    transfer: 'Money Transfer',
    airtime: 'Airtime Purchase',
    data: 'Data Purchase',
    bills: 'Bill Payment',
    deposit: 'Deposit',
    withdrawal: 'Withdrawal',
    credit: 'Credit',
    debit: 'Debit',
    electricity: 'Electricity Bill',
    cable: 'Cable TV',
    internet: 'Internet',
  };
  
  return types[type] || formatName(type);
};

/**
 * Format transaction status
 */
export const formatTransactionStatus = (status) => {
  const statuses = {
    completed: 'Completed',
    pending: 'Pending',
    processing: 'Processing',
    failed: 'Failed',
    cancelled: 'Cancelled',
    reversed: 'Reversed',
  };
  
  return statuses[status] || formatName(status);
};

/**
 * Get transaction status color
 */
export const getStatusColor = (status) => {
  const colors = {
    completed: '#4caf50',
    success: '#4caf50',
    pending: '#ff9800',
    processing: '#2196f3',
    failed: '#f44336',
    cancelled: '#757575',
    reversed: '#9c27b0',
  };
  
  return colors[status] || '#757575';
};

/**
 * Format BVN (masked)
 */
export const formatBVN = (bvn, mask = true) => {
  if (!bvn) return '';
  
  const cleaned = bvn.toString().replace(/\D/g, '');
  
  if (mask && cleaned.length >= 11) {
    // Show first 3 and last 3 digits
    return `${cleaned.slice(0, 3)}*****${cleaned.slice(-3)}`;
  }
  
  return cleaned;
};

/**
 * Format duration
 */
export const formatDuration = (seconds) => {
  if (!seconds || seconds < 0) return '0s';
  
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;
  
  const parts = [];
  if (hours > 0) parts.push(`${hours}h`);
  if (minutes > 0) parts.push(`${minutes}m`);
  if (secs > 0 || parts.length === 0) parts.push(`${secs}s`);
  
  return parts.join(' ');
};

/**
 * Parse amount string to number
 */
export const parseAmount = (amountString) => {
  if (!amountString) return 0;
  
  // Remove currency symbols and commas
  const cleaned = amountString.toString().replace(/[₦,$]/g, '').trim();
  const parsed = parseFloat(cleaned);
  
  return isNaN(parsed) ? 0 : parsed;
};

/**
 * Validate amount format
 */
export const isValidAmount = (amount) => {
  if (!amount) return false;
  const parsed = parseAmount(amount);
  return parsed > 0 && parsed <= 999999999;
};

/**
 * Format error message
 */
export const formatErrorMessage = (error) => {
  if (!error) return 'An error occurred';
  
  if (typeof error === 'string') return error;
  
  if (error.message) return error.message;
  
  if (error.errors) {
    const firstError = Object.values(error.errors)[0];
    if (Array.isArray(firstError)) return firstError[0];
    return firstError;
  }
  
  return 'An error occurred';
};

export default {
  formatCurrency,
  formatAccountNumber,
  formatPhoneNumber,
  formatCardNumber,
  formatDate,
  formatDateTime,
  formatRelativeTime,
  formatReference,
  formatPercentage,
  formatFileSize,
  truncateText,
  formatName,
  formatTransactionType,
  formatTransactionStatus,
  getStatusColor,
  formatBVN,
  formatDuration,
  parseAmount,
  isValidAmount,
  formatErrorMessage,
};