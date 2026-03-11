# Spec: insert-animation

Copy this file to `.agents/specs/active/<YYYY-MM-DD>-<task-id>.md` and fill in every field before starting work. A spec with any blank required field is invalid. The agent must not start without a valid spec.

---

## Objective
Replace the placeholder label in Frame3's expanding rectangle with `scrubDemo.mp4`, scrubbed forward/backward via GSAP ScrollTrigger progress.

## Why
The rectangle currently shows a text placeholder; the real visual is a demo video that should scrub in sync with scroll.

## Branch
<!-- Must follow pattern: agent/<task-id> -->
agent/insert-animation

## Worktree
<!-- Path to the worktree directory -->
../wt-insert-animation

## Allowed files
<!-- Exhaustive list. Globs permitted. Any file touched outside this list is a gate violation. -->
- packages/frontend/src/components/Frame3.tsx
- packages/frontend/src/components/Frame3.test.tsx
- packages/frontend/src/vite-env.d.ts
- packages/frontend/styles/assets/2d/videos/scrubDemo.mp4
- packages/frontend/styles/assets/2d/videos/frame3Animation/*.png
- .agents/specs/active/2026-03-10-insert-animation.md
- .agents/logs/runs/insert-animation.json

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
- packages/frontend/src/components/Frame3.tsx
- packages/frontend/src/vite-env.d.ts

## Implementation Notes
- Import scrubDemo.mp4 as a Vite asset URL
- Add `declare module "*.mp4"` to vite-env.d.ts if missing
- Add videoRef; remove labelRef; replace label div with <video> element
- Wire video.currentTime = self.progress * video.duration in onUpdate callback
- Remove FONT_SIZE_LABEL import (no longer used); keep COLOR_FRAME3_GREEN

## Acceptance Criteria
- [ ] Video covers the rectangle at all scroll positions (object-cover)
- [ ] Video scrubs forward on scroll-down and backward on scroll-up
- [ ] At scroll end, video is at its last frame
- [ ] No TypeScript errors; lint passes
- [ ] Existing rect expand/color animation is unchanged

## Required Checks
<!-- Commands that must pass before the PR is opened. -->
- bun run lint
- bun run typecheck
- bun test

## Rollback Plan
<!-- What to do if this causes a regression after merge. -->
Revert branch if regression appears in <describe affected area>.

## Reviewer Checklist
<!-- The reviewer works through this list. All items must pass before approval. -->
- [ ] All changed files are in Allowed Files
- [ ] No files from Forbidden Files were touched
- [ ] No new dependencies introduced
- [ ] No dead abstractions added
- [ ] No mocks added where real behavior can be tested
- [ ] All Acceptance Criteria are demonstrably met
- [ ] Required Checks pass in CI
