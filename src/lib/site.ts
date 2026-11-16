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
 * App store links. Both point at the real listings, which exist but are not
 * public yet: right now they return 404 to anyone who is not on the review
 * or test track.
 *
 * `appStoreLinksLive` is therefore a separate switch rather than something
 * derived from the URLs. The addresses are recorded here so nothing has to
 * be looked up on launch day, and until that flag is flipped the download
 * buttons say "coming soon" instead of sending people to an Apple 404.
 *
 * **On launch day: set `appStoreLinksLive` to true.** That is the whole
 * change. Both buttons become links across the site at once.
 */
export const stores = {
  ios: "https://apps.apple.com/app/id6802010123",
  android: "https://play.google.com/store/apps/details?id=com.indeez.app",
} as const;

export const appStoreLinksLive = false;

/**
 * Universal Links (iOS) and App Links (Android), which are what make
 * indeez.world/song/<id> open the app rather than the browser.
 *
 * Each side is served only once its own credential is present. Both are now,
 * so both files serve. That gate stays because a wrong file is worse than a
 * missing one: both platforms cache what they fetch, and a bad fingerprint
 * can keep the app from claiming its own links for days after it is fixed.
 *
 *   appleTeamId   Apple Developer account, Indeez International Inc.
 *   androidSha256 The Play **app signing** key, read from Play Console's own
 *                 Digital Asset Links block (Test and release, Setup, App
 *                 integrity, App signing). Not the upload key: they are
 *                 different certificates, they look identical, and the
 *                 upload key verifies against nothing.
 *
 * The upload key fingerprint could be listed alongside it, which would make
 * App Links verify on builds installed outside Play too. It is not here
 * because every tester installs through Play, and a fingerprint nobody needs
 * is a fingerprint nobody checks.
 */
export const appLinks = {
  iosBundleId: "com.indeez.app",
  androidPackage: "com.indeez.app",
  appleTeamId: "4TB32Q75B9",
  androidSha256:
    "3E:8E:96:EC:43:C3:28:6F:E3:41:1D:7E:E8:CB:71:EA:5C:DB:05:84:95:09:F7:A8:29:88:1B:67:C6:CB:3A:EA",
  /**
   * What the app claims, in Apple's `components` form rather than the older
   * `paths`. `/join` and `/join*` are both listed because an invite arrives
   * as `/join?token=...`, and the two forms differ in how they treat what
   * follows the path.
   *
   * `/artist/*` is deliberately absent: the app declares it, but this site
   * has no artist page yet, so claiming it would send anyone without the app
   * to a 404. Add it here when the page ships.
   */
  components: [
    { "/": "/song/*" },
    { "/": "/playlist/*" },
    { "/": "/join" },
    { "/": "/join*" },
  ],
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
