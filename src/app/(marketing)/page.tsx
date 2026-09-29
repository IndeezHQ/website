import Link from "next/link";

import { GetTheApp } from "@/components/get-the-app";
import { GlitchLogo } from "@/components/glitch-logo";
import { PhoneDemo } from "@/components/phone-demo";
import { SceneGraph } from "@/components/scene-graph";
import { audiences, site } from "@/lib/site";

/**
 * Every claim on this page is one the product or the Terms can back up.
 *
 * Deliberately absent: user counts, growth figures, partner logos, funding.
 * Indeez is pre-traction, and this page goes to investors and to labels — a
 * number here would have to be a real one. The page is built to persuade on
 * the strength of the idea instead, which is the honest position for a startup
 * at this stage. Do not add a stat band until there are stats.
 */

const pillars = [
  {
    title: "Swipe. Hear the whole song.",
    body: "Discovery that plays tracks in full. A song gets to make its case the way it was written, not in a thirty-second window. And nobody can buy their way in: paid placement is not permitted in Swipe.",
  },
  {
    title: "One login, every hat you wear.",
    body: "You sign in as yourself. From there you act as your artist page, your label, your venue or your store, each co-managed by the people who actually run it, with roles for who can post, edit and publish.",
  },
  {
    title: "The scene, written down.",
    body: "Labels have rosters. Venues have lineups. Stores back the artists on their shelves. Indeez records those links, so pulling one thread leads you to the rest of the scene.",
  },
  {
    title: "What is on, near you.",
    body: "Events from the artists and venues you follow, on a calendar that knows where you are. The gig on Tuesday in a 200-capacity room is the point, not an afterthought.",
  },
];

/**
 * Screen recordings from the real app. `swipe` carries the hero, so the
 * showcase covers the three surfaces the copy cannot describe as well as a
 * moving picture can: the look of the feed, how much a profile can be made
 * your own, and the player skins.
 */
const demos = [
  {
    src: "/videos/feed.mp4",
    poster: "/videos/feed.webp",
    title: "The feed",
    body: "Posts from the artists, labels, venues and stores you follow. Closer to a zine page than a grid of squares.",
    label:
      "Scrolling the Indeez feed, showing photo posts laid out like taped-down prints.",
  },
  {
    src: "/videos/profile.mp4",
    poster: "/videos/profile.webp",
    title: "Profiles worth having",
    body: "Your own banner and type, your playlists, the people you follow, and the gigs you are going to, all on one page.",
    label:
      "An Indeez profile with a custom banner, playlists, followers and upcoming events, then opening a playlist.",
  },
  {
    src: "/videos/skins.mp4",
    poster: "/videos/skins.webp",
    title: "Play it on something",
    body: "Listen to a record as a cassette, a vinyl, or clean. A small thing that makes the library feel like yours.",
    label:
      "Switching the Indeez player between default, vinyl and cassette skins.",
  },
];

/**
 * Not marketing invention — each is a clause in the Terms, cited so a reader
 * can check it. If the Terms change, this section changes with them.
 */
const principles = [
  {
    title: "No paid placement in Swipe",
    body: "Discovery is not for sale. Advertising can appear in clearly identified places elsewhere, but nobody buys their way into the deck.",
    reference: "Terms, §8",
  },
  {
    title: "Your music is not training data",
    body: "Uploading does not license your work to train a generative-AI model. That takes a separate agreement, made deliberately, by you.",
    reference: "Terms, §6",
  },
  {
    title: "You keep what you make",
    body: "Your recordings, compositions, artwork and name stay yours. We take the licence needed to run the service and nothing past it.",
    reference: "Terms, §5",
  },
];

