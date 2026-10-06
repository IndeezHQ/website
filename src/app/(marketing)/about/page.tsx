import type { Metadata } from "next";
import Link from "next/link";

import { audiences, site } from "@/lib/site";

/**
 * Deliberately not a restatement of the landing page. Two pages making the
 * same argument in the same words compete with each other in search and give
 * a reader nothing new. This one carries what the landing page cannot: why
 * the company exists, what is actually built today, and where it is going.
 *
 * Same rules as everywhere else: no invented traction, and nothing claimed
 * that the product or the Terms cannot back up.
 */

export const metadata: Metadata = {
  title: "About",
  description:
    "Why Indeez exists, what is built today, and where it is going. A social network for independent artists, labels, venues, record stores and fans.",
};

export default function AboutPage() {
  return (
    <div className="mx-auto w-full max-w-6xl px-5 py-20 sm:px-8 sm:py-24">
      <div className="max-w-3xl">
        <h1 className="font-display text-4xl tracking-tight text-balance sm:text-5xl">
          About Indeez
        </h1>
        <p className="text-muted mt-6 text-lg leading-relaxed text-pretty">
          Indeez is a social network for independent music. It is built for the
          artists, labels, venues and record stores that make a scene, and for
          the people who turn up to it.
        </p>
      </div>

      <div className="mt-16 grid gap-14 lg:grid-cols-[minmax(0,1fr)_18rem] lg:gap-20">
        <div className="max-w-3xl">
          <section>
            <h2 className="text-2xl font-semibold tracking-tight">
              Why this exists
            </h2>
            <div className="text-muted mt-5 space-y-5 leading-relaxed">
              <p>
                Independent music has never been short of places to be. It has
                been short of a place where all of it happens at once. The music
                sits on streaming platforms built for catalogue at scale. The
                audience sits on social platforms built for attention. The gig
                is on a ticketing site, the record is on a shop page, and the
                scene itself is in a group chat.
              </p>
              <p>
                Everyone in that picture does more work than they should to stay
                connected to everyone else. An artist keeps four presences
                current. A venue announces a show to people who will never see
                it. A label signs someone and nothing, anywhere, reflects that
                it happened.
              </p>
              <p className="text-fg">
                Indeez starts from the opposite premise: a music scene is a
                network of real relationships, and the software should know what
                they are.
              </p>
            </div>
          </section>

          <section className="mt-14">
            <h2 className="text-2xl font-semibold tracking-tight">
              What Indeez is today
            </h2>
            <div className="text-muted mt-5 space-y-5 leading-relaxed">
              <p>
                A mobile app, built and on its way to the App Store and Google
                Play. Music discovery that plays tracks in full rather than in
                thirty-second previews. Profiles that artists can make look like
                their record rather than like everyone else&rsquo;s. Uploads
                that carry real credits and splits. Events, lineups, playlists,
                messages, and a feed that reads more like a zine than a grid of
                squares.
              </p>
              <p>
                Underneath it, one idea does most of the work. You sign in as
                yourself, then act as whichever page the job calls for: your
                artist page, your label, your venue, your store. Each one is
                co-managed by the people who actually run it, with roles for who
                can post, edit and publish. Nobody shares a password.
              </p>
            </div>
          </section>

          <section className="mt-14">
            <h2 className="text-2xl font-semibold tracking-tight">
              Where it goes next
            </h2>
            <div className="text-muted mt-5 space-y-5 leading-relaxed">
              <p>
                This website becomes the other half of the product. Signing in,
                uploading a catalogue, managing pages and events, and listening
                in the browser: everything the app does, plus the things a large
                screen is simply better at. Nobody wants to type credits and
                splits on a phone.
              </p>
              <p>
                After that, the parts of the platform the Terms already
                describe: editorial, a marketplace, and the tools that let a
                scene support itself rather than export its audience somewhere
                else.
              </p>
            </div>
          </section>

          <section className="mt-14">
            <h2 className="text-2xl font-semibold tracking-tight">
              What we will not do
            </h2>
            <div className="text-muted mt-5 space-y-5 leading-relaxed">
              <p>
                Three of these are written into our{" "}
                <Link
                  href="/terms"
                  className="text-accent underline underline-offset-4"
                >
                  Terms and Conditions
                </Link>
                , not just into our marketing. Discovery is not for sale, so
                nobody can buy their way into the swipe deck. Uploading music
                does not license it to train a generative-AI model. And you keep
                ownership of everything you make.
              </p>
              <p>We would rather be held to those than be trusted on them.</p>
            </div>
          </section>

          <section className="mt-14">
            <h2 className="text-2xl font-semibold tracking-tight">
              Get in touch
            </h2>
            <div className="text-muted mt-5 space-y-3 leading-relaxed">
              <p>
                Partnerships, press and investment:{" "}
                <a
                  href={`mailto:${site.email.info}`}
                  className="text-accent underline underline-offset-4"
                >
                  {site.email.info}
                </a>
              </p>
              <p>
                Help, feedback and anything about your account:{" "}
                <a
                  href={`mailto:${site.email.support}`}
                  className="text-accent underline underline-offset-4"
                >
                  {site.email.support}
                </a>
              </p>
            </div>
          </section>
        </div>

        <aside className="lg:pt-2">
          <h2 className="text-faint text-xs font-semibold tracking-widest uppercase">
            Who it is for
          </h2>
          <ul className="mt-5 space-y-4">
            {audiences.map((audience) => (
              <li
                key={audience.key}
                className="border-line-soft border-b pb-4 last:border-0"
              >
                <p className="text-fg text-sm font-semibold">
                  {audience.title}
                </p>
                <p className="text-faint mt-1 text-sm leading-relaxed">
                  {audience.body}
                </p>
              </li>
            ))}
          </ul>
        </aside>
      </div>
    </div>
  );
}
