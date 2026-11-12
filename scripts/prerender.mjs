/**
 * Build-time prerender for search engines and AI assistants.
 *
 * The site is a client-rendered React app, so without this step every URL
 * serves an empty <div id="root"> and crawlers that don't run JavaScript
 * (GPTBot, ClaudeBot, PerplexityBot, social link previews, and Google's first
 * pass) see no content. After `vite build`, this script:
 *
 *   1. Builds src/entry-server.tsx for Node and renders every public route.
 *   2. Writes dist/<route>.html with the page's real markup and its <head>
 *      (title, description, canonical, Open Graph, JSON-LD) baked in. The
 *      browser still mounts the app normally and replaces the markup.
 *   3. Keeps the untouched app shell as dist/spa.html for the SPA fallback.
 *   4. Writes sitemap.xml, llms.txt, llms-full.txt and a Markdown copy of each
 *      page (dist/<route>.md, the home page as dist/index.md).
 *
 * Routes come from the <Route path="..."> entries in src/App.tsx. Pages whose
 * <PageSEO> sets `noindex` are left out of everything above.
 *
 * Run as part of `npm run build`. Any failure fails the build, so a broken
 * prerender never ships a site without content.
 */
import { execFileSync } from "node:child_process";
import { existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import TurndownService from "turndown";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const DIST = join(ROOT, "dist");
const SSR_OUT = join(ROOT, "node_modules", ".prerender");
const SITE_URL = "https://merchanthaus.io";

// ─── 1. Server bundle ───────────────────────────────────────────────────────
if (!existsSync(join(DIST, "index.html"))) {
  throw new Error("dist/index.html not found: run `vite build` before prerendering.");
}

// The Supabase client is created at import time and throws without a URL.
// Nothing is fetched while rendering, so a placeholder is enough when the
// build environment has no Supabase variables.
const ssrEnv = {
  ...process.env,
  VITE_SUPABASE_URL: process.env.VITE_SUPABASE_URL || "https://placeholder.supabase.co",
  VITE_SUPABASE_PUBLISHABLE_DEFAULT_KEY:
    process.env.VITE_SUPABASE_PUBLISHABLE_DEFAULT_KEY || process.env.VITE_SUPABASE_ANON_KEY || "placeholder",
};
execFileSync(
  process.execPath,
  [join(ROOT, "node_modules/vite/bin/vite.js"), "build", "--ssr", "src/entry-server.tsx", "--outDir", SSR_OUT, "--logLevel", "warn"],
  { cwd: ROOT, env: ssrEnv, stdio: "inherit" },
);
// Silence the Supabase "missing env" warning and React's useLayoutEffect SSR warning.
const quietError = console.error;
console.error = (...args) => {
  const msg = String(args[0] ?? "");
  if (msg.includes("useLayoutEffect") || msg.includes("Supabase environment")) return;
  quietError(...args);
};
const { render } = await import(pathToFileURL(join(SSR_OUT, "entry-server.js")).href);

// ─── 2. Routes and template ─────────────────────────────────────────────────
const appSource = readFileSync(join(ROOT, "src/App.tsx"), "utf8");
const routes = [...appSource.matchAll(/<Route\s+path="([^"*]+)"/g)].map((m) => m[1]);
if (routes.length < 10) throw new Error(`Only found ${routes.length} routes in src/App.tsx`);

const template = readFileSync(join(DIST, "index.html"), "utf8");
writeFileSync(join(DIST, "spa.html"), template);

// Fallback tags in index.html that each page's own <head> replaces.
const stripFallbackHead = (html) =>
  html
    .replace(/<title>[\s\S]*?<\/title>\s*/i, "")
    .replace(/<meta\s+name="(description|robots|twitter:[^"]+)"[^>]*>\s*/gi, "")
    .replace(/<meta\s+property="og:[^"]+"[^>]*>\s*/gi, "")
    .replace(/<link\s+rel="canonical"[^>]*>\s*/gi, "")
    .replace(/<script type="application\/ld\+json"[^>]*>[\s\S]*?<\/script>\s*/gi, "");

