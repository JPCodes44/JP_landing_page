# Frontend Policy

Applies when task touches `packages/frontend/`. Agent contract, task protocol, and validation policies still apply.

## Stack

React + Vite, TypeScript (no `any`/`@ts-ignore`), Tailwind (no inline styles/new CSS files), GSAP for animation, Vitest for tests.

## Components

- Arrow functions only. No `function` keyword, no class components.
- Check existing components before creating new ones.
- Single responsibility per component.

## Styling

- Tailwind utility classes only. Use design tokens — no hardcoded colors/spacing/fonts.
- Responsive units only: `rem`, `em`, `vw`, `vh`, `%`. No `px`/`pt`.
- No new Tailwind config entries without spec approval.

## Animation (GSAP)

- Register plugins at top of file. Clean up in `useEffect` return (`tl.kill()`).
- Animate transforms and opacity only — not layout properties.
- Scope timelines to the component.

## Types

- All props typed. `RefObject<HTMLElement>` for GSAP targets, not `any`.

## Testing (TDD)

- Write tests first. Every new component gets a colocated `.test.tsx`.
- Test behavior, props, state, and error cases.

## Read Before Starting

- `packages/frontend/src/App.tsx`
- `packages/frontend/src/components/`
- `packages/frontend/src/styles/`
