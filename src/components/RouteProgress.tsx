import { useEffect, useState, useSyncExternalStore } from "react";
import { pageLoading } from "@/lib/lazyPage";

/* Fast loads never show the bar: it only appears after this delay. */
const SHOW_DELAY_MS = 150;

/**
 * A thin brand-red bar along the top of the viewport while a page chunk is
 * downloading. The current page stays on screen and usable underneath.
 */
export const RouteProgress = () => {
  const loading = useSyncExternalStore(pageLoading.subscribe, pageLoading.isLoading, () => false);
  const [phase, setPhase] = useState<"idle" | "loading" | "done">("idle");

  useEffect(() => {
    if (loading) {
      const timer = window.setTimeout(() => setPhase("loading"), SHOW_DELAY_MS);
      return () => window.clearTimeout(timer);
    }
    // Finish the bar, then fade it out.
    setPhase((current) => (current === "loading" ? "done" : current));
    const timer = window.setTimeout(() => setPhase("idle"), 400);
    return () => window.clearTimeout(timer);
  }, [loading]);

  return (
    <div
      role="progressbar"
      aria-label="Loading page"
      aria-hidden={phase !== "loading"}
      className={`pointer-events-none fixed inset-x-0 top-0 z-[100] h-[3px] transition-opacity duration-300 ${
        phase === "idle" ? "opacity-0" : "opacity-100"
      }`}
    >
      <div
        className={`h-full origin-left bg-brand-red shadow-[0_0_8px_hsl(var(--brand-red)/0.6)] motion-reduce:transition-none ${
          phase === "loading"
            ? "scale-x-[0.85] transition-transform duration-[8000ms] ease-out"
            : phase === "done"
              ? "scale-x-100 transition-transform duration-200 ease-out"
              : "scale-x-0"
        }`}
      />
    </div>
  );
};
