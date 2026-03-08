#!/usr/bin/env bash
# open_agent_pr.sh
# Opens a PR for the current agent branch with the correct title and body.
# Usage: ./scripts/open_agent_pr.sh "short summary of what was done"

set -euo pipefail

RED='\033[0;31m'
GREEN='\033[0;32m'
BOLD='\033[1m'
NC='\033[0m'

BRANCH="$(git symbolic-ref --short HEAD)"

if [[ ! "$BRANCH" == agent/* ]]; then
  echo -e "${RED}Error: must be on an agent/* branch (currently on: $BRANCH)${NC}"
  exit 1
fi

if [[ $# -lt 1 ]]; then
  echo -e "${RED}Usage: $0 \"short summary\"${NC}"
  echo "  Example: $0 \"add contact form validation\""
  exit 1
fi

TASK_ID="${BRANCH#agent/}"
SUMMARY="$1"
PR_TITLE="[agent][${TASK_ID}] ${SUMMARY}"

REPO_ROOT="$(git rev-parse --show-toplevel)"
SPEC_PATH=$(find "${REPO_ROOT}/.agents/specs/active" -maxdepth 1 -name "*-${TASK_ID}.md" 2>/dev/null | head -1 || true)

if [[ -z "$SPEC_PATH" ]]; then
  echo -e "${RED}Error: no spec found for task '${TASK_ID}' in .agents/specs/active/${NC}"
  exit 1
fi

OBJECTIVE=$(awk '/^## Objective/{found=1; next} found && /^##/{exit} found && NF{print; exit}' "$SPEC_PATH")

PR_BODY="## What
${OBJECTIVE}

## Spec
\`${SPEC_PATH#"$REPO_ROOT/"}\`

## Checklist
- [ ] All acceptance criteria met
- [ ] Quality gates pass in CI
- [ ] No files outside Allowed Files were touched"

echo -e "${BOLD}Opening PR:${NC} $PR_TITLE"
echo ""

gh pr create \
  --base main \
  --head "$BRANCH" \
  --title "$PR_TITLE" \
  --body "$PR_BODY"

echo ""
echo -e "${GREEN}${BOLD}PR opened.${NC}"
