/**
 * `next/font/local` is resolved by Next's compiler at build time and throws
 * when called in a plain runtime. Components that use the Indeez face import
 * it transitively through `@/lib/fonts`, so tests alias the loader to this.
 *
 * It returns the same shape the real loader does, which keeps `lib/fonts.ts`
 * itself under test rather than mocking it away.
 */
export default function localFont() {
  return {
    className: "indeez-font",
    variable: "--font-indeez",
    style: { fontFamily: "Indeez" },
  };
}
