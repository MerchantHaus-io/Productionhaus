import { Button } from "./ui/button";
import { useState, useEffect } from "react";
import { ChevronDown } from "lucide-react";
import heroVideo from "@/assets/Hero.webm";

/*
 * Timing uses arbitrary properties: arbitrary values on the delay and duration
 * utilities clash with tailwindcss-animate's, so Tailwind silently drops them.
 */
const EASE = "[transition-timing-function:var(--ease-out)]";

/* Brand red: the headline's full stops are the hero's only colour accent. */
const Stop = () => <span className="text-brand-red">.</span>;

export const Hero = () => {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const timer = window.setTimeout(() => setIsLoaded(true), 100);
    return () => window.clearTimeout(timer);
  }, []);

  // The copy fades up 12px over 320ms; the CTAs follow 120ms later.
  const fadeUp = (delay: number) => ({
    className: `transition-[opacity,transform] [transition-duration:320ms] ${EASE} motion-reduce:transition-none ${
      isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3 motion-reduce:translate-y-0"
    }`,
    style: { transitionDelay: `${delay}ms` },
  });

  const copy = fadeUp(0);
  const actions = fadeUp(120);

  return (
    <section className="relative min-h-screen flex items-end overflow-hidden bg-neutral-dark">
      {/* Video background */}
      <div className="absolute inset-0 w-full h-full pointer-events-none">
        <video autoPlay loop muted playsInline className="h-full w-full object-cover" poster="/hero-dark-room.webp">
          <source src={heroVideo} type="video/webm" />
        </video>
        {/*
          The footage keeps its subjects in the upper half, so the copy sits low-left and
          the scrim is weighted there instead of dimming the whole frame.
        */}
        <div className="absolute inset-0 bg-black/25" />
        <div className="absolute inset-0 bg-gradient-to-tr from-black/85 via-black/45 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-black/70 to-transparent" />
      </div>

      {/* Copy, anchored bottom-left */}
      <div className="relative z-10 w-full px-6 md:px-16 lg:px-24 pt-24 pb-[120px]">
        <div className={`max-w-[920px] ${copy.className}`} style={copy.style}>
          <p className="mb-6 text-[13px] font-black uppercase leading-4 tracking-[0.12em] text-brand-slate">
            Payment infrastructure
          </p>

          <h1 className="font-display text-brand-cream leading-[0.98] text-[clamp(2.9rem,9vw,6.5rem)]">
            Plug in
            <Stop />
            <br />
            Play and <em className="italic text-brand-cream/80">process</em>
            <Stop />
          </h1>

          <p className="mt-8 max-w-[640px] text-lg sm:text-[22px] sm:leading-8 font-light text-white/85">
            Integrated payments. Enterprise performance.
          </p>
          <p className="mt-3 max-w-xl text-base leading-[25px] font-light text-white/70">
            Deploy a unified payment gateway in days — supporting cards, ACH, and secure pay links across every channel
            your organization operates.
          </p>
        </div>

        <div className={`mt-10 flex flex-col gap-3 sm:flex-row ${actions.className}`} style={actions.style}>
          <Button asChild variant="light" size="lg">
            <a href="https://ops-terminal.merchant.haus/contact">Get started</a>
          </Button>
          <Button asChild variant="light-outline" size="lg">
            <a href="/#contact">Contact sales</a>
          </Button>
        </div>
      </div>

      {/* Scroll indicator */}
      <div
        className={`absolute bottom-6 left-1/2 -translate-x-1/2 z-10 transition-opacity duration-300 [transition-delay:600ms] ${
          isLoaded ? "opacity-100" : "opacity-0"
        }`}
      >
        <ChevronDown className="w-6 h-6 text-white/40 animate-bounce motion-reduce:animate-none" />
      </div>
    </section>
  );
};
