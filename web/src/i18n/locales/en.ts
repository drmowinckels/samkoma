import type { CatalogPart, LocaleMeta } from "../types";

export const meta: LocaleMeta = { label: "English", order: 0 };

// English — the source of truth for the key set and plural shapes. Every other
// locale is typed against `Catalog` (derived from this file), so adding a key
// here without translating it elsewhere is a compile error.
//
// Keys are flat, dotted, and namespaced by surface (`nav.*`, `landing.*`,
// `create.*`, …). A value is a string or a plural group ({ one, other });
// `{name}` placeholders are filled at call time, and a `\n` renders as a line
// break where the call site opts into it.
//
// To add a language, copy this file to `<code>.ts`, keep every key, translate
// the values, and register it in `../registry.ts`. See CONTRIBUTING.md.
export const en = {
  // ── nav / chrome ──
  "nav.primary": "Primary",
  "nav.skipToContent": "Skip to content",
  "nav.api": "API",
  "nav.about": "About",
  "nav.github": "GitHub",
  "nav.newPoll": "New poll",

  "theme.toLight": "Switch to light theme",
  "theme.toDark": "Switch to dark theme",

  "lang.switchTo": "Switch language to {language}",

  "footer.label": "Footer",
  "footer.tagline": "find a time, together.",
  "footer.docs": "Docs",
  "footer.support": "Buy me a coffee",

  // ── landing ──
  "landing.eyebrow": "Group scheduling, one shared link",
  "landing.title": "Find a time,\ntogether.",
  "landing.subcopy":
    "Paint when you're free, share one link, and watch the group's best slot light up. No accounts required — and every poll is reachable from the API.",
  "landing.ctaCreate": "Create a poll",
  "landing.ctaApi": "Explore the API",
  "landing.step1.title": "Paint your hours",
  "landing.step1.body":
    "Click and drag across the grid to mark when you're free. No account, no calendar sync.",
  "landing.step2.title": "See it converge",
  "landing.step2.body":
    "A live heatmap surfaces the slot that works for the most people, runner-ups close behind.",
  "landing.step3.title": "Automate it",
  "landing.step3.body":
    "Every poll is a REST resource, so a CLI or a bot can open one and read the winning slot back.",

  // ── results (shared) ──
  "results.peopleFree": {
    one: "{count} person free",
    other: "{count} people free",
  },
} satisfies CatalogPart;

export default en;

export type Catalog = typeof en;
export type TKey = keyof Catalog;
