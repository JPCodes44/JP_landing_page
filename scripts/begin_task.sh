#!/usr/bin/env bash
# scripts/begin_task.sh <task-id> [--force]
#
# Mandatory task-start step. Must be run before any Write/Edit/MultiEdit.
# Reads the spec and global policy, invokes Claude to classify
# the task and plan file reads, then writes a read receipt to
# .agents/logs/reads/<task-id>.json.
#
# Usage:
#   bash scripts/begin_task.sh <task-id>
#   bash scripts/begin_task.sh <task-id> --force   # overwrite existing receipt

set -euo pipefail

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[0;33m'
BOLD='\033[1m'
NC='\033[0m'

# ─── Args ─────────────────────────────────────────────────────────────────────
if [[ $# -lt 1 ]]; then
  echo -e "${RED}Usage: $0 <task-id> [--force]${NC}"
  exit 1
fi

TASK_ID="$1"
FORCE=false
if [[ "${2:-}" == "--force" ]]; then
  FORCE=true
fi

REPO_ROOT="$(git rev-parse --show-toplevel)"
READS_DIR="${REPO_ROOT}/.agents/logs/reads"
RECEIPT="${READS_DIR}/${TASK_ID}.json"
POLICY_PATH="${REPO_ROOT}/.agents/policies/00-agent-contract.md"
TASK_PROTOCOL="${REPO_ROOT}/.agents/policies/01-task-protocol.md"
VALIDATION="${REPO_ROOT}/.agents/policies/02-validation.md"

# ─── Idempotency guard ────────────────────────────────────────────────────────
if [[ -f "$RECEIPT" && "$FORCE" == false ]]; then
  echo -e "${YELLOW}[begin_task] Read receipt already exists for '${TASK_ID}'.${NC}"
  echo "  Path: ${RECEIPT}"
  echo "  Run with --force to regenerate."
  echo ""
  python3 - <<PYEOF
import json
with open('${RECEIPT}') as f:
    r = json.load(f)
print('CLASSIFICATION:', r.get('classification', 'unknown'))
print('SUMMARY:', r.get('summary', '(none)'))
PYEOF
  exit 0
fi

# ─── Find spec ────────────────────────────────────────────────────────────────
SPEC_PATH=$(find "${REPO_ROOT}/.agents/specs/active" -maxdepth 1 -name "*-${TASK_ID}.md" 2>/dev/null | head -1 || true)
if [[ -z "$SPEC_PATH" ]]; then
  echo -e "${RED}[begin_task] ERROR: No spec found for task '${TASK_ID}'.${NC}"
  echo "  Expected: .agents/specs/active/<date>-${TASK_ID}.md"
  echo "  Create a spec first: bash scripts/create_agent_worktree.sh ${TASK_ID}"
  exit 1
fi

echo -e "${BOLD}[begin_task] Starting context retrieval for: ${TASK_ID}${NC}"
echo "  Spec: ${SPEC_PATH}"
echo ""

# ─── Read spec and policies ───────────────────────────────────────────────────
SPEC_CONTENT=$(cat "$SPEC_PATH")

POLICY_CONTENT=""
if [[ -f "$POLICY_PATH" ]]; then
  POLICY_CONTENT=$(cat "$POLICY_PATH")
else
  echo -e "${YELLOW}[begin_task] WARNING: 00-agent-contract.md not found.${NC}"
fi

PROTOCOL_CONTENT=""
if [[ -f "$TASK_PROTOCOL" ]]; then
  PROTOCOL_CONTENT=$(cat "$TASK_PROTOCOL")
fi

VALIDATION_CONTENT=""
if [[ -f "$VALIDATION" ]]; then
  VALIDATION_CONTENT=$(cat "$VALIDATION")
fi

# ─── Build prompt ─────────────────────────────────────────────────────────────
PROMPT="You are performing a mandatory context retrieval step before implementing a software task.

## Agent Contract
${POLICY_CONTENT}

## Task Protocol
${PROTOCOL_CONTENT}

## Validation
${VALIDATION_CONTENT}

## Task Spec
${SPEC_CONTENT}

---

Apply the Context Retrieval Policy to this spec. Perform Steps 2 through 6 of the policy.

Output ONLY this exact format — no prose before or after:

CLASSIFICATION: <frontend-only|backend-only|app+common|cross-cutting>
RELEVANT_FILES: <comma-separated file paths, no spaces after commas>
PLANNED_READS: <comma-separated file paths, no spaces after commas>
WHY_SUFFICIENT: <one sentence>
SUMMARY: <one paragraph of at most 150 words>"

# ─── Invoke Claude ────────────────────────────────────────────────────────────
echo -e "${YELLOW}[begin_task] Classifying task and planning reads...${NC}"

set +e
RESPONSE=$(timeout 60s claude --print -p "$PROMPT" 2>/dev/null)
SC=$?
set -e

if [[ $SC -ne 0 || -z "$RESPONSE" ]]; then
  echo -e "${RED}[begin_task] ERROR: Claude invocation failed (exit ${SC}).${NC}"
  echo "  Write the receipt manually to unblock:"
  echo "  ${RECEIPT}"
  echo ""
  echo "  Required fields: task_id, timestamp, classification, spec_path,"
  echo "  relevant_files, planned_reads, why_sufficient, summary"
  exit 1
fi

# ─── Parse response ───────────────────────────────────────────────────────────
parse_field() {
  local label="$1"
  printf '%s' "$RESPONSE" | grep "^${label}:" | head -1 | sed "s/^${label}: //" || true
}

CLASSIFICATION=$(parse_field "CLASSIFICATION")
RELEVANT_FILES_RAW=$(parse_field "RELEVANT_FILES")
PLANNED_READS_RAW=$(parse_field "PLANNED_READS")
WHY_SUFFICIENT=$(parse_field "WHY_SUFFICIENT")
SUMMARY=$(printf '%s' "$RESPONSE" | awk '/^SUMMARY:/{found=1; sub(/^SUMMARY: /,""); print; next} found{print}' \
  | head -20 | tr '\n' ' ' | sed 's/  */ /g')

if [[ -z "$CLASSIFICATION" ]]; then
  echo -e "${RED}[begin_task] ERROR: Could not parse CLASSIFICATION from response.${NC}"
  echo "Raw response:"
  printf '%s\n' "$RESPONSE"
  exit 1
fi

TIMESTAMP=$(date -u '+%Y-%m-%dT%H:%M:%SZ')

# ─── Write receipt via Python ─────────────────────────────────────────────────
mkdir -p "${READS_DIR}"

RECEIPT_TASK_ID="$TASK_ID" \
RECEIPT_TIMESTAMP="$TIMESTAMP" \
RECEIPT_CLASSIFICATION="$CLASSIFICATION" \
RECEIPT_SPEC_PATH="$SPEC_PATH" \
RECEIPT_RELEVANT_FILES="$RELEVANT_FILES_RAW" \
RECEIPT_PLANNED_READS="$PLANNED_READS_RAW" \
RECEIPT_WHY="$WHY_SUFFICIENT" \
RECEIPT_SUMMARY="$SUMMARY" \
RECEIPT_OUTPUT="$RECEIPT" \
python3 - <<'PYEOF'
import json, os

def env(k): return os.environ[k]

def split_paths(s):
    return [p.strip() for p in s.split(",") if p.strip()] if s.strip() else []

record = {
    "task_id":        env("RECEIPT_TASK_ID"),
    "timestamp":      env("RECEIPT_TIMESTAMP"),
    "classification": env("RECEIPT_CLASSIFICATION"),
    "spec_path":      env("RECEIPT_SPEC_PATH"),
    "relevant_files": split_paths(env("RECEIPT_RELEVANT_FILES")),
    "planned_reads":  split_paths(env("RECEIPT_PLANNED_READS")),
    "why_sufficient": env("RECEIPT_WHY"),
    "summary":        env("RECEIPT_SUMMARY"),
}

out_path = env("RECEIPT_OUTPUT")
with open(out_path, "w") as f:
    json.dump(record, f, indent=2)

print(f"Read receipt written: {out_path}")
PYEOF

# ─── Print output ─────────────────────────────────────────────────────────────
echo ""
echo -e "${GREEN}${BOLD}[begin_task] Context retrieval complete.${NC}"
echo ""
echo -e "${BOLD}TASK CLASSIFICATION:${NC} ${CLASSIFICATION}"
echo ""
echo -e "${BOLD}RELEVANT FILES:${NC}"
IFS=',' read -ra FILES <<< "$RELEVANT_FILES_RAW"
for f in "${FILES[@]}"; do echo "  - ${f}"; done
echo ""
echo -e "${BOLD}WORKING MEMORY SUMMARY:${NC}"
echo "  ${SUMMARY}"
echo ""
echo -e "${GREEN}You may now proceed with implementation.${NC}"
echo "  Receipt: ${RECEIPT}"
