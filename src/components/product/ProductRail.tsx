"use client";

import { useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { Product } from "@/lib/types";
import { ProductCard } from "./ProductCard";

/** Horizontally scrolling product row with snap + desktop arrows. */
export function ProductRail({ products, label = "Products" }: { products: Product[]; label?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const scroll = (d: number) => ref.current?.scrollBy({ left: d * ref.current.clientWidth * 0.8, behavior: "smooth" });
  return (
    <div className="relative">
      <div
        ref={ref}
        role="region"
        aria-label={label}
        tabIndex={0}
        className="no-scrollbar -mx-4 flex snap-x snap-mandatory gap-3 overflow-x-auto scroll-px-4 px-4 pb-2 sm:-mx-6 sm:gap-5 sm:scroll-px-6 sm:px-6 lg:mx-0 lg:scroll-px-0 lg:px-0"
      >
        {products.map((p) => (
          <ProductCard key={p.id} product={p} className="w-[46%] shrink-0 snap-start sm:w-[31%] lg:w-[23.5%]" />
        ))}
      </div>
      {products.length > 4 && (
        <div className="mt-6 hidden justify-end gap-2 lg:flex">
          <button type="button" onClick={() => scroll(-1)} aria-label="Scroll left" className="glass flex h-11 w-11 items-center justify-center rounded-full hover:bg-white/10">
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button type="button" onClick={() => scroll(1)} aria-label="Scroll right" className="glass flex h-11 w-11 items-center justify-center rounded-full hover:bg-white/10">
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      )}
    </div>
  );
}
