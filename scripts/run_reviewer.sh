#!/usr/bin/env bash
# run_reviewer.sh <task-id>
#
# Runs mechanical review checks and writes a structured report to
# .agents/logs/reviews/<task-id>.md
#
# HARD CONSTRAINTS:
#   - Only writes to .agents/logs/reviews/. Any other write path causes immediate exit.
#   - No git push, git merge, or branch creation.
#   - Runs read-only git commands only (diff, log, show).
#
# Exit 0: all mechanical checks passed (judgment sections are informational).
# Exit 1: one or more mechanical checks failed.
# Exit 2: usage error.

set -euo pipefail

# ─── Safety: enforce write constraint ────────────────────────────────────────
# Trap any attempt to write outside the reviews directory.
ALLOWED_WRITE_DIR=".agents/logs/reviews"

# ─── Args ────────────────────────────────────────────────────────────────────
if [[ $# -lt 1 ]]; then
  echo "Usage: run_reviewer.sh <task-id>"
  exit 2
fi

TASK_ID="$1"
EXPECTED_BRANCH="agent/${TASK_ID}"

# ─── Locate spec ─────────────────────────────────────────────────────────────
SPEC_PATH=""
if [[ -f ".agents/specs/active/${TASK_ID}.md" ]]; then
  SPEC_PATH=".agents/specs/active/${TASK_ID}.md"
else
  # Look for date-prefixed spec (YYYY-MM-DD-<task-id>.md)
  FOUND=$(find .agents/specs/active -maxdepth 1 -name "*-${TASK_ID}.md" 2>/dev/null | head -1 || true)
  if [[ -n "$FOUND" ]]; then
    SPEC_PATH="$FOUND"
  fi
fi

# ─── Report setup ─────────────────────────────────────────────────────────────
mkdir -p "${ALLOWED_WRITE_DIR}"
REPORT="${ALLOWED_WRITE_DIR}/${TASK_ID}.md"

PASS_ICON="PASS"
FAIL_ICON="FAIL"
REVIEW_ICON="REVIEW REQUIRED"

mechanical_failures=0

# ─── Gate results (from run log) ──────────────────────────────────────────────
RUN_LOG=".agents/logs/runs/${TASK_ID}.json"

GATE_SECTION=""
if [[ -f "${RUN_LOG}" ]]; then
  set +e
  export RUN_LOG_PATH="${RUN_LOG}"
  GATE_SECTION=$(python3 - <<'PYEOF'
import json, sys, os

path = os.environ.get("RUN_LOG_PATH")
with open(path) as f:
    data = json.load(f)

status = data.get("status", "unknown")
checks = data.get("checks", {})
summary = data.get("final_summary", "")

icon = lambda v: "PASS" if v == "passed" else ("FAIL" if v == "failed" else v.upper())

lines = ["## Gate Results (from run log)", ""]
if status == "failed":
    lines.append("> **WARNING: Gates FAILED on last recorded run. Fix before opening a PR.**")
    lines.append("")
lines += [
    "| Gate       | Result |",
    "|------------|--------|",
    f"| lint       | {icon(checks.get('lint', 'unknown'))} |",
    f"| typecheck  | {icon(checks.get('typecheck', 'unknown'))} |",
    f"| tests      | {icon(checks.get('tests', 'unknown'))} |",
    f"| build      | {icon(checks.get('build', 'unknown'))} |",
    f"| overall    | {icon(status)} |",
    "",
]
if summary:
    lines += [f"Summary: {summary}", ""]
lines.append("---")
lines.append("")
print("\n".join(lines))
PYEOF
  )
  PY_EXIT=$?
  set -e
  if [[ $PY_EXIT -ne 0 ]]; then
    GATE_SECTION="## Gate Results

> Error reading run log at \`${RUN_LOG}\`.

---
"
  fi
else
  GATE_SECTION="## Gate Results

> No run log found. Run \`bash scripts/run_quality_gates.sh\` before opening a PR.

---
"
fi

# ─── Start report ─────────────────────────────────────────────────────────────
cat > "${REPORT}" <<EOF
# Review Report: ${TASK_ID}

Generated: $(date -u '+%Y-%m-%dT%H:%M:%SZ')

---

${GATE_SECTION}

## Mechanical Checks

EOF

# ─── Check 1: Spec exists and has no blank required fields ───────────────────
{
  echo "### 1. Spec Exists & No Blank Required Fields"
  echo ""
} >> "${REPORT}"

if [[ -z "$SPEC_PATH" ]]; then
  {
    echo "- **Result: [${FAIL_ICON}]**"
    echo "- Detail: No spec found for task '${TASK_ID}' in .agents/specs/active/"
    echo ""
  } >> "${REPORT}"
  mechanical_failures=$((mechanical_failures + 1))
else
  BLANK_FIELDS=()

  OBJ=$(awk '/^## Objective/{f=1; next} /^##/{f=0} f' "${SPEC_PATH}" | grep -v '^<!--' | grep -v '^$' | head -1 || true)
  [[ -z "$OBJ" ]] && BLANK_FIELDS+=("Objective")

  WHY=$(awk '/^## Why/{f=1; next} /^##/{f=0} f' "${SPEC_PATH}" | grep -v '^<!--' | grep -v '^$' | head -1 || true)
  [[ -z "$WHY" ]] && BLANK_FIELDS+=("Why")

  BRANCH_FIELD=$(grep -E '^agent/' "${SPEC_PATH}" | head -1 || true)
  [[ "$BRANCH_FIELD" == "agent/" ]] && BLANK_FIELDS+=("Branch")

  ALLOWED=$(awk '/^## Allowed files/{f=1; next} /^##/{f=0} f' "${SPEC_PATH}" | grep -E '^- .+' | grep -v '^- $' | head -1 || true)
  [[ -z "$ALLOWED" ]] && BLANK_FIELDS+=("Allowed files")

  AC=$(awk '/^## Acceptance Criteria/{f=1; next} /^##/{f=0} f' "${SPEC_PATH}" | grep -E '^- \[.\] .+' | head -1 || true)
  [[ -z "$AC" ]] && BLANK_FIELDS+=("Acceptance Criteria")

  if [[ ${#BLANK_FIELDS[@]} -gt 0 ]]; then
    {
      echo "- **Result: [${FAIL_ICON}]**"
      echo "- Detail: Blank required fields: ${BLANK_FIELDS[*]}"
      echo ""
    } >> "${REPORT}"
    mechanical_failures=$((mechanical_failures + 1))
  else
    {
      echo "- **Result: [${PASS_ICON}]**"
      echo "- Spec: \`${SPEC_PATH}\`"
      echo ""
    } >> "${REPORT}"
  fi
fi

# ─── Check 2: Branch name ─────────────────────────────────────────────────────
{
  echo "### 2. Branch Name"
  echo ""
} >> "${REPORT}"

ACTUAL_BRANCH=$(git symbolic-ref --short HEAD 2>/dev/null || echo "DETACHED")
if [[ "$ACTUAL_BRANCH" == "${EXPECTED_BRANCH}" ]]; then
  {
    echo "- **Result: [${PASS_ICON}]**"
    echo "- Branch: \`${ACTUAL_BRANCH}\`"
    echo ""
  } >> "${REPORT}"
else
  {
    echo "- **Result: [${FAIL_ICON}]**"
    echo "- Expected: \`${EXPECTED_BRANCH}\`"
    echo "- Actual: \`${ACTUAL_BRANCH}\`"
    echo ""
  } >> "${REPORT}"
  mechanical_failures=$((mechanical_failures + 1))
fi

# ─── Check 3: Scope ───────────────────────────────────────────────────────────
{
  echo "### 3. Scope (Changed Files vs Allowed Files)"
  echo ""
} >> "${REPORT}"

if [[ -z "$SPEC_PATH" ]]; then
  {
    echo "- **Result: [${FAIL_ICON}]**"
    echo "- Detail: Cannot check scope — spec not found"
    echo ""
  } >> "${REPORT}"
  mechanical_failures=$((mechanical_failures + 1))
else
  set +e
  SCOPE_OUTPUT=$(python3 scripts/changed_files_against_spec.py "${SPEC_PATH}" 2>&1)
  SCOPE_EXIT=$?
  set -e

  if [[ $SCOPE_EXIT -eq 0 ]]; then
    echo "- **Result: [${PASS_ICON}]**" >> "${REPORT}"
  else
    echo "- **Result: [${FAIL_ICON}]**" >> "${REPORT}"
    mechanical_failures=$((mechanical_failures + 1))
  fi
  {
    echo '```'
    echo "${SCOPE_OUTPUT}"
    echo '```'
    echo ""
  } >> "${REPORT}"
fi

# ─── Check 4: Secrets scan ────────────────────────────────────────────────────
{
  echo "### 4. Secrets Scan"
  echo ""
} >> "${REPORT}"

CHANGED_FILES=$(git diff --name-only origin/main...HEAD 2>/dev/null || true)
if [[ -z "$CHANGED_FILES" ]]; then
  {
    echo "- **Result: [${PASS_ICON}]**"
    echo "- Detail: No changed files detected"
    echo ""
  } >> "${REPORT}"
else
  set +e
  # shellcheck disable=SC2046
  SECRETS_OUTPUT=$(bash scripts/verify_no_secrets.sh --files $(echo "$CHANGED_FILES" | tr '\n' ' ') 2>&1)
  SECRETS_EXIT=$?
  set -e

  if [[ $SECRETS_EXIT -eq 0 ]]; then
    echo "- **Result: [${PASS_ICON}]**" >> "${REPORT}"
  else
    echo "- **Result: [${FAIL_ICON}]**" >> "${REPORT}"
    mechanical_failures=$((mechanical_failures + 1))
  fi
  {
    echo '```'
    echo "${SECRETS_OUTPUT}"
    echo '```'
    echo ""
  } >> "${REPORT}"
fi

# ─── Check 5: Commit messages ─────────────────────────────────────────────────
{
  echo "### 5. Commit Messages"
  echo ""
} >> "${REPORT}"

GENERIC_PATTERNS='^(fix|update|changes|wip|done|stuff|misc|test|temp|commit|save|asdf|todo)$'
COMMIT_FAIL=0
COMMIT_LINES=""

while IFS= read -r line; do
  [[ -z "$line" ]] && continue
  HASH=$(echo "$line" | cut -d' ' -f1)
  MSG=$(echo "$line" | cut -d' ' -f2-)
  MSG_LEN=${#MSG}

  if [[ $MSG_LEN -lt 10 ]]; then
    COMMIT_LINES+="  - \`${HASH}\`: TOO SHORT (${MSG_LEN} chars): ${MSG}"$'\n'
    COMMIT_FAIL=1
  elif echo "${MSG}" | grep -qiE "${GENERIC_PATTERNS}"; then
    COMMIT_LINES+="  - \`${HASH}\`: GENERIC: ${MSG}"$'\n'
    COMMIT_FAIL=1
  else
    COMMIT_LINES+="  - \`${HASH}\`: OK — ${MSG}"$'\n'
  fi
done < <(git log --oneline origin/main..HEAD 2>/dev/null || true)

if [[ $COMMIT_FAIL -eq 0 ]]; then
  echo "- **Result: [${PASS_ICON}]**" >> "${REPORT}"
else
  echo "- **Result: [${FAIL_ICON}]**" >> "${REPORT}"
  mechanical_failures=$((mechanical_failures + 1))
fi
{
  echo "${COMMIT_LINES}"
  echo ""
} >> "${REPORT}"

# ─── Check 6: Package boundary ────────────────────────────────────────────────
{
  echo "### 6. Package Boundary"
  echo ""
} >> "${REPORT}"

TOUCHES_FRONTEND=0
TOUCHES_BACKEND=0
while IFS= read -r f; do
  [[ -z "$f" ]] && continue
  [[ "$f" == packages/frontend/* ]] && TOUCHES_FRONTEND=1
  [[ "$f" == packages/backend/*  ]] && TOUCHES_BACKEND=1
done <<< "${CHANGED_FILES}"

if [[ $TOUCHES_FRONTEND -eq 1 && $TOUCHES_BACKEND -eq 1 ]]; then
  {
    echo "- **Result: [${REVIEW_ICON}]**"
    echo "- Both \`packages/frontend/\` and \`packages/backend/\` are touched."
    echo "- Confirm this cross-package change is intentional and spec-approved."
    echo ""
  } >> "${REPORT}"
else
  {
    echo "- **Result: [${PASS_ICON}]**"
    echo "- No simultaneous frontend+backend changes detected."
    echo ""
  } >> "${REPORT}"
fi

# ─── Judgment Sections ────────────────────────────────────────────────────────
DIFF=$(git diff origin/main...HEAD 2>/dev/null || true)

{
  echo "---"
  echo ""
  echo "## Judgment Sections"
  echo ""
  echo "> These sections require human review. They are informational and do not block pass/fail."
  echo ""
} >> "${REPORT}"

# J1: Abstractions justified?
{
  echo "### J1. New Abstractions — Are They Justified? [${REVIEW_ICON}]"
  echo ""
  echo "New functions/classes introduced:"
  echo '```'
  echo "$DIFF" \
    | grep '^+' | grep -v '^+++' \
    | grep -E '^[+](export )?(function |class |const [A-Za-z]+ = [(]|const [A-Za-z]+ = async)' \
    | sed 's/^+//' | head -30 \
    || echo "(none detected)"
  echo '```'
  echo ""
} >> "${REPORT}"

# J2: Dead code?
{
  echo "### J2. Dead Code [${REVIEW_ICON}]"
  echo ""
  echo "Removed import/call sites (lines removed containing calls or imports):"
  echo '```'
  echo "$DIFF" \
    | grep '^-' | grep -v '^---' \
    | grep -E '^-(import |.*[(].*[)]|.*require[(])' \
    | sed 's/^-//' | head -20 \
    || echo "(none detected)"
  echo '```'
  echo ""
} >> "${REPORT}"

# J3: Fake tests / mocks
{
  echo "### J3. Test Mocks & Stubs [${REVIEW_ICON}]"
  echo ""
  echo "vi.mock / jest.mock / stub usage in diff:"
  echo '```'
  echo "$DIFF" \
    | grep '^+' | grep -v '^+++' \
    | grep -iE '(vi[.]mock|jest[.]mock|[.]stub[(]|sinon[.]|createMock|mockReturnValue|mockResolvedValue|spyOn)' \
    | sed 's/^+//' | head -20 \
    || echo "(none detected)"
  echo '```'
  echo ""
} >> "${REPORT}"

# J4: Config drift
{
  echo "### J4. Config Drift [${REVIEW_ICON}]"
  echo ""
  echo "Config files changed:"
  echo '```'
  git diff --name-only origin/main...HEAD 2>/dev/null \
    | grep -E '\.(json|yaml|yml|toml|env|config\.[jt]s)$' \
    || echo "(none detected)"
  echo '```'
  echo ""
} >> "${REPORT}"

# J5: Widened blast radius
{
  echo "### J5. Blast Radius — New Exports & Dependencies [${REVIEW_ICON}]"
  echo ""
  echo "New exported symbols:"
  echo '```'
  echo "$DIFF" \
    | grep '^+' | grep -v '^+++' \
    | grep -E '^[+]export ' \
    | sed 's/^+//' | head -20 \
    || echo "(none detected)"
  echo '```'
  echo ""
  echo "New dependencies (package.json diff):"
  echo '```'
  echo "$DIFF" \
    | awk '/^diff.*package[.]json/{f=1} f && /^[+]/{print}' \
    | grep -v '^+++' | sed 's/^+//' | head -20 \
    || echo "(none detected)"
  echo '```'
  echo ""
} >> "${REPORT}"

# ─── Summary ──────────────────────────────────────────────────────────────────
{
  echo "---"
  echo ""
  echo "## Summary"
  echo ""
} >> "${REPORT}"

if [[ $mechanical_failures -eq 0 ]]; then
  echo "**[${PASS_ICON}] All ${mechanical_failures} mechanical checks passed. Judgment sections require human review.**" >> "${REPORT}"
  RESULT_MSG="[${PASS_ICON}] All mechanical checks passed."
else
  echo "**[${FAIL_ICON}] ${mechanical_failures} mechanical check(s) failed. See details above.**" >> "${REPORT}"
  RESULT_MSG="[${FAIL_ICON}] ${mechanical_failures} mechanical check(s) failed."
fi

echo "" >> "${REPORT}"
echo "Report: \`${REPORT}\`" >> "${REPORT}"

echo ""
echo "=== Reviewer done ==="
echo "${RESULT_MSG}"
echo "Report written to: ${REPORT}"
echo ""

if [[ $mechanical_failures -gt 0 ]]; then
  exit 1
fi
exit 0
