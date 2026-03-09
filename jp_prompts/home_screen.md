## MANDATORY: Read policies before doing anything

Before writing ANY code, you MUST complete these steps IN ORDER. Do not skip any step. Do not start implementing until all steps are done.

## SLUG: redesign-and-animate-frame3

KEYWORD FOR ACTIVATING WORKTREE: /task-redesign-and-animate-frame3

### Step 0 — Read all policies

Read every file in `.agents/policies/` in this order:

1. `.agents/policies/00-agent-contract.md`
2. `.agents/policies/01-task-protocol.md`
3. `.agents/policies/02-validation.md`
4. `.agents/policies/03-reviewer-policy.md` (if reviewing)

After reading each file, state one key rule from it to prove you read it.

### Step 1 — Read the spec

Read `.agents/specs/active/<task-spec>.md`. Extract: objective, allowed files, forbidden files, constraints, acceptance criteria.

### Step 2 — Run begin_task.sh

Run `bash scripts/begin_task.sh <task-id>` to create the read receipt. Writes are hard-blocked until this exists.

### Step 3 — Pre-change declaration

Output the following BEFORE any edits:
TASK CLASSIFICATION:
RELEVANT FILES:
PLANNED READS:
WHY SUFFICIENT:

### Step 4 — Implement

Use my claude frontend skill
Touch ONLY files listed in APPROVED_FILES. Commit with `[spec:<task-slug>] <message>`.

### Step 4.5 - Frontend Conventions

Hard constraints:

- obey the spec exactly; do not expand scope
- modify only APPROVED_FILES
- do not use any or @ts-ignore
- do not add dependencies or change CSS/config unless the spec explicitly allows it
- complete required validation steps before finishing
- if the spec is unclear, stop and report instead of guessing

### Step 5 — Run quality gates

Run `bash scripts/run_quality_gates.sh` before declaring done. Two consecutive failures = stop and report.

### Step 6 — Open PR

`gh pr create` against main. Do NOT merge.

---

Now here is your actual task:
<task>
Implement a scroll-driven expansion interaction for the 3rd frame/section of the landing page.

Read carefully and follow exactly. Do not expand scope.

OBJECTIVE
In the 3rd frame, create a rounded rectangular container that initially appears in the smaller state shown in the start-state screenshot. As the user continues scrolling down through this 3rd frame, the container should expand upward until it reaches the larger state shown in the end-state screenshot. Once the expanded size is fully reached, the page should continue scrolling downward normally into the next content.

CORE INTERACTION

- The container starts in the smaller state.
- When the 3rd frame hits the intended scroll zone, continued downward scrolling should drive the expansion.
- The expansion must be linked to scroll progress, not a timed animation.
- The container should appear to grow primarily upward.
- Prefer keeping the bottom edge more visually anchored while the top edge moves upward.
- Once the container reaches the final expanded size, the animation ends and normal document scrolling continues.

DO NOT DO THESE

- Do not treat this as the hero section.
- Do not redesign other frames.
- Do not convert this into a fade-in, scale pop, or generic reveal.
- Do not add decorative extras beyond what is needed for the interaction.
- Do not use any.
- Do not use @ts-ignore.
- Do not add unauthorized dependencies.
- Do not modify unrelated files.

DESIGN SPEC
Use the two screenshots I provide as the source of truth.

3rd frame layout:

- This section should sit as the third major frame in the page flow.
- Maintain the page’s existing overall style and header/nav structure.
- The new container must be centered horizontally within the content area.

Initial container state:

- Match the start-state screenshot as closely as possible
- Large rounded rectangle
- Thin subtle border
- Width and placement should match the screenshot closely
- Height should match the screenshot closely
- Spacing above and below should feel consistent with the screenshot
- Corner radius should match the screenshot closely

Expanded container state:

- Match the end-state screenshot as closely as possible
- Same general horizontal placement
- Expanded vertically to the larger target height
- Same rounded-rectangle character
- The main change is the vertical size increase during scroll

IMPLEMENTATION APPROACH
Use a clean scroll-progress-based implementation for the 3rd frame.

Preferred behavior:

1. User scrolls normally into frame 3.
2. During a defined scroll range inside frame 3, the container expands smoothly from the initial height to the final height.
3. The effect should feel pinned/stable while the expansion happens.
4. After the final height is reached, the page continues scrolling naturally into the next section.

Implementation guidance:

- Use a dedicated wrapper for frame 3 with enough scroll range to drive the animation.
- A sticky inner container approach is preferred if it helps achieve the effect cleanly.
- Map scroll progress to container height or top/bottom geometry.
- Keep motion smooth and performant.
- Avoid jank, jumps, and layout thrashing.
- If the repo already uses Framer Motion, you may use it. Otherwise implement with React hooks and native scroll logic.
- Respect reduced motion if reasonably possible.

ACCEPTANCE CRITERIA

- The interaction is implemented in frame 3, not the hero
- The container does not exist beforehand and is created as part of this task
- The initial state matches the provided start-state screenshot closely
- Scrolling through frame 3 expands the container upward toward the provided end-state screenshot
- The expansion is driven by scroll progress
- Once the final size is reached, the page continues scrolling normally
- The implementation is typed, clean, and minimal
- No scope creep

Before coding, state:

- the exact files you will modify
- how frame 3 is currently structured
- the exact scroll-progress mechanism you will use
- how you will ensure the container grows primarily upward

</task>

---
