import type { MetadataRoute } from "next";

import { legalDocuments } from "@/lib/legal";
import { site } from "@/lib/site";

/**
 * Only indexable pages belong here. Sign in and sign up are placeholders
 * marked `noindex`, so listing them would ask crawlers to index something we
 * have explicitly told them not to.
 *
 * The legal entries are derived from the document registry rather than typed
 * out, so publishing a new policy cannot leave it out of the sitemap. A test
 * checks the rest.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  return [
    {
      url: site.url,
      lastModified,
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${site.url}/about`,
      lastModified,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    ...Object.values(legalDocuments).map((doc) => ({
      url: `${site.url}/${doc.slug}`,
      lastModified,
      changeFrequency: "yearly" as const,
      priority: 0.5,
    })),
  ];
}
