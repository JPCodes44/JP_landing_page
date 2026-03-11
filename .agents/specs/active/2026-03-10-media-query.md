# Spec: media-query

---

## Objective
Add responsive breakpoints to the theme and make all frame/nav/footer components responsive via a `useBreakpoint` hook, eliminating horizontal overflow on mobile, tablet, and desktop viewports.

## Why
The landing page targets a fixed ~834×474px viewport. All styles use hardcoded rem/vw values. On mobile (375px) and desktop (1280px+) the layout overflows and text becomes unreadable, breaking the user experience.

## Branch
agent/media-query

## Worktree
../wt-media-query

## Allowed files
- packages/frontend/src/theme/index.ts
- packages/frontend/src/hooks/useBreakpoint.ts
- packages/frontend/src/App.tsx
- packages/frontend/src/components/Frame1.tsx
- packages/frontend/src/components/Frame2.tsx
- packages/frontend/src/components/Frame3.tsx
- packages/frontend/src/components/Frame4.tsx
- packages/frontend/src/components/Frame5.tsx
- packages/frontend/src/components/Frame6.tsx
- packages/frontend/src/components/Footer.tsx

## Forbidden files
- package-lock.json
- .github/workflows/*
- infra/*

## Constraints
- No new dependencies unless explicitly approved
- Preserve all public APIs
- Must not break existing tests
- No px units — use rem, em, vw, vh, %

## Domain Policy
- `.agents/policies/00-agent-contract.md` (always)
- `.agents/policies/01-task-protocol.md` (always)
- `.agents/policies/02-validation.md` (always)
- `.agents/policies/03-frontend-policy.md` (if touching packages/frontend/)

## Read Before Starting
- `packages/frontend/src/theme/index.ts`
- `packages/frontend/src/App.tsx`
- `packages/frontend/src/components/Frame1.tsx` through `Frame6.tsx`
- `packages/frontend/src/components/Footer.tsx`

## Implementation Notes
- Breakpoints: mobile < 640, tablet 640–1023, desktop 1024–1279, wide ≥ 1280
- Current design is tablet-optimized — tablet values = current theme constants
- Use inline style ternaries with the `useBreakpoint` hook; no CSS media queries (incompatible with inline style objects)
- Frame6 has an inline `ContactForm` component — update that, not `components/ContactForm.tsx`

## Acceptance Criteria
- [ ] `useBreakpoint` hook exported from `packages/frontend/src/hooks/useBreakpoint.ts`
- [ ] Four `BREAKPOINT_*` numeric constants added to theme
- [ ] All Frame components use `useBreakpoint()` to select responsive font/layout values
- [ ] No horizontal overflow at 375px (mobile), 768px (tablet), 1280px (desktop)
- [ ] `bun run lint` passes
- [ ] `bun run typecheck` passes
- [ ] `bun test` passes

## Required Checks
- bun run lint
- bun run typecheck
- bun test

## Rollback Plan
Revert branch if regression appears in layout or animation of any Frame component.

## Reviewer Checklist
- [ ] All changed files are in Allowed Files
- [ ] No files from Forbidden Files were touched
- [ ] No new dependencies introduced
- [ ] No dead abstractions added
- [ ] No mocks added where real behavior can be tested
- [ ] All Acceptance Criteria are demonstrably met
- [ ] Required Checks pass in CI
