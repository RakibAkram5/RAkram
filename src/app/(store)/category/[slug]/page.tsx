import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { categories } from "@/data/categories";
import { catalogService } from "@/services/catalog";
import { imageUrl } from "@/lib/format";
import { PageHeader } from "@/components/layout/PageHeader";
import { UrlCatalog } from "@/components/shop/UrlCatalog";
import { CatalogSkeleton } from "@/components/shop/CatalogBrowser";

export function generateStaticParams() {
  return categories.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: PageProps<"/category/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const data = await catalogService.getCategory(slug);
  if (!data) return { title: "Category not found" };
  const { category } = data;
  return {
    title: category.name,
    description: `${category.description} Shop ${category.name} at RAKRAM with delivery across Pakistan.`,
    alternates: { canonical: `/category/${slug}` },
    openGraph: {
      title: `${category.name} · RAKRAM`,
      description: category.description,
      images: [{ url: `${imageUrl(category.image)}?w=1200&h=630&fit=crop&auto=format`, alt: category.image.alt }],
    },
  };
}

export default async function CategoryPage({ params }: PageProps<"/category/[slug]">) {
  const { slug } = await params;
  const data = await catalogService.getCategory(slug);
  if (!data) notFound();
  const { category, products } = data;
  return (
    <>
      <PageHeader
        crumbs={[{ href: "/", label: "Home" }, { href: "/shop", label: "Shop" }, { label: category.name }]}
        eyebrow={category.tagline}
        title={category.name}
        description={category.description}
        image={category.image}
      >
        <div className="no-scrollbar -mx-6 mt-6 flex gap-2 overflow-x-auto px-6 sm:mx-0 sm:flex-wrap sm:px-0">
          {category.subcategories.map((s) => (
            <Link
              key={s.slug}
              href={`/category/${category.slug}?sub=${s.slug}`}
              className="glass shrink-0 rounded-full px-4 py-2 text-xs font-semibold text-silver hover:text-fg"
            >
              {s.name}
            </Link>
          ))}
        </div>
      </PageHeader>
      <section className="container-lux py-12">
        <Suspense fallback={<CatalogSkeleton />}>
          <UrlCatalog products={products} subcategories={category.subcategories} showCategories={false} />
        </Suspense>
      </section>
    </>
  );
}
