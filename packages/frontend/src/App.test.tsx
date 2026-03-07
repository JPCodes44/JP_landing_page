import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import App from "./App";

// Mock the ContactForm component
vi.mock("./components/ContactForm", () => ({
  default: () => <div data-testid="contact-form">ContactForm</div>,
}));

describe("App", () => {
  it("renders the main heading", () => {
    render(<App />);
    const heading = screen.getByRole("heading", { level: 1 });
    expect(heading).toBeInTheDocument();
    expect(heading).toHaveTextContent("Get in Touch");
  });

  it("renders the ContactForm component", () => {
    render(<App />);
    const contactForm = screen.getByTestId("contact-form");
    expect(contactForm).toBeInTheDocument();
  });

  it("renders main element with correct structure", () => {
    render(<App />);
    const main = screen.getByRole("main");
    expect(main).toBeInTheDocument();
    expect(main.children).toHaveLength(2);
  });
});
