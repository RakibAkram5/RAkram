import { products } from "@/data/products";
import { categories } from "@/data/categories";
import type { CatalogFilters, Product, SortKey } from "./types";
import { stockStatus } from "./format";

export const allProducts = products;

const byId = new Map(products.map((p) => [p.id, p]));
const bySlug = new Map(products.map((p) => [p.slug, p]));

export function getProductById(id: string): Product | undefined {
  return byId.get(id);
}

export function getProductBySlug(slug: string): Product | undefined {
  return bySlug.get(slug);
}

export function productsInCategory(slug: string): Product[] {
  return products.filter((p) => p.category === slug);
}

/** Resolve a collection slug to its products. Data-driven: add rules here. */
export function productsInCollection(slug: string): Product[] {
  switch (slug) {
    case "new-arrivals":
      return [...products].sort((a, b) => b.createdAt.localeCompare(a.createdAt)).slice(0, 16);
    case "best-sellers":
      return products.filter((p) => p.tags.includes("bestseller"));
    case "trending":
      return products.filter((p) => p.tags.includes("trending"));
    case "featured":
      return products.filter((p) => p.tags.includes("featured"));
    case "sale":
      return products.filter((p) => p.compareAtPrice && p.compareAtPrice > p.price);
    default:
      return [];
  }
}

export function relatedProducts(product: Product, limit = 8): Product[] {
  const same = products.filter(
    (p) => p.id !== product.id && p.category === product.category,
  );
  same.sort(
    (a, b) =>
      Number(b.subcategory === product.subcategory) - Number(a.subcategory === product.subcategory) ||
      b.popularity - a.popularity,
  );
  return same.slice(0, limit);
}

export const defaultFilters: CatalogFilters = {
  query: "",
  categories: [],
  subcategories: [],
  brands: [],
  minPrice: null,
  maxPrice: null,
  minRating: null,
  inStockOnly: false,
  onSaleOnly: false,
  sort: "featured",
};

function normalise(s: string) {
  return s
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9\s&]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

const categoryNames = new Map(categories.map((c) => [c.slug, c.name]));

function haystack(p: Product): string {
  const cat = categories.find((c) => c.slug === p.category);
  const sub = cat?.subcategories.find((s) => s.slug === p.subcategory)?.name ?? "";
  return normalise(
    [p.name, p.brand, categoryNames.get(p.category), sub, p.shortDescription, p.tags.join(" ")].join(" "),
  );
}
const haystacks = new Map(products.map((p) => [p.id, haystack(p)]));

/** Relevance score for a query; 0 means no match. Every term must match. */
export function scoreProduct(p: Product, query: string): number {
  const q = normalise(query);
  if (!q) return 1;
  const terms = q.split(" ");
  const hs = haystacks.get(p.id) ?? haystack(p);
  const name = normalise(p.name);
  let score = 0;
  for (const t of terms) {
    if (!hs.includes(t)) return 0;
    score += name.includes(t) ? 3 : 1;
    if (name.startsWith(t)) score += 2;
  }
  return score;
}

export function searchProducts(query: string, limit = 6): Product[] {
  if (!normalise(query)) return [];
  return products
    .map((p) => ({ p, s: scoreProduct(p, query) }))
    .filter((x) => x.s > 0)
    .sort((a, b) => b.s - a.s || b.p.popularity - a.p.popularity)
    .slice(0, limit)
    .map((x) => x.p);
}

export function searchCategories(query: string) {
  const q = normalise(query);
  if (!q) return [];
  return categories.filter(
    (c) =>
      normalise(c.name).includes(q) ||
      c.subcategories.some((s) => normalise(s.name).includes(q)),
  );
}

const sorters: Record<SortKey, (a: Product, b: Product) => number> = {
  featured: (a, b) =>
    Number(b.tags.includes("featured")) - Number(a.tags.includes("featured")) ||
    b.popularity - a.popularity,
  price_asc: (a, b) => a.price - b.price,
  price_desc: (a, b) => b.price - a.price,
  newest: (a, b) => b.createdAt.localeCompare(a.createdAt),
  popular: (a, b) => b.popularity - a.popularity,
  rating: (a, b) => b.rating - a.rating || b.reviewCount - a.reviewCount,
};

export function applyFilters(list: Product[], f: CatalogFilters): Product[] {
  const hasQuery = normalise(f.query).length > 0;
  const scored = list
    .map((p) => ({ p, s: hasQuery ? scoreProduct(p, f.query) : 1 }))
    .filter(({ p, s }) => {
      if (s === 0) return false;
      if (f.categories.length && !f.categories.includes(p.category)) return false;
      if (f.subcategories.length && !f.subcategories.includes(p.subcategory)) return false;
      if (f.brands.length && !f.brands.includes(p.brand)) return false;
      if (f.minPrice != null && p.price < f.minPrice) return false;
      if (f.maxPrice != null && p.price > f.maxPrice) return false;
      if (f.minRating != null && p.rating < f.minRating) return false;
      if (f.inStockOnly && stockStatus(p.stock) === "out_of_stock") return false;
      if (f.onSaleOnly && !(p.compareAtPrice && p.compareAtPrice > p.price)) return false;
      return true;
    });
  scored.sort((a, b) =>
    hasQuery && f.sort === "featured" ? b.s - a.s || sorters.popular(a.p, b.p) : sorters[f.sort](a.p, b.p),
  );
  return scored.map((x) => x.p);
}

export function countActiveFilters(f: CatalogFilters): number {
  return (
    f.categories.length +
    f.subcategories.length +
    f.brands.length +
    (f.minPrice != null ? 1 : 0) +
    (f.maxPrice != null ? 1 : 0) +
    (f.minRating != null ? 1 : 0) +
    (f.inStockOnly ? 1 : 0) +
    (f.onSaleOnly ? 1 : 0)
  );
}

export const sortOptions: { value: SortKey; label: string }[] = [
  { value: "featured", label: "Featured" },
  { value: "popular", label: "Most popular" },
  { value: "newest", label: "Newest" },
  { value: "price_asc", label: "Price: low to high" },
  { value: "price_desc", label: "Price: high to low" },
  { value: "rating", label: "Top rated" },
];
