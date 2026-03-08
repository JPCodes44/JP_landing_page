#!/usr/bin/env bash
# verify_no_secrets.sh
# Scans staged or specified files for secret patterns.
# Usage: verify_no_secrets.sh [--staged | --files file1 file2 ...]
# Exit 1 if any secrets found.

set -euo pipefail

RED='\033[0;31m'
GREEN='\033[0;32m'
NC='\033[0m'

PATTERNS=(
  'AKIA[0-9A-Z]{16}'                          # AWS Access Key ID
  '-----BEGIN (RSA|EC|OPENSSH|PGP) PRIVATE'  # Private keys
  'Bearer [A-Za-z0-9\-._~+/]{20,}'           # Bearer tokens
  'password\s*=\s*["\047][^"\047]{4,}'       # password = "..."
  'secret\s*=\s*["\047][^"\047]{4,}'         # secret = "..."
  'api[_-]?key\s*=\s*["\047][^"\047]{4,}'   # api_key = "..."
  'token\s*=\s*["\047][^"\047]{8,}'          # token = "..."
  '^[A-Za-z0-9+/]{40,}={0,2}$'              # Long base64 blobs (potential encoded secrets)
)

get_files() {
  if [[ "${1:-}" == "--staged" ]]; then
    git diff --cached --name-only --diff-filter=ACM
  elif [[ "${1:-}" == "--files" ]]; then
    shift
    echo "$@" | tr ' ' '\n'
  else
    git diff --cached --name-only --diff-filter=ACM
  fi
}

SENSITIVE_NAMES=(
  '(^|/)\.env(\.|$)'        # .env, .env.local, .env.production, etc.
  '\.(pem|key|p12|pfx|jks)$'  # private key / cert files
  '(^|/)(id_rsa|id_ecdsa|id_ed25519|id_dsa)$'  # SSH private keys
  '(^|/)credentials(\.json)?$'  # credentials files
  '(^|/)\.aws/(credentials|config)$'  # AWS credential files
)

FAILURES=0
FILES=$(get_files "$@")

if [[ -z "$FILES" ]]; then
  echo -e "${GREEN}[secrets] No files to scan.${NC}"
  exit 0
fi

while IFS= read -r file; do
  [[ -f "$file" ]] || continue

  # Block sensitive filenames outright
  for name_pattern in "${SENSITIVE_NAMES[@]}"; do
    if echo "$file" | grep -qE "$name_pattern"; then
      echo -e "${RED}[secrets] FAIL: Sensitive file staged: $file${NC}"
      FAILURES=$((FAILURES + 1))
      break
    fi
  done

  # Scan contents for secret patterns
  for pattern in "${PATTERNS[@]}"; do
    if grep -qEi "$pattern" "$file" 2>/dev/null; then
      echo -e "${RED}[secrets] FAIL: Possible secret in $file (pattern: $pattern)${NC}"
      FAILURES=$((FAILURES + 1))
    fi
  done
done <<< "$FILES"

if [[ $FAILURES -eq 0 ]]; then
  echo -e "${GREEN}[secrets] PASS: No secrets detected.${NC}"
  exit 0
else
  echo -e "${RED}[secrets] FAIL: $FAILURES secret pattern(s) found. Remove before committing.${NC}"
  exit 1
fi
