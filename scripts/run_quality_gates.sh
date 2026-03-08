#!/usr/bin/env bash
set -euo pipefail

echo "running quality gates..."

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
  exit 1
fi
SHELLCHECK_STATUS="passed"

echo "2/5 lint"
if bun run lint; then
  LINT_STATUS="passed"
else
  LINT_STATUS="failed"
  echo "lint: FAILED"
  exit 1
fi

echo "3/5 typecheck"
if bun run typecheck; then
  TYPECHECK_STATUS="passed"
else
  TYPECHECK_STATUS="failed"
  echo "typecheck: FAILED"
  exit 1
fi

echo "4/5 test"
if bun run test; then
  TESTS_STATUS="passed"
else
  TESTS_STATUS="failed"
  echo "tests: FAILED"
  exit 1
fi

echo "5/5 build"
if bun run build; then
  BUILD_STATUS="passed"
else
  BUILD_STATUS="failed"
  echo "build: FAILED"
  exit 1
fi

echo ""
echo "all quality gates passed"

# ─── Emit traceability log ────────────────────────────────────────────────────
BRANCH="$(git symbolic-ref --short HEAD 2>/dev/null || true)"
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
