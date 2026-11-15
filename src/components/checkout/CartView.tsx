"use client";

import Link from "next/link";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { ArrowLeft, Heart, Lock, ShoppingBag, Tag, Trash } from "lucide-react";
import { coupons } from "@/data/content";
import { formatPKR } from "@/lib/format";
import { checkCoupon, computeTotals, priceLines, type Totals } from "@/lib/pricing";
import { cart, maxQuantity, useCart, wishlist, wishlistStore } from "@/store/shop";
import { ui } from "@/store/ui";
import { useHydrated } from "@/store/create-store";
import { ProductImage } from "@/components/ui/ProductImage";
import { Button, ButtonLink } from "@/components/ui/Button";
import { DemoNotice, EmptyState, Skeleton, StockIndicator } from "@/components/ui/bits";
import { QuantityStepper } from "@/components/product/PurchasePanel";
import { FreeDeliveryMeter } from "@/components/layout/Overlays";

export function CouponForm({ subtotal, applied }: { subtotal: number; applied: string | null }) {
  const [code, setCode] = useState("");
  const [error, setError] = useState<string>();
  if (applied) {
    const c = coupons.find((x) => x.code === applied);
    const res = checkCoupon(applied, subtotal);
    return (
      <div className="flex items-center justify-between gap-3 rounded-2xl border border-line p-3 text-sm">
        <span className="flex min-w-0 items-center gap-2">
          <Tag className="h-4 w-4 shrink-0 text-success" aria-hidden />
          <span className="min-w-0">
            <span className="font-semibold">{applied}</span>
            <span className="block truncate text-xs text-faint">{res.ok ? c?.description : res.error}</span>
          </span>
        </span>
        <button type="button" onClick={() => cart.setCoupon(null)} className="text-xs text-muted underline underline-offset-4 hover:text-fg">
          Remove
        </button>
      </div>
    );
  }
  return (
    <form
      noValidate
      onSubmit={(e) => {
        e.preventDefault();
        const res = checkCoupon(code, subtotal);
        if (res.ok) {
          cart.setCoupon(res.coupon.code);
          setError(undefined);
          setCode("");
          ui.toast(`Code ${res.coupon.code} applied`, "success");
        } else setError(res.error);
      }}
    >
      <label htmlFor="coupon" className="mb-2 block text-xs font-semibold text-silver">
        Discount code
      </label>
      <div className="flex gap-2">
        <input
          id="coupon"
          value={code}
          onChange={(e) => setCode(e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, 20))}
          placeholder="e.g. RAKRAM10"
          autoComplete="off"
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? "coupon-err" : "coupon-hint"}
          className="field h-11 py-0 text-sm uppercase"
        />
        <Button type="submit" variant="outline" className="shrink-0">
          Apply
        </Button>
      </div>
      {error ? (
        <p id="coupon-err" role="alert" className="mt-2 text-xs text-danger">
          {error}
        </p>
      ) : (
        <p id="coupon-hint" className="mt-2 text-xs text-faint">
          Demo codes: RAKRAM10 · WELCOME500 · FREESHIP
        </p>
      )}
    </form>
  );
}

export function SummaryRows({ totals, deliveryKnown }: { totals: Totals; deliveryKnown: boolean }) {
  return (
    <dl className="space-y-3 text-sm">
      <div className="flex justify-between">
        <dt className="text-muted">Subtotal ({totals.itemCount} items)</dt>
        <dd>{formatPKR(totals.subtotal)}</dd>
      </div>
      {totals.discount > 0 && (
        <div className="flex justify-between text-success">
          <dt>Discount</dt>
          <dd>−{formatPKR(totals.discount)}</dd>
        </div>
      )}
      <div className="flex justify-between">
        <dt className="text-muted">
          Delivery
          {totals.zone && <span className="block text-xs text-faint">{totals.zone.label} · {totals.zone.minDays}–{totals.zone.maxDays} days</span>}
          {!deliveryKnown && !totals.zone && <span className="block text-xs text-faint">Estimated — final after address</span>}
        </dt>
        <dd>{totals.deliveryFee === 0 ? <span className="text-success">Free</span> : formatPKR(totals.deliveryFee)}</dd>
      </div>
      <div className="flex items-baseline justify-between border-t border-line pt-4">
        <dt className="font-semibold">Total</dt>
        <dd className="text-xl font-semibold">{formatPKR(totals.total)}</dd>
      </div>
      <p className="text-right text-[11px] text-faint">Prices in PKR, inclusive of applicable taxes (demo).</p>
    </dl>
  );
}

