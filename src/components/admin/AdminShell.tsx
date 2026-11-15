"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  ChartColumn,
  ClipboardList,
  Boxes,
  FolderTree,
  LayoutDashboard,
  Menu,
  Package,
  Settings,
  ShieldCheck,
  Store,
  TicketPercent,
  Users,
  X,
} from "lucide-react";
import { cn } from "@/lib/format";
import { Logo } from "@/components/ui/Logo";
import { Toaster } from "@/components/ui/Toaster";

const nav = [
  { href: "/admin", label: "Overview", icon: LayoutDashboard },
  { href: "/admin/analytics", label: "Sales analytics", icon: ChartColumn },
  { href: "/admin/products", label: "Products", icon: Package },
  { href: "/admin/categories", label: "Categories", icon: FolderTree },
  { href: "/admin/inventory", label: "Inventory", icon: Boxes },
  { href: "/admin/orders", label: "Orders", icon: ClipboardList },
  { href: "/admin/customers", label: "Customers", icon: Users },
  { href: "/admin/coupons", label: "Coupons", icon: TicketPercent },
  { href: "/admin/settings", label: "Settings", icon: Settings },
];

/**
 * Admin UI shell — DEMO ONLY.
 * There is intentionally no client-side "role check": hiding UI in the browser
 * is not security. Phase 2 must protect /admin with server-side authentication
 * and authorization (proxy.ts + every admin API route), and all mutations must
 * be authorised and validated on the server.
 */
export function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [lastPath, setLastPath] = useState(pathname);
  if (lastPath !== pathname) {
    setLastPath(pathname);
    setOpen(false);
  }

  const navList = (
    <nav aria-label="Admin" className="flex flex-col gap-1">
      {nav.map(({ href, label, icon: Icon }) => {
        const active = href === "/admin" ? pathname === href : pathname.startsWith(href);
        return (
          <Link
            key={href}
            href={href}
            aria-current={active ? "page" : undefined}
            className={cn(
              "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition",
              active ? "bg-white/[0.08] text-fg shadow-[inset_0_0_0_1px_rgba(255,255,255,0.08)]" : "text-muted hover:bg-white/[0.04] hover:text-fg",
            )}
          >
            <Icon className="h-4 w-4" aria-hidden /> {label}
          </Link>
        );
      })}
    </nav>
  );

  return (
    <div className="min-h-dvh lg:grid lg:grid-cols-[248px_1fr]">
      <aside className="glass-strong hidden border-y-0 border-l-0 lg:block">
        <div className="sticky top-0 flex h-dvh flex-col p-5">
          <Link href="/admin" className="mb-1 flex items-center gap-2">
            <Logo />
          </Link>
          <p className="mb-8 pl-[38px] text-[10px] tracking-[0.3em] text-faint uppercase">Admin · Demo</p>
          {navList}
          <Link href="/" className="mt-auto flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-muted hover:text-fg">
            <Store className="h-4 w-4" aria-hidden /> View storefront
          </Link>
        </div>
      </aside>

      <div className="min-w-0">
        <header className="glass-strong sticky top-0 z-30 flex h-16 items-center gap-3 border-x-0 border-t-0 px-4 lg:hidden">
          <button type="button" onClick={() => setOpen(true)} aria-label="Open admin menu" className="flex h-10 w-10 items-center justify-center rounded-full hover:bg-white/8">
            <Menu className="h-5 w-5" />
          </button>
          <Logo />
        </header>
        {open && (
          <div className="fixed inset-0 z-50 lg:hidden" role="dialog" aria-modal="true" aria-label="Admin menu">
            <div className="absolute inset-0 bg-black/70" onClick={() => setOpen(false)} aria-hidden />
            <div className="glass-strong absolute inset-y-0 left-0 w-72 p-5">
              <div className="mb-6 flex items-center justify-between">
                <Logo />
                <button type="button" onClick={() => setOpen(false)} aria-label="Close menu" className="flex h-9 w-9 items-center justify-center rounded-full hover:bg-white/8">
                  <X className="h-5 w-5" />
                </button>
              </div>
              {navList}
              <Link href="/" className="mt-6 flex items-center gap-3 px-3 py-2.5 text-sm text-muted">
                <Store className="h-4 w-4" aria-hidden /> View storefront
              </Link>
            </div>
          </div>
        )}
        <div className="border-b border-warning/20 bg-warning/[0.05] px-4 py-2.5 text-xs text-amber-100/90 sm:px-8">
          <ShieldCheck className="mr-2 inline h-3.5 w-3.5 align-[-2px] text-warning" aria-hidden />
          Demo admin with mock data. Changes are not saved. Production access must be enforced by server-side authentication & role checks.
        </div>
        <main className="px-4 py-8 sm:px-8 lg:px-10">{children}</main>
      </div>
      <Toaster />
    </div>
  );
}

export function AdminHeading({ title, description, action }: { title: string; description?: string; action?: React.ReactNode }) {
  return (
    <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <h1 className="font-display text-4xl sm:text-5xl">{title}</h1>
        {description && <p className="mt-2 text-sm text-muted">{description}</p>}
      </div>
      {action}
    </div>
  );
}

export function Panel({ title, action, children, className }: { title?: string; action?: React.ReactNode; children: React.ReactNode; className?: string }) {
  return (
    <section className={cn("glass edge min-w-0 rounded-3xl p-5 sm:p-6", className)}>
      {(title || action) && (
        <div className="mb-5 flex items-center justify-between gap-3">
          {title && <h2 className="text-sm font-semibold tracking-wide">{title}</h2>}
          {action}
        </div>
      )}
      {children}
    </section>
  );
}

export function StatTile({ label, value, delta, hint }: { label: string; value: string; delta?: number; hint?: string }) {
  return (
    <div className="glass edge rounded-3xl p-5">
      <p className="text-xs text-faint">{label}</p>
      <p className="mt-2 text-lg font-semibold tracking-tight break-words sm:text-2xl xl:text-3xl">{value}</p>
      {delta !== undefined && (
        <p className={cn("mt-2 text-xs", delta >= 0 ? "text-success" : "text-danger")}>
          {delta >= 0 ? "▲" : "▼"} {Math.abs(delta).toFixed(1)}% <span className="text-faint">vs last month</span>
        </p>
      )}
      {hint && <p className="mt-2 text-xs text-faint">{hint}</p>}
    </div>
  );
}

/** Shared table wrapper — horizontally scrollable on small screens. */
export function DataTable({ children, label }: { children: React.ReactNode; label: string }) {
  return (
    <div className="-mx-5 overflow-x-auto sm:-mx-6" role="region" aria-label={label} tabIndex={0}>
      <table className="w-full min-w-[640px] text-left text-sm [&_td]:px-5 [&_td]:py-3 sm:[&_td]:px-6 [&_th]:px-5 [&_th]:py-3 [&_th]:text-xs [&_th]:font-medium [&_th]:text-faint sm:[&_th]:px-6 [&_tbody_tr]:border-t [&_tbody_tr]:border-line [&_tbody_tr:hover]:bg-white/[0.02]">
        {children}
      </table>
    </div>
  );
}
