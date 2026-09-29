/**
 * The large animated wordmark that anchors the landing page hero.
 *
 * Source art is `public/brand/gifs/glitchLogo.gif` (1506×975, 27 frames,
 * ~2.9MB). The animation is mostly a still logo that glitches in short bursts:
 * a hold of 2 to 10 seconds, then two frames at 100ms, repeating over roughly
 * 45 seconds. That variable timing is the whole effect, so the encode uses
 * `-fps_mode passthrough` to carry the per-frame durations across rather than
 * resampling to a constant frame rate. See docs/BRAND_ASSETS.md.
 *
 * Shipped as animated WebP rather than video because the art needs real
 * transparency over the starfield backdrop. Two sizes are served, because at
 * ~700KB the desktop file is the heaviest thing on the page and small screens
 * have no use for those pixels.
 *
 * Only the landing page uses this; SiteHeader hides its own small logo there
 * so the wordmark does not appear twice on one screen.
 */
export function GlitchLogo() {
  return (
    <picture>
      {/* Reduced motion first: whichever source matches first wins, and a
          still frame beats a 45-second loop for anyone who asked for less
          movement. At 26KB it is also by far the cheapest. */}
      <source
        srcSet="/brand/glitch-logo-static.webp"
        media="(prefers-reduced-motion: reduce)"
        type="image/webp"
      />
      <source
        srcSet="/brand/glitch-logo-sm.webp"
        media="(max-width: 640px)"
        type="image/webp"
      />
      <img
        src="/brand/glitch-logo.webp"
        alt="Indeez"
        width={800}
        height={518}
        className="h-auto w-full max-w-none"
        decoding="async"
        fetchPriority="high"
      />
    </picture>
  );
}
