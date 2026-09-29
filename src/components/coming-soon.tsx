import Link from "next/link";

import { appStoreLinksLive, site } from "@/lib/site";

/**
 * Placeholder for the routes the header already links to but that Phase 1
 * has not built yet (see docs/ROADMAP.md).
 *
 * These exist so "Sign in" and "Create account" land somewhere deliberate
 * instead of a 404, which matters while the site is being shown to people.
 * Both are marked noindex by their pages: a coming-soon page ranking for
 * "Indeez sign in" would be worse than no page at all.
 */
export function ComingSoon({ title, body }: { title: string; body: string }) {
  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col items-start px-5 py-24 sm:px-8 sm:py-32">
      <p className="border-line text-muted inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs tracking-wide">
        <span className="bg-volt h-1.5 w-1.5 rounded-full" />
        Coming soon
      </p>

      <h1 className="font-display mt-6 max-w-2xl text-4xl leading-[1.05] tracking-tight text-balance sm:text-5xl">
        {title}
      </h1>

      <p className="text-muted mt-5 max-w-xl leading-relaxed text-pretty">
        {body}
      </p>

      <div className="mt-10 flex flex-wrap items-center gap-3">
        <Link
          href="/"
          className="bg-accent rounded-full px-6 py-3 text-sm font-medium text-white transition-opacity hover:opacity-90"
        >
          Back to the site
        </Link>
        <a
          href={`mailto:${site.email.support}`}
          className="border-line hover:border-fg/30 rounded-full border px-6 py-3 text-sm font-medium transition-colors"
        >
          Talk to us
        </a>
      </div>

      {!appStoreLinksLive && (
        <p className="text-faint mt-6 text-sm">
          The iPhone and Android apps are on their way to the stores.
        </p>
      )}
    </div>
  );
}
