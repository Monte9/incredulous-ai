# Security

## Reporting a vulnerability

Please report security issues privately to the maintainer rather than opening a
public issue.

## Secret-handling model

This app uses three classes of configuration:

- **Server-only secrets** — `OPENAI_API_KEY`, `AIRTABLE_API_KEY`. These are read
  directly from `process.env` inside API routes (`pages/api/*`), which only ever
  run on the server. They must **never** appear in the `env` block of
  `next.config.js`, and must never be referenced from client-side code
  (components/hooks that run in the browser).
- **Public client values** — `MIXPANEL_PROJECT_TOKEN` (a write-only ingestion
  token, designed to be public), `APP_ENV`, `APP_NAME`. These are intentionally
  inlined into the client bundle via `next.config.js`.
- **Local-only** — everything lives in `.env.local`, which is git-ignored.

> ⚠️ **Why this matters:** anything in the `next.config.js` `env` block is
> inlined into the JavaScript shipped to every visitor's browser. Putting a
> secret there (or referencing it from client code) leaks it to the world. You
> can verify what reaches the client by building and grepping `.next/static`.

## Hardening in place

- **Airtable writes are server-side only.** The browser calls `/api/subscribe`,
  which performs the Airtable write with the secret key. The key never reaches
  the client. Email + `userId` are re-validated server-side.
- **`/api/generateFact` is rate-limited and topic-allowlisted.** Requests are
  throttled per IP (best-effort, in-memory), and the `topics` query param is
  filtered against a fixed allowlist (`shared/Constants.ts`) before being
  interpolated into the LLM prompt — this prevents prompt injection and abuse of
  the endpoint as a free LLM proxy.
  - **Production note:** the in-memory limiter does not share state across
    serverless instances. For real protection back it with a shared store
    (e.g. Upstash Redis / Vercel KV).

## ‼️ Required operational follow-up: rotate the Airtable key

A previous version of this app inlined `AIRTABLE_API_KEY` into the **client
bundle**, so it was served to every visitor of the deployed site. The code has
been fixed, but **the previously-exposed key is compromised and must be
rotated**:

1. Revoke / regenerate the Airtable API key (Personal Access Token) at
   https://airtable.com/create/tokens
2. Update `AIRTABLE_API_KEY` in your deployment environment (e.g. Vercel) and in
   local `.env.local`.
3. Scope the new token to only the base it needs.

Also revoke any Airtable **workspace invite links** that were previously shared
publicly (e.g. in the README).

## Known residual advisories

`yarn audit` reports a few remaining **high** advisories against `next@14.2.x`
(DoS / SSRF / Pages-Router proxy bypass) that are only patched in **Next.js
15.x**. Some do not apply to this app (no Server Components, no middleware).
Upgrading to Next 15 requires a React 19 migration and should be done as a
deliberate follow-up. The original critical issue (middleware auth bypass,
CVE-2025-29927) is resolved on 14.2.x.

## Verifying the client bundle is clean

```bash
# Build with placeholder secrets and confirm they do NOT reach the client:
printf 'AIRTABLE_API_KEY=LEAKTEST\nOPENAI_API_KEY=LEAKTEST2\n' > .env.local
yarn build
grep -rl "LEAKTEST" .next/static && echo "LEAK!" || echo "clean"
rm -f .env.local && rm -rf .next
```
