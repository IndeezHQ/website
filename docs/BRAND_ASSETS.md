# Brand assets

How the logo files in `public/brand/` are produced, and why they exist in the
shapes they do.

---

## The logo

| File                               | What it is                                              | Size   |
| ---------------------------------- | ------------------------------------------------------- | ------ |
| `public/brand/gifs/indeezLogo.gif` | Source art. 418×362, 42 frames, ~2.5s loop.             | 1.9 MB |
| `public/brand/logo.webp`           | Animated WebP served in the header. 152×132, 42 frames. | 212 KB |
| `public/brand/logo-static.webp`    | First frame only, for reduced-motion users. 152×132.    | 8 KB   |

The source GIF is kept in the repo because it is the master. It is **not**
served — 1.9 MB in the header of every page is not acceptable, and the animated
WebP is the same animation at 11% of the bytes.

### Regenerating

Run from the repo root after replacing the source GIF. Any recent ffmpeg with
`libwebp_anim` will do.

```bash
ffmpeg -y -i public/brand/gifs/indeezLogo.gif \
  -vf "scale=-1:132:flags=lanczos" \
  -c:v libwebp_anim -lossless 0 -q:v 72 -compression_level 6 -loop 0 -an \
  public/brand/logo.webp
```

```bash
ffmpeg -y -i public/brand/gifs/indeezLogo.gif \
  -vf "scale=-1:132:flags=lanczos" -frames:v 1 \
  -c:v libwebp -lossless 0 -q:v 80 \
  public/brand/logo-static.webp
```

Then update the `width` and `height` attributes in
`src/components/logo.tsx` if the output dimensions changed — they are what
reserves layout space before the image loads.

**Why 132px tall.** The header renders the logo at 44 CSS pixels. 132 is 3× that,
so it stays sharp on a 3× display without shipping more pixels than any screen
can use.

---

## Two things to know before changing the logo

**Reduced motion.** The animation loops forever. Anyone whose system asks for
reduced motion gets the static frame instead, selected by `<picture>` at the
network level — the animated file is never downloaded for them. If you add
another animated brand asset, give it the same treatment.

**The aspect ratio constrains the header.** The art is nearly square (418×362,
and the artwork fills the canvas — there is no padding to crop). At 44px tall it
is only 51px wide, which is as large as it goes in a 64px header. A wider,
shorter lockup would read better at small sizes; if one ever exists, prefer it
for the header and keep this one for splash and social use.

---

## The hero wordmark (glitch)

The large animated wordmark on the landing page.

| File                                   | What it is                                              | Size   |
| -------------------------------------- | ------------------------------------------------------- | ------ |
| `public/brand/gifs/glitchLogo.gif`     | Source art. 1506×975, 27 frames, ~45s loop. Not served. | 2.9 MB |
| `public/brand/glitch-logo.webp`        | Animated, 800×518. Served above 640px.                  | 695 KB |
| `public/brand/glitch-logo-sm.webp`     | Animated, 480×311. Served at 640px and below.           | 436 KB |
| `public/brand/glitch-logo-static.webp` | First frame, for reduced motion.                        | 26 KB  |

### The timing is the effect

The animation is not a steady loop. It holds the still logo for 2 to 10
seconds, glitches for two frames at 100ms, then holds again, over roughly 45
seconds. Re-encoding at a constant frame rate destroys that, so the encode
passes the per-frame durations straight through:

```bash
ffmpeg -y -i public/brand/gifs/glitchLogo.gif \
  -vf "scale=800:-1:flags=lanczos" \
  -c:v libwebp_anim -lossless 0 -q:v 62 -compression_level 4 -loop 0 \
  -fps_mode passthrough \
  public/brand/glitch-logo.webp
```

Repeat with `scale=480:-1` for the small variant, and with `-frames:v 1
-c:v libwebp -q:v 85` for the static one. Check the result with
`-fps_mode passthrough` still in place: the frame durations should read
2000, 100, 100, 5000, 100, 100 and so on.

### Why WebP and not video

The art needs real transparency over the starfield backdrop. An h264 MP4 was
tried and came out about the same size (504KB at 900px) while also needing
`mix-blend-mode: screen` to fake the transparency, which only works while the
background stays near-black. WebP keeps a real alpha channel and stays an
`<img>`.

### Why it is still large

Quality barely moves the needle: at 900px, q30 is 628KB against q60's 752KB.
The bytes are in the alpha channel and the 18 noisy glitch frames, not colour
fidelity. Dimensions are the only real lever, which is why there are two sizes.
`ffmpeg` cannot decode animated WebP back, so verify output by eye in a
browser rather than by re-extracting frames.

