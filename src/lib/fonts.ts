import localFont from "next/font/local";

/**
 * The Indeez wordmark face, taken from the mobile app's bundled fonts
 * (Indeez/mobile-app/assets/fonts/Indeez-Regular.ttf).
 *
 * It is a ~16KB display face with a limited glyph set, so it is only ever used
 * for the wordmark itself — never for body copy, which would silently fall
 * back mid-sentence on any character the face does not carry.
 */
export const indeezWordmark = localFont({
  src: "../assets/fonts/Indeez-Regular.ttf",
  variable: "--font-indeez",
  display: "swap",
  // Never substitute this face for running text if it fails to load.
  fallback: ["var(--font-space-grotesk)", "sans-serif"],
});
