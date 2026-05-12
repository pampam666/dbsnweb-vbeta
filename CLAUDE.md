# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

DBSN (PT. Daya Berkah Sentosa Nusantara) is consolidating three legacy WordPress websites into a single Next.js 15 application. The new platform serves B2G (government procurement) and B2B (private sector) clients in Indonesia's renewable energy and electrical infrastructure market.

**Status**: Documentation phase - no code implementation exists yet.

## Architecture

**Hub-and-Spoke Model** with single Next.js 15 app using middleware-based subdomain routing:

- **Hub**: `sentradaya.com` - Corporate trust center (certifications, portfolio, company info)
- **Product Spokes**: `pju.sentradaya.com`, `solarcell.sentradaya.com`, `alatpetir.sentradaya.com`, `baterai.sentradaya.com`
- **Dashboard**: `dashboard.sentradaya.com` - Authenticated client tracking portal

All subdomains are served from a **single codebase**. Differentiation is data-driven via Sanity CMS and middleware routing, not code forks.

## Tech Stack

| Layer | Technology |
|--------|-------------|
| Runtime | Next.js 15 (App Router) |
| Package Manager | pnpm |
| Content CMS | Sanity.io |
| UI System | Tailwind CSS + Radix UI (shadcn/ui patterns) |
| Transactional DB | Neon Postgres via Prisma ORM |
| Authentication | Auth.js v5 |
| Hosting | Cloudflare Pages (edge + CDN) |
| Notifications | Resend (email) + Telegram Bot API |
| Analytics | GA4 + GSC + Cloudflare Analytics |
| Phase 2 | Sentry (errors) + PostHog (session replay) |

## Key Architectural Decisions

1. **Shared Design System**: Single Tailwind config at repo root. No spoke may override tokens.
2. **Subdomain Routing**: Middleware-based hostname resolution maps requests to route groups (hub, spokes, auth).
3. **SEO Migration**: Legacy domains (`pjusolarcellindonesia.com`, `sentradaya.com` legacy, `alatpenangkalpetir.co.id`) must 301 redirect via `redirect_map` table.
4. **Mobile-First**: PSI 90+ target on key templates. Floating WhatsApp CTA must NOT occlude RFQ forms.
5. **Graceful Fallback**: RFQ API failure triggers WhatsApp pre-fill URL with captured form data.
6. **Row-Level Auth**: Client dashboard users see only their `tracking_scope_ids` linked via `linked_lead_id`.

## Data Layer

### Sanity CMS (Content)
Document types: `Product`, `Certification`, `PortfolioEntry`, `SpokeConfig`, `Page`

### Neon Postgres (Transactional)
Tables via Prisma: `leads`, `users`, `redirect_map`

Key fields:
- `leads.segment`: `B2G` | `B2B`
- `users.role`: `ADMIN` | `VIEWER` | `CLIENT`
- `users.tracking_scope_ids`: JSON array of authorized project/order IDs

## User Segments

| Segment | Persona | Primary Need |
|--------|---------|--------------|
| **B2G** | PPK / Pengadaan / BUMN officers | Validate SNI/TKDN/LKPP compliance, verify portfolio, submit formal RFQ |
| **B2B** | Procurement / EPC / Facility managers | Research specs, download datasheets, request quote or WhatsApp contact |

## Critical Launch Gates

1. **RFQ Fallback Test**: Force DB connection failure, verify WA pre-fill + Telegram alert fires
2. **Dashboard Isolation Test**: Verify client cannot access another client's tracking data
3. **301 Coverage Audit**: Zero unresolved 404s from legacy URL inventory
4. **PSI Mobile 90+**: Hub, spoke landing, PDP, RFQ, dashboard login, tracking pages

## Documentation

All architecture and strategy documentation is in `docs/core/`:
- `architecture/architecture.md` - Full system architecture with build order
- `prd/prd-v3.md` - Complete product requirements
- `business-context/DBSN_Bussiness-Context.md` - Strategic analysis
- `information-architecture/` - IA strategy, sitemaps, user flows

## ECC Plugin

The `ecc@ecc` plugin is installed and enabled for additional capabilities. Use `/plugins` to access skill menus.
