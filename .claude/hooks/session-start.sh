#!/bin/bash
set -euo pipefail

# SessionStart hook for Claude Code on the web.
# Prepares the repo so linters, type checks, builds, and Playwright e2e tests
# work out of the box. Runs only in remote (web) sessions; local sessions are
# left untouched so they don't pay the install cost on every start.

if [ "${CLAUDE_CODE_REMOTE:-}" != "true" ]; then
  exit 0
fi

cd "${CLAUDE_PROJECT_DIR:-.}"

echo "[session-start] Installing JS dependencies (yarn)..."
yarn install --frozen-lockfile

# Install the browser used by the e2e suite. Best-effort: the container state is
# cached after this hook, so the download only happens on a cold start. A
# failure here must not block the session from starting.
echo "[session-start] Installing Playwright Chromium (best-effort)..."
npx playwright install --with-deps chromium \
  || npx playwright install chromium \
  || echo "[session-start] WARN: Playwright browser install failed; run 'npx playwright install chromium' before 'yarn test:e2e'."

echo "[session-start] Done."
