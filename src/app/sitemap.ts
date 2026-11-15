import type { MetadataRoute } from "next";
import { categories, collections } from "@/data/categories";
import { allProducts } from "@/lib/catalog";
import { site } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const u = (p: string) => `${site.url}${p}`;
  const staticPages = ["", "/shop", "/delivery", "/about", "/help", "/track-order"].map((p) => ({
    url: u(p),
    changeFrequency: "weekly" as const,
    priority: p === "" ? 1 : 0.6,
  }));
  return [
    ...staticPages,
    ...categories.map((c) => ({ url: u(`/category/${c.slug}`), changeFrequency: "weekly" as const, priority: 0.8 })),
    ...collections.map((c) => ({ url: u(`/collections/${c.slug}`), changeFrequency: "daily" as const, priority: 0.7 })),
    ...allProducts.map((p) => ({ url: u(`/product/${p.slug}`), lastModified: p.createdAt, changeFrequency: "weekly" as const, priority: 0.7 })),
  ];
}
