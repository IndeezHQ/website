import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { GlitchLogo } from "./glitch-logo";

describe("GlitchLogo", () => {
  it("reads as the brand name rather than as decoration", () => {
    render(<GlitchLogo />);
    expect(screen.getByAltText("Indeez")).toBeInTheDocument();
  });

  it("reserves its space before the image lands", () => {
    render(<GlitchLogo />);
    const img = screen.getByAltText("Indeez");

    // Without width and height the hero reflows as the 700KB file arrives.
    expect(img).toHaveAttribute("width", "800");
    expect(img).toHaveAttribute("height", "518");
  });

  it("serves a still frame to anyone who asked for reduced motion", () => {
    const { container } = render(<GlitchLogo />);
    const source = container.querySelector(
      'source[media*="prefers-reduced-motion"]'
    );

    expect(source).toHaveAttribute("srcset", "/brand/glitch-logo-static.webp");
  });

  it("puts the reduced-motion source first, since the browser takes the first match", () => {
    const { container } = render(<GlitchLogo />);
    const first = container.querySelectorAll("source")[0];
    expect(first.getAttribute("media")).toContain("prefers-reduced-motion");
  });

  it("serves a smaller animation to small screens", () => {
    const { container } = render(<GlitchLogo />);
    const small = container.querySelector('source[media*="max-width"]');
    expect(small).toHaveAttribute("srcset", "/brand/glitch-logo-sm.webp");
  });

  it("pulls the artwork's dead left margin out so it lines up with the heading", () => {
    render(<GlitchLogo />);
    expect(screen.getByAltText("Indeez").className).toContain("-ml-[14.21%]");
  });
});
