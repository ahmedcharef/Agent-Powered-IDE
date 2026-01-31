# Agentic Hybrid Dev Workflow: Kiro + Cursor + MCP + GitHub

**Project Name (working title):** Hybrid-Agent E-Commerce Lab  
**Goal:** Demonstrate a powerful, traceable multi-agent development loop where two leading agentic IDEs collaborate on the same codebase via shared GitHub issues, Model Context Protocol (MCP), and role-based task splitting.

## Overview

This repository experiments with **agentic software development at scale** in 2026:

- **Kiro** (AWS agentic IDE) handles **structured specification generation**, **backend implementation** (APIs, database, auth, business logic), and **autonomous execution** triggered by GitHub webhooks (via "kiro" label or mentions).
- **Cursor** (agentic VS Code fork) handles **fast, creative frontend implementation** (UI components, pages, client-side logic, styling) using Agent/Composer modes.
- **GitHub** serves as the single source of truth:
  - Tasks & specs live as **issues** (created automatically from Kiro specs)
  - Labels split work: `backend`, `frontend`, `task`, `mvp`, etc.
  - PRs link back to issues
  - Agents push commits, create PRs, add review comments, and **close issues** with summaries on completion
- **Model Context Protocol (MCP)** enables both IDEs to securely read/write GitHub issues, push code, and share context (via official GitHub MCP server + optional orchestration servers). Cursor v2.4.x has solid MCP fixes for tool detection.

The result: A semi-autonomous, self-healing development loop with full traceability, minimal manual git thrashing, and clear separation of concerns between structured (Kiro) and exploratory (Cursor) agents.

## Core Workflow

1. **Spec & Task Generation** (Kiro)
   - Feed project idea / requirements into Kiro
   - Agent generates EARS-style spec + task decomposition
   - Automatically creates GitHub issues with labels (`backend` / `frontend`)

2. **Backend Execution** (Kiro Autonomous Agent – preferred)
   - Add "kiro" label to backend issues → webhook triggers autonomous agent
   - Agent clones sandbox, implements, commits to branch, opens PR, adds details
   - On merge: Closes issue with comment (summary, tests, notes)

3. **Frontend Execution** (Cursor)
   - Persistent chat / Agent mode watches for `frontend`-labeled issues
   - Implements UI autonomously, pushes to branch, creates PR
   - Closes issue post-merge with visual/UI notes

4. **Review & Close**
   - Cross-review PRs in either IDE
   - Merge → agents auto-close linked issue with changelog

## Tech Stack (Initial Test Project)

- **Framework**: Next.js 14+ (App Router)
- **Base Starter**: [https://github.com/kleneway/next-ai-starter](https://github.com/vercel/next.js) – Next.js enables you to create full-stack web applications by extending the latest React features, and integrating powerful Rust-based JavaScript tooling for the fastest builds.

- **Database**: -
- **Auth**: -
- **Testing**: Vitest
- **MCP Servers**:
  - Official GitHub MCP (issues, PRs, push_files, etc.)
  - Optional: agent-orchestration (shared memory, task queue, role claiming)
- **IDE Agents**:
  - Kiro Autonomous Agent (webhook-driven backend)
  - Cursor Agent/Composer (chat-driven frontend)

## Getting Started

### Prerequisites
- Docker (for local GitHub MCP server)
- GitHub PAT with `repo` scope
- Installed: [Kiro IDE](https://kiro.dev/downloads), [Cursor](https://cursor.sh/download) (free Hobby tier)

### Setup Steps
1. Fork/clone this repo
2. Install dependencies: `npm install`
3. Configure MCP in both IDEs (see below)

### MCP Configuration (GitHub Integration)
**Kiro** (`~/.kiro/settings/mcp.json` or workspace `.kiro/settings/mcp.json`):
```json
{
  "mcpServers": {
    "github-mcp": {
      "command": "docker",
      "args": ["run", "-i", "--rm", "-e", "GITHUB_PERSONAL_ACCESS_TOKEN", "-e", "GITHUB_TOOLSETS=repos,issues,pull_requests,git", "ghcr.io/github/github-mcp-server"],
      "env": { "GITHUB_PERSONAL_ACCESS_TOKEN": "${input:github_pat}" }
    }
  },
  "inputs": [{ "type": "promptString", "id": "github_pat", "description": "GitHub PAT", "password": true }]
}
