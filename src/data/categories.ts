import type { Category, Collection } from "@/lib/types";

/**
 * Data-driven category tree. Adding a category here automatically adds its
 * navigation entry, category page, filters, sitemap entry and admin listing.
 */
export const categories: Category[] = [
  {
    slug: "fashion",
    name: "Fashion & Clothing",
    tagline: "Tailored essentials",
    description:
      "Considered wardrobe staples and statement outerwear, cut from premium fabrics for Pakistan's seasons.",
    image: { src: "1445205170230-053b83016050", alt: "Neutral-toned garments on a clothing rail" },
    subcategories: [
      { slug: "outerwear", name: "Outerwear" },
      { slug: "tops", name: "Tops & Tees" },
      { slug: "bottoms", name: "Trousers & Denim" },
      { slug: "footwear", name: "Footwear" },
      { slug: "formal", name: "Formal" },
    ],
    order: 1,
  },
  {
    slug: "electronics",
    name: "Electronics & Gadgets",
    tagline: "Sound, vision, power",
    description:
      "Audio, computing and everyday tech selected for performance, design and reliable after-sales support.",
    image: { src: "1546435770-a3e426bf472b", alt: "Over-ear headphones on a white surface" },
    subcategories: [
      { slug: "audio", name: "Audio" },
      { slug: "computing", name: "Computing" },
      { slug: "mobile", name: "Mobile & Tablets" },
      { slug: "cameras", name: "Cameras" },
      { slug: "accessories", name: "Tech Accessories" },
    ],
    order: 2,
  },
  {
    slug: "watches",
    name: "Watches",
    tagline: "Time, refined",
    description:
      "Automatic, quartz and smart timepieces — from minimalist dress watches to robust chronographs.",
    image: { src: "1524592094714-0f0654e20314", alt: "Minimalist watch with a white dial held in hand" },
    subcategories: [
      { slug: "automatic", name: "Automatic" },
      { slug: "chronograph", name: "Chronograph" },
      { slug: "minimalist", name: "Minimalist" },
      { slug: "smartwatch", name: "Smartwatches" },
    ],
    order: 3,
  },
  {
    slug: "accessories",
    name: "Accessories",
    tagline: "The finishing touch",
    description: "Leather goods, eyewear, bags and fine jewellery that complete every look.",
    image: { src: "1584917865442-de89df76afd3", alt: "Red leather handbag" },
    subcategories: [
      { slug: "bags", name: "Bags" },
      { slug: "eyewear", name: "Eyewear" },
      { slug: "leather", name: "Small Leather Goods" },
      { slug: "jewellery", name: "Jewellery" },
    ],
    order: 4,
  },
  {
    slug: "beauty",
    name: "Beauty & Personal Care",
    tagline: "Rituals of care",
    description: "Skincare, fragrance and make-up chosen for performance in South Asian climates.",
    image: { src: "1612817288484-6f916006741a", alt: "Apothecary skincare bottles among stones and greenery" },
    subcategories: [
      { slug: "skincare", name: "Skincare" },
      { slug: "makeup", name: "Make-up" },
      { slug: "fragrance", name: "Fragrance" },
    ],
    order: 5,
  },
  {
    slug: "home",
    name: "Home & Lifestyle",
    tagline: "Spaces with soul",
    description: "Furniture, lighting, ceramics and scent to bring calm and character to your home.",
    image: { src: "1586023492125-27b2c045efd7", alt: "Modern living room with a mustard armchair" },
    subcategories: [
      { slug: "furniture", name: "Furniture" },
      { slug: "lighting", name: "Lighting" },
      { slug: "decor", name: "Décor & Candles" },
      { slug: "kitchen", name: "Kitchen & Dining" },
    ],
    order: 6,
  },
  {
    slug: "sports",
    name: "Sports & Fitness",
    tagline: "Built to perform",
    description: "Training gear, cricket and football equipment, and recovery essentials.",
    image: { src: "1534438327276-14e5300c3a48", alt: "Rows of dumbbells in a gym" },
    subcategories: [
      { slug: "training", name: "Training" },
      { slug: "yoga", name: "Yoga & Recovery" },
      { slug: "cricket", name: "Cricket" },
      { slug: "football", name: "Football" },
    ],
    order: 7,
  },
  {
    slug: "other",
    name: "Other Products",
    tagline: "Curated finds",
    description: "Books, gifting and design objects that don't fit neatly anywhere else.",
    image: { src: "1549465220-1a8b9238cd48", alt: "Pink gift box with a gold ribbon" },
    subcategories: [
      { slug: "books", name: "Books" },
      { slug: "gifts", name: "Gifts" },
      { slug: "objects", name: "Design Objects" },
    ],
    order: 8,
  },
];

export const collections: Collection[] = [
  {
    slug: "new-arrivals",
    title: "New Arrivals",
    eyebrow: "Just landed",
    description: "The latest additions to the RAKRAM edit.",
    image: { src: "1509631179647-0177331693ae", alt: "Model in a tailored outfit" },
  },
  {
    slug: "best-sellers",
    title: "Best Sellers",
    eyebrow: "Most loved",
    description: "The pieces our customers return to again and again.",
    image: { src: "1627123424574-724758594e93", alt: "Brown leather bifold wallet" },
  },
  {
    slug: "trending",
    title: "Trending Now",
    eyebrow: "In demand",
    description: "What's moving this week across Pakistan.",
    image: { src: "1505740420928-5e560c06d30e", alt: "Headphones on a yellow background" },
  },
  {
    slug: "featured",
    title: "The Signature Edit",
    eyebrow: "Featured",
    description: "Hand-picked statement pieces from every category.",
    image: { src: "1551028719-00167b16eac5", alt: "Black leather jacket" },
  },
  {
    slug: "sale",
    title: "The Private Sale",
    eyebrow: "Limited time",
    description: "Selected pieces at exceptional prices — while demo stock lasts.",
    image: { src: "1602874801007-bd458bb1b8b6", alt: "Lit candle in a dark room" },
  },
];

export function getCategory(slug: string) {
  return categories.find((c) => c.slug === slug);
}

export function getCollection(slug: string) {
  return collections.find((c) => c.slug === slug);
}

export const sortedCategories = [...categories].sort((a, b) => a.order - b.order);
