import type { Metadata } from "next";

import { LegalDocument } from "@/components/legal-document";
import { legalDocuments, readLegalDocument } from "@/lib/legal";

const doc = legalDocuments["support"];

export const metadata: Metadata = {
  title: doc.title,
  description: doc.summary,
};

export default async function SupportPage() {
  const { title, effective, body, slug } = await readLegalDocument("support");

  return (
    <LegalDocument
      title={title}
      effective={effective}
      body={body}
      slug={slug}
    />
  );
}
