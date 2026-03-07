#!/usr/bin/env bash
set -euo pipefail

echo "running quality gates..."

echo "1/5 lint"
bun run lint

echo "2/5 typecheck"
bun run typecheck

echo "3/5 test"
bun run test

echo "4/5 build"
bun run build

echo "5/5 done"
echo "all quality gates passed"
