/**
 * RAKRAM domain models.
 *
 * These types are the contract between the UI and the (future) backend API.
 * Phase 2 services should return data in exactly these shapes so components
 * do not need to change when mock data is replaced.
 */

export type CategorySlug = string;

export interface Subcategory {
  slug: string;
  name: string;
}

export interface Category {
  slug: CategorySlug;
  name: string;
  /** Short line used on category tiles */
  tagline: string;
  description: string;
  image: ProductImage;
  subcategories: Subcategory[];
  /** Display order; lower first */
  order: number;
}

export interface ProductImage {
  /** Unsplash photo id (demo) or absolute URL (production CDN) */
  src: string;
  alt: string;
  /** Optional focal-point crop: [x, y, zoom], each 0..1 (zoom >= 1) */
  focal?: [number, number, number];
}

export interface ColorOption {
  name: string;
  hex: string;
}

export interface ProductVariants {
  colors?: ColorOption[];
  sizes?: string[];
}

export type ProductTag = "new" | "bestseller" | "trending" | "featured";

export interface Product {
  id: string;
  slug: string;
  name: string;
  brand: string;
  category: CategorySlug;
  subcategory: string;
  shortDescription: string;
  description: string;
  highlights: string[];
  specs: Record<string, string>;
  /** Price in PKR (whole rupees) */
  price: number;
  /** Original price in PKR when discounted */
  compareAtPrice?: number;
  images: ProductImage[];
  variants?: ProductVariants;
  /** Demo average rating 0..5 */
  rating: number;
  reviewCount: number;
  /** Demo stock units — not real inventory */
  stock: number;
  sku: string;
  tags: ProductTag[];
  /** ISO date — used for "newest" sorting */
  createdAt: string;
  /** Demo popularity score used for "popular" sorting */
  popularity: number;
}

export type StockStatus = "in_stock" | "low_stock" | "out_of_stock";

export interface Collection {
  slug: string;
  title: string;
  eyebrow: string;
  description: string;
  image: ProductImage;
}

export interface CartLine {
  /** productId|color|size */
  key: string;
  productId: string;
  quantity: number;
  color?: string;
  size?: string;
}

export interface Coupon {
  code: string;
  description: string;
  type: "percent" | "fixed" | "free_shipping";
  value: number;
  minSubtotal: number;
  active: boolean;
  usageLimit?: number;
  used?: number;
  expiresAt?: string;
}

export type PaymentMethod = "cod" | "bank_transfer" | "easypaisa" | "jazzcash";

export interface Address {
  id?: string;
  label?: string;
  fullName: string;
  phone: string;
  house: string;
  street: string;
  area: string;
  city: string;
  province: string;
  postalCode: string;
  instructions?: string;
}

export type OrderStatus =
  | "pending"
  | "confirmed"
  | "packed"
  | "shipped"
  | "out_for_delivery"
  | "delivered"
  | "cancelled";

export interface OrderLine {
  productId: string;
  name: string;
  image: ProductImage;
  price: number;
  quantity: number;
  color?: string;
  size?: string;
}

export interface Order {
  id: string;
  number: string;
  createdAt: string;
  status: OrderStatus;
  customerName: string;
  customerEmail: string;
  phone: string;
  address: Address;
  lines: OrderLine[];
  subtotal: number;
  discount: number;
  deliveryFee: number;
  total: number;
  paymentMethod: PaymentMethod;
  paymentStatus: "unpaid" | "paid" | "refunded";
  timeline: { status: OrderStatus; at: string; note?: string }[];
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  city: string;
  orders: number;
  totalSpent: number;
  joinedAt: string;
  status: "active" | "blocked";
}

export interface Review {
  id: string;
  name: string;
  city: string;
  rating: number;
  title: string;
  body: string;
  product: string;
}

export type SortKey =
  | "featured"
  | "price_asc"
  | "price_desc"
  | "newest"
  | "popular"
  | "rating";

export interface CatalogFilters {
  query: string;
  categories: string[];
  subcategories: string[];
  brands: string[];
  minPrice: number | null;
  maxPrice: number | null;
  minRating: number | null;
  inStockOnly: boolean;
  onSaleOnly: boolean;
  sort: SortKey;
}
