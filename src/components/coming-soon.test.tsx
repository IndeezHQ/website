import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { ComingSoon } from "./coming-soon";

describe("ComingSoon", () => {
  it("says what it is and offers a way back", () => {
    render(<ComingSoon title="Signing in is on its way" body="Use the app." />);

    expect(
      screen.getByRole("heading", { name: "Signing in is on its way" })
    ).toBeInTheDocument();
    expect(screen.getByText("Coming soon")).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: /back to the site/i })
    ).toHaveAttribute("href", "/");
  });

  it("gives people somewhere to write to instead", () => {
    render(<ComingSoon title="Title" body="Body." />);
    expect(
      screen.getByRole("link", { name: /talk to us/i }).getAttribute("href")
    ).toMatch(/^mailto:/);
  });
});
