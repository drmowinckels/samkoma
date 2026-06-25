import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { Landing } from "./Landing";

describe("Landing", () => {
  it("points the hero CTAs at create and the on-site API page", () => {
    render(
      <MemoryRouter>
        <Landing />
      </MemoryRouter>,
    );
    expect(
      screen.getByRole("link", { name: /create a poll/i }),
    ).toHaveAttribute("href", "/new");
    expect(
      screen.getByRole("link", { name: /explore the api/i }),
    ).toHaveAttribute("href", "/api");
  });
});
