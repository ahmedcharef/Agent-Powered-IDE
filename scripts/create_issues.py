#!/usr/bin/env python3
"""Create GitHub issues for e-commerce SaaS project"""
import requests
import time

TOKEN = "GITHUB_PERSONAL_ACCESS_TOKEN"
REPO = "ahmedcharef/Agent-Powered-IDE"
URL = f"https://api.github.com/repos/{REPO}/issues"
HEADERS = {"Authorization": f"token {TOKEN}", "Accept": "application/vnd.github.v3+json"}

def create_issue(title, body, labels):
    data = {"title": title, "body": body, "labels": labels}
    r = requests.post(URL, headers=HEADERS, json=data)
    if r.status_code == 201:
        print(f"✓ Created: {title}")
        return r.json()["number"]
    else:
        print(f"✗ Failed: {title} - {r.status_code}")
        return None

# Backend Tasks
backend = [
    ("Backend: Setup dependencies (Prisma, tRPC, NextAuth, Vitest)", 
     "Install Prisma, tRPC, NextAuth v5, Vitest, Zod, bcryptjs\n\nSee SPEC.md Section 6.1\n\n**TASK-BE-001**",
     ["task", "backend", "priority:critical", "mvp"]),
    
    ("Backend: Configure Supabase PostgreSQL", 
     "Setup Supabase project and DATABASE_URL\n\nSee SPEC.md Section 6.2\n\n**TASK-BE-002**",
     ["task", "backend", "priority:critical", "mvp"]),
    
    ("Backend: Create Prisma schema (User, Product, Cart, Order)", 
     "Define all models with relations\n\nSee SPEC.md Section 3.2\n\n**TASK-BE-003**",
     ["task", "backend", "priority:critical", "mvp"]),
    
    ("Backend: Run initial database migration", 
     "Generate and apply Prisma migration\n\n**TASK-BE-004**",
     ["task", "backend", "priority:critical", "mvp"]),
    
    ("Backend: Configure NextAuth with credentials provider", 
     "Setup auth.ts with email/password\n\nSee REQ-AUTH-003\n\n**TASK-BE-005**",
     ["task", "backend", "priority:high", "mvp"]),
    
    ("Backend: Implement user registration endpoint (tRPC)", 
     "Create auth.register with validation\n\nSee REQ-AUTH-001\n\n**TASK-BE-007**",
     ["task", "backend", "priority:high", "mvp"]),
    
    ("Backend: Implement email verification logic", 
     "Token generation and validation\n\nSee REQ-AUTH-002\n\n**TASK-BE-008**",
     ["task", "backend", "priority:high", "mvp"]),
    
    ("Backend: Create role-based middleware for admin routes", 
     "Verify admin role before access\n\nSee REQ-AUTH-004\n\n**TASK-BE-009**",
     ["task", "backend", "priority:high", "mvp"]),
    
    ("Backend: Create product CRUD tRPC router", 
     "Implement create, read, update, delete\n\nSee REQ-PROD-001-004\n\n**TASK-BE-012**",
     ["task", "backend", "priority:high", "mvp"]),
    
    ("Backend: Implement product list with pagination", 
     "20 items per page, sorting\n\nSee REQ-PROD-002\n\n**TASK-BE-013**",
     ["task", "backend", "priority:medium", "mvp"]),
    
    ("Backend: Create cart tRPC router", 
     "Add, update, remove, clear cart\n\nSee REQ-CART-001-003\n\n**TASK-BE-019**",
     ["task", "backend", "priority:high", "mvp"]),
    
    ("Backend: Implement cart persistence for auth users", 
     "Save cart to database\n\nSee REQ-CART-002\n\n**TASK-BE-022**",
     ["task", "backend", "priority:medium", "mvp"]),
    
    ("Backend: Create order tRPC router", 
     "Order creation and history\n\nSee REQ-CHECK-002\n\n**TASK-BE-025**",
     ["task", "backend", "priority:high", "mvp"]),
    
    ("Backend: Add stock reduction on order creation", 
     "Update product stock atomically\n\n**TASK-BE-027**",
     ["task", "backend", "priority:high", "mvp"]),
]

