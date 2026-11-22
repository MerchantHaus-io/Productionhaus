import { Badge, type BadgeProps } from "./badge";

type PaymentStatus = "approved" | "pending" | "declined" | "refunded" | "chargeback";

const statusLabel: Record<PaymentStatus, string> = {
  approved: "Approved",
  pending: "Pending",
  declined: "Declined",
  refunded: "Refunded",
  chargeback: "Chargeback",
};

interface StatusBadgeProps extends Omit<BadgeProps, "variant"> {
  status: PaymentStatus;
}

/* A word with a 6px status dot on a tinted fill; the word always carries the state. */
function StatusBadge({ status, className, children, ...props }: StatusBadgeProps) {
  return (
    <Badge variant={status} className={className} {...props}>
      <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-current" aria-hidden="true" />
      {children ?? statusLabel[status]}
    </Badge>
  );
}

export { StatusBadge };
export type { PaymentStatus, StatusBadgeProps };
