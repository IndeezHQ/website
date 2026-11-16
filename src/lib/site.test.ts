import { describe, expect, it } from "vitest";

import {
  appLinks,
  audiences,
  appStoreLinksLive,
  legalNav,
  marketingNav,
  site,
  stores,
} from "@/lib/site";

describe("site configuration", () => {
  it("has a canonical url and a contactable pair of addresses", () => {
    expect(site.url).toMatch(/^https?:\/\//);
    expect(site.email.support).toMatch(/@indeez\.world$/);
    expect(site.email.info).toMatch(/@indeez\.world$/);
  });

  it("keeps the store CTAs honest", () => {
    // The URLs are the real listings and are filled in ahead of launch, so
    // they cannot be the switch: both 404 publicly until release day. The
    // flag is the switch, and while it is off nothing may link out.
    if (!appStoreLinksLive) {
      expect(stores.ios).toMatch(/^https:\/\/apps\.apple\.com\//);
      expect(stores.android).toMatch(/^https:\/\/play\.google\.com\//);
    }
  });

  it("points the store links at the right app, whenever they go live", () => {
    expect(stores.android).toContain(appLinks.androidPackage);
  });

  it("does not repeat a nav destination", () => {
    for (const nav of [marketingNav, legalNav]) {
      const hrefs = nav.map((item) => item.href);
      expect(new Set(hrefs).size).toBe(hrefs.length);
    }
  });

  it("gives every nav item a label", () => {
    for (const item of [...marketingNav, ...legalNav]) {
      expect(item.label.trim().length).toBeGreaterThan(0);
    }
  });
});

describe("audiences", () => {
  it("lists exactly the five account types the backend has", () => {
    expect(audiences.map((a) => a.key).sort()).toEqual([
      "artist",
      "fan",
      "label",
      "record_store",
      "venue",
    ]);
  });

  it("gives each one a title and a body worth reading", () => {
    for (const audience of audiences) {
      expect(audience.title.trim().length).toBeGreaterThan(2);
      expect(audience.body.length).toBeGreaterThan(60);
    }
  });

  it("does not reuse a title", () => {
    const titles = audiences.map((a) => a.title);
    expect(new Set(titles).size).toBe(titles.length);
  });
});
