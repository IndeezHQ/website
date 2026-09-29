import { existsSync, globSync, readFileSync } from "node:fs";
import path from "node:path";

import { describe, expect, it } from "vitest";

import nextConfig from "../../next.config";

/**
 * Every internal link on the site has to go somewhere.
 *
 * `/sign-in` and `/sign-up` shipped as 404s for a while because they were
 * linked from the header and three calls to action before the pages existed.
 * Nothing caught it: a missing route is a runtime 404, not a build error.
 * This walks the source, collects every internal href, and resolves it
 * against the routes that actually exist plus the configured redirects.
 */

/** Turns `src/app/(marketing)/privacy/page.tsx` into `/privacy`. */
function routePaths(): Set<string> {
  return new Set(
    globSync("src/app/**/page.tsx").map((file) => {
      const route = file
        .replace(/^src\/app/, "")
        .replace(/\/page\.tsx$/, "")
        // Route groups are organisational and do not appear in the URL.
        .replace(/\/\([^)]+\)/g, "");
      return route === "" ? "/" : route;
    })
  );
}

/**
 * Matches both the JSX attribute form (`href="/terms"`) and the data form
 * (`href: "/#what"`) used by the nav arrays in lib/site.ts.
 */
function internalLinks(): { file: string; href: string }[] {
  const links: { file: string; href: string }[] = [];
  for (const file of globSync("src/**/*.{ts,tsx}")) {
    const source = readFileSync(file, "utf8");
    for (const match of source.matchAll(/href[=:]\s*"(\/[^"]*)"/g)) {
      links.push({ file, href: match[1] });
    }
  }
  return links;
}

/** A link to a file, such as the polaroid frame, rather than to a page. */
function isAsset(href: string): boolean {
  return /\.[a-z0-9]{2,5}$/i.test(href.split("#")[0]);
}

const routes = routePaths();
const links = internalLinks();

async function redirectSources(): Promise<Set<string>> {
  const redirects = (await nextConfig.redirects?.()) ?? [];
  return new Set(redirects.map((r) => r.source));
}

describe("internal links resolve", () => {
  it("finds the routes and the links", () => {
    expect(routes.size).toBeGreaterThan(5);
    expect(links.length).toBeGreaterThan(5);
  });

  it("points every href at a real page", () => {
    const dead = links
      .filter(({ href }) => !isAsset(href))
      .map(({ file, href }) => ({
        file,
        href,
        // Anchors are checked separately; only the path matters here.
        pathname: href.split("#")[0] || "/",
      }))
      .filter(({ pathname }) => !routes.has(pathname));

    expect(dead.map((d) => `${d.file} -> ${d.href}`)).toEqual([]);
  });

  it("points every asset link at a file in public/", () => {
    const assets = links.filter(({ href }) => isAsset(href));
    expect(assets.length).toBeGreaterThan(0);

    const missing = assets.filter(
      ({ href }) => !existsSync(path.join("public", href))
    );
    expect(missing.map((a) => `${a.file} -> ${a.href}`)).toEqual([]);
  });

  it("points every anchor at an element that exists on the target page", () => {
    const anchors = links.filter((l) => l.href.includes("#"));
    expect(anchors.length).toBeGreaterThan(0);

    const pageSource = readFileSync("src/app/(marketing)/page.tsx", "utf8");
    const broken = anchors
      .map((l) => l.href.split("#")[1])
      .filter((id) => id && !pageSource.includes(`id="${id}"`));

    expect(broken).toEqual([]);
  });
});

describe("the old Google Sites paths still redirect", () => {
  it("keeps every published legal URL alive", async () => {
    const sources = await redirectSources();
    for (const old of [
      "/privacy-policy",
      "/terms-conditions",
      "/child-safety-standards",
      "/home",
    ]) {
      expect(
        sources,
        `${old} must redirect, it is cited in store listings`
      ).toContain(old);
    }
  });

  it("sends each redirect to a page that exists", async () => {
    const redirects = (await nextConfig.redirects?.()) ?? [];
    for (const redirect of redirects) {
      expect(routes, `${redirect.source} -> ${redirect.destination}`).toContain(
        redirect.destination
      );
    }
  });
});
