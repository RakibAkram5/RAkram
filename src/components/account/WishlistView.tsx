"use client";

import { Heart } from "lucide-react";
import { getProductById } from "@/lib/catalog";
import type { Product } from "@/lib/types";
import { useWishlist } from "@/store/shop";
import { useHydrated } from "@/store/create-store";
import { ProductGrid } from "@/components/product/ProductCard";
import { ButtonLink } from "@/components/ui/Button";
import { EmptyState, ProductCardSkeleton } from "@/components/ui/bits";

export function WishlistView() {
  const hydrated = useHydrated();
  const ids = useWishlist();
  const items = ids.map(getProductById).filter((p): p is Product => !!p);
  if (!hydrated)
    return (
      <div className="grid grid-cols-2 gap-5 md:grid-cols-4">
        {[0, 1, 2, 3].map((i) => (
          <ProductCardSkeleton key={i} />
        ))}
      </div>
    );
  if (!items.length)
    return (
      <EmptyState
        icon={<Heart className="h-6 w-6" />}
        title="Your wishlist is empty"
        body="Tap the heart on any product to save it here for later."
        action={<ButtonLink href="/shop">Discover products</ButtonLink>}
      />
    );
  return (
    <>
      <p className="mb-6 text-sm text-muted">
        {items.length} saved {items.length === 1 ? "item" : "items"} · stored on this device only
      </p>
      <ProductGrid products={items} />
    </>
  );
}
