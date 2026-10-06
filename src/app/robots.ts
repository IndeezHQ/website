import type { MetadataRoute } from "next";

import { site } from "@/lib/site";

/**
 * Sign in and sign up are placeholders and carry `noindex` of their own.
 * Disallowing them here too keeps them out of crawl budget entirely rather
 * than relying on a crawler fetching the page to discover it should not.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/sign-in", "/sign-up"],
    },
    sitemap: `${site.url}/sitemap.xml`,
    host: site.url,
  };
}
