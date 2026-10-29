import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";

import { StoreBadges } from "./store-badges";
import { stores } from "@/lib/site";

describe("StoreBadges", () => {
  it("shows both stores", () => {
    render(<StoreBadges />);
    expect(screen.getByText("App Store")).toBeInTheDocument();
    expect(screen.getByText("Google Play")).toBeInTheDocument();
  });

  it("is a button that says coming soon while the store link is empty", async () => {
    render(<StoreBadges />);

    for (const [name, href] of [
      ["App Store", stores.ios],
      ["Google Play", stores.android],
    ] as const) {
      const badge = screen.getByText(name).closest("a, button");

      if (href) {
        // Fill a URL into lib/site.ts and the same badge becomes a real link.
        expect(badge?.tagName).toBe("A");
        expect(badge).toHaveAttribute("href", href);
        continue;
      }

      expect(badge?.tagName).toBe("BUTTON");
      await userEvent.click(badge as HTMLElement);
      expect(
        screen.getByText(new RegExp(`coming soon on ${name}`, "i"))
      ).toBeInTheDocument();
    }
  });

  it("announces the message rather than leaving it silent", () => {
    // Pressing a button that only changes text elsewhere is invisible to a
    // screen reader without this.
    const { container } = render(<StoreBadges />);
    expect(container.querySelector('[aria-live="polite"]')).toBeTruthy();
  });

  it("never renders a store link that goes nowhere", () => {
    render(<StoreBadges />);
    for (const link of screen.queryAllByRole("link")) {
      expect(link.getAttribute("href")).toBeTruthy();
    }
  });
});
