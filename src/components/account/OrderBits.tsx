import { Check } from "lucide-react";
import type { Order, OrderStatus } from "@/lib/types";
import { cn, formatDate } from "@/lib/format";

export const statusLabel: Record<OrderStatus, string> = {
  pending: "Pending",
  confirmed: "Confirmed",
  packed: "Packed",
  shipped: "Shipped",
  out_for_delivery: "Out for delivery",
  delivered: "Delivered",
  cancelled: "Cancelled",
};

export function StatusPill({ status }: { status: OrderStatus }) {
  const tone =
    status === "delivered"
      ? "bg-emerald-400/10 text-success border-emerald-400/20"
      : status === "cancelled"
        ? "bg-red-400/10 text-danger border-red-400/20"
        : status === "pending"
          ? "bg-amber-300/10 text-warning border-amber-300/20"
          : "bg-white/5 text-silver border-line-strong";
  return <span className={cn("inline-flex items-center rounded-full border px-2.5 py-1 text-[11px] font-semibold whitespace-nowrap", tone)}>{statusLabel[status]}</span>;
}

const flow: OrderStatus[] = ["pending", "confirmed", "packed", "shipped", "out_for_delivery", "delivered"];

export function OrderTimeline({ order }: { order: Order }) {
  if (order.status === "cancelled") {
    return <p className="text-sm text-danger">This order was cancelled{order.paymentStatus === "refunded" ? " and refunded" : ""}.</p>;
  }
  const reached = new Map(order.timeline.map((t) => [t.status, t.at]));
  const currentIdx = flow.indexOf(order.status);
  return (
    <ol className="relative grid gap-0 sm:grid-cols-6" aria-label="Order progress">
      {flow.map((s, i) => {
        const done = i <= currentIdx;
        const at = reached.get(s);
        return (
          <li key={s} className="relative flex gap-4 pb-6 sm:flex-col sm:items-center sm:gap-3 sm:pb-0 sm:text-center">
            {i < flow.length - 1 && (
              <span
                aria-hidden
                className={cn("absolute top-8 bottom-0 left-[15px] w-px sm:top-[15px] sm:right-[-50%] sm:bottom-auto sm:left-1/2 sm:h-px sm:w-auto", i < currentIdx ? "bg-silver" : "bg-line-strong")}
              />
            )}
            <span className={cn("relative z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border", done ? "btn-chrome border-transparent" : "border-line-strong bg-ink")}>
              {done ? <Check className="h-4 w-4" /> : <span className="h-1.5 w-1.5 rounded-full bg-white/30" />}
            </span>
            <span>
              <span className={cn("block text-sm font-medium", done ? "text-fg" : "text-faint")}>{statusLabel[s]}</span>
              {at && <span className="block text-xs text-faint">{formatDate(at, { year: undefined, hour: "numeric", minute: "2-digit" })}</span>}
            </span>
          </li>
        );
      })}
    </ol>
  );
}