export function CartView() {
  const hydrated = useHydrated();
  const { lines, coupon } = useCart();
  const priced = priceLines(lines);
  const totals = computeTotals(priced, coupon);

  if (!hydrated) {
    return (
      <div className="grid gap-10 lg:grid-cols-12">
        <div className="space-y-4 lg:col-span-8">
          {[0, 1].map((i) => (
            <Skeleton key={i} className="h-36 w-full rounded-3xl" />
          ))}
        </div>
        <Skeleton className="h-80 rounded-3xl lg:col-span-4" />
      </div>
    );
  }

  if (!priced.length) {
    return (
      <EmptyState
        icon={<ShoppingBag className="h-6 w-6" />}
        title="Your bag is empty"
        body="Looks like you haven’t added anything yet. Explore the collection and find something you’ll keep for years."
        action={<ButtonLink href="/shop">Continue shopping</ButtonLink>}
      />
    );
  }

  return (
    <div className="grid gap-10 lg:grid-cols-12">
      <div className="lg:col-span-8">
        <ul className="divide-y divide-line border-y border-line">
          <AnimatePresence initial={false}>
            {priced.map((l) => (
              <motion.li key={l.key} layout exit={{ opacity: 0, height: 0 }} className="flex gap-4 py-6 sm:gap-6">
                <Link href={`/product/${l.product.slug}`} className="relative aspect-[4/5] w-24 shrink-0 overflow-hidden rounded-2xl bg-ink-3 sm:w-32">
                  <ProductImage image={l.product.images[0]} sizes="128px" />
                </Link>
                <div className="flex min-w-0 flex-1 flex-col">
                  <div className="flex flex-col gap-1 sm:flex-row sm:justify-between sm:gap-4">
                    <div className="min-w-0">
                      <p className="text-[10px] tracking-[0.2em] text-faint uppercase">{l.product.brand}</p>
                      <Link href={`/product/${l.product.slug}`} className="mt-1 block font-medium hover:underline">
                        {l.product.name}
                      </Link>
                      <p className="mt-1 text-xs text-faint">{[l.color, l.size].filter(Boolean).join(" · ") || "One size"}</p>
                      <div className="mt-2">
                        <StockIndicator stock={l.product.stock} />
                      </div>
                    </div>
                    <p className="font-semibold sm:text-right">
                      {formatPKR(l.lineTotal)}
                      {l.quantity > 1 && <span className="block text-xs font-normal text-faint">{formatPKR(l.unitPrice)} each</span>}
                    </p>
                  </div>
                  <div className="mt-auto flex flex-wrap items-center gap-x-5 gap-y-2 pt-4">
                    <QuantityStepper size="sm" value={l.quantity} max={maxQuantity(l.product.stock)} onChange={(n) => cart.setQuantity(l.key, n)} label={`Quantity for ${l.product.name}`} />
                    <button
                      type="button"
                      onClick={() => {
                        if (!wishlistStore.get().includes(l.productId)) wishlist.toggle(l.productId);
                        cart.remove(l.key);
                        ui.toast("Moved to wishlist");
                      }}
                      className="inline-flex items-center gap-1.5 text-xs text-muted hover:text-fg"
                    >
                      <Heart className="h-3.5 w-3.5" /> Save for later
                    </button>
                    <button type="button" onClick={() => cart.remove(l.key)} className="inline-flex items-center gap-1.5 text-xs text-muted hover:text-fg">
                      <Trash className="h-3.5 w-3.5" /> Remove
                    </button>
                  </div>
                </div>
              </motion.li>
            ))}
          </AnimatePresence>
        </ul>
        <Link href="/shop" className="mt-6 inline-flex items-center gap-2 text-sm text-muted hover:text-fg">
          <ArrowLeft className="h-4 w-4" /> Continue shopping
        </Link>
      </div>

      <aside className="lg:col-span-4" aria-label="Order summary">
        <div className="glass edge space-y-6 rounded-3xl p-6 lg:sticky lg:top-24">
          <h2 className="font-display text-2xl">Order summary</h2>
          <FreeDeliveryMeter remaining={totals.freeDeliveryRemaining} subtotal={totals.subtotal} />
          <CouponForm subtotal={totals.subtotal} applied={coupon} />
          <SummaryRows totals={totals} deliveryKnown={false} />
          <ButtonLink href="/checkout" size="lg" className="w-full">
            <Lock className="h-4 w-4" /> Proceed to checkout
          </ButtonLink>
          <DemoNotice>Checkout is a demonstration. No order will be placed and no payment will be taken.</DemoNotice>
        </div>
      </aside>
    </div>
  );
}

