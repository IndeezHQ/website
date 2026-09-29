import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { Logo } from "./logo";

describe("Logo", () => {
  it("links home and is announced by name", () => {
    render(<Logo />);
    const link = screen.getByRole("link");

    expect(link).toHaveAttribute("href", "/");
    expect(screen.getByAltText("Indeez")).toBeInTheDocument();
  });

  it("serves the still frame under reduced motion, first in the list", () => {
    const { container } = render(<Logo />);
    const first = container.querySelectorAll("source")[0];

    expect(first.getAttribute("media")).toContain("prefers-reduced-motion");
    expect(first).toHaveAttribute("srcset", "/brand/logo-static.webp");
  });

  it("keeps max-width off the image", () => {
    // Tailwind's preflight sets max-width:100%, which resolves circularly
    // inside a content-sized flex item and collapses the logo to zero width.
    render(<Logo />);
    expect(screen.getByAltText("Indeez").className).toContain("max-w-none");
  });

  it("can be marked high priority for the pages that show it first", () => {
    render(<Logo priority />);
    expect(screen.getByAltText("Indeez")).toHaveAttribute(
      "fetchpriority",
      "high"
    );
  });
});
