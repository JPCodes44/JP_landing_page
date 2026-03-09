# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

A landing page for providing agentic services to SMBs. The project is in early stages — framework not yet chosen.

## Package Manager

This project uses **Bun**. Never use npm, yarn, or pnpm.

```bash
bun install        # install dependencies
bun run dev        # dev server
bun run build      # production build
bun test           # run all tests
bun test <file>    # run a single test file
bun run lint       # lint
bun run typecheck  # typecheck
```

## Getting Started

When the framework is chosen, update this file with the specific dev server, build, and test commands.

## Available Skills

Invoke these with `/skill-name` when relevant:

- `/orchestrator` — complex multi-step tasks (plan mode, subagents, self-improvement loop)
- `/verifier` — before marking anything complete
- `/refactor-review` — code review and refactor sessions
- `/bug-fixer` — given a bug report, fix it autonomously
- `/frontend` - for frontend-specific tasks, use this skill

## Task Management

Plan First: Write plan to tasks/todo.md with checkable items

Verify Plan: Check in before starting implementation

Track Progress: Mark items complete as you go

Explain Changes: High-level summary at each step

Document Results: Add review section to tasks/todo.md

Capture Lessons: Update tasks/lessons.md after corrections

Core Principles
Simplicity First: Make every change as simple as possible. Impact minimal code.

No Laziness: Find root causes. No temporary fixes. Senior developer standards.

Minimal Impact: Changes should only touch what's necessary. Avoid introducing bugs.
