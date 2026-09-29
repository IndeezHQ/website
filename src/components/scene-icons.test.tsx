import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { SceneIcon, type SceneIconName } from "./scene-icons";

const NAMES: SceneIconName[] = [
  "artist",
  "label",
  "venue",
  "record_store",
  "fan",
];

describe("SceneIcon", () => {
  it.each(NAMES)("draws something for %s", (name) => {
    const { container } = render(<SceneIcon name={name} data-testid="icon" />);
    const svg = screen.getByTestId("icon");

    expect(svg.tagName.toLowerCase()).toBe("svg");
    // Every icon must actually contain geometry. A missing entry in the map
    // would otherwise render an empty, silent square.
    expect(
      container.querySelectorAll("path, circle, rect").length
    ).toBeGreaterThan(0);
  });

  it("hides icons from screen readers, since each one sits beside its label", () => {
    render(<SceneIcon name="artist" data-testid="icon" />);
    expect(screen.getByTestId("icon")).toHaveAttribute("aria-hidden", "true");
  });

  it("takes its colour from the surrounding text", () => {
    render(<SceneIcon name="venue" data-testid="icon" />);
    expect(screen.getByTestId("icon")).toHaveAttribute(
      "stroke",
      "currentColor"
    );
  });

  it("draws a distinct shape for every account type", () => {
    const shapes = NAMES.map((name) => {
      const { container } = render(<SceneIcon name={name} />);
      return container.innerHTML;
    });
    expect(new Set(shapes).size).toBe(NAMES.length);
  });
});
