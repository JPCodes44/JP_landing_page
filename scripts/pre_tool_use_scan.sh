#!/usr/bin/env bash
# scripts/pre_tool_use_scan.sh
#
# Claude Code PreToolUse hook — fires before Write, Edit, MultiEdit.
# On agent/* branches only: scans relevant source directories for similar
# existing exports and warns the agent before it writes duplicate code.
#
# Always exits 0 (warn-only, never hard-blocks).
# Stdout is surfaced to the main agent as inline context.

set -euo pipefail

# ─── Branch guard ─────────────────────────────────────────────────────────────
BRANCH=$(git symbolic-ref --short HEAD 2>/dev/null || echo "")
if [[ "$BRANCH" != agent/* ]]; then
  exit 0
fi

# ─── Parse tool input from stdin ──────────────────────────────────────────────
INPUT=$(cat)
FILE_PATH=$(printf '%s' "$INPUT" | jq -r '.file_path // empty' 2>/dev/null || true)
if [[ -z "$FILE_PATH" ]]; then
  exit 0
fi

# ─── Normalize to repo-relative path ──────────────────────────────────────────
REPO_ROOT=$(git rev-parse --show-toplevel 2>/dev/null || echo "")
if [[ -n "$REPO_ROOT" ]]; then
  FILE_PATH="${FILE_PATH#"${REPO_ROOT}/"}"
fi

# ─── Map file path to scan directories ────────────────────────────────────────
SCAN_DIRS=()
case "$FILE_PATH" in
  packages/frontend/*)
    SCAN_DIRS=("packages/common/src" "packages/frontend/src")
    ;;
  packages/backend/*)
    SCAN_DIRS=("packages/common/src" "packages/backend/src")
    ;;
  packages/common/*)
    SCAN_DIRS=("packages/common/src")
    ;;
  *)
    exit 0
    ;;
esac

# ─── Phase 1: grep for existing exports (no AI) ───────────────────────────────
CANDIDATES=""
for dir in "${SCAN_DIRS[@]}"; do
  if [[ -d "$dir" ]]; then
    FOUND=$(grep -rn \
      --include="*.ts" --include="*.tsx" \
      -E "(export (function|const|type|interface|class|default)|export \{)" \
      "$dir" 2>/dev/null | head -60 || true)
    CANDIDATES="${CANDIDATES}${FOUND}"$'\n'
  fi
done

if [[ -z "${CANDIDATES// }" ]]; then
  exit 0
fi

# ─── Phase 2: sub-agent judges relevance ──────────────────────────────────────
PROMPT="You are a code similarity checker. Be brief and mechanical.

The agent is about to write or edit: ${FILE_PATH}

Existing exports in relevant source directories:
${CANDIDATES}

Does anything in the existing exports appear similar to or potentially duplicate what might be written to ${FILE_PATH} based on its filename and path alone?

Reply in this EXACT format, no other text:
FINDINGS: <comma-separated list of similar export names, or the word none>
DETAIL: <one sentence, or the word none>"

set +e
RESPONSE=$(timeout 10s claude --print --model claude-haiku-4-5 -p "$PROMPT" 2>/dev/null)
SC=$?
set -e

if [[ $SC -ne 0 || -z "$RESPONSE" ]]; then
  exit 0
fi

# ─── Parse and emit warning ───────────────────────────────────────────────────
FINDINGS=$(printf '%s' "$RESPONSE" | grep "^FINDINGS:" | head -1 | sed 's/^FINDINGS: //' || true)
DETAIL=$(printf '%s' "$RESPONSE" | grep "^DETAIL:" | head -1 | sed 's/^DETAIL: //' || true)

if [[ -n "$FINDINGS" && "$FINDINGS" != "none" ]]; then
  echo ""
  echo "[SIMILARITY WARNING] Before writing to ${FILE_PATH}:"
  echo "  Similar existing code found: ${FINDINGS}"
  if [[ -n "$DETAIL" && "$DETAIL" != "none" ]]; then
    echo "  ${DETAIL}"
  fi
  echo "  Check packages/common/src/ before adding new code."
  echo ""
fi

exit 0
