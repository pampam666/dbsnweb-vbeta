---
name: antigravity-assistant
description: Coordinates with Claude Code running ECC by exploring workspace context and generating optimized, copy-pasteable prompt instructions combined with Prompt Architect frameworks and specialized ECC Agents.
origin: ECC
---

# Antigravity Assistant

Use this skill when a user asks the IDE-side agent (Antigravity) to prepare a task or compose a prompt for the terminal-side agent (Claude Code).

## When to Use

*   Preparing complex code modifications or refactoring tasks.
*   Formulating plans for new features or bug fixes.
*   Helping a user onboard a task to Claude Code with correct file anchors and test instructions.
*   Solving compiler/type errors that require terminal execution.

## Core Workflow

### Step 1: Parse User Request
Determine the user's goal (e.g., adding a feature, fixing a bug, resolving an error, planning).

### Step 2: Intent Analysis & Framework Selection
Identify the user's intent category from the `prompt-architect` skill and map the request to the most suitable prompt framework:
*   **CREATE** (New feature/logic): Use **TIDD-EC** (if explicit DOs and DONTs are needed) or **RISEN** (if procedural steps are key).
*   **TRANSFORM** (Refactoring, rewrite, build/compiler errors): Use **BAB** (Before, After, Bridge).
*   **REASON** (Logic analysis, optimization design): Use **Plan-and-Solve** or **Least-to-Most**.
*   **CRITIQUE** (Reviewing code or tests): Use **Self-Refine** or **CAI Critique-Revise**.

### Step 3: Investigate the Codebase (Read-Only)
Find the target files and relevant context:
1.  **File Search**: Use file list or search tools to locate target components, APIs, or configuration files.
2.  **Verify Code Stack**: Read `package.json`, `tsconfig.json`, or similar config files to determine dependencies, package managers, and testing commands.
3.  **Inspect Imports**: Look at the target file's imports to identify dependencies (e.g., Sanity CMS, Prisma ORM, Auth.js).

### Step 4: Select the Matching ECC Command & Agent Persona Mapping
Map the user's task to the most specific ECC command combined with the selected prompt framework and specialized Agent Persona:

