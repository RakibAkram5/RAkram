import { cn } from "@/lib/format";

/** RAKRAM wordmark with a faceted chrome monogram. */
export function Logo({ className, compact = false }: { className?: string; compact?: boolean }) {
  return (
    <span className={cn("inline-flex items-center gap-2.5", className)}>
      <svg viewBox="0 0 32 32" className="h-7 w-7 shrink-0" aria-hidden>
        <defs>
          <linearGradient id="rk-chrome" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#ffffff" />
            <stop offset="0.45" stopColor="#9ea3ad" />
            <stop offset="0.7" stopColor="#f2f3f5" />
            <stop offset="1" stopColor="#6b7079" />
          </linearGradient>
        </defs>
        <path d="M16 1.5 29.5 9v14L16 30.5 2.5 23V9Z" fill="none" stroke="url(#rk-chrome)" strokeWidth="1.4" />
        <path
          d="M11 23V9h6.2c2.9 0 4.8 1.7 4.8 4.2 0 2-1.2 3.4-3.1 3.9L22.6 23h-3.1l-3.4-5.6h-2.3V23Zm2.8-8h3.2c1.3 0 2.1-.7 2.1-1.8s-.8-1.8-2.1-1.8h-3.2Z"
          fill="url(#rk-chrome)"
        />
      </svg>
      {!compact && <span className="chrome-text chrome-sheen hidden text-[0.95rem] font-bold tracking-[0.3em] min-[360px]:inline sm:text-[1.05rem] sm:tracking-[0.42em]">RAKRAM</span>}
    </span>
  );
}

export function SocialIcon({ name, className }: { name: "instagram" | "facebook" | "tiktok" | "youtube"; className?: string }) {
  const common = { className: cn("h-4 w-4", className), viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 1.6, "aria-hidden": true } as const;
  switch (name) {
    case "instagram":
      return (
        <svg {...common}>
          <rect x="3" y="3" width="18" height="18" rx="5" />
          <circle cx="12" cy="12" r="4" />
          <circle cx="17.5" cy="6.5" r="0.8" fill="currentColor" />
        </svg>
      );
    case "facebook":
      return (
        <svg {...common}>
          <path d="M14 8h3V4h-3a4 4 0 0 0-4 4v3H7v4h3v6h4v-6h3l1-4h-4V8.5a.5.5 0 0 1 .5-.5Z" />
        </svg>
      );
    case "tiktok":
      return (
        <svg {...common}>
          <path d="M14 3v11.5a3.5 3.5 0 1 1-3-3.46M14 3c.5 2.5 2.3 4.2 5 4.5" />
        </svg>
      );
    case "youtube":
      return (
        <svg {...common}>
          <rect x="2.5" y="5.5" width="19" height="13" rx="4" />
          <path d="m10 9.5 5 2.5-5 2.5Z" fill="currentColor" />
        </svg>
      );
  }
}
