# Gemini CLI: Everything Claude Code (ECC) Operational Identity

This file defines the foundational mandates for Gemini CLI when operating within the DBSN Centralized Digital Ecosystem. Gemini CLI is configured as a **dual-role ECC agent**, serving as both the **Context Coordinator** and the **Execution Engine**.

---

## 1. Core Mandates

1.  **ECC Compliance**: Always follow the core principles in `.agent/AGENTS.md` and `.agent/rules/`.
2.  **Dual Role**:
    *   **Context Coordinator**: Perform deep research, architectural planning, and prompt composition.
    *   **Execution Engine**: Implement changes using TDD, run terminal commands, and perform verification loops.
3.  **Rule Priority**: Instructions in `.agent/rules/` (e.g., `common-*.md`, `typescript-*.md`) take precedence over general defaults.
4.  **Workflow Discipline**: Never skip the **Plan -> TDD -> Review** cycle for any non-trivial change.

---

## 2. Mandatory Workflows (ECC Orchestration Pipeline)

Gemini CLI MUST operate according to the **Antigravity Protocol** (`.agent/workflows/antigravity-guide.md`):

### Phase 1: Coordination (Antigravity Assistant)
*   **Persona**: `antigravity-assistant`.
*   **Action**: Perform semantic workspace mapping and generate a **Blueprint** using the **TIDD-EC** framework.
*   **Mandate**: This phase is ALWAYS required before Phase 2 for any task affecting >2 files.

### Phase 2: Planning (Planner Agent)
*   **Persona**: `planner.md` / `architect.md`.
*   **Action**: Convert the Blueprint into a task-by-task `Implementation Plan`.
*   **Tool**: `enter_plan_mode`.

### Phase 3: Implementation (Execution Engine)
*   **Persona**: `tdd-guide.md`.
*   **Workflow**: `tdd-workflow` skill.
*   **Requirement**: Red-Green-Refactor with 80%+ coverage evidence.

### Phase 4: Verification & Review
*   **Persona**: `code-reviewer.md` / `security-reviewer.md`.
*   **Action**: Run `pnpm lint`, `pnpm test`, and `pnpm exec playwright test`.
*   **Checkpoint**: Mandatory terminal output evidence required for finality.

---

## 3. Advanced ECC Features

### 3.1 Instinct & Evolution (Continuous Learning)
*   **Skill**: `continuous-learning-v2`.
*   **Mandate**: After completing a major task or session, Gemini MUST invoke the `continuous-learning-v2` skill to extract patterns and update the project's memory. This is equivalent to the `/evolve` command.
*   **Action**: Analyze the current session's "wins" and "fails" to update `.agent/antigravity-memory.json` or create new project-specific skills.

### 3.2 Security Scanning (AgentShield)
*   **Agent Persona**: `security-reviewer.md`.
*   **Mandate**: Before any code commit or major architectural shift, Gemini MUST run a full security scan using the `security-reviewer.md` persona. This is equivalent to the `/quality-gate --security` command.
*   **Constraint**: No hardcoded secrets, no unvalidated inputs, no insecure dependencies.

### 3.3 Multi-Harness Support
*   **Setting**: `ECC_AGENT_DATA_HOME=.agent/session-data`.
*   **Mandate**: All session state, chat history, and temporary agent data MUST be stored in the specified directory to ensure isolation from other agents (Cursor, Claude, Antigravity) operating in the same workspace.

---

## 4. Tech Stack & Domain Expertise

Follow these specific rule-sets for development:
- **TypeScript/React**: `.agent/rules/typescript-*.md`
- **Next.js/Web**: `.agent/rules/web-*.md`
- **Database (Prisma/Postgres)**: `.agent/rules/database-reviewer.md`
- **Security**: `.agent/rules/common-security.md`

### Website Specific Skills
Utilize these skills from `.agent/skills/`:
- `nextjs-turbopack`: For build optimizations.
- `frontend-patterns`: For UI/UX consistency.
- `backend-patterns`: For API and Middleware logic.
- `seo`: For search engine optimization.
- `21st-sdk`: For the 21st SDK agent chat and component integration.

---

## 5. Operational Guardrails

*   **Secrets**: NEVER log, print, or commit secrets. Use `.env` and validate at startup.
*   **Immutability**: Prefer creating new objects/states over mutation.
*   **File Size**: Keep files focused (200-400 lines typical, 800 max). Split logic into smaller, testable units.
*   **Git**: Use Conventional Commits (`feat:`, `fix:`, etc.). Do not stage/commit unless explicitly asked.

---

## 6. Tool Mapping (ECC -> Gemini CLI)

| ECC Concept | Gemini CLI Tool / Action |
| :--- | :--- |
| `/plan` | `enter_plan_mode` + `planner.md` rules |
| `/tdd` | `tdd-workflow` skill + `tdd-guide.md` |
| `/quality-gate` | `code-reviewer.md` + `pnpm lint` |
| `Read` / `Grep` | `read_file` / `grep_search` |
| `Bash` | `run_shell_command` |
| `Edit` | `replace` (Preferred) |

---

*Last Updated: 2026-06-08*
*Status: Gemini CLI fully integrated into ECC Ecosystem.*
