#!/usr/bin/env python3
"""
verify_spec_header.py
Validates that a spec file has all required fields populated and that the
Branch field matches the current git branch.

Usage: python3 scripts/verify_spec_header.py <path-to-spec.md>
"""

import subprocess
import sys
import re
from pathlib import Path

RED = "\033[0;31m"
GREEN = "\033[0;32m"
NC = "\033[0m"

REQUIRED_FIELDS = ["Objective", "Why", "Branch", "Worktree", "Allowed files", "Acceptance Criteria"]
PLACEHOLDER_VALUES = {"-", "agent/", "../wt-"}


def get_branch() -> str:
    result = subprocess.run(
        ["git", "rev-parse", "--abbrev-ref", "HEAD"],
        capture_output=True, text=True
    )
    return result.stdout.strip()


def check_field_populated(content: str, field: str) -> bool:
    in_section = False
    for line in content.splitlines():
        if line.strip() == f"## {field}":
            in_section = True
            continue
        if in_section:
            if line.startswith("## "):
                break
            stripped = line.strip()
            if not stripped or stripped.startswith("<!--"):
                continue
            if stripped in PLACEHOLDER_VALUES:
                return False
            return True
    return False


def main():
    if len(sys.argv) < 2:
        print(f"{RED}Usage: verify_spec_header.py <path-to-spec.md>{NC}")
        sys.exit(2)

    spec_path = Path(sys.argv[1])

    if not spec_path.exists():
        print(f"{RED}[spec] FAIL: Spec not found: {spec_path}{NC}")
        sys.exit(1)

    content = spec_path.read_text()
    branch = get_branch()

    # Verify Branch field matches current branch (only enforce on agent/* branches)
    if branch.startswith("agent/"):
        branch_match = re.search(r"^## Branch\s*\n(?:<!--.*?-->\s*\n)?(.*?)$", content, re.MULTILINE)
        if branch_match:
            spec_branch = branch_match.group(1).strip()
            if spec_branch != branch:
                print(f"{RED}[spec] FAIL: Branch in spec is '{spec_branch}' but current branch is '{branch}'.{NC}")
                sys.exit(1)

    failures = [f for f in REQUIRED_FIELDS if not check_field_populated(content, f)]

    if failures:
        print(f"{RED}[spec] FAIL: Missing or empty fields in {spec_path}: {', '.join(failures)}{NC}")
        sys.exit(1)

    print(f"{GREEN}[spec] PASS: {spec_path} is valid.{NC}")
    sys.exit(0)


if __name__ == "__main__":
    main()
