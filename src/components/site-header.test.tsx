import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { SiteHeader } from "./site-header";

let pathname = "/";
vi.mock("next/navigation", () => ({ usePathname: () => pathname }));

beforeEach(() => {
  pathname = "/";
});

describe("the header logo", () => {
  it("is hidden on the landing page, where the hero wordmark already says it", () => {
    pathname = "/";
    render(<SiteHeader />);
    expect(screen.queryByAltText("Indeez")).not.toBeInTheDocument();
  });

  it.each(["/terms", "/privacy", "/sign-in", "/support"])(
    "is shown on %s, where nothing else identifies the site",
    (route) => {
      pathname = route;
      render(<SiteHeader />);
      expect(screen.getByAltText("Indeez")).toBeInTheDocument();
    }
  );
});

describe("the header navigation", () => {
  it("always offers a way in, on every route", () => {
    pathname = "/terms";
    render(<SiteHeader />);
    expect(
      screen.getAllByRole("link", { name: "Sign in" }).length
    ).toBeGreaterThan(0);
    expect(
      screen.getAllByRole("link", { name: "Create account" }).length
    ).toBeGreaterThan(0);
  });

  it("keeps the mobile menu closed until it is asked for", () => {
    render(<SiteHeader />);
    const toggle = screen.getByRole("button", { name: /open menu/i });
    expect(toggle).toHaveAttribute("aria-expanded", "false");
  });

  it("opens and closes the mobile menu", async () => {
    const user = userEvent.setup();
    render(<SiteHeader />);

    await user.click(screen.getByRole("button", { name: /open menu/i }));
    expect(screen.getByRole("button", { name: /close menu/i })).toHaveAttribute(
      "aria-expanded",
      "true"
    );

    await user.click(screen.getByRole("button", { name: /close menu/i }));
    expect(screen.getByRole("button", { name: /open menu/i })).toHaveAttribute(
      "aria-expanded",
      "false"
    );
  });
});