# Frontend Tasks
frontend = [
    ("Frontend: Install and configure Shadcn UI", 
     "Setup components library\n\n**TASK-FE-001**",
     ["task", "frontend", "priority:critical", "mvp"]),
    
    ("Frontend: Setup tRPC client with React Query", 
     "Configure API client\n\n**TASK-FE-002**",
     ["task", "frontend", "priority:critical", "mvp"]),
    
    ("Frontend: Create base layout (Header, Footer, Nav)", 
     "Responsive layout components\n\n**TASK-FE-003**",
     ["task", "frontend", "priority:high", "mvp"]),
    
    ("Frontend: Build signup page with validation", 
     "Email/password form with Zod\n\nSee REQ-AUTH-001\n\n**TASK-FE-007**",
     ["task", "frontend", "priority:high", "mvp"]),
    
    ("Frontend: Build login page", 
     "NextAuth signin\n\nSee REQ-AUTH-003\n\n**TASK-FE-008**",
     ["task", "frontend", "priority:high", "mvp"]),
    
    ("Frontend: Build product listing page", 
     "Grid layout with pagination\n\nSee REQ-CAT-001\n\n**TASK-FE-013**",
     ["task", "frontend", "priority:high", "mvp"]),
    
    ("Frontend: Create product detail page", 
     "Full product info with gallery\n\nSee REQ-CAT-002\n\n**TASK-FE-017**",
     ["task", "frontend", "priority:high", "mvp"]),
    
    ("Frontend: Build admin product list table", 
     "CRUD operations UI\n\nSee REQ-PROD-002\n\n**TASK-FE-022**",
     ["task", "frontend", "priority:high", "mvp"]),
    
    ("Frontend: Create product create/edit form", 
     "Admin form with image upload\n\nSee REQ-PROD-001, REQ-PROD-003\n\n**TASK-FE-023**",
     ["task", "frontend", "priority:high", "mvp"]),
    
    ("Frontend: Create cart page", 
     "Display items with totals\n\nSee REQ-CART-004\n\n**TASK-FE-028**",
     ["task", "frontend", "priority:high", "mvp"]),
    
    ("Frontend: Implement cart badge in header", 
     "Show item count\n\n**TASK-FE-030**",
     ["task", "frontend", "priority:medium", "mvp"]),
    
    ("Frontend: Build checkout page", 
     "Shipping address and mock payment\n\nSee REQ-CHECK-001\n\n**TASK-FE-035**",
     ["task", "frontend", "priority:high", "mvp"]),
    
    ("Frontend: Create order confirmation page", 
     "Display order number and details\n\nSee REQ-CHECK-002\n\n**TASK-FE-039**",
     ["task", "frontend", "priority:medium", "mvp"]),
    
    ("Frontend: Build order history page", 
     "List user orders\n\nSee REQ-CHECK-003\n\n**TASK-FE-040**",
     ["task", "frontend", "priority:medium", "mvp"]),
]

# Testing Tasks
testing = [
    ("Testing: Write auth integration tests", 
     "Test registration, login, verification\n\nSee REQ-NFR-004\n\n**TASK-BE-011**",
     ["task", "backend", "testing", "priority:medium"]),
    
    ("Testing: Write cart operation unit tests", 
     "Test add, update, remove\n\n**TASK-BE-024**",
     ["task", "backend", "testing", "priority:medium"]),
    
    ("Testing: Write component unit tests (Vitest)", 
     "Test critical UI components\n\n**TASK-FE-042**",
     ["task", "frontend", "testing", "priority:low"]),
]

print("Creating GitHub issues for E-Commerce SaaS Project")
print("=" * 60)

created = []
for title, body, labels in backend + frontend + testing:
    num = create_issue(title, body, labels)
    if num:
        created.append(num)
    time.sleep(1)  # Rate limiting

print(f"\n✓ Created {len(created)} issues")
print(f"View at: https://github.com/{REPO}/issues")
