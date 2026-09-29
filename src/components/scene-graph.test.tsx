import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { SceneGraph } from "./scene-graph";

describe("SceneGraph", () => {
  it("names every participant in a scene", () => {
    render(<SceneGraph />);
    for (const label of ["Artist", "Label", "Venue", "Record store", "Fans"]) {
      expect(screen.getByText(label)).toBeInTheDocument();
    }
  });

  it("labels every relationship it draws", () => {
    render(<SceneGraph />);
    for (const edge of [
      "signed to",
      "plays",
      "stocked by",
      "followed by",
      "supplies",
      "buys from",
      "attending",
    ]) {
      expect(screen.getByText(edge)).toBeInTheDocument();
    }
  });

  it("draws one line per labelled relationship", () => {
    const { container } = render(<SceneGraph />);
    // Scoped to the dashed edge group: the icons are paths too.
    const edges = container.querySelectorAll("g[stroke-dasharray] path");
    expect(edges.length).toBe(7);
  });

  it("shows a polaroid for each of the five nodes", () => {
    const { container } = render(<SceneGraph />);
    const frames = container.querySelectorAll('image[href*="poloroid"]');
    expect(frames.length).toBe(5);
  });

  it("describes itself to screen readers rather than being decorative", () => {
    const { container } = render(<SceneGraph />);
    const svg = container.querySelector("svg");

    expect(svg).toHaveAttribute("role", "img");
    expect(container.querySelector("title")?.textContent).toMatch(/scene/i);
    expect(
      container.querySelector("desc")?.textContent?.length ?? 0
    ).toBeGreaterThan(60);
  });
});
