<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

---

# How this project is worked on

Everything below is project policy. The block above is managed by `next dev`
and will be rewritten; do not edit it, and do not add anything inside it.

## Branching

`main` is the released branch. It is what Vercel deploys and what the app
stores will point at, so it only ever receives work that has been looked at in
a browser and is fit to put in front of people.

- **All work happens on `development`**, or on a short-lived branch off it.
- **Never commit directly to `main`.** Merge `development` into it once the
  change has been QA'd.
- Do not push to `main` to "fix it quickly". Fix it on `development` and merge.

```bash
git switch development
# ...work...
npm run verify
git push origin development

# when it has been checked in a browser and is ready to release
git switch main && git merge development && git push origin main
```

## The quality gate

`npm run verify` runs formatting, linting, TypeScript, the copy rule and the
full test suite. It must pass before anything is pushed. Two hooks enforce it,
installed automatically by the `prepare` script:

- `pre-commit` checks formatting and lint on staged files only, so it stays
  under two seconds.
- `pre-push` runs the whole of `verify`, plus the production build when the
  push targets `main`.

Both can be skipped with `--no-verify`. Do not. The GitHub branch protection
rule on `main` is the only thing that genuinely cannot be bypassed.

`verify` must pass from a clean checkout, not just on a machine with build
artefacts lying around. `typecheck` runs `next typegen` first for that reason;
do not remove it.

New behaviour needs a test. The suite is described in the README; the
integrity tests under `tests/integrity/` exist because each of them caught a
real regression in this repo.

## House rules for copy

- **No em dashes or en dashes in anything a reader sees.** Use a comma, a
  colon, a full stop, or two sentences. Hyphens are fine, and dashes inside
  code comments are fine. `npm run check:copy` fails the build otherwise.
- **Headings can only use the characters the Indeez face carries**: `A-Z`,
  `a-z`, `0-9`, space, and `! " & ' , - . : ?`. Anything else, notably
  brackets and slashes, falls back to another face silently, mid-word. A test
  reads the real coverage out of the font file and will fail.
- **No invented traction.** Indeez is pre-launch. No user counts, growth
  figures, partner logos or funding claims until the numbers are real. The
  page is written to persuade on the idea, which is the honest position.
- **The legal documents are verbatim ports** of published pages people have
  already agreed to. Edit the Markdown in `src/content/legal/`, and only bump
  an effective date in `src/lib/legal.ts` when the text it labels actually
  changed.

## Design

- Brand tokens in `src/app/globals.css` mirror `../mobile-app/src/design/theme.ts`.
  Change one, change the other. The site is dark-only by design.
- Brand assets and how they are produced are documented in
  `docs/BRAND_ASSETS.md`. Do not serve a source GIF or an uncropped
  screen recording; there are build commands for both.
- Anything that animates needs a reduced-motion path.

## Roadmap

`docs/ROADMAP.md` has the phasing to full parity with the mobile app, and
records which phases are blocked on backend work that does not exist yet.
