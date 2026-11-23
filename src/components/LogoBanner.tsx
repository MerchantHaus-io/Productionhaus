import { useState, type CSSProperties, type ReactNode } from "react";
import { Pause, Play } from "lucide-react";
import { RevealGroup, RevealWords } from "@/components/Reveal";
import { reveal } from "@/lib/reveal";

/**
 * `file` is drawn on light backgrounds; `darkFile`, when present, replaces it in
 * dark mode (logos whose wordmark is black or charcoal). `width`/`height` are the
 * file's trimmed pixel size, used for sizing and to reserve space before load.
 */
type Logo = { file: string; darkFile?: string; name: string; width: number; height: number };

const logos: Logo[] = [
  { file: "clover.svg", name: "Clover", width: 164, height: 40 },
  { file: "freshbooks.webp", darkFile: "freshbooks-on-dark.webp", name: "FreshBooks", width: 600, height: 130 },
  { file: "gohighlevel.webp", darkFile: "gohighlevel-on-dark.webp", name: "GoHighLevel", width: 600, height: 136 },
  { file: "hubspot.webp", darkFile: "hubspot-on-dark.webp", name: "HubSpot", width: 600, height: 171 },
  { file: "keap.webp", name: "Keap", width: 389, height: 180 },
  { file: "magento.webp", darkFile: "magento-on-dark.webp", name: "Magento", width: 536, height: 180 },
  { file: "mastercard.webp", name: "Mastercard", width: 291, height: 180 },
  { file: "ncr.webp", name: "NCR", width: 600, height: 172 },
  { file: "nmi.webp", darkFile: "nmi-on-dark.webp", name: "NMI", width: 124, height: 40 },
  { file: "quickbooks.webp", darkFile: "quickbooks-on-dark.webp", name: "QuickBooks", width: 600, height: 154 },
  { file: "salesforce.webp", name: "Salesforce", width: 258, height: 180 },
  { file: "shopify.webp", darkFile: "shopify-on-dark.webp", name: "Shopify", width: 600, height: 172 },
  { file: "squarespace.webp", darkFile: "squarespace-on-dark.webp", name: "Squarespace", width: 600, height: 86 },
  { file: "visa.webp", name: "Visa", width: 555, height: 180 },
  { file: "wix.webp", darkFile: "wix-on-dark.webp", name: "Wix", width: 463, height: 180 },
  { file: "zoho_crm.webp", darkFile: "zoho_crm-on-dark.webp", name: "Zoho CRM", width: 419, height: 180 },
  { file: "kurvs.svg", darkFile: "kurvs-on-dark.svg", name: "Kurvs", width: 120, height: 32 },
  { file: "tami.webp", darkFile: "tami-on-dark.webp", name: "TAMI", width: 500, height: 105 },
  { file: "improv-learning.webp", darkFile: "improv-learning-on-dark.webp", name: "IMPROV Learning", width: 219, height: 46 },
];

/**
 * Logos are sized to a shared visual area rather than a shared height, so a wide
 * wordmark (Squarespace) and a near-square mark (Mastercard) carry similar weight.
 * Width = sqrt(area × aspect ratio), scaled per breakpoint by `--logo-scale` on
 * the grid; the slot's max-width still caps it.
 */
const LOGO_AREA_PX = 3600;

/**
 * Processors we connect to (the full list is on /supported-processors), shown in
 * one colour so the marks sit together on light and dark. A `wordmark` already
 * spells the name; a `symbol` is shown with the name beside it; with neither, the
 * name is set in type until a logo file is supplied. Files are in /logos/processors;
 * `width`/`height` are each wordmark's trimmed viewBox, for sizing and layout.
 */
type Processor = {
  name: string;
  wordmark?: { file: string; width: number; height: number };
  symbol?: string;
};

