# AGENTS.md

Guide for AI agents and developers working in this repository. Read this first —
it covers setup, the commands you can run, and the project's guardrails.

## What this is

`incredulous-ai` is a [Next.js](https://nextjs.org/) **13/14 Pages Router** app
(TypeScript + Tailwind) that generates "astonishing facts" via the OpenAI API,
tracks signups in Airtable, and sends analytics to Mixpanel.

## Prerequisites

- **Node.js** >= 18.17 (Next.js 14 requirement)
- **Yarn** (classic / v1) — the repo uses `yarn.lock`

## Setup

```bash
yarn install                 # install dependencies (also wires up Husky hooks)
cp .env.example .env.local   # then fill in real values (see "Environment" below)
```

> A `SessionStart` hook (`.claude/settings.json`) runs `yarn install`
> automatically in Claude Code web sessions, so deps are ready without manual
> steps.

## Environment variables

Copy `.env.example` → `.env.local` and fill in:

| Variable                 | Used by                  | Exposure                                   |
| ------------------------ | ------------------------ | ------------------------------------------ |
| `OPENAI_API_KEY`         | `pages/api/generateFact` | **Server only** — never sent to the client |
| `AIRTABLE_API_KEY`       | `pages/api/subscribe`    | **Server only** — never sent to the client |
| `MIXPANEL_PROJECT_TOKEN` | `hooks/useAnalytics`     | Public (client) — safe to expose           |
| `APP_ENV`                | analytics / dev flags    | Public (client)                            |
| `APP_NAME`               | analytics                | Public (client)                            |

**Critical rule:** server secrets (`OPENAI_API_KEY`, `AIRTABLE_API_KEY`) must
**never** be added to the `env` block in `next.config.js` — anything listed
there is inlined into the browser bundle. They are read directly from
`process.env` inside API routes (server-side only). See `SECURITY.md`.

`.env.local` is git-ignored and must never be committed.

## Commands

| Command             | What it does                                              |
| ------------------- | --------------------------------------------------------- |
| `yarn dev`          | Start the dev server at http://localhost:3000             |
| `yarn build`        | Production build (also runs lint + typecheck)             |
| `yarn start`        | Serve the production build                                |
| `yarn lint`         | ESLint (`next lint`)                                      |
| `yarn typecheck`    | `tsc --noEmit`                                            |
| `yarn test:e2e`     | Run Playwright end-to-end tests (auto-starts a dev server) |
| `yarn test:e2e:ui`  | Run Playwright in interactive UI mode                     |

## End-to-end tests (Playwright)

```bash
npx playwright install chromium   # one-time: download the browser
yarn test:e2e
```

The specs in `e2e/` **mock the `/api/generateFact` and `/api/subscribe`
routes**, so they run fast and need **no real API keys**. `yarn test:e2e`
starts its own dev server via the `webServer` block in `playwright.config.ts`.

## Git hooks (Husky)

A `pre-commit` hook (`.husky/pre-commit`) runs on every commit:

1. `lint-staged` → `eslint --fix` on staged `*.{js,jsx,ts,tsx}` files
2. `tsc --noEmit` → full type check

If either fails, the commit is blocked. Hooks are installed automatically by
`yarn install` (via the `prepare` script).

## Project structure

```
pages/            Next.js pages + API routes
  api/
    generateFact.ts   OpenAI-backed fact generator (rate-limited, topic-allowlisted)
    subscribe.ts      Server-side Airtable write (keeps the API key off the client)
components/        React UI components
hooks/             React hooks (analytics, local storage, facts state, subscribe)
prompts/           OpenAI prompt builders
shared/            Constants
e2e/               Playwright tests
```

## Before opening a PR / pushing

Run the same checks the hook and CI run:

```bash
yarn lint && yarn typecheck && yarn build && yarn test:e2e
```

## Security

This is a public repo. Read `SECURITY.md` before touching anything that handles
secrets, the Airtable/OpenAI integrations, or `next.config.js`.
