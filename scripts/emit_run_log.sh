#!/usr/bin/env bash
# emit_run_log.sh <task-id> [options]
#
# Emits a traceability log to .agents/logs/runs/<task-id>.json
# Called by run_quality_gates.sh and by agents directly on exit.
#
# Options:
#   --shellcheck passed|failed|skipped
#   --lint       passed|failed|skipped
#   --typecheck  passed|failed|skipped
#   --tests      passed|failed|skipped
#   --build      passed|failed|skipped
#   --summary    "what happened"
#   --status     passed|failed
#
# Write constraint: only writes to .agents/logs/runs/. Hard stop otherwise.

set -euo pipefail

RUNS_DIR=".agents/logs/runs"

if [[ $# -lt 1 ]]; then
  echo "Usage: emit_run_log.sh <task-id> [--shellcheck passed] [--lint passed] [--typecheck passed] [--tests passed] [--build passed] [--summary '...'] [--status passed|failed]"
  exit 2
fi

TASK_ID="$1"
shift

# ─── Parse flags ──────────────────────────────────────────────────────────────
SHELLCHECK="skipped"
LINT="skipped"
TYPECHECK="skipped"
TESTS="skipped"
BUILD="skipped"
SUMMARY=""
STATUS="unknown"

while [[ $# -gt 0 ]]; do
  case "$1" in
    --shellcheck) SHELLCHECK="$2"; shift 2 ;;
    --lint)       LINT="$2";       shift 2 ;;
    --typecheck)  TYPECHECK="$2";  shift 2 ;;
    --tests)      TESTS="$2";      shift 2 ;;
    --build)      BUILD="$2";      shift 2 ;;
    --summary)   SUMMARY="$2";   shift 2 ;;
    --status)    STATUS="$2";    shift 2 ;;
    *) echo "Unknown flag: $1"; exit 2 ;;
  esac
done

# ─── Collect context ──────────────────────────────────────────────────────────
BRANCH=$(git symbolic-ref --short HEAD 2>/dev/null || echo "DETACHED")

# Worktree path for this branch
WORKTREE=$(git worktree list --porcelain \
  | awk -v b="refs/heads/${BRANCH}" '/^worktree /{wt=$2} $0=="branch " b{print wt}' \
  | head -1 || true)
[[ -z "$WORKTREE" ]] && WORKTREE="unknown"

# Spec — prefer date-prefixed
SPEC=$(find ".agents/specs/active" -maxdepth 1 -name "*-${TASK_ID}.md" 2>/dev/null | head -1 || true)
[[ -z "$SPEC" && -f ".agents/specs/active/${TASK_ID}.md" ]] && SPEC=".agents/specs/active/${TASK_ID}.md"
[[ -z "$SPEC" ]] && SPEC="not found"

# Start time — from marker written by create_agent_worktree.sh
START_MARKER="${RUNS_DIR}/${TASK_ID}.start"
if [[ -f "$START_MARKER" ]]; then
  START_TIME=$(cat "$START_MARKER")
else
  # Fall back to timestamp of first branch commit
  FIRST_HASH=$(git log --oneline origin/main..HEAD 2>/dev/null | tail -1 | cut -d' ' -f1 || true)
  if [[ -n "$FIRST_HASH" ]]; then
    START_TIME=$(git show -s --format='%cI' "$FIRST_HASH" 2>/dev/null || echo "unknown")
  else
    START_TIME="unknown"
  fi
fi

END_TIME=$(date -u '+%Y-%m-%dT%H:%M:%SZ')

mkdir -p "${RUNS_DIR}"
OUTPUT="${RUNS_DIR}/${TASK_ID}.json"

# ─── Write JSON via Python ────────────────────────────────────────────────────
# All dynamic values passed as env vars; Python handles quoting/escaping safely.
RUN_LOG_TASK_ID="$TASK_ID" \
RUN_LOG_BRANCH="$BRANCH" \
RUN_LOG_WORKTREE="$WORKTREE" \
RUN_LOG_SPEC="$SPEC" \
RUN_LOG_START="$START_TIME" \
RUN_LOG_END="$END_TIME" \
RUN_LOG_STATUS="$STATUS" \
RUN_LOG_SHELLCHECK="$SHELLCHECK" \
RUN_LOG_LINT="$LINT" \
RUN_LOG_TYPECHECK="$TYPECHECK" \
RUN_LOG_TESTS="$TESTS" \
RUN_LOG_BUILD="$BUILD" \
RUN_LOG_SUMMARY="$SUMMARY" \
RUN_LOG_OUTPUT="$OUTPUT" \
python3 - <<'PYEOF'
import json, os, subprocess

def env(k): return os.environ[k]

# Changed files from git
try:
    result = subprocess.run(
        ["git", "diff", "--name-only", "origin/main..HEAD"],
        capture_output=True, text=True, check=True
    )
    changed_files = [f for f in result.stdout.splitlines() if f]
except Exception:
    changed_files = []

record = {
    "task_id":      env("RUN_LOG_TASK_ID"),
    "branch":       env("RUN_LOG_BRANCH"),
    "worktree":     env("RUN_LOG_WORKTREE"),
    "spec":         env("RUN_LOG_SPEC"),
    "start_time":   env("RUN_LOG_START"),
    "end_time":     env("RUN_LOG_END"),
    "status":       env("RUN_LOG_STATUS"),
    "changed_files": changed_files,
    "commands_run": [
        "shellcheck scripts/*.sh .githooks/*",
        "bun run lint",
        "bun run typecheck",
        "bun run test",
        "bun run build",
    ],
    "checks": {
        "shellcheck": env("RUN_LOG_SHELLCHECK"),
        "lint":       env("RUN_LOG_LINT"),
        "typecheck":  env("RUN_LOG_TYPECHECK"),
        "tests":      env("RUN_LOG_TESTS"),
        "build":      env("RUN_LOG_BUILD"),
    },
    "final_summary": env("RUN_LOG_SUMMARY"),
}

out_path = env("RUN_LOG_OUTPUT")
with open(out_path, "w") as f:
    json.dump(record, f, indent=2)

print(f"Run log written: {out_path}")
PYEOF

# Clean up start marker after successful emit
if [[ -f "$START_MARKER" ]]; then rm -f "$START_MARKER"; fi
