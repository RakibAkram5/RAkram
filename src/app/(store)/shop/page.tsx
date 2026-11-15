import type { Metadata } from "next";
import { Suspense } from "react";
import { catalogService } from "@/services/catalog";
import { PageHeader } from "@/components/layout/PageHeader";
import { UrlCatalog } from "@/components/shop/UrlCatalog";
import { CatalogSkeleton } from "@/components/shop/CatalogBrowser";

export const metadata: Metadata = {
  title: "Shop all",
  description:
    "Browse the full RAKRAM edit — fashion, electronics, watches, accessories, beauty, home and sport, with prices in PKR.",
  alternates: { canonical: "/shop" },
};

export default async function ShopPage() {
  const products = await catalogService.listProducts();
  return (
    <>
      <PageHeader
        crumbs={[{ href: "/", label: "Home" }, { label: "Shop" }]}
        eyebrow="The full edit"
        title="Shop all"
        description="Every piece in the RAKRAM collection. Search, then filter by category, brand, price or rating."
      />
      <section className="container-lux py-10">
        <Suspense fallback={<CatalogSkeleton />}>
          <UrlCatalog products={products} />
        </Suspense>
      </section>
    </>
  );
}
