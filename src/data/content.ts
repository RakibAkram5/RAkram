import type { Coupon, Review } from "@/lib/types";

/** Demo coupons. Real validation MUST happen server-side in Phase 2. */
export const coupons: Coupon[] = [
  { code: "RAKRAM10", description: "10% off orders over Rs. 5,000", type: "percent", value: 10, minSubtotal: 5000, active: true, usageLimit: 1000, used: 412, expiresAt: "2026-12-31" },
  { code: "WELCOME500", description: "Rs. 500 off your first order over Rs. 3,000", type: "fixed", value: 500, minSubtotal: 3000, active: true, usageLimit: 5000, used: 1290, expiresAt: "2027-03-31" },
  { code: "FREESHIP", description: "Free delivery on any order", type: "free_shipping", value: 0, minSubtotal: 0, active: true, usageLimit: 2000, used: 846, expiresAt: "2026-12-15" },
  { code: "EID25", description: "25% off — seasonal campaign", type: "percent", value: 25, minSubtotal: 15000, active: false, usageLimit: 500, used: 500, expiresAt: "2026-06-20" },
];

/** Sample reviews shown for demonstration — not genuine customer reviews. */
export const reviews: Review[] = [
  { id: "r1", name: "Ayesha K.", city: "Lahore", rating: 5, title: "Packaging felt like a gift", body: "The jacket arrived in a beautiful box with tissue and a handwritten card. The leather quality is excellent and the fit is exactly as described.", product: "Noir Leather Biker Jacket" },
  { id: "r2", name: "Hamza R.", city: "Karachi", rating: 5, title: "Noise cancelling is superb", body: "Used them on a flight to Islamabad and could barely hear the engines. Battery easily lasts the whole week.", product: "Volt ANC Pro Headphones" },
  { id: "r3", name: "Sana M.", city: "Islamabad", rating: 4, title: "Elegant everyday watch", body: "Sits beautifully on the wrist and goes with everything. Delivery took three days and COD was smooth.", product: "Azure Classic 38" },
  { id: "r4", name: "Bilal A.", city: "Peshawar", rating: 5, title: "Proper Sialkot quality", body: "The match ball holds its shape and the touch is fantastic. Our weekend team has ordered three more.", product: "Pro Match Football" },
  { id: "r5", name: "Mahnoor S.", city: "Faisalabad", rating: 5, title: "SPF that actually works in June", body: "No white cast, no greasiness, even in Faisalabad heat. Already on my second tube.", product: "Daily SPF 50 Fluid" },
  { id: "r6", name: "Usman T.", city: "Multan", rating: 4, title: "Sturdy and well designed", body: "The daypack fits my 14-inch laptop with room to spare and survived a monsoon downpour.", product: "Commuter Daypack" },
];

export const announcements = [
  "Free delivery across Pakistan on orders over Rs. 10,000",
  "Cash on Delivery available nationwide",
  "Preview storefront — products, prices & stock are demonstration data",
];

export const socialPosts = [
  { src: "1469334031218-e382a71b716b", alt: "Model wearing yellow outfit and sunglasses", handle: "@rakram" },
  { src: "1617038220319-276d3cfab638", alt: "Jewellery on a dark surface", handle: "@rakram" },
  { src: "1490114538077-0a7f8cb49891", alt: "Fashion flat lay with sneakers and denim", handle: "@rakram" },
  { src: "1495474472287-4d71bcdd2085", alt: "Two coffees with latte art", handle: "@rakram" },
  { src: "1515886657613-9f3515b0c78f", alt: "Model in a yellow tracksuit", handle: "@rakram" },
  { src: "1540747913346-19e32dc3e97e", alt: "Floodlit cricket stadium at dusk", handle: "@rakram" },
];

export const faqs = [
  { q: "Are the products on this site available to buy?", a: "Not yet. This is a Phase 1 preview of the RAKRAM storefront. Products, prices, ratings and stock levels are demonstration data and no orders or payments are processed." },
  { q: "Which cities do you deliver to?", a: "RAKRAM is designed for Pakistan-wide delivery — all provinces, Islamabad Capital Territory, Gilgit-Baltistan and Azad Jammu & Kashmir. Delivery fees and timelines shown are configurable demo values." },
  { q: "Will Cash on Delivery be available?", a: "Yes, the checkout supports Cash on Delivery, Bank Transfer, Easypaisa and JazzCash. In this preview these are interface-only and no payment is taken." },
  { q: "What is the return policy?", a: "The planned policy is a 7-day return window for unused items in original packaging. Final terms will be published at launch." },
  { q: "How will order tracking work?", a: "Once courier integrations are live, your order page will show real-time status from the courier. The current tracking screen shows sample orders only." },
];
