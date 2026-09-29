import localFont from "next/font/local";

/**
 * The official Indeez face, taken from the mobile app's bundled fonts
 * (Indeez/mobile-app/assets/fonts/Indeez-Regular.ttf). It is wired to
 * `--font-display` in globals.css, so it sets every heading on the site.
 *
 * Headings only, never body copy. The face carries 73 glyphs: A-Z, a-z, 0-9
 * and `! " & ' , - . : ?`. Everything else falls back silently mid-word, so
 * anything using it must stay inside that set. Notably absent are parentheses,
 * the slash, and the semicolon.
 *
 * It also ships a single weight, so `font-bold` on a heading is synthesised by
 * the browser rather than drawn. Headings therefore set `font-normal` and rely
 * on the face's own heft.
 */
export const indeezWordmark = localFont({
  src: "../assets/fonts/Indeez-Regular.ttf",
  variable: "--font-indeez",
  display: "swap",
  // Never substitute this face for running text if it fails to load.
  fallback: ["var(--font-space-grotesk)", "sans-serif"],
});
