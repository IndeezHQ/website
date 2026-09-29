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

## Other brand files

| File                                  | Origin                            | Used for                                                                                                         |
| ------------------------------------- | --------------------------------- | ---------------------------------------------------------------------------------------------------------------- |
| `src/assets/fonts/Indeez-Regular.ttf` | `../../mobile-app/assets/fonts/`  | The text wordmark in the footer. A ~16KB display face with a limited glyph set — wordmark only, never body copy. |
| `public/brand/favicon.png`            | `../../mobile-app/assets/images/` | Copied from the app.                                                                                             |
| `public/brand/adaptive-icon.png`      | `../../mobile-app/assets/images/` | Copied from the app.                                                                                             |
