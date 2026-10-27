import { CheckCircle2, Clock, RotateCcw, ShieldAlert, XCircle, type LucideIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { Badge, type BadgeProps } from "./badge";

type PaymentStatus = "approved" | "pending" | "declined" | "refunded" | "chargeback";

/* Icon and default label per status, so the state never depends on colour alone. */
const statusConfig: Record<PaymentStatus, { icon: LucideIcon; label: string }> = {
  approved: { icon: CheckCircle2, label: "Approved" },
  pending: { icon: Clock, label: "Pending" },
  declined: { icon: XCircle, label: "Declined" },
  refunded: { icon: RotateCcw, label: "Refunded" },
  chargeback: { icon: ShieldAlert, label: "Chargeback" },
};

interface StatusBadgeProps extends Omit<BadgeProps, "variant"> {
  status: PaymentStatus;
}

function StatusBadge({ status, className, children, ...props }: StatusBadgeProps) {
  const { icon: Icon, label } = statusConfig[status];
  return (
    <Badge variant={status} className={cn("gap-1", className)} {...props}>
      <Icon className="h-3.5 w-3.5" aria-hidden="true" />
      {children ?? label}
    </Badge>
  );
}

export { StatusBadge };
export type { PaymentStatus, StatusBadgeProps };
