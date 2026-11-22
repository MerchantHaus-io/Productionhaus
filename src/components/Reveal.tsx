import type { CSSProperties, ComponentPropsWithoutRef, ElementType, ReactNode, Ref } from "react";
import { useRevealGroup } from "@/hooks/use-reveal-animation";
import { revealChild } from "@/lib/reveal";


/*
 * Entrance animations for marketing pages. The motion itself lives in
 * src/index.css ("Scroll reveals"); these components only place the attributes.
 *
 *   <Reveal>            one element that reveals itself (a whole section)
 *   <RevealGroup>       a container whose `[data-reveal]` items cascade in
 *   reveal(variant)     the attributes for one item inside a group
 *   revealChild(...)    a detail inside an item that follows it in (an icon, a number)
 *   <RevealWords>       a heading whose words rise out of a mask, one after another
 */

type Direction = "up" | "down" | "left" | "right";

type RevealProps<T extends ElementType> = {
  as?: T;
  children: ReactNode;
  className?: string;
  direction?: Direction;
  delay?: number;
  threshold?: number;
} & Omit<ComponentPropsWithoutRef<T>, "as" | "children" | "className" | "ref">;

export const Reveal = <T extends ElementType = "div">({
  as,
  children,
  className,
  direction = "up",
  delay = 0,
  threshold,
  style,
  ...props
}: RevealProps<T>) => {
  const Component = (as || "div") as ElementType;
  const ref = useRevealGroup({ threshold });

  return (
    <Component
      ref={ref as Ref<HTMLElement>}
      data-reveal={direction}
      style={{ ...style, "--reveal-extra": `${delay}ms` } as CSSProperties}
      className={className}
      {...props}
    >
      {children}
    </Component>
  );
};

type RevealGroupProps<T extends ElementType> = {
  as?: T;
  children: ReactNode;
  className?: string;
  /* Delay between items that arrive together, in ms. */
  stagger?: number;
  threshold?: number;
  rootMargin?: string;
} & Omit<ComponentPropsWithoutRef<T>, "as" | "children" | "className" | "ref">;

export const RevealGroup = <T extends ElementType = "div">({
  as,
  children,
  className,
  stagger,
  threshold,
  rootMargin,
  style,
  ...props
}: RevealGroupProps<T>) => {
  const Component = (as || "div") as ElementType;
  const ref = useRevealGroup({ threshold, rootMargin });

  return (
    <Component
      ref={ref as Ref<HTMLElement>}
      style={stagger === undefined ? style : ({ ...style, "--reveal-stagger": `${stagger}ms` } as CSSProperties)}
      className={className}
      {...props}
    >
      {children}
    </Component>
  );
};

type RevealWordsProps = {
  text: string;
  /* Rendered inside the last word's mask, so trailing punctuation rises with it. */
  suffix?: ReactNode;
  /* Delay between words, in ms. */
  step?: number;
};

/**
 * Splits a heading into words that rise from a mask. Spaces stay real text
 * between the spans, so the heading's text, its accessible name and the
 * prerendered Markdown all read normally. Put it inside an element carrying
 * `reveal("words")`.
 */
export const RevealWords = ({ text, suffix, step = 55 }: RevealWordsProps) => {
  const words = text.split(/\s+/).filter(Boolean);

  return (
    <>
      {words.map((word, index) => (
        <span key={`${word}-${index}`}>
          <span className="reveal-mask">
            <span {...revealChild("rise", index * step)} className="inline-block">
              {word}
              {index === words.length - 1 && suffix}
            </span>
          </span>
          {index < words.length - 1 && " "}
        </span>
      ))}
    </>
  );
};
