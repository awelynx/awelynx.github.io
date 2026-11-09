import { defineConfig } from "astro/config";
import react from "@astrojs/react";
export default defineConfig({
  site: "https://awelynx.github.io",
  output: "static",
  outDir: "./build",
  publicDir: "./static",
  trailingSlash: "always",
  integrations: [react()],
  build: { inlineStylesheets: "never" },
  vite: { build: { chunkSizeWarningLimit: 1500 } },
});
