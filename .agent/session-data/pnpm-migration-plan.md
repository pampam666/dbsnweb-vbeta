# Implementation Plan - Documentation Migration to pnpm

This implementation plan details the documentation-only changes required to migrate all outdated references of the `npm` package manager and `npx` runner to `pnpm` and `pnpm exec` / `pnpx` across all Markdown files in the workspace.

## User Review Required

> [!IMPORTANT]
> This is a **read-only planning and documentation-only task**. No code or configuration changes to `package.json`, `pnpm-workspace.yaml`, or application code will be executed.

> [!TIP]
> Outdated commands like `npm run <script>`, `npm test`, and `npx <command>` are mapped to their respective `pnpm` counterparts (e.g., `pnpm <script>`, `pnpm test`, and `pnpm exec <command>`).

## Open Questions

None. The references to be replaced are fully identified and verified via workspace search.

## Proposed Changes

We group the documentation files into three components: **Root Files**, **General Docs**, and **Core & Plan Docs**.

---

### Root Files

#### [MODIFY] [CLAUDE.md](file:///d:/CLAUDE-PROJECT/website/CLAUDE.md)
*   **Line 48**: Replace `npm` package manager specification with `pnpm`.
*   **Line 116**: Replace `npm install` with `pnpm install`.
*   **Line 119**: Replace `npm run dev` with `pnpm dev`.
*   **Line 122**: Replace `npm run build` with `pnpm build`.
*   **Line 125**: Replace `npm run pages:build` with `pnpm pages:build`.
*   **Line 128**: Replace `npm run pages:preview` with `pnpm pages:preview`.
*   **Line 131**: Replace `npm run pages:deploy` with `pnpm pages:deploy`.
*   **Line 143**: Replace `npm run build` and `npm run dev` with `pnpm build` and `pnpm dev`.
*   **Line 144**: Replace `npm run pages:build` and `npm run pages:deploy` with `pnpm pages:build` and `pnpm pages:deploy`.
*   **Line 147**: Replace `npm run pages:build` with `pnpm pages:build`.
*   **Line 148**: Replace `npm run pages:deploy` with `pnpm pages:deploy`.
*   **Line 153**: Replace `npx tsx scripts/gsc-submit-sitemap.ts` with `pnpm exec tsx scripts/gsc-submit-sitemap.ts`.
*   **Line 169**: Replace `npm run dev` with `pnpm dev`.
*   **Line 177**: Replace `npm test` with `pnpm test`.
*   **Line 178**: Replace `npm run build` with `pnpm build`.
*   **Line 179**: Replace `npx playwright test tests/e2e/hub-routing.spec.ts` with `pnpm exec playwright test tests/e2e/hub-routing.spec.ts`.
*   **Line 180**: Replace `npx vercel deploy --yes --scope pampam666s-projects` with `pnpm exec vercel deploy --yes --scope pampam666s-projects`.
*   **Line 186**: Replace `npm test` with `pnpm test`.
*   **Line 189**: Replace `npm run test:coverage` with `pnpm test:coverage`.
*   **Line 192**: Replace `npm run test:e2e` with `pnpm test:e2e`.
*   **Line 208**: Replace `npm run lint` with `pnpm lint`.
*   **Line 275**: Replace `npx tsx scripts/gsc-submit-sitemap.ts` with `pnpm exec tsx scripts/gsc-submit-sitemap.ts`.

#### [MODIFY] [GEMINI.md](file:///d:/CLAUDE-PROJECT/website/GEMINI.md)
*   **Line 39**: Replace `npm run lint`, `npm test`, and `npx playwright test` with `pnpm lint`, `pnpm test`, and `pnpm exec playwright test`.
*   **Line 94**: Replace `npm run lint` with `pnpm lint`.

#### [MODIFY] [README.md](file:///d:/CLAUDE-PROJECT/website/README.md)
*   **Line 70**: Replace `npm` standard reference with `pnpm`.
*   **Line 106**: Replace `npm install` with `pnpm install`.
*   **Line 109**: Replace `npm run dev` with `pnpm dev`.
*   **Line 118**: Replace `npm run dev` description with `pnpm dev`.
*   **Line 119**: Replace `npm run build` description with `pnpm build`.
*   **Line 120**: Replace `npm run start` description with `pnpm start`.
*   **Line 121**: Replace `npm run lint` description with `pnpm lint`.
*   **Line 122**: Replace `npm run test` description with `pnpm test`.
*   **Line 123**: Replace `npm run test:watch` description with `pnpm test:watch`.
*   **Line 124**: Replace `npm run test:coverage` description with `pnpm test:coverage`.
*   **Line 125**: Replace `npm run test:e2e` description with `pnpm test:e2e`.

---

### General Docs

