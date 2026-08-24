import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import { SECTION_SOURCES } from "./src/content/program.ts";
import { parseSectionMarkdown } from "./src/content/sectionContract.ts";

const sectionSources = SECTION_SOURCES.map(({ id, sourcePath }) => ({
  id,
  url: new URL(`./${sourcePath}`, import.meta.url),
}));

const sectionPaths = new Set(
  sectionSources.map(({ url }) => fileURLToPath(url)),
);

function validateSectionSources() {
  for (const { id, url } of sectionSources) {
    const sourcePath = fileURLToPath(url);
    parseSectionMarkdown(readFileSync(sourcePath, "utf8"), sourcePath, id);
  }
}

export default defineConfig({
  base: "/prozhito/",
  plugins: [
    {
      name: "prozhito-section-contract",
      enforce: "pre",
      buildStart() {
        validateSectionSources();
      },
      configureServer(server) {
        server.watcher.add([...sectionPaths]);
      },
      handleHotUpdate({ file }) {
        if (sectionPaths.has(file)) {
          validateSectionSources();
        }
      },
    },
    react(),
  ],
});
