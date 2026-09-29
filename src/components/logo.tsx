import Link from "next/link";

/**
 * The animated Indeez logo.
 *
 * Source art is `public/brand/gifs/indeezLogo.gif` (418×362, 42 frames, ~1.9MB).
 * That is far too heavy to put in the header of every page, so it is shipped as
 * an animated WebP at 152×132 — the same animation at 11% of the bytes (212KB).
 * Regenerate both files with the ffmpeg commands in `docs/BRAND_ASSETS.md` if
 * the source art changes.
 *
 * The animation loops forever, so a static first frame is served to anyone who
 * has asked their system for reduced motion. `<picture>` does that selection at
 * the network level — the animated file is never fetched for those users, which
 * a CSS-based approach could not achieve.
 */
export function Logo({
  className = "h-11 w-auto",
  priority = false,
}: {
  className?: string;
  priority?: boolean;
}) {
  return (
    <Link
      href="/"
      className="inline-flex items-center transition-opacity hover:opacity-80"
    >
      {/*
        `contents` removes the <picture> box from the layout so the <img>
        becomes the flex item directly. Without it the picture is the flex
        item, its width is content-based, and Tailwind's preflight
        `max-width: 100%` on the image resolves against that — a circular
        dependency that collapses the logo to zero width.
      */}
      <picture className="contents">
        <source
          srcSet="/brand/logo-static.webp"
          media="(prefers-reduced-motion: reduce)"
          type="image/webp"
        />
        {/*
          A plain <img> rather than next/image: the Image component's optimizer
          re-encodes and would drop the animation, and `unoptimized` cannot be
          combined with the <picture> art direction above. The asset is already
          hand-optimised and served straight from /public, so there is nothing
          for the optimizer to add.
        */}
        <img
          src="/brand/logo.webp"
          alt="Indeez"
          width={152}
          height={132}
          className={`max-w-none ${className}`}
          decoding="async"
          fetchPriority={priority ? "high" : undefined}
          loading={priority ? "eager" : undefined}
        />
      </picture>
    </Link>
  );
}
