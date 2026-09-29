import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    /*
     * The site this replaces was a Google Site whose pages lived at
     * /home, /privacy-policy, /terms-conditions and /child-safety-standards.
     * Those paths are cited in app-store listings and in the apps themselves,
     * so they redirect rather than 404 once indeez.world points here.
     */
    return [
      { source: "/home", destination: "/", permanent: true },
      { source: "/privacy-policy", destination: "/privacy", permanent: true },
      { source: "/terms-conditions", destination: "/terms", permanent: true },
      {
        source: "/child-safety-standards",
        destination: "/child-safety",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
