/**
 * Single source of truth for site-wide constants: names, contact addresses,
 * navigation and store links.
 *
 * Contact addresses are the ones published in the legal documents — support@
 * for user-facing help and child-safety reports, info@ for privacy requests
 * and legal notices. Changing one here without changing the corresponding
 * legal document will make the two disagree, so keep them in step.
 */

export const site = {
  name: "Indeez",
  domain: "indeez.world",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://indeez.world",
  tagline: "The social network for independent music",
  description:
    "Streaming gave us all the music but none of the community. Social apps gave us the community but music was never the point. Indeez reunites the two, for independent artists, labels, venues, record stores and fans.",
  email: {
    support: "support@indeez.world",
    info: "info@indeez.world",
  },
} as const;

/**
 * App store links. The mobile app's first submission was still in flight when
 * this site was built, so these are intentionally empty — `appStoreLinksLive`
 * is false while they are, and the download CTAs render as "coming soon"
 * rather than as buttons that go nowhere. Fill both in and the UI switches
 * over on its own.
 */
export const stores = {
  ios: "",
  android: "",
} as const;

export const appStoreLinksLive = Boolean(stores.ios || stores.android);

/**
 * Universal Links (iOS) and App Links (Android), which are what make
 * indeez.world/song/<id> open the app rather than the browser.
 *
 * The bundle id and package name are the app's and are already settled. The
 * two secrets are not ours to invent:
 *
 *   appleTeamId   from the Apple Developer account
 *   androidSha256 from the Play Console app signing page
 *
 * Until both are filled in, the two .well-known files 404 rather than serving
 * a malformed association. A wrong file is worse than a missing one: Apple
 * and Google cache these aggressively, and a bad fingerprint can take days to
 * clear once they have fetched it.
 */
export const appLinks = {
  iosBundleId: "com.indeez.app",
  androidPackage: "com.indeez.app",
  appleTeamId: "",
  androidSha256: "",
  /** Paths the app claims. Keep in step with the routes that exist. */
  paths: ["/song/*", "/artist/*", "/playlist/*"],
} as const;

/**
 * The app's custom URL scheme. Used by the "Open in Indeez" button, which has
 * to work today, before Universal Links are verified. Once they are, a share
 * link opens the app directly and this button only matters to someone who
 * reached the page in a browser.
 */
export const appScheme = "mobileapp";

export const iosAppLinksReady = Boolean(appLinks.appleTeamId);
export const androidAppLinksReady = Boolean(appLinks.androidSha256);

export const marketingNav = [
  { href: "/#what", label: "What it is" },
  { href: "/#look", label: "See it" },
  { href: "/#scene", label: "The scene" },
  { href: "/#who", label: "Who it's for" },
  { href: "/#principles", label: "Principles" },
] as const;

/**
 * The "Site" column in the footer. About is deliberately not in the header:
 * the landing page should sell, and someone who wants the company behind it
 * goes looking at the bottom of the page. It is linked directly when the site
 * is sent to investors.
 */
export const siteNav = [
  { href: "/about", label: "About" },
  { href: "/sign-in", label: "Sign in" },
  { href: "/sign-up", label: "Create account" },
] as const;

export const legalNav = [
  { href: "/privacy", label: "Privacy Policy" },
  { href: "/terms", label: "Terms & Conditions" },
  { href: "/child-safety", label: "Child Safety Standards" },
  { href: "/support", label: "Support" },
] as const;

/**
 * The five identities a person can hold on the platform. These mirror the
 * account types in the backend schema (fan / artist / label / venue /
 * record_store) — the marketing copy should not invent a sixth.
 */
export const audiences = [
  {
    key: "fan",
    title: "Fans",
    body: "Whole songs, not hooks. Follow the artists you actually play, find out where they are playing next, and keep your library, playlists and the people you listen to in one place.",
  },
  {
    key: "artist",
    title: "Artists",
    body: "A profile that can look like your record rather than everyone else's. Upload with real credits and splits, run your page alongside your manager and label, and reach people who opened the app to find something new.",
  },
  {
    key: "label",
    title: "Labels",
    body: "Your whole roster under one page, run by your team with roles that match who actually does what. Sign an artist and the connection shows on both profiles.",
  },
  {
    key: "venue",
    title: "Venues",
    body: "Publish what's on and put your lineup in front of the people already following those artists. Anyone nearby can find your room before the night rather than after it.",
  },
  {
    key: "record_store",
    title: "Record stores",
    body: "Stay part of the scene you stock. Post in-stores, back the local artists on your shelves, and be findable to people browsing nearby.",
  },
] as const;
