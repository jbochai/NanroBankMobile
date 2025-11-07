/**
 * Validation Utilities
 */

/**
 * Email validation
 */
export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email) {
    return { isValid: false, error: 'Email is required' };
  }
  if (!emailRegex.test(email)) {
    return { isValid: false, error: 'Please enter a valid email address' };
  }
  return { isValid: true, error: null };
};

/**
 * Phone number validation (Nigerian format)
 */
export const validatePhone = (phone) => {
  const phoneRegex = /^(\+234|0)[789]\d{9}$/;
  if (!phone) {
    return { isValid: false, error: 'Phone number is required' };
  }
  const cleanPhone = phone.replace(/\s+/g, '');
  if (!phoneRegex.test(cleanPhone)) {
    return { isValid: false, error: 'Please enter a valid Nigerian phone number' };
  }
  return { isValid: true, error: null };
};

/**
 * Password validation
 */
export const validatePassword = (password) => {
  if (!password) {
    return { isValid: false, error: 'Password is required' };
  }
  if (password.length < 8) {
    return { isValid: false, error: 'Password must be at least 8 characters long' };
  }
  if (!/[a-z]/.test(password)) {
    return { isValid: false, error: 'Password must contain at least one lowercase letter' };
  }
  if (!/[A-Z]/.test(password)) {
    return { isValid: false, error: 'Password must contain at least one uppercase letter' };
  }
  if (!/\d/.test(password)) {
    return { isValid: false, error: 'Password must contain at least one number' };
  }
  if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    return { isValid: false, error: 'Password must contain at least one special character' };
  }
  return { isValid: true, error: null };
};

/**
 * Confirm password validation
 */
export const validateConfirmPassword = (password, confirmPassword) => {
  if (!confirmPassword) {
    return { isValid: false, error: 'Please confirm your password' };
  }
  if (password !== confirmPassword) {
    return { isValid: false, error: 'Passwords do not match' };
  }
  return { isValid: true, error: null };
};

/**
 * Name validation
 */
export const validateName = (name, fieldName = 'Name') => {
  const nameRegex = /^[a-zA-Z\s-']+$/;
  if (!name) {
    return { isValid: false, error: `${fieldName} is required` };
  }
  if (name.length < 2) {
    return { isValid: false, error: `${fieldName} must be at least 2 characters long` };
  }
  if (name.length > 50) {
    return { isValid: false, error: `${fieldName} must not exceed 50 characters` };
  }
  if (!nameRegex.test(name)) {
    return { isValid: false, error: `${fieldName} contains invalid characters` };
  }
  return { isValid: true, error: null };
};

/**
 * Account number validation
 */
export const validateAccountNumber = (accountNumber) => {
  const accountRegex = /^\d{10}$/;
  if (!accountNumber) {
    return { isValid: false, error: 'Account number is required' };
  }
  if (!accountRegex.test(accountNumber)) {
    return { isValid: false, error: 'Account number must be 10 digits' };
  }
  return { isValid: true, error: null };
};

/**
 * Amount validation
 */
export const validateAmount = (amount, min = 100, max = 5000000) => {
  if (!amount) {
    return { isValid: false, error: 'Amount is required' };
  }
  const numAmount = parseFloat(amount);
  if (isNaN(numAmount)) {
    return { isValid: false, error: 'Please enter a valid amount' };
  }
  if (numAmount < min) {
    return { isValid: false, error: `Amount must be at least ₦${min.toLocaleString()}` };
  }
  if (numAmount > max) {
    return { isValid: false, error: `Amount must not exceed ₦${max.toLocaleString()}` };
  }
  return { isValid: true, error: null };
};

/**
 * PIN validation (4-6 digits)
 */
export const validatePin = (pin, length = 4) => {
  const pinRegex = new RegExp(`^\\d{${length}}$`);
  if (!pin) {
    return { isValid: false, error: 'PIN is required' };
  }
  if (!pinRegex.test(pin)) {
    return { isValid: false, error: `PIN must be ${length} digits` };
  }
  // Check for sequential numbers
  const sequential = /^(0123|1234|2345|3456|4567|5678|6789|9876|8765|7654|6543|5432|4321|3210)/.test(pin);
  if (sequential) {
    return { isValid: false, error: 'PIN cannot be sequential numbers' };
  }
  // Check for repeated digits
  const repeated = /^(\d)\1+$/.test(pin);
  if (repeated) {
    return { isValid: false, error: 'PIN cannot be all the same digit' };
  }
  return { isValid: true, error: null };
};

/**
 * BVN validation
 */
export const validateBVN = (bvn) => {
  const bvnRegex = /^\d{11}$/;
  if (!bvn) {
    return { isValid: false, error: 'BVN is required' };
  }
  if (!bvnRegex.test(bvn)) {
    return { isValid: false, error: 'BVN must be 11 digits' };
  }
  return { isValid: true, error: null };
};

/**
 * NIN validation
 */
export const validateNIN = (nin) => {
  const ninRegex = /^\d{11}$/;
  if (!nin) {
    return { isValid: false, error: 'NIN is required' };
  }
  if (!ninRegex.test(nin)) {
    return { isValid: false, error: 'NIN must be 11 digits' };
  }
  return { isValid: true, error: null };
};

/**
 * Date validation
 */
export const validateDate = (date, fieldName = 'Date') => {
  if (!date) {
    return { isValid: false, error: `${fieldName} is required` };
  }
  const dateObj = new Date(date);
  if (isNaN(dateObj.getTime())) {
    return { isValid: false, error: `Please enter a valid ${fieldName.toLowerCase()}` };
  }
  return { isValid: true, error: null };
};

/**
 * Date of birth validation (must be 18+)
 */
export const validateDateOfBirth = (dob) => {
  const result = validateDate(dob, 'Date of birth');
  if (!result.isValid) return result;

  const today = new Date();
  const birthDate = new Date(dob);
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }

  if (age < 18) {
    return { isValid: false, error: 'You must be at least 18 years old' };
  }
  
  if (age > 120) {
    return { isValid: false, error: 'Please enter a valid date of birth' };
  }

  return { isValid: true, error: null };
};