const processors: Processor[] = [
  { name: "Fiserv (First Data)", wordmark: { file: "fiserv.svg", width: 239, height: 120 } },
  { name: "Worldpay", wordmark: { file: "worldpay.svg", width: 208, height: 49 } },
  { name: "TSYS" },
  { name: "Global Payments", wordmark: { file: "global-payments.svg", width: 208, height: 33 } },
  { name: "Elavon", symbol: "elavon.svg" },
  { name: "Chase Paymentech", symbol: "chase.svg" },
  { name: "Heartland" },
  { name: "Paysafe", symbol: "paysafe.svg" },
];

/* Wordmarks share a visual area, like the partner logos above, so wide and compact marks carry similar weight. */
const PROCESSOR_AREA_PX = 1800;
/* Black on the light page, white on the dark one, whatever the file's own colours. */
const monochrome = "brightness-0 dark:invert";

const ProcessorMark = ({ processor }: { processor: Processor }) => {
  const { name, wordmark, symbol } = processor;
  if (wordmark) {
    const width = Math.round(Math.sqrt(PROCESSOR_AREA_PX * (wordmark.width / wordmark.height)));
    return (
      <img
        src={`/logos/processors/${wordmark.file}`}
        alt=""
        width={wordmark.width}
        height={wordmark.height}
        loading="lazy"
        decoding="async"
        className={`h-auto max-w-full ${monochrome}`}
        style={{ width }}
      />
    );
  }
  return (
    <span className="inline-flex items-center gap-2 whitespace-nowrap text-[15px] font-semibold tracking-[-0.01em] text-foreground">
      {symbol && (
        <img
          src={`/logos/processors/${symbol}`}
          alt=""
          width={22}
          height={22}
          loading="lazy"
          decoding="async"
          className={`h-[22px] w-[22px] ${monochrome}`}
        />
      )}
      {name}
    </span>
  );
};

const LogoMark = ({ logo }: { logo: Logo }) => {
  const width = Math.round(Math.sqrt(LOGO_AREA_PX * (logo.width / logo.height)));
  const imgProps = {
    alt: "",
    loading: "lazy" as const,
    decoding: "async" as const,
    width: logo.width,
    height: logo.height,
    style: { width: `calc(${width}px * var(--logo-scale, 1))` },
  };
  const imgClass = "h-auto max-w-full object-contain";

  if (!logo.darkFile) {
    return <img src={`/logos/${logo.file}`} className={imgClass} {...imgProps} />;
  }

  return (
    <>
      <img src={`/logos/${logo.file}`} className={`${imgClass} dark:hidden`} {...imgProps} />
      <img src={`/logos/${logo.darkFile}`} className={`${imgClass} hidden dark:block`} {...imgProps} />
    </>
  );
};

/**
 * Three marquee rows that drift in alternate directions: two of partner
 * platforms (in their own colours) and one of processors (monochrome), so the
 * two groups read apart without needing a heading each.
 *
 * Each track holds its items twice and slides by exactly half its width, so the
 * loop is seamless. Spacing is padding on each item rather than flex `gap`,
 * which keeps the two copies the same width and the -50% offset exact.
 */
const SECONDS_PER_ITEM = 4.5;

const half = Math.ceil(logos.length / 2);
const partnerRows = [logos.slice(0, half), logos.slice(half)];

type MarqueeRowProps = {
  items: ReactNode[];
  direction: "left" | "right";
  paused: boolean;
  /* Small per-row variation so the rows never move in lockstep. */
  speed?: number;
  className?: string;
};

/* Rows slide in from the side they travel from, a little further than a plain reveal. */
const ROW_ENTRANCE: CSSProperties = { "--reveal-distance": "120px", "--reveal-duration": "1100ms" } as CSSProperties;

