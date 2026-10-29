import { appLinks, iosAppLinksReady } from "@/lib/site";

/**
 * Apple fetches this to decide whether indeez.world/song/<id> may open the
 * app. It must be served over HTTPS as application/json, at this exact path,
 * with no file extension and no redirect.
 *
 * It 404s until the Team ID is known. Serving a placeholder would be worse:
 * Apple caches the association, and a wrong one keeps the app from claiming
 * its own links until the cache clears.
 */
export const dynamic = "force-static";

export function GET() {
  if (!iosAppLinksReady) {
    return new Response("Not configured", { status: 404 });
  }

  return Response.json(
    {
      applinks: {
        apps: [],
        details: [
          {
            appID: `${appLinks.appleTeamId}.${appLinks.iosBundleId}`,
            paths: appLinks.paths,
          },
        ],
      },
    },
    { headers: { "Content-Type": "application/json" } }
  );
}