/**
 * Required field validation
 */
export const validateRequired = (value, fieldName = 'This field') => {
  if (!value || (typeof value === 'string' && value.trim() === '')) {
    return { isValid: false, error: `${fieldName} is required` };
  }
  return { isValid: true, error: null };
};

/**
 * Narration/Description validation
 */
export const validateNarration = (narration, minLength = 3, maxLength = 100) => {
  if (!narration) {
    return { isValid: true, error: null }; // Optional field
  }
  if (narration.length < minLength) {
    return { isValid: false, error: `Narration must be at least ${minLength} characters` };
  }
  if (narration.length > maxLength) {
    return { isValid: false, error: `Narration must not exceed ${maxLength} characters` };
  }
  return { isValid: true, error: null };
};

/**
 * Sanitize input
 */
export const sanitizeInput = (input) => {
  if (typeof input !== 'string') return input;
  return input
    .trim()
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/[<>]/g, '');
};

/**
 * Validate form (multiple fields)
 */
export const validateForm = (fields) => {
  const errors = {};
  let isValid = true;

  Object.keys(fields).forEach((key) => {
    const field = fields[key];
    if (field.validator) {
      const result = field.validator(field.value);
      if (!result.isValid) {
        errors[key] = result.error;
        isValid = false;
      }
    }
  });

  return { isValid, errors };
};

/**
 * Validate meter number (for electricity bills)
 */
export const validateMeterNumber = (meterNumber) => {
  const meterRegex = /^\d{11,13}$/;
  if (!meterNumber) {
    return { isValid: false, error: 'Meter number is required' };
  }
  if (!meterRegex.test(meterNumber)) {
    return { isValid: false, error: 'Meter number must be 11-13 digits' };
  }
  return { isValid: true, error: null };
};

/**
 * Validate smart card number (for TV subscriptions)
 */
export const validateSmartCardNumber = (cardNumber) => {
  const cardRegex = /^\d{10,13}$/;
  if (!cardNumber) {
    return { isValid: false, error: 'Smart card number is required' };
  }
  if (!cardRegex.test(cardNumber)) {
    return { isValid: false, error: 'Smart card number must be 10-13 digits' };
  }
  return { isValid: true, error: null };
};