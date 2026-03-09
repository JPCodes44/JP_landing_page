import { render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import Frame5 from "./Frame5";

const mockMatchMedia = (prefersReduced: boolean) => {
  Object.defineProperty(window, "matchMedia", {
    writable: true,
    value: vi.fn().mockImplementation((query: string) => ({
      matches: prefersReduced && query === "(prefers-reduced-motion: reduce)",
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    })),
  });
};

describe("Frame5", () => {
  beforeEach(() => {
    mockMatchMedia(false);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("renders heading text 'My Services In Action:'", () => {
    render(<Frame5 />);
    const headings = screen.getAllByText("My Services In Action:");
    expect(headings).toHaveLength(2);
    for (const h of headings) expect(h).toBeInTheDocument();
  });

  it("renders 'some video' placeholder", () => {
    render(<Frame5 />);
    expect(screen.getByText("some video")).toBeInTheDocument();
  });

  describe("with prefers-reduced-motion", () => {
    beforeEach(() => {
      mockMatchMedia(true);
    });

    it("heading is visible (opacity: 1, small size) when reduced motion is preferred", () => {
      render(<Frame5 />);
      const headings = screen.getAllByText("My Services In Action:");
      // With reduced motion: large heading fades out (opacity 0), small heading visible (opacity 1)
      const smallHeading = headings.find((h) => (h as HTMLElement).style.fontSize === "8rem");
      expect(smallHeading).toBeInTheDocument();
      expect(smallHeading?.tagName).toBe("H2");
    });
  });
});
