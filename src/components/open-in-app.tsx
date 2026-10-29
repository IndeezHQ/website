import { LogoImage } from "./logo";

import { appScheme, site } from "@/lib/site";

/**
 * The way into the app from a share landing page.
 *
 * A link, not a scripted redirect. Bouncing a visitor to a custom scheme on
 * load shows a "cannot open page" dialog to everyone without the app, which
 * is most of the traffic a share link brings. Making it something they press
 * avoids that entirely.
 *
 * The brand name is the logo rather than the word. This is the one piece of
 * Indeez artwork on a page someone reached from a friend's message, so it
 * belongs on the thing we want pressed. The image's alt text is what keeps
 * the button announcing as "Open in Indeez".
 *
 * Still the custom scheme rather than an https link, because Universal Links
 * and App Links are not verified yet (`appLinks` in lib/site.ts). Once they
 * are, a share link opens the app before the browser ever renders this page,
 * and the button only matters to someone who got here on a desktop.
 */
export function OpenInApp({
  path,
  lead = "Open in",
}: {
  /** Path after the scheme, for example `song/<id>` or `join?token=<t>`. */
  path: string;
  lead?: string;
}) {
  return (
    <a
      href={`${appScheme}://${path}`}
      className="border-accent bg-accent/15 hover:bg-accent/25 flex w-full items-center justify-center gap-2.5 rounded-full border-2 px-6 py-3 text-base font-medium text-white transition-colors"
    >
      {/* Explicit space: the accessible name concatenates the text node and
          the image alt with no separator otherwise. */}
      {lead} <LogoImage className="h-11 w-auto" alt={site.name} />
    </a>
  );
}
