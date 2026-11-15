"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { AnimatePresence, motion } from "motion/react";
import { useDeferredValue, useEffect, useState } from "react";
import { ArrowRight, ChevronRight, Heart, Package, Search, ShoppingBag, Trash, Truck, User, X } from "lucide-react";
import { sortedCategories } from "@/data/categories";
import { searchCategories, searchProducts } from "@/lib/catalog";
import { formatPKR } from "@/lib/format";
import { computeTotals, priceLines } from "@/lib/pricing";
import { deliveryConfig } from "@/data/pakistan";
import { Drawer } from "@/components/ui/Overlay";
import { ButtonLink } from "@/components/ui/Button";
import { ProductImage } from "@/components/ui/ProductImage";
import { QuantityStepper } from "@/components/product/PurchasePanel";
import { cart, maxQuantity, useCart } from "@/store/shop";
import { ui, useUI } from "@/store/ui";
import { primaryNav } from "./Header";
import { Logo } from "@/components/ui/Logo";

/** Closes drawers/overlays whenever the route changes. */
export function RouteEffects() {
  const pathname = usePathname();
  useEffect(() => {
    ui.closeAll();
  }, [pathname]);
  return null;
}

/* ------------------------------------------------------------------ */
export function MobileMenu() {
  const { menuOpen } = useUI();
  const [open, setOpen] = useState<string | null>(null);
  return (
    <Drawer open={menuOpen} onClose={ui.closeMenu} title="Menu" side="left" widthClass="w-[88%] max-w-sm">
      <nav aria-label="Mobile" className="flex flex-col p-5">
        <Link href="/" className="mb-6">
          <Logo />
        </Link>
        <p className="eyebrow mb-2">Categories</p>
        <ul className="divide-y divide-line border-y border-line">
          {sortedCategories.map((c) => (
            <li key={c.slug}>
              <div className="flex items-center">
                <Link href={`/category/${c.slug}`} className="flex-1 py-3.5 text-[15px]">
                  {c.name}
                </Link>
                <button
                  type="button"
                  aria-expanded={open === c.slug}
                  aria-label={`Show ${c.name} subcategories`}
                  onClick={() => setOpen(open === c.slug ? null : c.slug)}
                  className="flex h-10 w-10 items-center justify-center text-muted"
                >
                  <ChevronRight className={`h-4 w-4 transition-transform ${open === c.slug ? "rotate-90" : ""}`} />
                </button>
              </div>
              <AnimatePresence initial={false}>
                {open === c.slug && (
                  <motion.ul initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden pb-3 pl-3">
                    {c.subcategories.map((s) => (
                      <li key={s.slug}>
                        <Link href={`/category/${c.slug}?sub=${s.slug}`} className="block py-2 text-sm text-muted hover:text-fg">
                          {s.name}
                        </Link>
                      </li>
                    ))}
                  </motion.ul>
                )}
              </AnimatePresence>
            </li>
          ))}
        </ul>
        <p className="eyebrow mt-8 mb-2">Discover</p>
        <ul className="space-y-1">
          {[...primaryNav, { href: "/shop", label: "Shop all" }, { href: "/delivery", label: "Delivery across Pakistan" }].map((n) => (
            <li key={n.href}>
              <Link href={n.href} className="block py-2 font-display text-2xl text-silver hover:text-fg">
                {n.label}
              </Link>
            </li>
          ))}
        </ul>
        <div className="mt-8 grid grid-cols-3 gap-2 text-xs">
          {[
            { href: "/account", label: "Account", icon: User },
            { href: "/wishlist", label: "Wishlist", icon: Heart },
            { href: "/track-order", label: "Track", icon: Package },
          ].map(({ href, label, icon: Icon }) => (
            <Link key={href} href={href} className="glass flex flex-col items-center gap-2 rounded-2xl py-4 text-muted hover:text-fg">
              <Icon className="h-5 w-5" />
              {label}
            </Link>
          ))}
        </div>
      </nav>
    </Drawer>
  );
}

/* ------------------------------------------------------------------ */
const popular = ["Watches", "Headphones", "Leather", "Sneakers", "Skincare", "Cricket"];

