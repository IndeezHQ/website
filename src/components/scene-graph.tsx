/**
 * The relationship graph, drawn.
 *
 * This is the single hardest thing to explain in words to someone who has not
 * seen the app — that Indeez stores the real links between the participants in
 * a music scene, not just a list of accounts. The node/edge labels here mirror
 * actual relations in the schema (artist_labels, event_artists, follows), so
 * the picture is a claim the product can back up.
 *
 * Sized at a compact viewBox so it stays legible when it scales down to a
 * phone rather than needing a separate mobile layout.
 */
export function SceneGraph() {
  const nodes = [
    { x: 200, y: 180, label: "Artist", primary: true },
    { x: 70, y: 55, label: "Label" },
    { x: 330, y: 55, label: "Venue" },
    { x: 70, y: 305, label: "Record store" },
    { x: 330, y: 305, label: "Listeners" },
  ];

  const edges = [
    { x: 135, y: 117, label: "signed to" },
    { x: 265, y: 117, label: "plays" },
    { x: 135, y: 242, label: "stocked by" },
    { x: 265, y: 242, label: "followed by" },
  ];

  const W = 110;
  const H = 40;

  return (
    <svg
      viewBox="0 0 400 360"
      className="h-auto w-full"
      role="img"
      aria-labelledby="scene-graph-title scene-graph-desc"
    >
      <title id="scene-graph-title">How a scene connects on Indeez</title>
      <desc id="scene-graph-desc">
        An artist sits at the centre, linked to the label they are signed to,
        the venue they play, the record store that stocks them, and the
        listeners who follow them.
      </desc>

      {/* Edges first so the opaque node fills cover where they meet. */}
      <g stroke="var(--color-line)" strokeWidth="1.5">
        {nodes.slice(1).map((n) => (
          <line key={n.label} x1={200} y1={180} x2={n.x} y2={n.y} />
        ))}
      </g>

      {edges.map((e) => (
        <g key={e.label}>
          <rect
            x={e.x - 38}
            y={e.y - 10}
            width={76}
            height={20}
            rx={10}
            fill="var(--color-bg)"
          />
          <text
            x={e.x}
            y={e.y}
            textAnchor="middle"
            dominantBaseline="central"
            fontSize="12"
            fill="var(--color-faint)"
          >
            {e.label}
          </text>
        </g>
      ))}

      {nodes.map((n) => (
        <g key={n.label}>
          <rect
            x={n.x - W / 2}
            y={n.y - H / 2}
            width={W}
            height={H}
            rx={10}
            fill={n.primary ? "var(--color-accent)" : "var(--color-surface-2)"}
            stroke={n.primary ? "var(--color-accent)" : "var(--color-line)"}
            strokeWidth="1.5"
          />
          <text
            x={n.x}
            y={n.y}
            textAnchor="middle"
            dominantBaseline="central"
            fontSize="15"
            fontWeight="600"
            fill="#ffffff"
          >
            {n.label}
          </text>
        </g>
      ))}
    </svg>
  );
}
