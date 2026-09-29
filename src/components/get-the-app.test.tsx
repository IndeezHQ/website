import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { GetTheApp } from "./get-the-app";
import { appStoreLinksLive } from "@/lib/site";

describe("GetTheApp", () => {
  it("always offers the primary action", () => {
    render(<GetTheApp />);
    expect(
      screen.getByRole("link", { name: "Create account" })
    ).toHaveAttribute("href", "/sign-up");
  });

  it("says the apps are coming rather than showing dead store buttons", () => {
    render(<GetTheApp />);

    if (appStoreLinksLive) {
      expect(
        screen.queryByText(/on their way to the stores/i)
      ).not.toBeInTheDocument();
    } else {
      // The whole point of the flag: no button that goes nowhere.
      expect(
        screen.getByText(/on their way to the stores/i)
      ).toBeInTheDocument();
      expect(
        screen.queryByRole("link", { name: /download for iphone/i })
      ).not.toBeInTheDocument();
      expect(
        screen.queryByRole("link", { name: /get it on android/i })
      ).not.toBeInTheDocument();
    }
  });
});
