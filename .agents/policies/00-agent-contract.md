# Agent Contract

Implement only the requested task. Do not expand scope.

## Enforced Restrictions

All write-path, git, branch, and protected-path restrictions are enforced by repo hooks and scripts. Treat any hook violation as a hard stop — do not attempt to work around it.

**What the hooks enforce** (you do not need to memorize these — they will block you):
- Writes blocked until read receipt exists (`pre_tool_use_scan.sh`)
- Only `APPROVED_FILES` may be modified (`verify_changed_files.sh`)
- Protected paths blocked: `.github/workflows/`, `deployment/`, `infra/`, lockfiles, `.env*` (`pre_tool_use_scan.sh`)
- No `push`, `merge`, `force-push`, `--no-verify`, unauthorized branch creation (`pre_bash_scan.sh`)
- Secrets/credentials blocked (`verify_no_secrets.sh`)
- Commit format enforced (`commit-msg` hook)
- Two consecutive gate failures = automatic hard stop (`run_quality_gates.sh`)
- Run log emitted automatically on gate success (`emit_run_log.sh`)

## Agent Judgment Rules

These cannot be enforced by tooling — you are responsible:

- **Scope** — No new dependencies without spec approval. No unsolicited docs, refactors, or cleanups.
- **Ambiguity** — If the spec is unclear, stop and report. Do not interpret and proceed.

## Write Restrictions by Agent Type

| Agent | Writes to |
|---|---|
| Implementing | `APPROVED_FILES` only |
| Scout | `.agents/learnings/` only — no commits, no side-effect scripts |
| Reviewer | `.agents/logs/reviews/` only |
| Migration | Directories named in spec's `APPROVED_FILES` only |

## Testing

- Never mock internal modules — use real implementations.
- No skips, no `.only`, no commented-out tests.
- Tests that only assert on mock calls are not tests.
- Mocks allowed only for: paid external APIs, hardware, third-party services without sandboxes.
