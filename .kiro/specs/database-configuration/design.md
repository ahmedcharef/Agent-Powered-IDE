# Design Document: Database Configuration

## Overview

This design document describes the implementation approach for configuring and managing PostgreSQL database connections using Supabase and Prisma ORM. The solution provides a robust, secure, and performant database layer for the E-Commerce SaaS Platform.

## Architecture

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    Application Layer                         │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │   API Routes │  │ Server Actions│  │  tRPC Routes │      │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘      │
│         │                  │                  │              │
│         └──────────────────┼──────────────────┘              │
│                            │                                 │
└────────────────────────────┼─────────────────────────────────┘
                             ↓
┌─────────────────────────────────────────────────────────────┐
│                  Database Client Layer                       │
│  ┌──────────────────────────────────────────────────────┐   │
│  │           Prisma Client Singleton                    │   │
│  │  - Connection pooling                                │   │
│  │  - Type-safe queries                                 │   │
│  │  - Transaction management                            │   │
│  └──────────────────────────────────────────────────────┘   │
└────────────────────────────┼─────────────────────────────────┘
                             ↓
┌─────────────────────────────────────────────────────────────┐
│                  Connection Layer                            │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │ Direct Conn  │  │ Pooled Conn  │  │  SSL/TLS     │      │
│  │ (Dev)        │  │ (Production) │  │  Encryption  │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
└────────────────────────────┼─────────────────────────────────┘
                             ↓
┌─────────────────────────────────────────────────────────────┐
│              Supabase PostgreSQL Database                    │
│  - PostgreSQL 15+                                            │
│  - Connection pooler (PgBouncer)                             │
│  - SSL/TLS enabled                                           │
└─────────────────────────────────────────────────────────────┘
```

## Components and Interfaces

### 1. Prisma Client Singleton (`src/lib/db.ts`)

**Purpose:** Provide a single, reusable Prisma Client instance across the application.

**Interface:**
```typescript
// Export singleton instance
export const db: PrismaClient;

// Type exports
export type { PrismaClient } from '@prisma/client';
```

**Implementation Details:**
- Uses global variable to prevent multiple instances in development (hot reload)
- Configures connection pooling based on environment
- Enables query logging in development mode
- Handles graceful shutdown

### 2. Connection Test Utility (`src/lib/test-db-connection.ts`)

**Purpose:** Verify database connectivity and provide diagnostic information.

**Interface:**
```typescript
export async function testDatabaseConnection(): Promise<{
  success: boolean;
  message: string;
  details?: {
    database: string;
    latency: number;
    timestamp: Date;
  };
  error?: string;
}>;
```

**Implementation Details:**
- Attempts simple query (`SELECT 1`)
- Measures connection latency
- Returns structured result with diagnostics
- Handles timeout (5 seconds)

### 3. Environment Configuration (`src/lib/env.ts`)

**Purpose:** Validate and provide type-safe access to environment variables.

**Interface:**
```typescript
export const env = {
  DATABASE_URL: string;
  NODE_ENV: 'development' | 'production' | 'test';
  DATABASE_POOL_SIZE?: number;
  DATABASE_TIMEOUT?: number;
};
```

**Implementation Details:**
- Uses Zod for validation
- Throws descriptive errors for missing variables
- Provides defaults for optional values
- Type-safe access throughout application

### 4. Setup Documentation (`docs/DATABASE_SETUP.md`)

**Purpose:** Guide developers through database configuration process.

**Contents:**
- Supabase account creation
- Project setup steps
- Connection string retrieval
- Environment variable configuration
- Connection testing instructions
- Troubleshooting guide

## Data Models

### Environment Variables Schema

```typescript
import { z } from 'zod';

