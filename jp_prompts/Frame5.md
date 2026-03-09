## MANDATORY: Read policies before doing anything

Before writing ANY code, you MUST complete these steps IN ORDER. Do not skip any step. Do not start implementing until all steps are done.

## SLUG: redesign-and-animate-frame3

KEYWORD FOR ACTIVATING WORKTREE: /task-redesign-and-animate-frame5

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

### Step 7 - Commit and stage

Once you commit and stage changes on the worktree for the pr, prompt me to git push and review the code. I will manually push the changes onto the pr worktree and review the code.

Since agent pushes are blocked including from me, tell me the exact command to run to push the changes (usually using --no-verify since the pre-commit hooks will fail due to the agent's unique environment).

---

Now here is your actual task:
<task>
You are an expert at coding design implementations in /home/jp/JP_landing_page/packages/frontend.

    I want you to redesign frame4 using the provided design screenshot. Fonts fanwood and satoshi are already installed.

    Note that background assets are NOT included in the repository and you will not need to implment them for now, just make sure the rest of the design is implemented correctly. You can use blank white background until the assets are available.

    Here are the steps to redesign frame4:

    1. Review the design screenshot and layout requirements for frame4.
    2. plan out the animation going from image 1 (start state) to image 2 (end state). Please note the exact positions, where the start text from image one starts to appear and where the ending state position of the text ends in image 2.
    3. Also the rectangular box in image 2 should appear once the text from image 1 starts to reach full opacity.
    4. Create a new React component in @jp_landing_page/packages/frontend/src/components, for example, Frame4.tsx.
    5. Code the component using the design screenshot, applying the correct font (should only be fanwood) and styling.
    6. Test the component to ensure it matches the design and functions correctly.

    Strictly follow the design screenshot to ensure visual consistency. Pay close attention to spacing, colors, and typography.

</task>

---
