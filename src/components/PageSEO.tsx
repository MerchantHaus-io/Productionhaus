import { Helmet } from "react-helmet-async";
import {
  ARTICLES,
  DEFAULT_IMAGE,
  ORGANIZATION_ID,
  SITE_NAME,
  SITE_URL,
  WEBSITE_ID,
  organizationJsonLd,
  websiteJsonLd,
} from "@/data/seo";

type Crumb = { name: string; path: string };

type PageSEOProps = {
  title: string;
  description: string;
  /** Route path, e.g. "/about". Omit only for pages that are also `noindex`. */
  path?: string;
  /** Keep the page out of search results and AI answers (dashboards, internal tools). */
  noindex?: boolean;
  /** Absolute URL or site-relative path of the social/preview image. */
  image?: string;
  /** Breadcrumb trail above this page (Home is added automatically). */
  breadcrumbs?: Crumb[];
  /** Extra schema.org nodes for this page, e.g. an FAQPage. */
  jsonLd?: Record<string, unknown>[];
};

const PAGE_TYPES: Record<string, string> = {
  "/about": "AboutPage",
  "/blog": "CollectionPage",
  "/apply": "ContactPage",
  "/quote": "ContactPage",
};

const absolute = (url: string) => (url.startsWith("http") ? url : `${SITE_URL}${url}`);

/**
 * Per-page <head>: title, description, canonical, Open Graph, Twitter and
 * schema.org JSON-LD. Blog posts listed in ARTICLES (src/data/seo.ts) get
 * Article markup automatically. The build-time prerender bakes this output
 * into each route's static HTML so crawlers and AI agents see it without JS.
 */
export const PageSEO = ({
  title,
  description,
  path,
  noindex = false,
  image,
  breadcrumbs,
  jsonLd = [],
}: PageSEOProps) => {
  const isHome = path === "/";
  const fullTitle = isHome ? `${SITE_NAME} — ${title}` : `${title} | ${SITE_NAME}`;
  const canonical = path ? `${SITE_URL}${path === "/" ? "/" : path}` : undefined;
  const article = path ? ARTICLES[path] : undefined;
  const ogImage = absolute(image ?? article?.image ?? DEFAULT_IMAGE);

  const graph: Record<string, unknown>[] = [];
  if (!noindex && canonical) {
    graph.push(organizationJsonLd, websiteJsonLd);

    const pageNode: Record<string, unknown> = {
      "@type": PAGE_TYPES[path!] ?? "WebPage",
      "@id": `${canonical}#webpage`,
      url: canonical,
      name: fullTitle,
      description,
      isPartOf: { "@id": WEBSITE_ID },
      about: { "@id": ORGANIZATION_ID },
      inLanguage: "en-US",
      primaryImageOfPage: { "@type": "ImageObject", url: ogImage },
    };

    const trail: Crumb[] = isHome ? [] : [{ name: "Home", path: "/" }, ...(breadcrumbs ?? []), { name: title, path: path! }];
    if (trail.length > 1) {
      pageNode.breadcrumb = { "@id": `${canonical}#breadcrumb` };
      graph.push({
        "@type": "BreadcrumbList",
        "@id": `${canonical}#breadcrumb`,
        itemListElement: trail.map((c, i) => ({
          "@type": "ListItem",
          position: i + 1,
          name: c.name,
          item: `${SITE_URL}${c.path}`,
        })),
      });
    }
    graph.push(pageNode);

    if (article) {
      graph.push({
        "@type": "BlogPosting",
        "@id": `${canonical}#article`,
        headline: title,
        description,
        image: ogImage,
        datePublished: article.datePublished,
        dateModified: article.dateModified ?? article.datePublished,
        articleSection: article.section,
        inLanguage: "en-US",
        mainEntityOfPage: { "@id": `${canonical}#webpage` },
        author: { "@id": ORGANIZATION_ID },
        publisher: { "@id": ORGANIZATION_ID },
      });
    }

    graph.push(...jsonLd);
  }

  return (
    <Helmet>
      <html lang="en" />
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <meta
        name="robots"
        content={noindex ? "noindex, nofollow" : "index, follow, max-image-preview:large, max-snippet:-1"}
      />
      {canonical && <link rel="canonical" href={canonical} />}

      <meta property="og:site_name" content={SITE_NAME} />
      <meta property="og:locale" content="en_US" />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      {canonical && <meta property="og:url" content={canonical} />}
      <meta property="og:type" content={article ? "article" : "website"} />
      <meta property="og:image" content={ogImage} />
      {article && <meta property="article:published_time" content={article.datePublished} />}
      {article && <meta property="article:section" content={article.section} />}

      <meta name="twitter:card" content={article ? "summary_large_image" : "summary"} />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage} />

      {graph.length > 0 && (
        <script type="application/ld+json">
          {JSON.stringify({ "@context": "https://schema.org", "@graph": graph })}
        </script>
      )}
    </Helmet>
  );
};
