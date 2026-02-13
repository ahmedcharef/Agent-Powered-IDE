# Implementation Plan: Database Configuration

## Overview

This implementation plan breaks down the database configuration feature into discrete, actionable tasks. Each task builds on previous work and includes specific requirements references.

## Tasks

- [x] 1. Create environment validation module
  - Create `src/lib/env.ts` with Zod schema for environment variables
  - Validate DATABASE_URL format (must start with postgresql://)
  - Validate NODE_ENV enum (development, production, test)
  - Add optional DATABASE_POOL_SIZE and DATABASE_TIMEOUT with defaults
  - Export type-safe env object
  - _Requirements: 2.1, 2.3, 2.4, 2.5_

- [ ]* 1.1 Write property test for environment validation
  - **Property 2: Connection String Validation**
  - **Validates: Requirements 2.4**
  - Generate various invalid DATABASE_URL formats
  - Verify validation catches all invalid formats
  - Test that valid PostgreSQL URLs pass validation

- [ ]* 1.2 Write unit tests for environment validation
  - Test missing DATABASE_URL throws descriptive error
  - Test invalid URL format throws validation error
  - Test valid URL passes validation
  - Test optional variables use correct defaults
  - Test NODE_ENV validation with invalid values
  - _Requirements: 2.3, 2.4_

- [x] 2. Create Prisma Client singleton
  - Create `src/lib/db.ts` with singleton pattern
  - Use global variable to prevent multiple instances in development
  - Configure connection pooling based on NODE_ENV
  - Enable query logging in development mode only
  - Add proper TypeScript types
  - Export db instance and PrismaClient type
  - _Requirements: 3.1, 3.2, 3.4, 8.4_

- [ ]* 2.1 Write property test for singleton pattern
  - **Property 1: Singleton Instance Consistency**
  - **Validates: Requirements 3.1, 3.4**
  - Import db client from multiple modules
  - Verify all imports return the same instance
  - Test in both development and production modes

- [ ]* 2.2 Write unit tests for database client
  - Test singleton returns same instance across imports
  - Test global variable is used in development
  - Test query logging enabled only in development
  - Test connection pool configuration
  - _Requirements: 3.1, 3.4, 8.4_

- [ ] 3. Create connection test utility
  - Create `src/lib/test-db-connection.ts`
  - Implement testDatabaseConnection function
  - Execute simple query (SELECT 1) to verify connection
  - Measure connection latency
  - Return structured result with success/error details
  - Implement 5-second timeout
  - Handle and format connection errors
  - _Requirements: 4.1, 4.2, 4.3, 4.4, 4.5_

- [ ]* 3.1 Write property test for connection timeout
  - **Property 4: Connection Test Timeout**
  - **Validates: Requirements 4.5**
  - Test with delayed database responses
  - Verify timeout occurs at 5 seconds
  - Verify timeout error message is clear

- [ ]* 3.2 Write unit tests for connection test utility
  - Test successful connection returns success result
  - Test failed connection returns error result
  - Test timeout after 5 seconds
  - Test error messages don't contain credentials
  - Test latency measurement accuracy
  - _Requirements: 4.1, 4.2, 4.3, 4.4, 4.5, 6.4_

- [ ] 4. Update environment configuration files
  - Update `.env.example` with DATABASE_URL and related variables
  - Add comments explaining each variable
  - Include examples for both direct and pooled connections
  - Add Supabase-specific connection string format
  - Verify `.env` is in `.gitignore`
  - _Requirements: 2.1, 2.5_

- [ ] 5. Create database setup documentation
  - Create `docs/DATABASE_SETUP.md`
  - Document Supabase account creation process
  - Explain how to create a new Supabase project
  - Show how to retrieve connection string from Supabase dashboard
  - Document both direct and pooled connection options
  - Include connection string format examples
  - Add troubleshooting section for common issues
  - Document how to run connection test
  - _Requirements: 5.1, 5.2, 5.3, 5.4, 5.5_

- [ ] 6. Add connection test script
  - Create `scripts/test-db-connection.ts`
  - Import and execute testDatabaseConnection utility
  - Format and display results in terminal
  - Add color coding for success/failure
  - Add script to package.json as "test:db"
  - _Requirements: 4.1, 4.2, 4.3_

- [ ]* 6.1 Write integration test for connection script
  - Test script execution with valid connection
  - Test script execution with invalid connection
  - Verify output formatting
  - _Requirements: 4.1, 4.2_

- [ ] 7. Implement SSL/TLS configuration
  - Add SSL mode parameters to connection string examples
  - Document SSL certificate verification
  - Add SSL enforcement check for production environment
  - Update env validation to check SSL in production
  - _Requirements: 6.1, 6.2, 6.3_

- [ ]* 7.1 Write property test for SSL enforcement
  - **Property 5: SSL Connection Enforcement**
  - **Validates: Requirements 6.1, 6.2, 6.3**
  - Generate production environment configurations
  - Verify all include SSL parameters
  - Test SSL mode validation

- [ ] 8. Add error handling and logging
  - Create custom DatabaseConfigurationError class
  - Implement error sanitization (remove credentials)
  - Add descriptive error messages for common failures
  - Configure Prisma error formatting
  - Add connection error logging
  - _Requirements: 6.4, 7.1, 7.2, 7.3, 7.4_

- [ ]* 8.1 Write property test for error message sanitization
  - **Property 7: Error Message Clarity**
  - **Validates: Requirements 6.4, 7.1, 7.2**
  - Generate various connection errors
  - Verify no credentials in error messages
  - Verify diagnostic information is present

- [ ]* 8.2 Write unit tests for error handling
  - Test DatabaseConfigurationError creation
  - Test error message sanitization
  - Test credential removal from error details
  - Test error code assignment
  - _Requirements: 6.4, 7.1, 7.2_

- [ ] 9. Configure connection pooling
  - Set appropriate pool size based on environment
  - Configure connection timeout (5s dev, 10s prod)
  - Configure statement timeout
  - Add pool size validation (1-100)
  - Document pool configuration in setup guide
  - _Requirements: 8.1, 8.2, 8.3_

- [ ]* 9.1 Write property test for connection pool reuse
  - **Property 6: Connection Pool Reuse**
  - **Validates: Requirements 3.4, 8.1**
  - Execute multiple sequential queries
  - Verify same connection pool is used
  - Test in both development and production modes

- [ ] 10. Implement graceful shutdown
  - Add process signal handlers (SIGTERM, SIGINT)
  - Call prisma.$disconnect() on shutdown
  - Add timeout for graceful shutdown (5 seconds)
  - Log shutdown events
  - Test shutdown behavior
  - _Requirements: 3.5_

- [ ]* 10.1 Write property test for graceful shutdown
  - **Property 8: Graceful Shutdown**
  - **Validates: Requirements 3.5**
  - Simulate various shutdown signals
  - Verify connections are closed
  - Verify cleanup completes before exit

- [ ]* 10.2 Write unit tests for shutdown handling
  - Test SIGTERM handler closes connections
  - Test SIGINT handler closes connections
  - Test shutdown timeout
  - Test shutdown logging
  - _Requirements: 3.5_

- [ ] 11. Create health check endpoint
  - Create `src/app/api/health/db/route.ts`
  - Implement GET handler that calls testDatabaseConnection
  - Return JSON response with connection status
  - Add appropriate HTTP status codes (200/503)
  - Include latency and timestamp in response
  - _Requirements: 4.1, 4.2_

- [ ]* 11.1 Write integration test for health check endpoint
  - Test endpoint returns 200 on successful connection
  - Test endpoint returns 503 on failed connection
  - Test response includes required fields
  - Test response time is reasonable
  - _Requirements: 4.1, 4.2_

- [ ] 12. Checkpoint - Verify all tests pass
  - Run all unit tests and verify they pass
  - Run all property-based tests and verify they pass
  - Run integration tests and verify they pass
  - Test connection with mock Supabase credentials
  - Review test coverage (should be >70%)
  - Ask user if any questions or issues arise

- [ ] 13. Final documentation and cleanup
  - Review all documentation for accuracy
  - Add inline code comments
  - Update README.md with database setup reference
  - Create migration guide if needed
  - Add troubleshooting tips based on testing
  - _Requirements: 5.1, 5.2, 5.3, 5.4, 5.5_

## Notes

- Tasks marked with `*` are optional and can be skipped for faster MVP
- Each task references specific requirements for traceability
- Property tests validate universal correctness properties
- Unit tests validate specific examples and edge cases
- Integration tests verify end-to-end functionality
- Checkpoint ensures incremental validation before proceeding
