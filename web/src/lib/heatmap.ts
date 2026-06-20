import type { PollResponse } from "./api";

export interface CellAgg {
  count: number;
  names: string[];
}

export interface Aggregate {
  total: number;
  cells: Map<string, CellAgg>;
  ranked: Array<{ slot: string; count: number; names: string[] }>;
  bestKey: string | null;
}

// Count how many respondents are free in each slot, rank slots (count desc,
// then earliest), and flag the single best slot. Slot keys are
// `YYYY-MM-DDThh:mm`, so lexical order is chronological.
export function aggregate(responses: PollResponse[]): Aggregate {
  const cells = new Map<string, CellAgg>();
  for (const r of responses) {
    for (const s of r.slots) {
      const entry = cells.get(s) ?? { count: 0, names: [] };
      entry.count++;
      entry.names.push(r.name);
      cells.set(s, entry);
    }
  }

  const ranked = Array.from(cells, ([slot, e]) => ({
    slot,
    count: e.count,
    names: e.names,
  })).sort((a, b) => b.count - a.count || a.slot.localeCompare(b.slot));

  return {
    total: responses.length,
    cells,
    ranked,
    bestKey: ranked[0]?.slot ?? null,
  };
}
