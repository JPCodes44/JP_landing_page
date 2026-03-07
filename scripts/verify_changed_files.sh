#!/usr/bin/env bash
# verify_changed_files.sh
# On agent/* branches: resolves the spec and delegates to changed_files_against_spec.py.
# Usage: verify_changed_files.sh [--staged | --pr]
#   --staged  check git staged files (pre-commit)
#   --pr      check files changed vs main (CI)

set -euo pipefail

RED='\033[0;31m'
GREEN='\033[0;32m'
NC='\033[0m'

BRANCH=$(git rev-parse --abbrev-ref HEAD 2>/dev/null || echo "")
MODE="${1:---staged}"
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# Only enforce on agent/* branches
if [[ "$BRANCH" != agent/* ]]; then
  echo -e "${GREEN}[files] SKIP: Not an agent branch ($BRANCH). No file restrictions.${NC}"
  exit 0
fi

TASK_SLUG="${BRANCH#agent/}"
SPEC_FILE=$(ls ".agents/specs/active/"*"-${TASK_SLUG}.md" 2>/dev/null | head -1 || true)

if [[ -z "$SPEC_FILE" || ! -f "$SPEC_FILE" ]]; then
  echo -e "${RED}[files] FAIL: No spec found in .agents/specs/active/ for task '${TASK_SLUG}'.${NC}"
  exit 1
fi

# For --staged, check only the staged files directly (Python script checks full branch diff)
if [[ "$MODE" == "--staged" ]]; then
  STAGED=$(git diff --cached --name-only --diff-filter=ACM)
  if [[ -z "$STAGED" ]]; then
    echo -e "${GREEN}[files] PASS: No staged files to check.${NC}"
    exit 0
  fi

  ALLOWED=$(awk '/^## Allowed files/{found=1; next} found && /^## /{exit} found && /^- /{gsub(/^- /,""); print}' "$SPEC_FILE")

  if [[ -z "$ALLOWED" ]]; then
    echo -e "${RED}[files] FAIL: 'Allowed files' section is empty in $SPEC_FILE.${NC}"
    exit 1
  fi

  FAILURES=0
  while IFS= read -r changed_file; do
    APPROVED=0
    while IFS= read -r pattern; do
      [[ -z "$pattern" ]] && continue
      # shellcheck disable=SC2053
      if [[ "$changed_file" == $pattern ]]; then
        APPROVED=1
        break
      fi
    done <<< "$ALLOWED"

    if [[ $APPROVED -eq 0 ]]; then
      echo -e "${RED}[files] FAIL: $changed_file is not in Allowed files.${NC}"
      FAILURES=$((FAILURES + 1))
    fi
  done <<< "$STAGED"

  if [[ $FAILURES -gt 0 ]]; then
    echo -e "${RED}[files] FAIL: $FAILURES out-of-scope file(s). Update 'Allowed files' in $SPEC_FILE or remove the changes.${NC}"
    exit 1
  fi
  echo -e "${GREEN}[files] PASS: All staged files are within spec scope.${NC}"
  exit 0
fi

# For --pr, delegate to the Python script (full branch diff vs origin/main)
if [[ "$MODE" == "--pr" ]]; then
  python3 "${SCRIPT_DIR}/changed_files_against_spec.py" "$SPEC_FILE"
  exit $?
fi

echo -e "${RED}[files] Unknown mode: $MODE. Use --staged or --pr.${NC}"
exit 1
