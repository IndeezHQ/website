import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { GetTheApp } from "./get-the-app";

describe("GetTheApp", () => {
  it("always offers the primary action", () => {
    render(<GetTheApp />);
    expect(
      screen.getByRole("link", { name: "Create account" })
    ).toHaveAttribute("href", "/sign-up");
  });

  it("offers both stores without ever linking nowhere", () => {
    // The store badges carry their own coming-soon behaviour; what matters
    // here is that the CTA shows them and that none of its links is dead.
    render(<GetTheApp />);

    expect(screen.getByText("App Store")).toBeInTheDocument();
    expect(screen.getByText("Google Play")).toBeInTheDocument();

    for (const link of screen.getAllByRole("link")) {
      expect(link.getAttribute("href")).toBeTruthy();
    }
  });
});
