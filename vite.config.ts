import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { readFileSync } from "fs";
import { componentTagger } from "lovable-tagger";

/**
 * Supported-processor count for marketing copy, computed from the same CSV the
 * /supported-processors page renders: unique platforms, ignoring Dev, QA and
 * Pre-Live test rows, rounded down to the nearest 10 (e.g. 132 -> 130).
 */
const countSupportedProcessors = () => {
  const csv = readFileSync(path.resolve(__dirname, "public/processors_simplified.csv"), "utf8");
  const platforms = new Set<string>();
  for (const line of csv.trim().split(/\r?\n/).slice(1)) {
    const match = line.match(/^\s*(?:"([^"]*)"|([^,]*))/);
    const platform = (match?.[1] ?? match?.[2] ?? "").trim();
    if (!platform || /\b(dev|qa|pre-?live)\b/i.test(platform)) continue;
    platforms.add(platform.toLowerCase());
  }
  return Math.floor(platforms.size / 10) * 10;
};

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  define: {
    __SUPPORTED_PROCESSOR_COUNT__: JSON.stringify(countSupportedProcessors()),
  },
  plugins: [react(), mode === "development" && componentTagger()].filter(Boolean),
  // The prerender build (scripts/prerender.mjs) bundles every dependency so the
  // server bundle runs in plain Node without CommonJS/ESM interop surprises.
  ssr: {
    noExternal: true,
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