| User Task / Scenario | Target ECC Command | Recommended Framework | Linked Agent Persona File |
|---|---|---|---|
| Implementing features, logic, or bug fixes | `/tdd-workflow` | **TIDD-EC** or **RISEN** | [tdd-guide.md](file:///d:/CLAUDE-PROJECT/website/.agent/skills/tdd-guide.md) |
| Resolving compilation or type check errors | `/build-fix` | **BAB** | [build-error-resolver.md](file:///d:/CLAUDE-PROJECT/website/.agent/skills/build-error-resolver.md) |
| Designing architecture or system additions | `/plan` | **RISEN** or **CO-STAR** | [planner.md](file:///d:/CLAUDE-PROJECT/website/.agent/skills/planner.md) |
| Adding Playwright browser tests | `/e2e-runner` | **CARE** or **RISEN** | [e2e-runner.md](file:///d:/CLAUDE-PROJECT/website/.agent/skills/e2e-runner.md) |
| Performing code reviews or style checks | `/quality-gate` | **Self-Refine** or **CAI** | [code-reviewer.md](file:///d:/CLAUDE-PROJECT/website/.agent/skills/code-reviewer.md) |

*If the task is language or domain-specific, also link relevant reviewers:*
*   TypeScript/Next.js/React tasks: Link [typescript-reviewer.md](file:///d:/CLAUDE-PROJECT/website/.agent/skills/typescript-reviewer.md).
*   Prisma/SQL database tasks: Link [database-reviewer.md](file:///d:/CLAUDE-PROJECT/website/.agent/skills/database-reviewer.md).
*   Security-sensitive flows (Auth, payments): Link [security-reviewer.md](file:///d:/CLAUDE-PROJECT/website/.agent/skills/security-reviewer.md).

### Step 5: Formulate the Copy-Paste Prompt
Draft the prompt using the following structure. Always enclose the final prompt in a markdown code block starting with `"""` to make copy-pasting clean. Ensure the task description is fully structured using the selected framework's templates (located in `assets/templates/` of the `prompt-architect` skill).

```text
"""
<ECC_COMMAND_PREFIX>

Context Files:
- [relative/path/to/file](file:///absolute/path/to/file)
- [relative/path/to/test](file:///absolute/path/to/test)
- Target Agent Persona: [agent-name.md](file:///d:/CLAUDE-PROJECT/website/.agent/skills/agent-name.md)

Task: <FRAMEWORK_NAME> Framework applied
<Formatted framework sections: e.g. for TIDD-EC: Task, Instructions, Do, Don't, Examples, Context>

Active MCP Directives:
- <Directives for utilizing active MCPs: e.g. "Use the context7 MCP server to check Next.js 15 routing APIs" or "Use the playwright MCP server to run browser tests">

Verification Steps:
1. Run <build/test command> (e.g., `pnpm test` or `pnpm type-check`)
2. Verify <expected result>

ECC System Validation & Policies:
- **Agent Persona**: Adopt the linked Target Agent Persona instructions and execute its checklist.
- **Post-Implementation Review**: Review changes using [code-reviewer.md](file:///d:/CLAUDE-PROJECT/website/.agent/skills/code-reviewer.md). (If security-sensitive, also use [security-reviewer.md](file:///d:/CLAUDE-PROJECT/website/.agent/skills/security-reviewer.md)).
- **Immutability Policy**: Always create new objects; do not mutate inputs/states directly.
- **Testing Requirements**: Ensure 80%+ test coverage. Write tests first (Red-Green-Refactor).
- **Knowledge Capture Policy**: Save transient session/debug insights in memory (using the `memory` MCP server), and log structural codebase design patterns into project documentation (e.g., CLAUDE.md, roadmap, or core docs).
"""
```

---

## Mapping Reference Guide

### 1. Code Implementation & Bug Fixes (TIDD-EC + tdd-guide)
*   **Target Command**: `/tdd-workflow`
*   **Framework**: **TIDD-EC**
*   **Linked Persona**: [tdd-guide.md](file:///d:/CLAUDE-PROJECT/website/.agent/skills/tdd-guide.md)
*   **Example**:
    ```text
    /tdd-workflow
    Context Files:
    - [src/lib/api/resend.ts](file:///d:/CLAUDE-PROJECT/website/src/lib/api/resend.ts)
    - [tests/resend.test.ts](file:///d:/CLAUDE-PROJECT/website/tests/resend.test.ts)
    - Target Agent Persona: [tdd-guide.md](file:///d:/CLAUDE-PROJECT/website/.agent/skills/tdd-guide.md)

    Task: TIDD-EC Framework applied
    - **Task**: Update the Resend email utility to support CC and BCC fields.
    - **Instructions**: Map input CC/BCC arrays to the Resend send payload.
    - **Do**:
      - Verify input arrays contain valid email addresses.
      - Retain existing email sending signature.
    - **Don't**:
      - Mutate the configuration object; return a new payload.
    - **Examples**:
      - Input: `cc: ['cc@test.com']`, Output Resend call: `cc: ['cc@test.com']`.
    - **Context**: Resolving request to send copies of RFQs to admins.

    Active MCP Directives:
    - Use the `context7` MCP server to check the latest Resend SDK v3 method signatures.
    Verification: Run `pnpm test tests/resend.test.ts`

    ECC System Validation & Policies:
    - **Agent Persona**: Adopt the linked [tdd-guide.md](file:///d:/CLAUDE-PROJECT/website/.agent/skills/tdd-guide.md) persona and execute its checklist.
    - **Post-Implementation Review**: Review changes using [code-reviewer.md](file:///d:/CLAUDE-PROJECT/website/.agent/skills/code-reviewer.md).
    - **Immutability Policy**: Do not mutate inputs; return fresh copies.
    - **Testing Requirements**: Ensure 80%+ test coverage. Write tests first.
    - **Knowledge Capture Policy**: Log test failures and debug outcomes in memory, and document custom Resend additions in CLAUDE.md.
    ```

### 2. General Planning & Architecture (RISEN + planner)
*   **Target Command**: `/plan`
*   **Framework**: **RISEN**
*   **Linked Persona**: [planner.md](file:///d:/CLAUDE-PROJECT/website/.agent/skills/planner.md)
*   **Example**:
    ```text
    /plan
    Context Files:
    - [package.json](file:///d:/CLAUDE-PROJECT/website/package.json)
    - [src/middleware.ts](file:///d:/CLAUDE-PROJECT/website/src/middleware.ts)
    - Target Agent Persona: [planner.md](file:///d:/CLAUDE-PROJECT/website/.agent/skills/planner.md)

    Task: RISEN Framework applied
    - **Role**: Senior Solutions Architect
    - **Instructions**: Design a system to support multi-tenant subdomain routing for spokes.
    - **Steps**:
      1. Parse incoming subdomains in Middleware.
      2. Rewrite requests to the dynamic `/[tenant]` path.
      3. Handle caching and edge-case domain fallbacks.
    - **End Goal**: Scalable multitenancy.
    - **Narrowing**: Limit design to standard Next.js Middleware capabilities.

    Active MCP Directives:
    - Use the `sequential-thinking` MCP server to lay out step-by-step routing rules before writing the plan.

    ECC System Validation & Policies:
    - **Agent Persona**: Adopt the linked [planner.md](file:///d:/CLAUDE-PROJECT/website/.agent/skills/planner.md) persona.
    - **Knowledge Capture Policy**: Save domain design notes in memory, and document the subdomain architecture in CLAUDE.md.
    ```

### 3. Build & Compiler Error Fixes (BAB + build-error-resolver)
*   **Target Command**: `/build-fix`
*   **Framework**: **BAB**
*   **Linked Persona**: [build-error-resolver.md](file:///d:/CLAUDE-PROJECT/website/.agent/skills/build-error-resolver.md)
*   **Example**:
    ```text
    /build-fix
    Context Files:
    - [src/app/api/auth/[...nextauth]/route.ts](file:///d:/CLAUDE-PROJECT/website/src/app/api/auth/%5B...nextauth%5D/route.ts)
    - Target Agent Persona: [build-error-resolver.md](file:///d:/CLAUDE-PROJECT/website/.agent/skills/build-error-resolver.md)

    Task: BAB Framework applied
    - **Before**: Compilation fails with NextAuth v5 type declaration error after package upgrade.
    - **After**: Successful compilation using standard Auth.js handlers and types.
    - **Bridge**:
      - Update import references to point to Auth.js v5 exports.
      - Resolve handler binding syntax issues.

    Active MCP Directives:
    - Use the `context7` MCP server to lookup Auth.js v5 Next.js handler signatures if type resolutions are missing.
    Verification: Run `pnpm type-check`

    ECC System Validation & Policies:
    - **Agent Persona**: Adopt the linked [build-error-resolver.md](file:///d:/CLAUDE-PROJECT/website/.agent/skills/build-error-resolver.md) persona.
    - **Post-Implementation Review**: Review changes using [code-reviewer.md](file:///d:/CLAUDE-PROJECT/website/.agent/skills/code-reviewer.md).
    - **Knowledge Capture Policy**: Log the resolution details in memory.
    ```


