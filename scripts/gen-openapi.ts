// Generates the web app's own copy of the OpenAPI document from the API's
// single source of truth (api/src/openapi.ts, derived from the zod validators).
// The web app serves and renders this file from its own origin, so the API
// reference works on localhost and GitHub Pages without the Worker running.
//
// Run with `npm run gen:openapi`. CI regenerates and fails on drift.
import { writeFileSync, mkdirSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { openApiDocument } from "../api/src/openapi";

// The canonical public API origin. It only sets the spec's `servers[].url`
// (the host shown in the reference and used by the live "try it" console).
const API_ORIGIN = "https://api.samkoma.org";

const here = dirname(fileURLToPath(import.meta.url));
const out = resolve(here, "../web/public/openapi.json");

const doc = openApiDocument(API_ORIGIN);
mkdirSync(dirname(out), { recursive: true });
writeFileSync(out, JSON.stringify(doc, null, 2) + "\n");

console.log(`Wrote ${out}`);
