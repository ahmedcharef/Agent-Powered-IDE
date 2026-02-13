import { PrismaClient } from '@prisma/client';
import { env } from './env';

/**
 * Global type augmentation for Prisma Client singleton
 * This prevents multiple instances in development due to hot reloading
 */
declare global {
  var prisma: PrismaClient | undefined;
}

/**
 * Create Prisma Client with environment-specific configuration
 * 
 * Configuration includes:
 * - Query logging (development only)
 * - Error formatting (pretty in development, minimal in production)
 * - Connection pooling based on environment
 */
const createPrismaClient = () => {
  const isDevelopment = env.NODE_ENV === 'development';

  return new PrismaClient({
    log: isDevelopment
      ? [
          { level: 'query', emit: 'event' },
          { level: 'error', emit: 'stdout' },
          { level: 'warn', emit: 'stdout' },
        ]
      : [{ level: 'error', emit: 'stdout' }],
    errorFormat: isDevelopment ? 'pretty' : 'minimal',
  });
};

/**
 * Prisma Client singleton instance
 * 
 * In development:
 * - Uses global variable to prevent multiple instances during hot reload
 * - Enables query logging for debugging
 * - Uses pretty error formatting
 * 
 * In production:
 * - Creates single instance
 * - Minimal logging (errors only)
 * - Compact error formatting
 * 
 * Connection pooling is configured via DATABASE_POOL_SIZE environment variable
 * and managed automatically by Prisma.
 */
export const db = global.prisma ?? createPrismaClient();

// Store instance globally in development to prevent multiple instances
if (env.NODE_ENV === 'development') {
  global.prisma = db;

  // Enable query logging in development
  db.$on('query' as never, (e: unknown) => {
    const event = e as { query: string; params: string; duration: number };
    console.log('Query:', event.query);
    console.log('Params:', event.params);
    console.log('Duration:', event.duration, 'ms');
  });
}

/**
 * Graceful shutdown handler
 * Ensures all database connections are properly closed before process exit
 */
const gracefulShutdown = async (signal: string) => {
  console.log(`\n${signal} received. Closing database connections...`);
  
  try {
    await db.$disconnect();
    console.log('Database connections closed successfully');
    process.exit(0);
  } catch (error) {
    console.error('Error closing database connections:', error);
    process.exit(1);
  }
};

// Register shutdown handlers for graceful cleanup
process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));

// Re-export PrismaClient type for use in other modules
export type { PrismaClient } from '@prisma/client';
