import { describe, it, expect } from "vitest";
import { rankSlots } from "../src/aggregate";

const responses = [
  { name: "Ada", slots: ["2026-07-15T09:00", "2026-07-15T09:30"] },
  { name: "Kari", slots: ["2026-07-15T09:00", "2026-07-16T10:00"] },
  { name: "Sam", slots: ["2026-07-15T09:00"] },
];

describe("rankSlots", () => {
  it("counts respondents per slot and lists their names", () => {
    const { total, results } = rankSlots(responses);
    expect(total).toBe(3);
    const top = results[0];
    expect(top).toEqual({
      slot: "2026-07-15T09:00",
      count: 3,
      names: ["Ada", "Kari", "Sam"],
    });
  });

  it("ranks by count desc, then earliest slot for ties", () => {
    const { results } = rankSlots(responses);
    expect(results.map((r) => r.slot)).toEqual([
      "2026-07-15T09:00", // 3
      "2026-07-15T09:30", // 1, earlier
      "2026-07-16T10:00", // 1, later
    ]);
  });

  it("respects an explicit limit", () => {
    expect(rankSlots(responses, 1).results).toHaveLength(1);
  });

  it("handles no responses", () => {
    expect(rankSlots([])).toEqual({ total: 0, results: [] });
  });
});
