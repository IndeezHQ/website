import Link from "next/link";
import Markdown from "react-markdown";

import { legalNav } from "@/lib/site";

/**
 * Shared shell for the four published legal documents.
 *
 * The Markdown is repo-owned and trusted, so it is rendered without
 * sanitisation; nothing user-submitted is ever passed through here. Raw HTML
 * is not enabled, which keeps that true even if someone pastes a tag into the
 * source document.
 */
export function LegalDocument({
  title,
  effective,
  body,
  slug,
}: {
  title: string;
  effective: string | null;
  body: string;
  slug: string;
}) {
  return (
    <div className="mx-auto w-full max-w-6xl px-5 py-16 sm:px-8 sm:py-20">
      <div className="lg:grid lg:grid-cols-[14rem_minmax(0,1fr)] lg:gap-16">
        {/* Sibling documents — a reader checking one policy usually wants the
            others within reach. */}
        <nav aria-label="Legal documents" className="mb-12 lg:mb-0">
          <div className="lg:sticky lg:top-24">
            <h2 className="text-faint text-xs font-semibold tracking-widest uppercase">
              Legal
            </h2>
            <ul className="mt-4 space-y-1">
              {legalNav.map((item) => {
                const active = item.href === `/${slug}`;
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      aria-current={active ? "page" : undefined}
                      className={`block rounded-lg px-3 py-2 text-sm transition-colors ${
                        active
                          ? "bg-surface-2 text-fg"
                          : "text-faint hover:text-fg"
                      }`}
                    >
                      {item.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        </nav>

        <article className="min-w-0">
          <header className="border-line-soft border-b pb-8">
            <h1 className="font-display text-4xl font-bold tracking-tight text-balance sm:text-5xl">
              {title}
            </h1>
            {effective && (
              <p className="text-faint mt-4 text-sm">Effective {effective}</p>
            )}
          </header>

          <div className="legal-prose mt-10 max-w-3xl">
            <Markdown>{body}</Markdown>
          </div>
        </article>
      </div>
    </div>
  );
}
