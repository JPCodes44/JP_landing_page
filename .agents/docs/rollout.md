# Agent Rollout Order

Do not try to build the perfect swarm on day one. Prove single-agent correctness first.
Jumping to swarms without that foundation builds a failure amplifier, not a force multiplier.

---

## Phase 1 — Minimum Viable Anti-Slop

Do this first. This alone gets most of the value.

- [x] `.agents/specs/` directory and spec template
- [x] Worktree script (`scripts/create_agent_worktree.sh`)
- [x] Local pre-commit hook (scope, secrets, commit message)
- [x] CI lint / typecheck / test workflow
- [x] Block `git push` on `agent/*` branches

## Phase 2 — Stronger Enforcement

Add after Phase 1 is stable.

- [x] Changed-files-vs-spec validator (`scripts/changed_files_against_spec.py`)
- [x] PR audit workflow (`.github/workflows/pr-agent-audit.yml`)
- [x] Commit message traceability (`scripts/emit_run_log.sh`)
- [x] Reviewer agent with read-only scope (`scripts/run_reviewer.sh`)

## Phase 3 — Multi-Agent Orchestration

Only after Phase 1 and 2 are stable and producing clean runs.

- [x] Per-agent policies (global, scout, reviewer)
- [x] Structured logs (`.agents/logs/runs/`, `.agents/logs/reviews/`)
- [ ] Scout agent (policy exists; needs proven harness runs)
- [ ] Builder agent
- [ ] Coordinator agent

---

## Rule

If Phase N is producing bad output, fix Phase N before adding Phase N+1.
More agents running a broken harness = faster rot, not faster delivery.
