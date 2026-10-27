import { cva } from "class-variance-authority";

export const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default: "border-transparent bg-primary text-primary-foreground hover:bg-primary/80",
        secondary: "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
        destructive: "border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80",
        outline: "text-foreground",
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
