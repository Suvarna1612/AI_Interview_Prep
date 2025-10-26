// API Configuration
export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// File Upload Configuration
export const FILE_UPLOAD = {
  MAX_SIZE: 2 * 1024 * 1024, // 2MB
  ACCEPTED_TYPES: {
    'application/pdf': ['.pdf']
  },
  TYPES: {
    RESUME: 'resume',
    JOB_DESCRIPTION: 'job_description'
  }
};

// Chat Configuration
export const CHAT = {
  MAX_MESSAGE_LENGTH: 5000,
  TYPING_INDICATOR_DELAY: 1000,
  AUTO_SCROLL_DELAY: 100
};

// UI Configuration
export const UI = {
  MOBILE_BREAKPOINT: 640,
  TABLET_BREAKPOINT: 768,
  DESKTOP_BREAKPOINT: 1024,
  TOAST_DURATION: 4000
};

// Error Messages
export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Network error. Please check your connection and try again.',
  UNAUTHORIZED: 'Your session has expired. Please log in again.',
  FILE_TOO_LARGE: 'File size must be less than 2MB.',
  INVALID_FILE_TYPE: 'Only PDF files are allowed.',
  UPLOAD_FAILED: 'File upload failed. Please try again.',
  CHAT_INIT_FAILED: 'Failed to initialize chat. Please ensure you have uploaded both resume and job description.',
  GENERIC_ERROR: 'Something went wrong. Please try again.'
};

// Success Messages
export const SUCCESS_MESSAGES = {
  FILE_UPLOADED: 'File uploaded successfully!',
  ACCOUNT_CREATED: 'Account created successfully!',
  LOGIN_SUCCESS: 'Welcome back!',
  LOGOUT_SUCCESS: 'Logged out successfully.'
};

// Document Types
export const DOCUMENT_TYPES = {
  RESUME: {
    key: 'resume',
    label: 'Resume',
    description: 'Upload your resume'
  },
  JOB_DESCRIPTION: {
    key: 'job_description',
    label: 'Job Description',
    description: 'Upload the job description'
  }
};

// Interview Score Ranges
export const SCORE_RANGES = {
  EXCELLENT: { min: 8, max: 10, color: 'green', label: 'Excellent' },
  GOOD: { min: 6, max: 7, color: 'yellow', label: 'Good' },
  NEEDS_IMPROVEMENT: { min: 1, max: 5, color: 'red', label: 'Needs Improvement' }
};