import type { Metadata } from "next";
import Link from "next/link";

import { OpenInApp } from "@/components/open-in-app";
import { ShareShell } from "@/components/share-shell";
import { StoreBadges } from "@/components/store-badges";
import { site } from "@/lib/site";
import { getSongCard } from "@/lib/song";

/**
 * The page a shared song link lands on.
 *
 * Server rendered, because the whole point is the Open Graph tags: link
 * preview crawlers do not run JavaScript, so anything client side arrives as
 * a blank card.
 *
 * Kept to one screen. Someone arrives here from a message, having tapped a
 * friend's recommendation, and the only question worth asking them is whether
 * they want to hear it.
 */

type Props = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const song = await getSongCard(id);

  if (!song) {
    return {
      title: "Song not available",
      robots: { index: false, follow: true },
    };
  }

  const title = `${song.title} by ${song.artistName}`;

  return {
    title,
    description: `Listen to ${song.title} by ${song.artistName} on Indeez.`,
    alternates: { canonical: `${site.url}/song/${song.songId}` },
    openGraph: {
      // Tells the platforms this is a track rather than a generic page.
      type: "music.song",
      title,
      description: "Listen on Indeez.",
      url: `${site.url}/song/${song.songId}`,
      siteName: site.name,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description: "Listen on Indeez.",
    },
  };
}

export default async function SongPage({ params }: Props) {
  const { id } = await params;
  const song = await getSongCard(id);

  /*
   * One state for every reason a song is not shown: missing, private,
   * unreleased, hidden artist, or the data service being unreachable.
   * Distinguishing them would let someone probe which song ids exist.
   */
  if (!song) {
    return (
      <ShareShell>
        <div className="border-line-soft bg-surface/40 rounded-3xl border p-8 text-center">
          <h1 className="text-2xl font-semibold tracking-tight">
            This song is not available
          </h1>
          <p className="text-muted mt-3 text-sm leading-relaxed">
            It may have been removed, or it may not be public yet. There is
            plenty more on Indeez.
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
    <ShareShell>
      <div className="border-line-soft bg-surface/40 overflow-hidden rounded-3xl border">
        {song.artworkUrl ? (
          /*
           * Plain img rather than next/image. The source is a signed Supabase
           * URL: the host would have to be allow-listed, and because the
           * signature changes on every fetch the optimiser would miss its
           * cache every single time and re-proxy the file for no benefit.
           */
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={song.artworkUrl}
            alt={`Artwork for ${song.title} by ${song.artistName}`}
            className="aspect-square w-full object-cover"
          />
        ) : (
          <div className="bg-surface-2 text-faint flex aspect-square w-full items-center justify-center text-sm">
            No artwork
          </div>
        )}

        <div className="p-6">
          <h1 className="text-2xl leading-tight font-semibold tracking-tight text-balance">
            {song.title}
          </h1>
          <p className="text-muted mt-2 text-base">{song.artistName}</p>
          {song.label && (
            <p className="text-faint mt-1 text-sm">{song.label}</p>
          )}
        </div>
      </div>

      <div className="mt-8">
        <OpenInApp path={`song/${song.songId}`} />
        <div className="mt-3">
          <StoreBadges />
        </div>
      </div>
    </ShareShell>
  );
}
