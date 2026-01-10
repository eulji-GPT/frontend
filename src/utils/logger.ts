/**
 * Logger utility for development and production environments
 * - In production: Only errors are logged
 * - In development: All logs are shown
 */

const isDevelopment = import.meta.env.DEV;

export const logger = {
  /**
   * Log information (only in development)
   */
  info: (...args: any[]) => {
    if (isDevelopment) {
      console.log(...args);
    }
  },

  /**
   * Log warnings (only in development)
   */
  warn: (...args: any[]) => {
    if (isDevelopment) {
      console.warn(...args);
    }
  },

  /**
   * Log errors (always logged)
   */
  error: (...args: any[]) => {
    console.error(...args);
  },

  /**
   * Log debug information (only in development)
   */
  debug: (...args: any[]) => {
    if (isDevelopment) {
      console.debug(...args);
    }
  },
};

/**
 * Create a namespaced logger for specific modules
 */
export const createLogger = (namespace: string) => ({
  info: (...args: any[]) => logger.info(`[${namespace}]`, ...args),
  warn: (...args: any[]) => logger.warn(`[${namespace}]`, ...args),
  error: (...args: any[]) => logger.error(`[${namespace}]`, ...args),
  debug: (...args: any[]) => logger.debug(`[${namespace}]`, ...args),
});
