"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

import { Logo } from "@/components/logo";
import { marketingNav } from "@/lib/site";

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  /*
   * The landing page carries the big animated wordmark in its hero, so the
   * header mark would be the same logo twice within one screen. It is hidden
   * there and shown on every other page, where nothing else identifies the
   * site.
   */
  const isLandingPage = pathname === "/";

  return (
    <header className="border-line-soft bg-bg/80 sticky top-0 z-50 border-b backdrop-blur-md">
      <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between gap-6 px-5 sm:px-8">
        {isLandingPage ? <span /> : <Logo />}

        <nav
          aria-label="Main"
          className="text-muted hidden items-center gap-7 text-sm md:flex"
        >
          {marketingNav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="hover:text-fg transition-colors"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          <Link
            href="/sign-in"
            className="text-muted hover:text-fg px-2 py-2 text-sm transition-colors"
          >
            Sign in
          </Link>
          <Link
            href="/sign-up"
            className="bg-accent rounded-full px-4 py-2 text-sm font-medium text-white transition-opacity hover:opacity-90"
          >
            Create account
          </Link>
        </div>

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-controls="mobile-nav"
          className="border-line text-muted hover:text-fg inline-flex h-10 w-10 items-center justify-center rounded-lg border md:hidden"
        >
          <span className="sr-only">{open ? "Close menu" : "Open menu"}</span>
          <svg
            width="18"
            height="18"
            viewBox="0 0 18 18"
            fill="none"
            aria-hidden="true"
          >
            {open ? (
              <path
                d="M4 4l10 10M14 4L4 14"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
              />
            ) : (
              <path
                d="M2 5h14M2 9h14M2 13h14"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
              />
            )}
          </svg>
        </button>
      </div>

      {open && (
        <div
          id="mobile-nav"
          className="border-line-soft bg-bg border-t md:hidden"
        >
          <nav
            aria-label="Main"
            className="mx-auto flex max-w-6xl flex-col gap-1 px-5 py-4 sm:px-8"
          >
            {marketingNav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className="text-muted hover:text-fg py-2 text-sm transition-colors"
              >
                {item.label}
              </Link>
            ))}
            <div className="border-line-soft mt-3 flex items-center gap-3 border-t pt-4">
              <Link
                href="/sign-in"
                onClick={() => setOpen(false)}
                className="border-line text-fg flex-1 rounded-full border px-4 py-2.5 text-center text-sm"
              >
                Sign in
              </Link>
              <Link
                href="/sign-up"
                onClick={() => setOpen(false)}
                className="bg-accent flex-1 rounded-full px-4 py-2.5 text-center text-sm font-medium text-white"
              >
                Create account
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
