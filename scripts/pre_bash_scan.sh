#!/usr/bin/env bash
# scripts/pre_bash_scan.sh
#
# Claude Code PreToolUse hook — fires before Bash tool calls.
# On agent/* branches: blocks dangerous git commands.

set -euo pipefail

# ─── Branch guard ─────────────────────────────────────────────────────────────
BRANCH=$(git symbolic-ref --short HEAD 2>/dev/null || echo "")
if [[ "$BRANCH" != agent/* ]]; then
  exit 0
fi

# ─── Parse command from stdin ────────────────────────────────────────────────
INPUT=$(cat)
COMMAND=$(printf '%s' "$INPUT" | jq -r '.command // empty' 2>/dev/null || true)
if [[ -z "$COMMAND" ]]; then
  exit 0
fi

# ─── Dangerous git command patterns ─────────────────────────────────────────
# Block: push, merge, force-push, --no-verify, branch creation
BLOCKED=false
REASON=""

if printf '%s' "$COMMAND" | grep -qE '\bgit\s+push\b'; then
  BLOCKED=true
  REASON="git push is blocked on agent branches — use PR workflow"
fi

if printf '%s' "$COMMAND" | grep -qE '\bgit\s+merge\b'; then
  BLOCKED=true
  REASON="git merge is blocked on agent branches"
fi

if printf '%s' "$COMMAND" | grep -qE '--force-push|--force\b|-f\b' | head -1 && \
   printf '%s' "$COMMAND" | grep -qE '\bgit\s+push\b'; then
  BLOCKED=true
  REASON="force-push is blocked on agent branches"
fi

if printf '%s' "$COMMAND" | grep -qE '--no-verify'; then
  BLOCKED=true
  REASON="--no-verify is blocked — hooks must not be bypassed"
fi

if printf '%s' "$COMMAND" | grep -qE '\bgit\s+(checkout\s+-b|branch\s+\S|switch\s+-c)\b'; then
  BLOCKED=true
  REASON="Branch creation is blocked — use scripts/create_agent_worktree.sh"
fi

if printf '%s' "$COMMAND" | grep -qE '\bgit\s+reset\s+--hard\b'; then
  BLOCKED=true
  REASON="git reset --hard is blocked on agent branches"
fi

if [[ "$BLOCKED" == true ]]; then
  echo ""
  echo "[BLOCKED COMMAND] ${REASON}"
  echo "  Command: ${COMMAND}"
  echo ""
  exit 1
fi

exit 0
