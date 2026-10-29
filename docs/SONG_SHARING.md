# Shareable song links

When someone shares a song from the app, the link should be a real web URL
that previews with the artwork and converts the person who taps it. This is
the website half of that.

`indeez.world/song/<songId>`

---

## What is built

| Piece                   | Where                                   | State         |
| ----------------------- | --------------------------------------- | ------------- |
| `/song/[id]` page       | `src/app/song/[id]/page.tsx`            | Done          |
| Open Graph tags         | same file, `generateMetadata`           | Done          |
| Per-song preview image  | `src/app/song/[id]/opengraph-image.tsx` | Done          |
| Data layer              | `src/lib/song.ts`                       | Done          |
| `.well-known` app links | `src/app/.well-known/`                  | Done, dormant |

## What is outstanding, and who owns it

**1. The `song-card` edge function. Backend repo. Nothing works without it.**

The page is finished and reads from an endpoint that does not exist yet, so
every song currently renders the "not available" state. The contract is
below. Until it ships, this feature is inert.

**2. Apple Team ID and the Android signing fingerprint. External.**

- Team ID: Apple Developer account, membership details.
- SHA-256: Play Console, Setup, App signing.

Drop them into `appLinks` in `src/lib/site.ts`. The two `.well-known` routes
404 until both are present and start serving the moment they are.

**3. App Store and Play Store URLs.** `stores` in `src/lib/site.ts`. The page
shows "on their way to the stores" until they are filled in, at which point
the download buttons appear on their own.

**4. The app side.** Associated Domains on iOS, an intent filter on Android,
route mapping, and switching `ShareSongSheet` from `mobileapp://song/<id>` to
`https://indeez.world/song/<id>`.

---

## The `song-card` contract

A public, anon-invokable Supabase edge function.

```
GET /functions/v1/song-card?songId=<uuid>
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

### The part that matters

The function runs as the service role, which **bypasses RLS**. It must
therefore re-implement the visibility rules rather than assume the database
will enforce them: copy the logic from `song_publicly_visible` and
`profile_visible_to_caller`. A song that is unreleased, private, or belongs
to a hidden artist must 404. Leaking a title or a cover for an unreleased
track through this endpoint would be a real failure, and the website cannot
catch it because the website is the thing being lied to.

`get_public_song` cannot be reused directly: it is granted to `authenticated`
only, and every visitor here is anonymous.

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
