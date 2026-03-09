# Frontend Agent Policy

Applies to all agents working in `packages/frontend/`.
Layers on top of `global-policy.md` — all global rules still apply.

## Stack

- **Framework**: React + Vite
- **Language**: TypeScript — no `any`, no `@ts-ignore`
- **Styling**: Tailwind utility classes only — no inline styles, no new CSS files
- **Animation**: GSAP — use it for all non-trivial motion. Do not reach for CSS transitions or other animation libraries.
- **Testing**: Vitest

## Hard Rules

**Scope**

- Do not touch `packages/backend/` or `packages/common/` unless the spec explicitly lists those files in `APPROVED_FILES`.
- Do not install new packages without explicit approval in the spec. This includes GSAP plugins (e.g. ScrollTrigger, Flip) — list them in the spec first.

**Components**

- Check `packages/frontend/src/components/` before creating a new component. Extend existing ones if possible.
- Every new component must have a colocated Vitest test file (`ComponentName.test.tsx`).
- Do not create components with more than one responsibility. Split them.
- Every component must be an arrow function. Do not use `function` keyword or class components.

**Animation (GSAP)**

- Register plugins at the top of the file that uses them (`gsap.registerPlugin(...)`).
- Clean up animations in `useEffect` return: `return () => { tl.kill() }` or equivalent.
- Do not animate layout-affecting properties (width, height, margin, padding) — animate transforms and opacity only.
- Keep timelines scoped to the component. Do not use global GSAP context unless the spec requires it.

**Styling**

- Use design tokens from `src/styles/theme.ts` (or equivalent) — do not hardcode colors, spacing, or font sizes.
- Do not add new Tailwind config entries without spec approval.

**Types**

- Props must be typed. No implicit `any` from event handlers or third-party refs.
- Use `RefObject<HTMLElement>` (not `any`) when passing GSAP targets.

**Responsive Units Requirement**

For all `frontend-only` tasks: Use only relative and responsive units in CSS:

- `rem`, `em` for font sizes and spacing
- `vw`, `vh` for viewport-relative dimensions
- `%` for widths and flexible layouts

Avoid absolute units (`px`, `pt`). This ensures accessibility and responsiveness across device sizes.

## Read Before Starting

For every frontend task, read these first:

- `packages/frontend/src/App.tsx` — routing and layout conventions
- `packages/frontend/src/components/` — existing component patterns
- `packages/frontend/src/styles/` — design tokens and global styles

If the task involves animation, also read any existing component that uses GSAP to understand the established pattern.

## Acceptance Criteria (minimum for any frontend task)

- [ ] `bun test packages/frontend` passes
- [ ] `bun run typecheck` passes with no new suppressions
- [ ] No files outside `APPROVED_FILES` modified
- [ ] No new packages added without spec approval
- [ ] GSAP animations clean up on unmount (if applicable)
