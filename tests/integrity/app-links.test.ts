import { describe, expect, it, vi } from "vitest";

import { appLinks } from "@/lib/site";

/**
 * Universal Links and App Links are verified by Apple and Google fetching
 * two files from this domain. Both platforms cache what they find, and a
 * wrong file can keep the app from claiming its own links for days, so the
 * routes serve nothing at all until the real credentials are in place.
 *
 * These tests pin that behaviour in both directions.
 */

/** Widened: appLinks is `as const`, so its empty strings are literal types. */
type Overrides = { appleTeamId?: string; androidSha256?: string };

async function routes(overrides: Overrides) {
  vi.resetModules();
  vi.doMock("@/lib/site", async () => {
    const actual =
      await vi.importActual<typeof import("@/lib/site")>("@/lib/site");
    const merged = { ...actual.appLinks, ...overrides };
    return {
      ...actual,
      appLinks: merged,
      iosAppLinksReady: Boolean(merged.appleTeamId),
      androidAppLinksReady: Boolean(merged.androidSha256),
    };
  });

  const apple =
    await import("@/app/.well-known/apple-app-site-association/route");
  const android = await import("@/app/.well-known/assetlinks.json/route");
  return { apple, android };
}

describe("while the credentials are missing", () => {
  it("serves no apple association rather than a placeholder", async () => {
    const { apple } = await routes({ appleTeamId: "" });
    expect(apple.GET().status).toBe(404);
  });

  it("serves no android association rather than a placeholder", async () => {
    const { android } = await routes({ androidSha256: "" });
    expect(android.GET().status).toBe(404);
  });
});

describe("once the credentials are in place", () => {
  it("builds the apple appID as teamId.bundleId", async () => {
    const { apple } = await routes({ appleTeamId: "ABCDE12345" });
    const body = await apple.GET().json();

    expect(body.applinks.details[0].appID).toBe("ABCDE12345.com.indeez.app");
    expect(body.applinks.details[0].paths).toContain("/song/*");
    // Apple requires the key to be present even when empty.
    expect(body.applinks.apps).toEqual([]);
  });

  it("declares the android package and fingerprint", async () => {
    const sha = "AA:BB:CC";
    const { android } = await routes({ androidSha256: sha });
    const body = await android.GET().json();

    expect(body[0].target.package_name).toBe("com.indeez.app");
    expect(body[0].target.sha256_cert_fingerprints).toEqual([sha]);
    expect(body[0].relation).toContain(
      "delegate_permission/common.handle_all_urls"
    );
  });
});

describe("the claimed paths", () => {
  it("covers song links, which is what the app shares", () => {
    expect(appLinks.paths).toContain("/song/*");
  });

  it("uses the same bundle id and package as the app", () => {
    expect(appLinks.iosBundleId).toBe("com.indeez.app");
    expect(appLinks.androidPackage).toBe("com.indeez.app");
  });
});
