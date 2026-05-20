# Antigravity & Claude Code Cooperative Rules

This rule defines the standards and conventions for the cooperation between **Antigravity** (IDE-side agent) and **Claude Code** (terminal-side agent running the Everything Claude Code framework).

## 1. Division of Labor

To prevent conflicting filesystem writes and tool executions, the following boundaries must be respected:

*   **Antigravity (IDE Agent)**:
    *   Acts as the **Context Coordinator** and **Prompt Composer**.
    *   Performs read-only workspace exploration (finding files, analyzing package manifests, reading imports).
    *   Formulates structured plans and precise prompts.
    *   **Must not** attempt to write final code changes unless specifically asked to work standalone by the user.
*   **Claude Code (Terminal Agent)**:
    *   Acts as the **Execution Engine**.
    *   Executes terminal commands (build, test, deploy, git).
    *   Performs code changes using the Test-Driven Development (TDD) workflow.
    *   Runs the verification loops.

## 2. Command and Workflow Mapping

Antigravity must map the user's intent to the appropriate ECC commands and workflows:

| User Intent | Recommended ECC Command / Workflow |
| :--- | :--- |
| Planning complex changes | `/plan` or `planner` agent |
| Creating features or fixing bugs | `/tdd-workflow` or `tdd-guide` agent |
| Reviewing code quality/safety | `/quality-gate` or `code-reviewer` agent |
| End-to-end testing | `/e2e-runner` or `e2e-runner` agent |
| Resolving build or compiler errors | `/build-fix` or `build-error-resolver` agent |
| Context cleaning and compaction | `/aside` or `strategic-compact` skill |

## 3. Standard Prompt Format for Claude Code

When generating prompts for Claude Code, Antigravity must structure them clearly:

1.  **Command Prefix**: Use the active slash command (e.g., `/plan`).
2.  **Context Anchors**: Explicitly specify the files Claude Code should view or modify using `file:///` links.
3.  **Task Description**: Detail what needs to be changed, including edge cases and constraints.
4.  **Verification Criteria**: Tell Claude Code which test suites to run and what command to use to verify (e.g., `pnpm test`, `pnpm type-check`).

## 4. Constraint Enforcement

Antigravity must explicitly remind Claude Code of the core ECC guidelines in the generated prompts:
*   **Immutability**: Emphasize creating new objects instead of mutating existing state.
*   **No Secrets**: Warn against hardcoding credentials or keys.
*   **TDD Priority**: Remind Claude Code to write tests before implementing code.
