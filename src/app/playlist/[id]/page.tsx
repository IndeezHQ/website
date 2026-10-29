import type { Metadata } from "next";
import Link from "next/link";

import { OpenInApp } from "@/components/open-in-app";
import { ShareShell } from "@/components/share-shell";
import { StoreBadges } from "@/components/store-badges";
import { getPlaylistCard } from "@/lib/playlist";
import { site } from "@/lib/site";

/**
 * The page a shared playlist link lands on. The song page's sibling: see
 * `src/app/song/[id]/page.tsx` for why this is server rendered.
 */

type Props = { params: Promise<{ id: string }> };

/** "12 tracks", but "1 track". */
function tracks(count: number) {
  return `${count} ${count === 1 ? "track" : "tracks"}`;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const playlist = await getPlaylistCard(id);

  if (!playlist) {
    return {
      title: "Playlist not available",
      robots: { index: false, follow: true },
    };
  }

  const title = `${playlist.title} by ${playlist.ownerName}`;

  return {
    title,
    description: `A playlist by ${playlist.ownerName} on Indeez. ${tracks(
      playlist.trackCount
    )}.`,
    alternates: { canonical: `${site.url}/playlist/${playlist.playlistId}` },
    openGraph: {
      // The closest OG type to a playlist. There is no music.playlist.
      type: "music.album",
      title,
      description: "Listen on Indeez.",
      url: `${site.url}/playlist/${playlist.playlistId}`,
      siteName: site.name,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description: "Listen on Indeez.",
    },
  };
}

export default async function PlaylistPage({ params }: Props) {
  const { id } = await params;
  const playlist = await getPlaylistCard(id);

  /*
   * One state for every reason a playlist is not shown: missing, unlisted,
   * a Top Five, a hidden owner, or the data service being unreachable.
   */
  if (!playlist) {
    return (
      <ShareShell>
        <div className="border-line-soft bg-surface/40 rounded-3xl border p-8 text-center">
          <h1 className="text-2xl font-semibold tracking-tight">
            This playlist is not available
          </h1>
          <p className="text-muted mt-3 text-sm leading-relaxed">
            It may have been removed, or it may be private. There is plenty more
            on Indeez.
          </p>
        </div>

        <div className="mt-8">
          <Link
            href="/"
            className="bg-accent block w-full rounded-full px-6 py-4 text-center text-base font-medium text-white transition-opacity hover:opacity-90"
          >
            Explore Indeez
          </Link>
          <div className="mt-3">
            <StoreBadges />
          </div>
        </div>
      </ShareShell>
    );
  }

  return (
    <ShareShell fitViewport>
      <div className="border-line-soft bg-surface/40 overflow-hidden rounded-3xl border">
        {playlist.coverUrl ? (
          /*
           * Plain img rather than next/image, for the same reason as the song
           * artwork: the signature changes on every fetch, so the optimiser
           * would miss its cache every time and re-proxy the file for nothing.
           */
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={playlist.coverUrl}
            alt={`Cover of ${playlist.title}`}
            className="aspect-square w-full object-cover"
          />
        ) : (
          <div className="bg-surface-2 text-faint flex aspect-square w-full items-center justify-center text-sm">
            No cover
          </div>
        )}

        <div className="p-5">
          <h1 className="text-2xl leading-tight font-semibold tracking-tight text-balance">
            {playlist.title}
          </h1>
          <p className="text-muted mt-2 text-base">
            Playlist by {playlist.ownerName}
          </p>
          <p className="text-faint mt-1 text-sm">
            {tracks(playlist.trackCount)}
          </p>
        </div>
      </div>

      <div className="mt-6">
        <OpenInApp path={`playlist/${playlist.playlistId}`} />
        <div className="mt-3">
          <StoreBadges />
        </div>
      </div>
    </ShareShell>
  );
}
