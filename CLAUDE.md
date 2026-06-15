# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**DBSN Centralized Digital Ecosystem** — A Next.js 16.2.6 (React 19) hub-and-spoke platform consolidating three legacy WordPress domains into a single codebase with unified design system, CMS, transactional database, and authenticated client tracking portal.

---

## High-Level Architecture

### System Topology

```
┌─────────────────────────────────────────────────────────────────────────────────────────────────────────┐
│                     Public (Cloudflare Edge)                      │
│  ┌───────────────────────────────────────────────────────────────────────────────────────────┐ │
│  │                                                │
│  │  Hub: sentradaya.com              Spokes:        Dashboard:         │
│  │  (Corporate Trust)             pju.sentradaya.com     dashboard.sentradaya.com   │
│  │                                  solarcell.sentradaya.com (Secure Tracking) │
│  │                                  alatpetir.sentradaya.com                     │
│  │                                  baterai.sentradaya.com                       │
│  └───────────────────────────────────────────────────────────────────────────────────────────────┘ │
│                                                              │
│  ┌───────────────────────────────────────────────────────────────────────────────────────────────┐ │
│  │                                                │
│  │                     Next.js 16 App (Single Codebase)         │
│  │  App Router + Middleware (Subdomain Routing)    │
│  └───────────────────────────────────────────────────────────────────────────────────────────────┘ │
│                                                              │
│  ┌───────────────────────────────────────────────────────────────────────────────────────────────┐ │
│  │                                                │
│  │  Hub: sentradaya.com              Spokes:        Dashboard:         │
│  │  (Corporate Trust)             pju.sentradaya.com     dashboard.sentradaya.com   │
│  │                                  solarcell.sentradaya.com (Secure Tracking) │
│  │                                  alatpetir.sentradaya.com                     │
│  │                                  baterai.sentradaya.com                       │
│  └───────────────────────────────────────────────────────────────────────────────────────────────┘ │
```

### Tech Stack

| Layer | Technology | Purpose |
|--------|-----------|---------|
| Runtime | Next.js 16.2.6, React 19.2.4 | Application framework, App Router, server components |
| Package Manager | pnpm | Dependency management |
| Content CMS | Sanity.io | Headless CMS, product/portfolio data, content federation |
| Transactional DB | Neon Postgres via Prisma 6.19.3 | Leads, users, tracking data, redirect mappings |
| Authentication | Auth.js v5 (5.0.0-beta.31) | Session management, RBAC (`admin`, `viewer`, `client`) |
| UI System | Tailwind CSS v4 + Radix UI | Shared design tokens, accessible components (shadcn/ui patterns) |
| Agent Chat | @21st-sdk/nextjs, @ai-sdk/react | Intelligent agent chat interface integration |
| State Management | Zustand 5 (persist middleware) | Client-side state persistence (RFQ cart) |
| Monitoring | Sentry 10.56.0 | Error tracking |
| Hosting | Vercel (Dev) / Cloudflare Pages (Prod) | Current: `dbsn-test01.vercel.app` — Production: `sentradaya.com` |
| Notifications | Resend (email) + Telegram Bot API | RFQ alerts, failure notifications |
| Analytics | GA4 + GSC + Cloudflare Analytics | Unified telemetry |

---

## Development Workflow

### Build & Development
```bash
# Install dependencies
pnpm install

# Development server (subdomain routing via lvh.me:3000)
pnpm dev

# Production build (Vercel)
pnpm build

# Compile Next.js edge build for Cloudflare Pages
pnpm pages:build

# Local preview of Cloudflare Pages build
pnpm pages:preview

# Deploy to Cloudflare Pages
pnpm pages:deploy
```

### Testing
```bash
# Unit/Integration tests (Jest + Testing Library)
pnpm test              # Run all tests
pnpm test:watch        # Interactive watch mode
pnpm test:coverage     # Generate coverage report (target: 80%+)

# E2E tests (Playwright)
pnpm test:e2e         # Run end-to-end tests
```

### Linting & Code Quality
```bash
pnpm lint             # ESLint code quality checks
```

---

## Component Structure

```
src/
├── app/
│   ├── (hub)/         # Hub root pages (sentradaya.com)
│   ├── (spokes)/       # Product spoke pages (*.sentradaya.com)
│   └── (dashboard)/    # Client tracking portal (dashboard.sentradaya.com)
├── components/
│   ├── ui/            # Radix UI primitives (Button, Dialog, etc.)
│   ├── forms/          # RFQ forms (B2G, B2B variants with multi-product cart)
│   └── shared/        # Reusable patterns, utilities
├── lib/
│   ├── api/            # API clients (Sanity, auth, notifications)
│   ├── db/             # Prisma ORM clients
│   ├── config/          # Environment variables, feature flags
│   ├── schema/         # Zod validation schemas (rfq-schemas.ts)
│   ├── store/          # Zustand stores (rfq-cart-store.ts)
│   └── middleware/     # Redirect engine, middleware utilities
└── styles/
    └── globals.css    # Shared Tailwind config (root-level, no local overrides)
```

---

## Deployment Phases

