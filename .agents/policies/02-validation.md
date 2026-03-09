# Validation

## Completion

All gates must pass. Run log is emitted automatically by `run_quality_gates.sh` on success — do not emit it manually unless gates failed.

On failure, call `emit_run_log.sh` manually with `--status failed --summary "..."`.

## Escalation

Two consecutive gate failures trigger an automatic hard stop (enforced by `run_quality_gates.sh`). A failure report is written to `.agents/logs/<task-slug>-failure.md`. Surface it to the human.
