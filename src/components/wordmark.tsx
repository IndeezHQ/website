import Link from "next/link";

import { indeezWordmark } from "@/lib/fonts";

/**
 * The Indeez wordmark. Rendered as text in the brand face rather than as an
 * image so it stays crisp at any size, remains selectable, and is read aloud
 * correctly by screen readers.
 */
export function Wordmark({
  className = "",
  href = "/",
}: {
  className?: string;
  href?: string | null;
}) {
  const mark = (
    <span
      className={`${indeezWordmark.className} text-2xl leading-none tracking-wide ${className}`}
    >
      indeez
    </span>
  );

  if (href === null) return mark;

  return (
    <Link
      href={href}
      className="hover:text-accent inline-flex items-center transition-colors"
      aria-label="Indeez home"
    >
      {mark}
    </Link>
  );
}
