import { cn } from "@/lib/utils";

type Status =
  | "active" | "inactive" | "pending" | "confirmed" | "shipping"
  | "delivered" | "cancelled" | "approved" | "rejected" | "locked"
  | "in_stock" | "low_stock" | "out_of_stock" | "expired" | "admin" | "customer";

const config: Record<Status, { label: string; className: string }> = {
  active:       { label: "Active",       className: "bg-primary/15 text-primary border-primary/30" },
  inactive:     { label: "Inactive",     className: "bg-muted text-muted-foreground border-border" },
  pending:      { label: "Pending",      className: "bg-yellow-500/15 text-yellow-500 border-yellow-500/30" },
  confirmed:    { label: "Confirmed",    className: "bg-blue-500/15 text-blue-500 border-blue-500/30" },
  shipping:     { label: "Shipping",     className: "bg-purple-500/15 text-purple-500 border-purple-500/30" },
  delivered:    { label: "Delivered",    className: "bg-primary/15 text-primary border-primary/30" },
  cancelled:    { label: "Cancelled",    className: "bg-destructive/15 text-destructive border-destructive/30" },
  approved:     { label: "Approved",     className: "bg-primary/15 text-primary border-primary/30" },
  rejected:     { label: "Rejected",     className: "bg-destructive/15 text-destructive border-destructive/30" },
  locked:       { label: "Locked",       className: "bg-destructive/15 text-destructive border-destructive/30" },
  in_stock:     { label: "In Stock",     className: "bg-primary/15 text-primary border-primary/30" },
  low_stock:    { label: "Low Stock",    className: "bg-yellow-500/15 text-yellow-500 border-yellow-500/30" },
  out_of_stock: { label: "Out of Stock", className: "bg-destructive/15 text-destructive border-destructive/30" },
  expired:      { label: "Expired",      className: "bg-muted text-muted-foreground border-border" },
  admin:        { label: "Admin",        className: "bg-primary/15 text-primary border-primary/30" },
  customer:     { label: "Customer",     className: "bg-muted text-muted-foreground border-border" },
};

export default function StatusBadge({ status }: { status: string }) {
  const cfg = config[status as Status] ?? { label: status, className: "bg-muted text-muted-foreground border-border" };
  return (
    <span className={cn("inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border", cfg.className)}>
      {cfg.label}
    </span>
  );
}
