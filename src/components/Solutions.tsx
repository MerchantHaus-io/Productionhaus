import type { LucideIcon } from "lucide-react";
import {
  BarChart2,
  CreditCard,
  Globe,
  Lock,
  Repeat,
  ShieldAlert,
  ShieldCheck,
  ShoppingCart,
  Smartphone,
  Shuffle,
  X,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Button } from "./ui/button";
import shieldLogo from "@/assets/shield.webp";

type Solution = {
  icon: LucideIcon;
  title: string;
  description: string;
  fullDescription: string;
  borderColor: string;
  buttonColor: string;
  bannerImage?: string;
};

/* NOTE: Keeping solutions inline is fine since it's not exported.
   We only change rendering to 16:9 and single-pass mapping. */
const solutions: Solution[] = [
  {
    icon: CreditCard,
    title: "Payment processing",
    description:
      "Accept all major credit cards, debit cards, and digital wallets with competitive rates and rapid settlements.",
    fullDescription:
      "Our comprehensive payment processing solution enables organizations to accept all major credit cards, debit cards, and digital wallets seamlessly. With competitive transaction rates, rapid settlements, and advanced reconciliation tools, you can streamline your payment operations and improve cash flow. Our platform supports EMV chip cards, contactless payments, and mobile wallets like Apple Pay and Google Pay. Get real-time reporting, automated invoicing, and dedicated support available 24/7.",
    borderColor: "border-foreground",
    buttonColor: "bg-primary hover:bg-primary/90",
    bannerImage: "/card-banners/card1.webp",
  },
  {
    icon: ShieldAlert,
    title: "Advanced fraud detection",
    description: "Protect your organization and your customers with our multi-layered fraud prevention system.",
    fullDescription:
      "Stay protected with our multi-layered fraud prevention system featuring AI-powered transaction monitoring, real-time risk assessment, and advanced encryption protocols. Our system automatically flags suspicious activities, uses machine learning to detect patterns, and provides customizable security rules. Features include 3D Secure authentication, tokenization, PCI DSS Level 1 compliance, and chargeback management tools. Reduce fraud losses while maintaining a frictionless transaction experience with intelligent risk scoring.",
    borderColor: "border-green-600",
    buttonColor: "bg-green-600 hover:bg-green-600/90",
    bannerImage: "/card-banners/card2.webp",
  },
  {
    icon: Smartphone,
    title: "Mobile solutions",
    description: "Process payments anywhere with our mobile-ready technology and POS systems for distributed operations.",
    fullDescription:
      "Transform any smartphone or tablet into a powerful point-of-sale system with our mobile payment solutions. Built for organizations with distributed operations, our mobile POS accepts payments anywhere with reliable offline mode capabilities. Features include inventory management, customer relationship tools, digital receipts, tip management, and split payment options. Compatible with Bluetooth card readers and supports both iOS and Android devices. Ideal for field service providers, events, distributed teams, and multi-location organizations.",
    borderColor: "border-orange-400",
    buttonColor: "bg-orange-400 hover:bg-orange-400/90",
    bannerImage: "/card-banners/card4.webp",
  },
  {
    icon: Globe,
    title: "Global payments",
    description: "Expand internationally with multi-currency support and local payment methods in over 200 countries.",
    fullDescription:
      "Expand your business globally with our international payment infrastructure supporting 135+ currencies and local payment methods across 200+ countries. Accept popular regional payment methods including Alipay, WeChat Pay, iDEAL, and SEPA transfers. Features include automatic currency conversion, dynamic currency conversion at checkout, multi-currency settlements, and local acquiring to reduce cross-border fees. Our platform handles complex tax calculations, compliance requirements, and provides localized checkout experiences to maximize conversion rates in every market.",
    borderColor: "border-emerald-600",
    buttonColor: "bg-emerald-600 hover:bg-emerald-600/90",
    bannerImage: "/card-banners/card5.webp",
  },
  {
    icon: Lock,
    title: "Network tokenization",
    description: "Enhance payment security and approval rates with network tokenization.",
    fullDescription:
      "Enhance payment security and approval rates with network tokenization. By replacing sensitive card data with unique, encrypted tokens, you minimize the risk of breaches and keep recurring payments running smoothly—even when cards are updated or replaced. Features include up to 3% increase in transaction approvals, reduces PCI compliance burdens, automatic card updater to prevent failed recurring payments, and vault-stored tokens for maximum safety.",
    borderColor: "border-indigo-600",
    buttonColor: "bg-indigo-600 hover:bg-indigo-600/90",
    bannerImage: "/card-banners/card6.webp",
  },
  {
    icon: ShoppingCart,
    title: "Ecommerce solutions",
    description: "Launch and scale your online payment acceptance with enterprise-grade ecommerce tools.",
    fullDescription:
      "Launch and scale your online payment acceptance with enterprise-grade ecommerce tools that keep you agile and secure. From payment gateways to customizable checkout experiences, we give you everything you need to sell, scale, and maintain compliance — without the engineering overhead. Features include pre-built integrations with leading commerce platforms, customizable checkout pages for any brand, secure PCI-compliant transactions, and advanced tools that help organizations grow 35% faster.",
    borderColor: "border-purple-600",
    buttonColor: "bg-purple-600 hover:bg-purple-600/90",
    bannerImage: "/card-banners/card7.webp",
  },
  {
    icon: BarChart2,
    title: "Data and analytics",
    description: "Unlock powerful insights from your transaction data with real-time analytics.",
    fullDescription:
      "Unlock powerful insights from your transaction data. Our analytics dashboard transforms complex data into actionable trends, letting you track volume, authorization rates, and performance metrics in real time — no spreadsheets, no guesswork. Features include live dashboards with instant transaction and refund metrics, custom reporting by product, channel, or region, segmentation and portfolio analytics. Organizations with analytics tools make decisions 2x faster.",
    borderColor: "border-blue-600",
    buttonColor: "bg-blue-600 hover:bg-blue-600/90",
    bannerImage: "/card-banners/card10.webp",
  },
  {
    icon: Repeat,
    title: "Subscription billing",
    description: "Automate your billing and grow your subscription base with smart recurring revenue tools.",
    fullDescription:
      "Automate your billing and grow your subscription base with tools that handle the complexity for you. Create, manage, and optimize plans—while smart dunning and card updating keep your revenue steady. Features include flexible trial, renewal, and proration options, automated failed payment recovery, card updater and retry logic to reduce churn. 46% of consumers pay for at least one subscription service, making this a crucial revenue stream.",
    borderColor: "border-amber-500",
    buttonColor: "bg-amber-500 hover:bg-amber-500/90",
    bannerImage: "/card-banners/subscriptions.webp",
  },
  {
    icon: ShieldCheck,
    title: "Chargeback management",
    description: "Win more disputes and keep more revenue with automated chargeback management.",
    fullDescription:
      "Don't let disputes eat into your bottom line. Our automated system tracks, compiles, and submits evidence on your behalf, making it easier to contest chargebacks and reclaim lost revenue. Features include real-time chargeback alerts, 20% higher reversal rates with rapid response, integrated evidence templates for major card brands, and analytics to spot and stop patterns before they repeat.",
    borderColor: "border-indigo-700",
    buttonColor: "bg-indigo-700 hover:bg-indigo-700/90",
    bannerImage: "/card-banners/chargebacks.webp",
  },
  {
    icon: Shuffle,
    title: "Payment orchestration",
    description: "Smart routing for better approvals, lower costs, and optimized payment paths.",
    fullDescription:
      "Connect to multiple payment processors and dynamically route every transaction for the best outcome — lower fees, higher approval rates, fewer declines. Control your entire payment stack without added engineering overhead. Features include lower transaction costs by up to 20%, built-in failover for always-on acceptance, unified reporting across all channels and providers, and automatic optimization of every payment path.",
    borderColor: "border-teal-600",
    buttonColor: "bg-teal-600 hover:bg-teal-600/90",
    bannerImage: "/card-banners/card4.webp",
  },
];

