# Indeez Web — Roadmap

**Goal:** full parity with the mobile app, on the web.

This is the sequencing doc for getting there. It is deliberately phased so that
useful things ship early rather than everything landing at the end. Each phase
notes what it depends on in `../../backend`, because several of them are blocked on
work that does not exist yet.

Status legend: **Done** · **Next** · **Planned** · **Blocked**

**Last updated:** 2026-09-29

---

## The shape of the problem

The mobile app is a mature Expo/React Native client talking directly to Supabase
— no API server in between. Roughly 130 migrations of RPCs, RLS on every table,
plus AWS (S3 + Lambda) for audio and Supabase Storage for images and fonts.

That is good news for the web: **the backend is already a web-compatible API.**
Most of the work here is building a second client, not building a second system.
The exceptions are called out under [Cross-cutting decisions](#cross-cutting-decisions)
and [Where parity is not a copy](#where-parity-is-not-a-copy).

---

## Phase 0 — Foundation, marketing, legal · **Done**

The public face of the product, and the scaffolding everything else sits on.

- Next 16 (App Router, TypeScript, Tailwind v4), brand tokens ported from the
  app's `theme.ts`, wordmark using the app's own `Indeez-Regular.ttf`.
- Landing page.
- All four legal documents ported verbatim from the old Google Site, as
  Markdown in `src/content/legal/`.
- Redirects from the old Google Sites paths so existing citations keep working.

---

## Phase 1 — Auth and the account portal · **Next**

The smallest phase with the largest unblocking effect. Everything after it
needs a session.

**Ships**

- Sign in, sign up, forgot password, reset password.
- OAuth (Apple, Google) callback handling.
- **Email landing pages** — confirmation, password reset, email change.
- Account settings: profile basics, password, sign out everywhere.
- **Account deletion on the web** (calls the existing `delete_account` RPC).

**Why now**

Supabase's auth emails currently have nowhere good to land. Every confirmation
and reset link the app sends needs a web page at the other end, and right now
there isn't one.

Account deletion is worth doing here rather than later: Google Play expects a
publicly reachable URL where a user can request deletion _without reinstalling
the app_, and the current Support page only documents the in-app route. Worth
re-checking the current wording of Play's data-deletion policy before relying
on this, but a web deletion route is cheap insurance either way.

**Backend dependencies:** none. `delete_account` already exists
(`20260915000000_delete_account_rpc.sql`, fixed in `20260917000000`).

**Notable work:** session handling moves from `expo-secure-store` to cookies via
`@supabase/ssr`, with route protection in `proxy.ts` (Next 16 renamed
`middleware.ts` → `proxy.ts`).

---

## Phase 2 — Public profile, release and event pages · **Planned**

Server-rendered, indexable pages for things people already share out of the app.

**Ships**

- `/@handle` — profile pages for all five types (fan, artist, label, venue,
  record store), honouring the existing visibility rules.
- Release and song pages, with a 30-second preview for signed-out visitors.
- Event pages with lineup and venue.
- Open Graph images so a shared link looks like something.

**Why now**

Every share out of the app currently dead-ends. This turns the app's existing
social behaviour into acquisition, and it compounds — each new artist page is
another indexed entry point.

**Backend dependencies:** mostly satisfied — `get_public_profile`,
`get_profile_releases`, `get_event`, `get_profile_events`, `get_label_roster`,
`get_venue_lineup` all exist. Two gaps:

- Public reads are currently scoped for an authenticated client. The
  `20260721000001_public_reads.sql` and `20260728000000_reharden_public_read_visibility.sql`
  migrations need re-reading to confirm what the `anon` role can actually see.
- No preview-length audio endpoint. `songs-stream` requires a user and logs a
  play event; a signed-out preview needs either a separate function or a
  clip asset.

---

## Phase 3 — Admin and moderation · **Planned** · partly **Blocked**

The internal review surface. Runs as its own track — it does not block, and is
not blocked by, the parity work.

**Ships**

- Reports queue with target previews and triage (resolve / reject).
- User search with report and block counts; suspend and reinstate.
- Content actions (hide / remove a post, comment or message).
- An audit view over `admin_action_log`.

**Why it matters now**

The _capture_ side is live and has been for months — users can report posts,
profiles and messages, and those rows are accumulating in `reports` with no
surface to review them. The enums (`report_status`, `moderation_status`,
`user_status`) already describe a full triage flow. Suspended profiles are
already hidden from public reads. What is missing is only the review layer.

**Backend dependencies — this phase is blocked on new migrations:**

| Needed                                                                         | Exists? |
| ------------------------------------------------------------------------------ | ------- |
| `admin_users` table (or equivalent) + `is_super_admin()` helper                | ❌      |
| `admin_list_reports`, `admin_get_report_target`, `admin_list_users`            | ❌      |
| `admin_resolve_report`, `admin_set_moderation_status`, `admin_set_user_status` | ❌      |
| `report_comment` (closes the one capture-side gap)                             | ❌      |
| `reports` / `admin_action_log` tables, status enums                            | ✅      |

`../../mobile-app/docs/MODERATION_SUPERADMIN_PLAN.md` scopes all of this already —
it is the design doc for this phase. Building it in the backend rather than
against the service role means the mobile `SuperAdminProfile` screen (currently
a "COMING SOON" shell) can use exactly the same RPCs.

---

## Phase 4 — Creator console · **Planned**

The surface where the web genuinely beats the phone.

**Ships**

- Music upload: drag-and-drop, batch, metadata and credits editing.
- Album assembly and publishing.
- Page management: create pages, invite team members, manage roles.
- Event create and edit.
- Profile and page editing, including theme, font and banner.

**Why here**

Uploading a catalogue and typing credits on a phone is miserable. This is the
first phase where a label or an artist would choose the web over the app.

**Backend dependencies:** largely satisfied — the uploader edge functions
(`uploads-init`, `uploads-complete`, `uploads-status`, `albums-publish`) and the
page/team RPCs (`create_page`, invite flow, `get_page_members`, member
management) all exist. The upload path posts directly to S3 with a presigned
URL, which works the same from a browser.

**Notable work:** the app bundles its custom profile fonts as TTFs. The web has
to serve them instead — there is a `scripts/upload-fonts.sh` and a fonts bucket,
so the assets exist; the delivery path needs building.

---

## Phase 5 — Core app parity · **Planned**

The bulk of the work, and the point at which "web app" is a fair description.

**Ships**

- Global and per-identity feeds; post create, edit, delete; comments; likes.
- The identity switcher ("acting as"), app-wide.
- Music player: playback, queue, saved tracks, playlists.
- Swipe discovery.
- Search across profiles, songs and events.
- Calendar and event attendance.
- Follows, followers, blocks.

**Backend dependencies:** essentially all satisfied. The feed, playlist, comment,
like, follow, search, attendance and saved-track RPCs are all live.

**Notable work:** see [Where parity is not a copy](#where-parity-is-not-a-copy).

---

## Phase 6 — Messaging · **Planned**

Last, because it is self-contained and the least painful thing to do on a phone.

**Ships:** conversations, realtime messages, playlist and song shares, block
enforcement, unread state.

**Backend dependencies:** satisfied — `messaging_rekey_and_rpcs`,
`messaging_realtime_broadcast` and `messaging_block_hardening` are all in place.
Supabase Realtime works over websockets in the browser without changes.

---

## Cross-cutting decisions

Worth settling early — each one is cheap now and expensive to reverse later.

1. **Generated database types.** `supabase gen types typescript` against the
   linked project, committed and shared. Without it the web client re-types
   ~130 RPCs by hand and drifts from the schema silently.
2. **Where shared code lives.** The web and the app will both want RPC wrappers
   and domain types. Options: duplicate (simplest, drifts), a shared package
   (needs a monorepo), or generated types plus independent clients
   (recommended — least coupling for the benefit).
3. **Session strategy.** `@supabase/ssr` with cookies, and `proxy.ts` doing
   optimistic route gating only. Real authorisation stays in RLS, as it does
   today. Never trust a client-supplied role claim.
4. **Service-role key.** Ideally never used. Every privileged action should go
   through a `SECURITY DEFINER` RPC gated on `is_super_admin()` so it is
   audited and reusable. If a route ever does need the service role, it must be
   server-only and never behind a `NEXT_PUBLIC_` name.
5. **Analytics and error reporting.** The app uses Sentry; the web should match
   so incidents correlate across clients.

---

## Where parity is not a copy

Places where the mobile implementation cannot be carried across directly.

| Mobile                              | Web                                  | Notes                                                                                                                          |
| ----------------------------------- | ------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------ |
| `expo-secure-store` session         | httpOnly cookies via `@supabase/ssr` | Phase 1.                                                                                                                       |
| `react-native-video` / `expo-audio` | `<audio>`                            | Easier than expected: delivery is a single 256 kbps MP3, not HLS.                                                              |
| Presigned stream URL, 5 min TTL     | same, but seeking breaks             | A range request after the URL expires will 403. Needs re-fetch on failure, or a longer TTL. Affects any track over ~5 minutes. |
| `expo-notifications` push           | Web Push                             | Different permission model; may not be worth it initially.                                                                     |
| `react-native-maps`                 | a web map library                    | Venue and event geo. Places autocomplete already uses a Google key.                                                            |
| Bundled TTF profile fonts           | fonts served over HTTP               | Assets exist in a Supabase bucket; delivery path is new.                                                                       |
| Lockscreen / background player      | Media Session API                    | Partial equivalent at best.                                                                                                    |
| Haptics, gesture-driven swipe       | pointer and keyboard                 | Swipe discovery needs a genuine redesign for mouse and keyboard, not a port.                                                   |

---

## Suggested order, and why

Phases 1 → 2 → 3 first. That sequence is front-loaded with the things that are
cheap, unblock other work, or reduce operational risk: auth unblocks everything,
public pages turn existing sharing into growth, and admin closes a moderation
gap that widens with every new user.

Phases 4 → 5 → 6 are the long tail, ordered by how much better the web is than
the phone for each job.

Phase 3 can run in parallel with 2 and 4 if the backend migrations are picked up
by someone else, since it shares almost no surface with the rest.
