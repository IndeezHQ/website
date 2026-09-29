import { SceneIcon, type SceneIconName } from "@/components/scene-icons";

/**
 * The relationship graph, drawn as a wall of polaroids.
 *
 * This shows what a scene looks like on Indeez: the artist at the centre, and
 * the label, venue, record store and fans around them, joined by the
 * relationships that actually exist between those people. It is the picture
 * of the platform, including the parts still being built.
 *
 * A tidy orthogonal flowchart reads like a slide in a deck. The app's own feed
 * is a scrapbook of taped-down prints, so this is pinned photographs with the
 * type written on the caption strip, joined by dashed lines.
 */

/**
 * Where things sit inside `poloroid.png`, measured off the 500x500 source and
 * stored as fractions so they hold at any render size. The frame is
 * photographed at a slight angle, so these are the centre of the photo window
 * and the centre of the white caption strip beneath it, not a tidy grid.
 */
const FRAME = {
  windowX: 0.536,
  windowY: 0.428,
  captionX: 0.54,
  captionY: 0.836,
};

type Node = {
  key: SceneIconName;
  label: string;
  x: number;
  y: number;
  rotate: number;
};

const NODES: Node[] = [
  { key: "label", label: "Label", x: 82, y: 86, rotate: -4 },
  { key: "venue", label: "Venue", x: 418, y: 86, rotate: 3 },
  { key: "record_store", label: "Record store", x: 82, y: 364, rotate: 2.5 },
  { key: "fan", label: "Fans", x: 418, y: 364, rotate: -3 },
];

const ARTIST = { x: 250, y: 225, rotate: -1 };

/**
 * Every line is bowed rather than straight, so the joins read as drawn
 * instead of plotted. The four that meet the artist are the hub; the three
 * around the edge are the relationships that skip the middle.
 *
 * There is no line between label and venue: a label reaches a room through
 * its artists, so that corner stays open on purpose.
 */
const EDGES = [
  // Hub: everything that runs through the artist.
  { d: "M250 225 Q160 150 82 86", label: "signed to", x: 163, y: 153 },
  { d: "M250 225 Q340 150 418 86", label: "plays", x: 337, y: 153 },
  { d: "M250 225 Q160 300 82 364", label: "stocked by", x: 163, y: 297 },
  { d: "M250 225 Q340 300 418 364", label: "followed by", x: 337, y: 297 },
  // Perimeter: relationships that do not need the artist in the middle.
  { d: "M82 150 Q64 225 82 300", label: "supplies", x: 73, y: 225 },
  { d: "M140 364 Q250 382 360 364", label: "buys from", x: 250, y: 373 },
  { d: "M418 150 Q436 225 418 300", label: "attending", x: 427, y: 225 },
];

const SIZE = 132;
const ARTIST_SIZE = 148;

function Polaroid({
  label,
  icon,
  x,
  y,
  rotate,
  size = SIZE,
  primary = false,
}: {
  label: string;
  icon: SceneIconName;
  x: number;
  y: number;
  rotate: number;
  size?: number;
  primary?: boolean;
}) {
  const iconSize = size * 0.26;

  return (
    <g transform={`translate(${x} ${y}) rotate(${rotate})`}>
      <image
        href="/brand/poloroid.png"
        x={-size / 2}
        y={-size / 2}
        width={size}
        height={size}
      />
      <SceneIcon
        name={icon}
        x={size * (FRAME.windowX - 0.5) - iconSize / 2}
        y={size * (FRAME.windowY - 0.5) - iconSize / 2}
        width={iconSize}
        height={iconSize}
        style={{ color: primary ? "var(--color-accent)" : "var(--color-volt)" }}
      />
      {/* Written on the caption strip, so this is dark type on white paper
          rather than the light-on-dark used everywhere else on the page. */}
      <text
        x={size * (FRAME.captionX - 0.5)}
        y={size * (FRAME.captionY - 0.5)}
        textAnchor="middle"
        dominantBaseline="middle"
        fontSize={size * 0.088}
        fill={primary ? "var(--color-accent)" : "#15151c"}
        style={{ fontFamily: "var(--font-display)" }}
      >
        {label}
      </text>
    </g>
  );
}

export function SceneGraph() {
  return (
    <svg
      viewBox="0 0 500 450"
      className="h-auto w-full"
      role="img"
      aria-labelledby="scene-graph-title scene-graph-desc"
    >
      <title id="scene-graph-title">How a scene connects on Indeez</title>
      <desc id="scene-graph-desc">
        An artist sits at the centre, linked to the label they are signed to,
        the venue they play, the record store that stocks them, and the fans who
        follow them. Around the edge, the label supplies the record store, fans
        buy from it, and fans attend the venue.
      </desc>

      {/* Lines first, so the photographs cover where they meet. */}
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
            x={-38}
            y={-11}
            width={76}
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
        <Polaroid
          key={node.key}
          label={node.label}
          icon={node.key}
          x={node.x}
          y={node.y}
          rotate={node.rotate}
        />
      ))}

      <Polaroid
        label="Artist"
        icon="artist"
        x={ARTIST.x}
        y={ARTIST.y}
        rotate={ARTIST.rotate}
        size={ARTIST_SIZE}
        primary
      />
    </svg>
  );
}