const envSchema = z.object({
  DATABASE_URL: z.string().url().startsWith('postgresql://'),
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  DATABASE_POOL_SIZE: z.coerce.number().min(1).max(100).optional(),
  DATABASE_TIMEOUT: z.coerce.number().min(1000).max(30000).optional(),
});
```

### Connection Configuration

```typescript
interface PrismaClientOptions {
  datasources: {
    db: {
      url: string;
    };
  };
  log: LogLevel[];
  errorFormat: 'pretty' | 'minimal';
}
```

## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system—essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*

### Property 1: Singleton Instance Consistency

*For any* sequence of database client imports across different modules, the same Prisma Client instance should be returned, ensuring connection pooling efficiency and preventing connection exhaustion.

**Validates: Requirements 3.1, 3.4**

### Property 2: Connection String Validation

*For any* DATABASE_URL value, if it does not match the PostgreSQL connection string format, the system should throw a validation error before attempting connection.

**Validates: Requirements 2.4**

### Property 3: Environment Variable Requirement

*For any* application startup, if the DATABASE_URL environment variable is not set, the system should throw a descriptive error and prevent application initialization.

**Validates: Requirements 2.1, 2.3**

### Property 4: Connection Test Timeout

*For any* connection test execution, if the database does not respond within 5 seconds, the test should timeout and return a failure result with timeout information.

**Validates: Requirements 4.5**

### Property 5: SSL Connection Enforcement

*For any* production environment connection, the connection string should include SSL mode parameters and the system should enforce encrypted connections.

**Validates: Requirements 6.1, 6.2, 6.3**

### Property 6: Connection Pool Reuse

*For any* two sequential database queries in the same process, they should reuse the same connection pool rather than creating new connections.

**Validates: Requirements 3.4, 8.1**

### Property 7: Error Message Clarity

*For any* connection failure, the error message should not contain sensitive credentials (password, API keys) while still providing diagnostic information.

**Validates: Requirements 6.4, 7.1, 7.2**

### Property 8: Graceful Shutdown

*For any* application shutdown signal, the database client should close all active connections before the process exits.

**Validates: Requirements 3.5**

## Error Handling

### Error Categories

1. **Configuration Errors**
   - Missing DATABASE_URL
   - Invalid connection string format
   - Missing required environment variables

2. **Connection Errors**
   - Network unreachable
   - Authentication failure
   - SSL/TLS handshake failure
   - Connection timeout

3. **Runtime Errors**
   - Connection pool exhausted
   - Query timeout
   - Transaction deadlock

### Error Handling Strategy

```typescript
class DatabaseConfigurationError extends Error {
  constructor(
    message: string,
    public code: string,
    public details?: Record<string, unknown>
  ) {
    super(message);
    this.name = 'DatabaseConfigurationError';
  }
}

