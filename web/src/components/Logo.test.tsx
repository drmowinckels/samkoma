import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { Logo, Mark } from "./Logo";

describe("Logo", () => {
  it("renders the wordmark as a link home", () => {
    render(
      <MemoryRouter>
        <Logo />
      </MemoryRouter>,
    );
    const link = screen.getByRole("link", { name: /samkoma/i });
    expect(link).toHaveAttribute("href", "/");
    expect(screen.getByText("samkoma")).toBeInTheDocument();
  });

  it("renders the mark as a decorative, sized svg", () => {
    const { container } = render(<Mark size={40} />);
    const svg = container.querySelector("svg");
    expect(svg).toBeInTheDocument();
    expect(svg).toHaveAttribute("aria-hidden", "true");
    expect(svg).toHaveAttribute("width", "40");
  });
});
