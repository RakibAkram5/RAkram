"use client";

import { useSearchParams } from "next/navigation";
import type { Product, SortKey } from "@/lib/types";
import { sortOptions } from "@/lib/catalog";
import { CatalogBrowser } from "./CatalogBrowser";

/**
 * Reads initial filters from the URL (?q=, ?category=, ?sub=, ?sort=) and
 * re-initialises the browser when they change (e.g. a new header search).
 * Must be rendered inside <Suspense>.
 */
export function UrlCatalog({
  products,
  subcategories,
  showCategories = true,
}: {
  products: Product[];
  subcategories?: { slug: string; name: string }[];
  showCategories?: boolean;
}) {
  const sp = useSearchParams();
  const q = (sp.get("q") ?? "").slice(0, 80);
  const cat = sp.get("category");
  const sub = sp.get("sub");
  const sortParam = sp.get("sort");
  const sort = sortOptions.some((o) => o.value === sortParam) ? (sortParam as SortKey) : undefined;
  const key = [q, cat, sub, sort].join("|");
  return (
    <CatalogBrowser
      key={key}
      products={products}
      facets={{ categories: showCategories, subcategories }}
      initial={{
        query: q,
        categories: cat ? [cat] : [],
        subcategories: sub && subcategories?.some((s) => s.slug === sub) ? [sub] : [],
        ...(sort ? { sort } : {}),
      }}
    />
  );
}