### On the landing page only

`SiteHeader` hides its own small logo when the pathname is `/`, so the
wordmark does not appear twice on one screen. Every other page shows the
header logo as normal.

---

## App screen recordings

Four recordings from the mobile app, used on the landing page — `swipe` in the
hero, and `feed` / `profile` / `skins` in the "What it actually looks like"
section.

| Location                    | What it holds                                                                                                                                                            |
| --------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `media-source/videos/*.mp4` | The originals, as recorded. 540×1170, with the Android status bar and nav bar still in frame. **Not served** — they live outside `public/` so they are not downloadable. |
| `public/videos/*.mp4`       | Cropped and re-encoded for the web. 540×1054, no audio track, faststart. 2.3 MB for all four.                                                                            |
| `public/videos/*.webp`      | Poster frames, ~15 KB each.                                                                                                                                              |

### What the crop removes

`crop=540:1054:0:48` takes 48px off the top and 68px off the bottom. That
removes the Android status bar — which carries a **red screen-recording
indicator** — and the Android navigation bar, while keeping the app's own tab
bar. The result reads as the app rather than as a recording of a phone.

### Regenerating

For each of `feed`, `profile`, `skins`, `swipe`:

```bash
ffmpeg -y -i media-source/videos/NAME.mp4 \
  -vf "crop=540:1054:0:48" -an \
  -c:v libx264 -profile:v high -pix_fmt yuv420p -crf 31 -preset slow \
  -movflags +faststart \
  public/videos/NAME.mp4
```

```bash
ffmpeg -y -i media-source/videos/NAME.mp4 \
  -vf "crop=540:1054:0:48,scale=270:-1" -frames:v 1 \
  -c:v libwebp -q:v 72 public/videos/NAME.webp
```

**Why CRF 31.** The originals were already compressed, so a naive re-encode came
out _larger_ than the source. CRF 31 lands just under the original bitrate and
is visually indistinguishable at 1:1 — and the clips render at roughly half
their pixel dimensions on the page, so any remaining difference is invisible.
`-movflags +faststart` puts the index at the front of the file so playback can
begin before the whole clip has arrived.

### Playback behaviour

`src/components/phone-demo.tsx` handles the parts a bare autoplaying `<video>`
gets wrong: nothing is downloaded until an IntersectionObserver says the clip is
nearly on screen, playback pauses when it scrolls away, and anyone with reduced
motion enabled gets the poster frame plus real controls instead of unrequested
movement.

### One thing to check before a public launch

`profile.mp4` shows real accounts — a real name, handle, location and photo, and
several other users in the followers list. Terms §6 grants Indeez the right to
"market Indeez using Service screenshots … names, handles" associated with
public content, so this is covered contractually. Still worth confirming those
are team or test accounts rather than members of the public who would be
surprised to find themselves on the homepage.

---

## Other brand files

| File                                  | Origin                            | Used for                                                                                                                                |
| ------------------------------------- | --------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------- |
| `src/assets/fonts/Indeez-Regular.ttf` | `../../mobile-app/assets/fonts/`  | The official face. Wired to `--font-display`, so it sets every heading on the site, plus the footer wordmark. See the constraint below. |
| `public/brand/favicon.png`            | `../../mobile-app/assets/images/` | Copied from the app.                                                                                                                    |
| `public/brand/adaptive-icon.png`      | `../../mobile-app/assets/images/` | Copied from the app.                                                                                                                    |
| `public/brand/starry.webp`            | Added by hand                     | The app's dark starfield texture, 1152×1534. The page backdrop, set in `src/app/layout.tsx`.                                            |

---

## The heading face has 73 glyphs

`Indeez-Regular.ttf` is the official face and drives `--font-display`, which
every heading on the site uses. It is a display face, not a text face, and it
carries only:

```
A-Z  a-z  0-9  space  ! " & ' , - . : ?
```

Anything else falls back to Space Grotesk silently, mid-word, which looks like
a bug rather than a choice. **Notably absent: parentheses, the slash, the
semicolon, and every currency or maths symbol.**

So a heading may not contain `( ) / ; # $ % * + < = > @ [ ] ^ _ { | } ~`. Body
copy is unaffected, since it uses Inter.

Every heading currently on the site was checked against this set and is
covered. If you add one with, say, a bracketed aside, either reword it or move
the aside into the paragraph below.

The face also ships a **single weight**. `font-bold` on a heading makes the
browser synthesise one, which smears the heavy letterforms, so headings using
`font-display` deliberately carry no weight class and rely on the face's own
heft.
