import { readFile } from "node:fs/promises";
import path from "node:path";

import { ImageResponse } from "next/og";

import { site } from "@/lib/site";
import { getSongCard } from "@/lib/song";

/**
 * The card that appears when a song link is pasted into a message.
 *
 * This is the growth mechanism: the difference between a friend seeing a bare
 * URL and seeing the artwork of a track someone wanted them to hear.
 *
 * Artwork arrives as a short-lived signed URL, which cannot be handed to a
 * platform directly because they cache images for far longer than the
 * signature lasts and the preview would break later. So the bytes are
 * fetched here and inlined, and this route becomes the stable URL that gets
 * cached instead.
 */

export const alt = "A song on Indeez";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/** Platforms cache hard regardless; a day keeps a replaced cover honest. */
export const revalidate = 86400;

const asset = (...p: string[]) =>
  path.join(process.cwd(), "src", "assets", ...p);

async function fileDataUri(file: string, mime: string) {
  const bytes = await readFile(file);
  return `data:${mime};base64,${bytes.toString("base64")}`;
}

/** Null rather than throwing: a card without artwork beats no card at all. */
async function remoteDataUri(url: string | null): Promise<string | null> {
  if (!url) return null;
  try {
    const res = await fetch(url, { next: { revalidate } });
    if (!res.ok) return null;
    const type = res.headers.get("content-type") ?? "image/jpeg";
    const bytes = Buffer.from(await res.arrayBuffer());
    return `data:${type};base64,${bytes.toString("base64")}`;
  } catch {
    return null;
  }
}

export default async function Image({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const [song, regular, bold, starry, wordmark] = await Promise.all([
    getSongCard(id),
    readFile(asset("fonts", "Inter-Regular.ttf")),
    readFile(asset("fonts", "Inter-Bold.ttf")),
    fileDataUri(asset("og", "starry.jpg"), "image/jpeg"),
    fileDataUri(asset("og", "wordmark.png"), "image/png"),
  ]);

  const artwork = await remoteDataUri(song?.artworkUrl ?? null);

  const fonts = [
    {
      name: "Inter",
      data: regular,
      weight: 400 as const,
      style: "normal" as const,
    },
    {
      name: "Inter",
      data: bold,
      weight: 700 as const,
      style: "normal" as const,
    },
  ];

  const backdrop = (
    <>
      <img
        src={starry}
        alt=""
        width={size.width}
        height={size.height}
        style={{ position: "absolute", top: 0, left: 0, opacity: 0.55 }}
      />
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: size.width,
          height: size.height,
          background:
            "radial-gradient(700px 500px at 80% 35%, rgba(235,0,139,0.30), rgba(7,7,10,0) 70%)",
        }}
      />
    </>
  );

  // Unavailable or unreadable: still a branded card, never a broken one.
  if (!song) {
    return new ImageResponse(
      <div
        style={{
          width: size.width,
          height: size.height,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "#07070A",
          position: "relative",
        }}
      >
        {backdrop}
        <img src={wordmark} alt="" width={340} height={220} />
        <div
          style={{
            marginTop: 32,
            fontFamily: "Inter",
            fontWeight: 400,
            fontSize: 30,
            color: "#B8B8C7",
          }}
        >
          {site.tagline}
        </div>
      </div>,
      { ...size, fonts }
    );
  }

  return new ImageResponse(
    <div
      style={{
        width: size.width,
        height: size.height,
        display: "flex",
        alignItems: "center",
        backgroundColor: "#07070A",
        padding: 70,
        position: "relative",
      }}
    >
      {backdrop}

      {artwork ? (
        <img
          src={artwork}
          alt=""
          width={490}
          height={490}
          style={{ borderRadius: 18, objectFit: "cover" }}
        />
      ) : (
        <div
          style={{
            width: 490,
            height: 490,
            borderRadius: 18,
            backgroundColor: "#1A1A24",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontFamily: "Inter",
            fontSize: 26,
            color: "#7B7B8F",
          }}
        >
          No artwork
        </div>
      )}

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          marginLeft: 56,
          width: 524,
        }}
      >
        <img src={wordmark} alt="" width={150} height={97} />

        <div
          style={{
            marginTop: 30,
            fontFamily: "Inter",
            fontWeight: 700,
            fontSize: 58,
            lineHeight: 1.08,
            letterSpacing: -1.5,
            color: "#FFFFFF",
            // Satori has no ellipsis, so a very long title is clamped by
            // height instead. Three lines then stops.
            maxHeight: 190,
            overflow: "hidden",
          }}
        >
          {song.title}
        </div>

        <div
          style={{
            marginTop: 18,
            fontFamily: "Inter",
            fontWeight: 400,
            fontSize: 34,
            color: "#EB008B",
          }}
        >
          {song.artistName}
        </div>

        {song.label && (
          <div
            style={{
              marginTop: 10,
              fontFamily: "Inter",
              fontWeight: 400,
              fontSize: 24,
              color: "#7B7B8F",
            }}
          >
            {song.label}
          </div>
        )}
      </div>
    </div>,
    { ...size, fonts }
  );
}
