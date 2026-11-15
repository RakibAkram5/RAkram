import { categories, collections } from "@/data/categories";
import {
  allProducts,
  getProductBySlug,
  productsInCategory,
  productsInCollection,
  relatedProducts,
} from "@/lib/catalog";
import type { Category, Collection, Product } from "@/lib/types";

/**
 * Catalogue service — the single seam between UI and data.
 * Phase 1 resolves from bundled demo data. Phase 2: replace each body with
 * `http<...>("/catalog/...")` calls; signatures stay the same.
 */
export const catalogService = {
  async listProducts(): Promise<Product[]> {
    return allProducts;
  },
  async getProduct(slug: string): Promise<Product | null> {
    return getProductBySlug(slug) ?? null;
  },
  async listCategories(): Promise<Category[]> {
    return [...categories].sort((a, b) => a.order - b.order);
  },
  async getCategory(slug: string): Promise<{ category: Category; products: Product[] } | null> {
    const category = categories.find((c) => c.slug === slug);
    return category ? { category, products: productsInCategory(slug) } : null;
  },
  async listCollections(): Promise<Collection[]> {
    return collections;
  },
  async getCollection(slug: string): Promise<{ collection: Collection; products: Product[] } | null> {
    const collection = collections.find((c) => c.slug === slug);
    return collection ? { collection, products: productsInCollection(slug) } : null;
  },
  async related(product: Product, limit = 8): Promise<Product[]> {
    return relatedProducts(product, limit);
  },
};
