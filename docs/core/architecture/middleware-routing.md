# Middleware Routing Reference

**Purpose:** Complete reference for the Edge middleware that maps hostnames to Next.js route groups  
**Source:** `src/middleware.ts`, `src/lib/middleware/config.ts`, `src/lib/middleware/dev-hosts.ts`

---

## Overview

The DBSN platform uses a single Next.js 16 app to serve multiple domains via **hostname-based middleware routing**. At request time, the Edge middleware inspects the `Host` header, resolves the domain class, and either allows the request to pass through (hub) or rewrites the URL to the correct internal route group (dashboard, spokes).

Key properties:

- **Runtime:** V8 Edge Runtime (not Node.js)
- **Trigger:** Every non-static, non-API page request (controlled by the matcher)
- **Source file:** [`src/middleware.ts`](../../../src/middleware.ts)
- **Config helpers:** [`src/lib/middleware/config.ts`](../../../src/lib/middleware/config.ts)

---

## Domain Map

| Production Domain | Local (lvh.me) | Vercel Preview | Internal Route | Domain Class |
|---|---|---|---|---|
| `sentradaya.com` | `lvh.me:3000` | `{deploy}.vercel.app` | `/(hub)` | Hub |
| `www.sentradaya.com` | `www.lvh.me:3000` | — | `/(hub)` | Hub |
| `pju.sentradaya.com` | `pju.lvh.me:3000` | `pju.{deploy}.vercel.app` | `/(spokes)/pju` | Spoke |
| `solarcell.sentradaya.com` | `solarcell.lvh.me:3000` | `solarcell.{deploy}.vercel.app` | `/(spokes)/solarcell` | Spoke |
| `alatpetir.sentradaya.com` | `alatpetir.lvh.me:3000` | `alatpetir.{deploy}.vercel.app` | `/(spokes)/alatpetir` | Spoke |
| `baterai.sentradaya.com` | `baterai.lvh.me:3000` | `baterai.{deploy}.vercel.app` | `/(spokes)/baterai` | Spoke |
| `dashboard.sentradaya.com` | `dashboard.lvh.me:3000` | `dashboard.{deploy}.vercel.app` | `/dashboard` (flat route) | Dashboard |

> **Note:** `localhost` and `127.0.0.1` are treated as hub domains.

---

## Hostname Resolution Flow

Every incoming request follows this resolution chain:

```
Request: Host: pju.lvh.me:3000
              │
              ▼
  cleanHostname("pju.lvh.me:3000")
    → strips port → "pju.lvh.me"
              │
              ▼
  isLocalDevelopment("pju.lvh.me")
    → ends with .lvh.me → true
    → rootDomain = "lvh.me"
              │
              ▼
  extractSubdomain("pju.lvh.me")
    → "pju.lvh.me".slice(0, -(6+1)) = "pju"
    → subdomain = "pju"
              │
              ▼
  isSpokeDomain("pju.lvh.me")
    → SPOKE_SUBDOMAINS.includes("pju") → true
    → returns "pju"
              │
              ▼
  middleware: rewrite → /pju{pathname}{search}
              │
              ▼
  App Router resolves /pju/** → /(spokes)/pju/**
```

**Step-by-step for all domain classes:**

| Input hostname | `cleanHostname` | `extractSubdomain` | `isHubDomain` | `isDashboardDomain` | `isSpokeDomain` | Decision |
|---|---|---|---|---|---|---|
| `sentradaya.com` | `sentradaya.com` | `null` | `true` | `false` | `null` | Hub rewrite |
| `lvh.me:3000` | `lvh.me` | `null` | `true` | `false` | `null` | Hub rewrite |
| `dashboard.sentradaya.com` | `dashboard.sentradaya.com` | `"dashboard"` | `false` | `true` | `null` | Dashboard rewrite |
| `pju.lvh.me:3000` | `pju.lvh.me` | `"pju"` | `false` | `false` | `"pju"` | Spoke rewrite |
| `unknown.example.com` | `unknown.example.com` | `null` | `false` | `false` | `null` | 404 rewrite |

---

## Config Abstraction (`config.ts`)