export function SearchOverlay() {
  const { searchOpen } = useUI();
  return <AnimatePresence>{searchOpen && <SearchPanel />}</AnimatePresence>;
}

function SearchPanel() {
  const router = useRouter();
  const [q, setQ] = useState("");
  const dq = useDeferredValue(q);
  const results = searchProducts(dq, 6);
  const cats = searchCategories(dq).slice(0, 4);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && ui.closeSearch();
    document.addEventListener("keydown", onKey);
    const { overflow } = document.body.style;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = overflow;
    };
  }, []);

  const submit = (term: string) => {
    const t = term.trim().slice(0, 80);
    if (!t) return;
    ui.closeSearch();
    router.push(`/shop?q=${encodeURIComponent(t)}`);
  };

  return (
    <div className="fixed inset-0 z-[75]" role="dialog" aria-modal="true" aria-label="Search">
      <motion.div className="absolute inset-0 bg-black/70 backdrop-blur-md" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={ui.closeSearch} />
      <motion.div
        className="glass-strong relative max-h-[100dvh] overflow-y-auto border-x-0 border-t-0"
        initial={{ y: "-100%" }}
        animate={{ y: 0 }}
        exit={{ y: "-100%" }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      >
        <div className="container-lux py-6 sm:py-10">
          <form
            role="search"
            onSubmit={(e) => {
              e.preventDefault();
              submit(q);
            }}
            className="flex items-center gap-3 border-b border-line-strong pb-4"
          >
            <Search className="h-6 w-6 shrink-0 text-muted" aria-hidden />
            <label htmlFor="site-search" className="sr-only">
              Search products and categories
            </label>
            <input
              id="site-search"
              autoFocus
              value={q}
              maxLength={80}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search watches, headphones, leather…"
              autoComplete="off"
              className="min-w-0 flex-1 bg-transparent font-display text-2xl outline-none placeholder:text-faint sm:text-4xl"
            />
            <button type="button" onClick={ui.closeSearch} aria-label="Close search" className="flex h-10 w-10 items-center justify-center rounded-full text-muted hover:bg-white/8 hover:text-fg">
              <X className="h-5 w-5" />
            </button>
          </form>

          {!dq.trim() ? (
            <div className="mt-8">
              <p className="eyebrow mb-4">Popular searches</p>
              <div className="flex flex-wrap gap-2">
                {popular.map((p) => (
                  <button key={p} type="button" onClick={() => submit(p)} className="glass rounded-full px-4 py-2 text-sm text-silver hover:text-fg">
                    {p}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="mt-8 grid gap-10 lg:grid-cols-12" aria-live="polite">
              <div className="lg:col-span-8">
                <p className="eyebrow mb-4">{results.length ? "Products" : "No products found"}</p>
                {results.length > 0 ? (
                  <ul className="grid gap-2 sm:grid-cols-2">
                    {results.map((p) => (
                      <li key={p.id}>
                        <Link href={`/product/${p.slug}`} className="flex items-center gap-4 rounded-2xl p-2 transition-colors hover:bg-white/5">
                          <span className="relative h-16 w-14 shrink-0 overflow-hidden rounded-xl bg-ink-3">
                            <ProductImage image={p.images[0]} sizes="56px" />
                          </span>
                          <span className="min-w-0">
                            <span className="block truncate text-sm font-medium">{p.name}</span>
                            <span className="block text-xs text-faint">{p.brand}</span>
                            <span className="block text-xs text-silver">{formatPKR(p.price)}</span>
                          </span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm text-muted">Try a different term, or browse a category.</p>
                )}
                {results.length > 0 && (
                  <button type="button" onClick={() => submit(q)} className="mt-5 inline-flex items-center gap-2 text-xs font-semibold tracking-widest text-silver uppercase hover:text-fg">
                    See all results for “{dq.trim()}” <ArrowRight className="h-3.5 w-3.5" />
                  </button>
                )}
              </div>
              <div className="lg:col-span-4">
                <p className="eyebrow mb-4">Categories</p>
                <ul className="space-y-1">
                  {(cats.length ? cats : sortedCategories.slice(0, 4)).map((c) => (
                    <li key={c.slug}>
                      <Link href={`/category/${c.slug}`} className="block py-1.5 font-display text-2xl text-silver hover:text-fg">
                        {c.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
export function FreeDeliveryMeter({ remaining, subtotal }: { remaining: number; subtotal: number }) {
  const pct = Math.min(100, (subtotal / deliveryConfig.freeDeliveryThreshold) * 100);
  return (
    <div>
      <p className="flex items-center gap-2 text-xs text-muted">
        <Truck className="h-3.5 w-3.5" aria-hidden />
        {remaining > 0 ? (
          <span>
            Add <span className="font-semibold text-fg">{formatPKR(remaining)}</span> for free delivery
          </span>
        ) : (
          <span className="text-success">You’ve unlocked free delivery</span>
        )}
      </p>
      <div className="mt-2 h-1 overflow-hidden rounded-full bg-white/10" role="progressbar" aria-label="Progress to free delivery" aria-valuenow={Math.round(pct)} aria-valuemin={0} aria-valuemax={100}>
        <motion.div className="h-full rounded-full bg-gradient-to-r from-zinc-400 to-white" initial={false} animate={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}

export function CartDrawer() {
  const { cartOpen } = useUI();
  const { lines, coupon } = useCart();
  const priced = priceLines(lines);
  const totals = computeTotals(priced, coupon);

  return (
    <Drawer
      open={cartOpen}
      onClose={ui.closeCart}
      title={`Your bag (${totals.itemCount})`}
      footer={
        priced.length > 0 ? (
          <div className="space-y-4">
            <FreeDeliveryMeter remaining={totals.freeDeliveryRemaining} subtotal={totals.subtotal} />
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted">Subtotal</span>
              <span className="font-semibold">{formatPKR(totals.subtotal)}</span>
            </div>
            <p className="text-xs text-faint">Delivery & discounts calculated at checkout.</p>
            <div className="grid grid-cols-2 gap-2">
              <ButtonLink href="/cart" variant="outline">
                View bag
              </ButtonLink>
              <ButtonLink href="/checkout">Checkout</ButtonLink>
            </div>
          </div>
        ) : undefined
      }
    >
      {priced.length === 0 ? (
        <div className="flex h-full flex-col items-center justify-center px-8 py-16 text-center">
          <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-full border border-line-strong">
            <ShoppingBag className="h-6 w-6 text-silver" />
          </div>
          <p className="font-display text-3xl">Your bag is empty</p>
          <p className="mt-2 text-sm text-muted">Discover pieces made to last.</p>
          <ButtonLink href="/shop" className="mt-6">
            Continue shopping
          </ButtonLink>
        </div>
      ) : (
        <ul className="divide-y divide-line px-5">
          <AnimatePresence initial={false}>
            {priced.map((l) => (
              <motion.li key={l.key} layout exit={{ opacity: 0, x: 40 }} className="flex gap-4 py-5">
                <Link href={`/product/${l.product.slug}`} className="relative h-28 w-22 shrink-0 overflow-hidden rounded-xl bg-ink-3">
                  <ProductImage image={l.product.images[0]} sizes="88px" />
                </Link>
                <div className="flex min-w-0 flex-1 flex-col">
                  <div className="flex justify-between gap-2">
                    <Link href={`/product/${l.product.slug}`} className="text-sm leading-snug font-medium hover:underline">
                      {l.product.name}
                    </Link>
                    <button type="button" onClick={() => cart.remove(l.key)} aria-label={`Remove ${l.product.name}`} className="h-8 w-8 shrink-0 rounded-full text-faint hover:text-fg">
                      <Trash className="mx-auto h-4 w-4" />
                    </button>
                  </div>
                  <p className="mt-0.5 text-xs text-faint">{[l.color, l.size].filter(Boolean).join(" · ")}</p>
                  <div className="mt-auto flex items-end justify-between pt-3">
                    <QuantityStepper size="sm" value={l.quantity} max={maxQuantity(l.product.stock)} onChange={(n) => cart.setQuantity(l.key, n)} label={`Quantity for ${l.product.name}`} />
                    <span className="text-sm font-semibold">{formatPKR(l.lineTotal)}</span>
                  </div>
                </div>
              </motion.li>
            ))}
          </AnimatePresence>
        </ul>
      )}
    </Drawer>
  );
}
