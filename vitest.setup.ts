import "@testing-library/jest-dom/vitest";

import { cleanup } from "@testing-library/react";
import { afterEach, vi } from "vitest";

afterEach(() => {
  cleanup();
});

/**
 * jsdom implements neither of these, and components here use both:
 * `matchMedia` for the reduced-motion checks and `IntersectionObserver` for
 * lazy video playback. Without them the components throw on mount rather than
 * failing on the thing under test.
 *
 * Skipped entirely in the node environment: the link preview image tests run
 * there, because Satori needs a real Node runtime, and there is no `window`
 * to define these on.
 */
class MockIntersectionObserver implements IntersectionObserver {
  readonly root = null;
  readonly rootMargin = "";
  readonly thresholds: ReadonlyArray<number> = [];
  observe = vi.fn();
  unobserve = vi.fn();
  disconnect = vi.fn();
  takeRecords = vi.fn(() => []);
}

if (typeof window !== "undefined") {
  Object.defineProperty(window, "matchMedia", {
    writable: true,
    value: vi.fn().mockImplementation((query: string) => ({
      matches: false,
      media: query,
      onchange: null,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      addListener: vi.fn(),
      removeListener: vi.fn(),
      dispatchEvent: vi.fn(),
    })),
  });

  vi.stubGlobal("IntersectionObserver", MockIntersectionObserver);
}
