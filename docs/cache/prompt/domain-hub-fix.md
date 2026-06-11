# Session: domain-hub-fix

## Fase 1: Research and Investigation (Completed)
- **Status**: Completed.
- **Findings**:
  1. **Routing**: Middleware root domain is hardcoded/defaulted to `sentradaya.com`, which doesn't match the Vercel preview domain `dbsn-test01.vercel.app`, leading to 404 rewrites.
  2. **Script Error**: `GoogleAnalytics.tsx` contains raw `<Script>` tags that trigger React 19 hydration errors when rendered inside a client component structure.
  3. **Performance Error**: `SpokeHomePage` likely contains a zero-width space (`\u200B`) or a reserved string in its performance measurement scope that Turbopack's edge runtime rejects.

## Fase 2: Execution and Implementation

### Analysis Section
- **Framework**: TIDD-EC. This framework is selected to provide explicit, rigid instructions (Dos and Don'ts) to ensure the fixes are applied precisely and verified against the reported errors.
- **Experts**: `tdd-guide` (execution), `web-patterns` (Next.js 16/Turbopack), `security-reviewer` (Middleware logic audit).
- **Tool Pipeline**:
    - `activate_skill`: To load `tdd-workflow`.
    - `run_shell_command`: To verify the build and linting post-fix.
    - `replace`: For surgical code edits.

### ECC Execution Prompt (Fase 2)
```text
# ECC CONTEXT ANCHORS
- Primary Agent: [tdd-guide.md](file:///D:/CLAUDE-PROJECT/website/.agent/_skills/tdd-guide.md)
- Domain Skills: [web-patterns/SKILL.md](file:///D:/CLAUDE-PROJECT/website/.agent/skills/web-patterns/SKILL.md), [tdd-workflow/SKILL.md](file:///D:/CLAUDE-PROJECT/website/.agent/skills/tdd-workflow/SKILL.md)
- Target Files: [src/lib/middleware/config.ts](file:///D:/CLAUDE-PROJECT/website/src/lib/middleware/config.ts), [src/components/shared/GoogleAnalytics.tsx](file:///D:/CLAUDE-PROJECT/website/src/components/shared/GoogleAnalytics.tsx), [src/app/(spokes)/[spoke]/page.tsx](file:///D:/CLAUDE-PROJECT/website/src/app/%28spokes%29/%5Bspoke%5D/page.tsx)

# TOOL PIPELINE
1. activate_skill: tdd-workflow
2. activate_skill: web-patterns

# TASK: TIDD-EC Framework applied
- **Task**: Implement surgical fixes for the 404 routing issue, the React script hydration error, and the performance runtime error.
- **Instructions**:
  1. **Update Middleware Config**: In `src/lib/middleware/config.ts`, update the `extractSubdomain` and `isHubDomain` logic to dynamically support the `vercel.app` suffix and use `dbsn-test01.vercel.app` as a valid root during this testing phase.
  2. **Refactor Google Analytics**: In `src/components/shared/GoogleAnalytics.tsx`, refactor the `<Script>` tags. Ensure they use the `strategy="afterInteractive"` properly and are placed correctly according to Next.js 16 + React 19 standards to avoid "Encountered a script tag" errors. Move initialization logic to a `useEffect` if necessary.
  3. **Sanitize SpokeHomePage**: In `src/app/(spokes)/[spoke]/page.tsx`, perform a hex-cleanup to remove any hidden `\u200B` characters. Also, rename the component function or ensure no performance-measuring side effects are triggered that Turbopack's edge runtime might conflict with.
- **Do**:
  - Use `replace` for all edits to maintain file integrity.
  - Verify that `dbsn-test01.vercel.app` now correctly rewrites to the Hub routes (/, /about, etc.).
  - Run `npm run lint` and `npm run dev` (simulated) to ensure errors 1 and 2 are gone.
- **Don't**:
  - Do NOT hardcode the preview domain in a way that breaks production (sentradaya.com). Use environmental checks or regex.
  - Do NOT remove analytics functionality; only fix the rendering method.
- **Examples**:
  - Valid Middleware Check: `const isVercelPreview = hostname.endsWith('dbsn-test01.vercel.app');`
- **Context**: We are resolving critical blockers for the Domain Hub testing phase to allow for UX and navigation verification.

# VERIFICATION SUITE
1. `npm run lint`: Verify no linting regressions.
2. `npm run build`: Confirm the project compiles without "negative timestamp" performance errors.
3. Logical Verification: Confirm `extractSubdomain` handles `dbsn-test01.vercel.app` as a root domain (returning null for the hub).
```
