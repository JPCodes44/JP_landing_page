## MANDATORY: Read policies before doing anything

Before writing ANY code, you MUST complete these steps IN ORDER. Do not skip any step. Do not start implementing until all steps are done.

## SLUG: redesign-and-animate-frame3

KEYWORD FOR ACTIVATING WORKTREE: /task-create-theme-file

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
You are an expert at coding frontend themes for current designs in /home/jp/JP_landing_page/packages/frontend.

    I want you to make a dedicated theme folder in /home/jp/JP_landing_page/packages/frontend/src and grab every magic number you can find, give it a dedicated name in a theme file. then from those defined constants in the theme file, interpolate them into the utility tailwind classes in each react component.

    Here are the steps to implement the theme file:

    1. create a new folder in /home/jp/JP_landing_page/packages/frontend/src called theme.
    2. Inside the theme folder, create a new file called index.ts.
    3. In index.ts, define and export constants for all the magic numbers you can find in the current frontend codebase. This includes but is not limited to: spacing values, color values, font sizes, border radius values, etc. For example, if you find a padding value of say 1.9rem used in multiple places, you can define a constant like export const SPACING_LARGE = '1.9rem'; and use SPACING_LARGE in the utility classes instead of the hardcoded '1.9rem'.

    Make sure to cover all magic numbers and give them meaningful names that indicate their purpose or usage. The goal is to centralize all these values in one theme file so that they can be easily managed and updated in the future.

</task>

---
