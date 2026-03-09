# Context Retrieval Policy

## Purpose

Before writing any code, an agent must complete a mandatory context retrieval step. This policy governs how that step is performed. The output is a read receipt that unlocks the write gate.

## Trigger

Run `scripts/begin_task.sh <task-id>` at the start of every task, before any Write, Edit, or MultiEdit operation. The pre-tool-use hook will hard-block writes until the receipt exists.

---

## Step 1 — Seed Reads (mandatory, always)

Read these in order before anything else:

1. The task spec: `.agents/specs/active/<date>-<task-id>.md`
2. This policy: `.agents/policies/context-retrieval-policy.md`
3. The global policy: `.agents/policies/global-policy.md`

Extract from the spec:

- **Objective** — the exact outcome
- **Allowed files** — the complete write surface
- **Forbidden files** — never touch these
- **Constraints** — non-negotiable rules
- **Acceptance criteria** — what done looks like

---

## Step 2 — Task Classification

Classify the task as exactly one of:

| Class           | When to use                                              |
| --------------- | -------------------------------------------------------- |
| `frontend-only` | All allowed files are under `packages/frontend/`         |
| `backend-only`  | All allowed files are under `packages/backend/`          |
| `app+common`    | Allowed files span one app AND `packages/common/`        |
| `cross-cutting` | Allowed files span multiple apps or touch root config/CI |

The classification determines which directories you are permitted to read during exploration.

---

## Step 3 — Retrieval Budget

Retrieve context in this order. Stop when implementation file, test file, and dependency context are clear. Do not exhaust the budget for its own sake.

| Stage | Action                                      | Limit                   |
| ----- | ------------------------------------------- | ----------------------- |
| 1     | Collect file paths from `Allowed files`     | 10 file paths max       |
| 2     | Symbol/import/reference search (grep, Glob) | 5 search operations max |
| 3     | Snippet reads (targeted line ranges)        | 5 snippet reads max     |
| 4     | Full file reads                             | 3 full file reads max   |
| 5     | Outward dependency hop (one level only)     | 1 hop max               |

If the budget is exhausted and you are still blocked: report the ambiguity. Do not broaden scope to resolve it.

---

## Step 4 — Scoping Rules

**Do not read** unless the spec's `Allowed files` explicitly includes or imports from that location:

- Sibling app directories (e.g. if task is `frontend-only`, do not read `packages/backend/`)
- `packages/common/` unless a file in `Allowed files` directly imports from it, or the spec names it
- Root config files (`package.json`, `tsconfig.json`, `bun.lockb`, `.github/workflows/*`, etc.) unless the task is `cross-cutting` and the spec names them
- Any file in `Forbidden files`

**One dependency hop rule:** If an allowed file imports from a shared module, you may read that module's exports. You may not follow that module's own imports further.

---

## Step 5 — Compress to Working Memory

After retrieval, write a single paragraph (≤ 150 words) summarizing:

- What the task is (one sentence from the objective)
- Which files will be created or modified and why
- What the key constraint or risk is
- What done looks like (from acceptance criteria)

This paragraph becomes the `summary` field in the read receipt. It is the only context carried forward into implementation. Do not carry raw file contents forward.

---

## Step 6 — Pre-Change Declaration

Before making any changes, output:

```
TASK CLASSIFICATION: <class>
RELEVANT FILES: <comma-separated list of files identified as relevant>
PLANNED READS: <comma-separated list of files you intend to open>
WHY SUFFICIENT: <one sentence explaining why these reads are enough>
```

This output is written into the read receipt by `begin_task.sh`.

---

## Enforcement

The read receipt at `.agents/logs/reads/<task-id>.json` must exist before any write tool fires. The pre-tool-use hook checks for it. If it is absent, all writes are hard-blocked with exit code 1. Running `begin_task.sh` creates the receipt.

## Receipt Format

```json
{
  "task_id": "...",
  "timestamp": "ISO-8601",
  "classification": "frontend-only|backend-only|app+common|cross-cutting",
  "spec_path": "...",
  "relevant_files": ["..."],
  "planned_reads": ["..."],
  "why_sufficient": "...",
  "summary": "..."
}
```
