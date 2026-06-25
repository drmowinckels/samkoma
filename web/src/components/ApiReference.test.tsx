import { describe, it, expect } from "vitest";
import { render, screen, within } from "@testing-library/react";
import {
  ApiReference,
  authLabel,
  collectOperations,
  typeLabel,
  type OpenApiDoc,
} from "./ApiReference";

const SPEC: OpenApiDoc = {
  info: { title: "samkoma API", version: "v1", description: "Test spec." },
  servers: [{ url: "https://api.samkoma.org" }],
  tags: [{ name: "polls" }, { name: "metrics" }],
  paths: {
    "/v1/polls": {
      post: {
        tags: ["polls"],
        summary: "Create a poll",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["title"],
                properties: {
                  title: { type: "string", description: "The poll title." },
                  slot: { type: "integer", default: 30 },
                  days: { type: "array", items: { type: "string" } },
                },
              },
            },
          },
        },
        responses: {
          "201": { description: "Created." },
          "429": { description: "rate_limited" },
        },
      },
    },
    "/v1/polls/{id}": {
      get: {
        tags: ["polls"],
        summary: "Fetch a poll",
        security: [{}, { editToken: [] }],
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "string" },
          },
        ],
        responses: { "200": { description: "The poll." } },
      },
      patch: {
        tags: ["polls"],
        summary: "Edit a poll",
        security: [{ editToken: [] }],
        responses: { "200": { description: "Updated." } },
      },
    },
    "/v1/metrics": {
      get: { tags: ["metrics"], summary: "Usage counters", responses: {} },
    },
  },
};

describe("ApiReference helpers", () => {
  it("labels schema types compactly", () => {
    expect(typeLabel({ type: "string" })).toBe("string");
    expect(typeLabel({ type: "array", items: { type: "string" } })).toBe(
      "string[]",
    );
    expect(typeLabel({ type: "string", format: "date-time" })).toBe(
      "string<date-time>",
    );
    expect(typeLabel({ enum: ["dates", "weekdays"] })).toBe(
      '"dates" | "weekdays"',
    );
  });

  it("derives the auth requirement from the security blocks", () => {
    expect(authLabel(undefined)).toBe("open");
    expect(authLabel([{}, { editToken: [] }])).toBe("token optional");
    expect(authLabel([{ editToken: [] }])).toBe("host token");
  });

  it("collects every operation across paths and methods", () => {
    const rows = collectOperations(SPEC);
    expect(rows).toHaveLength(4);
    expect(rows.map((r) => `${r.method} ${r.path}`)).toContain(
      "patch /v1/polls/{id}",
    );
  });
});

describe("ApiReference render", () => {
  it("groups operations by tag and shows methods, paths and request body", () => {
    render(<ApiReference spec={SPEC} />);
    expect(screen.getByRole("heading", { name: "polls" })).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: "metrics" }),
    ).toBeInTheDocument();
    // method + path render for each operation
    expect(screen.getAllByText("POST")).not.toHaveLength(0);
    expect(screen.getByText("/v1/polls")).toBeInTheDocument();
    // request body property surfaced with its description
    expect(screen.getByText("The poll title.")).toBeInTheDocument();
    // auth requirement surfaced
    expect(screen.getByText("host token")).toBeInTheDocument();
  });

  it("renders response codes for an operation", () => {
    render(<ApiReference spec={SPEC} />);
    const create = screen.getByText("Create a poll").closest("details")!;
    expect(within(create).getByText("201")).toBeInTheDocument();
    expect(within(create).getByText("429")).toBeInTheDocument();
  });
});
