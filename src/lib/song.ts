import "server-only";

/**
 * Data for a shared song page.
 *
 * The app's `get_public_song` RPC is granted to `authenticated` only, and
 * these pages are read by anonymous people arriving from a WhatsApp message,
 * so it cannot be called from here. The data comes instead from a public
 * Supabase edge function, `song-card`, which re-implements the same
 * visibility rules and signs the artwork server side.
 *
 * See docs/SHARE_PAGES.md for the contract and what is still outstanding.
 */

export type SongCard = {
  songId: string;
  title: string;
  artistName: string;
  artistHandle: string | null;
  artistProfileId: string;
  /** Display name. Null when the song is unsigned. */
  label: string | null;
  /** Set only when the label is a real profile on the platform. */
  labelProfileId: string | null;
  /** Absolute, server-signed URL. Treated as short-lived. */
  artworkUrl: string | null;
};

/**
 * How long a song card is held before being refetched.
 *
 * Titles and artwork change rarely, but a song being taken down or made
 * private has to stop being served reasonably quickly, so this is minutes
 * rather than days. The Open Graph image is cached separately and for much
 * longer, because platforms hold on to it regardless of what we ask.
 */
const REVALIDATE_SECONDS = 300;

function endpoint(): string | null {
  const base = process.env.NEXT_PUBLIC_SUPABASE_URL;
  return base ? `${base.replace(/\/$/, "")}/functions/v1/song-card` : null;
}

/**
 * Returns null for anything the public should not see: a song that does not
 * exist, is unreleased, is private, or belongs to a hidden artist. The page
 * renders the same "not available" state for all of them, deliberately, so a
 * 404 cannot be used to probe which song ids exist.
 */
export async function getSongCard(songId: string): Promise<SongCard | null> {
  const url = endpoint();
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  // Without configuration there is nothing to ask. The page still renders,
  // which keeps the route and its store links working in a preview
  // environment that has no Supabase credentials.
  if (!url || !key) return null;

  let response: Response;
  try {
    response = await fetch(`${url}?songId=${encodeURIComponent(songId)}`, {
      headers: { apikey: key, Authorization: `Bearer ${key}` },
      next: { revalidate: REVALIDATE_SECONDS },
    });
  } catch {
    // A share link that renders a plain page beats one that 500s, so a
    // network failure is treated the same as a missing song.
    return null;
  }

  if (!response.ok) return null;

  try {
    const data = (await response.json()) as Partial<SongCard>;
    // The edge function is the contract, but it is deployed separately from
    // this code and can drift. A card with no title is not worth rendering.
    if (!data?.songId || !data.title || !data.artistName) return null;

    return {
      songId: data.songId,
      title: data.title,
      artistName: data.artistName,
      artistHandle: data.artistHandle ?? null,
      artistProfileId: data.artistProfileId ?? "",
      label: data.label ?? null,
      labelProfileId: data.labelProfileId ?? null,
      artworkUrl: data.artworkUrl ?? null,
    };
  } catch {
    return null;
  }
}
