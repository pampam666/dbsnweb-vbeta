# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**DBSN Centralized Digital Ecosystem** — A Next.js 16.2.6 hub-and-spoke platform consolidating three legacy WordPress domains into a single codebase with unified design system, CMS, transactional database, and authenticated client tracking portal.

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
| Runtime | Next.js 16.2.6 (App Router) | Application framework, routing, middleware |
| Package Manager | npm | Dependency management |
| Content CMS | Sanity.io | Headless CMS, product/portfolio data, content federation |
| Transactional DB | Neon Postgres via Prisma ORM | Leads, users, tracking data, redirect mappings |
| Authentication | Auth.js v5 | Session management, RBAC (`admin`, `viewer`, `client`) |
| UI System | Tailwind CSS + Radix UI (shadcn/ui patterns) | Shared design tokens, accessible components |
| State Management | Zustand (persist middleware) | Client-side state persistence (RFQ cart) |
| Hosting | Cloudflare Pages | Edge delivery, CDN, middleware-based routing, 301 redirects |
| Notifications | Resend (email) + Telegram Bot API + WhatsApp Fallback | RFQ alerts, failure notifications |
| Analytics | GA4 + GSC + Cloudflare Analytics | Unified telemetry |
| Phase 2 | Sentry (errors) + PostHog (session replay) | Error tracking, user behavior analytics |

### Data Flow Architecture

```
Sanity CMS ──────┐
│                          │
│   Content (Product,      │
│   Portfolio, Page)      │
└─────────────────────────┼────→ Prisma ORM → Neon Postgres
                                       │
                        │
                        ↓
┌─────────────────────────┐   │
│   Auth.js v5          │
│ (Session + RBAC)       │
│        ↓
│  Next.js API Routes   │
└─────────────────────────┘   │
                        │
                        ↓
└─────────────────────────┐   │
│   Cloudflare (301, Hosting, Edge)
└─────────────────────────┘   │
                                      ↓
                              Notifications (Resend + Telegram)
```

---

## Component Structure

```
src/
├── app/
│   ├── (hub)/         # Hub root pages
│   ├── (spokes)/       # Product spoke pages
│   └── (dashboard)/    # Client tracking portal
├── components/
│   ├── ui/            # Radix UI primitives (Button, Dialog, etc.)
│   ├── forms/          # RFQ forms (B2G, B2B variants with multi-product cart)
│   └── shared/        # Reusable patterns, utilities
├── lib/
│   ├── api/            # API clients (Sanity, auth, database)
│   ├── db/             # Prisma ORM clients
│   ├── config/          # Environment variables, feature flags
│   ├── schema/         # Zod validation schemas (rfq-schemas.ts)
│   └── store/          # Zustand stores (rfq-cart-store.ts)
└── styles/
    └── globals.css    # Shared Tailwind config (root-level, no local overrides)
```

---

## Development Workflow

### Build & Development
```bash
# Install dependencies
npm install

# Development server
npm run dev

# Production build
npm run build

# Compile Next.js edge build for Cloudflare Pages
npm run pages:build

# Local preview of Cloudflare Pages build (wrangler dev)
npm run pages:preview

# Deploy to Cloudflare Pages (manual CLI)
npm run pages:deploy
```

### Cloudflare Pages Deployment Pipeline
- **Wrangler Config**: Root-level `wrangler.toml` defines the page project name (`dbsn-website`), compatibility date, edge compatibility flag (`nodejs_compat`), and environment variables under `[vars]`.
- **Edge Compilation**: Build process compiles via `@cloudflare/next-on-pages` writing to `.vercel/output/static`.
- **Edge Runtime**: All dynamic routes, API endpoints, and root layout must export `const runtime = 'edge'` to render correctly on Cloudflare Workers edge.
- **Windows Path Patch**: Build processes running on Windows utilize a custom Vercel CLI cache patching script (`patch-vercel-builder.js`) that normalizes backslashes to forward slashes and strips Next.js route groups (`(hub)`/`(spokes)`) from lambda routing maps to prevent symlink conflicts (`EEXIST`).

### Testing
```bash
# Run tests
npm test

# Test coverage report
npm run test:coverage
```