export default function HomePage() {
  return (
    <>
      {/* ---------------------------------------------------------------- Hero */}
      <section className="relative overflow-hidden">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 -z-10"
        >
          <div className="bg-accent/20 absolute -top-40 left-1/2 h-[36rem] w-[36rem] -translate-x-1/2 rounded-full blur-[140px]" />
          <div className="bg-volt/5 absolute top-24 -right-32 h-[24rem] w-[24rem] rounded-full blur-[120px]" />
        </div>

        <div className="mx-auto w-full max-w-6xl px-5 pt-10 pb-16 sm:px-8 sm:pt-12 sm:pb-20">
          <div className="grid items-center gap-10 lg:grid-cols-[minmax(0,1fr)_17rem] lg:gap-16">
            <div>
              {/* The wordmark stands in for the eyebrow pill that used to sit
                  here: it already says "indeez", far louder. */}
              <div className="max-w-[21rem]">
                <GlitchLogo />
              </div>

              <h1 className="font-display mt-6 text-5xl leading-[1.05] tracking-tight text-balance sm:text-6xl">
                Independent music runs on{" "}
                <span className="text-accent">relationships</span>.
              </h1>

              <p className="text-muted mt-5 max-w-2xl text-lg leading-relaxed text-pretty">
                Swipe through whole songs. Follow the artists, labels, venues
                and record stores that make up your scene. See what is on near
                you this week. Indeez is one app for all of it.
              </p>

              <div className="mt-8">
                <GetTheApp />
              </div>
            </div>

            <div className="mx-auto w-full max-w-[13rem] lg:max-w-none">
              <PhoneDemo
                src="/videos/swipe.mp4"
                poster="/videos/swipe.webp"
                label="Swipe discovery in the Indeez app: a track playing in full with artwork, artist and label."
              />
            </div>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------- The gap + what it is */}
      <section id="what" className="border-line-soft scroll-mt-20 border-t">
        <div className="mx-auto w-full max-w-6xl px-5 py-20 sm:px-8 sm:py-24">
          <div className="max-w-3xl">
            <h2 className="font-display text-3xl tracking-tight text-balance sm:text-4xl">
              Nobody built for the middle
            </h2>
            <div className="text-muted mt-6 space-y-5 leading-relaxed">
              <p>
                Streaming was built for catalogue at scale. Social was built for
                attention. Neither was built for a 200-capacity room on a
                Tuesday, a label with four artists on its books, or the record
                store that puts all of them on a shelf.
              </p>
              <p>
                Independent music is where most of the culture starts, and it
                has spent a decade renting space on platforms designed for
                something else: the music on one, the audience on another, the
                gig on a third, the record on a fourth.
              </p>
              <p className="text-fg">
                Indeez is the one place all of it belongs together.
              </p>
            </div>
          </div>

          <div className="mt-16 grid gap-4 md:grid-cols-2">
            {pillars.map((pillar, i) => (
              <div
                key={pillar.title}
                className="border-line-soft bg-surface/40 hover:border-line rounded-2xl border p-7 transition-colors"
              >
                <span className="text-accent font-display text-sm">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h3 className="font-display mt-4 text-xl text-balance">
                  {pillar.title}
                </h3>
                <p className="text-muted mt-3 text-sm leading-relaxed">
                  {pillar.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------- App showcase */}
      <section id="look" className="border-line-soft scroll-mt-20 border-t">
        <div className="mx-auto w-full max-w-6xl px-5 py-20 sm:px-8 sm:py-24">
          <h2 className="font-display max-w-2xl text-3xl tracking-tight text-balance sm:text-4xl">
            What it actually looks like
          </h2>
          <p className="text-muted mt-4 max-w-2xl leading-relaxed">
            Recorded in the app, not mocked up.
          </p>

          <div className="mt-14 grid gap-10 sm:grid-cols-3 sm:gap-6 lg:gap-10">
            {demos.map((demo) => (
              <figure key={demo.src} className="mx-auto w-full max-w-[16rem]">
                <PhoneDemo
                  src={demo.src}
                  poster={demo.poster}
                  label={demo.label}
                />
                <figcaption className="mt-6">
                  <h3 className="font-display text-lg">{demo.title}</h3>
                  <p className="text-muted mt-2 text-sm leading-relaxed">
                    {demo.body}
                  </p>
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      {/* -------------------------------------------------------- The graph */}
      <section id="scene" className="border-line-soft scroll-mt-20 border-t">
        <div className="mx-auto w-full max-w-6xl px-5 py-20 sm:px-8 sm:py-24">
          <div className="grid items-center gap-14 lg:grid-cols-2 lg:gap-20">
            <div>
              <h2 className="font-display text-3xl tracking-tight text-balance sm:text-4xl">
                A scene is a network. So is Indeez.
              </h2>
              <div className="text-muted mt-6 space-y-5 leading-relaxed">
                <p>
                  Every profile is a real participant in a music scene, and the
                  links between them are the real ones. An artist is signed to a
                  label. A venue books a lineup. A store stocks a record. A
                  listener follows all of it.
                </p>
                <p>
                  Those relationships already exist offline. Indeez is where
                  they get written down, which is what turns a directory of
                  accounts into somewhere you can actually find things.
                </p>
                <p className="text-fg">
                  Follow an artist and you find their label. Open a venue and
                  you find who is playing on Friday.
                </p>
              </div>
            </div>

            <div className="border-line-soft bg-surface/30 rounded-3xl border p-6 sm:p-10">
              <SceneGraph />
            </div>
          </div>
        </div>
      </section>

      {/* ----------------------------------------------------------- Audiences */}
      <section id="who" className="border-line-soft scroll-mt-20 border-t">
        <div className="mx-auto w-full max-w-6xl px-5 py-20 sm:px-8 sm:py-24">
          <h2 className="font-display max-w-2xl text-3xl tracking-tight text-balance sm:text-4xl">
            Five ways to be on Indeez
          </h2>
          <p className="text-muted mt-4 max-w-2xl leading-relaxed">
            One account holds all of them. Sign in as a person, then act as
            whichever page the job calls for.
          </p>

          <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {audiences.map((audience) => (
              <div
                key={audience.key}
                className="border-line-soft bg-surface/40 hover:border-line rounded-2xl border p-6 transition-colors"
              >
                <h3 className="font-display text-lg">{audience.title}</h3>
                <p className="text-muted mt-2.5 text-sm leading-relaxed">
                  {audience.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---------------------------------------------------------- Principles */}
      <section
        id="principles"
        className="border-line-soft scroll-mt-20 border-t"
      >
        <div className="mx-auto w-full max-w-6xl px-5 py-20 sm:px-8 sm:py-24">
          <h2 className="font-display max-w-2xl text-3xl tracking-tight text-balance sm:text-4xl">
            Three things we put in writing
          </h2>
          <p className="text-muted mt-4 max-w-2xl leading-relaxed">
            Not slogans. Clauses. Each one is a commitment in our{" "}
            <Link
              href="/terms"
              className="text-accent underline underline-offset-4"
            >
              Terms &amp; Conditions
            </Link>
            , where you can read it in full and hold us to it.
          </p>

          <div className="mt-14 grid gap-4 lg:grid-cols-3">
            {principles.map((principle) => (
              <div
                key={principle.title}
                className="border-line-soft bg-surface/40 flex flex-col rounded-2xl border p-7"
              >
                <h3 className="font-display text-xl text-balance">
                  {principle.title}
                </h3>
                <p className="text-muted mt-3 flex-1 text-sm leading-relaxed">
                  {principle.body}
                </p>
                <p className="text-faint border-line-soft mt-5 border-t pt-4 text-xs tracking-wide">
                  {principle.reference}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ------------------------------------------------ Partners / investors */}
      <section className="border-line-soft border-t">
        <div className="mx-auto w-full max-w-6xl px-5 py-20 sm:px-8 sm:py-24">
          <div className="max-w-3xl">
            <h2 className="font-display text-3xl tracking-tight text-balance sm:text-4xl">
              Why it compounds
            </h2>
            <div className="text-muted mt-6 space-y-5 leading-relaxed">
              <p>
                Most music platforms grow one account at a time. An artist
                joining Indeez arrives already attached to a label, a venue, a
                store and an audience, and every one of those links is a reason
                for the next account to join.
              </p>
              <p>
                A catalogue can be licensed and a feed can be cloned. A map of
                who actually works with whom in independent music has to be
                built, relationship by relationship, by the people in it.
              </p>
            </div>
            <p className="mt-8">
              <a
                href={`mailto:${site.email.info}?subject=Indeez%20%E2%80%94%20partnership%20enquiry`}
                className="text-accent text-sm underline underline-offset-4"
              >
                Partnership and investor enquiries → {site.email.info}
              </a>
            </p>
          </div>
        </div>
      </section>

      {/* ---------------------------------------------------------------- CTA */}
      <section className="border-line-soft border-t">
        <div className="mx-auto w-full max-w-6xl px-5 py-20 sm:px-8 sm:py-28">
          <div className="border-line-soft from-accent/10 relative overflow-hidden rounded-3xl border bg-gradient-to-br to-transparent px-7 py-14 sm:px-14">
            <h2 className="font-display max-w-xl text-3xl tracking-tight text-balance sm:text-4xl">
              Bring your scene with you
            </h2>
            <p className="text-muted mt-4 max-w-xl leading-relaxed">
              Create an account, claim your page, and put the people you already
              work with on it.
            </p>
            <div className="mt-9">
              <GetTheApp />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
