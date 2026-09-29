import { SceneIcon, type SceneIconName } from "@/components/scene-icons";

/**
 * The relationship graph, drawn.
 *
 * This is the hardest thing to explain in words to someone who has not seen
 * the app: that Indeez stores the real links between the participants in a
 * scene, not just a list of accounts. The nodes and edge labels mirror actual
 * relations in the schema (artist_labels, event_artists, follows), so the
 * picture is a claim the product can back up.
 *
 * Drawn as taped-down cards on slight rotations with dashed, bowed connectors
 * rather than a tidy orthogonal flowchart. A neat one reads like a slide in a
 * deck; the app's own feed looks like a scrapbook, and this should sit next to
 * it without feeling borrowed from somewhere else.
 *
 * A compact viewBox keeps it legible when it scales down to a phone rather
 * than needing a second mobile layout.
 */

type Node = {
  key: SceneIconName;
  label: string;
  x: number;
  y: number;
  rotate: number;
  tape: "left" | "right";
};

const NODES: Node[] = [
  { key: "label", label: "Label", x: 88, y: 62, rotate: -3.5, tape: "left" },
  { key: "venue", label: "Venue", x: 362, y: 62, rotate: 3, tape: "right" },
  {
    key: "record_store",
    label: "Record store",
    x: 88,
    y: 318,
    rotate: 2.5,
    tape: "right",
  },
  { key: "fan", label: "Fans", x: 362, y: 318, rotate: -3, tape: "left" },
];

const ARTIST = { x: 225, y: 190, rotate: -1.5 } as const;

/** Bowed rather than straight, so the joins read as drawn instead of plotted. */
const EDGES = [
  { d: "M225 190 Q150 140 88 62", label: "signed to", x: 153, y: 133 },
  { d: "M225 190 Q300 140 362 62", label: "plays", x: 297, y: 133 },
  { d: "M225 190 Q150 240 88 318", label: "stocked by", x: 153, y: 247 },
  { d: "M225 190 Q300 240 362 318", label: "followed by", x: 297, y: 247 },
];

const CARD_W = 158;
const CARD_H = 52;

function Card({
  label,
  icon,
  rotate,
  x,
  y,
  primary = false,
  tape = "left",
}: {
  label: string;
  icon: SceneIconName;
  rotate: number;
  x: number;
  y: number;
  primary?: boolean;
  tape?: "left" | "right";
}) {
  const tapeX = tape === "left" ? -CARD_W / 2 : CARD_W / 2;
  const tapeAngle = tape === "left" ? -35 : 35;

  return (
    <g transform={`translate(${x} ${y}) rotate(${rotate})`}>
      <rect
        x={-CARD_W / 2}
        y={-CARD_H / 2}
        width={CARD_W}
        height={CARD_H}
        rx={10}
        fill={primary ? "var(--color-accent)" : "var(--color-surface-2)"}
        stroke={primary ? "var(--color-accent)" : "var(--color-line)"}
        strokeWidth={1.5}
      />
      <SceneIcon
        name={icon}
        x={-CARD_W / 2 + 15}
        y={-11}
        width={22}
        height={22}
        style={{ color: primary ? "#ffffff" : "var(--color-volt)" }}
      />
      <text
        x={-CARD_W / 2 + 47}
        y={1}
        dominantBaseline="middle"
        fontSize={15}
        fill="#ffffff"
        style={{ fontFamily: "var(--font-display)" }}
      >
        {label}
      </text>

      {/* Tape over the corner. Drawn last: tape goes on top of the thing it
          is holding down, and behind the card it just looks like a stray tab. */}
      <g transform={`translate(${tapeX} ${-CARD_H / 2}) rotate(${tapeAngle})`}>
        <rect
          x={-23}
          y={-7}
          width={46}
          height={14}
          fill="#ffffff"
          opacity={0.14}
        />
        <rect
          x={-23}
          y={-7}
          width={46}
          height={14}
          fill="none"
          stroke="#ffffff"
          strokeOpacity={0.12}
          strokeWidth={0.75}
        />
      </g>
    </g>
  );
}

export function SceneGraph() {
  return (
    <svg
      viewBox="0 0 450 380"
      className="h-auto w-full"
      role="img"
      aria-labelledby="scene-graph-title scene-graph-desc"
    >
      <title id="scene-graph-title">How a scene connects on Indeez</title>
      <desc id="scene-graph-desc">
        An artist sits at the centre, linked to the label they are signed to,
        the venue they play, the record store that stocks them, and the fans who
        follow them.
      </desc>

      {/* Edges first, so the opaque cards cover where they meet. */}
      <g
        stroke="var(--color-faint)"
        strokeWidth={2}
        strokeDasharray="7 6"
        strokeLinecap="round"
        fill="none"
      >
        {EDGES.map((edge) => (
          <path key={edge.label} d={edge.d} />
        ))}
      </g>

      {EDGES.map((edge, i) => (
        <g
          key={edge.label}
          transform={`translate(${edge.x} ${edge.y}) rotate(${i % 2 === 0 ? -2 : 2})`}
        >
          <rect
            x={-40}
            y={-11}
            width={80}
            height={22}
            rx={11}
            fill="var(--color-bg)"
            stroke="var(--color-line-soft)"
            strokeWidth={1}
          />
          <text
            x={0}
            y={1}
            textAnchor="middle"
            dominantBaseline="middle"
            fontSize={12}
            fill="var(--color-muted)"
          >
            {edge.label}
          </text>
        </g>
      ))}

      {NODES.map((node) => (
        <Card
          key={node.key}
          label={node.label}
          icon={node.key}
          x={node.x}
          y={node.y}
          rotate={node.rotate}
          tape={node.tape}
        />
      ))}

      <Card
        label="Artist"
        icon="artist"
        x={ARTIST.x}
        y={ARTIST.y}
        rotate={ARTIST.rotate}
        tape="right"
        primary
      />
    </svg>
  );
}
