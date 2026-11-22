/**
 * Build-time prerender entry (see scripts/prerender.mjs).
 *
 * Renders one route to an HTML string with StaticRouter so the deployed site
 * serves real content to crawlers and AI agents that don't execute JavaScript.
 * The browser still mounts the app with createRoot (src/main.tsx), which
 * replaces this markup, so there is no hydration contract to keep in sync.
 */
import { PassThrough } from "node:stream";
import { renderToPipeableStream } from "react-dom/server";
import { StaticRouter } from "react-router-dom/server";
import { AppProviders, AppRoutes } from "./App";

export type RenderResult = {
  html: string;
  head: string;
};

type HelmetData = {
  helmet?: Record<string, { toString(): string }>;
};

export function render(url: string): Promise<RenderResult> {
  const helmetContext: HelmetData = {};

  return new Promise((resolve, reject) => {
    let failed: unknown;
    const { pipe, abort } = renderToPipeableStream(
      <AppProviders helmetContext={helmetContext}>
        <StaticRouter location={url}>
          <AppRoutes />
        </StaticRouter>
      </AppProviders>,
      {
        onAllReady() {
          const stream = new PassThrough();
          const chunks: Buffer[] = [];
          stream.on("data", (c: Buffer) => chunks.push(c));
          stream.on("end", () => {
            if (failed) return reject(failed);
            const h = helmetContext.helmet;
            const head = h
              ? ["title", "meta", "link", "script"].map((k) => h[k]?.toString() ?? "").join("\n")
              : "";
            resolve({ html: Buffer.concat(chunks).toString("utf8"), head });
          });
          pipe(stream);
        },
        onShellError: reject,
        onError(err) {
          failed = err;
        },
      },
    );
    setTimeout(() => abort(), 20000);
  });
}
