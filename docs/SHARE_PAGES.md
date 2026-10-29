# Share landing pages

When someone shares from the app, the link should be a real web URL that
previews with the artwork and converts the person who taps it. This is the
website half of that.

```
indeez.world/song/<songId>
indeez.world/playlist/<playlistId>
indeez.world/join?token=<token>
```

All three are the same page in three costumes: server rendered, Open Graph
tags in the HTML, a preview image, store badges, and a way into the app.
They share `ShareShell`, `OpenInApp` and `StoreBadges`.

---

## What is built

| Piece                      | Where                                       | State         |
| -------------------------- | ------------------------------------------- | ------------- |
| `/song/[id]` page          | `src/app/song/[id]/page.tsx`                | Live          |
| `/playlist/[id]` page      | `src/app/playlist/[id]/page.tsx`            | Needs backend |
| `/join` page               | `src/app/join/page.tsx`                     | Done          |
| Open Graph tags            | each page, `generateMetadata`               | Done          |
| Per-song preview image     | `src/app/song/[id]/opengraph-image.tsx`     | Done          |
| Per-playlist preview image | `src/app/playlist/[id]/opengraph-image.tsx` | Needs backend |
| Data layers                | `src/lib/song.ts`, `src/lib/playlist.ts`    | Done          |
| `.well-known` app links    | `src/app/.well-known/`                      | Done, dormant |

The `/join` page needs no backend at all, by design. See below.

## What is outstanding, and who owns it

**1. Deploy the playlist backend.** The song half is live. The playlist half
is written and committed in `../backend` but not deployed:

- `supabase/migrations/20261102000000_public_playlist_card.sql`, the
  `get_public_playlist_card` RPC
- `supabase/functions/playlist-card/index.ts`
- the `[functions.playlist-card] verify_jwt = false` entry in `config.toml`

Until those are applied and deployed, every playlist renders the unavailable
state, which is a safe default rather than a broken one.

**2. Apple Team ID and the Android signing fingerprint. External.**

- Team ID: Apple Developer account, membership details.
- SHA-256: Play Console, Setup, App signing.

Drop them into `appLinks` in `src/lib/site.ts`. The two `.well-known` routes
404 until both are present and start serving the moment they are.

**3. App Store and Play Store URLs.** `stores` in `src/lib/site.ts`. The page
shows "on their way to the stores" until they are filled in, at which point
the download buttons appear on their own.

**4. The app side.** Associated Domains on iOS, an intent filter on Android
covering `/song`, `/playlist` and `/join`, route mapping, and switching
`ShareSongSheet` from `mobileapp://song/<id>` to
`https://indeez.world/song/<id>`. The app also needs a `mobileapp://join`
route that opens the invite flow with the token prefilled, and a `Share a
link` option on `SharePlaylistSheet`.

---

## The card contracts

Two public, anon-invokable Supabase edge functions (`verify_jwt = false`),
each backed by an RPC that holds the visibility rules.

```
GET /functions/v1/song-card?songId=<uuid>
GET /functions/v1/playlist-card?playlistId=<uuid>
```

**200**

```json
{
  "songId": "…",
  "title": "…",
  "artistName": "…",
  "artistHandle": "…",
  "artistProfileId": "…",
  "label": "…",
  "labelProfileId": "…",
  "artworkUrl": "https://…"
}
```

**404** for anything the public must not see.

`label` is the display name, from `songs.label_name` or the linked label
profile. `labelProfileId` is set only when `songs.label_profile_id` points at
a real profile. Both may be null.

**200** from `playlist-card`

```json
{
  "playlistId": "…",
  "title": "…",
  "ownerName": "…",
  "ownerHandle": "…",
  "ownerProfileId": "…",
  "coverUrl": "https://…",
  "trackCount": 12
}
```

