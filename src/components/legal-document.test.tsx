import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { LegalDocument } from "./legal-document";

const body = `Intro paragraph.

## 1. What Indeez Is

A sentence in the first section.

- a listed point
`;

describe("LegalDocument", () => {
  it("shows the title and the effective date", () => {
    render(
      <LegalDocument
        title="Terms & Conditions"
        effective="August 18, 2026"
        body={body}
        slug="terms"
      />
    );

    expect(
      screen.getByRole("heading", { level: 1, name: "Terms & Conditions" })
    ).toBeInTheDocument();
    expect(screen.getByText(/Effective August 18, 2026/)).toBeInTheDocument();
  });

  it("omits the date line for an undated page", () => {
    render(
      <LegalDocument
        title="Support"
        effective={null}
        body={body}
        slug="support"
      />
    );
    expect(screen.queryByText(/Effective/)).not.toBeInTheDocument();
  });

  it("renders the markdown body as real headings and lists", () => {
    render(
      <LegalDocument title="Terms" effective={null} body={body} slug="terms" />
    );

    expect(
      screen.getByRole("heading", { level: 2, name: "1. What Indeez Is" })
    ).toBeInTheDocument();
    // The sibling nav is a list too, so match the text, not the role.
    expect(screen.getByText("a listed point").tagName).toBe("LI");
  });

  it("marks the document you are reading in the sibling nav", () => {
    render(
      <LegalDocument
        title="Privacy Policy"
        effective={null}
        body={body}
        slug="privacy"
      />
    );

    const current = screen.getByRole("link", { name: "Privacy Policy" });
    expect(current).toHaveAttribute("aria-current", "page");
    expect(screen.getByRole("link", { name: "Support" })).not.toHaveAttribute(
      "aria-current"
    );
  });
});
