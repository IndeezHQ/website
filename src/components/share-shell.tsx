import Link from "next/link";

import { site } from "@/lib/site";

/**
 * The frame every share landing page sits in: song, playlist, invite.
 *
 * These pages are not the website. Someone arrives from a friend's message
 * having tapped one thing, so there is no header and no navigation to wander
 * off into, just the content, the way in, and the legal links.
 */
export function ShareShell({ children }: { children: React.ReactNode }) {
  return (
    <main className="flex min-h-full flex-1 flex-col items-center justify-center px-5 py-14">
      <div className="w-full max-w-sm">{children}</div>

      <footer className="text-faint mt-14 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-xs">
        <Link href="/" className="hover:text-fg transition-colors">
          {site.domain}
        </Link>
        <Link href="/privacy" className="hover:text-fg transition-colors">
          Privacy
        </Link>
        <Link href="/terms" className="hover:text-fg transition-colors">
          Terms
        </Link>
      </footer>
    </main>
  );
}
