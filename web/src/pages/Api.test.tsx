import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { Api } from "./Api";
import { apiDocsUrl } from "../lib/api";

const SPEC = {
  info: { title: "samkoma API", version: "v1" },
  tags: [{ name: "polls" }],
  paths: {
    "/v1/polls": {
      post: {
        tags: ["polls"],
        summary: "Create a poll",
        responses: { "201": { description: "Created." } },
      },
    },
  },
};

beforeEach(() => {
  vi.stubGlobal(
    "fetch",
    vi.fn(() =>
      Promise.resolve({ ok: true, json: () => Promise.resolve(SPEC) }),
    ),
  );
});

afterEach(() => {
  vi.unstubAllGlobals();
});

function renderApi() {
  return render(
    <MemoryRouter>
      <Api />
    </MemoryRouter>,
  );
}

describe("Api", () => {
  it("fetches and renders the spec-driven reference", async () => {
    renderApi();
    expect(
      screen.getByRole("heading", { name: /one poll, two front doors/i }),
    ).toBeInTheDocument();
    // operation from the fetched spec appears once loaded
    expect(await screen.findByText("Create a poll")).toBeInTheDocument();
    expect(screen.getByText("/v1/polls")).toBeInTheDocument();
    expect(global.fetch).toHaveBeenCalledWith(
      expect.stringContaining("openapi.json"),
    );
  });

  it("links to the live interactive console and the raw spec", async () => {
    renderApi();
    await screen.findByText("Create a poll");
    const consoles = screen.getAllByRole("link", {
      name: /interactive console/i,
    });
    expect(consoles.length).toBeGreaterThanOrEqual(1);
    consoles.forEach((l) => expect(l).toHaveAttribute("href", apiDocsUrl()));
    expect(
      screen.getByRole("link", { name: /view raw spec/i }),
    ).toHaveAttribute("href", expect.stringContaining("openapi.json"));
  });
});
