import type { Metadata } from "next";
import Link from "next/link";

import { OpenInApp } from "./open-in-app";

import { appStoreLinksLive, site, stores } from "@/lib/site";
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

function Shell({ children }: { children: React.ReactNode }) {
  return (
    <main className="flex min-h-full flex-1 flex-col items-center justify-center px-5 py-14">
      <div className="w-full max-w-sm">{children}</div>

      <footer className="text-faint mt-14 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-xs">
        <Link href="/" className="hover:text-fg transition-colors">
          {site.domain}
        </Link>
        <Link href="/privacy" className="hover:text-fg transition-colors">
          Privacy
        </Link>
        <Link href="/terms" className="hover:text-fg transition-colors">
          Terms
        </Link>
      </footer>
    </main>
  );
}

function StoreButtons() {
  if (!appStoreLinksLive) {
    return (
      <p className="text-faint mt-4 text-center text-sm">
        The iPhone and Android apps are on their way to the stores.
      </p>
    );
  }

  return (
    <div className="mt-3 flex flex-col gap-3">
      {stores.ios && (
        <a
          href={stores.ios}
          className="border-line hover:border-fg/30 block w-full rounded-full border px-6 py-3.5 text-center text-sm font-medium transition-colors"
        >
          Download on the App Store
        </a>
      )}
      {stores.android && (
        <a
          href={stores.android}
          className="border-line hover:border-fg/30 block w-full rounded-full border px-6 py-3.5 text-center text-sm font-medium transition-colors"
        >
          Get it on Google Play
        </a>
      )}
    </div>
  );
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
      <Shell>
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
          <StoreButtons />
        </div>
      </Shell>
    );
  }

  return (
    <Shell>
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
        <OpenInApp songId={song.songId} />
        <StoreButtons />
      </div>
    </Shell>
  );
}
