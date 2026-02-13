import { z } from 'zod';

/**
 * Environment variables schema for database configuration
 * 
 * This schema validates all required and optional environment variables
 * needed for database connectivity and configuration.
 */
const envSchema = z.object({
  /**
   * PostgreSQL connection string
   * Must start with 'postgresql://' or 'postgres://'
   * Format: postgresql://user:password@host:port/database
   */
  DATABASE_URL: z
    .string('DATABASE_URL environment variable is required')
    .url('DATABASE_URL must be a valid URL')
    .refine(
      (url) => url.startsWith('postgresql://') || url.startsWith('postgres://'),
      {
        message: 'DATABASE_URL must start with postgresql:// or postgres://',
      }
    ),

  /**
   * Node environment
   * Determines logging, error formatting, and connection pooling behavior
   */
  NODE_ENV: z
    .enum(['development', 'production', 'test'])
    .default('development'),

  /**
   * Database connection pool size
   * Optional: defaults to 5 for development, 10 for production
   * Range: 1-100 connections
   */
  DATABASE_POOL_SIZE: z
    .string()
    .optional()
    .transform((val) => (val ? parseInt(val, 10) : undefined))
    .pipe(
      z
        .number()
        .min(1, 'DATABASE_POOL_SIZE must be at least 1')
        .max(100, 'DATABASE_POOL_SIZE must not exceed 100')
        .optional()
    ),

  /**
   * Database connection timeout in milliseconds
   * Optional: defaults to 5000ms (5 seconds)
   * Range: 1000ms (1s) to 30000ms (30s)
   */
  DATABASE_TIMEOUT: z
    .string()
    .optional()
    .transform((val) => (val ? parseInt(val, 10) : undefined))
    .pipe(
      z
        .number()
        .min(1000, 'DATABASE_TIMEOUT must be at least 1000ms (1 second)')
        .max(30000, 'DATABASE_TIMEOUT must not exceed 30000ms (30 seconds)')
        .optional()
    ),
});

/**
 * Validated environment variables
 * 
 * This object provides type-safe access to environment variables
 * throughout the application. All values are validated at startup.
 * 
 * @throws {z.ZodError} If environment variables are invalid or missing
 */
export const env = (() => {
  try {
    const parsed = envSchema.parse({
      DATABASE_URL: process.env.DATABASE_URL,
      NODE_ENV: process.env.NODE_ENV,
      DATABASE_POOL_SIZE: process.env.DATABASE_POOL_SIZE,
      DATABASE_TIMEOUT: process.env.DATABASE_TIMEOUT,
    });

    return {
      ...parsed,
      // Provide sensible defaults based on environment
      DATABASE_POOL_SIZE:
        parsed.DATABASE_POOL_SIZE ??
        (parsed.NODE_ENV === 'production' ? 10 : 5),
      DATABASE_TIMEOUT: parsed.DATABASE_TIMEOUT ?? 5000,
    };
  } catch (error) {
    if (error instanceof z.ZodError) {
      // Format validation errors for better readability
      const formattedErrors = error.issues
        .map((err: z.ZodIssue) => {
          const path = err.path.join('.');
          return `  - ${path}: ${err.message}`;
        })
        .join('\n');

      throw new Error(
        `Environment variable validation failed:\n${formattedErrors}\n\n` +
          `Please check your .env file and ensure all required variables are set correctly.\n` +
          `Example DATABASE_URL: postgresql://user:password@host:5432/database`
      );
    }
    throw error;
  }
})();

/**
 * Type definition for validated environment variables
 */
export type Env = typeof env;
