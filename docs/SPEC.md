# E-Commerce SaaS Platform - Technical Specification

## 1. Executive Summary

**Project Name:** E-Commerce SaaS Platform  
**Version:** 1.0.0 MVP  
**Date:** January 31, 2026  
**Status:** Planning Phase

### 1.1 Purpose
Build a full-stack e-commerce SaaS prototype enabling businesses to manage products and customers to browse and purchase items online.

### 1.2 Technology Stack
- **Frontend:** Next.js 14+ (App Router), React 19, Tailwind CSS, Shadcn UI
- **Backend:** Next.js API Routes, tRPC, Server Actions
- **Database:** PostgreSQL (Supabase)
- **ORM:** Prisma
- **Authentication:** NextAuth.js v5
- **Testing:** Vitest
- **Type Safety:** TypeScript

---

## 2. EARS-Style Requirements

### 2.1 Authentication & Authorization

**REQ-AUTH-001: User Registration**
- **WHEN** a visitor accesses the signup page
- **THE SYSTEM SHALL** provide email and password input fields
- **AND** validate email format and password strength (min 8 chars, 1 uppercase, 1 number)
- **AND** create a new user account with "USER" role by default
- **AND** send a verification email with a unique token

**REQ-AUTH-002: Email Verification**
- **WHEN** a user clicks the verification link in their email
- **THE SYSTEM SHALL** validate the token
- **AND** mark the user account as verified
- **AND** redirect to login page with success message

**REQ-AUTH-003: User Login**
- **WHEN** a user submits valid credentials
- **THE SYSTEM SHALL** authenticate using NextAuth
- **AND** create a secure session (JWT)
- **AND** redirect to appropriate dashboard based on role