All domain logic is in [`src/lib/middleware/config.ts`](../../../src/lib/middleware/config.ts). Import from there — never inline hostname logic in middleware.

### Constants

```typescript
import { SPOKE_SUBDOMAINS } from '@/lib/middleware/config'
// → ['pju', 'solarcell', 'alatpetir', 'baterai'] as const
```

### Function Reference

| Function | Signature | Returns | Notes |
|---|---|---|---|
| `cleanHostname` | `(host: string \| null \| undefined) => string` | Hostname without port | Safe for null/undefined |
| `isLocalDevelopment` | `(hostname: string) => boolean` | `true` if ends with `.lvh.me` | Also matches bare `lvh.me` |
| `extractSubdomain` | `(hostname: string) => string \| null` | Subdomain string or `null` | Handles local, Vercel, prod; strips `www` |
| `isHubDomain` | `(hostname: string) => boolean` | `true` if root/www/localhost | Reads `NEXT_PUBLIC_ROOT_DOMAIN` via `getMiddlewareEnv()` |
| `isDashboardDomain` | `(hostname: string) => boolean` | `true` if subdomain is `"dashboard"` | Delegates to `extractSubdomain` |
| `isSpokeDomain` | `(hostname: string) => string \| null` | Spoke key (`"pju"`) or `null` | Returns the spoke name, not a boolean |

#### Usage example:

```typescript
import { cleanHostname, isHubDomain, isDashboardDomain, isSpokeDomain } from '@/lib/middleware/config'

const cleanHost = cleanHostname(request.headers.get('host'))
const spoke = isSpokeDomain(cleanHost)

if (isHubDomain(cleanHost)) { /* hub */ }
if (isDashboardDomain(cleanHost)) { /* dashboard */ }
if (spoke) { /* spoke = "pju" | "solarcell" | "alatpetir" | "baterai" */ }
```

### Environment Dependencies

`config.ts` reads env vars via `getMiddlewareEnv()` from `src/lib/config/env.ts`:

| Variable | Default (dev) | Default (prod) | Purpose |
|---|---|---|---|
| `NEXT_PUBLIC_ROOT_DOMAIN` | `lvh.me` | `sentradaya.com` | Root domain for subdomain extraction |
| `NEXT_PUBLIC_SITE_URL` | `http://lvh.me:3000` | `https://sentradaya.com` | Base URL for absolute links |

---

## Dev Hostname Map (`dev-hosts.ts`)

[`src/lib/middleware/dev-hosts.ts`](../../../src/lib/middleware/dev-hosts.ts) is a **test utility only** — it is not imported at runtime. It provides `DEV_HOSTNAMES` for test assertions and the `getExpectedRoute()` helper.

```typescript
export const DEV_HOSTNAMES = {
  'lvh.me':              '(hub)',
  'www.lvh.me':          '(hub)',
  'dashboard.lvh.me':    '/dashboard',
  'pju.lvh.me':          '(spokes)/pju',
  'solarcell.lvh.me':    '(spokes)/solarcell',
  'alatpetir.lvh.me':    '(spokes)/alatpetir',
  'baterai.lvh.me':      '(spokes)/baterai',
} as const
```

Usage in tests:

```typescript
import { getExpectedRoute } from '@/lib/middleware/dev-hosts'

expect(getExpectedRoute('pju.lvh.me:3000')).toBe('(spokes)/pju')
expect(getExpectedRoute('unknown.lvh.me')).toBeNull()
```

---

## Routing Outcomes

The middleware runs 6 sequential checks and sets response headers on every path:

| Step | Condition | Action | Headers set |
|---|---|---|---|
| 1 | Path starts with `/api`, `/_next`, or contains `.` | `NextResponse.next()` — short-circuit | None |
| 2 | Path already matches the rewritten route | `NextResponse.next()` — prevent loop | `x-middleware-subdomain`, `x-middleware-matched-route` |
| 3 | `isHubDomain()` — and path is a spoke path | `NextResponse.rewrite(/404)` | None |
| 3 | `isHubDomain()` — hub page | `NextResponse.rewrite(/(hub){path})` | `x-middleware-subdomain: hub`, `x-middleware-matched-route: /(hub)` |
| 4 | `isDashboardDomain()` | `NextResponse.rewrite(/dashboard{path})` | `x-middleware-subdomain: dashboard`, `x-middleware-matched-route: /dashboard` |
| 5 | `isSpokeDomain()` returns spoke key | `NextResponse.rewrite(/{spoke}{path})` | `x-middleware-subdomain: {spoke}`, `x-middleware-matched-route: /(spokes)/{spoke}` |
| 6 | No match | `NextResponse.rewrite(/404)` | None |

