import { Star } from "lucide-react";
import type { ReactNode } from "react";
import { cn, discountPercent, formatPKR, stockLabel, stockStatus } from "@/lib/format";

export function Rating({ value, count, size = "sm" }: { value: number; count?: number; size?: "sm" | "md" }) {
  const px = size === "sm" ? "h-3.5 w-3.5" : "h-4 w-4";
  return (
    <div className="flex items-center gap-1.5" aria-label={`Rated ${value.toFixed(1)} out of 5${count ? ` from ${count} demo reviews` : ""}`}>
      <div className="flex" aria-hidden>
        {[1, 2, 3, 4, 5].map((i) => {
          const fill = Math.max(0, Math.min(1, value - (i - 1)));
          return (
            <span key={i} className={cn("relative", px)}>
              <Star className={cn("absolute inset-0 text-white/20", px)} strokeWidth={1.5} />
              <span className="absolute inset-0 overflow-hidden" style={{ width: `${fill * 100}%` }}>
                <Star className={cn("fill-silver text-silver", px)} strokeWidth={1.5} />
              </span>
            </span>
          );
        })}
      </div>
      <span className="text-xs text-muted">
        {value.toFixed(1)}
        {count !== undefined && <span className="text-faint"> ({count})</span>}
      </span>
    </div>
  );
}

export function Price({
  price,
  compareAt,
  size = "md",
  className,
}: {
  price: number;
  compareAt?: number;
  size?: "sm" | "md" | "lg";
  className?: string;
}) {
  const pct = discountPercent({ price, compareAtPrice: compareAt });
  return (
    <div className={cn("flex flex-wrap items-baseline gap-x-2 gap-y-0.5", className)}>
      <span
        className={cn(
          "font-semibold tracking-tight text-fg",
          size === "lg" ? "text-2xl sm:text-3xl" : size === "md" ? "text-base" : "text-sm",
        )}
      >
        {formatPKR(price)}
      </span>
      {pct > 0 && compareAt && (
        <>
          <span className={cn("text-faint line-through", size === "lg" ? "text-base" : "text-xs")}>
            <span className="sr-only">Was </span>
            {formatPKR(compareAt)}
          </span>
          <span className="text-xs font-semibold text-success">−{pct}%</span>
        </>
      )}
    </div>
  );
}

export function Badge({ children, tone = "glass", className }: { children: ReactNode; tone?: "glass" | "chrome" | "sale" | "muted"; className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.14em]",
        tone === "glass" && "glass text-fg",
        tone === "chrome" && "btn-chrome",
        tone === "sale" && "bg-white text-ink",
        tone === "muted" && "bg-white/5 text-muted border border-line",
        className,
      )}
    >
      {children}
    </span>
  );
}

export function StockIndicator({ stock, showCount = false }: { stock: number; showCount?: boolean }) {
  const s = stockStatus(stock);
  const color = s === "in_stock" ? "bg-success" : s === "low_stock" ? "bg-warning" : "bg-danger";
  return (
    <span className="inline-flex items-center gap-2 text-xs text-muted">
      <span className={cn("h-1.5 w-1.5 rounded-full", color)} aria-hidden />
      {stockLabel[s]}
      {showCount && s === "low_stock" && <span className="text-faint">— only {stock} left (demo)</span>}
    </span>
  );
}

export function SectionHeading({
  eyebrow,
  title,
  description,
  action,
  align = "left",
}: {
  eyebrow?: string;
  title: ReactNode;
  description?: string;
  action?: ReactNode;
  align?: "left" | "center";
}) {
  return (
    <div className={cn("mb-8 flex flex-col gap-4 sm:mb-12", align === "center" ? "items-center text-center" : "sm:flex-row sm:items-end sm:justify-between")}>
      <div className={cn("max-w-2xl", align === "center" && "mx-auto")}>
        {eyebrow && <p className="eyebrow mb-3">{eyebrow}</p>}
        <h2 className="font-display text-4xl leading-[1.05] font-medium tracking-tight sm:text-5xl">{title}</h2>
        {description && <p className="mt-4 text-sm leading-relaxed text-muted sm:text-base">{description}</p>}
      </div>
      {action}
    </div>
  );
}

export function DemoNotice({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div
      role="note"
      className={cn(
        "flex items-start gap-3 rounded-2xl border border-warning/25 bg-warning/[0.06] px-4 py-3 text-xs leading-relaxed text-amber-100/90",
        className,
      )}
    >
      <span className="mt-0.5 inline-flex h-4 shrink-0 items-center rounded-full bg-warning/20 px-1.5 text-[9px] font-bold tracking-widest text-warning uppercase">
        Demo
      </span>
      <div>{children}</div>
    </div>
  );
}

export function Skeleton({ className }: { className?: string }) {
  return <div className={cn("skeleton rounded-xl", className)} aria-hidden />;
}

export function ProductCardSkeleton() {
  return (
    <div className="space-y-3">
      <Skeleton className="aspect-[4/5] w-full rounded-2xl" />
      <Skeleton className="h-3 w-1/3" />
      <Skeleton className="h-4 w-3/4" />
      <Skeleton className="h-4 w-1/4" />
    </div>
  );
}

export function EmptyState({ icon, title, body, action }: { icon: ReactNode; title: string; body: string; action?: ReactNode }) {
  return (
    <div className="glass edge flex flex-col items-center rounded-3xl px-6 py-16 text-center">
      <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-full border border-line-strong text-silver">{icon}</div>
      <h2 className="font-display text-3xl">{title}</h2>
      <p className="mt-2 max-w-sm text-sm text-muted">{body}</p>
      {action && <div className="mt-6">{action}</div>}
    </div>
  );
}
