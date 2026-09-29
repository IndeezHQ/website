"use client";

import { useEffect, useRef, useState } from "react";

/**
 * A screen recording of the mobile app, shown in a phone frame.
 *
 * Three things this handles that a bare <video autoplay loop> does not:
 *
 * 1. Nothing downloads until it is nearly on screen. Four clips is 2.3MB, and
 *    most visitors never reach the bottom of the page — `preload="none"` until
 *    the IntersectionObserver fires keeps that off the initial load.
 * 2. Playback pauses when the clip scrolls away, so offscreen video is not
 *    decoding in the background.
 * 3. Reduced-motion users get the poster frame and a real control instead of
 *    motion they did not ask for.
 *
 * Source recordings live in `media-source/videos/` and are cropped and
 * re-encoded into `public/videos/` — see docs/BRAND_ASSETS.md.
 */
export function PhoneDemo({
  src,
  poster,
  label,
}: {
  src: string;
  poster: string;
  label: string;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setReducedMotion(query.matches);
    sync();
    query.addEventListener("change", sync);
    return () => query.removeEventListener("change", sync);
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || reducedMotion) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          // Upgrade from preload="none" only once it is worth the bytes.
          if (video.preload !== "auto") video.preload = "auto";
          // Rejected autoplay is not an error worth surfacing — the poster
          // stays visible and the page is still fine.
          void video.play().catch(() => {});
        } else {
          video.pause();
        }
      },
      { threshold: 0.35 }
    );

    observer.observe(video);
    return () => observer.disconnect();
  }, [reducedMotion]);

  return (
    <div className="border-line bg-surface-2 rounded-[2rem] border p-2 shadow-2xl shadow-black/50">
      <div className="bg-bg aspect-[540/1054] overflow-hidden rounded-[1.6rem]">
        <video
          ref={videoRef}
          src={src}
          poster={poster}
          aria-label={label}
          className="h-full w-full object-cover"
          muted
          loop
          playsInline
          preload="none"
          controls={reducedMotion}
        />
      </div>
    </div>
  );
}
