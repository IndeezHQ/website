import "server-only";

import { readFile } from "node:fs/promises";
import path from "node:path";

/**
 * The published legal documents.
 *
 * The body of each lives as Markdown in `src/content/legal/` so it reads as a
 * document and can be edited without touching JSX. The effective dates are the
 * ones the documents were published under — bump a date only when the text it
 * labels actually changes, since users rely on it to know which version they
 * agreed to.
 */
export const legalDocuments = {
  privacy: {
    slug: "privacy",
    file: "privacy.md",
    title: "Privacy Policy",
    effective: "August 18, 2026",
    summary:
      "What personal data Indeez collects, how it is used and disclosed, how long it is kept, and the choices you have.",
  },
  terms: {
    slug: "terms",
    file: "terms.md",
    title: "Terms & Conditions",
    effective: "August 18, 2026",
    summary:
      "The agreement governing your use of Indeez: accounts, your content and the licence you grant, uploads, moderation, payments and disputes.",
  },
  "child-safety": {
    slug: "child-safety",
    file: "child-safety.md",
    title: "Child Safety Standards",
    effective: "September 18, 2026",
    summary:
      "Our zero-tolerance policy on child sexual abuse and exploitation (CSAE), the safeguards we operate, and how to report a concern.",
  },
  support: {
    slug: "support",
    file: "support.md",
    title: "Support",
    effective: null,
    summary:
      "How to reach us, what we can help with, and how to delete your account and its data.",
  },
} as const;

export type LegalSlug = keyof typeof legalDocuments;

const CONTENT_DIR = path.join(process.cwd(), "src", "content", "legal");

export async function readLegalDocument(slug: LegalSlug) {
  const doc = legalDocuments[slug];
  const body = await readFile(path.join(CONTENT_DIR, doc.file), "utf8");
  return { ...doc, body };
}
