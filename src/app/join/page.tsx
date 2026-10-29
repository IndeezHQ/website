import type { Metadata } from "next";
import Link from "next/link";

import { OpenInApp } from "@/components/open-in-app";
import { ShareShell } from "@/components/share-shell";
import { StoreBadges } from "@/components/store-badges";
import { site } from "@/lib/site";

/**
 * Where a Page co-management invite link lands.
 *
 * Someone has been invited to help run an artist, label, venue or record
 * store page. The app already redeems invite codes behind auth; this is the
 * web fallback for a link opened on a desktop, or on a phone without the app.
 *
 * The copy is deliberately generic. The token in the query string is a bearer
 * credential: anyone holding the URL holds the invite. Resolving it to a page
 * name and a role would mean building an endpoint that turns a token into
 * private information, readable by anyone who intercepts or is forwarded the
 * link. The invite is worth no more than the page it opens, so the page says
 * nothing the holder does not already have.
 *
 * Nothing is redeemed here either. The button hands the token to the app and
 * redemption happens there, signed in, exactly as it does for a code typed in
 * by hand.
 */

export const metadata: Metadata = {
  title: "You have been invited to Indeez",
  description:
    "Someone has invited you to help run their page on Indeez. Open the invite in the app to accept it.",
  /*
   * The token travels in the URL, so it would otherwise be handed to every
   * site linked from this page in the Referer header, and to anything that
   * reads document.referrer. Both are stripped by this.
   */
  referrer: "no-referrer",
  // An invite link is personal and single use. It has no business in search.
  robots: { index: false, follow: false },
};

type Props = { searchParams: Promise<{ token?: string | string[] }> };

export default async function JoinPage({ searchParams }: Props) {
  const raw = (await searchParams).token;
  // A repeated ?token= gives an array. Take the first rather than failing.
  const token = (Array.isArray(raw) ? raw[0] : raw)?.trim();

  if (!token) {
    return (
      <ShareShell>
        <div className="border-line-soft bg-surface/40 rounded-3xl border p-8 text-center">
          <h1 className="text-2xl font-semibold tracking-tight">
            This invite link is incomplete
          </h1>
          <p className="text-muted mt-3 text-sm leading-relaxed">
            The code is missing from the link. Ask whoever invited you to send
            it again, or enter the code by hand in the app under &ldquo;Have an
            invite code?&rdquo;
          </p>
        </div>

        <div className="mt-8">
          <Link
            href="/"
            className="bg-accent block w-full rounded-full px-6 py-4 text-center text-base font-medium text-white transition-opacity hover:opacity-90"
          >
            Explore {site.name}
          </Link>
          <div className="mt-3">
            <StoreBadges />
          </div>
        </div>
      </ShareShell>
    );
  }

  return (
    <ShareShell>
      <div className="border-line-soft bg-surface/40 rounded-3xl border p-8 text-center">
        <p className="border-line text-muted inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs tracking-wide">
          <span className="bg-volt h-1.5 w-1.5 rounded-full" />
          Invitation
        </p>

        <h1 className="mt-5 text-2xl leading-tight font-semibold tracking-tight text-balance">
          You have been invited to join a team on Indeez
        </h1>

        <p className="text-muted mt-4 text-sm leading-relaxed">
          Someone wants you to help run their page. Open the invite in the app
          to see which page it is and accept it.
        </p>
      </div>

      <div className="mt-8">
        <OpenInApp
          path={`join?token=${encodeURIComponent(token)}`}
          lead="Open the invite in"
        />
        <div className="mt-3">
          <StoreBadges />
        </div>
        <p className="text-faint mt-4 text-center text-xs leading-relaxed">
          Already have the app? Open it and enter the code under &ldquo;Have an
          invite code?&rdquo;
        </p>
      </div>
    </ShareShell>
  );
}