const decode = (s) =>
  s
    .replace(/&#x27;|&#39;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&amp;/g, "&");
const attr = (head, re) => decode((head.match(re) || [])[1] || "");

// ─── 3. Markdown ────────────────────────────────────────────────────────────
const turndown = new TurndownService({ headingStyle: "atx", codeBlockStyle: "fenced", bulletListMarker: "-" });
turndown.remove(["script", "style", "noscript", "nav", "header", "footer", "aside", "form", "svg", "iframe", "button", "video"]);
turndown.addRule("hidden-dialogs", {
  filter: (node) => node.getAttribute?.("role") === "dialog" || node.getAttribute?.("aria-hidden") === "true",
  replacement: () => "",
});
const toMarkdown = (html) => {
  const main = html.match(/<main[\s\S]*<\/main>/i)?.[0] ?? html;
  return turndown
    .turndown(main)
    .replace(/\]\(\/(?!\/)/g, `](${SITE_URL}/`)
    .replace(/\n{3,}/g, "\n\n")
    .trim();
};

// The supported-processors table is fetched in the browser from a CSV, so
// add it to that page's static HTML and Markdown here.
const processorsCsv = readFileSync(join(ROOT, "public/processors_simplified.csv"), "utf8");
const parseCsvLine = (line) => {
  const out = [];
  let cur = "";
  let quoted = false;
  for (const ch of line) {
    if (ch === '"') quoted = !quoted;
    else if (ch === "," && !quoted) {
      out.push(cur);
      cur = "";
    } else cur += ch;
  }
  out.push(cur);
  return out.map((c) => c.trim());
};
const [csvHeader, ...csvRows] = processorsCsv.trim().split(/\r?\n/).map(parseCsvLine);
const processors = csvRows.map((r) => Object.fromEntries(csvHeader.map((h, i) => [h, r[i] ?? ""])));
const escapeHtml = (s) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
const processorSummary = (p) => {
  const caps = ["Retail", "Ecommerce", "Moto", "Restaurant", "Recurring", "Level II", "Level III", "Network Tokenization", "Apple Pay", "Google Pay", "Payer-Auth 2.0"]
    .filter((k) => p[k] === "True")
    .map((k) => (k === "Moto" ? "MOTO" : k === "Payer-Auth 2.0" ? "3-D Secure 2" : k));
  return `${p.Platform} (${p.Method}; countries: ${p["Countries Served"]}${caps.length ? `; ${caps.join(", ")}` : ""})`;
};
const processorsHtml = `<section><h2>All supported processors (${processors.length})</h2><ul>${processors
  .map((p) => `<li>${escapeHtml(processorSummary(p))}</li>`)
  .join("")}</ul></section>`;
const processorsMd = `## All supported processors (${processors.length})\n\n${processors.map((p) => `- ${processorSummary(p)}`).join("\n")}`;

// ─── 4. Render ──────────────────────────────────────────────────────────────
const pages = [];
for (const route of routes) {
  const { html: rendered, head } = await render(route);
  if (/name="robots" content="noindex/.test(head)) continue;

  let body = rendered;
  if (route === "/supported-processors") body = body.replace(/<\/main>/, `${processorsHtml}</main>`);

  const page = stripFallbackHead(template)
    .replace("</head>", `${head}\n</head>`)
    .replace('<div id="root"></div>', `<div id="root">${body}</div>`);
  if (!page.includes(body.slice(0, 200))) throw new Error(`Could not inject markup for ${route}`);

  const file = route === "/" ? "index" : route.slice(1);
  mkdirSync(dirname(join(DIST, `${file}.html`)), { recursive: true });
  writeFileSync(join(DIST, `${file}.html`), page);

  const title = attr(head, /<title[^>]*>([^<]*)<\/title>/);
  const description = attr(head, /<meta[^>]*name="description"[^>]*content="([^"]*)"/);
  if (!title || !description) throw new Error(`Missing title or description on ${route}: add <PageSEO>`);
  let markdown = toMarkdown(body);
  if (route === "/supported-processors") markdown = markdown.replace(/\n*$/, `\n\n${processorsMd}`);
  const published = attr(head, /property="article:published_time"[^>]*content="([^"]*)"/);
  const url = route === "/" ? `${SITE_URL}/` : `${SITE_URL}${route}`;
  writeFileSync(
    join(DIST, `${file}.md`),
    `# ${title}\n\n> ${description}\n\nSource: ${url}\n\n${markdown}\n`,
  );
  pages.push({ route, url, file, title, description, published, markdown });
}

