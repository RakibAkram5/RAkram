import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";
import { cn } from "@/lib/format";

type Variant = "chrome" | "glass" | "ghost" | "outline" | "danger";
type Size = "sm" | "md" | "lg";

const base =
  "inline-flex items-center justify-center gap-2 rounded-full font-semibold tracking-wide transition-all duration-300 ease-[var(--ease-lux)] disabled:opacity-50 disabled:pointer-events-none select-none active:scale-[0.98]";

const variants: Record<Variant, string> = {
  chrome: "btn-chrome",
  glass: "glass text-fg hover:bg-white/10 hover:border-white/20",
  ghost: "text-muted hover:text-fg hover:bg-white/5",
  outline: "border border-line-strong text-fg hover:border-white/40 hover:bg-white/5",
  danger: "bg-red-500/15 text-red-200 border border-red-400/30 hover:bg-red-500/25",
};

const sizes: Record<Size, string> = {
  sm: "h-9 px-4 text-xs",
  md: "h-11 px-6 text-sm",
  lg: "h-13 px-8 text-sm min-h-[3.25rem]",
};

export function buttonClass(variant: Variant = "chrome", size: Size = "md", className?: string) {
  return cn(base, variants[variant], sizes[size], className);
}

export function Button({
  variant = "chrome",
  size = "md",
  className,
  type = "button",
  ...props
}: ComponentProps<"button"> & { variant?: Variant; size?: Size }) {
  return <button type={type} className={buttonClass(variant, size, className)} {...props} />;
}

export function ButtonLink({
  variant = "chrome",
  size = "md",
  className,
  children,
  ...props
}: ComponentProps<typeof Link> & { variant?: Variant; size?: Size; children: ReactNode }) {
  return (
    <Link className={buttonClass(variant, size, className)} {...props}>
      {children}
    </Link>
  );
}

export function IconButton({
  label,
  className,
  children,
  type = "button",
  ...props
}: ComponentProps<"button"> & { label: string }) {
  return (
    <button
      type={type}
      aria-label={label}
      title={label}
      className={cn(
        "relative inline-flex h-10 w-9 items-center justify-center rounded-full text-silver sm:w-10 transition-colors hover:bg-white/8 hover:text-fg",
        className,
      )}
      {...props}
    >
      {children}
    </button>
  );
}
