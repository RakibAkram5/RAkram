"use client";

import { useState } from "react";
import { Heart, Minus, Plus, ShoppingBag } from "lucide-react";
import type { Product } from "@/lib/types";
import { cn, stockStatus } from "@/lib/format";
import { Button } from "@/components/ui/Button";
import { Price, StockIndicator } from "@/components/ui/bits";
import { cart, maxQuantity, useWishlist, wishlist } from "@/store/shop";
import { ui } from "@/store/ui";

export function QuantityStepper({
  value,
  onChange,
  max,
  label = "Quantity",
  size = "md",
}: {
  value: number;
  onChange: (n: number) => void;
  max: number;
  label?: string;
  size?: "sm" | "md";
}) {
  const h = size === "sm" ? "h-8" : "h-11";
  return (
    <div className={cn("inline-flex items-center rounded-full border border-line-strong", h)} role="group" aria-label={label}>
      <button
        type="button"
        onClick={() => onChange(Math.max(1, value - 1))}
        disabled={value <= 1}
        aria-label="Decrease quantity"
        className={cn("flex items-center justify-center rounded-full text-muted hover:text-fg disabled:opacity-30", size === "sm" ? "w-8" : "w-11")}
      >
        <Minus className="h-3.5 w-3.5" />
      </button>
      <span className={cn("min-w-6 text-center text-sm font-semibold tabular-nums", size === "sm" && "text-xs")} aria-live="polite">
        {value}
      </span>
      <button
        type="button"
        onClick={() => onChange(Math.min(max, value + 1))}
        disabled={value >= max}
        aria-label="Increase quantity"
        className={cn("flex items-center justify-center rounded-full text-muted hover:text-fg disabled:opacity-30", size === "sm" ? "w-8" : "w-11")}
      >
        <Plus className="h-3.5 w-3.5" />
      </button>
    </div>
  );
}

export function PurchasePanel({ product, onAdded }: { product: Product; onAdded?: () => void }) {
  const colors = product.variants?.colors ?? [];
  const sizes = product.variants?.sizes ?? [];
  const [color, setColor] = useState<string | undefined>(colors[0]?.name);
  const [size, setSize] = useState<string | undefined>(sizes.length === 1 ? sizes[0] : undefined);
  const [qty, setQty] = useState(1);
  const [sizeError, setSizeError] = useState(false);
  const saved = useWishlist().includes(product.id);
  const soldOut = stockStatus(product.stock) === "out_of_stock";

  const add = () => {
    if (sizes.length && !size) {
      setSizeError(true);
      return;
    }
    if (cart.add(product.id, { color, size, quantity: qty })) {
      ui.toast(`${product.name} added to bag`, "success");
      onAdded?.();
      ui.openCart();
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Price price={product.price} compareAt={product.compareAtPrice} size="lg" />
        <StockIndicator stock={product.stock} showCount />
      </div>

      {colors.length > 0 && (
        <fieldset>
          <legend className="mb-3 text-xs font-semibold tracking-wide text-silver">
            Colour: <span className="font-normal text-muted">{color}</span>
          </legend>
          <div className="flex flex-wrap gap-2.5">
            {colors.map((c) => (
              <label key={c.name} className="relative cursor-pointer">
                <input
                  type="radio"
                  name={`color-${product.id}`}
                  value={c.name}
                  checked={color === c.name}
                  onChange={() => setColor(c.name)}
                  className="peer sr-only"
                />
                <span className="sr-only">{c.name}</span>
                <span
                  aria-hidden
                  className="block h-9 w-9 rounded-full border border-white/20 ring-offset-2 ring-offset-ink transition peer-checked:ring-2 peer-checked:ring-silver peer-focus-visible:ring-2 peer-focus-visible:ring-white"
                  style={{ background: c.hex }}
                />
              </label>
            ))}
          </div>
        </fieldset>
      )}

      {sizes.length > 0 && (
        <fieldset>
          <legend className="mb-3 flex w-full items-center justify-between text-xs font-semibold tracking-wide text-silver">
            <span>
              Size{size && <span className="font-normal text-muted">: {size}</span>}
            </span>
          </legend>
          <div className="flex flex-wrap gap-2">
            {sizes.map((s) => (
              <label key={s} className="cursor-pointer">
                <input
                  type="radio"
                  name={`size-${product.id}`}
                  value={s}
                  checked={size === s}
                  onChange={() => {
                    setSize(s);
                    setSizeError(false);
                  }}
                  className="peer sr-only"
                />
                <span className="flex h-10 min-w-12 items-center justify-center rounded-full border border-line-strong px-4 text-xs font-semibold text-muted transition peer-checked:border-white peer-checked:bg-white peer-checked:text-ink peer-focus-visible:ring-2 peer-focus-visible:ring-white hover:border-white/40 hover:text-fg">
                  {s}
                </span>
              </label>
            ))}
          </div>
          {sizeError && (
            <p role="alert" className="mt-2 text-xs text-danger">
              Please select a size
            </p>
          )}
        </fieldset>
      )}

      <div className="flex flex-wrap items-center gap-3">
        {!soldOut && <QuantityStepper value={qty} onChange={setQty} max={maxQuantity(product.stock)} />}
        <Button size="lg" className="min-w-0 flex-1" onClick={add} disabled={soldOut}>
          <ShoppingBag className="h-4 w-4" />
          {soldOut ? "Sold out" : "Add to bag"}
        </Button>
        <button
          type="button"
          onClick={() => {
            const added = wishlist.toggle(product.id);
            ui.toast(added ? "Saved to wishlist" : "Removed from wishlist");
          }}
          aria-pressed={saved}
          aria-label={saved ? "Remove from wishlist" : "Save to wishlist"}
          className="glass flex h-13 w-13 min-h-[3.25rem] min-w-[3.25rem] items-center justify-center rounded-full transition hover:bg-white/10"
        >
          <Heart className={cn("h-5 w-5", saved ? "fill-white text-white" : "text-silver")} />
        </button>
      </div>
    </div>
  );
}
