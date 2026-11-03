import { defineConfig } from "vitest/config";
import { fileURLToPath } from "node:url";

export default defineConfig({
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
  test: {
    environment: "node",
    // What .env.local provides in development; src/env.ts requires it.
    env: { NEXT_PUBLIC_SITE_URL: "https://7noodles.com" },
    include: ["src/**/*.test.ts"],
  },
});
