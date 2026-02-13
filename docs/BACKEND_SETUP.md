# Backend Dependencies Setup

This document describes the backend dependencies installed for the E-Commerce SaaS Platform.

## Installed Dependencies

### Core Backend Dependencies

- **@prisma/client** (v5.22.0) - Prisma ORM client for database operations
- **@trpc/server** (v11.10.0) - tRPC server for type-safe API routes
- **@trpc/client** (v11.10.0) - tRPC client for frontend API calls
- **@trpc/react-query** (v11.10.0) - React Query integration for tRPC
- **@trpc/next** (v11.10.0) - Next.js integration for tRPC
- **@tanstack/react-query** (v5.90.21) - Data fetching and caching library
- **next-auth** (v5.0.0-beta.30) - Authentication for Next.js
- **@auth/prisma-adapter** (v2.11.1) - Prisma adapter for NextAuth
- **bcryptjs** (v3.0.3) - Password hashing library
- **zod** (v4.3.6) - TypeScript-first schema validation

### Testing Dependencies

- **vitest** (v4.0.18) - Fast unit test framework
- **@vitejs/plugin-react** (v5.1.4) - Vite plugin for React
- **@testing-library/react** (v16.3.2) - React testing utilities
- **@testing-library/jest-dom** (v6.9.1) - Custom Jest matchers for DOM
- **prisma** (v5.22.0) - Prisma CLI for migrations and schema management

## Configuration Files

### Vitest Configuration

Created `vitest.config.ts` with:
- React plugin support
- jsdom environment for DOM testing
- Path alias configuration (@/ → ./src)
- Setup file for test utilities

### Prisma Initialization

- Created `prisma/schema.prisma` with PostgreSQL datasource
- Configured for Supabase PostgreSQL connection

### Environment Variables

Updated `.env.example` with required variables:
- DATABASE_URL - PostgreSQL connection string
- NEXTAUTH_URL - Application URL
- NEXTAUTH_SECRET - Secret for JWT signing
- Email server configuration
- Supabase configuration (optional)

## NPM Scripts

Added test scripts to `package.json`:
- `pnpm test` - Run tests once
- `pnpm test:watch` - Run tests in watch mode
- `pnpm test:coverage` - Run tests with coverage report

## Next Steps

1. Configure Supabase PostgreSQL connection (TASK-BE-002)
2. Initialize Prisma schema with all models (TASK-BE-003)
3. Create initial database migration (TASK-BE-004)
4. Setup NextAuth configuration (TASK-BE-005)

## Version Compatibility

- Node.js: v20.15.1
- pnpm: v9.6.0
- Next.js: v16.1.6
- React: v19.2.3