// Usage
if (!process.env.DATABASE_URL) {
  throw new DatabaseConfigurationError(
    'DATABASE_URL environment variable is not set',
    'MISSING_DATABASE_URL',
    {
      hint: 'Add DATABASE_URL to your .env file',
      example: 'postgresql://user:password@host:5432/database'
    }
  );
}
```

## Testing Strategy

### Unit Tests

1. **Environment Validation Tests**
   - Test missing DATABASE_URL throws error
   - Test invalid URL format throws error
   - Test valid URL passes validation
   - Test optional variables use defaults

2. **Singleton Pattern Tests**
   - Test multiple imports return same instance
   - Test instance is created only once
   - Test global variable cleanup in tests

3. **Connection Test Utility Tests**
   - Test successful connection returns success
   - Test failed connection returns error
   - Test timeout after 5 seconds
   - Test error messages don't contain credentials

### Integration Tests

1. **Database Connection Tests**
   - Test connection to real database
   - Test query execution
   - Test transaction handling
   - Test connection pool behavior

2. **Error Scenario Tests**
   - Test with invalid credentials
   - Test with unreachable host
   - Test with malformed connection string

### Property-Based Tests

Each correctness property should be implemented as a property-based test with minimum 100 iterations:

1. **Property 1 Test**: Generate multiple import sequences, verify same instance
2. **Property 2 Test**: Generate various invalid URLs, verify validation catches them
3. **Property 3 Test**: Test startup with missing env vars
4. **Property 4 Test**: Test connection with delayed responses
5. **Property 5 Test**: Verify SSL parameters in production configs
6. **Property 6 Test**: Execute multiple queries, verify connection reuse
7. **Property 7 Test**: Generate various errors, verify no credential leakage
8. **Property 8 Test**: Test shutdown scenarios, verify cleanup

### Test Configuration

```typescript
// vitest.config.ts
export default defineConfig({
  test: {
    environment: 'node',
    globals: true,
    setupFiles: ['./vitest.setup.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: ['node_modules/', 'dist/'],
    },
  },
});
```

## Implementation Plan

### Phase 1: Core Setup
1. Create Prisma Client singleton (`src/lib/db.ts`)
2. Create environment validation (`src/lib/env.ts`)
3. Update `.env.example` with database variables
4. Add `.env` to `.gitignore` (if not already present)

### Phase 2: Testing Utilities
1. Create connection test utility (`src/lib/test-db-connection.ts`)
2. Create test script in `package.json`
3. Add connection health check endpoint

### Phase 3: Documentation
1. Create `docs/DATABASE_SETUP.md`
2. Document Supabase setup process
3. Add troubleshooting guide
4. Include connection string examples

### Phase 4: Testing
1. Write unit tests for environment validation
2. Write unit tests for singleton pattern
3. Write integration tests for connection
4. Write property-based tests for correctness properties

### Phase 5: Configuration
1. Configure connection pooling for production
2. Set up SSL/TLS parameters
3. Configure query logging
4. Add performance monitoring

## Configuration Examples

### Development Configuration

```env
# .env (development)
DATABASE_URL="postgresql://postgres:password@localhost:5432/ecommerce_dev"
NODE_ENV="development"
DATABASE_POOL_SIZE=5
DATABASE_TIMEOUT=5000
```

### Production Configuration (Supabase)

```env
# .env (production)
DATABASE_URL="postgresql://postgres.[project-ref]:[password]@aws-0-[region].pooler.supabase.com:6543/postgres?pgbouncer=true&connection_limit=1"
NODE_ENV="production"
DATABASE_POOL_SIZE=10
DATABASE_TIMEOUT=10000
```

### Connection String Formats

**Direct Connection (Development):**
```
postgresql://[user]:[password]@[host]:[port]/[database]
```

**Pooled Connection (Production):**
```
postgresql://[user]:[password]@[host]:6543/[database]?pgbouncer=true&connection_limit=1
```

## Security Considerations

1. **Credential Management**
   - Never commit `.env` files
   - Use environment variables in CI/CD
   - Rotate credentials regularly
   - Use least-privilege database users

2. **Connection Security**
   - Enforce SSL/TLS in production
   - Verify SSL certificates
   - Use connection pooling to prevent exhaustion
   - Set connection timeouts

3. **Error Handling**
   - Sanitize error messages
   - Log errors securely
   - Don't expose database structure
   - Rate limit connection attempts

## Performance Optimization

1. **Connection Pooling**
   - Use appropriate pool size (10-20 for production)
   - Configure connection timeout
   - Set statement timeout
   - Monitor pool utilization

2. **Query Optimization**
   - Enable query logging in development
   - Use prepared statements (Prisma default)
   - Implement query result caching
   - Monitor slow queries

3. **Resource Management**
   - Close connections on shutdown
   - Implement connection retry logic
   - Use connection pooler (PgBouncer) for serverless
   - Monitor connection count

## Monitoring and Observability

1. **Metrics to Track**
   - Connection pool size
   - Active connections
   - Query latency
   - Error rate
   - Connection failures

2. **Logging Strategy**
   - Log connection establishment (development)
   - Log connection errors (all environments)
   - Log slow queries (>1s)
   - Log pool exhaustion events

3. **Health Checks**
   - Implement `/api/health/db` endpoint
   - Test connection on startup
   - Periodic connection validation
   - Alert on connection failures
