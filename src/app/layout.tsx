import type { Metadata, Viewport } from "next";
import { Inter, Space_Grotesk } from "next/font/google";

import { indeezWordmark } from "@/lib/fonts";
import { site } from "@/lib/site";

import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.name} | ${site.tagline}`,
    template: `%s | ${site.name}`,
  },
  description: site.description,
  applicationName: site.name,
  /*
   * No explicit title here on purpose. Setting one would pin every page's
   * share card to the home page title, so /about would be shared as if it
   * were the landing page. Left out, each page's own title flows through.
   */
  openGraph: {
    type: "website",
    siteName: site.name,
    description: site.description,
    url: site.url,
  },
  twitter: {
    card: "summary_large_image",
    description: site.description,
  },
};

export const viewport: Viewport = {
  themeColor: "#07070A",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${spaceGrotesk.variable} ${indeezWordmark.variable} h-full antialiased`}
    >
      <body className="bg-bg text-fg flex min-h-full flex-col font-sans">
        {/*
          Organization schema. This is what search engines read to connect the
          name, the logo and the site into one entity, which is what produces
          a brand panel rather than a plain blue link.

          `sameAs` is where the social profiles go once their URLs are settled.
        */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              name: site.name,
              url: site.url,
              logo: `${site.url}/icon.png`,
              description: site.description,
              email: site.email.info,
            }),
          }}
        />
        {/*
          The app's starfield texture, carried over as the page backdrop.

          Fixed rather than tiled: the source is 1152×1534 and its left and
          right edges do not meet (an 8× discontinuity against the natural
          pixel-to-pixel variation), so repeating it horizontally would draw a
          visible seam. A fixed layer only ever has to cover the viewport, so
          `cover` avoids repeating at all.

          Held at partial opacity deliberately. The texture averages far
          lighter than --color-bg, and at full strength it would sit lighter
          than the #111118 card surfaces — inverting the depth of every panel
          on the page. Reduced, it reads as grain over the near-black instead.

          Sits at -z-20 so it stays behind the hero's accent glows (-z-10).
        */}
        <div
          aria-hidden="true"
          className="pointer-events-none fixed inset-0 -z-20 opacity-50"
          style={{
            backgroundImage: "url(/brand/starry.webp)",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
        {children}
      </body>
    </html>
  );
}
