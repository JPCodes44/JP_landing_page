# Task Protocol

## Lifecycle

```
spec → worktree → implement → gate → PR
```

1. **Spec**: `.agents/specs/active/<task-slug>.md` — fill before any code.
2. **Worktree**: `scripts/create_agent_worktree.sh <task-slug>`.
3. **Context**: `scripts/begin_task.sh <task-id>` — writes are hook-blocked until this runs.
4. **Implement**: Touch only `APPROVED_FILES` — enforced by hooks.
5. **Gate**: `scripts/run_quality_gates.sh` — consecutive failures are tracked automatically.
6. **PR**: Open against `main`. Do not merge.

## Before Writing Code

1. Read the spec. Extract objective, allowed files, constraints, acceptance criteria.
2. Restate the task in one sentence.
3. List files you will modify.
4. Output: `TASK CLASSIFICATION`, `RELEVANT FILES`, `PLANNED READS`, `WHY SUFFICIENT`.
