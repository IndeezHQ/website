import type { Metadata } from "next";

import { LegalDocument } from "@/components/legal-document";
import { legalDocuments, readLegalDocument } from "@/lib/legal";

const doc = legalDocuments["terms"];

export const metadata: Metadata = {
  title: doc.title,
  description: doc.summary,
};

export default async function TermsPage() {
  const { title, effective, body, slug } = await readLegalDocument("terms");

  return (
    <LegalDocument
      title={title}
      effective={effective}
      body={body}
      slug={slug}
    />
  );
}
