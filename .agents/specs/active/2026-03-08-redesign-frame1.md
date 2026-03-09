# Spec: redesign-frame1

---

## Objective
Rewrite Frame1 component to use Tailwind CSS utility classes with proper color tokens, arrow function syntax, and responsive units — matching the design screenshot exactly.

## Why
Frame1 currently uses a custom CSS file with px-based values, violating the frontend policy which requires Tailwind utility classes, arrow function components, and responsive units (rem/em/vw/vh/%).

## Branch
agent/redesign-frame1

## Worktree
../wt-redesign-frame1

## Allowed files
- packages/frontend/src/index.css
- packages/frontend/src/components/Frame1.tsx
- packages/frontend/src/components/Frame1.css (delete)

## Forbidden files
- package-lock.json
- .github/workflows/*
- infra/*
- bun.lockb

## Constraints
- No new dependencies unless explicitly approved
- Must not break existing tests
- No inline styles — Tailwind utility classes only
- No px units — use rem/em/vw/vh/%
- Arrow function component syntax required

## Domain Policy
- `.agents/policies/00-agent-contract.md` (always)
- `.agents/policies/01-task-protocol.md` (always)
- `.agents/policies/02-validation.md` (always)
- `.agents/policies/03-frontend-policy.md` (if touching packages/frontend/)

## Read Before Starting
- packages/frontend/src/components/Frame1.tsx
- packages/frontend/src/components/Frame1.css
- packages/frontend/src/index.css
- .agents/policies/03-frontend-policy.md

## Implementation Notes
- Add color tokens (--color-bg-warm, --color-text-primary, --color-accent-green, --color-border-warm) to @theme in index.css
- Convert Frame1.tsx to arrow function with Tailwind classes using font-fanwood, font-satoshi, and new color tokens
- Delete Frame1.css after migration

## Acceptance Criteria
- [ ] Frame1.tsx uses arrow function export
- [ ] All styles use Tailwind utility classes (no CSS file, no inline styles)
- [ ] No px units — all sizing in rem/em/vw/vh/%
- [ ] Color tokens defined in index.css @theme block
- [ ] Frame1.css is deleted
- [ ] `bun run build` passes
- [ ] `bun run typecheck` passes

## Required Checks
- bun run build
- bun run typecheck

## Rollback Plan
Revert branch if regression appears in Frame1 visual layout.

## Reviewer Checklist
- [ ] All changed files are in Allowed Files
- [ ] No files from Forbidden Files were touched
- [ ] No new dependencies introduced
- [ ] No dead abstractions added
- [ ] No mocks added where real behavior can be tested
- [ ] All Acceptance Criteria are demonstrably met
- [ ] Required Checks pass in CI
