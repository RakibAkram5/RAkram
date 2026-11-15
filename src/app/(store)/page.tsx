import { ArrowRight } from "lucide-react";
import { catalogService } from "@/services/catalog";
import { getProductBySlug, productsInCollection } from "@/lib/catalog";
import { reviews, socialPosts } from "@/data/content";
import { Hero } from "@/components/home/Hero";
import {
  BestSellers,
  CategoryShowcase,
  Editorial,
  Marquee,
  Newsletter,
  PromoBanner,
  Reviews,
  SocialShowcase,
} from "@/components/home/Sections";
import { ProductRail } from "@/components/product/ProductRail";
import { RecentlyViewed } from "@/components/product/RecentlyViewed";
import { SectionHeading } from "@/components/ui/bits";
import { ButtonLink } from "@/components/ui/Button";

export default async function HomePage() {
  const [products, categories] = await Promise.all([catalogService.listProducts(), catalogService.listCategories()]);
  const counts = Object.fromEntries(categories.map((c) => [c.slug, products.filter((p) => p.category === c.slug).length]));
  const spotlight = getProductBySlug("noir-leather-biker-jacket")!;
  const secondary = getProductBySlug("volt-anc-pro-headphones")!;
  const newArrivals = productsInCollection("new-arrivals").slice(0, 10);
  const trending = productsInCollection("trending").slice(0, 10);
  const best = productsInCollection("best-sellers");
  const sale = productsInCollection("sale").sort((a, b) => b.popularity - a.popularity);

  return (
    <>
      <Hero spotlight={spotlight} secondary={secondary} />
      <Marquee items={["Fashion & Clothing", "Electronics", "Timepieces", "Accessories", "Beauty", "Home & Lifestyle", "Sport", "Delivered across Pakistan"]} />
      <CategoryShowcase categories={categories} counts={counts} />

      <section className="container-lux py-16 sm:py-20" aria-labelledby="new-heading">
        <SectionHeading
          eyebrow="Just landed"
          title={<span id="new-heading">New arrivals</span>}
          action={
            <ButtonLink href="/collections/new-arrivals" variant="outline" size="sm">
              Shop new in <ArrowRight className="h-3.5 w-3.5" />
            </ButtonLink>
          }
        />
        <ProductRail products={newArrivals} label="New arrivals" />
      </section>

      <BestSellers products={best} categories={categories} />
      <PromoBanner products={sale} />

      <section className="container-lux py-16 sm:py-24" aria-labelledby="trend-heading">
        <SectionHeading
          eyebrow="In demand this week"
          title={<span id="trend-heading">Trending now</span>}
          action={
            <ButtonLink href="/collections/trending" variant="outline" size="sm">
              See what’s trending <ArrowRight className="h-3.5 w-3.5" />
            </ButtonLink>
          }
        />
        <ProductRail products={trending} label="Trending products" />
      </section>

      <Editorial />
      <Reviews reviews={reviews} />
      <RecentlyViewed />
      <Newsletter />
      <SocialShowcase posts={socialPosts} />
    </>
  );
}
