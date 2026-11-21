import { useEffect, useLayoutEffect, useRef } from "react";

/*
 * Scroll reveals, driven by CSS (see "Scroll reveals" in src/index.css).
 *
 * A group element observes every `[data-reveal]` item inside it (or itself, if
 * it is one). Items that enter the viewport together are revealed together and
 * staggered in DOM order, so a grid cascades when it first scrolls in and a
 * card that arrives later animates on its own instead of waiting on a timer.
 *
 * Nothing is hidden until this runs in the browser: the prerendered HTML, a
 * crawler, a print and a reader with reduced motion all get the content as is.
 * The group is armed in a layout effect, before the first paint, so there is no
 * flash of content that then disappears.
 */

type RevealOptions = {
  /* Fraction of an item that must be visible. Kept at 0 by default: tall items still trigger. */
  threshold?: number;
  /* Shrinks the viewport's bottom edge, so items reveal once they are properly on screen. */
  rootMargin?: string;
};

/* Upper bound for one batch to finish: the longest stagger, a child's own delay and the longest animation. */
const SETTLE_MS = 4000;

const useIsomorphicLayoutEffect = typeof window === "undefined" ? useEffect : useLayoutEffect;

export const useRevealGroup = <T extends HTMLElement = HTMLElement>({
  threshold = 0,
  rootMargin = "0px 0px -12% 0px",
}: RevealOptions = {}) => {
  const ref = useRef<T | null>(null);

  useIsomorphicLayoutEffect(() => {
    const group = ref.current;
    if (!group) return;
    if (typeof IntersectionObserver === "undefined") return;
    if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) return;

    const items = group.matches("[data-reveal]")
      ? [group]
      : Array.from(group.querySelectorAll<HTMLElement>("[data-reveal]"));
    const pending = items.filter((item) => !item.hasAttribute("data-revealed"));
    if (pending.length === 0) return;

    let settleTimer = 0;
    let remaining = pending.length;

    group.setAttribute("data-reveal-armed", "");

    const observer = new IntersectionObserver(
      (entries) => {
        const arriving = entries
          .filter((entry) => entry.isIntersecting)
          .map((entry) => entry.target as HTMLElement)
          .sort((a, b) =>
            a.compareDocumentPosition(b) & Node.DOCUMENT_POSITION_FOLLOWING ? -1 : 1
          );

        arriving.forEach((item, order) => {
          observer.unobserve(item);
          item.style.setProperty("--reveal-order", String(order));
          item.setAttribute("data-revealed", "");
        });

        remaining -= arriving.length;
        if (remaining <= 0) {
          observer.disconnect();
          // Once everything has played, disarm: anything React renders into the
          // group later (a re-keyed child, say) is simply visible.
          settleTimer = window.setTimeout(() => group.removeAttribute("data-reveal-armed"), SETTLE_MS);
        }
      },
      { threshold, rootMargin }
    );

    pending.forEach((item) => observer.observe(item));

    return () => {
      observer.disconnect();
      window.clearTimeout(settleTimer);
      group.removeAttribute("data-reveal-armed");
    };
  }, [threshold, rootMargin]);

  return ref;
};
