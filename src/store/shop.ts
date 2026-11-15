"use client";

import { createStore, useStore } from "./create-store";
import type { CartLine } from "@/lib/types";
import { getProductById } from "@/lib/catalog";

const MAX_QTY = 10;
const isStr = (v: unknown): v is string => typeof v === "string" && v.length < 120;

export function lineKey(productId: string, color?: string, size?: string) {
  return [productId, color ?? "", size ?? ""].join("|");
}

/* ---------------- Cart ---------------- */
export interface CartState {
  lines: CartLine[];
  coupon: string | null;
}

export const cartStore = createStore<CartState>(
  { lines: [], coupon: null },
  {
    key: "rk.cart.v1",
    validate: (raw) => {
      if (!raw || typeof raw !== "object") return null;
      const r = raw as { lines?: unknown; coupon?: unknown };
      if (!Array.isArray(r.lines)) return null;
      const lines: CartLine[] = r.lines
        .filter(
          (l): l is CartLine =>
            !!l &&
            isStr((l as CartLine).productId) &&
            Number.isInteger((l as CartLine).quantity) &&
            !!getProductById((l as CartLine).productId),
        )
        .map((l) => {
          const color = isStr(l.color) ? l.color : undefined;
          const size = isStr(l.size) ? l.size : undefined;
          return {
            key: lineKey(l.productId, color, size),
            productId: l.productId,
            quantity: Math.min(Math.max(1, l.quantity), MAX_QTY),
            color,
            size,
          };
        })
        .slice(0, 50);
      const coupon = isStr(r.coupon) && /^[A-Z0-9]{3,20}$/.test(r.coupon) ? r.coupon : null;
      return { lines, coupon };
    },
  },
);

export const cart = {
  add(productId: string, opts: { color?: string; size?: string; quantity?: number } = {}) {
    const product = getProductById(productId);
    if (!product || product.stock <= 0) return false;
    const key = lineKey(productId, opts.color, opts.size);
    const qty = opts.quantity ?? 1;
    const limit = Math.min(MAX_QTY, product.stock);
    cartStore.set((s) => {
      const existing = s.lines.find((l) => l.key === key);
      const lines = existing
        ? s.lines.map((l) => (l.key === key ? { ...l, quantity: Math.min(limit, l.quantity + qty) } : l))
        : [...s.lines, { key, productId, quantity: Math.min(limit, qty), color: opts.color, size: opts.size }];
      return { ...s, lines };
    });
    return true;
  },
  setQuantity(key: string, quantity: number) {
    cartStore.set((s) => ({
      ...s,
      lines: s.lines.map((l) => {
        if (l.key !== key) return l;
        const stock = getProductById(l.productId)?.stock ?? MAX_QTY;
        return { ...l, quantity: Math.min(Math.max(1, quantity), MAX_QTY, stock) };
      }),
    }));
  },
  remove(key: string) {
    cartStore.set((s) => ({ ...s, lines: s.lines.filter((l) => l.key !== key) }));
  },
  setCoupon(code: string | null) {
    cartStore.set((s) => ({ ...s, coupon: code ? code.toUpperCase() : null }));
  },
  clear() {
    cartStore.set({ lines: [], coupon: null });
  },
};

export const useCart = () => useStore(cartStore);
export const maxQuantity = (stock: number) => Math.min(MAX_QTY, stock);

/* ---------------- Wishlist ---------------- */
const idList = (raw: unknown, max: number) =>
  Array.isArray(raw) ? raw.filter((x): x is string => isStr(x) && !!getProductById(x)).slice(0, max) : null;

export const wishlistStore = createStore<string[]>([], {
  key: "rk.wishlist.v1",
  validate: (raw) => idList(raw, 100),
});

export const wishlist = {
  /** Returns true when the item was added, false when removed. */
  toggle(id: string) {
    const added = !wishlistStore.get().includes(id);
    wishlistStore.set((s) => (added ? [id, ...s.filter((x) => x !== id)] : s.filter((x) => x !== id)));
    return added;
  },
  remove(id: string) {
    wishlistStore.set((s) => s.filter((x) => x !== id));
  },
};
export const useWishlist = () => useStore(wishlistStore);

/* ---------------- Recently viewed ---------------- */
export const recentStore = createStore<string[]>([], {
  key: "rk.recent.v1",
  validate: (raw) => idList(raw, 12),
});
export function pushRecent(id: string) {
  recentStore.set((s) => [id, ...s.filter((x) => x !== id)].slice(0, 12));
}
export const useRecent = () => useStore(recentStore);
