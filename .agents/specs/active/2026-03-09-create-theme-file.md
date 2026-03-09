# Spec: create-theme-file

Copy this file to `.agents/specs/active/<YYYY-MM-DD>-<task-id>.md` and fill in every field before starting work. A spec with any blank required field is invalid. The agent must not start without a valid spec.

---

## Objective
Create `src/theme/index.ts` exporting named constants for all magic numbers found in the frontend codebase, and replace inline magic values in all components with those constants.

## Why
Magic numbers scattered across components make design changes brittle and hard to track. Centralizing them into a single theme file enables consistent, maintainable updates.

## Branch
<!-- Must follow pattern: agent/<task-id> -->
agent/create-theme-file

## Worktree
<!-- Path to the worktree directory -->
../wt-create-theme-file

## Allowed files
<!-- Exhaustive list. Globs permitted. Any file touched outside this list is a gate violation. -->
- packages/frontend/src/theme/index.ts
- packages/frontend/src/App.tsx
- packages/frontend/src/components/Frame1.tsx
- packages/frontend/src/components/Frame2.tsx
- packages/frontend/src/components/Frame3.tsx
- packages/frontend/src/components/Frame4.tsx
- .agents/specs/active/2026-03-09-create-theme-file.md
- .agents/logs/reads/create-theme-file.json
- .agents/logs/runs/create-theme-file.json

## Forbidden files
<!-- Files the agent must never touch regardless of what the task seems to require. -->
- package-lock.json
- .github/workflows/*
- infra/*

## Constraints
<!-- Non-negotiable rules for the implementation. -->
- No new dependencies unless explicitly approved
- Preserve all public APIs
- Must not break existing tests

## Domain Policy
<!-- Which domain policy applies. Remove inapplicable lines. -->
- `.agents/policies/00-agent-contract.md` (always)
- `.agents/policies/01-task-protocol.md` (always)
- `.agents/policies/02-validation.md` (always)
- `.agents/policies/03-frontend-policy.md` (if touching packages/frontend/)

## Read Before Starting
<!-- Files the agent must read before writing any code. -->
- packages/frontend/src/App.tsx
- packages/frontend/src/components/Frame1.tsx
- packages/frontend/src/components/Frame2.tsx
- packages/frontend/src/components/Frame3.tsx
- packages/frontend/src/components/Frame4.tsx

## Implementation Notes
- Tailwind arbitrary values (e.g. `text-[1.9rem]`) cannot accept JS variables — convert them to inline styles
- Import path from components to theme: `../theme`
- Import path from App.tsx to theme: `./theme`
- GSAP numeric values (durations, scales) should use constants

## Acceptance Criteria
- [ ] `packages/frontend/src/theme/index.ts` exists and exports all named constants
- [ ] No raw magic numbers remain in the 5 component files that match the exported constants
- [ ] All quality gates pass (lint, typecheck, tests)

## Required Checks
<!-- Commands that must pass before the PR is opened. -->
- bun run lint
- bun run typecheck
- bun test

## Rollback Plan
<!-- What to do if this causes a regression after merge. -->
Revert branch if regression appears in frontend component rendering or animation behavior.

## Reviewer Checklist
<!-- The reviewer works through this list. All items must pass before approval. -->
- [ ] All changed files are in Allowed Files
- [ ] No files from Forbidden Files were touched
- [ ] No new dependencies introduced
- [ ] No dead abstractions added
- [ ] No mocks added where real behavior can be tested
- [ ] All Acceptance Criteria are demonstrably met
- [ ] Required Checks pass in CI