| Phase | Environment | Host | Commands |
|-------|-------------|------|----------|
| A (Current) | Development/Staging | Vercel (`dbsn-test01.vercel.app`) | `pnpm build`, `pnpm dev` |
| B (Planned) | Production | Cloudflare Pages (`sentradaya.com`) | `pnpm pages:build`, `pnpm pages:deploy` |

### Migration Checklist (Phase A → Phase B)
1. Run `pnpm pages:build` and verify compilation completes.
2. Deploy via `pnpm pages:deploy`.
3. Set environment variables in Cloudflare Pages Dashboard.
4. Configure custom domains and DNS CNAME records.
5. Update `NEXTAUTH_URL` to `https://sentradaya.com`.
6. Run GSC sitemap submission: `pnpm exec tsx scripts/gsc-submit-sitemap.ts`.
7. Verify subdomain routing and redirects on production domain.

---

## Cloudflare Pages Deployment

- **Wrangler Config**: `wrangler.toml` defines project (`dbsn-website`), compatibility flags, and environment variables.
- **Edge Compilation**: `@cloudflare/next-on-pages` writes to `.vercel/output/static`.
- **Edge Runtime**: All dynamic routes, API endpoints, and root layouts must export `const runtime = 'edge'`.
- **Windows Path Patch**: `patch-vercel-builder.js` normalizes backslashes and strips route groups from lambda maps.

---

## Vercel Deployment Notes

### Hub Subdomain Routing
- **Decision**: Return `NextResponse.next()` with custom headers (e.g., `x-middleware-subdomain: hub`) instead of rewriting to `/(hub)`.
- **Rationale**: Vercel compiles away route groups in production; rewriting to `/(hub)/path` triggers 404.
- **Negative Testing**: Block spoke sub-pages on Hub domain (e.g., `sentradaya.com/pju`) via `new NextResponse(null, { status: 404 })` in middleware.

### Edge Function Size Optimization
- **CRITICAL**: Do NOT dynamically import `prisma` inside Edge middleware (`src/middleware.ts`). Database binaries exceed Vercel's 1MB Edge limit.
- **Pattern**: Offload database lookups to `/api/redirects/lookup` and make lightweight loopback `fetch()` in middleware.

### Dev Server Deadlock Prevention
- Single-threaded dev servers deadlock on loopback `fetch()` in middleware.
- Wrap middleware `fetch()` in `AbortController` timeout (2000ms) for fast failure.

---

## Architecture Key Patterns

### Hub-and-Spoke Routing
- Subdomain resolution in `src/middleware.ts` before Next.js routing.
- Route groups: `(hub)`, `(spokes)`, `(dashboard)`.
- Spokes share route structure and UI components.
- Dashboard uses separate route group with authentication guards.

### Multi-Segment RFQ & Informational Routing
- Navigation: smooth-scroll on `/` home page, normal transition elsewhere.
- Products catalog (`/products`): aggregates 4 segments (PJUTS, Solar Cell, Lightning Protection, Battery Storage).
- Dynamic subdomain routing via `buildSpokeUrl` in `src/lib/utils/url.ts`.
- Portfolios (`/portfolio`) and Articles (`/articles`) use Sanity CMS + `<PortableText />`.
- Certifications grid with Radix-based modal viewer (PDF/Image).

### Content Federation (Sanity)
- All product/portfolio data in Sanity CMS.
- Prisma `Sanity` client queries CMS for spoke pages.
- Webhook-based cache invalidation on content changes.

### Multi-Tenant Data Access
- Row-level security via `users.tracking_scope_ids` (JSON array).
- `role=client` users see only rows where their ID is in `tracking_scope_ids`.
- `role=admin` / `role=viewer` have full access.

### RFQ Cart System
- **Store**: `src/lib/store/rfq-cart-store.ts` (Zustand with persist, key: `dbsn-rfq-cart`).
- **Mutators**: `addItem`, `removeItem`, `updateQuantity`, `updateItemNotes`, `clearCart`.
- **Selectors**: `selectItemCount`, `selectTotalQuantity`, `selectHasItem`, `selectCartItems`.
- **Hydration Guard**: `src/hooks/use-rfq-cart.ts` exports `useRfqCartHydrated()` to prevent SSR mismatches.
- **Forms**: `src/components/forms/RfqB2BForm.tsx`, `RfqB2GForm.tsx` use `react-hook-form` + `useFieldArray`.

### RFQ Submission Flow
- **Endpoint**: POST `/api/rfq` validates against `rfqB2BSchema` / `rfqB2GSchema` in `src/lib/schema/rfq-schemas.ts`.
- **Success**: Create lead in Postgres, enqueue notifications (`EMAIL_ACK`, `EMAIL_INTERNAL`, `TELEGRAM`).
- **Failure**: Return WhatsApp fallback URL + alert devs via Telegram.

### Authentication Flow
- **Config**: `src/lib/auth/auth.config.ts` (credentials provider, JWT session storage).
- **Middleware**: Matches sessions via cookie tokens, blocks unauthorized access.
- **Server Guards**: `src/lib/auth/auth-guard.ts` exports `getServerSession()`, `requireAuth()`, `requireDashboardAccess()`.
- **Route Handler**: `src/app/api/auth/[...nextauth]/route.ts`.

