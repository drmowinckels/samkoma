export interface RankedSlot {
  slot: string;
  count: number;
  names: string[];
}

// Rank slots by how many respondents are free. Ties break by earliest slot
// (slot keys are `YYYY-MM-DDThh:mm`, so lexical order is chronological).
export function rankSlots(
  responses: { name: string; slots: string[] }[],
  limit?: number,
): { total: number; results: RankedSlot[] } {
  const tally = new Map<string, { count: number; names: string[] }>();
  for (const r of responses) {
    for (const s of r.slots) {
      const entry = tally.get(s) ?? { count: 0, names: [] };
      entry.count++;
      entry.names.push(r.name);
      tally.set(s, entry);
    }
  }

  let results: RankedSlot[] = Array.from(tally, ([slot, e]) => ({
    slot,
    count: e.count,
    names: e.names,
  })).sort((a, b) => b.count - a.count || a.slot.localeCompare(b.slot));

  if (limit !== undefined && limit > 0) results = results.slice(0, limit);
  return { total: responses.length, results };
}
