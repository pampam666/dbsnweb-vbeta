# ══════════════════════════════════════════════════════════════════════
# ECC EXECUTION PROMPT — Production Documentation Update
# Protocol: Antigravity Guide v2.1.0 | Framework: RISEN
# Scope: DOCUMENTATION ONLY — ZERO CODEBASE EDITS
# ══════════════════════════════════════════════════════════════════════

# ─────────────────────────────────────────────────────────────────────
# ECC CONTEXT ANCHORS
# ─────────────────────────────────────────────────────────────────────
- Primary Agent: [doc-updater.md](file:///d:/CLAUDE-PROJECT/website/.gemini/skills/doc-updater.md)
- Domain Skills:
  - [seo/SKILL.md](file:///d:/CLAUDE-PROJECT/website/.gemini/skills/seo/SKILL.md)
  - [frontend-patterns/SKILL.md](file:///d:/CLAUDE-PROJECT/website/.gemini/skills/frontend-patterns/SKILL.md)
  - [nextjs-turbopack/SKILL.md](file:///d:/CLAUDE-PROJECT/website/.gemini/skills/nextjs-turbopack/SKILL.md)
- Rule Sets:
  - [AGENTS.md](file:///d:/CLAUDE-PROJECT/website/.agent/AGENTS.md)
  - [GEMINI.md](file:///d:/CLAUDE-PROJECT/website/GEMINI.md)

- Source Files (READ-ONLY — for verifying doc accuracy):
  - [src/app/layout.tsx](file:///d:/CLAUDE-PROJECT/website/src/app/layout.tsx)
  - [src/middleware.ts](file:///d:/CLAUDE-PROJECT/website/src/middleware.ts)
  - [src/lib/middleware/config.ts](file:///d:/CLAUDE-PROJECT/website/src/lib/middleware/config.ts)
  - [src/lib/middleware/redirect-engine.ts](file:///d:/CLAUDE-PROJECT/website/src/lib/middleware/redirect-engine.ts)
  - [src/lib/config/env.ts](file:///d:/CLAUDE-PROJECT/website/src/lib/config/env.ts)
  - [src/app/(hub)/layout.tsx](file:///d:/CLAUDE-PROJECT/website/src/app/(hub)/layout.tsx)
  - [src/app/(hub)/page.tsx](file:///d:/CLAUDE-PROJECT/website/src/app/(hub)/page.tsx)
  - [src/components/shared/Navbar.tsx](file:///d:/CLAUDE-PROJECT/website/src/components/shared/Navbar.tsx)
  - [src/components/shared/Footer.tsx](file:///d:/CLAUDE-PROJECT/website/src/components/shared/Footer.tsx)
  - [src/components/shared/GoogleAnalytics.tsx](file:///d:/CLAUDE-PROJECT/website/src/components/shared/GoogleAnalytics.tsx)
  - [next.config.ts](file:///d:/CLAUDE-PROJECT/website/next.config.ts)
  - [package.json](file:///d:/CLAUDE-PROJECT/website/package.json)
  - [wrangler.toml](file:///d:/CLAUDE-PROJECT/website/wrangler.toml)
  - [.env.example](file:///d:/CLAUDE-PROJECT/website/.env.example)

- Documentation Files (WRITE TARGET — these are the files you will update):
  - [docs/core/architecture/middleware-routing.md](file:///d:/CLAUDE-PROJECT/website/docs/core/architecture/middleware-routing.md)
  - [docs/core/development/local-setup.md](file:///d:/CLAUDE-PROJECT/website/docs/core/development/local-setup.md)
  - [docs/core/development/cloudflare-deployment.md](file:///d:/CLAUDE-PROJECT/website/docs/core/development/cloudflare-deployment.md)
  - [docs/core/development/vercel-deployment.md](file:///d:/CLAUDE-PROJECT/website/docs/core/development/vercel-deployment.md) — NEW FILE
  - [docs/core/project-roadmap.md](file:///d:/CLAUDE-PROJECT/website/docs/core/project-roadmap.md)
  - [docs/CODEMAPS/architecture.md](file:///d:/CLAUDE-PROJECT/website/docs/CODEMAPS/architecture.md)
  - [docs/CODEMAPS/frontend.md](file:///d:/CLAUDE-PROJECT/website/docs/CODEMAPS/frontend.md)

# ─────────────────────────────────────────────────────────────────────
# TOOL PIPELINE (Execute in order)
# ─────────────────────────────────────────────────────────────────────
1. tracker_create_task: "Update Production Documentation for Hub Navigation"
   - Sub-task 1: "Research current codebase state (read-only)"
   - Sub-task 2: "Update architecture & middleware documentation"
   - Sub-task 3: "Update development guides & create Vercel deployment doc"
   - Sub-task 4: "Update CODEMAPS & project roadmap"
2. activate_skill: doc-updater
3. enter_plan_mode: "Research all source files to verify documentation accuracy"

# ─────────────────────────────────────────────────────────────────────
# CRITICAL CONSTRAINT — READ THIS FIRST
# ─────────────────────────────────────────────────────────────────────
#
# YOU MUST NOT EDIT ANY FILE OUTSIDE OF docs/
#
# This prompt is DOCUMENTATION-ONLY. You will:
#   ✅ READ source files in src/, next.config.ts, package.json, etc.
#   ✅ WRITE/UPDATE files ONLY under docs/
#   ❌ NEVER edit src/*, next.config.ts, middleware.ts, package.json,
#      .env, wrangler.toml, or ANY other codebase file.
#
# If you find a code issue during research, DOCUMENT IT in the
# appropriate doc file as a "Known Issue" — do NOT fix it.
#
# ─────────────────────────────────────────────────────────────────────

# ─────────────────────────────────────────────────────────────────────
# TASK: RISEN Framework Applied
# ─────────────────────────────────────────────────────────────────────

## ROLE
You are the ECC Doc Updater Agent operating as a technical documentation
specialist. You are updating ALL production documentation under `docs/`
to accurately reflect the current state of the DBSN codebase — including
known issues, current deployment phase, and the Vercel testing setup.

## INSTRUCTIONS

### Current Deployment Context
- **Current Phase**: Testing on Vercel at `dbsn-test01.vercel.app`
- **Future Phase**: Production on Cloudflare Pages at `sentradaya.com`
- **Cloudflare Status**: Configuration preserved but NOT active. The project
  currently deploys via Vercel's standard Next.js integration.
- **Local Dev**: `npm run dev` at `localhost:3000` (also `lvh.me:3000` for subdomains)

### Known Issues to Document (DO NOT FIX — only document)
1. **Single Page Display**: The Hub website currently only displays 1 page
   on both Vercel and local dev. Root cause is `export const runtime = 'edge'`
   in root layout combined with Prisma usage in the redirect engine.
2. **Edge Runtime Conflict**: `src/app/layout.tsx` declares Edge runtime
   which cascades to all child routes. Prisma Client requires Node.js runtime.
3. **Redirect Engine**: `src/lib/middleware/redirect-engine.ts` imports Prisma
   which cannot run on Edge. This causes middleware failures on navigation.

### Hub Pages (all exist in codebase, documented for reference)
| Route | File | Sections |
|---|---|---|
| `/` | `src/app/(hub)/page.tsx` | Hero, About, Products, Portfolio, Certs, Process, Testimonials, Articles, FAQ, CTA, Contact |
| `/about` | `src/app/(hub)/about/page.tsx` | Full about page |
| `/products` | `src/app/(hub)/products/page.tsx` | Products catalog |
| `/portfolio` | `src/app/(hub)/portfolio/page.tsx` | Portfolio grid + `[slug]` detail |
| `/certifications` | `src/app/(hub)/certifications/page.tsx` | Certifications grid |
| `/contact` | `src/app/(hub)/contact/page.tsx` | Contact form |
| `/faq` | `src/app/(hub)/faq/page.tsx` | FAQ accordion |
| `/articles` | `src/app/(hub)/articles/page.tsx` | Articles grid + `[slug]` detail |

### Navigation Components (for documentation accuracy)
- **Navbar** links: Beranda(/), Tentang(/about), Produk(/#produk),
  Portofolio(/#portofolio), Sertifikasi(/certifications), Kontak(/contact)
- **Footer** links: /about, /portfolio, /certifications, /contact, /faq, /#produk

## STEPS (Execute Sequentially)

### STEP 1: Research Current State (enter_plan_mode — READ ONLY)

Read the following files to understand the current codebase state.
DO NOT MODIFY ANY OF THEM.

1. Read `src/app/layout.tsx` — Note the `export const runtime = 'edge'` on line 6
2. Read `src/middleware.ts` — Note the full routing flow (6 steps)
3. Read `src/lib/middleware/config.ts` — Note all domain resolution functions
4. Read `src/lib/middleware/redirect-engine.ts` — Note the Prisma import
5. Read `src/lib/config/env.ts` — Note the middleware env schema
6. Read `src/components/shared/Navbar.tsx` — Note the navLinks array
7. Read `src/components/shared/Footer.tsx` — Note the footerLinks array
8. Read `next.config.ts` — Note allowedDevOrigins
9. Read `package.json` — Note scripts and dependencies
10. Read `wrangler.toml` — Note Cloudflare configuration
11. Read `.env.example` — Note required environment variables

**Gate**: Confirm you have read all 11 files before proceeding to Step 2.
Do NOT write any files in Step 1.

### STEP 2: Update Architecture & Middleware Documentation

#### 2A. Update `docs/core/architecture/middleware-routing.md`
**Action**: Edit the existing file. Add/update these sections:

1. **Add section "## Current Deployment Phase"** (after Overview):
   - State that the project is in Testing Phase on Vercel.
   - The Hub URL is `dbsn-test01.vercel.app`.
   - Cloudflare Pages deployment is deferred to Production Phase.

2. **Update the "## Vercel Preview" column** in the Domain Map table:
   - Clarify `dbsn-test01.vercel.app` is the designated test root.
   - Note that `localhost` and `127.0.0.1` are treated as Hub domains.

3. **Add section "## Known Issues"** (before Related Documentation):
   - Document the Edge Runtime + Prisma conflict:
     - `src/app/layout.tsx` declares `export const runtime = 'edge'`
     - `src/lib/middleware/redirect-engine.ts` imports Prisma Client
     - Prisma requires Node.js runtime, creating a cascade failure
     - This causes only 1 page to display on both Vercel and localhost
   - Document that the fix requires:
     - Removing `export const runtime = 'edge'` from root layout
     - Making redirect-engine Edge-safe (dynamic import or graceful fallback)

4. **Add section "## Edge Runtime Audit"** with a table:
   | File | Has Edge Runtime | Uses Prisma/Node | Status |
   |---|---|---|---|
   | `src/app/layout.tsx` | Yes (line 6) | Children do | ⚠️ Must remove |
   | `src/app/robots.ts` | Yes (line 5) | No | ✅ Safe |
   | `src/app/sitemap.ts` | Yes (line 6) | No | ✅ Safe |
   | `src/app/api/auth/[...nextauth]/route.ts` | Yes (line 3) | Check adapter | ⚠️ Audit |
   | `src/app/api/rfq/route.ts` | Yes (line 9) | Check | ⚠️ Audit |
   | `src/app/api/revalidate/route.ts` | Yes (line 6) | Check | ⚠️ Audit |
   | `src/app/api/cron/notifications/route.ts` | Yes (line 5) | Check | ⚠️ Audit |

5. Update "Last modified" date to `2026-06-10`.

#### 2B. Update `docs/core/architecture/architecture.md`
**Action**: If this file exists and contains relevant architecture info,
add the "Current Deployment Phase" context. If it only covers code
architecture, skip this sub-step.

### STEP 3: Update Development Guides & Create Vercel Deployment Doc

#### 3A. Update `docs/core/development/local-setup.md`
**Action**: Edit the existing file. Add/update these sections:

1. **Add section "## Vercel Preview Testing"** (after the lvh.me section):
   - Explain that the Hub is accessible at `dbsn-test01.vercel.app`.
   - Note that the middleware automatically handles `.vercel.app` domains.
   - Explain how `extractSubdomain` in `config.ts` detects Vercel domains.
   - Add a table showing Vercel test URLs:
     | Purpose | Vercel URL |
     |---|---|
     | Hub | `dbsn-test01.vercel.app` |
     | PJU Spoke | `pju.dbsn-test01.vercel.app` (requires DNS) |
     | Dashboard | `dashboard.dbsn-test01.vercel.app` (requires DNS) |
   - Note: Spoke and Dashboard subdomains on Vercel require custom
     domain configuration (not available in free testing phase).

2. **Add troubleshooting entry "### Only one page displays"**:
   ```markdown
   ### Only one page displays

   **Symptom**: The homepage loads but clicking navigation links shows
   blank pages or 404 errors.

   **Root Cause**: `export const runtime = 'edge'` in `src/app/layout.tsx`
   forces all pages into Edge Runtime. The redirect engine
   (`src/lib/middleware/redirect-engine.ts`) imports Prisma Client which
   requires Node.js runtime. This conflict causes the middleware to fail
   silently on subsequent navigations.

   **Fix**:
   1. Remove `export const runtime = 'edge'` from `src/app/layout.tsx`
   2. Make the redirect engine Edge-safe by using dynamic import with
      graceful fallback
   3. Run `npm run build` to verify the fix
   ```

3. Update "Last modified" date to `2026-06-10`.

#### 3B. Update `docs/core/development/cloudflare-deployment.md`
**Action**: Edit the existing file:

1. **Verify the IMPORTANT banner** at the top (lines 3-6) says:
   "The project is currently in Development Phase (Phase A) hosted on
   Vercel at `dbsn-test01.vercel.app`."
   If it already says this, leave it. If not, update it.

2. **Add section "## Current Testing Phase (Vercel)"** at the top,
   right after the IMPORTANT banner:
   - State that the project is NOT yet deployed on Cloudflare.
   - The current testing deployment is on Vercel at `dbsn-test01.vercel.app`.
   - All Cloudflare-specific configs (wrangler.toml, pages:build,
     pages:preview, pages:deploy) are preserved but NOT active.
   - The migration to Cloudflare will happen after Phase 4 Quality Gates pass.
   - Cross-reference the new `vercel-deployment.md` guide.

3. Update "Last modified" date to `2026-06-10`.

#### 3C. Create `docs/core/development/vercel-deployment.md` (NEW FILE)
**Action**: Create a new file with the following content structure:

```markdown
# Vercel Deployment Guide (Testing Phase)

**Purpose:** Deployment reference for the Vercel testing phase
**Status:** Active — Current deployment at `dbsn-test01.vercel.app`
**Phase:** Development Phase A (pre-production)

---

## Overview

The DBSN website is currently deployed on Vercel for testing and preview
purposes. This is a temporary deployment before migrating to the production
target: Cloudflare Pages at `sentradaya.com`.

### Why Vercel First?
- Faster iteration during development
- Native Next.js support without adapter (`@cloudflare/next-on-pages`)
- Free preview deployments on every git push
- No custom domain or DNS configuration needed for Hub testing

---

## Deployment URL

| Environment | URL | Purpose |
|---|---|---|
| Production Preview | `dbsn-test01.vercel.app` | Hub website testing |
| Branch Previews | `{branch}-{hash}.vercel.app` | Per-branch previews |
| Local Development | `localhost:3000` | Local dev server |
| Local Subdomains | `lvh.me:3000` | Subdomain routing testing |

---

## How to Deploy

### Automatic (Recommended)
1. Push to the `main` branch: `git push origin main`
2. Vercel auto-deploys from the GitHub repository.
3. Preview at `dbsn-test01.vercel.app`.

### Manual (Vercel CLI)
[bash]
npx vercel --prod
[/bash]

---

## Environment Variables

Set these in the Vercel Dashboard under
**Settings > Environment Variables**:

| Variable | Required | Example | Notes |
|---|---|---|---|
| `SANITY_PROJECT_ID` | Yes | `3h4k8dye` | Sanity CMS project |
| `SANITY_DATASET` | Yes | `production` | Sanity dataset |
| `SANITY_API_VERSION` | Yes | `v2026-05-21` | API version |
| `SANITY_API_READ_TOKEN` | Yes | `sk...` | **Encrypted** |
| `DATABASE_URL` | Optional | `postgresql://...` | Neon Postgres (for redirects) |
| `NEXTAUTH_SECRET` | Optional | `...` | JWT encoder (for dashboard) |
| `NEXTAUTH_URL` | Optional | `https://dbsn-test01.vercel.app` | Auth callback |
| `SENTRY_AUTH_TOKEN` | Optional | `...` | Error tracking |
| `SENTRY_ORG` | Optional | `pt-daya-berkah-sentosa-nusanta` | Sentry org |
| `SENTRY_PROJECT` | Optional | `javascript-nextjs` | Sentry project |

> **Note:** Variables marked "Optional" are for features not yet
> active in the testing phase. The website will function without them.

---

## Known Limitations (vs. Production)

| Feature | Vercel Testing | Cloudflare Production |
|---|---|---|
| Hub pages | ✅ Works | ✅ Will work |
| Spoke subdomains | ❌ Requires custom domain | ✅ Via CNAME records |
| Dashboard | ❌ Requires custom domain | ✅ Via CNAME records |
| 301 Redirects | ⚠️ Requires DATABASE_URL | ✅ Full support |
| Edge Runtime | ⚠️ Partial (see Known Issues) | ✅ Native Workers |
| Custom domain | ❌ Not configured | ✅ sentradaya.com |

---

## Known Issues

### Only 1 Page Displays
The Hub currently shows only the homepage. Clicking navigation links
results in blank pages or errors. See the troubleshooting section in
[local-setup.md](./local-setup.md#only-one-page-displays) for root
cause analysis and fix instructions.

---

## Relationship to Cloudflare Deployment

This guide is for the **testing phase only**. The production deployment
target is Cloudflare Pages. See [cloudflare-deployment.md](./cloudflare-deployment.md)
for the production deployment guide.

**Migration checklist** (for when Vercel → Cloudflare migration happens):
- [ ] All Phase 4 Quality Gates passed
- [ ] Custom domain `sentradaya.com` configured on Cloudflare
- [ ] DNS CNAME records for all subdomains
- [ ] Environment variables migrated to Cloudflare Dashboard
- [ ] `npm run pages:build` succeeds with `@cloudflare/next-on-pages`
- [ ] Edge Runtime compatibility verified

---

*Last modified: 2026-06-10*
```

### STEP 4: Update CODEMAPS & Project Roadmap

#### 4A. Update `docs/CODEMAPS/architecture.md`
**Action**: Edit the existing file:

1. **Update the System Topology diagram** (lines 10-34):
   - Change `Cloudflare Edge` label to reflect that the current deployment
     is on Vercel. Suggested approach:
   ```
   ┌──────────────────────────────────────────────────────────────┐
   │  Current: Vercel (dbsn-test01.vercel.app)                   │
   │  Target:  Cloudflare Edge (sentradaya.com) — Phase B        │
   │  Hub: sentradaya.com | Spokes: pju/solar/etc | Dashboard    │
   └──────────────────────────────────────────────────────────────┘
   ```

2. **Update the Phase Status table** (lines 89-95) to reflect reality:
   | Phase | Status | Notes |
   |---|---|---|
   | 1 | **Complete** | Foundation — Next.js 16, TypeScript, Tailwind |
   | 2 | **Complete** | Hub pages, spoke pages, RFQ forms, Sanity CMS, middleware |
   | 3 | **Complete** | Notifications, Cloudflare config, redirects, SEO, analytics |
   | 4 | **Not Started** | Quality gates, performance, security, production deploy |

3. **Add a "Known Issues" row** or section noting the Edge Runtime conflict.

4. Update the header generation date to `2026-06-10`.

#### 4B. Update `docs/CODEMAPS/frontend.md`
**Action**: Read the file first. If it contains component or route listings,
add an "Edge Runtime" section documenting which files declare `edge` runtime.
Use the same audit table from Step 2A (section 4).

#### 4C. Update `docs/core/project-roadmap.md`
**Action**: Edit the existing file:

1. **Update the header** (line 4-5):
   - Change "Last Updated: 2026-06-04" to "Last Updated: 2026-06-10"
   - Keep "Status: Phase 3 - Infrastructure (Complete)"

2. **Update the Deployment Phase Status section** (lines 22-28):
   - Add a line: "- **Known Blocker**: Hub navigation broken due to Edge Runtime
     + Prisma conflict. Fix is documented but not yet applied."
   - Add a line: "- **Documentation**: Updated 2026-06-10 to reflect current state"

3. **Update "Last modified" footer** to `2026-06-10`.

## END-GOAL
After execution, the following MUST be true:
1. ✅ `docs/core/architecture/middleware-routing.md` documents the Vercel
   testing phase, known Edge Runtime issues, and Edge Runtime audit table.
2. ✅ `docs/core/development/local-setup.md` has Vercel preview testing
   section and "Only one page displays" troubleshooting entry.
3. ✅ `docs/core/development/cloudflare-deployment.md` has "Current Testing
   Phase (Vercel)" section and updated phase banner.
4. ✅ `docs/core/development/vercel-deployment.md` exists as a new file
   with complete Vercel deployment reference.
5. ✅ `docs/CODEMAPS/architecture.md` reflects the current deployment
   topology (Vercel, not Cloudflare) and updated phase status.
6. ✅ `docs/core/project-roadmap.md` documents the known blocker.
7. ✅ ALL "Last modified" dates are `2026-06-10`.
8. ✅ ZERO source code files have been modified.

## NARROWING (Constraints & Boundaries)

### DO:
- Read source files to verify documentation accuracy.
- Write/update ONLY files under `docs/`.
- Document known issues with root cause analysis.
- Preserve existing documentation content — add sections, don't delete.
- Use consistent markdown formatting matching existing doc style.
- Cross-reference between related documents with relative links.
- Update all "Last modified" dates to 2026-06-10.

### DON'T:
- ❌ Do NOT edit any file in `src/`.
- ❌ Do NOT edit `next.config.ts`, `middleware.ts`, `package.json`.
- ❌ Do NOT edit `.env`, `.env.example`, `wrangler.toml`.
- ❌ Do NOT edit `tailwind.config.ts`, `tsconfig.json`.
- ❌ Do NOT edit any file in `prisma/`.
- ❌ Do NOT edit any test files in `tests/` or `src/__tests__/`.
- ❌ Do NOT run `npm run build` or any build commands.
- ❌ Do NOT commit or push any changes.
- ❌ Do NOT create files outside of `docs/`.
- ❌ Do NOT delete any existing documentation.
- ❌ Do NOT change the fundamental structure of existing docs — only
     add sections and update content.

### VERIFICATION:
After completing all steps, run this command to confirm only docs/ changed:
[bash]
git diff --name-only
# Expected output: Only files under docs/
[/bash]
```

---

## Appendix: Full Documentation Tree

```
docs/
├── CODEMAPS/
│   ├── architecture.md      ← UPDATE (topology + phase status)
│   ├── backend.md
│   ├── data.md
│   ├── dependencies.md
│   └── frontend.md          ← UPDATE (Edge Runtime audit)
├── core/
│   ├── architecture/
│   │   ├── architecture.md
│   │   ├── middleware-routing.md  ← UPDATE (Vercel phase + known issues + Edge audit)
│   │   └── tdd-v1.md
│   ├── business-context/
│   │   └── DBSN_Bussiness-Context.md
│   ├── development/
│   │   ├── cloudflare-deployment.md  ← UPDATE (current testing phase section)
│   │   ├── gsc-setup.md
│   │   ├── local-setup.md           ← UPDATE (Vercel testing + troubleshooting)
│   │   ├── sanity-cms-guide.md
│   │   ├── testing-guide.md
│   │   └── vercel-deployment.md     ← NEW FILE (complete Vercel guide)
│   ├── information-architecture/
│   │   ├── ia-sitemaps.md
│   │   ├── ia-strategy-navigation.md
│   │   ├── ia-user-flows.md
│   │   └── information-architecture.md
│   ├── prd/
│   │   ├── prd-c-level-segment-focus.md
│   │   └── prd-v3.md
│   ├── project-roadmap.md   ← UPDATE (known blocker + date)
│   └── testing/
│       └── mocking-specs.md
└── superpowers/
    ├── plans/
    └── specs/