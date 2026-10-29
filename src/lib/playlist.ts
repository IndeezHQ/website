import "server-only";

/**
 * Data for a shared playlist page. The song page's sibling, and deliberately
 * the same shape: see `src/lib/song.ts` for why the data comes from a public
 * edge function rather than the app's own RPC.
 *
 * See docs/SHARE_PAGES.md for the contract and what is still outstanding.
 */

export type PlaylistCard = {
  playlistId: string;
  title: string;
  ownerName: string;
  ownerHandle: string | null;
  ownerProfileId: string;
  /** Absolute, server-signed URL. Treated as short-lived. */
  coverUrl: string | null;
  trackCount: number;
};

/** Matches the song card. A playlist that is unlisted has to stop being
 *  served quickly, and a new track should show up without a deploy. */
const REVALIDATE_SECONDS = 300;

function endpoint(): string | null {
  const base = process.env.NEXT_PUBLIC_SUPABASE_URL;
  return base ? `${base.replace(/\/$/, "")}/functions/v1/playlist-card` : null;
}

/**
 * Returns null for anything the public should not see: a playlist that does
 * not exist, is not listed, belongs to a hidden owner, or is somebody's Top
 * Five. The page renders one "not available" state for all of them, so a 404
 * cannot be used to probe which playlists exist.
 */
export async function getPlaylistCard(
  playlistId: string
): Promise<PlaylistCard | null> {
  const url = endpoint();
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !key) return null;

  let response: Response;
  try {
    response = await fetch(
      `${url}?playlistId=${encodeURIComponent(playlistId)}`,
      {
        headers: { apikey: key, Authorization: `Bearer ${key}` },
        next: { revalidate: REVALIDATE_SECONDS },
      }
    );
  } catch {
    return null;
  }

  if (!response.ok) return null;

  try {
    const data = (await response.json()) as Partial<PlaylistCard>;
    // The edge function is deployed separately from this code and can drift.
    // A card with no title is not worth rendering.
    if (!data?.playlistId || !data.title || !data.ownerName) return null;

    return {
      playlistId: data.playlistId,
      title: data.title,
      ownerName: data.ownerName,
      ownerHandle: data.ownerHandle ?? null,
      ownerProfileId: data.ownerProfileId ?? "",
      coverUrl: data.coverUrl ?? null,
      trackCount:
        typeof data.trackCount === "number" && data.trackCount >= 0
          ? data.trackCount
          : 0,
    };
  } catch {
    return null;
  }
}
