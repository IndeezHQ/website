import { existsSync, readFileSync } from "node:fs";
import path from "node:path";

import { describe, expect, it } from "vitest";

import { legalDocuments, type LegalSlug } from "@/lib/legal";
import { site } from "@/lib/site";

/**
 * The legal documents are verbatim ports of pages people have already agreed
 * to, and they are cited from the app stores. These guard the things that
 * would quietly break them: a missing file, a truncated port, a contact
 * address that drifts out of step with the prose, or a slug with no route.
 */

const slugs = Object.keys(legalDocuments) as LegalSlug[];
const CONTENT_DIR = path.join("src", "content", "legal");

function body(slug: LegalSlug): string {
  return readFileSync(
    path.join(CONTENT_DIR, legalDocuments[slug].file),
    "utf8"
  );
}

describe("legal documents", () => {
  it("publishes the four documents the app stores link to", () => {
    expect(slugs.sort()).toEqual([
      "child-safety",
      "privacy",
      "support",
      "terms",
    ]);
  });

  it.each(slugs)("has a file on disk for %s", (slug) => {
    expect(existsSync(path.join(CONTENT_DIR, legalDocuments[slug].file))).toBe(
      true
    );
  });

  it.each(slugs)("has a route for %s", (slug) => {
    expect(existsSync(path.join("src/app/(marketing)", slug, "page.tsx"))).toBe(
      true
    );
  });

  it.each(slugs)("has a title and a summary for %s", (slug) => {
    expect(legalDocuments[slug].title.length).toBeGreaterThan(3);
    expect(legalDocuments[slug].summary.length).toBeGreaterThan(20);
  });

  it.each(slugs)("carries the full document body for %s", (slug) => {
    // A truncated port is the failure mode worth catching; the shortest of
    // the four (Support) still runs past a thousand characters.
    expect(body(slug).length).toBeGreaterThan(900);
  });

  it.each(["privacy", "terms", "child-safety"] as LegalSlug[])(
    "states an effective date on %s",
    (slug) => {
      expect(legalDocuments[slug].effective).toMatch(
        /^[A-Z][a-z]+ \d{1,2}, \d{4}$/
      );
    }
  );

  it("does not date the Support page, which is not a dated agreement", () => {
    expect(legalDocuments.support.effective).toBeNull();
  });
});

describe("contact addresses stay in step with the prose", () => {
  it("uses the support address in the pages that tell people to write in", () => {
    for (const slug of ["support", "child-safety"] as LegalSlug[]) {
      expect(body(slug)).toContain(site.email.support);
    }
  });

  it("uses the info address for privacy requests and legal notices", () => {
    for (const slug of ["privacy", "terms"] as LegalSlug[]) {
      expect(body(slug)).toContain(site.email.info);
    }
  });
});

describe("the claims the landing page cites", () => {
  const terms = body("terms");

  // The "Three things we put in writing" section cites these by section
  // number. If the Terms are ever re-numbered or reworded, the marketing
  // page is making a claim the document no longer backs.
  it("keeps the no-paid-placement commitment in section 8", () => {
    expect(terms).toContain("## 8.");
    expect(terms).toContain("does not accept paid placement inside Swipe");
  });

  it("keeps the AI training commitment in section 6", () => {
    expect(terms).toContain("## 6.");
    expect(terms).toMatch(/does not authorize Indeez to train a generative-AI/);
  });

  it("keeps the ownership commitment in section 5", () => {
    expect(terms).toContain("## 5.");
    expect(terms).toContain("You retain ownership of your User Content");
  });
});
