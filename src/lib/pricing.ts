import { coupons } from "@/data/content";
import { deliveryConfig, zoneFor, type ZoneConfig } from "@/data/pakistan";
import { getProductById } from "./catalog";
import type { CartLine, Coupon, Product } from "./types";

/**
 * Cart pricing (DEMO). Prices are always looked up from the catalogue by id —
 * never from values stored in the browser. Phase 2: the server must compute
 * the authoritative totals at checkout.
 */

export interface PricedLine extends CartLine {
  product: Product;
  unitPrice: number;
  lineTotal: number;
}

export function priceLines(lines: CartLine[]): PricedLine[] {
  const out: PricedLine[] = [];
  for (const l of lines) {
    const product = getProductById(l.productId);
    if (!product) continue;
    out.push({ ...l, product, unitPrice: product.price, lineTotal: product.price * l.quantity });
  }
  return out;
}

export function findCoupon(code: string): Coupon | undefined {
  const c = code.trim().toUpperCase();
  return coupons.find((x) => x.code === c);
}

export type CouponResult = { ok: true; coupon: Coupon } | { ok: false; error: string };

export function checkCoupon(code: string, subtotal: number): CouponResult {
  if (!code.trim()) return { ok: false, error: "Enter a code" };
  if (!/^[A-Z0-9]{3,20}$/i.test(code.trim())) return { ok: false, error: "That code format isn't valid" };
  const coupon = findCoupon(code);
  if (!coupon) return { ok: false, error: "We couldn't find that code" };
  if (!coupon.active) return { ok: false, error: "This code has expired" };
  if (subtotal < coupon.minSubtotal)
    return { ok: false, error: `Spend Rs. ${coupon.minSubtotal.toLocaleString("en-PK")} to use this code` };
  return { ok: true, coupon };
}

export interface Totals {
  subtotal: number;
  discount: number;
  deliveryFee: number;
  total: number;
  zone: ZoneConfig | null;
  freeDeliveryRemaining: number;
  itemCount: number;
}

export function computeTotals(
  lines: PricedLine[],
  couponCode: string | null,
  destination?: { province: string; city: string },
): Totals {
  const subtotal = lines.reduce((s, l) => s + l.lineTotal, 0);
  const itemCount = lines.reduce((s, l) => s + l.quantity, 0);
  const res = couponCode ? checkCoupon(couponCode, subtotal) : null;
  const coupon = res?.ok ? res.coupon : null;

  let discount = 0;
  if (coupon?.type === "percent") discount = Math.round((subtotal * coupon.value) / 100);
  if (coupon?.type === "fixed") discount = Math.min(coupon.value, subtotal);

  const zone = destination?.province && destination.city ? zoneFor(destination.province, destination.city) : null;
  const qualifiesFree = subtotal >= deliveryConfig.freeDeliveryThreshold || coupon?.type === "free_shipping";
  const deliveryFee = subtotal === 0 || qualifiesFree ? 0 : zone ? zone.fee : deliveryConfig.zones.standard.fee;

  return {
    subtotal,
    discount,
    deliveryFee,
    total: Math.max(0, subtotal - discount + deliveryFee),
    zone,
    freeDeliveryRemaining: Math.max(0, deliveryConfig.freeDeliveryThreshold - subtotal),
    itemCount,
  };
}

export function estimateWindow(zone: ZoneConfig, from = new Date()): string {
  const add = (d: number) => {
    const x = new Date(from);
    let added = 0;
    while (added < d) {
      x.setDate(x.getDate() + 1);
      if (x.getDay() !== 0) added++; // skip Sundays
    }
    return x.toLocaleDateString("en-PK", { weekday: "short", day: "numeric", month: "short" });
  };
  return `${add(zone.minDays)} – ${add(zone.maxDays)}`;
}
