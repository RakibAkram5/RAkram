export const site = {
  name: "RAKRAM",
  tagline: "Premium shopping, delivered across Pakistan",
  description:
    "RAKRAM is a premium multi-category store for Pakistan — fashion, electronics, watches, accessories, beauty, home and sport, with nationwide delivery and Cash on Delivery.",
  url: (process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000").replace(/\/$/, ""),
  locale: "en_PK",
  ogImage: "https://images.unsplash.com/photo-1612817159949-195b6eb9e31a?w=1200&h=630&fit=crop&q=75&auto=format",
};
