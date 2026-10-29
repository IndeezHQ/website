import { androidAppLinksReady, appLinks } from "@/lib/site";

/**
 * The Android equivalent. Google fetches this to verify that the app signed
 * with this certificate is allowed to handle indeez.world links.
 *
 * 404s until the signing fingerprint is known, for the same reason as the
 * Apple file: a wrong fingerprint is cached and silently breaks verification.
 */
export const dynamic = "force-static";

export function GET() {
  if (!androidAppLinksReady) {
    return new Response("Not configured", { status: 404 });
  }

  return Response.json(
    [
      {
        relation: ["delegate_permission/common.handle_all_urls"],
        target: {
          namespace: "android_app",
          package_name: appLinks.androidPackage,
          sha256_cert_fingerprints: [appLinks.androidSha256],
        },
      },
    ],
    { headers: { "Content-Type": "application/json" } }
  );
}
