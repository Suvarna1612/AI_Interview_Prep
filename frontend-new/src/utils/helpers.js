import { SCORE_RANGES, UI } from './constants';

/**
 * Format file size in human readable format
 * @param {number} bytes - File size in bytes
 * @returns {string} Formatted file size
 */
export const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
};

/**
 * Format date in user-friendly format
 * @param {string|Date} dateString - Date to format
 * @returns {string} Formatted date
 */
export const formatDate = (dateString) => {
  const date = new Date(dateString);
  
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

/**
 * Format time in HH:MM format
 * @param {string|Date} timestamp - Timestamp to format
 * @returns {string} Formatted time
 */
export const formatTime = (timestamp) => {
  return new Date(timestamp).toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit'
  });
};

/**
 * Get score color and label based on score value
 * @param {number} score - Score value (1-10)
 * @returns {object} Score styling information
 */
export const getScoreInfo = (score) => {
  if (score >= SCORE_RANGES.EXCELLENT.min) {
    return {
      color: `text-${SCORE_RANGES.EXCELLENT.color}-600 bg-${SCORE_RANGES.EXCELLENT.color}-100`,
      label: SCORE_RANGES.EXCELLENT.label
    };
  }
  
  if (score >= SCORE_RANGES.GOOD.min) {
    return {
      color: `text-${SCORE_RANGES.GOOD.color}-600 bg-${SCORE_RANGES.GOOD.color}-100`,
      label: SCORE_RANGES.GOOD.label
    };
  }
  
  return {
    color: `text-${SCORE_RANGES.NEEDS_IMPROVEMENT.color}-600 bg-${SCORE_RANGES.NEEDS_IMPROVEMENT.color}-100`,
    label: SCORE_RANGES.NEEDS_IMPROVEMENT.label
  };
};

/**
 * Debounce function to limit function calls
 * @param {Function} func - Function to debounce
 * @param {number} wait - Wait time in milliseconds
 * @returns {Function} Debounced function
 */
export const debounce = (func, wait) => {
  let timeout;
  
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

/**
 * Check if device is mobile based on screen width
 * @returns {boolean} True if mobile device
 */
export const isMobile = () => {
  return window.innerWidth <= UI.MOBILE_BREAKPOINT;
};

/**
 * Scroll element into view smoothly
 * @param {HTMLElement} element - Element to scroll to
 * @param {object} options - Scroll options
 */
export const scrollToElement = (element, options = {}) => {
  if (element) {
    element.scrollIntoView({
      behavior: 'smooth',
      block: 'end',
      ...options
    });
  }
};

/**
 * Validate email format
 * @param {string} email - Email to validate
 * @returns {boolean} True if valid email
 */
export const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Validate password strength
 * @param {string} password - Password to validate
 * @returns {object} Validation result with isValid and message
 */
export const validatePassword = (password) => {
  if (password.length < 6) {
    return {
      isValid: false,
      message: 'Password must be at least 6 characters long'
    };
  }
  
  return {
    isValid: true,
    message: 'Password is valid'
  };
};

/**
 * Truncate text to specified length
 * @param {string} text - Text to truncate
 * @param {number} maxLength - Maximum length
 * @returns {string} Truncated text
 */
export const truncateText = (text, maxLength = 100) => {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};