export const Solutions = () => {
  const [selectedCard, setSelectedCard] = useState<number | null>(null);
  const [typewriterText, setTypewriterText] = useState("");
  const marqueeRef = useRef<HTMLDivElement | null>(null);
  const cardRefs = useRef<(HTMLElement | null)[]>([]);
  const scrollPositionRef = useRef(0);
  const animationFrameRef = useRef<number | null>(null);
  const isPausedRef = useRef(false);
  // Where an arrow-driven scroll is heading, so rapid clicks queue up instead of
  // restarting from a half-finished scroll position.
  const scrollTargetRef = useRef<number | null>(null);
  const scrollIdleTimerRef = useRef<number | null>(null);

  // Typewriter effect for modal title
  useEffect(() => {
    if (selectedCard !== null) {
      const fullText = solutions[selectedCard].title;
      setTypewriterText("");
      let index = 0;

      const interval = setInterval(() => {
        if (index <= fullText.length) {
          setTypewriterText(fullText.slice(0, index));
          index++;
        } else {
          clearInterval(interval);
        }
      }, 100);

      return () => clearInterval(interval);
    }
  }, [selectedCard]);

  // Prevent background scrolling when modal is open
  useEffect(() => {
    const { body } = document;
    const previousOverflow = body.style.overflow;

    if (selectedCard !== null) {
      body.style.overflow = "hidden";
    } else {
      body.style.overflow = previousOverflow;
    }

    return () => {
      body.style.overflow = previousOverflow;
    };
  }, [selectedCard]);

  // Arrow navigation: move exactly one card (card width + gap) per click, aligned to
  // the card edges, so the strip never stops with a card half off screen.
  const scrollByCard = (direction: 1 | -1) => {
    const container = marqueeRef.current;
    const firstCard = cardRefs.current[0];
    if (!container || !firstCard) return;

    const track = firstCard.parentElement;
    const gap = track ? parseFloat(getComputedStyle(track).columnGap) || 0 : 0;
    const step = firstCard.offsetWidth + gap;
    const maxScroll = container.scrollWidth - container.clientWidth;
    const from = scrollTargetRef.current ?? container.scrollLeft;
    const target = Math.min(maxScroll, Math.max(0, (Math.round(from / step) + direction) * step));

    scrollTargetRef.current = target;
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    container.scrollTo({ left: target, behavior: reduceMotion ? "auto" : "smooth" });
  };

  const scrollLeft = () => scrollByCard(-1);
  const scrollRight = () => scrollByCard(1);

  // Pause on hover handlers are left in place but currently unused
  const handleMarqueeMouseEnter = () => {
    // intentionally blank
  };

  const handleMarqueeMouseLeave = () => {
    // intentionally blank
  };

  // Forget the queued arrow target once scrolling settles, so the next click starts
  // from wherever a swipe left the strip.
  useEffect(() => {
    const container = marqueeRef.current;
    if (!container) return;

    const handleScroll = () => {
      if (scrollIdleTimerRef.current !== null) window.clearTimeout(scrollIdleTimerRef.current);
      scrollIdleTimerRef.current = window.setTimeout(() => {
        scrollTargetRef.current = null;
      }, 150);
    };

    container.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      if (scrollIdleTimerRef.current !== null) window.clearTimeout(scrollIdleTimerRef.current);
      container.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const handleCardClick = (index: number) => {
    setSelectedCard(index);
  };

  const closeFullscreen = () => {
    setSelectedCard(null);
  };

  const handleGetStarted = () => {
    closeFullscreen();
    window.location.href = "/#contact";
  };

  return (
    <section id="services" className="py-24 px-6 md:px-16 lg:px-24 bg-background relative overflow-visible border-t border-border">
      {/* Minimal shield logo */}
      <div className="relative mb-16 z-20 pointer-events-none">
        <div className="flex justify-center">
          <img
            src={shieldLogo}
            alt="MerchantHaus Shield"
            className="h-24 w-24 md:h-32 md:w-32 object-contain opacity-80"
          />
        </div>
      </div>
      <div className="overflow-visible relative z-10">
        <div className="text-center mb-16 animate-fade-in">
          <h2 className="font-display text-[40px] leading-[44px] md:text-[52px] md:leading-[56px] text-heading mb-4">
            Core services
          </h2>
          <p className="text-lg leading-[27px] text-muted-foreground max-w-2xl mx-auto mb-8 font-light">
            Comprehensive payment solutions designed to help your organization thrive in today's digital economy.
          </p>
          <Button asChild variant="cta" size="lg">
            <a href="/quote">Get a quote</a>
          </Button>
        </div>
        <div className="relative">
          <div 
            ref={marqueeRef}
            className="marquee-container overflow-x-auto"
            onMouseEnter={handleMarqueeMouseEnter}
            onMouseLeave={handleMarqueeMouseLeave}
          >
            <div className="marquee-content flex gap-4">
              {solutions.map((solution, index) => {
                const Icon = solution.icon;
                return (
                  <article
                    key={`${solution.title}-${index}`}
                    ref={(el) => {
                      cardRefs.current[index] = el;
                    }}
                    className="group flex min-h-[280px] w-[280px] md:w-[320px] flex-shrink-0 snap-start flex-col gap-4 rounded-2xl border border-border bg-card p-8 transition-[border-color,box-shadow] duration-200 ease-brand hover:border-input hover:shadow-md"
                  >
                    <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-muted">
                      <Icon className="h-7 w-7 text-foreground" aria-hidden="true" />
                    </div>
                    <h3 className="text-[22px] font-bold leading-7 tracking-[-0.015em] text-heading">{solution.title}</h3>
                    <p className="text-[15px] leading-[22px] text-muted-foreground">{solution.description}</p>
                    <button
                      type="button"
                      onClick={() => handleCardClick(index)}
                      className="mt-auto inline-flex items-center gap-1.5 self-start rounded-sm text-sm font-semibold text-primary-text ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                      aria-label={`Learn more about ${solution.title.toLowerCase()}`}
                    >
                      Learn more
                      <ArrowRight className="h-4 w-4 transition-transform duration-200 ease-brand group-hover:translate-x-0.5" aria-hidden="true" />
                    </button>
                  </article>
                );
              })}
            </div>
          </div>
          {/* Navigation buttons */}
          <div className="flex justify-between items-center mt-6 px-4">
            <button
              onClick={scrollLeft}
              className="nav-arrow-button"
              aria-label="Scroll left"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <button
              onClick={scrollRight}
              className="nav-arrow-button"
              aria-label="Scroll right"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </div>
        </div>
        {/* Services Banner Link. The banner's top edge is transparent, so the shadow is a
            drop-shadow filter that follows its shape rather than a box-shadow rectangle. */}
        <a
          href="/services"
          className="block mt-12 mx-auto max-w-4xl overflow-hidden rounded-2xl drop-shadow-lg transition-all duration-300 hover:drop-shadow-2xl hover:scale-[1.02] group"
        >
          <img
            src="/images/services-banner.webp"
            alt="Merchant Haus services: maximize every approval with network tokens and automated 3DS. Explore our services."
            className="w-full h-auto object-cover transition-transform duration-300 group-hover:scale-105"
          />
        </a>
      </div>
      {/* Fullscreen Modal with Flip Animation. Portalled to <body>: the section sits in a
          transformed <Reveal> wrapper, which would otherwise size this fixed overlay to the
          section instead of the viewport and push the card's buttons off screen. */}
      {selectedCard !== null && createPortal(
        <div
          className="fixed inset-0 z-50 bg-black/40 flex items-start justify-center p-4 sm:p-6 animate-fade-in overflow-y-auto"
          onClick={closeFullscreen}
        >
          <div
            className="relative max-w-4xl w-full my-auto max-h-[calc(100dvh-2rem)] sm:max-h-[calc(100dvh-3rem)] rounded-lg border border-border bg-card shadow-xl overflow-hidden flex flex-col"
            onClick={(e) => e.stopPropagation()}
            style={{ animation: 'solutionsFadeUp var(--dur-slow) var(--ease-out)' }}
          >
            {/* Banner Image in Modal */}
            {solutions[selectedCard].bannerImage && (
              /*
               * The fullscreen modal banner image should occupy less vertical
               * space relative to its width. Changing the aspect ratio from
               * 16/9 to 3/1 makes the banner significantly shallower on small
               * screens while desktop-specific CSS widens it back toward a
               * 4/3 framing to mirror the mobile composition.
               */
              <div className="solutions-modal-banner relative w-full aspect-[3/1] overflow-hidden shrink-0">
                <img
                  src={solutions[selectedCard].bannerImage}
                  alt={solutions[selectedCard].title}
                  className="absolute inset-0 h-full w-full object-cover"
                  draggable={false}
                />
              </div>
            )}
            {/* Close button */}
            <button
              onClick={closeFullscreen}
              aria-label="Close"
              className="absolute top-4 right-4 z-10 inline-flex h-8 w-8 items-center justify-center rounded-md bg-card/90 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <X className="h-4 w-4" />
            </button>
            <div className="p-6 sm:p-8 overflow-y-auto flex-1 min-h-0">
              {/* Large icon */}
              <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-xl bg-muted">
                {(() => {
                  const Icon = solutions[selectedCard].icon;
                  return <Icon className="h-7 w-7 text-foreground" aria-hidden="true" />;
                })()}
              </div>
              {/* Content with typewriter effect */}
              <h2 className="text-[28px] font-bold leading-9 tracking-[-0.01em] text-heading mb-4 min-h-9">
                {typewriterText}
                <span className="animate-pulse">|</span>
              </h2>
              <p className="text-base leading-[25px] font-light text-muted-foreground">
                {solutions[selectedCard].fullDescription}
              </p>
            </div>
            {/* CTA Buttons - Fixed at bottom */}
            <div className="shrink-0 px-6 py-5 sm:px-8 border-t border-border bg-card">
              <div className="flex flex-col sm:flex-row sm:justify-end gap-3">
                <Button variant="outline" onClick={closeFullscreen} className="sm:order-1">
                  Close
                </Button>
                <Button onClick={handleGetStarted} className="sm:order-2">
                  Get started
                </Button>
              </div>
            </div>
          </div>
        </div>,
        document.body
      )}
      <style>{`
        @keyframes solutionsFadeUp {
          from {
            transform: translateY(12px);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }
      `}</style>
    </section>
  );
};
