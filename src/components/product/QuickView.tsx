"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { getProductById } from "@/lib/catalog";
import { ui, useUI } from "@/store/ui";
import { Modal } from "@/components/ui/Overlay";
import { ProductImage } from "@/components/ui/ProductImage";
import { Rating } from "@/components/ui/bits";
import { PurchasePanel } from "./PurchasePanel";

export function QuickView() {
  const { quickViewId } = useUI();
  const product = quickViewId ? getProductById(quickViewId) : undefined;
  return (
    <Modal open={!!product} onClose={() => ui.quickView(null)} title={product ? `Quick view: ${product.name}` : "Quick view"} hideTitle className="sm:max-w-4xl">
      {product && (
        <div className="grid gap-0 sm:grid-cols-2">
          <div className="relative aspect-[4/5] sm:aspect-auto sm:min-h-[520px]">
            <ProductImage image={product.images[0]} sizes="(min-width: 640px) 450px, 100vw" />
          </div>
          <div className="flex flex-col gap-5 p-6 sm:p-8">
            <div>
              <p className="eyebrow">{product.brand}</p>
              <h2 className="mt-2 font-display text-3xl leading-tight">{product.name}</h2>
              <div className="mt-3">
                <Rating value={product.rating} count={product.reviewCount} />
              </div>
              <p className="mt-4 text-sm leading-relaxed text-muted">{product.shortDescription}</p>
            </div>
            <PurchasePanel key={product.id} product={product} onAdded={() => ui.quickView(null)} />
            <Link
              href={`/product/${product.slug}`}
              onClick={() => ui.quickView(null)}
              className="inline-flex items-center gap-2 text-xs font-semibold tracking-widest text-silver uppercase hover:text-fg"
            >
              Full details <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
      )}
    </Modal>
  );
}
