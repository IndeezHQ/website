import type { SVGProps } from "react";

/**
 * One icon per account type, drawn rather than pulled from an icon set so they
 * share a language with the app: heavy strokes, blunt shapes, nothing dainty.
 *
 * Keys match the account types in the backend schema. Both the relationship
 * diagram and the "five ways to be on Indeez" cards render these, so the same
 * mark always means the same kind of profile.
 *
 * Every icon is a 24x24 stroke drawing using `currentColor`, so it can be
 * dropped into HTML with a text colour or nested inside the diagram's SVG with
 * x / y / width / height.
 */
export type SceneIconName =
  "artist" | "label" | "venue" | "record_store" | "fan";

const paths: Record<SceneIconName, React.ReactNode> = {
  // Microphone.
  artist: (
    <>
      <rect x="9" y="2" width="6" height="11" rx="3" />
      <path d="M5 11a7 7 0 0 0 14 0" />
      <path d="M12 18v4" />
      <path d="M8.5 22h7" />
    </>
  ),
  // Vinyl record.
  label: (
    <>
      <circle cx="12" cy="12" r="9" />
      <circle cx="12" cy="12" r="3.25" />
      <circle cx="12" cy="12" r="1" fill="currentColor" stroke="none" />
    </>
  ),
  // Speaker cabinet.
  venue: (
    <>
      <rect x="4" y="2" width="16" height="20" rx="2" />
      <circle cx="12" cy="14.75" r="3.75" />
      <circle cx="12" cy="6.75" r="1.4" />
    </>
  ),
  // Shopfront with an awning.
  record_store: (
    <>
      <path d="M5 9 6.5 4h11L19 9" />
      <path d="M3.5 9h17" />
      <path d="M5.5 9v12h13V9" />
      <path d="M10 21v-5.5h4V21" />
    </>
  ),
  // A crowd.
  fan: (
    <>
      <circle cx="9" cy="8" r="3.4" />
      <path d="M2.5 20.5v-1.2a6.5 6.5 0 0 1 13 0v1.2" />
      <path d="M16.2 4.6a3.4 3.4 0 0 1 0 6.8" />
      <path d="M18 13.6a5.5 5.5 0 0 1 3.5 5.1v1.8" />
    </>
  ),
};

export function SceneIcon({
  name,
  ...props
}: { name: SceneIconName } & SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.9}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      {paths[name]}
    </svg>
  );
}
