import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { getSongCard } from "./song";

/**
 * The data layer behind a shared song link. Its job is to be unexciting:
 * every failure has to end as "no card", because a share link that throws is
 * worse than one that renders a plain page, and because distinguishing the
 * failures would let someone probe which song ids exist.
 */

const CARD = {
  songId: "abc",
  title: "I Wanna Go Too",
  artistName: "Astrologer",
  artistHandle: "astrologer",
  artistProfileId: "p1",
  label: "Lolipop Records",
  labelProfileId: "l1",
  artworkUrl: "https://example.test/cover.jpg",
};

function mockFetch(impl: () => Promise<unknown> | never) {
  vi.stubGlobal("fetch", vi.fn(impl));
}

function ok(body: unknown) {
  return Promise.resolve({ ok: true, json: () => Promise.resolve(body) });
}

beforeEach(() => {
  vi.stubEnv("NEXT_PUBLIC_SUPABASE_URL", "https://supabase.test");
  vi.stubEnv("NEXT_PUBLIC_SUPABASE_ANON_KEY", "anon-key");
});

afterEach(() => {
  vi.unstubAllGlobals();
  vi.unstubAllEnvs();
});

describe("getSongCard", () => {
  it("returns a normalised card for a public song", async () => {
    mockFetch(() => ok(CARD));
    await expect(getSongCard("abc")).resolves.toEqual(CARD);
  });

  it("calls the song-card function with the id and the anon key", async () => {
    const spy = vi.fn(() => ok(CARD));
    vi.stubGlobal("fetch", spy);
    await getSongCard("abc 123");

    const [url, init] = spy.mock.calls[0] as unknown as [string, RequestInit];
    expect(url).toBe(
      "https://supabase.test/functions/v1/song-card?songId=abc%20123"
    );
    expect(init.headers).toMatchObject({ apikey: "anon-key" });
  });

  it("returns null when the song is not public", async () => {
    mockFetch(() => Promise.resolve({ ok: false, status: 404 }));
    await expect(getSongCard("private")).resolves.toBeNull();
  });

  it("returns null rather than throwing when the network fails", async () => {
    mockFetch(() => Promise.reject(new Error("offline")));
    await expect(getSongCard("abc")).resolves.toBeNull();
  });

  it("returns null when the response is not json", async () => {
    mockFetch(() =>
      Promise.resolve({ ok: true, json: () => Promise.reject(new Error("!")) })
    );
    await expect(getSongCard("abc")).resolves.toBeNull();
  });

  it("rejects a payload missing the fields the page needs", async () => {
    // The function is deployed separately from this code and can drift.
    mockFetch(() => ok({ songId: "abc", artworkUrl: "x" }));
    await expect(getSongCard("abc")).resolves.toBeNull();
  });

  it("fills the optional fields with null rather than undefined", async () => {
    mockFetch(() =>
      ok({ songId: "abc", title: "T", artistName: "A", artistProfileId: "p" })
    );
    await expect(getSongCard("abc")).resolves.toMatchObject({
      label: null,
      labelProfileId: null,
      artworkUrl: null,
      artistHandle: null,
    });
  });

  it("returns null when Supabase is not configured, without calling fetch", async () => {
    vi.stubEnv("NEXT_PUBLIC_SUPABASE_URL", "");
    const spy = vi.fn();
    vi.stubGlobal("fetch", spy);

    await expect(getSongCard("abc")).resolves.toBeNull();
    expect(spy).not.toHaveBeenCalled();
  });
});
