# Global Agent Policy

## Mission

Implement only the requested task. Do not expand scope.

## Hard Rules (apply to all agents)

**Git operations**
- Do not run `git push`.
- Do not run `git merge`.
- Do not create branches except via `scripts/create_agent_worktree.sh`.
- Do not commit directly to `main`.
- Do not force-push to any branch.
- Do not use `--no-verify`, `--skip`, or any flag that bypasses a hook.

**Protected files and directories**
- Do not edit `.github/workflows/*` unless the spec explicitly lists the exact file in `APPROVED_FILES`.
- Do not edit `deployment/`, `infra/`, or any cloud/container config.
- Do not edit secrets or env files (`.env`, `*.env`, `secrets/`, `credentials/`, etc.).
- Do not edit lockfiles (`bun.lockb`, `package-lock.json`, etc.) unless the spec explicitly requires it.
- Do not touch any file outside `APPROVED_FILES`.

**Scope discipline**
- Do not add new dependencies without explicit approval stated in the spec.
- Do not perform mass renames (renaming more than one file or identifier counts as mass rename — stop and get approval).
- Do not delete more than three files in a single operation without explicit spec approval.
- Do not generate docs, README files, or markdown commentary files unless the spec explicitly requires each one.
- Do not refactor, reformat, or clean up code outside the direct task scope.

**Process**
- If quality gates fail twice in a row, stop and report instead of improvising a fix.
- Do not open a PR without a passing gate run.
- If the spec is ambiguous, stop and report the ambiguity. Do not interpret and proceed.

## Agent-Type Write Restrictions

These rules layer on top of the Hard Rules above.

| Agent type | Permitted writes |
|---|---|
| **General / implementing** | `APPROVED_FILES` only |
| **Scout / research** | `.agents/learnings/` only — no writes anywhere else, ever |
| **Reviewer** | `.agents/logs/reviews/` only — no writes anywhere else, ever |
| **Migration / refactor** | Only within the directories explicitly listed in the spec's `APPROVED_FILES`; scope must be a named subtree (e.g. `packages/foo/**`) |

Any write path not in the permitted column above is a hard stop — exit immediately and report.

## Required Behavior

1. Read the assigned spec before touching anything.
2. Restate the task in one sentence before starting.
3. List the files you intend to modify before modifying them.
4. Make the smallest viable change. Do not refactor, rename, or clean up anything outside the task.
5. Run `scripts/run_quality_gates.sh` before proposing completion.

## Traceability

Every agent run must emit a structured log to `.agents/logs/runs/<task-id>.json`.

`scripts/run_quality_gates.sh` does this automatically on success. On early exit or failure, call it manually:

```bash
bash scripts/emit_run_log.sh <task-id> \
  --lint passed --typecheck failed --tests skipped --build skipped \
  --status failed \
  --summary "typecheck failed on src/foo.ts: Property X does not exist"
```

The log captures: spec, branch, worktree, start/end time, changed files, commands run, gate results, and final summary. It is the forensic record of the run. Do not skip it.

## Testing

See `testing-policy.md` for the full testing policy. Summary:
- Never mock internal modules — use real implementations.
- All tests must pass. No skips, no `.only`, no commented-out failures.
- Tests that only assert on mock calls are not tests. Rewrite them.

## Completion Criteria

A task is complete only when all of the following are true:

- All tests pass.
- Lint passes.
- Typecheck passes.
- All changed files are within `APPROVED_FILES`.
- All gates in `scripts/run_quality_gates.sh` pass.
- A run log exists at `.agents/logs/runs/<task-id>.json`.
- A short change summary is written (what changed and why).

If any item is unmet, the task is not complete. Do not mark it done.

## Common Failure Modes

These are the ways teams (and agents) lie to themselves about quality. Reviewers should check for each one explicitly.

**"We have good prompts"**
Irrelevant. Prompts without enforcement are theater. The harness enforces; the prompt informs. If a rule isn't checked by a script or gate, it will be violated.

**"We trust this model"**
Wrong framing. Trust the harness, not the model. The model is capable and unpredictable. The harness is the invariant. Build checks that don't rely on the model's good judgment.

**"The agent fixed a few unrelated issues too"**
That is not a bonus. That is scope violation. Unasked-for changes are unreviewed changes. Flag them, revert them, tighten the spec.

**"The tests passed"**
Insufficient. Also check: Did typecheck pass? Did it touch forbidden files? Did it add mocking slop? Did it widen abstractions? Did it generate unsolicited docs? Passing tests prove almost nothing in isolation.

**"We just patch bad outputs manually"**
This trains your process to tolerate garbage. Manual cleanup hides harness failures. The next 20 runs rot the repo again. When output is bad: find the root cause (spec gap? policy gap? prompt gap?), fix the harness, rerun in a fresh worktree. Optimize for repeatable good output, not heroic one-off cleanup.

---

## Lifecycle

```
spec → worktree → implement → gate → PR
```

1. **Spec**: `.agents/specs/active/<task-slug>.md` must exist and be fully filled before any code is written.
2. **Worktree**: Run `scripts/create_agent_worktree.sh <task-slug>`. Branch name must be `agent/<task-slug>`.
3. **Implement**: Touch only `APPROVED_FILES`. Commit incrementally with descriptive messages (≥10 chars, non-generic).
4. **Gate**: `scripts/run_quality_gates.sh` must pass. Two consecutive failures = stop and report.
5. **PR**: Open against `main`. Do not merge. A reviewer agent or human merges per `reviewer-policy.md`.

## Escalation

Gate fails twice → write failure details to `.agents/logs/<task-slug>-failure.md` → surface to human. Do not attempt a third workaround.
