import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { getPlaylistCard } from "./playlist";

/**
 * Every failure path has to end at null, because the page turns null into one
 * "not available" state. A throw here would 500 a link someone just tapped.
 */

const ENV = {
  NEXT_PUBLIC_SUPABASE_URL: "https://example.supabase.co",
  NEXT_PUBLIC_SUPABASE_ANON_KEY: "anon-key",
};

const card = {
  playlistId: "p-1",
  title: "Late shift",
  ownerName: "Astrologer",
  ownerHandle: "astrologer",
  ownerProfileId: "pr-1",
  coverUrl: "https://example.supabase.co/signed/cover.jpg",
  trackCount: 12,
};

function ok(body: unknown) {
  return { ok: true, json: async () => body } as Response;
}

beforeEach(() => {
  vi.stubEnv("NEXT_PUBLIC_SUPABASE_URL", ENV.NEXT_PUBLIC_SUPABASE_URL);
  vi.stubEnv(
    "NEXT_PUBLIC_SUPABASE_ANON_KEY",
    ENV.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );
});

afterEach(() => {
  vi.unstubAllEnvs();
  vi.restoreAllMocks();
});

describe("getPlaylistCard", () => {
  it("returns the card and calls the public edge function with the anon key", async () => {
    const spy = vi.spyOn(globalThis, "fetch").mockResolvedValue(ok(card));

    await expect(getPlaylistCard("p-1")).resolves.toEqual(card);

    const [url, init] = spy.mock.calls[0] as unknown as [string, RequestInit];
    expect(url).toBe(
      `${ENV.NEXT_PUBLIC_SUPABASE_URL}/functions/v1/playlist-card?playlistId=p-1`
    );
    expect(init.headers).toMatchObject({
      apikey: ENV.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      Authorization: `Bearer ${ENV.NEXT_PUBLIC_SUPABASE_ANON_KEY}`,
    });
  });

  it("escapes the id rather than pasting it into the query string", async () => {
    const spy = vi.spyOn(globalThis, "fetch").mockResolvedValue(ok(card));
    await getPlaylistCard("a b&c=d");
    expect(spy.mock.calls[0][0]).toContain("playlistId=a%20b%26c%3Dd");
  });

  it("returns null when the site has no Supabase configuration", async () => {
    vi.stubEnv("NEXT_PUBLIC_SUPABASE_URL", "");
    const spy = vi.spyOn(globalThis, "fetch");
    await expect(getPlaylistCard("p-1")).resolves.toBeNull();
    expect(spy).not.toHaveBeenCalled();
  });

  it("returns null on a 404, which is what a private playlist gets", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValue({ ok: false } as Response);
    await expect(getPlaylistCard("p-1")).resolves.toBeNull();
  });

  it("returns null rather than throwing when the network fails", async () => {
    vi.spyOn(globalThis, "fetch").mockRejectedValue(new Error("offline"));
    await expect(getPlaylistCard("p-1")).resolves.toBeNull();
  });

  it("returns null on a body that is not JSON", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValue({
      ok: true,
      json: async () => {
        throw new SyntaxError("not json");
      },
    } as unknown as Response);
    await expect(getPlaylistCard("p-1")).resolves.toBeNull();
  });

  it("returns null when the contract has drifted and a required field is gone", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValue(
      ok({ ...card, title: undefined })
    );
    await expect(getPlaylistCard("p-1")).resolves.toBeNull();
  });

  it("fills the optional fields rather than passing undefined to the page", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValue(
      ok({ playlistId: "p-1", title: "Late shift", ownerName: "Astrologer" })
    );
    await expect(getPlaylistCard("p-1")).resolves.toEqual({
      playlistId: "p-1",
      title: "Late shift",
      ownerName: "Astrologer",
      ownerHandle: null,
      ownerProfileId: "",
      coverUrl: null,
      trackCount: 0,
    });
  });

  it("does not trust a negative or non-numeric track count", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValue(
      ok({ ...card, trackCount: -4 })
    );
    await expect(getPlaylistCard("p-1")).resolves.toMatchObject({
      trackCount: 0,
    });
  });
});