const MarqueeRow = ({ items, direction, paused, speed = 1, className = "" }: MarqueeRowProps) => {
  const duration = `${Math.round(items.length * SECONDS_PER_ITEM * speed)}s`;
  const renderCopy = (copy: number) =>
    items.map((item, index) => (
      <li
        key={`${copy}-${index}`}
        className={`flex shrink-0 items-center justify-center px-6 md:px-9 ${
          copy === 1 ? "motion-reduce:hidden" : ""
        }`}
      >
        {item}
      </li>
    ));

  return (
    <div
      {...reveal(direction)}
      style={ROW_ENTRANCE}
      className={`relative overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)] motion-reduce:[mask-image:none] ${className}`}
    >
      <ul
        className={`flex w-max items-center ${
          direction === "left" ? "animate-marquee-left" : "animate-marquee-right"
        } ${paused ? "[animation-play-state:paused]" : ""} motion-reduce:w-full motion-reduce:animate-none motion-reduce:flex-wrap motion-reduce:justify-center motion-reduce:gap-y-4`}
        style={{ animationDuration: duration }}
      >
        {renderCopy(0)}
        {renderCopy(1)}
      </ul>
    </div>
  );
};

/*
 * The rows used to pause on hover, but a resting cursor (or a tap on touch
 * screens) left them frozen. They now always run unless the visitor presses
 * Pause, which also gives the moving content the control WCAG 2.2.2 asks for.
 */
const LogoBanner = () => {
  const [paused, setPaused] = useState(false);

  return (
  <RevealGroup as="section" className="py-20 overflow-hidden border-b border-border">
    <div className="px-6 md:px-16 lg:px-24 mb-12">
      <div className="text-center">
        <p {...reveal("words")} className="font-ubuntu text-3xl md:text-4xl font-bold tracking-tight text-foreground mb-3">
          <RevealWords text="Platforms and processors" />
        </p>
        <p {...reveal("up", 120)} className="font-inter text-base md:text-lg text-muted-foreground max-w-2xl mx-auto font-light">
          Plug into the software you already use and the processor you already have
        </p>
      </div>
    </div>

    {/* Decorative motion; the sr-only lists below name every partner and processor once. */}
    <div className="mx-auto max-w-7xl space-y-6 md:space-y-8 [--logo-scale:0.9] md:[--logo-scale:1.05]" aria-hidden="true">
      <MarqueeRow
        paused={paused}
        direction="left"
        items={partnerRows[0].map((logo) => (
          <div key={logo.name} className="flex h-14 md:h-16 items-center">
            <LogoMark logo={logo} />
          </div>
        ))}
      />
      <MarqueeRow
        paused={paused}
        direction="right"
        speed={1.12}
        items={partnerRows[1].map((logo) => (
          <div key={logo.name} className="flex h-14 md:h-16 items-center">
            <LogoMark logo={logo} />
          </div>
        ))}
      />
      <MarqueeRow
        paused={paused}
        direction="left"
        speed={1.25}
        className="opacity-80"
        items={processors.map((processor) => (
          <div key={processor.name} className="flex h-10 items-center">
            <ProcessorMark processor={processor} />
          </div>
        ))}
      />
    </div>

    {/* Static under reduced motion, so there is nothing to pause. */}
    <div className="mt-6 flex justify-center motion-reduce:hidden">
      <button
        type="button"
        onClick={() => setPaused((value) => !value)}
        aria-pressed={paused}
        className="inline-flex items-center gap-1.5 rounded-pill px-3 py-1.5 text-xs font-semibold text-muted-foreground ring-offset-background transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
      >
        {paused ? <Play className="h-3.5 w-3.5" aria-hidden="true" /> : <Pause className="h-3.5 w-3.5" aria-hidden="true" />}
        {paused ? "Play logos" : "Pause logos"}
      </button>
    </div>

    <div className="sr-only">
      <h3>Platforms and partners</h3>
      <ul>
        {logos.map((logo) => (
          <li key={logo.name}>{logo.name}</li>
        ))}
      </ul>
      <h3>Processors we connect to</h3>
      <ul>
        {processors.map(({ name }) => (
          <li key={name}>{name}</li>
        ))}
      </ul>
    </div>
    <div {...reveal("fade")} className="px-6 md:px-16 lg:px-24 mt-10 text-center">
      <a
        href="/supported-processors"
        className="text-sm font-semibold text-primary-text underline underline-offset-4 hover:no-underline"
      >
        See all supported processors
      </a>
    </div>
  </RevealGroup>
  );
};

export default LogoBanner;
