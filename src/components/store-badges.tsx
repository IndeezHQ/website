"use client";

import { useState, type SVGProps } from "react";

import { stores } from "@/lib/site";

/**
 * App Store and Google Play badges.
 *
 * Both stores are still pending, so by default these are buttons rather than
 * links: pressing one says so instead of going nowhere. Fill in `stores` in
 * lib/site.ts and the same badges become real links, with no change here.
 *
 * The marks are drawn rather than fetched so they can take the page's own
 * colour on a dark background. Before launch, swap them for Apple's and
 * Google's official badge artwork: both companies require their own files,
 * at their own proportions, in their marketing guidelines.
 */

function AppleMark(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden {...props}>
      <path d="M12.152 6.896c-.948 0-2.415-1.078-3.96-1.04-2.04.027-3.91 1.183-4.961 3.014-2.117 3.675-.546 9.103 1.519 12.09 1.013 1.454 2.208 3.09 3.792 3.039 1.52-.065 2.09-.987 3.935-.987 1.831 0 2.35.987 3.96.948 1.637-.026 2.676-1.48 3.676-2.948 1.156-1.688 1.636-3.325 1.662-3.415-.039-.013-3.182-1.221-3.22-4.857-.026-3.04 2.48-4.494 2.597-4.559-1.429-2.09-3.623-2.324-4.39-2.376-2-.156-3.675 1.09-4.61 1.09zM15.53 3.83c.843-1.012 1.4-2.427 1.245-3.83-1.207.052-2.662.805-3.532 1.818-.78.896-1.454 2.338-1.273 3.714 1.338.104 2.715-.688 3.559-1.701" />
    </svg>
  );
}

function PlayMark(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden {...props}>
      <path d="M22.018 13.298l-3.919 2.218-3.515-3.493 3.543-3.521 3.891 2.202a1.49 1.49 0 0 1 0 2.594zM1.337.924a1.486 1.486 0 0 0-.112.568v21.017c0 .217.045.419.124.6l11.155-11.087L1.337.924zm12.207 10.065l3.258-3.238L3.45.195a1.466 1.466 0 0 0-.946-.179l11.04 10.973zm0 2.067l-11 10.933c.298.036.612-.016.906-.183l13.324-7.54-3.23-3.21z" />
    </svg>
  );
}

const badges = [
  {
    key: "ios",
    Mark: AppleMark,
    lead: "Download on the",
    name: "App Store",
    href: stores.ios,
  },
  {
    key: "android",
    Mark: PlayMark,
    lead: "Get it on",
    name: "Google Play",
    href: stores.android,
  },
] as const;

/*
 * `grow basis-36` with a cap lets one component serve both homes: on the song
 * page the pair fills the narrow column, and in the landing CTA they sit at a
 * sensible badge width instead of stretching across the whole section.
 */
const face =
  "border-line hover:border-fg/30 flex max-w-48 grow basis-36 items-center justify-center gap-2.5 rounded-xl border px-3 py-2.5 text-left transition-colors";

type FaceProps = Omit<(typeof badges)[number], "key" | "href">;

function Face({ Mark, lead, name }: FaceProps) {
  return (
    <>
      <Mark className="h-6 w-6 shrink-0" />
      <span className="leading-tight">
        {/* Never wraps: in a narrow column "Download on the" broke onto a
            second line and the badge stopped looking like a badge. */}
        <span className="text-faint block text-[9px] tracking-wide whitespace-nowrap uppercase">
          {lead}
        </span>
        <span className="block text-sm font-medium">{name}</span>
      </span>
    </>
  );
}

export function StoreBadges({
  align = "center",
}: {
  /** "start" for the left-aligned pages, "center" for the share pages. */
  align?: "start" | "center";
}) {
  const [pending, setPending] = useState<string | null>(null);

  return (
    <div>
      <div
        className={`flex flex-wrap gap-3 ${align === "center" ? "justify-center" : ""}`}
      >
        {badges.map((badge) =>
          badge.href ? (
            <a key={badge.key} href={badge.href} className={face}>
              <Face Mark={badge.Mark} lead={badge.lead} name={badge.name} />
            </a>
          ) : (
            <button
              key={badge.key}
              type="button"
              onClick={() => setPending(badge.name)}
              className={face}
            >
              <Face Mark={badge.Mark} lead={badge.lead} name={badge.name} />
            </button>
          )
        )}
      </div>

      {/*
        Announced on press rather than sitting there permanently, so the
        badges read as badges. aria-live carries it to a screen reader, which
        would otherwise get no feedback at all from pressing the button.
      */}
      <p
        aria-live="polite"
        className={`text-faint mt-3 min-h-[1.25rem] text-xs ${
          align === "center" ? "text-center" : ""
        }`}
      >
        {pending && `Coming soon on ${pending}.`}
      </p>
    </div>
  );
}
