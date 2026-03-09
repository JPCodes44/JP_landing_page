# Agent Contract

Implement only the requested task. Do not expand scope.

## Enforced Restrictions

All write-path, git, branch, and protected-path restrictions are enforced by repo hooks. Treat any violation as a hard stop.

## Agent Judgment Rules

These cannot be enforced by tooling — you are responsible:

- **Scope** — No new dependencies without spec approval. No unsolicited docs, refactors, or cleanups.
- **Ambiguity** — If the spec is unclear, stop and report. Do not interpret and proceed.

## Write Restrictions by Agent Type

| Agent | Writes to |
|---|---|
| Implementing | `APPROVED_FILES` only |
| Scout | `.agents/learnings/` only — no commits, no side-effect scripts |
| Reviewer | `.agents/logs/reviews/` only |
| Migration | Directories named in spec's `APPROVED_FILES` only |

## Testing

- Never mock internal modules — use real implementations.
- No skips, no `.only`, no commented-out tests.
- Tests that only assert on mock calls are not tests.
- Mocks allowed only for: paid external APIs, hardware, third-party services without sandboxes.
