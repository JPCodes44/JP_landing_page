# Spec: redesign-and-animate-frame4

---

## Objective
Create Frame4, a scroll-animated section with heading "Comprehensive Solutions:" that slides up from the viewport bottom and an accordion list that fades in once the heading reaches full opacity.

## Why
Frame4 is the next content section after Frame3 and is missing from the page; without it the landing page is incomplete.

## Branch
agent/redesign-and-animate-frame4

## Worktree
../wt-redesign-and-animate-frame4

## Allowed files
- packages/frontend/src/components/Frame4.tsx
- packages/frontend/src/components/Frame4.test.tsx
- packages/frontend/src/App.tsx
- packages/frontend/src/App.test.tsx
- .agents/specs/active/2026-03-09-redesign-and-animate-frame4.md
- .agents/logs/runs/redesign-and-animate-frame4.json

## Forbidden files
- package-lock.json
- .github/workflows/*
- infra/*

## Constraints
- No new dependencies unless explicitly approved
- Preserve all public APIs
- Must not break existing tests
- No inline styles; no hardcoded colors (use design tokens)
- No px/pt units — use rem, vw, vh, % only

## Domain Policy
- `.agents/policies/00-agent-contract.md` (always)
- `.agents/policies/01-task-protocol.md` (always)
- `.agents/policies/02-validation.md` (always)
- `.agents/policies/03-frontend-policy.md` (if touching packages/frontend/)

## Read Before Starting
- packages/frontend/src/components/Frame3.tsx
- packages/frontend/src/components/Frame3.test.tsx
- packages/frontend/src/index.css
- packages/frontend/src/App.tsx

## Implementation Notes
- Use same sticky-wrapper pattern as Frame3 (300vh outer section, sticky inner)
- GSAP ScrollTrigger timeline: heading y 40vh→0 + opacity 0→1 over 0–0.7 progress, accordion opacity 0→1 over 0.7–1.0 progress
- Respect prefers-reduced-motion: skip animation, show everything at full opacity
- Ship colocated Frame4.test.tsx following Frame3.test.tsx patterns

## Acceptance Criteria
- [ ] Frame4 renders a `<section>` with heading "Comprehensive Solutions:"
- [ ] Accordion contains exactly 3 items: "Continuous Lead gen", "Automated reporting", "Agentic internal tools"
- [ ] Each accordion item has a horizontal separator (border-t) and a "+" on the right
- [ ] GSAP timeline animates heading then accordion on scroll (300vh scroll distance)
- [ ] prefers-reduced-motion: all elements visible immediately, no animation
- [ ] Frame4 appears in App.tsx after Frame3
- [ ] bun run lint passes
- [ ] bun run typecheck passes
- [ ] bun test passes (including Frame4.test.tsx)

## Required Checks
- bun run lint
- bun run typecheck
- bun test

## Rollback Plan
Revert branch if regression appears in scroll animation or existing Frame1–3 rendering.

## Reviewer Checklist
- [ ] All changed files are in Allowed Files
- [ ] No files from Forbidden Files were touched
- [ ] No new dependencies introduced
- [ ] No dead abstractions added
- [ ] No mocks added where real behavior can be tested
- [ ] All Acceptance Criteria are demonstrably met
- [ ] Required Checks pass in CI
