import { describe, expect, it } from "vitest";

import {
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
    // The download buttons render only when there is somewhere to send
    // people. This flag is the switch, so it must track the URLs.
    expect(appStoreLinksLive).toBe(Boolean(stores.ios || stores.android));
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
