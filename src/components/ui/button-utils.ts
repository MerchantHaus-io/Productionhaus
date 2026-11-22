import { cva } from "class-variance-authority";

/*
 * Product buttons have an 8px corner and a Bold sentence-case label; marketing CTAs are
 * pills (cta, cta-outline, pill, light, light-outline). Fills darken on hover and press,
 * outline and ghost buttons take a tint, nothing lifts or scales.
 */
export const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-bold ring-offset-background transition-[background-color,border-color,color,filter] duration-[120ms] ease-brand focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:border-transparent disabled:bg-muted disabled:text-muted-foreground [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:brightness-95 active:brightness-90",
        secondary: "border border-primary-text bg-background text-primary-text hover:bg-primary-text/[0.06]",
        outline: "border border-input bg-background text-foreground hover:bg-accent hover:text-accent-foreground",
        ghost: "text-primary-text hover:bg-primary-text/[0.06]",
        destructive: "bg-destructive text-destructive-foreground hover:brightness-95 active:brightness-90",
        link: "text-primary-text underline-offset-4 hover:underline",
        // Marketing pills
        cta: "rounded-pill bg-foreground text-background hover:brightness-90 active:brightness-[0.85]",
        "cta-outline": "rounded-pill border border-input bg-transparent text-foreground hover:bg-accent hover:text-accent-foreground",
        pill: "rounded-pill bg-primary text-primary-foreground hover:brightness-95 active:brightness-90",
        light: "rounded-pill bg-white text-neutral-dark hover:bg-white/90 focus-visible:ring-white focus-visible:ring-offset-neutral-dark",
        "light-outline":
          "rounded-pill border border-white/60 bg-transparent text-white hover:bg-white/10 focus-visible:ring-white focus-visible:ring-offset-neutral-dark",
      },
      size: {
        default: "h-10 px-4",
        sm: "h-8 px-3 text-xs [&_svg]:size-3.5",
        xs: "h-6 px-2 text-xs [&_svg]:size-3.5",
        lg: "h-11 px-5",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);
