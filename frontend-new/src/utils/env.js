/**
 * Environment configuration and validation
 */

// Required environment variables
const requiredEnvVars = [
  'VITE_API_URL'
];

// Optional environment variables with defaults
const optionalEnvVars = {
  VITE_APP_NAME: 'AI Interview Prep',
  VITE_APP_VERSION: '1.0.0'
};

/**
 * Validate environment variables
 * @returns {object} Validation result
 */
export const validateEnv = () => {
  const missing = [];
  const warnings = [];

  // Check required variables
  requiredEnvVars.forEach(envVar => {
    if (!import.meta.env[envVar]) {
      missing.push(envVar);
    }
  });

  // Check for development-specific warnings
  if (import.meta.env.DEV) {
    if (!import.meta.env.VITE_API_URL) {
      warnings.push('VITE_API_URL not set, using default localhost:5000');
    }
  }

  return {
    isValid: missing.length === 0,
    missing,
    warnings
  };
};

/**
 * Get environment variable with fallback
 * @param {string} key - Environment variable key
 * @param {string} fallback - Fallback value
 * @returns {string} Environment variable value or fallback
 */
export const getEnvVar = (key, fallback = '') => {
  return import.meta.env[key] || fallback;
};

/**
 * Get all environment configuration
 * @returns {object} Environment configuration
 */
export const getEnvConfig = () => {
  return {
    API_URL: getEnvVar('VITE_API_URL', 'http://localhost:5000/api'),
    APP_NAME: getEnvVar('VITE_APP_NAME', optionalEnvVars.VITE_APP_NAME),
    APP_VERSION: getEnvVar('VITE_APP_VERSION', optionalEnvVars.VITE_APP_VERSION),
    IS_DEVELOPMENT: import.meta.env.DEV,
    IS_PRODUCTION: import.meta.env.PROD,
  };
};

// Validate environment on module load
const validation = validateEnv();

if (!validation.isValid) {
  console.error('Missing required environment variables:', validation.missing);
}

if (validation.warnings.length > 0) {
  console.warn('Environment warnings:', validation.warnings);
}

export default getEnvConfig();