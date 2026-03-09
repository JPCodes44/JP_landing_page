# Testing Policy

## Anti-Mocking Rule

**Never mock what you can use for real.**

Mocks are permitted only when the real dependency is:
- A paid external API (e.g. Stripe, SendGrid) — use test mode or sandbox instead if available
- A hardware device or OS-level resource with no test alternative
- A third-party service with no sandbox/test environment

Everything else must use the real implementation:
- Internal modules → import and call directly
- Database → use an in-memory or test DB (e.g. SQLite, test Postgres instance)
- File system → use a temp directory
- Network calls to your own backend → use a test server or real local instance
- Browser APIs → use jsdom or a real browser (Playwright/Puppeteer)

**If you reach for `vi.mock`, `jest.mock`, or `jest.fn()` on an internal module, stop. That is mocking slop. Restructure the code instead.**

## Coverage

- All new code must have tests.
- Tests must pass at 100% — no skipped, no pending, no `.only` left in.
- Fix failures immediately. Do not comment out or skip a failing test to make the suite green.
- Do not write tests that only test mocks — a test that only verifies a mock was called proves nothing.

## What Reviewers Check

- Are any internal modules mocked? Flag it.
- Are there tests that only assert on mock calls? Flag it.
- Are there skipped or `.only` tests? Block the PR.
- Does coverage drop vs. main? Flag it.
