# GitHub Actions CI/CD Pipeline

## Summary
Added a three-job CI/CD pipeline using GitHub Actions that runs type checking, linting, tests, and production builds on every push to main/dev and on pull requests.

## Date
2026-02-11

## Issues
- Closes #48 — GitHub Actions CI/CD Pipeline

## Changes
- **`.github/workflows/ci.yml`** — Three-job CI workflow: `check` (svelte-check + eslint/prettier), `test` (vitest), `build` (production build). Check and test run in parallel; build runs after both pass. Uses pnpm 9 with caching, Node 20, concurrency control, and `--frozen-lockfile`.
- **`pnpm-workspace.yaml`** — Added missing `packages: []` field that caused `pnpm store path` to fail in CI (required by actions/setup-node cache).

## Verification
- [x] CI workflow runs and all 3 jobs pass (check: 37s, test: 13s, build: 20s)
- [x] Triggers correctly on PR to dev branch
- [x] Concurrency control cancels in-progress runs
- [x] pnpm caching works via actions/setup-node
- [x] Fallback env vars allow build without GitHub Secrets configured
- [ ] `pnpm check && pnpm lint` passes locally (skipped — node_modules corrupted across worktrees, but CI validates this)
