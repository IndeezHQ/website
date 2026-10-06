import Link from "next/link";

import { Wordmark } from "@/components/wordmark";
import { legalNav, site, siteNav } from "@/lib/site";

export function SiteFooter() {
  return (
    <footer className="border-line-soft mt-auto border-t">
      <div className="mx-auto w-full max-w-6xl px-5 py-12 sm:px-8">
        <div className="flex flex-col gap-10 sm:flex-row sm:justify-between">
          <div className="max-w-xs">
            <Wordmark />
            <p className="text-faint mt-3 text-sm leading-relaxed">
              A music platform for independent artists, labels, venues, record
              stores and the people who listen to them.
            </p>
          </div>

          <div className="flex flex-wrap gap-12 sm:gap-16">
            <div>
              <h2 className="text-fg text-xs font-semibold tracking-widest uppercase">
                Site
              </h2>
              <ul className="mt-4 space-y-2.5">
                {siteNav.map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className="text-faint hover:text-fg text-sm transition-colors"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h2 className="text-fg text-xs font-semibold tracking-widest uppercase">
                Legal
              </h2>
              <ul className="mt-4 space-y-2.5">
                {legalNav.map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className="text-faint hover:text-fg text-sm transition-colors"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h2 className="text-fg text-xs font-semibold tracking-widest uppercase">
                Contact
              </h2>
              <ul className="mt-4 space-y-2.5">
                <li>
                  <a
                    href={`mailto:${site.email.support}`}
                    className="text-faint hover:text-fg text-sm transition-colors"
                  >
                    {site.email.support}
                  </a>
                </li>
                <li>
                  <a
                    href={`mailto:${site.email.info}`}
                    className="text-faint hover:text-fg text-sm transition-colors"
                  >
                    {site.email.info}
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <p className="text-faint border-line-soft mt-12 border-t pt-6 text-xs">
          © {new Date().getFullYear()} {site.name}. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
