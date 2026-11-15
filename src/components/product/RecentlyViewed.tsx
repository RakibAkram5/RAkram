"use client";

import { useEffect } from "react";
import { getProductById } from "@/lib/catalog";
import type { Product } from "@/lib/types";
import { pushRecent, useRecent } from "@/store/shop";
import { SectionHeading } from "@/components/ui/bits";
import { ProductRail } from "./ProductRail";

/** Records a product view (ids only, in localStorage). */
export function TrackView({ id }: { id: string }) {
  useEffect(() => {
    pushRecent(id);
  }, [id]);
  return null;
}

export function RecentlyViewed({ excludeId }: { excludeId?: string }) {
  const ids = useRecent();
  const items = ids
    .filter((id) => id !== excludeId)
    .map((id) => getProductById(id))
    .filter((p): p is Product => !!p)
    .slice(0, 8);
  if (!items.length) return null;
  return (
    <section className="container-lux py-16 sm:py-20" aria-labelledby="recent-heading">
      <SectionHeading eyebrow="Your journey" title={<span id="recent-heading">Recently viewed</span>} />
      <ProductRail products={items} />
    </section>
  );
}
