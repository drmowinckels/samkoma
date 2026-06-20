import { describe, it, expect } from "vitest";
import { aggregate } from "./heatmap";
import { formatSlotLabel } from "./datetime";
import type { PollResponse } from "./api";

const r = (name: string, slots: string[]): PollResponse => ({
  name,
  tz: "UTC",
  slots,
  updatedAt: "2026-07-01T00:00:00Z",
});

describe("aggregate", () => {
  it("counts per slot, ranks, and picks the best", () => {
    const agg = aggregate([
      r("Ada", ["2026-07-15T09:00", "2026-07-15T09:30"]),
      r("Kari", ["2026-07-15T09:00"]),
      r("Sam", ["2026-07-15T09:00", "2026-07-16T10:00"]),
    ]);
    expect(agg.total).toBe(3);
    expect(agg.bestKey).toBe("2026-07-15T09:00");
    expect(agg.cells.get("2026-07-15T09:00")).toEqual({
      count: 3,
      names: ["Ada", "Kari", "Sam"],
    });
    // ties broken by earliest slot
    expect(agg.ranked.map((x) => x.slot)).toEqual([
      "2026-07-15T09:00",
      "2026-07-15T09:30",
      "2026-07-16T10:00",
    ]);
  });

  it("is empty with no responses", () => {
    const agg = aggregate([]);
    expect(agg).toMatchObject({ total: 0, bestKey: null });
    expect(agg.ranked).toEqual([]);
  });
});

describe("formatSlotLabel", () => {
  it("renders a human label from a slot key", () => {
    expect(formatSlotLabel("2026-07-15T12:00")).toBe("Wed 15, 12:00");
  });
});
