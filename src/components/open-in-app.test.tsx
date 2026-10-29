import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { OpenInApp } from "./open-in-app";
import { appScheme } from "@/lib/site";

describe("OpenInApp", () => {
  it("deep links into the app at the given path", () => {
    render(<OpenInApp path="song/abc-123" />);
    expect(screen.getByRole("link")).toHaveAttribute(
      "href",
      `${appScheme}://song/abc-123`
    );
  });

  it("is still read as 'Open in Indeez' with the logo standing in for the word", () => {
    // The brand name is artwork here, so the alt text is the only thing
    // carrying it to a screen reader or a crawler.
    render(<OpenInApp path="song/abc-123" />);
    expect(screen.getByRole("link")).toHaveAccessibleName(/open in indeez/i);
    expect(screen.getByAltText("Indeez")).toBeInTheDocument();
  });

  it("takes a different lead for pages that are not a song", () => {
    render(<OpenInApp path="join?token=t" lead="Open the invite in" />);
    expect(screen.getByRole("link")).toHaveAccessibleName(
      /open the invite in indeez/i
    );
  });

  it("serves the still logo under reduced motion", () => {
    const { container } = render(<OpenInApp path="song/abc-123" />);
    expect(container.querySelector("source")?.getAttribute("media")).toContain(
      "prefers-reduced-motion"
    );
  });
});