A playlist is shareable only when `is_listed` is true, it is not somebody's
Top Five, and the owner is visible. The Top Five exclusion matters: it is a
real playlist row created lazily for every profile, so without it every
profile would have a shareable playlist nobody made.

### The part that matters

The edge function runs as the service role, which **bypasses RLS**. The
visibility gate therefore lives in SQL, inside `get_public_song_card`, which
reuses the app's own `song_publicly_visible` and `profile_visible_to_caller`
rather than restating the rules. Two copies of a visibility rule is one copy
that eventually drifts, and the one that drifts silently is the one that
leaks.

`get_public_song` cannot be reused directly: it raises when `auth.uid()` is
null, and every visitor here is anonymous.

Artwork is signed for an hour, comfortably longer than the five minutes this
site caches the response, so a visitor served a cached card still gets a live
signature. The function asks for a 1200px transform first and falls back to
signing the original if image transformation is unavailable, logging when it
does: that add-on is not on every Supabase plan, and nothing else in the
product uses it yet.

### Testing the page before the function exists

Point the site at a stub:

```bash
NEXT_PUBLIC_SUPABASE_URL=http://localhost:54399 \
NEXT_PUBLIC_SUPABASE_ANON_KEY=stub-key \
npm run dev
```

with anything serving `/functions/v1/song-card` in the shape above. That is
how the page and the preview image in this repo were built and checked.

---

## Decisions worth knowing

**The preview image is a route, not a stored file.** Artwork lives in a
private bucket and is reached by a short-lived signed URL. Platforms cache
preview images for far longer than that signature lasts, so handing them the
signed URL directly would produce previews that work today and 404 next week.
Instead `opengraph-image.tsx` fetches the bytes server side and inlines them,
and the route becomes the stable URL platforms cache.

**It uses Next's `opengraph-image` convention, not `/og/song/<id>.jpg`.** Same
outcome, and the framework wires the meta tags and the cache key itself.

**An unavailable song returns 200, not 404.** It renders a branded page with
the store buttons, which is the point: someone tapped a friend's link and is
worth converting even when the track has gone. The page is `noindex`, so the
soft-404 concern does not apply.

**Every failure looks the same.** Missing, private, unreleased, hidden artist,
and the service being unreachable all render one state. Distinguishing them
would turn the page into an oracle for which song ids exist.

**The store badges are buttons until the stores are live.** `stores` in
lib/site.ts is empty, so pressing one says "Coming soon" rather than going
nowhere. Fill either URL in and that badge becomes a real link with no code
change. The Apple and Play marks are drawn so they can take the page's colour
on a dark background: **swap them for Apple's and Google's official badge
artwork before launch**, which both companies require in their marketing
guidelines.

**The "Open in Indeez" button carries the logo, not the word.** It is the one
piece of Indeez artwork on a page someone reached from a friend's message, so
it sits on the thing we want tapped. The image's alt text is what makes the
button still announce as "Open in Indeez".

**The invite page has no backend, and that is the design.** The token in
`/join?token=` is a bearer credential: whoever holds the URL holds the
invite. An endpoint that turned a token into a page name and a role would be
an endpoint that turns an intercepted or forwarded link into private
information, so the page says nothing the holder does not already have, and
redemption stays in the app behind auth. The token is kept out of the Referer
header by `referrer: "no-referrer"`, and out of search by `robots.ts`.

**The "Open in Indeez" button is a link, not a redirect.** Bouncing visitors
to a custom scheme on load shows a "cannot open page" dialog to everyone
without the app, which is most of the traffic a share link brings.

---

## Checking it works

- **Preview:** paste a `/song/<id>` URL into WhatsApp. Artwork, title and
  artist should appear. Facebook's Sharing Debugger and X's Card Validator
  will show what they see and let you clear their cache.
- **Deep link:** with the app installed, tapping the link opens the app at
  that song. Without it, the web page.
- **Privacy:** a private or unreleased song id must render "not available",
  with no title and no artwork anywhere in the HTML or the preview image.
