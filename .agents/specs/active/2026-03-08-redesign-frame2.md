# Spec: redesign-frame2

---

## Objective
Create Frame2 component — "What I do" section with two-column layout: heading + body text on left, 2x3 icon grid on right, on warm beige background.

## Why
The landing page currently only has Frame1 (hero). Frame2 is needed to showcase services as the next section.

## Branch
agent/redesign-frame2

## Worktree
../wt-redesign-frame2

## Allowed files
- packages/frontend/src/components/Frame2.tsx
- packages/frontend/src/components/Frame2.test.tsx
- packages/frontend/src/App.tsx
- packages/frontend/src/App.test.tsx
- packages/frontend/src/vite-env.d.ts
- .agents/specs/active/2026-03-08-redesign-frame2.md
- .agents/logs/reads/redesign-frame2.json
- .agents/logs/runs/redesign-frame2.json
- .agents/logs/reviews/redesign-frame2.md
- .agents/logs/runs/redesign-and-animate-frame3.start
- .agents/policies/04-reviewer-policy.md
- .agents/specs/active/2026-03-09-redesign-and-animate-frame3.md
- .claude/settings.json
- docs/engineering/ai-contribution-policy.md
- jp_prompts/home_screen.md
- packages/frontend/src/components/Frame1.tsx
- scripts/prompt_worktree_hook.sh

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
- packages/frontend/src/index.css
- packages/frontend/src/App.tsx
- .agents/policies/03-frontend-policy.md

## Implementation Notes
- Follow Frame1 patterns: arrow function, Tailwind-only, theme tokens
- Left column: heading "What I do:" + body text with "agentic" highlighted in accent-green
- Right column: 2x3 grid of 6 PNG icons from styles/assets/2d/visuals/
- Icon order: slider, temperature, workflow, bell, calendar, tasks

## Acceptance Criteria
- [ ] Frame2.tsx uses arrow function export
- [ ] Renders h2 heading "What I do:"
- [ ] Body text contains "agentic" highlighted with text-accent-green
- [ ] 6 icon images rendered in a grid
- [ ] All styles use Tailwind utility classes (no inline styles)
- [ ] No px units — all sizing in rem/em/vw/vh/%
- [ ] Frame2 added to App.tsx below Frame1
- [ ] Tests pass for Frame2 component
- [ ] Existing tests still pass

## Required Checks
- bun run lint
- bun run typecheck
- bun test

## Rollback Plan
Revert branch if regression appears in Frame2 or App layout.

## Reviewer Checklist
- [ ] All changed files are in Allowed Files
- [ ] No files from Forbidden Files were touched
- [ ] No new dependencies introduced
- [ ] No dead abstractions added
- [ ] No mocks added where real behavior can be tested
- [ ] All Acceptance Criteria are demonstrably met
- [ ] Required Checks pass in CI
