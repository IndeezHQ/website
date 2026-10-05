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

**Phase 0 complete** — foundation, landing page, the four legal documents,
and coming-soon placeholders for sign in and sign up. Deployed on Vercel.
Phase 1 (auth and the account portal) is next.

---

## Stack

- **Next.js 16** (App Router, Turbopack)
- **React 19** · **TypeScript**
- **Tailwind CSS v4**
- **Supabase** — `@supabase/ssr` for cookie-based sessions
- **Vitest** · **Testing Library** — 164 tests
- **Prettier** · **ESLint**

Requires **Node 22.13+**. See [Running locally](#running-locally).

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
.github/workflows/ci.yml   # verify + build on every PR and push to main
.githooks/                 # pre-commit and pre-push, installed by `prepare`
docs/
├── ROADMAP.md             # phasing to full app parity
└── BRAND_ASSETS.md        # how the logo, videos and textures are produced
media-source/videos/       # uncropped screen recordings. Masters, not served
scripts/check-copy.mjs     # fails the build on em and en dashes in copy
tests/
├── helpers/               # font cmap reader, next/font stub
└── integrity/             # routes, headings, legal documents
src/
├── app/
│   ├── (marketing)/       # landing, legal documents, sign in, sign up
│   ├── icon.png           # favicon, via Next's file convention
│   ├── globals.css        # brand tokens (mirrors the app's theme.ts)
│   └── layout.tsx         # root layout, fonts, metadata, starfield backdrop
├── assets/fonts/          # Indeez-Regular.ttf, the heading face
├── components/            # each with a colocated *.test.tsx
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
two disagree, and a test will say so.

**No em dashes or en dashes in copy**, and headings can only use the 73
characters the Indeez face carries. Both are enforced. The full set of
writing and design rules lives in [`AGENTS.md`](AGENTS.md).

---

## Branching

`main` is the released branch. Vercel deploys it, and the app store listings
will point at it, so it only receives work that has been checked in a browser.

**All work happens on `development`.** Nothing goes to `main` until it has
been QA'd.

```bash
git switch development
# ...work...
npm run verify
git push origin development
```

To release, once you have clicked around it and are happy:

```bash
git switch main && git merge development && git push origin main
```

Pushing to `main` runs the production build on top of `npm run verify`, so it
gets what CI runs before it gets there rather than after.

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

### Why typecheck runs `next typegen` first

`LayoutProps` and the other route types are generated by Next into
`.next/types/`, so `tsc` cannot see them in a checkout that has never been
built. Running `next typegen` first makes `npm run verify` self-sufficient.

Without it, `verify` passes locally off a stale `.next` directory and fails in
CI, which is the worst possible failure mode: a gate that is green on the
machine where it matters least.

### Dependency audits

CI runs `npm audit --omit=dev --audit-level=high`, so the build fails if
anything that actually ships carries a high-severity advisory.

It is scoped to production deliberately. The dev tree carries a standing
advisory against `braces`, reachable only through `eslint-config-next`, with
no patched version published. Auditing everything would mean a permanently
red build, and a build that is always red is one nobody reads.

**Do not run `npm audit fix --force`.** It downgrades `eslint-config-next`
from 16 to 14.2.35, which predates Next 16 and needs ESLint 7 or 8 while this
repo is on 9. It would break linting outright to fix a dev-only denial of
service with no route to it from a visitor.

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

- [`AGENTS.md`](AGENTS.md) — branching, the quality gate, and the house rules for copy
- [`docs/ROADMAP.md`](docs/ROADMAP.md) — phasing to full app parity
- [`docs/BRAND_ASSETS.md`](docs/BRAND_ASSETS.md) — logo, videos, textures and how they are produced
- [`../backend/README.md`](../backend/README.md) — schema, RLS, RPCs
- [`../backend/FRONTEND_HANDOFF.md`](../backend/FRONTEND_HANDOFF.md) — auth integration guide
- [`../mobile-app/docs/BACKEND_IDENTITY_MODEL.md`](../mobile-app/docs/BACKEND_IDENTITY_MODEL.md) — the profiles/Pages identity model
- [`../mobile-app/docs/MODERATION_SUPERADMIN_PLAN.md`](../mobile-app/docs/MODERATION_SUPERADMIN_PLAN.md) — design doc for the admin phase

---

## Ownership

IndeezHQ · © Indeez. All rights reserved.
