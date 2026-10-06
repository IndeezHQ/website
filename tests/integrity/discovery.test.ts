import { describe, expect, it } from "vitest";

import robots from "@/app/robots";
import sitemap from "@/app/sitemap";
import { legalDocuments } from "@/lib/legal";
import { site } from "@/lib/site";

/**
 * The sitemap and robots rules are easy to forget when a page is added, and
 * nothing fails if you do: the page simply never gets crawled, or worse, a
 * page marked noindex gets advertised for indexing. These assert the two
 * stay in step with the routes that actually exist.
 */

const entries = sitemap();
const urls = entries.map((e) => e.url);

/** Routes that carry `robots: { index: false }` in their page metadata. */
const NOINDEX = ["/sign-in", "/sign-up"];

describe("sitemap", () => {
  it("lists the home page first and at top priority", () => {
    expect(entries[0].url).toBe(site.url);
    expect(entries[0].priority).toBe(1);
  });

  it("lists the about page", () => {
    expect(urls).toContain(`${site.url}/about`);
  });

  it("lists every published legal document", () => {
    for (const doc of Object.values(legalDocuments)) {
      expect(urls).toContain(`${site.url}/${doc.slug}`);
    }
  });

  it("never advertises a page that is marked noindex", () => {
    for (const route of NOINDEX) {
      expect(urls).not.toContain(`${site.url}${route}`);
    }
  });

  it("uses absolute urls on the canonical host", () => {
    for (const url of urls) {
      expect(url.startsWith(`${site.url}/`) || url === site.url).toBe(true);
    }
  });

  it("does not list the same page twice", () => {
    expect(new Set(urls).size).toBe(urls.length);
  });
});

describe("robots", () => {
  const rules = robots();

  it("points crawlers at the sitemap", () => {
    expect(rules.sitemap).toBe(`${site.url}/sitemap.xml`);
  });

  it("allows the site", () => {
    expect(rules.rules).toMatchObject({ userAgent: "*", allow: "/" });
  });

  it("keeps the noindex placeholders out of crawl budget", () => {
    const disallow = (rules.rules as { disallow?: string[] }).disallow ?? [];
    for (const route of NOINDEX) expect(disallow).toContain(route);
  });
});
