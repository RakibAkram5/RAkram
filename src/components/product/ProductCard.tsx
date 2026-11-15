"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { Eye, Heart, ShoppingBag } from "lucide-react";
import type { Product } from "@/lib/types";
import { cn, discountPercent, stockStatus } from "@/lib/format";
import { ProductImage } from "@/components/ui/ProductImage";
import { Badge, Price, Rating } from "@/components/ui/bits";
import { cart, useWishlist, wishlist } from "@/store/shop";
import { ui } from "@/store/ui";

export function ProductCard({ product, priority = false, className }: { product: Product; priority?: boolean; className?: string }) {
  const saved = useWishlist().includes(product.id);
  const pct = discountPercent(product);
  const status = stockStatus(product.stock);
  const needsOptions = (product.variants?.sizes?.length ?? 0) > 1 || (product.variants?.colors?.length ?? 0) > 1;
  const href = `/product/${product.slug}`;

  const quickAdd = () => {
    if (needsOptions) return ui.quickView(product.id);
    const ok = cart.add(product.id, {
      color: product.variants?.colors?.[0]?.name,
      size: product.variants?.sizes?.[0],
    });
    if (ok) {
      ui.toast(`${product.name} added to bag`, "success");
      ui.openCart();
    }
  };

  return (
    <motion.article
      className={cn("group relative flex flex-col", className)}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "0px 0px -40px 0px" }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="edge relative aspect-[4/5] overflow-hidden rounded-2xl bg-ink-3">
        <Link href={href} className="absolute inset-0" aria-label={product.name} tabIndex={-1}>
          <ProductImage
            image={product.images[0]}
            preload={priority}
            className={cn(
              "transition-transform duration-[1.2s] ease-[var(--ease-lux)] group-hover:scale-[1.06]",
              status === "out_of_stock" && "opacity-60 grayscale",
            )}
          />
          <span className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-70" />
        </Link>

        <div className="pointer-events-none absolute top-3 left-3 flex flex-col items-start gap-1.5">
          {status === "out_of_stock" ? (
            <Badge tone="muted">Sold out</Badge>
          ) : pct > 0 ? (
            <Badge tone="sale">−{pct}%</Badge>
          ) : product.tags.includes("new") ? (
            <Badge>New</Badge>
          ) : null}
        </div>

        <button
          type="button"
          onClick={() => {
            const added = wishlist.toggle(product.id);
            ui.toast(added ? "Saved to wishlist" : "Removed from wishlist");
          }}
          aria-pressed={saved}
          aria-label={saved ? `Remove ${product.name} from wishlist` : `Save ${product.name} to wishlist`}
          className="glass absolute top-3 right-3 flex h-9 w-9 items-center justify-center rounded-full transition-transform hover:scale-110"
        >
          <Heart className={cn("h-4 w-4 transition-colors", saved ? "fill-white text-white" : "text-silver")} />
        </button>

        {/* Hover actions (always visible on touch devices) */}
        <div className="absolute inset-x-3 bottom-3 flex gap-2 transition-all duration-500 ease-[var(--ease-lux)] [@media(hover:hover)]:translate-y-3 [@media(hover:hover)]:opacity-0 [@media(hover:hover)]:group-focus-within:translate-y-0 [@media(hover:hover)]:group-focus-within:opacity-100 [@media(hover:hover)]:group-hover:translate-y-0 [@media(hover:hover)]:group-hover:opacity-100">
          <button
            type="button"
            onClick={quickAdd}
            disabled={status === "out_of_stock"}
            className="btn-chrome flex h-10 flex-1 items-center justify-center gap-2 rounded-full text-xs font-semibold disabled:opacity-50"
          >
            <ShoppingBag className="h-3.5 w-3.5" />
            <span>{status === "out_of_stock" ? "Sold out" : needsOptions ? "Choose options" : "Add to bag"}</span>
          </button>
          <button
            type="button"
            onClick={() => ui.quickView(product.id)}
            aria-label={`Quick view ${product.name}`}
            className="glass-strong flex h-10 w-10 items-center justify-center rounded-full text-silver hover:text-fg"
          >
            <Eye className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className="mt-4 flex flex-1 flex-col gap-1.5 px-0.5">
        <p className="text-[10px] font-semibold tracking-[0.22em] text-faint uppercase">{product.brand}</p>
        <h3 className="text-sm leading-snug font-medium text-fg">
          <Link href={href} className="hover:underline hover:decoration-white/30 hover:underline-offset-4">
            {product.name}
          </Link>
        </h3>
        <Rating value={product.rating} count={product.reviewCount} />
        <Price price={product.price} compareAt={product.compareAtPrice} size="sm" className="mt-1" />
      </div>
    </motion.article>
  );
}

export function ProductGrid({ products, priorityCount = 0 }: { products: Product[]; priorityCount?: number }) {
  return (
    <div className="grid grid-cols-2 gap-x-3 gap-y-10 sm:gap-x-5 md:grid-cols-3 xl:grid-cols-4">
      {products.map((p, i) => (
        <ProductCard key={p.id} product={p} priority={i < priorityCount} />
      ))}
    </div>
  );
}