**REQ-AUTH-004: Role-Based Access Control**
- **THE SYSTEM SHALL** support two roles: "USER" and "ADMIN"
- **WHEN** an admin accesses admin routes (/admin/*)
- **THE SYSTEM SHALL** verify admin role before rendering
- **WHEN** a non-admin attempts to access admin routes
- **THE SYSTEM SHALL** redirect to 403 forbidden page

### 2.2 Product Management (Admin)

**REQ-PROD-001: Create Product**
- **WHEN** an admin submits the create product form
- **THE SYSTEM SHALL** validate required fields (name, description, price, stock)
- **AND** upload product images to storage
- **AND** create product record in database
- **AND** return success confirmation

**REQ-PROD-002: List Products (Admin)**
- **WHEN** an admin accesses the products dashboard
- **THE SYSTEM SHALL** display all products in a table/grid
- **AND** show product name, price, stock, status, created date
- **AND** provide pagination (20 items per page)
- **AND** enable search by name and filter by status

**REQ-PROD-003: Update Product**
- **WHEN** an admin edits a product
- **THE SYSTEM SHALL** pre-populate form with existing data
- **AND** validate changes
- **AND** update database record
- **AND** maintain audit trail (updated_at timestamp)

**REQ-PROD-004: Delete Product**
- **WHEN** an admin deletes a product
- **THE SYSTEM SHALL** prompt for confirmation
- **AND** perform soft delete (mark as inactive)
- **AND** prevent deletion if product has pending orders

### 2.3 Public Product Catalog

**REQ-CAT-001: Browse Products**
- **WHEN** any visitor accesses the catalog page
- **THE SYSTEM SHALL** display all active products
- **AND** show product image, name, price, rating
- **AND** support pagination and sorting (price, name, newest)
- **AND** enable category filtering

**REQ-CAT-002: Product Detail Page**
- **WHEN** a user clicks on a product
- **THE SYSTEM SHALL** display full product details
- **AND** show multiple images in a gallery
- **AND** display description, specifications, reviews
- **AND** show "Add to Cart" button with quantity selector

**REQ-CAT-003: Search Products**
- **WHEN** a user enters a search query
- **THE SYSTEM SHALL** search product names and descriptions
- **AND** return results within 500ms
- **AND** highlight matching terms

### 2.4 Shopping Cart

**REQ-CART-001: Add to Cart**
- **WHEN** a user adds a product to cart
- **THE SYSTEM SHALL** validate stock availability
- **AND** add item to cart (session or database)
- **AND** update cart badge count
- **AND** show confirmation toast

**REQ-CART-002: Cart Persistence**
- **THE SYSTEM SHALL** persist cart for logged-in users in database
- **AND** persist cart for guests in localStorage
- **AND** merge guest cart with user cart upon login

**REQ-CART-003: Update Cart**
- **WHEN** a user changes item quantity
- **THE SYSTEM SHALL** validate against stock
- **AND** update cart total in real-time
- **AND** allow removal of items

**REQ-CART-004: Cart Display**
- **WHEN** a user views their cart
- **THE SYSTEM SHALL** show all items with images, names, prices
- **AND** calculate subtotal, tax (mock), shipping (mock)
- **AND** display grand total
- **AND** provide "Proceed to Checkout" button

### 2.5 Checkout Flow (Mock)

**REQ-CHECK-001: Checkout Page**
- **WHEN** a user proceeds to checkout
- **THE SYSTEM SHALL** require authentication
- **AND** display order summary
- **AND** collect shipping address
- **AND** show mock payment form (no real processing)

**REQ-CHECK-002: Order Creation**
- **WHEN** a user confirms order
- **THE SYSTEM SHALL** create order record with "PENDING" status
- **AND** create order items linked to products
- **AND** reduce product stock quantities
- **AND** clear user's cart
- **AND** display order confirmation with order number

**REQ-CHECK-003: Order History**
- **WHEN** a user views order history
- **THE SYSTEM SHALL** display all their orders
- **AND** show order number, date, status, total
- **AND** allow viewing order details

### 2.6 Non-Functional Requirements

**REQ-NFR-001: Security**
- All passwords SHALL be hashed using bcrypt
- API endpoints SHALL validate authentication tokens
- SQL injection SHALL be prevented via Prisma parameterization
- XSS SHALL be prevented via React's built-in escaping

**REQ-NFR-002: Performance**
- Product catalog SHALL load within 2 seconds
- API responses SHALL complete within 1 second (95th percentile)
- Images SHALL be optimized and lazy-loaded

**REQ-NFR-003: Responsive Design**
- UI SHALL be fully responsive (mobile, tablet, desktop)
- Breakpoints: 640px (sm), 768px (md), 1024px (lg), 1280px (xl)

**REQ-NFR-004: Testing**
- Critical paths SHALL have unit tests (>70% coverage)
- Authentication flow SHALL have integration tests
- Cart operations SHALL have integration tests

---

## 3. System Architecture

### 3.1 Architecture Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                         Client Layer                         │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │   Pages      │  │  Components  │  │   Hooks      │      │
│  │  (App Router)│  │  (Shadcn UI) │  │  (State Mgmt)│      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
└─────────────────────────────────────────────────────────────┘
                            ↓ ↑
┌─────────────────────────────────────────────────────────────┐
│                      API Layer (tRPC)                        │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │   Auth       │  │   Products   │  │    Cart      │      │
│  │   Router     │  │   Router     │  │   Router     │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
└─────────────────────────────────────────────────────────────┘
                            ↓ ↑
┌─────────────────────────────────────────────────────────────┐
│                     Business Logic Layer                     │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │  Services    │  │  Validators  │  │  Middleware  │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
└─────────────────────────────────────────────────────────────┘
                            ↓ ↑
┌─────────────────────────────────────────────────────────────┐
│                      Data Access Layer                       │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │   Prisma     │  │   NextAuth   │  │   Storage    │      │
│  │   Client     │  │   Adapter    │  │   (Supabase) │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
└─────────────────────────────────────────────────────────────┘
                            ↓ ↑
┌─────────────────────────────────────────────────────────────┐
│                    Database (PostgreSQL)                     │
│              Hosted on Supabase                              │
└─────────────────────────────────────────────────────────────┘
```

### 3.2 Database Schema

```prisma
// User Management
model User {
  id            String    @id @default(cuid())
  email         String    @unique
  password      String
  name          String?
  role          Role      @default(USER)
  emailVerified DateTime?
  image         String?
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt
  
  accounts      Account[]
  sessions      Session[]
  orders        Order[]
  cart          CartItem[]
}

enum Role {
  USER
  ADMIN
}

// NextAuth Models
model Account {
  id                String  @id @default(cuid())
  userId            String
  type              String
  provider          String
  providerAccountId String
  refresh_token     String?
  access_token      String?
  expires_at        Int?
  token_type        String?
  scope             String?
  id_token          String?
  session_state     String?
  
  user User @relation(fields: [userId], references: [id], onDelete: Cascade)
  
  @@unique([provider, providerAccountId])
}

model Session {
  id           String   @id @default(cuid())
  sessionToken String   @unique
  userId       String
  expires      DateTime
  user         User     @relation(fields: [userId], references: [id], onDelete: Cascade)
}

model VerificationToken {
  identifier String
  token      String   @unique
  expires    DateTime
  
  @@unique([identifier, token])
}

// Product Management
model Product {
  id          String   @id @default(cuid())
  name        String
  slug        String   @unique
  description String
  price       Decimal  @db.Decimal(10, 2)
  stock       Int      @default(0)
  images      String[]
  category    String?
  isActive    Boolean  @default(true)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  
  orderItems  OrderItem[]
  cartItems   CartItem[]
}

// Shopping Cart
model CartItem {
  id        String   @id @default(cuid())
  userId    String
  productId String
  quantity  Int      @default(1)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  
  user    User    @relation(fields: [userId], references: [id], onDelete: Cascade)
  product Product @relation(fields: [productId], references: [id], onDelete: Cascade)
  
  @@unique([userId, productId])
}

// Order Management
model Order {
  id              String      @id @default(cuid())
  userId          String
  orderNumber     String      @unique
  status          OrderStatus @default(PENDING)
  subtotal        Decimal     @db.Decimal(10, 2)
  tax             Decimal     @db.Decimal(10, 2)
  shipping        Decimal     @db.Decimal(10, 2)
  total           Decimal     @db.Decimal(10, 2)
  shippingAddress Json
  createdAt       DateTime    @default(now())
  updatedAt       DateTime    @updatedAt
  
  user       User        @relation(fields: [userId], references: [id], onDelete: Cascade)
  orderItems OrderItem[]
}

enum OrderStatus {
  PENDING
  PROCESSING
  SHIPPED
  DELIVERED
  CANCELLED
}

model OrderItem {
  id        String  @id @default(cuid())
  orderId   String
  productId String
  quantity  Int
  price     Decimal @db.Decimal(10, 2)
  
  order   Order   @relation(fields: [orderId], references: [id], onDelete: Cascade)
  product Product @relation(fields: [productId], references: [id], onDelete: Restrict)
  
  @@unique([orderId, productId])
}
```

### 3.3 API Routes (tRPC)

**Auth Router**
- `auth.register` - Create new user account
- `auth.verifyEmail` - Verify email token
- `auth.login` - Authenticate user (handled by NextAuth)
- `auth.logout` - End session

**Product Router**
- `product.list` - Get paginated products (public)
- `product.getById` - Get single product details
- `product.search` - Search products by query
- `product.create` - Create product (admin only)
- `product.update` - Update product (admin only)
- `product.delete` - Soft delete product (admin only)

**Cart Router**
- `cart.get` - Get user's cart
- `cart.add` - Add item to cart
- `cart.update` - Update item quantity
- `cart.remove` - Remove item from cart
- `cart.clear` - Clear entire cart

**Order Router**
- `order.create` - Create new order
- `order.list` - Get user's orders
- `order.getById` - Get order details
- `order.updateStatus` - Update order status (admin only)

### 3.4 Page Structure

```
/                          → Home/Landing page
/products                  → Product catalog (public)
/products/[slug]           → Product detail page
/cart                      → Shopping cart
/checkout                  → Checkout flow
/orders                    → Order history (auth required)
/orders/[id]               → Order details
/auth/signin               → Login page
/auth/signup               → Registration page
/auth/verify-email         → Email verification handler
/admin                     → Admin dashboard (admin only)
/admin/products            → Product management
/admin/products/new        → Create product
/admin/products/[id]/edit  → Edit product
/admin/orders              → Order management
```

---

## 4. Acceptance Criteria

### 4.1 Authentication Flow
- [ ] User can register with email/password
- [ ] Verification email is sent upon registration
- [ ] User can verify email via link
- [ ] User can login with verified account
- [ ] Unverified users cannot access protected routes
- [ ] Admin users can access /admin routes
- [ ] Non-admin users are blocked from /admin routes

### 4.2 Product Management
- [ ] Admin can create products with images
- [ ] Admin can view all products in dashboard
- [ ] Admin can edit product details
- [ ] Admin can soft-delete products
- [ ] Deleted products don't appear in public catalog
- [ ] Product stock updates correctly

### 4.3 Public Catalog
- [ ] Visitors can browse products without login
- [ ] Products display with images and prices
- [ ] Search returns relevant results
- [ ] Pagination works correctly
- [ ] Product detail page shows full information

### 4.4 Shopping Cart
- [ ] Users can add products to cart
- [ ] Cart persists across sessions (logged-in users)
- [ ] Cart quantity updates correctly
- [ ] Cart total calculates accurately
- [ ] Out-of-stock products cannot be added

### 4.5 Checkout
- [ ] Checkout requires authentication
- [ ] Order is created with correct details
- [ ] Stock is reduced after order
- [ ] Cart is cleared after order
- [ ] Order confirmation is displayed
- [ ] User can view order history

### 4.6 UI/UX
- [ ] All pages are responsive (mobile, tablet, desktop)
- [ ] Forms have proper validation and error messages
- [ ] Loading states are shown during async operations
- [ ] Success/error toasts appear for user actions
- [ ] Navigation is intuitive and consistent

### 4.7 Testing
- [ ] Auth flow has integration tests
- [ ] Cart operations have unit tests
- [ ] Product CRUD has unit tests
- [ ] Order creation has integration tests
- [ ] Test coverage >70% for critical paths

---

## 5. Implementation Phases

### Phase 1: Foundation (Week 1)
- Setup project dependencies
- Configure Prisma + Supabase
- Implement database schema
- Setup NextAuth configuration
- Create base UI components (Shadcn)

### Phase 2: Authentication (Week 1-2)
- Build registration flow
- Implement email verification
- Setup login/logout
- Add role-based middleware
- Create auth pages

### Phase 3: Product Management (Week 2)
- Build admin product CRUD
- Implement image upload
- Create admin dashboard UI
- Add product validation

### Phase 4: Public Catalog (Week 2-3)
- Build product listing page
- Create product detail page
- Implement search functionality
- Add pagination and filters

### Phase 5: Shopping Cart (Week 3)
- Implement cart operations
- Build cart UI
- Add cart persistence
- Handle guest/user cart merge

### Phase 6: Checkout & Orders (Week 3-4)
- Build checkout flow
- Implement order creation
- Create order history page
- Add order management (admin)

### Phase 7: Testing & Polish (Week 4)
- Write unit tests
- Write integration tests
- Fix bugs
- Optimize performance
- Final UI polish

---

## 6. Dependencies & Setup

### 6.1 Required Packages

```json
{
  "dependencies": {
    "next": "^14.2.0",
    "react": "^19.0.0",
    "react-dom": "^19.0.0",
    "@prisma/client": "^5.0.0",
    "@trpc/server": "^11.0.0",
    "@trpc/client": "^11.0.0",
    "@trpc/react-query": "^11.0.0",
    "@trpc/next": "^11.0.0",
    "@tanstack/react-query": "^5.0.0",
    "next-auth": "^5.0.0",
    "@auth/prisma-adapter": "^2.0.0",
    "bcryptjs": "^2.4.3",
    "zod": "^3.22.0",
    "tailwindcss": "^4.0.0",
    "@radix-ui/react-*": "latest",
    "class-variance-authority": "^0.7.0",
    "clsx": "^2.0.0",
    "tailwind-merge": "^2.0.0",
    "lucide-react": "^0.300.0",
    "react-hook-form": "^7.49.0",
    "@hookform/resolvers": "^3.3.0",
    "sonner": "^1.3.0"
  },
  "devDependencies": {
    "prisma": "^5.0.0",
    "vitest": "^1.0.0",
    "@vitejs/plugin-react": "^4.2.0",
    "@testing-library/react": "^14.0.0",
    "@testing-library/jest-dom": "^6.0.0",
    "typescript": "^5.0.0",
    "@types/node": "^20.0.0",
    "@types/react": "^19.0.0",
    "@types/bcryptjs": "^2.4.6"
  }
}
```

### 6.2 Environment Variables

```env
# Database
DATABASE_URL="postgresql://user:password@host:5432/dbname"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key"

# Email (for verification)
EMAIL_SERVER_HOST="smtp.example.com"
EMAIL_SERVER_PORT=587
EMAIL_SERVER_USER="user@example.com"
EMAIL_SERVER_PASSWORD="password"
EMAIL_FROM="noreply@example.com"

# Supabase (optional, for storage)
NEXT_PUBLIC_SUPABASE_URL="your-supabase-url"
NEXT_PUBLIC_SUPABASE_ANON_KEY="your-anon-key"
SUPABASE_SERVICE_ROLE_KEY="your-service-role-key"
```

---

## 7. Risk Assessment

| Risk | Impact | Probability | Mitigation |
|------|--------|-------------|------------|
| Database schema changes | High | Medium | Use Prisma migrations, version control |
| Auth security vulnerabilities | Critical | Low | Use NextAuth best practices, security audit |
| Performance issues with large catalogs | Medium | Medium | Implement pagination, caching, indexing |
| Third-party API failures | Medium | Low | Mock services for development, error handling |
| Scope creep | High | High | Strict MVP definition, phase-based approach |

---

## 8. Success Metrics

- [ ] All acceptance criteria met
- [ ] Test coverage >70%
- [ ] Page load time <2s
- [ ] Zero critical security vulnerabilities
- [ ] Mobile responsive on all pages
- [ ] Successful demo of complete user journey

---

## 9. Future Enhancements (Post-MVP)

- Real payment integration (Stripe)
- Product reviews and ratings
- Wishlist functionality
- Advanced search with filters
- Email notifications for orders
- Admin analytics dashboard
- Multi-vendor support
- Inventory management
- Discount codes and promotions
- Social authentication (Google, GitHub)

---

**Document Version:** 1.0  
**Last Updated:** January 31, 2026  
**Status:** Approved for Implementation
