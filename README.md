# Indeez Website

The web front end for the Indeez platform — marketing site, legal documents,
user accounts, and the internal admin surface.

Partner to [`../mobile-app`](../mobile-app) (Expo / React Native) and
[`../backend`](../backend) (Supabase). All three talk to the same Supabase
project; there is no API server between them.

**Goal:** full parity with the mobile app, on the web. See
[`docs/ROADMAP.md`](docs/ROADMAP.md) for the phasing and what each phase depends on.

---

## Status

**Phase 0 complete** — foundation, landing page and the four legal documents.
Phase 1 (auth and the account portal) is next.

---

## Stack

- **Next.js 16** (App Router, Turbopack)
- **React 19** · **TypeScript**
- **Tailwind CSS v4**
- **Supabase** — `@supabase/ssr` for cookie-based sessions
- **Prettier** · **ESLint**

> **Note:** Next 16 renamed `middleware.ts` to `proxy.ts`. This repo ships an
> `AGENTS.md` telling coding agents to read `node_modules/next/dist/docs/`
> before writing code, because a lot of Next 16 differs from what models were
> trained on.

---

## Running locally

Requires **Node 22.13+** (`.nvmrc` pins 22). Older Node will fail: jsdom needs
`require(esm)`, which landed in 22.12. A default shell on this machine may
still be on Node 14.

```bash
nvm use
npm install
cp .env.example .env.local   # then fill in the Supabase values
npm run dev
```

The dev server picks the first free port from 3000.

### Environment

| Variable                        | Purpose                                                                   |
| ------------------------------- | ------------------------------------------------------------------------- |
| `NEXT_PUBLIC_SUPABASE_URL`      | Supabase project URL. Same project as the mobile app.                     |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Anon key. Public by design — safe only because every table is behind RLS. |
| `SUPABASE_SERVICE_ROLE_KEY`     | **Server only.** Bypasses RLS entirely. Never prefix with `NEXT_PUBLIC_`. |
| `NEXT_PUBLIC_SITE_URL`          | Canonical origin, used for auth redirects and metadata.                   |

---

## Scripts

| Command              | What it does                                                        |
| -------------------- | ------------------------------------------------------------------- |
| `npm run dev`        | Dev server                                                          |
| `npm run build`      | Production build                                                    |
| `npm test`           | Run the test suite once                                             |
| `npm run test:watch` | Tests in watch mode                                                 |
| `npm run verify`     | format:check, lint, typecheck, check:copy, test. Run before pushing |
| `npm run format`     | Prettier write                                                      |

---

## Structure

```text
docs/
└── ROADMAP.md             # phasing to full app parity
src/
├── app/
│   ├── (marketing)/       # public pages — landing + the four legal documents
│   ├── globals.css        # brand tokens (mirrors the app's theme.ts)
│   └── layout.tsx         # root layout, fonts, metadata
├── assets/fonts/          # Indeez-Regular.ttf — wordmark only
├── components/
├── content/legal/         # the legal documents, as Markdown
└── lib/
    ├── fonts.ts
    ├── legal.ts           # document registry + loader
    └── site.ts            # names, contact addresses, nav, store links
```

---

## Conventions worth knowing

**Brand tokens mirror the app.** The palette in `src/app/globals.css` is lifted
from `../mobile-app/src/design/theme.ts`. If a colour changes there, change it
here too. The site is deliberately dark-only — a light variant of this palette
would read as a different brand.

**Legal documents are content, not components.** They live as Markdown in
`src/content/legal/` and are rendered through one shared shell. Edit the
Markdown; only bump the effective date in `src/lib/legal.ts` when the text it
labels actually changes, because users rely on it to know which version they
agreed to.

**The old Google Sites paths redirect.** `/privacy-policy`,
`/terms-conditions`, `/child-safety-standards` and `/home` are 308s to their
new homes, set in `next.config.ts`. Those URLs are cited in app-store listings.

**Store links are config-driven.** `stores` in `src/lib/site.ts` is empty until
the apps are live; the download CTAs render as "coming soon" rather than as
dead buttons. Fill both in and the buttons appear on their own.

**Contact addresses appear in the legal text too.** `support@` for help and
child-safety reports, `info@` for privacy requests and legal notices. Changing
one in `src/lib/site.ts` without changing the matching document will make the
two disagree.

---

## Testing and the quality gate

`npm run verify` is the gate. It runs formatting, linting, TypeScript, the
copy rule and the full test suite, and it is what both the pre-push hook and
CI run. There is no separate "quick" variant on purpose.

```bash
npm run verify
```

### What is covered

164 tests across 14 files, using Vitest and Testing Library.

| Area                        | What it guards                                                                                                                                                                                                             |
| --------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `tests/integrity/routes`    | Every internal link resolves to a real page, every anchor to a real element, every asset to a file in `public/`, and every redirect to a page that exists.                                                                 |
| `tests/integrity/headings`  | Every heading uses only characters the Indeez face can draw, read live from the font's `cmap` table.                                                                                                                       |
| `tests/integrity/legal`     | The four documents exist, are not truncated, carry their effective dates, use the right contact address, and still contain the three Terms clauses the landing page cites by number.                                       |
| `src/lib/site.test.ts`      | The store-link flag tracks the URLs, the five account types match the backend, nav destinations are unique.                                                                                                                |
| `src/components/*.test.tsx` | Behaviour, not snapshots: the header logo hides on the landing page only, videos stay `preload="none"` until observed, reduced-motion users get still frames and real controls, the CTA never renders a dead store button. |

These are chosen to catch the things that actually broke during the build. The
route test exists because `/sign-in` shipped as a 404 for a while: a missing
route is a runtime 404, not a build error, so nothing caught it. The heading
test exists because the display face has 73 glyphs and falls back silently
mid-word on anything else.

### Before it reaches the remote

**Local:** a `pre-push` hook in `.githooks/` runs `npm run verify`. It is
wired up automatically by the `prepare` script on `npm install`, so a fresh
clone gets it after one install.

**CI:** `.github/workflows/ci.yml` runs `verify` and then `build` on every
pull request and every push to `main`.

> **The hook is a convenience, not the gate.** `git push --no-verify` skips
> it. To actually stop unverified commits reaching `main`, turn on a branch
> protection rule in GitHub: Settings, Branches, add a rule for `main`,
> require the **Verify and build** status check to pass. That is the only
> part of this that cannot be committed to the repo.

---

## Related documentation

- [`docs/ROADMAP.md`](docs/ROADMAP.md) — phasing to full app parity
- [`../backend/README.md`](../backend/README.md) — schema, RLS, RPCs
- [`../backend/FRONTEND_HANDOFF.md`](../backend/FRONTEND_HANDOFF.md) — auth integration guide
- [`../mobile-app/docs/BACKEND_IDENTITY_MODEL.md`](../mobile-app/docs/BACKEND_IDENTITY_MODEL.md) — the profiles/Pages identity model
- [`../mobile-app/docs/MODERATION_SUPERADMIN_PLAN.md`](../mobile-app/docs/MODERATION_SUPERADMIN_PLAN.md) — design doc for the admin phase

---

## Ownership

IndeezHQ · © Indeez. All rights reserved.