#### [MODIFY] [ONBOARDING.md](file:///d:/CLAUDE-PROJECT/website/docs/ONBOARDING.md)
*   **Line 62**: Replace `npm run dev` with `pnpm dev`.
*   **Line 63**: Replace `npm run build` with `pnpm build`.
*   **Line 64**: Replace `npm run pages:build` with `pnpm pages:build`.
*   **Line 65**: Replace `npm test` with `pnpm test`.
*   **Line 66**: Replace `npm run test:e2e` with `pnpm test:e2e`.
*   **Line 67**: Replace `npx prisma migrate dev` with `pnpm exec prisma migrate dev`.

---

### Core & Plan Docs

#### [MODIFY] [architecture.md](file:///d:/CLAUDE-PROJECT/website/docs/core/architecture/architecture.md)
*   **Line 8**: Replace `npm package manager` with `pnpm package manager`.

#### [MODIFY] [middleware-routing.md](file:///d:/CLAUDE-PROJECT/website/docs/core/architecture/middleware-routing.md)
*   **Line 82**: Replace `or npm install if using npm` with a simplified pnpm reference.
*   **Line 90**: Replace `npm run dev` with `pnpm dev`.

#### [MODIFY] [cloudflare-deployment.md](file:///d:/CLAUDE-PROJECT/website/docs/core/development/cloudflare-deployment.md)
*   **Line 99**: Replace `npm run pages:build` with `pnpm pages:build`.
*   **Line 106**: Replace `npm run pages:preview` with `pnpm pages:preview`.
*   **Line 113**: Replace `npm run pages:deploy` with `pnpm pages:deploy`.

#### [MODIFY] [gsc-setup.md](file:///d:/CLAUDE-PROJECT/website/docs/core/development/gsc-setup.md)
*   **Line 46**: Replace `npm run build` or `npm run dev` with `pnpm build` or `pnpm dev`.
*   **Line 76**: Replace `npx tsx scripts/gsc-submit-sitemap.ts --dry-run` with `pnpm exec tsx scripts/gsc-submit-sitemap.ts --dry-run`.
*   **Line 83**: Replace `npx tsx` with `pnpm exec tsx`.

#### [MODIFY] [local-setup.md](file:///d:/CLAUDE-PROJECT/website/docs/core/development/local-setup.md)
*   **Line 111**: Replace `npm run dev` with `pnpm dev`.
*   **Line 166**: Replace `npm run dev` with `pnpm dev`.
*   **Line 219**: Replace `npm run dev -- -p 4000` with `pnpm dev -- -p 4000`.
*   **Line 226**: Replace `npm run dev` with `pnpm dev`.
*   **Line 227**: Replace `npm run build` with `pnpm build`.
*   **Line 228**: Replace `npm start` with `pnpm start`.
*   **Line 229**: Replace `npm run lint` with `pnpm lint`.
*   **Line 230**: Replace `npm test` with `pnpm test`.
*   **Line 231**: Replace `npm run test:watch` with `pnpm test:watch`.
*   **Line 232**: Replace `npm run test:coverage` with `pnpm test:coverage`.

#### [MODIFY] [testing-guide.md](file:///d:/CLAUDE-PROJECT/website/docs/core/development/testing-guide.md)
*   **Line 24**: Replace `npm test` with `pnpm test`.
*   **Line 25**: Replace `npm run test:watch` with `pnpm test:watch`.
*   **Line 26**: Replace `npm run test:coverage` with `pnpm test:coverage`.
*   **Line 32**: Replace `npm test --` with `pnpm test --`.
*   **Line 35**: Replace `npm test --` with `pnpm test --`.
*   **Line 38**: Replace `npm test --` with `pnpm test --`.
*   **Line 41**: Replace `npm test --` with `pnpm test --`.
*   **Line 47**: Replace `npm run test:coverage` with `pnpm test:coverage`.
*   **Line 405**: Replace `npm run test:coverage` with `pnpm test:coverage`.

#### [MODIFY] [vercel-deployment.md](file:///d:/CLAUDE-PROJECT/website/docs/core/development/vercel-deployment.md)
*   **Line 43**: Replace `npx vercel --prod` with `pnpm exec vercel --prod`.
*   **Line 105**: Replace `npm run pages:build` with `pnpm pages:build`.

#### [MODIFY] [information-architecture.md](file:///d:/CLAUDE-PROJECT/website/docs/core/information-architecture/information-architecture.md)
*   **Line 75**: Replace `Next.js 16 dengan npm` with `Next.js 16 dengan pnpm`.

#### [MODIFY] [prd-c-level-segment-focus.md](file:///d:/CLAUDE-PROJECT/website/docs/core/prd/prd-c-level-segment-focus.md)
*   **Line 277**: Replace `npm setup` with `pnpm setup`.

#### [MODIFY] [prd-v3.md](file:///d:/CLAUDE-PROJECT/website/docs/core/prd/prd-v3.md)
*   **Line 97**: Replace `npm` in Locked Stack with `pnpm`.

