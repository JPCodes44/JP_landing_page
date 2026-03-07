#!/usr/bin/env python3
"""
changed_files_against_spec.py
Compares files changed vs origin/main against the spec's Allowed files list.
Exits 1 if any changed file is outside the allowed list.

Usage: python3 scripts/changed_files_against_spec.py <path-to-spec.md>
"""

from pathlib import Path
import subprocess
import sys
import fnmatch

if len(sys.argv) < 2:
    print("Usage: changed_files_against_spec.py <path-to-spec.md>")
    sys.exit(2)

spec_path = Path(sys.argv[1])

if not spec_path.exists():
    print(f"error: spec not found: {spec_path}")
    sys.exit(1)

allowed = []
capture = False
for line in spec_path.read_text().splitlines():
    if line.strip() == "## Allowed files":
        capture = True
        continue
    if capture and line.startswith("## "):
        break
    if capture and line.strip().startswith("- "):
        allowed.append(line.strip()[2:])

if not allowed:
    print(f"error: 'Allowed files' section is empty in {spec_path}")
    sys.exit(1)

result = subprocess.run(
    ["git", "diff", "--name-only", "origin/main...HEAD"],
    capture_output=True,
    text=True,
    check=True,
)

changed = [x.strip() for x in result.stdout.splitlines() if x.strip()]

if not changed:
    print("no changed files detected")
    sys.exit(0)

out_of_scope = [
    f for f in changed
    if not any(fnmatch.fnmatch(f, pattern) or f == pattern for pattern in allowed)
]

if out_of_scope:
    print("out-of-scope file changes detected:")
    for f in out_of_scope:
        print(f"  - {f}")
    sys.exit(1)

print(f"all {len(changed)} changed file(s) are within spec scope")
