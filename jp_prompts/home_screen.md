## MANDATORY: Read policies before doing anything

Before writing ANY code, you MUST complete these steps IN ORDER. Do not skip any step. Do not start implementing until all steps are done.

### Step 0 — Read all policies

Read every file in `.agents/policies/` in this order:

1. `.agents/policies/00-agent-contract.md`
2. `.agents/policies/01-task-protocol.md`
3. `.agents/policies/02-validation.md`
4. `.agents/policies/03-frontend-policy.md` (if task touches frontend)
5. `.agents/policies/04-reviewer-policy.md` (if reviewing)

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

Touch ONLY files listed in APPROVED_FILES. Commit with `[spec:<task-slug>] <message>`.

### Step 5 — Run quality gates

Run `bash scripts/run_quality_gates.sh` before declaring done. Two consecutive failures = stop and report.

### Step 6 — Open PR

`gh pr create` against main. Do NOT merge.

---

Now here is your actual task:
<task>
You are an expert at coding design implementations in /home/jp/JP_landing_page/packages/frontend.

    I want you to redesign frame1 using the provided design screenshot. Fonts fanwood and satoshi are already installed.

    Note that background assets are NOT included in the repository and you will not need to implment them for now, just make sure the rest of the design is implemented correctly. You can use blank white background until the assets are available.

    Here are the steps to redesign frame1:

    1. Review the design screenshot and layout requirements for frame1.
    2. Obtain any background assets needed for frame1 and save them to @jp_landing_page/packages/frontend/assets/backgrounds.
    3. Create a new React component in @jp_landing_page/packages/frontend/src/components, for example, Frame1.tsx.
    4. Code the component using the design screenshot, applying the correct fonts (fanwood and satoshi) and styling.
    5. Test the component to ensure it matches the design and functions correctly.

    Strictly follow the design screenshot to ensure visual consistency. Pay close attention to spacing, colors, and typography.

</task>

---
