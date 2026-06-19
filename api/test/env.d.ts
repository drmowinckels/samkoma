import type { D1Migration } from "@cloudflare/vitest-pool-workers/config";

declare module "cloudflare:test" {
  interface ProvidedEnv {
    DB: D1Database;
    ALLOWED_ORIGINS: string;
    WEB_BASE_URL: string;
    TEST_MIGRATIONS: D1Migration[];
  }
}
