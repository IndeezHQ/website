import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { SiteFooter } from "./site-footer";
import { legalNav, site } from "@/lib/site";

describe("SiteFooter", () => {
  it.each(legalNav)("links to $label", ({ href, label }) => {
    expect(screen.queryByRole("link", { name: label })).toBeNull();
    render(<SiteFooter />);
    expect(screen.getByRole("link", { name: label })).toHaveAttribute(
      "href",
      href
    );
  });

  it("publishes both contact addresses", () => {
    render(<SiteFooter />);
    for (const address of [site.email.support, site.email.info]) {
      expect(screen.getByRole("link", { name: address })).toHaveAttribute(
        "href",
        `mailto:${address}`
      );
    }
  });

  it("states the current year in the notice", () => {
    render(<SiteFooter />);
    const year = String(new Date().getFullYear());
    expect(screen.getByText(new RegExp(`${year}.*Indeez`))).toBeInTheDocument();
  });
});
