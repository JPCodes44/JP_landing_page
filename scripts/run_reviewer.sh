#!/usr/bin/env bash
# run_reviewer.sh <task-id>
#
# Runs mechanical review checks and prints results to stdout.
#
# Exit 0: all mechanical checks passed.
# Exit 1: one or more mechanical checks failed.
# Exit 2: usage error.

set -euo pipefail

if [[ $# -lt 1 ]]; then
  echo "Usage: run_reviewer.sh <task-id>"
  exit 2
fi

TASK_ID="$1"
EXPECTED_BRANCH="agent/${TASK_ID}"

PASS_ICON="PASS"
FAIL_ICON="FAIL"
REVIEW_ICON="REVIEW REQUIRED"

mechanical_failures=0

# ─── Locate spec ─────────────────────────────────────────────────────────────
SPEC_PATH=""
if [[ -f ".agents/specs/active/${TASK_ID}.md" ]]; then
  SPEC_PATH=".agents/specs/active/${TASK_ID}.md"
else
  FOUND=$(find .agents/specs/active -maxdepth 1 -name "*-${TASK_ID}.md" 2>/dev/null | head -1 || true)
  [[ -n "$FOUND" ]] && SPEC_PATH="$FOUND"
fi

echo ""
echo "=== Reviewer: ${TASK_ID} ==="
echo ""

# ─── Gate results (from run log) ─────────────────────────────────────────────
RUN_LOG=".agents/logs/runs/${TASK_ID}.json"
if [[ -f "${RUN_LOG}" ]]; then
  set +e
  export RUN_LOG_PATH="${RUN_LOG}"
  python3 - <<'PYEOF'
import json, os
path = os.environ["RUN_LOG_PATH"]
with open(path) as f:
    data = json.load(f)
status = data.get("status", "unknown")
checks = data.get("checks", {})
summary = data.get("final_summary", "")
icon = lambda v: "PASS" if v == "passed" else ("FAIL" if v == "failed" else v.upper())
if status == "failed":
    print("WARNING: Gates FAILED on last recorded run.")
print(f"  shellcheck: {icon(checks.get('shellcheck','unknown'))}  lint: {icon(checks.get('lint','unknown'))}  typecheck: {icon(checks.get('typecheck','unknown'))}  tests: {icon(checks.get('tests','unknown'))}  build: {icon(checks.get('build','unknown'))}  overall: {icon(status)}")
if summary:
    print(f"  {summary}")
PYEOF
  set -e
else
  echo "  [no run log — run bash scripts/run_quality_gates.sh first]"
fi

echo ""
echo "--- Mechanical Checks ---"
echo ""

# ─── Check 1: Spec exists ────────────────────────────────────────────────────
if [[ -z "$SPEC_PATH" ]]; then
  echo "[${FAIL_ICON}] 1. Spec: not found for '${TASK_ID}'"
  mechanical_failures=$((mechanical_failures + 1))
else
  BLANK_FIELDS=()
  OBJ=$(awk '/^## Objective/{f=1; next} /^##/{f=0} f' "${SPEC_PATH}" | grep -v '^$' | head -1 || true)
  [[ -z "$OBJ" ]] && BLANK_FIELDS+=("Objective")
  WHY=$(awk '/^## Why/{f=1; next} /^##/{f=0} f' "${SPEC_PATH}" | grep -v '^$' | head -1 || true)
  [[ -z "$WHY" ]] && BLANK_FIELDS+=("Why")
  ALLOWED=$(awk '/^## Allowed files/{f=1; next} /^##/{f=0} f' "${SPEC_PATH}" | grep -E '^- .+' | head -1 || true)
  [[ -z "$ALLOWED" ]] && BLANK_FIELDS+=("Allowed files")
  AC=$(awk '/^## Acceptance Criteria/{f=1; next} /^##/{f=0} f' "${SPEC_PATH}" | grep -E '^- \[.\] .+' | head -1 || true)
  [[ -z "$AC" ]] && BLANK_FIELDS+=("Acceptance Criteria")
  if [[ ${#BLANK_FIELDS[@]} -gt 0 ]]; then
    echo "[${FAIL_ICON}] 1. Spec: blank required fields: ${BLANK_FIELDS[*]}"
    mechanical_failures=$((mechanical_failures + 1))
  else
    echo "[${PASS_ICON}] 1. Spec: ${SPEC_PATH}"
  fi
fi

# ─── Check 2: Branch name ────────────────────────────────────────────────────
ACTUAL_BRANCH=$(git symbolic-ref --short HEAD 2>/dev/null || echo "DETACHED")
if [[ "$ACTUAL_BRANCH" == "${EXPECTED_BRANCH}" ]]; then
  echo "[${PASS_ICON}] 2. Branch: ${ACTUAL_BRANCH}"
else
  echo "[${FAIL_ICON}] 2. Branch: expected '${EXPECTED_BRANCH}', got '${ACTUAL_BRANCH}'"
  mechanical_failures=$((mechanical_failures + 1))
fi

# ─── Check 3: Scope ──────────────────────────────────────────────────────────
if [[ -z "$SPEC_PATH" ]]; then
  echo "[${FAIL_ICON}] 3. Scope: cannot check — spec not found"
  mechanical_failures=$((mechanical_failures + 1))
else
  set +e
  SCOPE_OUTPUT=$(python3 scripts/changed_files_against_spec.py "${SPEC_PATH}" 2>&1)
  SCOPE_EXIT=$?
  set -e
  if [[ $SCOPE_EXIT -eq 0 ]]; then
    echo "[${PASS_ICON}] 3. Scope: ${SCOPE_OUTPUT}"
  else
    echo "[${FAIL_ICON}] 3. Scope:"
    echo "${SCOPE_OUTPUT}" | sed 's/^/    /'
    mechanical_failures=$((mechanical_failures + 1))
  fi
fi

# ─── Check 4: Secrets ────────────────────────────────────────────────────────
CHANGED_FILES=$(git diff --name-only origin/main...HEAD 2>/dev/null || true)
if [[ -z "$CHANGED_FILES" ]]; then
  echo "[${PASS_ICON}] 4. Secrets: no changed files"
else
  set +e
  # shellcheck disable=SC2046
  SECRETS_OUTPUT=$(bash scripts/verify_no_secrets.sh --files $(echo "$CHANGED_FILES" | tr '\n' ' ') 2>&1)
  SECRETS_EXIT=$?
  set -e
  if [[ $SECRETS_EXIT -eq 0 ]]; then
    echo "[${PASS_ICON}] 4. Secrets: clean"
  else
    echo "[${FAIL_ICON}] 4. Secrets:"
    echo "${SECRETS_OUTPUT}" | sed 's/^/    /'
    mechanical_failures=$((mechanical_failures + 1))
  fi
fi

# ─── Check 5: Commit messages ────────────────────────────────────────────────
GENERIC_PATTERNS='^(fix|update|changes|wip|done|stuff|misc|test|temp|commit|save|asdf|todo)$'
COMMIT_FAIL=0
while IFS= read -r line; do
  [[ -z "$line" ]] && continue
  HASH=$(echo "$line" | cut -d' ' -f1)
  MSG=$(echo "$line" | cut -d' ' -f2-)
  MSG_LEN=${#MSG}
  if [[ $MSG_LEN -lt 10 ]]; then
    echo "[${FAIL_ICON}] 5. Commit ${HASH}: too short (${MSG_LEN} chars): ${MSG}"
    COMMIT_FAIL=1
  elif echo "${MSG}" | grep -qiE "${GENERIC_PATTERNS}"; then
    echo "[${FAIL_ICON}] 5. Commit ${HASH}: generic message: ${MSG}"
    COMMIT_FAIL=1
  fi
done < <(git log --oneline origin/main..HEAD 2>/dev/null || true)
if [[ $COMMIT_FAIL -eq 0 ]]; then
  echo "[${PASS_ICON}] 5. Commit messages: OK"
else
  mechanical_failures=$((mechanical_failures + 1))
fi

# ─── Check 6: Package boundary ───────────────────────────────────────────────
TOUCHES_FRONTEND=0
TOUCHES_BACKEND=0
while IFS= read -r f; do
  [[ -z "$f" ]] && continue
  [[ "$f" == packages/frontend/* ]] && TOUCHES_FRONTEND=1
  [[ "$f" == packages/backend/*  ]] && TOUCHES_BACKEND=1
done <<< "${CHANGED_FILES}"
if [[ $TOUCHES_FRONTEND -eq 1 && $TOUCHES_BACKEND -eq 1 ]]; then
  echo "[${REVIEW_ICON}] 6. Package boundary: both frontend+backend touched — confirm this is intentional"
else
  echo "[${PASS_ICON}] 6. Package boundary: OK"
fi

# ─── Judgment hints ──────────────────────────────────────────────────────────
DIFF=$(git diff origin/main...HEAD 2>/dev/null || true)

NEW_EXPORTS=$(echo "$DIFF" | grep '^+' | grep -v '^+++' | grep -E '^[+]export ' | sed 's/^+//' | head -5 || true)
NEW_MOCKS=$(echo "$DIFF" | grep '^+' | grep -v '^+++' | grep -iE '(vi[.]mock|jest[.]mock|[.]stub[(]|spyOn)' | sed 's/^+//' | head -5 || true)

if [[ -n "$NEW_EXPORTS" || -n "$NEW_MOCKS" ]]; then
  echo ""
  echo "--- Judgment hints (informational) ---"
  [[ -n "$NEW_EXPORTS" ]] && echo "  new exports: $(echo "$NEW_EXPORTS" | tr '\n' ' ')"
  [[ -n "$NEW_MOCKS"   ]] && echo "  mocks/stubs: $(echo "$NEW_MOCKS"   | tr '\n' ' ')"
fi

# ─── Summary ─────────────────────────────────────────────────────────────────
echo ""
if [[ $mechanical_failures -eq 0 ]]; then
  echo "=== Reviewer: [PASS] All mechanical checks passed ==="
  exit 0
else
  echo "=== Reviewer: [FAIL] ${mechanical_failures} check(s) failed ==="
  exit 1
fi
