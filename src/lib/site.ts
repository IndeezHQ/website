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
  tagline: "One app for independent music",
  description:
    "Swipe through whole songs, follow the artists, labels, venues and record stores that make up your scene, and see what's on near you. Indeez is one app for independent music.",
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

export const marketingNav = [
  { href: "/#what", label: "What it is" },
  { href: "/#scene", label: "The scene" },
  { href: "/#who", label: "Who it's for" },
  { href: "/#principles", label: "Principles" },
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
    title: "Listeners",
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
