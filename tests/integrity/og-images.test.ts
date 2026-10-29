// @vitest-environment node
import { afterEach, describe, expect, it, vi } from "vitest";

/**
 * Every link preview image has to actually render.
 *
 * These are the one part of the site a build cannot check. Satori, which
 * draws them, has rules the TypeScript compiler knows nothing about, the
 * strictest being that an element with more than one child needs an explicit
 * `display`. A bare text node sitting beside an expression counts as two
 * children, so `Playlist by {name}` throws at request time and nowhere else.
 * The playlist card shipped exactly that and only a manual fetch caught it.
 *
 * They also guard the size. The cards shipped as 550KB to 880KB PNGs, which
 * is over WhatsApp's preview limit, so no image appeared anywhere while
 * every tag read perfectly. That is why the budget is asserted here rather
 * than trusted to the encoder.
 *
 * Rendering is slow, a second or two per image, which is the price of the
 * only test that would have caught either.
 */

const JPEG_MAGIC = Buffer.from([0xff, 0xd8, 0xff]);

/**
 * WhatsApp will not download a preview image much over 300KB. It reads the
 * tags, decides the image is too big, and shows a bare title, which is what
 * shipped while every tag looked perfect. 280KB leaves a little room.
 */
const MAX_BYTES = 280_000;

/** Satori renders lazily, so a layout error surfaces on reading the body. */
async function render(response: Response) {
  const bytes = Buffer.from(await response.arrayBuffer());
  expect(bytes.subarray(0, 3)).toEqual(JPEG_MAGIC);
  expect(bytes.byteLength).toBeGreaterThan(1000);
  expect(bytes.byteLength).toBeLessThan(MAX_BYTES);
  return bytes;
}

function stubCard(body: unknown | null) {
  vi.stubEnv("NEXT_PUBLIC_SUPABASE_URL", "https://stub.supabase.co");
  vi.stubEnv("NEXT_PUBLIC_SUPABASE_ANON_KEY", "stub-key");
  vi.spyOn(globalThis, "fetch").mockImplementation(async (input) => {
    // The card endpoint. Artwork fetches are a separate concern: let them
    // fail, because the image has to render without artwork anyway.
    if (String(input).includes("/functions/v1/")) {
      return body
        ? ({ ok: true, json: async () => body } as Response)
        : ({ ok: false } as Response);
    }
    throw new Error("no artwork in this test");
  });
}

afterEach(() => {
  vi.unstubAllEnvs();
  vi.restoreAllMocks();
});

describe("link preview images", () => {
  it("renders the site card", async () => {
    const { default: Image } = await import("@/app/opengraph-image");
    await render(await Image());
  }, 20000);

  it("renders a song card", async () => {
    stubCard({
      songId: "s-1",
      title: "Out of Control",
      artistName: "Astrologer",
      artistHandle: "astrologer",
      artistProfileId: "p-1",
      label: "Lolipop Records",
      labelProfileId: null,
      artworkUrl: null,
    });
    const { default: Image } = await import("@/app/song/[id]/opengraph-image");
    await render(await Image({ params: Promise.resolve({ id: "s-1" }) }));
  }, 20000);

  it("renders a playlist card, track count and owner included", async () => {
    stubCard({
      playlistId: "pl-1",
      title: "Sunday service",
      ownerName: "Lolipop Records",
      ownerHandle: "lolipop",
      ownerProfileId: "p-1",
      coverUrl: null,
      trackCount: 17,
    });
    const { default: Image } =
      await import("@/app/playlist/[id]/opengraph-image");
    await render(await Image({ params: Promise.resolve({ id: "pl-1" }) }));
  }, 20000);

  it("renders a single track without tripping the plural", async () => {
    stubCard({
      playlistId: "pl-2",
      title: "One",
      ownerName: "Someone",
      ownerHandle: null,
      ownerProfileId: "p-1",
      coverUrl: null,
      trackCount: 1,
    });
    const { default: Image } =
      await import("@/app/playlist/[id]/opengraph-image");
    await render(await Image({ params: Promise.resolve({ id: "pl-2" }) }));
  }, 20000);

  it("renders the fallback card when there is nothing to show", async () => {
    // The branch an unavailable or taken down link lands on.
    for (const path of [
      "@/app/song/[id]/opengraph-image",
      "@/app/playlist/[id]/opengraph-image",
    ]) {
      stubCard(null);
      const { default: Image } = await import(path);
      await render(await Image({ params: Promise.resolve({ id: "x" }) }));
      vi.restoreAllMocks();
    }
  }, 30000);
});
