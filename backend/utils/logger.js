/**
 * @module logger
 * @description Production-grade Winston logger for $10k+ luxury MERN marketplace
 * @author Senior Backend Architect
 * @version 3.0.0
 * @since 2024
 */

import winston from 'winston';
import DailyRotateFile from 'winston-daily-rotate-file';
import 'winston-daily-rotate-file'; // Side-effect import

/**
 * @typedef {Object} LogMetadata
 * @property {string} [correlationId] - Request tracing ID
 * @property {string} [userId] - User identifier
 * @property {string} [endpoint] - API endpoint
 * @property {number} [processingTime] - Request duration (ms)
 * @property {Object} [data] - Additional context
 */

/**
 * Custom format to mask sensitive data (Security Critical)
 */
const maskSensitiveData = winston.format((info) => {
  if (typeof info.message === 'string') {
    // Mask passwords, tokens, credit cards, API keys
    info.message = info.message
      .replace(/password[:=]\s*[^&\s]*/gi, 'password=[MASKED]')
      .replace(/token[:=]\s*[^&\s&]*/gi, 'token=[MASKED]')
      .replace(/api[-_]?key[:=]\s*[^&\s&]*/gi, 'api_key=[MASKED]')
      .replace(/secret[:=]\s*[^&\s&]*/gi, 'secret=[MASKED]')
      // Credit card partial masking (first 6 + last 4)
      .replace(/\b(?:\d{4}[ -]?){3}\d{4}\b/g, '[CARD_MASKED]')
      // Mask full emails in production
      .replace(/\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g, '[EMAIL_MASKED]');
  }

  // Mask sensitive data in metadata
  if (info.meta && typeof info.meta === 'object') {
    Object.keys(info.meta).forEach(key => {
      if (['password', 'token', 'secret', 'apiKey', 'creditCard'].includes(key.toLowerCase())) {
        info.meta[key] = '[MASKED]';
      }
    });
  }

  return info;
});

/**
 * Request correlation ID format
 */
const correlationIdFormat = winston.format((info) => {
  const correlationId = info.correlationId || info.req?.id || 'N/A';
  info.message = `[${correlationId}] ${info.message}`;
  return info;
});

/**
 * Timestamp with timezone
 */
const timestampFormat = winston.format((info) => {
  info.timestamp = new Date().toISOString();
  return info;
});

/**
 * JSON formatting for structured logging
 */
const jsonFormat = winston.format((info) => {
  const { level, message, timestamp, correlationId, ...meta } = info;
  return {
    level,
    message,
    timestamp,
    correlationId: correlationId || 'N/A',
    ...(Object.keys(meta).length && { meta }),
  };
});

/**
 * Console color formatting (development)
 */
const consoleFormat = winston.format.combine(
  winston.format.colorize(),
  winston.format.simple()
);

/**
 * Singleton logger instance
 */
class Logger {
  constructor() {
    this.logger = winston.createLogger({
      level: process.env.LOG_LEVEL || 'info',
      format: winston.format.combine(
        timestampFormat(),
        maskSensitiveData(),
        correlationIdFormat(),
        jsonFormat()
      ),
      defaultMeta: { service: 'luxury-mern-marketplace' },
      transports: [
        // Error file with rotation (20MB max, 14 days)
        new DailyRotateFile({
          filename: 'logs/error-%DATE%.log',
          datePattern: 'YYYY-MM-DD',
          zippedArchive: true,
          maxSize: '20m',
          maxFiles: '14d',
          level: 'error',
          handleExceptions: true,
        }),

        // Combined logs (info+) with rotation
        new DailyRotateFile({
          filename: 'logs/combined-%DATE%.log',
          datePattern: 'YYYY-MM-DD',
          zippedArchive: true,
          maxSize: '20m',
          maxFiles: '14d',
          level: 'info',
          handleExceptions: true,
          handleRejections: true,
        }),
      ],
    });

    // Console transport for development
    if (process.env.NODE_ENV !== 'production') {
      this.logger.add(new winston.transports.Console({
        format: consoleFormat,
      }));
    }

    // Handle uncaught exceptions and rejections
    this.logger.exceptions.handle(
      new DailyRotateFile({
        filename: 'logs/exceptions-%DATE%.log',
        datePattern: 'YYYY-MM-DD',
      })
    );

    this.logger.rejections.handle(
      new DailyRotateFile({
        filename: 'logs/rejections-%DATE%.log',
        datePattern: 'YYYY-MM-DD',
      })
    );
  }

  /**
   * Log info level message
   * @param {string} message - Log message
   * @param {LogMetadata} [meta] - Additional context
   */
  info(message, meta = {}) {
    this.logger.info(message, { ...meta });
  }

  /**
   * Log http request
   * @param {Object} req - Express request object
   * @param {number} processingTime - Request duration in ms
   * @param {LogMetadata} [meta] - Additional context
   */
  http(req, processingTime, meta = {}) {
    this.logger.http(`HTTP ${req.method} ${req.originalUrl}`, {
      method: req.method,
      url: req.originalUrl,
      ip: req.ip || req.connection.remoteAddress,
      userAgent: req.get('User-Agent'),
      processingTime,
      statusCode: req.statusCode || 500,
      ...meta,
    });
  }

  /**
   * Log error with full stack trace
   * @param {string} message - Error message
   * @param {Error} [error] - Error object
   * @param {LogMetadata} [meta] - Additional context
   */
  error(message, error = null, meta = {}) {
    this.logger.error(message, {
      ...(error && { stack: error.stack }),
      ...meta,
    });
  }

  /**
   * Log warning
   * @param {string} message - Warning message
   * @param {LogMetadata} [meta] - Additional context
   */
  warn(message, meta = {}) {
    this.logger.warn(message, meta);
  }

  /**
   * Log debug information
   * @param {string} message - Debug message
   * @param {LogMetadata} [meta] - Additional context
   */
  debug(message, meta = {}) {
    this.logger.debug(message, meta);
  }

  /**
   * Generate correlation ID for request tracing
   * @returns {string} Unique request ID
   */
  generateCorrelationId() {
    return `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
}

/**
 * Global singleton instance
 */
const loggerInstance = new Logger();
export default loggerInstance;
