import Link from "next/link";

import { appStoreLinksLive, stores } from "@/lib/site";

/**
 * The primary call to action.
 *
 * Until the store listings are live (see `stores` in lib/site.ts) this renders
 * "Create account" as the primary action and states plainly that the apps are
 * on the way, rather than showing store badges that lead nowhere. Fill in the
 * store URLs and the download buttons appear automatically.
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

        {appStoreLinksLive ? (
          <>
            {stores.ios && (
              <a
                href={stores.ios}
                className="border-line hover:border-fg/30 rounded-full border px-6 py-3 text-sm font-medium transition-colors"
              >
                Download for iPhone
              </a>
            )}
            {stores.android && (
              <a
                href={stores.android}
                className="border-line hover:border-fg/30 rounded-full border px-6 py-3 text-sm font-medium transition-colors"
              >
                Get it on Android
              </a>
            )}
          </>
        ) : (
          <Link
            href="/support"
            className="border-line hover:border-fg/30 rounded-full border px-6 py-3 text-sm font-medium transition-colors"
          >
            Talk to us
          </Link>
        )}
      </div>

      {!appStoreLinksLive && (
        <p className="text-faint text-sm">
          The iPhone and Android apps are on their way to the stores.
        </p>
      )}
    </div>
  );
}
