import { Button } from "./ui/button";
import { useState, useEffect, type ReactNode } from "react";
import { ChevronDown } from "lucide-react";
import heroVideo from "@/assets/Hero.webm";

/* Same pairing as the Services page hero; both families are loaded in index.html. */
const serif = { fontFamily: "'DM Serif Display', serif" };
const sans = { fontFamily: "'Sora', sans-serif" };

/*
 * Timing uses arbitrary properties: arbitrary values on the delay and duration
 * utilities clash with tailwindcss-animate's, so Tailwind silently drops them.
 */
const EASE = "[transition-timing-function:cubic-bezier(0.22,1,0.36,1)]";

/**
 * One headline line that rises out of a mask. The wrapper clips the line while
 * it sits below; the padding/negative margin keep descenders and the italic
 * overhang inside the clip without shifting the layout.
 */
const RevealLine = ({ shown, delay, children }: { shown: boolean; delay: number; children: ReactNode }) => (
  <span className="block overflow-hidden pb-[0.14em] -mb-[0.14em] pr-[0.12em] -mr-[0.12em]">
    <span
      className={`block transition-transform [transition-duration:1100ms] ${EASE} motion-reduce:transition-none ${
        shown ? "translate-y-0" : "translate-y-[110%] motion-reduce:translate-y-0"
      }`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </span>
  </span>
);

/* Brand red from the shield logo (the `crimson` theme token is a near-black grey). */
const Stop = () => <span className="text-[#DC143C]">.</span>;

export const Hero = () => {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const timer = window.setTimeout(() => setIsLoaded(true), 100);
    return () => window.clearTimeout(timer);
  }, []);

  const fadeUp = (delay: string) =>
    `transition-all duration-700 ${delay} ${EASE} motion-reduce:transition-none ${
      isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4 motion-reduce:translate-y-0"
    }`;

  return (
    <section className="relative min-h-screen flex items-end overflow-hidden bg-neutral-900" style={sans}>
      {/* Video Background */}
      <div className="absolute inset-0 w-full h-full pointer-events-none">
        <video autoPlay loop muted playsInline className="h-full w-full object-cover" poster="/hero-dark-room.webp">
          <source src={heroVideo} type="video/webm" />
        </video>
        {/*
          The footage keeps its subjects in the upper half, so the copy sits low-left and
          the shading is concentrated there instead of dimming the whole frame.
        */}
        <div className="absolute inset-0 bg-black/25" />
        <div className="absolute inset-0 bg-gradient-to-tr from-black/85 via-black/45 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-black/70 to-transparent" />
      </div>

      {/* Copy, anchored bottom-left */}
      <div className="relative z-10 w-full px-6 md:px-16 lg:px-24 pt-32 pb-24 md:pb-28">
        <div className="max-w-4xl">
          {/* Eyebrow */}
          <div className={`flex items-center gap-3 mb-6 md:mb-8 ${fadeUp("delay-100")}`}>
            <span
              className={`block h-px bg-white/50 transition-all duration-700 delay-200 ${EASE} ${
                isLoaded ? "w-8" : "w-0"
              }`}
            />
            <span className="text-[11px] md:text-xs tracking-[0.22em] uppercase text-white/70">
              Payment infrastructure
            </span>
          </div>

          {/* Headline */}
          <h1
            className="text-white font-normal leading-[0.98] tracking-[-0.01em] text-[clamp(2.9rem,10.5vw,7.25rem)]"
            style={serif}
          >
            <RevealLine shown={isLoaded} delay={250}>
              Plug in<Stop />
            </RevealLine>
            <RevealLine shown={isLoaded} delay={420}>
              Play and <em className="italic text-white/85">process</em>
              <Stop />
            </RevealLine>
          </h1>

          {/* Subheadline */}
          <p className={`mt-7 md:mt-9 text-lg sm:text-xl md:text-2xl text-white/85 font-light tracking-wide ${fadeUp("[transition-delay:900ms]")}`}>
            Integrated payments. Enterprise performance.
          </p>

          {/* Body Text */}
          <p className={`mt-3 text-sm sm:text-base text-white/65 max-w-xl leading-relaxed font-light ${fadeUp("[transition-delay:1050ms]")}`}>
            Deploy a unified payment gateway in days — supporting cards, ACH, and secure pay links across every channel your organization operates.
          </p>

          {/* CTA */}
          <div className={`pt-8 ${fadeUp("[transition-delay:1200ms]")}`}>
            <Button
              asChild
              size="lg"
              className="bg-white text-black hover:bg-white/90 font-medium text-base px-10 py-6 rounded-none tracking-wide transition-all w-full sm:w-auto"
              style={sans}
            >
              <a href="https://ops-terminal.merchant.haus/contact">Get Started</a>
            </Button>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div
        className={`absolute bottom-6 left-1/2 -translate-x-1/2 z-10 transition-opacity duration-700 [transition-delay:1500ms] ${
          isLoaded ? "opacity-100" : "opacity-0"
        }`}
      >
        <ChevronDown className="w-6 h-6 text-white/40 animate-bounce motion-reduce:animate-none" />
      </div>
    </section>
  );
};