#### [MODIFY] [project-roadmap.md](file:///d:/CLAUDE-PROJECT/website/docs/core/project-roadmap.md)
*   **Line 45**: Replace `Configure npm package manager` with `Configure pnpm package manager`.
*   **Line 54**: Replace `npm run dev` with `pnpm dev`.

#### [MODIFY] [2026-06-10-secure-auth-flow.md](file:///d:/CLAUDE-PROJECT/website/docs/superpowers/plans/2026-06-10-secure-auth-flow.md)
*   **Line 155**: Replace `npm test` with `pnpm test`.

---

## Migration Manifest Summary

Below is the clean manifest table mapping out the files, outdated references, and proposed pnpm replacements.

| File Path | Outdated Command / Reference | Proposed pnpm Replacement |
| :--- | :--- | :--- |
| `CLAUDE.md` | `Package Manager \| npm` (line 48) | `Package Manager \| pnpm` |
| `CLAUDE.md` | `npm install` (line 116) | `pnpm install` |
| `CLAUDE.md` | `npm run dev` (line 119) | `pnpm dev` |
| `CLAUDE.md` | `npm run build` (line 122) | `pnpm build` |
| `CLAUDE.md` | `npm run pages:build` (line 125) | `pnpm pages:build` |
| `CLAUDE.md` | `npm run pages:preview` (line 128) | `pnpm pages:preview` |
| `CLAUDE.md` | `npm run pages:deploy` (line 131) | `pnpm pages:deploy` |
| `CLAUDE.md` | `npm run build and npm run dev` (line 143) | `pnpm build and pnpm dev` |
| `CLAUDE.md` | `npm run pages:build and npm run pages:deploy` (line 144) | `pnpm pages:build and pnpm pages:deploy` |
| `CLAUDE.md` | `npm run pages:build` (line 147) | `pnpm pages:build` |
| `CLAUDE.md` | `npm run pages:deploy` (line 148) | `pnpm pages:deploy` |
| `CLAUDE.md` | `npx tsx scripts/gsc-submit-sitemap.ts` (line 153) | `pnpm exec tsx scripts/gsc-submit-sitemap.ts` |
| `CLAUDE.md` | `npm run dev` (line 169) | `pnpm dev` |
| `CLAUDE.md` | `npm test` (line 177) | `pnpm test` |
| `CLAUDE.md` | `npm run build` (line 178) | `pnpm build` |
| `CLAUDE.md` | `npx playwright test tests/e2e/hub-routing.spec.ts` (line 179) | `pnpm exec playwright test tests/e2e/hub-routing.spec.ts` |
| `CLAUDE.md` | `npx vercel deploy --yes --scope pampam666s-projects` (line 180) | `pnpm exec vercel deploy --yes --scope pampam666s-projects` |
| `CLAUDE.md` | `npm test` (line 186) | `pnpm test` |
| `CLAUDE.md` | `npm run test:coverage` (line 189) | `pnpm test:coverage` |
| `CLAUDE.md` | `npm run test:e2e` (line 192) | `pnpm test:e2e` |
| `CLAUDE.md` | `npm run lint` (line 208) | `pnpm lint` |
| `CLAUDE.md` | `npx tsx scripts/gsc-submit-sitemap.ts` (line 275) | `pnpm exec tsx scripts/gsc-submit-sitemap.ts` |
| `GEMINI.md` | `npm run lint`, `npm test`, and `npx playwright test` (line 39) | `pnpm lint`, `pnpm test`, and `pnpm exec playwright test` |
| `GEMINI.md` | `npm run lint` (line 94) | `pnpm lint` |
| `README.md` | `npm` (line 70) | `pnpm` |
| `README.md` | `npm install` (line 106) | `pnpm install` |
| `README.md` | `npm run dev` (line 109) | `pnpm dev` |
| `README.md` | `npm run dev` (line 118) | `pnpm dev` |
| `README.md` | `npm run build` (line 119) | `pnpm build` |
| `README.md` | `npm run start` (line 120) | `pnpm start` |
| `README.md` | `npm run lint` (line 121) | `pnpm lint` |
| `README.md` | `npm run test` (line 122) | `pnpm test` |
| `README.md` | `npm run test:watch` (line 123) | `pnpm test:watch` |
| `README.md` | `npm run test:coverage` (line 124) | `pnpm test:coverage` |
| `README.md` | `npm run test:e2e` (line 125) | `pnpm test:e2e` |
| `docs/ONBOARDING.md` | `npm run dev` (line 62) | `pnpm dev` |
| `docs/ONBOARDING.md` | `npm run build` (line 63) | `pnpm build` |
| `docs/ONBOARDING.md` | `npm run pages:build` (line 64) | `pnpm pages:build` |
| `docs/ONBOARDING.md` | `npm test` (line 65) | `pnpm test` |
| `docs/ONBOARDING.md` | `npm run test:e2e` (line 66) | `pnpm test:e2e` |
| `docs/ONBOARDING.md` | `npx prisma migrate dev` (line 67) | `pnpm exec prisma migrate dev` |
| `docs/core/architecture/architecture.md` | `npm package manager` (line 8) | `pnpm package manager` |
| `docs/core/architecture/middleware-routing.md` | `npm install` (line 82) | `pnpm install` |
| `docs/core/architecture/middleware-routing.md` | `npm run dev` (line 90) | `pnpm dev` |
| `docs/core/development/cloudflare-deployment.md` | `npm run pages:build` (line 99) | `pnpm pages:build` |
| `docs/core/development/cloudflare-deployment.md` | `npm run pages:preview` (line 106) | `pnpm pages:preview` |
| `docs/core/development/cloudflare-deployment.md` | `npm run pages:deploy` (line 113) | `pnpm pages:deploy` |
| `docs/core/development/gsc-setup.md` | `npm run build` or `npm run dev` (line 46) | `pnpm build` or `pnpm dev` |
| `docs/core/development/gsc-setup.md` | `npx tsx scripts/gsc-submit-sitemap.ts --dry-run` (line 76) | `pnpm exec tsx scripts/gsc-submit-sitemap.ts --dry-run` |
| `docs/core/development/gsc-setup.md` | `npx tsx scripts/gsc-submit-sitemap.ts` (line 83) | `pnpm exec tsx scripts/gsc-submit-sitemap.ts` |
| `docs/core/development/local-setup.md` | `npm run dev` (line 111) | `pnpm dev` |
| `docs/core/development/local-setup.md` | `npm run dev` (line 166) | `pnpm dev` |
| `docs/core/development/local-setup.md` | `npm run dev -- -p 4000` (line 219) | `pnpm dev -- -p 4000` |
| `docs/core/development/local-setup.md` | `npm run dev` (line 226) | `pnpm dev` |
| `docs/core/development/local-setup.md` | `npm run build` (line 227) | `pnpm build` |
| `docs/core/development/local-setup.md` | `npm start` (line 228) | `pnpm start` |
| `docs/core/development/local-setup.md` | `npm run lint` (line 229) | `pnpm lint` |
| `docs/core/development/local-setup.md` | `npm test` (line 230) | `pnpm test` |
| `docs/core/development/local-setup.md` | `npm run test:watch` (line 231) | `pnpm test:watch` |
| `docs/core/development/local-setup.md` | `npm run test:coverage` (line 232) | `pnpm test:coverage` |
| `docs/core/development/testing-guide.md` | `npm test` (line 24) | `pnpm test` |
| `docs/core/development/testing-guide.md` | `npm run test:watch` (line 25) | `pnpm test:watch` |
| `docs/core/development/testing-guide.md` | `npm run test:coverage` (line 26) | `pnpm test:coverage` |
| `docs/core/development/testing-guide.md` | `npm test` (line 32) | `pnpm test` |
| `docs/core/development/testing-guide.md` | `npm test` (line 35) | `pnpm test` |
| `docs/core/development/testing-guide.md` | `npm test` (line 38) | `pnpm test` |
| `docs/core/development/testing-guide.md` | `npm test` (line 41) | `pnpm test` |
| `docs/core/development/testing-guide.md` | `npm run test:coverage` (line 47) | `pnpm test:coverage` |
| `docs/core/development/testing-guide.md` | `npm run test:coverage` (line 405) | `pnpm test:coverage` |
| `docs/core/development/vercel-deployment.md` | `npx vercel --prod` (line 43) | `pnpm exec vercel --prod` |
| `docs/core/development/vercel-deployment.md` | `npm run pages:build` (line 105) | `pnpm pages:build` |
| `docs/core/information-architecture/information-architecture.md` | `Next.js 16 dengan npm` (line 75) | `Next.js 16 dengan pnpm` |
| `docs/core/prd/prd-c-level-segment-focus.md` | `npm setup` (line 277) | `pnpm setup` |
| `docs/core/prd/prd-v3.md` | `npm` (line 97) | `pnpm` |
| `docs/core/project-roadmap.md` | `npm package manager` (line 45) | `pnpm package manager` |
| `docs/core/project-roadmap.md` | `npm run dev` (line 54) | `pnpm dev` |
| `docs/superpowers/plans/2026-06-10-secure-auth-flow.md` | `npm test` (line 155) | `pnpm test` |

---

## Verification Plan

Because this is a documentation migration plan, verification is conducted manually by inspecting the modified files to ensure that:
1. No Markdown formatting or links are broken.
2. The commands are corrected accurately according to the manifest.
3. No functional application code is changed.