### 301 Redirect Engine
- **Engine**: `src/lib/middleware/redirect-engine.ts` exports `lookupRedirect(pathname, spoke)`.
- **Model**: `RedirectMap` in Prisma schema (fields: `legacyUrl`, `targetUrl`, `spoke`, `hitCount`).
- **Caching**: LRU cache (500 entries, 5-minute TTL) with negative caching.
- **Async Tracking**: Increments `hitCount` without blocking response.
- **Admin API**: `/api/admin/redirects` secured with `requireAuth('ADMIN')`.

### Google Search Console (GSC)
- **Verification**: DNS TXT record for domain property; dynamic `public/google{code}.html` for URL-prefix.
- **Sitemap Submit**: `scripts/gsc-submit-sitemap.ts` uses Node.js `crypto` for OAuth2 JWT assertions.
- **Run**: `pnpm exec tsx scripts/gsc-submit-sitemap.ts`.

---

## Environment Variables

| Variable | Description | Sensitivity |
|---------|-----------|----------|
| DATABASE_URL | Neon Postgres connection string | High |
| NEXTAUTH_SECRET | Auth.js v5 JWT signing secret | High |
| NEXTAUTH_URL | Auth.js v5 provider URL | High |
| SANITY_PROJECT_ID | Sanity CMS project ID | High |
| SANITY_API_READ_TOKEN | Sanity CMS read token | High |
| SANITY_WRITE_TOKEN | Sanity CMS write token | High |
| RESEND_API_KEY | Resend email API key | High |
| TELEGRAM_BOT_TOKEN | Telegram bot API token | High |
| API_KEY_21ST | 21st SDK authentication token | High |
| GA_TRACKING_ID | Google Analytics 4 tracking ID | Medium |
| GSC_SERVICE_ACCOUNT_JSON | Google Search Console service account | Medium |
| NODE_ENV | Environment (development, staging, production) | Medium |

Runtime validation: `src/lib/config/env.ts`.

---

## Documentation Index

Detailed guides in `/docs`:
- `docs/ONBOARDING.md` — Architectural deep-dive and first-day guide
- `docs/core/architecture/architecture.md` — System architecture and domain mappings
- `docs/core/architecture/middleware-routing.md` — Edge routing and subdomain resolution
- `docs/core/development/local-setup.md` — Local development environment setup
- `docs/core/development/testing-guide.md` — Jest and Playwright testing patterns
- `docs/core/development/sanity-cms-guide.md` — Sanity CMS integration and GROQ queries

---

## Integration Patterns

When integrating new features or third-party services:

1. **21st SDK Agent Chat Integration**:
   - *Frontend route*: `/chat` utilizing standard `<AgentChat />` client component from `@21st-sdk/nextjs`.
   - *Agent configuration*: `src/agents/my-agent/index.ts` with custom agent definition.
   - *Token handler endpoint*: POST `/api/an-token` fetching from `API_KEY_21ST` via `getTokenHandler`.
2. **CMS Integration**: Use Prisma `Sanity` client with proper GROQ queries.
3. **API Integration**: Implement error handling and retry logic.
3. **Analytics (GA4)**: Use standardized event taxonomy:
   - `RFQ_SUBMIT` — Successful RFQ submission (`segment`, `spoke`, `item_count`)
   - `RFQ_FALLBACK_WHATSAPP` — WhatsApp fallback after failed RFQ (`spoke`)
   - `PRODUCT_VIEW` — Product page viewed (`product_name`, `spoke`)
   - `FILE_DOWNLOAD` — Datasheet download (`file_name`, `file_type`)
   - `CONTACT_CLICK` — Contact/WhatsApp CTA clicked (`contact_type`, `location`)
   - `SPOKE_NAVIGATION` — Hub ↔ Spoke navigation (`spoke`, `source`)
4. **Notification Integration**: Use `NotificationQueue` in `src/lib/api/notifications/queue.ts` for resilient delivery with exponential backoff.
5. **Authentication**: Wire NextAuth handlers with proper RBAC enforcement.
6. **Monitoring**: Integrate Sentry for error tracking.

---

## Notes

- **Hub-and-Spoke**: All subdomains run from a single Next.js codebase.
- **No Code Forks**: Differentiation is content-driven via Sanity CMS and routing.
- **Shared Design System**: Tailwind config at repo root is the single source of truth.
- **Mobile-First**: All UI tested on 375px minimum viewport.
- **Performance Target**: PSI mobile score 90+ on all key pages is a launch gate requirement.
- **File Naming**: `kebab-case` for files/folders, PascalCase for components.
- **TDD Approach**: 80%+ test coverage goal.
- **Error Handling**: `try/catch` with descriptive errors; Zod for input validation.

---

*Generated: 2026-06-11*
*Status: Production Ready — Phase 3 features (Notification Queue, Cloudflare Pages Deployment, 301 Redirect Engine, SEO Migration, GA4 event tracking, GSC verification, Sentry monitoring) completed and fully documented*
