import type { CSSProperties } from "react";

/* Attribute helpers for the reveals in src/components/Reveal.tsx; the motion is in src/index.css. */

export type RevealVariant = "up" | "down" | "left" | "right" | "scale" | "fade" | "words";
export type RevealChildVariant = "up" | "pop" | "fade" | "draw" | "rise";

/** Attributes for one item in a `RevealGroup`. `delay` is added after the item's place in the cascade. */
export const reveal = (variant: RevealVariant = "up", delay = 0) =>
  ({
    "data-reveal": variant,
    ...(delay ? { style: { "--reveal-extra": `${delay}ms` } as CSSProperties } : {}),
  }) as const;

/** Attributes for a detail that follows its item in, `delay` ms after it. */
export const revealChild = (variant: RevealChildVariant = "up", delay = 160) =>
  ({
    "data-reveal-child": variant,
    style: { "--reveal-child-extra": `${delay}ms` } as CSSProperties,
  }) as const;
