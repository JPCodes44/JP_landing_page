# AI Contribution Policy

## Why This Exists

Every agent that touches this codebase must be auditable. We need to know:

- What task it was given
- What files it was allowed to touch
- Whether it introduced secrets or scope creep
- That a human approved the result before merge

This policy defines the system that enforces those guarantees.

---

## Agent Lifecycle

```
1. Spec       →  Write .agents/specs/active/<task-slug>.md
2. Worktree   →  Run scripts/create_agent_worktree.sh <task-slug>
3. Implement  →  Work only on files in APPROVED_FILES
4. Gate       →  Run scripts/run_quality_gates.sh and fix any failures
5. PR         →  Open a pull request from agent/<task-slug> to main
6. Review     →  Human or reviewer agent approves per 03-reviewer-policy.md
7. Merge      →  Squash merge only, referencing the spec task name
```

---

## Creating a Task

```bash
# From the repo root
./scripts/create_agent_worktree.sh <task-slug>
```

This will:

1. Copy `.agents/specs/TEMPLATE.md` to `.agents/specs/active/<task-slug>.md`
2. Create a new git worktree at `../<repo>-<task-slug>` on branch `agent/<task-slug>`
3. Configure the worktree to use `.githooks/` for local enforcement

After running the script:

- Open the spec and fill in `TASK`, `APPROVED_FILES`, and `ACCEPTANCE_CRITERIA`
- Change into the worktree directory
- Begin implementation

---

## Gates

All gates live in `scripts/run_quality_gates.sh`. They run automatically via git hooks and CI.

| Gate                   | When              | What it checks                                     |
| ---------------------- | ----------------- | -------------------------------------------------- |
| `verify_no_secrets`    | Always            | Staged/changed files for credentials, keys, tokens |
| `verify_spec_header`   | agent/\* branches | Spec exists with all required fields populated     |
| `verify_changed_files` | agent/\* branches | All changed files are listed in `APPROVED_FILES`   |

### Pre-commit hook

Runs `--staged` gates. Blocks commit if any gate fails.

### Commit-msg hook

Validates message is ≥10 chars and not a generic word like "fix" or "wip".

### Pre-push hook

Blocks direct push to `main` from agent branches. Runs `--pr` gates.

### CI (GitHub Actions)

- `ci.yml`: runs gates on every push and PR to main
- `pr-agent-audit.yml`: runs detailed audit on `agent/*` PRs and posts a summary comment

---

## When Gates Fail

1. Read the gate output carefully — it names the specific file or field that failed
2. Fix the underlying issue (don't bypass hooks with `--no-verify`)
3. Re-stage and attempt the commit again
4. If you cannot resolve it: log the failure in `.agents/logs/`, surface it to a human

Never use `--no-verify` or `--skip`. If a gate is wrong, fix the gate — open a PR to update the scripts.

---

## Spec Fields

| Field                 | Required | Description                                                  |
| --------------------- | -------- | ------------------------------------------------------------ |
| `TASK`                | Yes      | One-line description of what the agent will do               |
| `BRANCH`              | Yes      | Must be `agent/<task-slug>`                                  |
| `WORKTREE`            | Yes      | Path to the worktree                                         |
| `APPROVED_FILES`      | Yes      | Exhaustive list of files the agent may touch (globs allowed) |
| `ACCEPTANCE_CRITERIA` | Yes      | Checklist items the reviewer will verify                     |
| `NOTES`               | No       | Caveats, dependencies, research references                   |

---

## Roles

- **Scout agent**: Read-only research. Outputs findings to `.agents/learnings/` and a spec draft. See scout rules in `00-agent-contract.md`.
- **Implementing agent**: Follows the spec, touches only approved files, opens the PR.
- **Reviewer agent/human**: Verifies gates passed, spec matches diff, criteria are met. See `03-reviewer-policy.md`.

---

## File Locations

```
.agents/
  policies/         # global, reviewer, and scout policies
  specs/
    TEMPLATE.md     # copy this for new tasks
    active/         # live specs (one per open agent task)
  logs/             # agent run logs
  learnings/        # scout findings and spec drafts
scripts/
  create_agent_worktree.sh   # task scaffolding
  run_quality_gates.sh       # master gate runner
  verify_no_secrets.sh       # secret scanner
  verify_changed_files.sh    # file scope checker
  verify_spec_header.py      # spec validator
  changed_files_against_spec.py  # CI scope checker
.githooks/
  pre-commit        # runs gates on staged files
  commit-msg        # validates commit message
  pre-push          # blocks direct-to-main, runs full gates
.github/workflows/
  ci.yml            # CI gate runner
  pr-agent-audit.yml  # PR audit with PR comment
```