---

## Debug Headers

Every middleware response includes two diagnostic headers. Read them in browser DevTools → Network tab → Response Headers.

| Header | Example Value | Meaning |
|---|---|---|
| `x-middleware-subdomain` | `hub` | Resolved domain class (`hub`, `dashboard`, `pju`, `solarcell`, `alatpetir`, `baterai`) |
| `x-middleware-matched-route` | `/(spokes)/pju` | Internal Next.js route group path the request resolves to |

Use these in middleware tests:

```typescript
const response = await middleware(makeRequest('pju.lvh.me:3000', '/products'))
expect(response.headers.get('x-middleware-subdomain')).toBe('pju')
expect(response.headers.get('x-middleware-matched-route')).toBe('/(spokes)/pju')
```

---

## Supported Domain Classes

### Production (`sentradaya.com`)

Detected when `cleanHostname` matches or ends with `NEXT_PUBLIC_ROOT_DOMAIN`. Requires env var to be set — defaults to `sentradaya.com` in production.

### Local Development (`lvh.me`)

`lvh.me` and all subdomains resolve to `127.0.0.1` (no hosts file edits needed). Detected by `isLocalDevelopment()` which checks for `.lvh.me` suffix.

### Vercel Preview (`.vercel.app`)

Hostnames ending in `.vercel.app` are auto-detected. The root domain is derived as the last 3 parts of the hostname (`{hash}-{team}.vercel.app`). No env var changes needed between deployments.

---

## Matcher Configuration

The matcher limits middleware to page requests only:

```typescript
// src/middleware.ts
export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml).*)',
  ],
}
```

| Excluded Pattern | Reason |
|---|---|
| `api` | API routes handle their own auth/routing |
| `_next/static` | Build artifacts — no middleware needed |
| `_next/image` | Next.js image optimization — bypass middleware |
| `favicon.ico` | Static file |
| `robots.txt` | Static file served from `public/` |
| `sitemap.xml` | Static or dynamic sitemap — no host rewriting needed |

The middleware also has an early-exit guard (Step 1 above) for paths with file extensions (`.css`, `.js`, `.png`, etc.).

---

## How to Add a New Spoke

1. **Add to `SPOKE_SUBDOMAINS`** in [`src/lib/middleware/config.ts`](../../../src/lib/middleware/config.ts):
   ```typescript
   export const SPOKE_SUBDOMAINS = ['pju', 'solarcell', 'alatpetir', 'baterai', 'newspoke'] as const
   ```

2. **Add to `DEV_HOSTNAMES`** in [`src/lib/middleware/dev-hosts.ts`](../../../src/lib/middleware/dev-hosts.ts):
   ```typescript
   'newspoke.lvh.me': '(spokes)/newspoke',
   ```

3. **Create the route group directory:**
   ```
   src/app/(spokes)/newspoke/
   └── page.tsx
   ```

4. **Add to the domain map table** in this document.

No changes to `middleware.ts` are needed — `isSpokeDomain()` is data-driven.

---

## Related Documentation

- [`src/middleware.ts`](../../../src/middleware.ts) — Active middleware implementation
- [`src/lib/middleware/config.ts`](../../../src/lib/middleware/config.ts) — Domain resolution helpers
- [`src/lib/middleware/dev-hosts.ts`](../../../src/lib/middleware/dev-hosts.ts) — Development hostname map
- [Architecture Overview](./architecture.md) — System architecture and domain topology
- [Local Setup](../development/local-setup.md) — How to test routing locally
- [TDD v1](./tdd-v1.md) — Middleware test strategy

---

*Last modified: 2026-05-26*