// ─── 5. sitemap.xml ─────────────────────────────────────────────────────────
const priority = (r) =>
  r === "/" ? "1.0" : ["/services", "/apply", "/quote", "/about", "/blog", "/device-catalog"].includes(r) ? "0.8" : "0.6";
writeFileSync(
  join(DIST, "sitemap.xml"),
  `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${pages
  .map(
    (p) =>
      `  <url>\n    <loc>${p.url}</loc>\n${
        /^\d{4}-\d{2}-\d{2}$/.test(p.published) ? `    <lastmod>${p.published}</lastmod>\n` : ""
      }    <priority>${priority(p.route)}</priority>\n  </url>`,
  )
  .join("\n")}
</urlset>
`,
);

// ─── 6. llms.txt and llms-full.txt (https://llmstxt.org) ────────────────────
const ARTICLE_ROUTES = new Set(
  [...readFileSync(join(ROOT, "src/data/seo.ts"), "utf8").matchAll(/^\s+"(\/[^"]+)": \{ datePublished/gm)].map((m) => m[1]),
);
const DOC_ROUTES = new Set(
  [...readFileSync(join(ROOT, "src/data/seo.ts"), "utf8").matchAll(/^\s+"(\/[^"]+)": \{\n\s+title:/gm)].map((m) => m[1]),
);
const LEGAL = new Set(["/terms", "/privacy"]);
const cleanTitle = (t) => t.replace(/\s*\|\s*MerchantHaus$/, "").replace(/^MerchantHaus — /, "");
const link = (p) => `- [${cleanTitle(p.title)}](${SITE_URL}/${p.file}.md): ${p.description}`;
const group = (filter) => pages.filter(filter).map(link).join("\n");

const intro = readFileSync(join(ROOT, "scripts/llms-intro.md"), "utf8").trim();
writeFileSync(
  join(DIST, "llms.txt"),
  `${intro}

## Company and services

${group((p) => !ARTICLE_ROUTES.has(p.route) && !DOC_ROUTES.has(p.route) && !LEGAL.has(p.route))}

## Articles and guides

${group((p) => ARTICLE_ROUTES.has(p.route))}

## Developer and Merchant Portal documentation

${group((p) => DOC_ROUTES.has(p.route))}

## Optional

${group((p) => LEGAL.has(p.route))}
- [Full site content](${SITE_URL}/llms-full.txt): every page above in one Markdown file
`,
);
writeFileSync(
  join(DIST, "llms-full.txt"),
  `${intro}\n\n${pages
    .map((p) => `---\n\n# ${cleanTitle(p.title)}\n\nURL: ${p.url}\n\n> ${p.description}\n\n${p.markdown}`)
    .join("\n\n")}\n`,
);

// ─── 7. Trailing-slash redirects ────────────────────────────────────────────
// "/about/" would otherwise fall through to the 404 rule in _redirects, so
// send it to the canonical "/about". These go above the catch-all.
const redirectsFile = join(DIST, "_redirects");
const redirects = readFileSync(redirectsFile, "utf8");
const slashRules = pages
  .filter((p) => p.route !== "/")
  .map((p) => `${p.route}/  ${p.route}  301`)
  .join("\n");
const MARKER = /^# @prerender-redirects.*$/m;
if (!MARKER.test(redirects)) throw new Error("public/_redirects is missing the # @prerender-redirects marker");
writeFileSync(
  redirectsFile,
  redirects.replace(MARKER, `# Trailing-slash variants of prerendered pages (added by scripts/prerender.mjs)\n${slashRules}`),
);

rmSync(SSR_OUT, { recursive: true, force: true });
console.log(`prerender: wrote ${pages.length} pages, sitemap.xml, llms.txt and llms-full.txt`);
