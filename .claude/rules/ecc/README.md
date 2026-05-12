# ECC Rules - DBSN Website Project

This directory contains locally installed Everything Claude Code (ECC) rules tailored for the DBSN Centralized Digital Ecosystem project.

## Project Context

**Tech Stack:**
- Next.js 15 (App Router) + TypeScript
- pnpm package manager
- Sanity.io (CMS)
- Tailwind CSS + Radix UI (shadcn/ui)
- Neon Postgres + Prisma ORM
- Auth.js v5 (Authentication)
- Cloudflare Pages (Hosting)
- Resend + Telegram Bot (Notifications)
- GA4 + GSC + Cloudflare Analytics

## Installed Rules

### `/common/` - Base rules applicable to all development
| File | Purpose |
|------|---------|
| `security.md` | Base security guidelines (secret management, mandatory checks) |
| `patterns.md` | Common patterns (repository pattern, API response format) |
| `development-workflow.md` | Feature implementation workflow (research → plan → TDD → review) |
| `git-workflow.md` | Commit message format (conventional commits) |
| `testing.md` | Base testing standards |

### `/typescript/` - TypeScript/JavaScript specific rules
| File | Purpose |
|------|---------|
| `coding-style.md` | Types, interfaces, immutability, error handling, input validation with Zod |
| `patterns.md` | React props, component patterns, async/await patterns |
| `security.md` | Secret management for TS/JS, environment variable usage |
| `testing.md` | TypeScript testing patterns |

### `/web/` - Web/React/Next.js specific rules
| File | Purpose |
|------|---------|
| `coding-style.md` | Web-specific coding conventions |
| `patterns.md` | Component composition, state management, data fetching, URL as state |
| `security.md` | **CRITICAL**: CSP, XSS prevention, CSRF protection, HTTPS headers, form security |
| `performance.md` | **CRITICAL**: Core Web Vitals, bundle budgets, image optimization (PSI 90+) |
| `testing.md` | Web testing patterns |

## Key Alignment with Project Requirements

| Project Requirement | Relevant Rule |
|--------------------|---------------|
| PSI 90+ mobile target | `web/performance.md` (Core Web Vitals, image optimization) |
| Input validation & anti-spam | `typescript/coding-style.md` (Zod schemas) |
| Row-level auth (tracking_scope_ids) | `common/security.md` + `web/security.md` (authorization checks) |
| Secret management | `typescript/security.md` (no hardcoded secrets) |
| Form security (RFQ) | `web/security.md` (CSRF, rate limiting, honeypot) |
| Component reusability (spokes) | `web/patterns.md` (compound components, container/presentational split) |
| API design (`/api/rfq`, `/api/tracking`) | `common/patterns.md` (consistent response format) |

## Usage

These rules are automatically loaded by Claude Code when working in this project directory. They provide guidance for:

1. Code style and patterns
2. Security requirements
3. Performance targets
4. Development workflow
5. Testing standards
