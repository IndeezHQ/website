"use client";

import { LogoImage } from "@/components/logo";
import { appScheme } from "@/lib/site";

/**
 * Sends the visitor into the app at this song.
 *
 * A plain link rather than a scripted redirect. Automatically bouncing people
 * to a custom scheme on load produces an "cannot open page" dialog for
 * everyone without the app installed, which is most of the traffic a share
 * link brings. Making it a button they choose avoids that entirely.
 *
 * The brand name is the logo itself rather than the word, so the one piece of
 * Indeez artwork on a shared song page sits on the thing we want tapped. The
 * image carries the alt text, so the button is still announced and tested as
 * "Open in Indeez".
 */
export function OpenInApp({ songId }: { songId: string }) {
  return (
    <a
      href={`${appScheme}://song/${songId}`}
      className="border-accent bg-accent/15 hover:bg-accent/25 flex w-full items-center justify-center gap-2.5 rounded-full border-2 px-6 py-3 text-base font-medium text-white transition-colors"
    >
      {/* Explicit space: the accessible name concatenates the text node
          and the image alt with no separator otherwise. */}
      Open in <LogoImage className="h-11 w-auto" alt="Indeez" />
    </a>
  );
}
