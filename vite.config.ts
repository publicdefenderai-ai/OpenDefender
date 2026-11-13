import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import { execFileSync } from "node:child_process";
import runtimeErrorOverlay from "@replit/vite-plugin-runtime-error-modal";

export default defineConfig({
  plugins: [
    {
      name: "inline-public-catalog-counts",
      apply: "build",
      load(id) {
        if (id !== path.resolve(import.meta.dirname, "shared/catalog-counts.ts")) return;
        // The browser needs only the totals. Compute them once in a Node process
        // outside the client module graph, without a committed generated file.
        const json = execFileSync(process.execPath, [
          "--import", "tsx", "--input-type=module", "-e",
          'import { catalogCounts } from "./shared/catalog-counts.ts"; process.stdout.write(JSON.stringify(catalogCounts));',
        ], { cwd: import.meta.dirname, encoding: "utf8" });
        return `export const catalogCounts = ${JSON.stringify(JSON.parse(json))};`;
      },
    },
    react(),
    runtimeErrorOverlay(),
    ...(process.env.NODE_ENV !== "production" &&
    process.env.REPL_ID !== undefined
      ? [
          await import("@replit/vite-plugin-cartographer").then((m) =>
            m.cartographer(),
          ),
        ]
      : []),
  ],
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "client", "src"),
      "@shared": path.resolve(import.meta.dirname, "shared"),
      "@assets": path.resolve(import.meta.dirname, "attached_assets"),
    },
  },
  root: path.resolve(import.meta.dirname, "client"),
  build: {
    outDir: path.resolve(import.meta.dirname, "dist/public"),
    emptyOutDir: true,
  },
  server: {
    fs: {
      strict: true,
      deny: ["**/.*"],
    },
  },
});
