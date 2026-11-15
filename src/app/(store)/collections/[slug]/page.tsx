import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { collections } from "@/data/categories";
import { catalogService } from "@/services/catalog";
import { PageHeader } from "@/components/layout/PageHeader";
import { UrlCatalog } from "@/components/shop/UrlCatalog";
import { CatalogSkeleton } from "@/components/shop/CatalogBrowser";

export function generateStaticParams() {
  return collections.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: PageProps<"/collections/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const data = await catalogService.getCollection(slug);
  if (!data) return { title: "Collection not found" };
  return {
    title: data.collection.title,
    description: `${data.collection.description} Shop online at RAKRAM — prices in PKR, delivered across Pakistan.`,
    alternates: { canonical: `/collections/${slug}` },
  };
}

export default async function CollectionPage({ params }: PageProps<"/collections/[slug]">) {
  const { slug } = await params;
  const data = await catalogService.getCollection(slug);
  if (!data) notFound();
  const { collection, products } = data;
  return (
    <>
      <PageHeader
        crumbs={[{ href: "/", label: "Home" }, { href: "/shop", label: "Shop" }, { label: collection.title }]}
        eyebrow={collection.eyebrow}
        title={collection.title}
        description={collection.description}
        image={collection.image}
      />
      <section className="container-lux py-12">
        <Suspense fallback={<CatalogSkeleton />}>
          <UrlCatalog products={products} />
        </Suspense>
      </section>
    </>
  );
}
