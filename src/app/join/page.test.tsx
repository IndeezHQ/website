import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import JoinPage, { metadata } from "./page";
import { appScheme } from "@/lib/site";

/**
 * The token in the query string is a bearer credential: whoever holds the URL
 * holds the invite. These guard the two things that would turn this page into
 * a leak, namely saying something about the invite, and letting the token out
 * of the page.
 */

const renderJoin = async (token?: string | string[]) =>
  render(await JoinPage({ searchParams: Promise.resolve({ token }) }));

describe("JoinPage", () => {
  it("hands the token to the app without redeeming anything here", async () => {
    await renderJoin("tok-123");
    expect(
      screen.getByRole("link", { name: /open the invite in/i })
    ).toHaveAttribute("href", `${appScheme}://join?token=tok-123`);
  });

  it("escapes the token rather than pasting it into the url", async () => {
    await renderJoin("a b&c=d");
    expect(
      screen.getByRole("link", { name: /open the invite in/i })
    ).toHaveAttribute("href", `${appScheme}://join?token=a%20b%26c%3Dd`);
  });

  it("takes the first of a repeated token rather than failing", async () => {
    await renderJoin(["one", "two"]);
    expect(
      screen.getByRole("link", { name: /open the invite in/i })
    ).toHaveAttribute("href", `${appScheme}://join?token=one`);
  });

  it("says the link is incomplete when there is no token", async () => {
    await renderJoin(undefined);
    expect(screen.getByRole("heading")).toHaveTextContent(/incomplete/i);
    expect(
      screen.queryByRole("link", { name: /open the invite in/i })
    ).not.toBeInTheDocument();
  });

  it("treats a blank token as no token", async () => {
    await renderJoin("   ");
    expect(screen.getByRole("heading")).toHaveTextContent(/incomplete/i);
  });

  it("keeps the copy generic, naming no page and no role", async () => {
    // v1 deliberately has no endpoint that resolves a token to private
    // information. If one is ever added, this is the test that should be
    // argued with first.
    const { container } = await renderJoin("tok-123");
    expect(container.textContent).toMatch(/invited to join a team/i);
    expect(container.textContent).not.toMatch(/tok-123/);
  });

  it("is kept out of search, and sends no referrer", async () => {
    // Without these the token reaches every linked site in the Referer
    // header, and a crawled invite is an invite sitting in an index.
    expect(metadata.robots).toMatchObject({ index: false, follow: false });
    expect(metadata.referrer).toBe("no-referrer");
  });
});
