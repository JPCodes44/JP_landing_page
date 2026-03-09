#!/usr/bin/env bash
set -euo pipefail

echo "running quality gates..."

# ─── Consecutive failure tracking ────────────────────────────────────────────
BRANCH="$(git symbolic-ref --short HEAD 2>/dev/null || true)"
FAIL_COUNTER=""
if [[ "$BRANCH" == agent/* ]]; then
  TASK_ID="${BRANCH#agent/}"
  REPO_ROOT="$(git rev-parse --show-toplevel)"
  FAIL_COUNTER="${REPO_ROOT}/.agents/logs/runs/${TASK_ID}.failures"
  mkdir -p "$(dirname "$FAIL_COUNTER")"

  if [[ -f "$FAIL_COUNTER" ]]; then
    PREV_FAILURES=$(cat "$FAIL_COUNTER")
    if [[ "$PREV_FAILURES" -ge 1 ]]; then
      echo ""
      echo "[CONSECUTIVE FAILURE LIMIT] This is attempt $((PREV_FAILURES + 1))."
      echo "  Two consecutive gate failures = hard stop."
      echo "  Writing failure report to .agents/logs/${TASK_ID}-failure.md"
      echo "  Surface this to the human and stop."
      echo ""
      echo "## Gate Failure Report" > "${REPO_ROOT}/.agents/logs/${TASK_ID}-failure.md"
      echo "" >> "${REPO_ROOT}/.agents/logs/${TASK_ID}-failure.md"
      echo "Task: ${TASK_ID}" >> "${REPO_ROOT}/.agents/logs/${TASK_ID}-failure.md"
      echo "Branch: ${BRANCH}" >> "${REPO_ROOT}/.agents/logs/${TASK_ID}-failure.md"
      echo "Consecutive failures: $((PREV_FAILURES + 1))" >> "${REPO_ROOT}/.agents/logs/${TASK_ID}-failure.md"
      echo "Timestamp: $(date -u '+%Y-%m-%dT%H:%M:%SZ')" >> "${REPO_ROOT}/.agents/logs/${TASK_ID}-failure.md"
      echo "" >> "${REPO_ROOT}/.agents/logs/${TASK_ID}-failure.md"
      echo "Agent hit the consecutive failure limit and must stop." >> "${REPO_ROOT}/.agents/logs/${TASK_ID}-failure.md"
      rm -f "$FAIL_COUNTER"
      exit 1
    fi
  fi
fi

gate_failed() {
  # Increment failure counter on agent branches
  if [[ -n "$FAIL_COUNTER" ]]; then
    PREV=$(cat "$FAIL_COUNTER" 2>/dev/null || echo "0")
    echo $((PREV + 1)) > "$FAIL_COUNTER"
  fi
}

SHELLCHECK_STATUS="skipped"
LINT_STATUS="skipped"
TYPECHECK_STATUS="skipped"
TESTS_STATUS="skipped"
BUILD_STATUS="skipped"
echo "1/5 shellcheck"
if ! command -v shellcheck &>/dev/null; then
  echo "shellcheck: NOT INSTALLED — run: sudo pacman -S shellcheck"
  exit 1
fi
SHELL_FILES=()
while IFS= read -r -d '' f; do
  SHELL_FILES+=("$f")
done < <(find scripts .githooks -maxdepth 1 -type f -name "*.sh" -print0 2>/dev/null; \
         find .githooks -maxdepth 1 -type f ! -name "*.*" -print0 2>/dev/null)
if ! shellcheck --external-sources --severity=warning "${SHELL_FILES[@]}"; then
  SHELLCHECK_STATUS="failed"
  echo "shellcheck: FAILED"
  gate_failed
  exit 1
fi
SHELLCHECK_STATUS="passed"

echo "2/5 lint"
if bun run lint; then
  LINT_STATUS="passed"
else
  LINT_STATUS="failed"
  echo "lint: FAILED"
  gate_failed
  exit 1
fi

echo "3/5 typecheck"
if bun run typecheck; then
  TYPECHECK_STATUS="passed"
else
  TYPECHECK_STATUS="failed"
  echo "typecheck: FAILED"
  gate_failed
  exit 1
fi

echo "4/5 test"
if bun run test; then
  TESTS_STATUS="passed"
else
  TESTS_STATUS="failed"
  echo "tests: FAILED"
  gate_failed
  exit 1
fi

echo "5/5 build"
if bun run build; then
  BUILD_STATUS="passed"
else
  BUILD_STATUS="failed"
  echo "build: FAILED"
  gate_failed
  exit 1
fi

echo ""
echo "all quality gates passed"

# ─── Clear failure counter on success ────────────────────────────────────────
if [[ -n "${FAIL_COUNTER:-}" && -f "${FAIL_COUNTER:-}" ]]; then
  rm -f "$FAIL_COUNTER"
fi

# ─── Emit traceability log ────────────────────────────────────────────────────
if [[ "$BRANCH" == agent/* ]]; then
  TASK_ID="${BRANCH#agent/}"
  echo ""
  bash scripts/emit_run_log.sh "${TASK_ID}" \
    --shellcheck "${SHELLCHECK_STATUS}" \
    --lint       "${LINT_STATUS}" \
    --typecheck  "${TYPECHECK_STATUS}" \
    --tests      "${TESTS_STATUS}" \
    --build      "${BUILD_STATUS}" \
    --status     "passed" \
    --summary    "Quality gates passed on ${BRANCH}"

  echo ""
  echo "next: open your PR"
  echo "  bash scripts/open_agent_pr.sh \"short summary\""
  echo "  PR title will be: [agent][${TASK_ID}] short summary"
fi
