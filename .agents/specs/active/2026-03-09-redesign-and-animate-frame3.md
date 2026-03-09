# Spec: redesign-and-animate-frame3

---

## Objective
Build Frame3 as a scroll-driven section where a rounded rectangle grows from ~48vh to ~78vh tall (bottom-anchored, top grows upward) as the user scrolls, transitioning from warm-gray to mint-green.

## Why
Frame3 does not exist; the landing page needs a third section with a distinctive scroll-driven visual to engage users scrolling past Frame2.

## Branch
agent/redesign-and-animate-frame3

## Worktree
../wt-redesign-and-animate-frame3

## Allowed files
- packages/frontend/src/components/Frame3.tsx
- packages/frontend/src/components/Frame3.test.tsx
- packages/frontend/src/App.tsx
- packages/frontend/src/App.test.tsx
- packages/frontend/vitest.config.ts
- .agents/specs/active/2026-03-09-redesign-and-animate-frame3.md
- .agents/logs/reads/redesign-and-animate-frame3.json
- .agents/logs/runs/redesign-and-animate-frame3.json

## Forbidden files
- package-lock.json
- .github/workflows/*
- infra/*

## Constraints
- No new dependencies unless explicitly approved
- Preserve all public APIs
- Must not break existing tests
- No `any` or `@ts-ignore`
- Use React state + scroll event listener (no GSAP) for scroll-driven progress

## Domain Policy
- `.agents/policies/00-agent-contract.md` (always)
- `.agents/policies/01-task-protocol.md` (always)
- `.agents/policies/02-validation.md` (always)
- `.agents/policies/03-frontend-policy.md` (if touching packages/frontend/)

## Read Before Starting
- packages/frontend/src/App.tsx
- packages/frontend/src/components/Frame1.tsx
- packages/frontend/src/components/Frame2.tsx
- packages/frontend/src/index.css

## Implementation Notes
- Outer `<section>` with `height: 300vh` and a sticky inner `<div>` at `height: 100vh`
- Progress = `clamp(0, 1, -rect.top / (wrapperHeight - vh))` on scroll
- Container: `position: absolute; bottom: 1.5rem; left: 10%; right: 10%`
- Height transitions from ~48vh to ~78vh via inline style (React state — not GSAP)
- Background color interpolates from `#dedad5` (start) to `#c2f0c2` (end)
- Label "SOME COOL VISUAL WOAW" fades in at progress > 0.8
- Reduced motion: skip animation, render at full expanded size
- Update App.tsx to include `<Frame3 />` after `<Frame2 />`
- Update App.test.tsx children count from 2 → 3

## Acceptance Criteria
- [ ] Frame3 renders after Frame2 on the landing page
- [ ] On scroll into Frame3, rectangle grows from ~48vh to ~78vh (bottom-anchored)
- [ ] Background color interpolates from warm-gray to mint-green during expansion
- [ ] Label "SOME COOL VISUAL WOAW" fades in at ~80% expansion
- [ ] After full expansion, page continues scrolling normally
- [ ] `prefers-reduced-motion` renders at full expanded size with no animation
- [ ] `bun run lint`, `bun run typecheck`, `bun test` all pass

## Required Checks
- bun run lint
- bun run typecheck
- bun test

## Rollback Plan
Revert branch if regression appears in scroll behavior or landing page rendering.

## Reviewer Checklist
- [ ] All changed files are in Allowed Files
- [ ] No files from Forbidden Files were touched
- [ ] No new dependencies introduced
- [ ] No dead abstractions added
- [ ] No mocks added where real behavior can be tested
- [ ] All Acceptance Criteria are demonstrably met
- [ ] Required Checks pass in CI