### Linting & Code Quality
```bash
# ESLint
npm run lint

---

## Architecture Key Patterns

### Hub-and-Spoke Routing
- Subdomain resolution happens in middleware before Next.js routing
- Route groups: `(hub)`, `(spokes)`, `(dashboard)`
- Spokes share same route structure and UI components
- Dashboard uses separate route group with authentication guards

### Content Federation (Sanity)
- All product and portfolio data stored in Sanity CMS
- Prisma `Sanity` client queries CMS for product/portfolio lookups in spoke pages
- Content changes trigger webhook-based cache invalidation

### Multi-Tenant Data Access
- Row-level security via `users.tracking_scope_ids` (JSON array of authorized project/order IDs)
- Dashboard users (`role=client`) can only read rows where their user ID is in `tracking_scope_ids`
- Admin users (`role=admin` or `role=viewer`) have full system access

### RFQ Cart System
- **State Management**: Zustand store (`src/lib/store/rfq-cart-store.ts`) with `persist` middleware (`dbsn-rfq-cart` localStorage key).
  - Mutators: `addItem` (validates with `rfqCartItemSchema`, merges duplicate product+variant keys, and clamps quantity), `removeItem`, `updateQuantity`, `updateItemNotes`, and `clearCart`.
  - Slice Selectors (optimizes renders): `selectItemCount`, `selectTotalQuantity`, `selectHasItem`, `selectCartItems`.
- **SSR Hydration Guard**: Hydration hook (`src/hooks/use-rfq-cart.ts`) exports `useRfqCartHydrated()`. Returns `true` only after Zustand has loaded state from localStorage, preventing SSR hydration mismatches.
- **Dynamic Forms Integration**: Checkout forms (`src/components/forms/RfqB2BForm.tsx`, `src/components/forms/RfqB2GForm.tsx`) use `react-hook-form` + `useFieldArray` bound to the cart `items` array.
  - While hydrating: renders a loading skeleton (`aria-label="loading rfq form"`).
  - If cart is empty: renders an Empty Cart view with a CTA to browse products.
  - Actions (quantity updates, notes, removal) instantly trigger store mutations to keep Zustand and the form in sync.

### RFQ Submission Flow
- **REST Endpoint**: POST `/api/rfq` accepts flat composite JSON payloads validated against `rfqB2BSchema` or `rfqB2GSchema` (schema located in `src/lib/schema/rfq-schemas.ts`). Endpoint code is at `src/app/api/rfq/route.ts`.
- **Infrastructure**: On success, leads are created in Postgres and non-blocking notifications are triggered: email acknowledgment/internal alert (`src/lib/api/notifications/resend.ts`) and Telegram bot notification (`src/lib/api/notifications/telegram.ts`).
- **Resilience / Fallback**: On failure, the API returns a `fallback_url` built by `src/lib/api/notifications/whatsapp.ts` to redirect to WhatsApp sales prefill, and alerts devs via Telegram.

### Authentication Flow
- **Session Management**: Auth.js v5 configured via `src/lib/auth/auth.config.ts`, using a custom credentials provider and JWT session storage.
- **Route Protection**: Middleware matches sessions using cookie session tokens and blocks access.
- **Server Guards**: Exported from `src/lib/auth/auth-guard.ts` (`getServerSession()`, `requireAuth()`, `requireDashboardAccess()`, `checkDashboardAccess()`) to secure server routes/components and query access permissions.
- **Route handlers wrapper**: NextAuth endpoint is located at `src/app/api/auth/[...nextauth]/route.ts`.

### Database Singleton Client
- **Location**: `src/lib/db/prisma.ts` exports the active `prisma` client.
- **Pattern**: Implements a global client wrapper (`globalThis.__prisma`) in non-production environments to prevent creating multiple connections during Next.js hot-reloading.

### 301 Redirect Engine
- **Engine Location**: `src/lib/middleware/redirect-engine.ts` exports `lookupRedirect(pathname, spoke)`.
- **Database Model**: Stores mappings in Postgres using the `RedirectMap` Prisma model (fields: `legacyUrl` (ID), `targetUrl`, `spoke`, `hitCount`).
- **Caching**: Features an in-memory LRU cache (limit 500 entries) with a 5-minute TTL and negative caching for misses to protect DB performance.
- **Asynchronous Tracking**: Increments `hitCount` on matching redirects asynchronously without blocking the hot path response.
- **Middleware Integration**: Intercepts requests in `src/middleware.ts` before subdomain routing, preserving search parameters (e.g., `?ref=...`).
- **Admin Management API**: CRUD API route at `src/app/api/admin/redirects/route.ts` secured with `requireAuth('ADMIN')` for listing, creating, and deleting mappings, which automatically flushes the engine's cache on mutation.

### Google Search Console (GSC) Verification & Sitemap Submission
- **Verification Support**: Supports domain-wide property verification via DNS TXT record. For URL-prefix fallbacks, the platform dynamically generates a verification file (`public/google{code}.html` generated during build/dev initialization via `next.config.ts`) and renders a fallback `<meta name="google-site-verification" ... />` tag in the root layout `<head>`.
- **Sitemap Submitter**: Operational script at `scripts/gsc-submit-sitemap.ts` uses native Node.js cryptography (`crypto` module) to sign Google OAuth2 JWT assertions. It programmatically registers sitemaps for the Domain Property (`sc-domain:sentradaya.com`) and individual spoke URL prefixes. Run via `npx tsx scripts/gsc-submit-sitemap.ts`.

---

## Key Dependencies

| Dependency | Version | Purpose |
|----------|--------|---------|
| next-auth | ^5.0.0-beta.31 | Auth.js v5, session management |
| @auth/prisma-adapter | ^2.11.2 | Database adapter mapping Auth.js to Prisma |
| @prisma/client | ^6.19.3 | Prisma ORM, Neon Postgres client |
| @sanity/client | ^7.22.0 | Sanity CMS client |
| zustand | ^4.5.0 | State management with persist middleware |
| @radix-ui/react-slot | ^1.2.4 | Radix UI slot primitive |
| @radix-ui/react-dialog | ^1.1.15 | Radix UI dialog component |
| @radix-ui/react-select | ^2.2.6 | Radix UI select component |
| @radix-ui/react-tabs | ^1.1.13 | Radix UI tabs component |
| tailwindcss | ^4 | Tailwind CSS v4 CSS framework |
| resend | ^6.12.4 | Email SDK client |
| zod | ^4.4.3 | Schema validation |

---

## Environment Variables

Required environment variables must be set before running in application:

| Variable | Description | Sensitivity |
|---------|-----------|----------|
| DATABASE_URL | Neon Postgres connection string | High |
| NEXTAUTH_SECRET | Auth.js v5 secret for JWT signing | High |
| NEXTAUTH_URL | Auth.js v5 provider URL | High |
| SANITY_PROJECT_ID | Sanity CMS project ID | High |
| SANITY_API_READ_TOKEN | Sanity CMS read token | High |
| SANITY_WRITE_TOKEN | Sanity CMS write token | High |
| RESEND_API_KEY | Resend email API key | High |
| TELEGRAM_BOT_TOKEN | Telegram bot API token | High |
| GA_TRACKING_ID | Google Analytics 4 tracking ID | Medium |
| GSC_SERVICE_ACCOUNT_JSON | Google Search Console service account | Medium |
| NODE_ENV | Environment (development, staging, production) | Medium |

---

## Integration Points

When integrating new features or third-party services, follow these integration patterns:

1. **CMS Integration** — Use Prisma `Sanity` client with proper GROQ queries
2. **API Integration** — Implement proper error handling and retry logic
3. **Analytics Integration** — Use GA4 event naming consistent with PRD v3.1. Standardized taxonomy:
   - `RFQ_SUBMIT`: Fired on successful RFQ submission (parameters: `segment`, `spoke`, `item_count`).
   - `RFQ_FALLBACK_WHATSAPP`: Fired when user clicks the WhatsApp fallback link after a failed RFQ submission (parameters: `spoke`).
   - `PRODUCT_VIEW`: Fired when a product page is viewed (parameters: `product_name`, `spoke`).
   - `FILE_DOWNLOAD`: Fired when clicking a product datasheet download link (parameters: `file_name`, `file_type`).
   - `CONTACT_CLICK`: Fired when clicking contact or WhatsApp CTA links/buttons (parameters: `contact_type`, `location`).
   - `SPOKE_NAVIGATION`: Fired when navigating between the hub and spokes or spoke subdomains (parameters: `spoke`, `source`).
4. **Notification Integration** — Use the database-backed `NotificationQueue` (`src/lib/api/notifications/queue.ts`) to enqueue jobs (`EMAIL_ACK`, `EMAIL_INTERNAL`, `TELEGRAM`) for resilient delivery with exponential backoff and terminal failure Telegram admin alerts.
5. **WhatsApp Fallback Engine** — Serialize captured RFQ fields to wa.me prefill format
6. **Authentication Integration** — Wire NextAuth route handlers with proper RBAC enforcement
7. **Phase 2 Monitoring** — Integrate Sentry for error tracking and PostHog for session replay

---

## Notes

This is a **hub-and-spoke architecture** — all subdomains run from a single Next.js codebase
- **No code forks** — differentiation is content-driven via Sanity CMS and routing, not separate implementations
- **Shared design system** — Tailwind config at repo root is single source of truth for all UI
- **Mobile-first** — All UI components must be tested on 375px minimum viewport
- **Performance targets** — PSI mobile score 90+ on all key pages is a launch gate requirement

---

*Generated: 2026-06-04*
*Status: Production Ready — Phase 3 features (Notification Queue, Cloudflare Pages Deployment, 301 Redirect Engine, SEO Migration, GA4 event tracking, and GSC verification) completed and fully documented*
