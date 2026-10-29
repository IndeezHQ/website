"use client";

import { appScheme } from "@/lib/site";

/**
 * Sends the visitor into the app at this song.
 *
 * A plain link rather than a scripted redirect. Automatically bouncing people
 * to a custom scheme on load produces an "cannot open page" dialog for
 * everyone without the app installed, which is most of the traffic a share
 * link brings. Making it a button they choose avoids that entirely.
 */
export function OpenInApp({ songId }: { songId: string }) {
  return (
    <a
      href={`${appScheme}://song/${songId}`}
      className="bg-accent block w-full rounded-full px-6 py-4 text-center text-base font-medium text-white transition-opacity hover:opacity-90"
    >
      Open in Indeez
    </a>
  );
}
