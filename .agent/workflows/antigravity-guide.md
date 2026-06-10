---
description: Advanced Protocol for ECC Cooperative Tasks. Defines the logical sequential flow from Context Coordination to Execution.
---

# /antigravity-guide

This guide defines the **ECC Orchestration Protocol** for Gemini CLI. It ensures a logical, sequential transition from high-level "Context Coordination" (Planning) to low-level "Execution" (TDD).

## 1. The ECC Orchestration Pipeline

Gemini CLI must move through these states in order:

### State 0: Clarification (Natural Language Gate)
*   **Action**: If the user's request is underspecified, the assistant MUST ask follow-up questions.
*   **Goal**: Ensure 100% alignment on "Definition of Done" before any tool use.

### State 1: Coordination (Antigravity Assistant)
*   **Action**: Translate casual intent into a precise **Execution Blueprint**. Discover experts from 64 agents and 261 skills.
*   **Goal**: Provide context and goals without dictating implementation details.
*   **Output**: A structured TIDD-EC prompt.

### State 2: Planning (Planner Agent)
*   **Action**: Activate `planner.md` or `architect.md`.
*   **Goal**: Break the blueprint into a task-by-task implementation plan.
*   **Output**: `Implementation Plan` document.

### State 3: Execution (Domain Agents & TDD)
*   **Action**: Activate `tdd-guide.md` PLUS dynamically discovered domain agents (e.g., `database-reviewer.md`, `frontend-patterns`).
*   **Goal**: Implementation via Red-Green-Refactor using domain-specific ECC skills.
*   **Output**: Verified code with 80%+ coverage.

### State 4: Shield & Review (AgentShield & Quality Gate)
*   **Action**: Activate `code-reviewer.md` and `security-reviewer.md` (AgentShield).
*   **Goal**: Quality assurance and strict security audit.
*   **Output**: Final verification report via terminal evidence.

### State 5: Evolution (Continuous Learning)
*   **Action**: Activate `continuous-learning-v2` skill.
*   **Goal**: Extract patterns, instincts, and workflow improvements from the session.
*   **Output**: Updates to `.agent/antigravity-memory.json` or new project skills.

## 2. Operating Procedures

### A. Context Anchoring
Every task MUST start with an exhaustive ECC context anchor block:
```markdown
# ECC CONTEXT ANCHORS
- Primary Agent: [agent-name.md](file:///...)
- Domain Skills: [skill-folder/SKILL.md](file:///...), [skill-folder2/SKILL.md](file:///...)
- Rule Sets: [rule-file.md](file:///...)
- Target Files: [file-1.tsx](file:///...), [file-2.test.tsx](file:///...)
```

### B. Sequential Logic Enforcement
The Execution Engine MUST NOT jump to State 3 (Execution) without completing State 2 (Planning) for any task involving >2 files.

### C. Evidence-Based Verification
No task is "Complete" without terminal output evidence:
- `npm test` (Unit/Integration)
- `npx playwright test` (E2E)
- `npm run lint` (Standards)
- `npm run build` (System integrity)

## 3. Command Usage

*   `/antigravity prepare: <task>`: Invokes the **Antigravity Assistant** to generate the blueprint.
*   `/antigravity plan: <blueprint>`: Invokes the **Planner Agent** to create the implementation plan.
*   `/antigravity execute: <plan>`: Invokes the **TDD Guide** to start implementation.
*   `/antigravity review`: Invokes the **Reviewer Agents** to close the session.

## 4. MCP Directives

*   **Documentation**: Use `context7` for Next.js 15, Tailwind, and Prisma.
*   **Testing**: Use `playwright` for all E2E user journeys.
*   **Reasoning**: Use `sequential-thinking` for complex data flow mapping.
*   **Persistence**: Use `memory` to track entities across sub-tasks.

---

*Protocol Version: 2.1.0*
*Status: ECC Sequential Orchestration Mandatory.*
