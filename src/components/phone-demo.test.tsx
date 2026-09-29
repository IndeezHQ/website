import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { PhoneDemo } from "./phone-demo";

function setReducedMotion(reduce: boolean) {
  vi.mocked(window.matchMedia).mockImplementation(
    (query: string) =>
      ({
        matches: reduce && query.includes("prefers-reduced-motion"),
        media: query,
        onchange: null,
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        addListener: vi.fn(),
        removeListener: vi.fn(),
        dispatchEvent: vi.fn(),
      }) as unknown as MediaQueryList
  );
}

const props = {
  src: "/videos/swipe.mp4",
  poster: "/videos/swipe.webp",
  label: "Swipe discovery in the Indeez app",
};

beforeEach(() => setReducedMotion(false));

describe("PhoneDemo", () => {
  it("downloads nothing until the clip is nearly on screen", () => {
    render(<PhoneDemo {...props} />);
    // Four clips is over 2MB. preload must stay off until the observer says
    // otherwise, or every visitor pays for video they never scroll to.
    expect(screen.getByLabelText(props.label)).toHaveAttribute(
      "preload",
      "none"
    );
  });

  it("shows a poster frame so the space is never blank", () => {
    render(<PhoneDemo {...props} />);
    expect(screen.getByLabelText(props.label)).toHaveAttribute(
      "poster",
      props.poster
    );
  });

  it("plays silently and inline, which is what autoplay policies require", () => {
    render(<PhoneDemo {...props} />);
    const video = screen.getByLabelText(props.label) as HTMLVideoElement;

    expect(video.muted).toBe(true);
    expect(video.loop).toBe(true);
    expect(video).toHaveAttribute("playsinline");
  });

  it("watches for the clip entering the viewport", () => {
    const observe = vi.fn();
    vi.stubGlobal(
      "IntersectionObserver",
      class {
        observe = observe;
        unobserve = vi.fn();
        disconnect = vi.fn();
        takeRecords = vi.fn(() => []);
        root = null;
        rootMargin = "";
        thresholds = [];
      }
    );

    render(<PhoneDemo {...props} />);
    expect(observe).toHaveBeenCalledOnce();
  });

  it("offers controls instead of motion when reduced motion is set", () => {
    setReducedMotion(true);
    render(<PhoneDemo {...props} />);
    expect(screen.getByLabelText(props.label)).toHaveAttribute("controls");
  });

  it("does not show controls otherwise, since the clip loops on its own", () => {
    render(<PhoneDemo {...props} />);
    expect(screen.getByLabelText(props.label)).not.toHaveAttribute("controls");
  });
});
