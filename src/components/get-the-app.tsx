import Link from "next/link";

import { StoreBadges } from "./store-badges";

/**
 * The primary call to action.
 *
 * Until the store listings are live (see `stores` in lib/site.ts) this renders
 * "Create account" as the primary action, with the store badges below saying
 * "coming soon" when pressed rather than leading nowhere. Fill in the store
 * URLs and the same badges become real links.
 */
export function GetTheApp() {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center gap-3">
        <Link
          href="/sign-up"
          className="bg-accent rounded-full px-6 py-3 text-sm font-medium text-white transition-opacity hover:opacity-90"
        >
          Create account
        </Link>

        <Link
          href="/support"
          className="border-line hover:border-fg/30 rounded-full border px-6 py-3 text-sm font-medium transition-colors"
        >
          Talk to us
        </Link>
      </div>

      <StoreBadges align="start" />
    </div>
  );
}
