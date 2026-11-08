import { cva } from "class-variance-authority";

export const badgeVariants = cva(
  "inline-flex h-6 items-center gap-1.5 rounded-pill border px-2.5 text-xs font-semibold leading-4 transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default: "border-transparent bg-primary text-primary-foreground",
        secondary: "border-transparent bg-secondary text-secondary-foreground",
        outline: "border-border text-foreground",
        dark: "border-transparent bg-neutral-dark text-white",
        slate: "border-transparent bg-brand-slate text-brand-slate-foreground",
        destructive: "border-transparent bg-destructive text-destructive-foreground",
        approved: "border-transparent bg-status-approved-bg text-status-approved",
        pending: "border-transparent bg-status-pending-bg text-status-pending",
        declined: "border-transparent bg-status-declined-bg text-status-declined",
        refunded: "border-transparent bg-status-refunded-bg text-status-refunded",
        chargeback: "border-transparent bg-status-chargeback-bg text-status-chargeback",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);
