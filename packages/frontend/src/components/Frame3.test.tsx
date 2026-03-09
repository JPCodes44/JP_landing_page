import { render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import Frame3 from "./Frame3";

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

describe("Frame3", () => {
  beforeEach(() => {
    mockMatchMedia(false);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("renders a section element", () => {
    render(<Frame3 />);
    const section = document.querySelector("section");
    expect(section).toBeInTheDocument();
  });

  it("renders the label text", () => {
    render(<Frame3 />);
    expect(screen.getByText("SOME COOL VISUAL WOAW")).toBeInTheDocument();
  });

  describe("with prefers-reduced-motion", () => {
    beforeEach(() => {
      mockMatchMedia(true);
    });

    it("renders at full expansion when reduced motion is preferred", () => {
      render(<Frame3 />);
      const label = screen.getByText("SOME COOL VISUAL WOAW");
      expect(label).toBeInTheDocument();
      const section = document.querySelector("section");
      expect(section).toBeInTheDocument();
    });
  });
});
