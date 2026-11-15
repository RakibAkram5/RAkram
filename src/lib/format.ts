import type { Product, ProductImage, StockStatus } from "./types";

const pkr = new Intl.NumberFormat("en-PK", { maximumFractionDigits: 0 });

/** Format a whole-rupee amount, e.g. 12500 -> "Rs. 12,500" */
export function formatPKR(amount: number): string {
  return `Rs. ${pkr.format(Math.round(amount))}`;
}

export function discountPercent(p: Pick<Product, "price" | "compareAtPrice">): number {
  if (!p.compareAtPrice || p.compareAtPrice <= p.price) return 0;
  return Math.round(((p.compareAtPrice - p.price) / p.compareAtPrice) * 100);
}

export function stockStatus(stock: number): StockStatus {
  if (stock <= 0) return "out_of_stock";
  if (stock <= 5) return "low_stock";
  return "in_stock";
}

export const stockLabel: Record<StockStatus, string> = {
  in_stock: "In stock",
  low_stock: "Low stock",
  out_of_stock: "Out of stock",
};

/** Build an image URL. Demo images are Unsplash ids; absolute URLs pass through. */
export function imageUrl(img: ProductImage): string {
  if (/^https?:\/\//.test(img.src)) return img.src;
  const base = `https://images.unsplash.com/photo-${img.src}`;
  if (img.focal) {
    const [x, y, z] = img.focal;
    return `${base}?fit=crop&ar=4:5&crop=focalpoint&fp-x=${x}&fp-y=${y}&fp-z=${z}`;
  }
  return base;
}

export function formatDate(iso: string, opts?: Intl.DateTimeFormatOptions): string {
  return new Date(iso).toLocaleDateString("en-PK", {
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "Asia/Karachi",
    ...opts,
  });
}

export function cn(...classes: Array<string | false | null | undefined>): string {
  return classes.filter(Boolean).join(" ");
}
