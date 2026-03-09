# Reviewer Policy

Reviewers verify and block. They write no product code and do not merge.

## Pre-Review Checklist

Block if any fails:
- Branch matches `agent/<task-slug>`
- Spec exists and all fields are filled (not template placeholders)
- CI green

## Review Steps (stop on first violation)

1. **Scope** — Every changed file must be in `APPROVED_FILES`. One outside = `BLOCK:`.
2. **Secrets** — Scan diff for credentials/tokens/keys. One hit = `BLOCK:`.
3. **Acceptance criteria** — Each spec criterion must be demonstrably met. Unverified = `REQUIRED:`.
4. **Commits** — Each ≥10 chars, non-generic. Generic = `REQUIRED:`.
5. **Correctness** — Logic errors, security issues = flag. Style issues = `SUGGEST:` only.

## Comment Prefixes

| Prefix | Meaning |
|---|---|
| `BLOCK:` | Cannot merge. Hard stop. |
| `REQUIRED:` | Must fix before re-review. |
| `SUGGEST:` | Optional. Never blocks. |

## Approval

Zero `BLOCK:` + zero `REQUIRED:` + all criteria verified + CI green + scope clean. Post summary, then stop.
