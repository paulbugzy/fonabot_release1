import * as Joi from 'joi';

export const configValidationSchema = Joi.object({
  NODE_ENV: Joi.string().valid('development', 'production', 'test').default('development'),
  PORT: Joi.number().default(3000), // Assuming PORT is needed

  DATABASE_HOST: Joi.string().required(),
  DATABASE_PORT: Joi.number().default(5432),
  DATABASE_USERNAME: Joi.string().required(),
  DATABASE_PASSWORD: Joi.string().required(),
  DATABASE_NAME: Joi.string().required(),
  DATABASE_SSL: Joi.boolean().default(false), // Added based on your .env example

  JWT_SECRET: Joi.string().required(),
  JWT_EXPIRES_IN: Joi.string().default('7d'), // Added based on .env

  REDIS_HOST: Joi.string().optional().allow(''), // Make optional if Redis isn't strictly required
  REDIS_PORT: Joi.number().default(6379),
  REDIS_PASSWORD: Joi.string().optional().allow(null, ''), // Make optional/allow empty
  REDIS_DB: Joi.number().default(0),

  MASTER_ENCRYPTION_KEY: Joi.string().required().length(64),

  ALLOWED_ORIGINS: Joi.string().optional().allow(''), // Example from .env
  RATE_LIMIT_WINDOW_MS: Joi.number().default(900000),
  RATE_LIMIT_MAX_REQUESTS: Joi.number().default(100),
  LOG_LEVEL: Joi.string().valid('debug', 'info', 'warn', 'error').default('info'), // Example from .env
  // Add other needed vars from your .env
});
 