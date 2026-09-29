import { fileURLToPath } from "node:url";

import react from "@vitejs/plugin-react";
import tsconfigPaths from "vite-tsconfig-paths";
import { defineConfig } from "vitest/config";

export default defineConfig({
  plugins: [tsconfigPaths(), react()],
  resolve: {
    alias: {
      // Resolved by Next's compiler at build time; throws in a plain runtime.
      "next/font/local": fileURLToPath(
        new URL("./tests/helpers/next-font-stub.ts", import.meta.url)
      ),
      /*
       * `server-only` throws by design when a server module is pulled into a
       * client bundle. Vitest is neither, so importing anything that uses it
       * (lib/legal.ts) blows up before a single assertion runs. The package
       * ships an empty build for exactly this; point at it.
       */
      "server-only": fileURLToPath(
        new URL("./node_modules/server-only/empty.js", import.meta.url)
      ),
    },
  },
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: ["./vitest.setup.ts"],
    include: ["src/**/*.test.{ts,tsx}", "tests/**/*.test.{ts,tsx}"],
    // next build writes generated types here; nothing to test in them.
    exclude: ["node_modules", ".next"],
  },
});
