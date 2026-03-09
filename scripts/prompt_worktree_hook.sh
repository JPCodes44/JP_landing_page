#!/usr/bin/env bash
# prompt_worktree_hook.sh
#
# Claude Code UserPromptSubmit hook.
# Detects /task-<slug> in the user prompt and auto-creates a git worktree.
#
# Pattern: /task-<slug>  where slug is lowercase alphanumeric + hyphens
# Example: /task-add-hero-section

set -uo pipefail

# Read prompt JSON from stdin
INPUT=$(cat)
PROMPT=$(printf '%s' "$INPUT" | jq -r '.prompt // empty' 2>/dev/null || echo "")

# Look for /task-<slug> pattern
SLUG=$(printf '%s' "$PROMPT" | grep -oP '(?<=/task-)[a-z0-9][a-z0-9-]*' | head -1 || true)

if [[ -z "$SLUG" ]]; then
  exit 0
fi

# Find repo root
REPO_ROOT=$(git rev-parse --show-toplevel 2>/dev/null || echo "")
if [[ -z "$REPO_ROOT" ]]; then
  echo "[worktree-hook] Could not determine repo root. Skipping worktree creation."
  exit 0
fi

echo "[worktree-hook] Detected /task-${SLUG} — creating worktree..."
echo ""

bash "${REPO_ROOT}/scripts/create_agent_worktree.sh" "$SLUG"
EXIT_CODE=$?

if [[ $EXIT_CODE -ne 0 ]]; then
  echo ""
  echo "[worktree-hook] Worktree creation failed (exit $EXIT_CODE). Fix errors above before proceeding."
fi

exit 0
