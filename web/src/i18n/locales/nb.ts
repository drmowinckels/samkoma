import type { Catalog } from "./en";
import type { LocaleMeta } from "../types";

export const meta: LocaleMeta = { label: "Norsk", order: 20 };

// Norwegian Bokmål. Typed as `Catalog`, so tsc fails the build if a key from
// `en` is missing, mistyped, or a plural group is flattened to a string.
export const nb: Catalog = {
  // ── nav / chrome ──
  "nav.primary": "Hovedmeny",
  "nav.skipToContent": "Hopp til innhold",
  "nav.api": "API",
  "nav.about": "Om",
  "nav.github": "GitHub",
  "nav.newPoll": "Ny avstemning",

  "theme.toLight": "Bytt til lyst tema",
  "theme.toDark": "Bytt til mørkt tema",

  "lang.switchTo": "Bytt språk til {language}",

  "footer.label": "Bunntekst",
  "footer.tagline": "finn et tidspunkt, sammen.",
  "footer.docs": "Dokumentasjon",
  "footer.support": "Spander en kaffe",

  // ── landing ──
  "landing.eyebrow": "Gruppeplanlegging, én delt lenke",
  "landing.title": "Finn et tidspunkt,\nsammen.",
  "landing.subcopy":
    "Mal inn når du er ledig, del én lenke, og se gruppas beste tidspunkt lyse opp. Ingen konto nødvendig — og hver avstemning er tilgjengelig fra API-et.",
  "landing.ctaCreate": "Lag en avstemning",
  "landing.ctaApi": "Utforsk API-et",
  "landing.step1.title": "Mal inn timene dine",
  "landing.step1.body":
    "Klikk og dra over rutenettet for å markere når du er ledig. Ingen konto, ingen kalendersynk.",
  "landing.step2.title": "Se det samle seg",
  "landing.step2.body":
    "Et levende varmekart løfter fram tidspunktet som passer for flest, med de nest beste tett bak.",
  "landing.step3.title": "Automatiser det",
  "landing.step3.body":
    "Hver avstemning er en REST-ressurs, så en CLI eller en bot kan åpne en og lese ut det vinnende tidspunktet.",

  // ── results (shared) ──
  "results.peopleFree": {
    one: "{count} person ledig",
    other: "{count} personer ledige",
  },
};

export default nb;
