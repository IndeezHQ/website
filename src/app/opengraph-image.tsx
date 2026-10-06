import { readFile } from "node:fs/promises";
import path from "node:path";

import { ImageResponse } from "next/og";

import { site } from "@/lib/site";

/**
 * The picture that appears when someone pastes indeez.world into WhatsApp,
 * LinkedIn, Slack or a message. Without it the link renders as bare text,
 * which for a link being sent to investors is a wasted first impression.
 *
 * Generated at build time, so every asset is read off disk and inlined.
 * Nothing here may reach for a URL: during a Vercel build there is no server
 * to fetch from.
 *
 * Satori cannot read woff2, which is what next/font ships, hence the Inter
 * TTFs in src/assets/fonts. The site itself still uses next/font.
 */

export const alt = `${site.name}: ${site.tagline}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const asset = (...p: string[]) =>
  path.join(process.cwd(), "src", "assets", ...p);

async function dataUri(file: string, mime: string) {
  const bytes = await readFile(file);
  return `data:${mime};base64,${bytes.toString("base64")}`;
}

export default async function Image() {
  const [regular, bold, wordmark, starry] = await Promise.all([
    readFile(asset("fonts", "Inter-Regular.ttf")),
    readFile(asset("fonts", "Inter-Bold.ttf")),
    dataUri(asset("og", "wordmark.png"), "image/png"),
    dataUri(asset("og", "starry.jpg"), "image/jpeg"),
  ]);

  return new ImageResponse(
    <div
      style={{
        width: size.width,
        height: size.height,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        backgroundColor: "#07070A",
        padding: 84,
        position: "relative",
      }}
    >
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
            "radial-gradient(750px 520px at 78% 30%, rgba(235,0,139,0.34), rgba(7,7,10,0) 70%)",
        }}
      />

      <img src={wordmark} alt="" width={372} height={241} />

      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          marginTop: 44,
          fontFamily: "Inter",
          fontWeight: 700,
          fontSize: 62,
          lineHeight: 1.1,
          color: "#FFFFFF",
          letterSpacing: -1.5,
        }}
      >
        <span>The social network for&nbsp;</span>
        <span style={{ color: "#EB008B" }}>independent music</span>
      </div>

      <div
        style={{
          marginTop: 26,
          fontFamily: "Inter",
          fontWeight: 400,
          fontSize: 28,
          color: "#B8B8C7",
          letterSpacing: 0.5,
        }}
      >
        Artists · Labels · Venues · Record stores · Fans
      </div>
    </div>,
    {
      ...size,
      fonts: [
        { name: "Inter", data: regular, weight: 400, style: "normal" },
        { name: "Inter", data: bold, weight: 700, style: "normal" },
      ],
    }
  );
}
