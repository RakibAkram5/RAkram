"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Heart, LogOut, MapPin, Package, User } from "lucide-react";
import { demoCustomer } from "@/data/mock-orders";
import { cn } from "@/lib/format";
import { sessionStore, ui, useSession } from "@/store/ui";
import { useHydrated } from "@/store/create-store";
import { Button, ButtonLink } from "@/components/ui/Button";
import { DemoNotice, Skeleton } from "@/components/ui/bits";

const nav = [
  { href: "/account", label: "Overview", icon: User },
  { href: "/account/orders", label: "My orders", icon: Package },
  { href: "/account/addresses", label: "Addresses", icon: MapPin },
  { href: "/wishlist", label: "Wishlist", icon: Heart },
];

/**
 * Portal shell. The "signed in" check is a UX convenience for the demo only;
 * it is NOT access control. Phase 2 must enforce auth on the server.
 */
export function PortalShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const hydrated = useHydrated();
  const { signedIn } = useSession();

  // Page content is always rendered (so the route can be prerendered and validated)
  // but kept hidden until the demo sign-in. This is presentation, not security.
  const content = <div hidden={!hydrated || !signedIn}>{children}</div>;

  if (!hydrated)
    return (
      <>
        <Skeleton className="h-96 w-full rounded-3xl" />
        {content}
      </>
    );

  if (!signedIn) {
    return (
      <>
      {content}
      <div className="mx-auto max-w-lg text-center">
        <div className="glass-strong edge rounded-[28px] p-8 sm:p-10">
          <p className="eyebrow">Customer portal</p>
          <h1 className="mt-3 font-display text-4xl">Sign in to your account</h1>
          <p className="mt-3 text-sm text-muted">View orders, track deliveries and manage saved addresses.</p>
          <div className="mt-8 flex flex-col gap-3">
            <ButtonLink href="/account/login" size="lg">
              Sign in
            </ButtonLink>
            <Button
              variant="outline"
              size="lg"
              onClick={() => {
                sessionStore.set({ signedIn: true });
                ui.toast("Viewing the demo account", "success");
              }}
            >
              Explore the demo account
            </Button>
            <Link href="/account/register" className="mt-2 text-sm text-muted underline underline-offset-4 hover:text-fg">
              Create an account
            </Link>
          </div>
        </div>
      </div>
      </>
    );
  }

  return (
    <div className="grid gap-8 lg:grid-cols-12 lg:gap-12">
      <aside className="lg:col-span-3">
        <div className="glass edge rounded-3xl p-5 lg:sticky lg:top-24">
          <div className="flex items-center gap-3 border-b border-line pb-5">
            <span className="btn-chrome flex h-12 w-12 items-center justify-center rounded-full text-lg font-bold" aria-hidden>
              {demoCustomer.name.charAt(0)}
            </span>
            <div className="min-w-0">
              <p className="truncate font-semibold">{demoCustomer.name}</p>
              <p className="truncate text-xs text-faint">Demo customer</p>
            </div>
          </div>
          <nav aria-label="Account" className="no-scrollbar -mx-1 mt-4 flex gap-1 overflow-x-auto lg:flex-col">
            {nav.map(({ href, label, icon: Icon }) => {
              const active = href === "/account" ? pathname === href : pathname.startsWith(href);
              return (
                <Link
                  key={href}
                  href={href}
                  aria-current={active ? "page" : undefined}
                  className={cn("flex shrink-0 items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition", active ? "bg-white/[0.07] text-fg" : "text-muted hover:text-fg")}
                >
                  <Icon className="h-4 w-4" aria-hidden /> {label}
                </Link>
              );
            })}
            <button
              type="button"
              onClick={() => {
                sessionStore.set({ signedIn: false });
                ui.toast("Signed out");
                router.push("/");
              }}
              className="flex shrink-0 items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-muted hover:text-fg"
            >
              <LogOut className="h-4 w-4" aria-hidden /> Sign out
            </button>
          </nav>
        </div>
      </aside>
      <div className="min-w-0 lg:col-span-9">
        <DemoNotice className="mb-6">You are viewing a demonstration account with sample data. Sign-in is not real authentication.</DemoNotice>
        {content}
      </div>
    </div>
  );
}
