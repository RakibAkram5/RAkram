import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { RotateCcw, ShieldCheck, Truck } from "lucide-react";
import { allProducts } from "@/lib/catalog";
import { catalogService } from "@/services/catalog";
import { getCategory } from "@/data/categories";
import { deliveryConfig } from "@/data/pakistan";
import { formatPKR, imageUrl } from "@/lib/format";
import { Breadcrumbs } from "@/components/layout/PageHeader";
import { Gallery } from "@/components/product/Gallery";
import { PurchasePanel } from "@/components/product/PurchasePanel";
import { ProductRail } from "@/components/product/ProductRail";
import { RecentlyViewed, TrackView } from "@/components/product/RecentlyViewed";
import { DemoNotice, Rating, SectionHeading } from "@/components/ui/bits";

export function generateStaticParams() {
  return allProducts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: PageProps<"/product/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const p = await catalogService.getProduct(slug);
  if (!p) return { title: "Product not found" };
  return {
    title: p.name,
    description: `${p.shortDescription} ${formatPKR(p.price)} at RAKRAM — delivered across Pakistan.`,
    alternates: { canonical: `/product/${p.slug}` },
    openGraph: {
      title: `${p.name} · RAKRAM`,
      description: p.shortDescription,
      images: [{ url: `${imageUrl(p.images[0])}?w=1200&h=630&fit=crop&auto=format`, alt: p.images[0].alt }],
    },
  };
}

export default async function ProductPage({ params }: PageProps<"/product/[slug]">) {
  const { slug } = await params;
  const product = await catalogService.getProduct(slug);
  if (!product) notFound();
  const category = getCategory(product.category);
  const sub = category?.subcategories.find((s) => s.slug === product.subcategory);
  const related = await catalogService.related(product);
  const { zones, freeDeliveryThreshold } = deliveryConfig;

  return (
    <>
      <TrackView id={product.id} />
      <div className="container-lux pt-6 pb-16 sm:pt-10">
        <Breadcrumbs
          items={[
            { href: "/", label: "Home" },
            ...(category ? [{ href: `/category/${category.slug}`, label: category.name }] : []),
            ...(category && sub ? [{ href: `/category/${category.slug}?sub=${sub.slug}`, label: sub.name }] : []),
            { label: product.name },
          ]}
        />
        <div className="grid gap-10 lg:grid-cols-12 lg:gap-14">
          <div className="lg:col-span-7">
            <Gallery images={product.images} name={product.name} />
          </div>
          <div className="lg:col-span-5">
            <div className="lg:sticky lg:top-24">
              <p className="eyebrow">{product.brand}</p>
              <h1 className="mt-3 font-display text-4xl leading-[1.02] sm:text-5xl">{product.name}</h1>
              <div className="mt-4 flex flex-wrap items-center gap-4">
                <Rating value={product.rating} count={product.reviewCount} size="md" />
                <span className="text-xs text-faint">SKU {product.sku}</span>
              </div>
              <p className="mt-5 text-base leading-relaxed text-muted">{product.shortDescription}</p>

              <div className="mt-8">
                <PurchasePanel product={product} />
              </div>

              <ul className="mt-8 grid gap-3 rounded-3xl border border-line p-5 text-sm">
                <li className="flex items-start gap-3">
                  <Truck className="mt-0.5 h-4 w-4 shrink-0 text-silver" aria-hidden />
                  <span className="text-muted">
                    <span className="text-fg">Delivery across Pakistan.</span> {zones.metro.minDays}–{zones.metro.maxDays} days to Karachi, Lahore & Islamabad;{" "}
                    {zones.standard.minDays}–{zones.standard.maxDays} days nationwide. Free over {formatPKR(freeDeliveryThreshold)}.
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <RotateCcw className="mt-0.5 h-4 w-4 shrink-0 text-silver" aria-hidden />
                  <span className="text-muted">
                    <span className="text-fg">7-day returns</span> on unused items (planned launch policy).
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-silver" aria-hidden />
                  <span className="text-muted">
                    <span className="text-fg">Cash on Delivery</span>, bank transfer, Easypaisa & JazzCash at checkout.
                  </span>
                </li>
              </ul>

              <DemoNotice className="mt-5">
                This is a demonstration product. Price, ratings and stock are illustrative and the item is not currently available to order.
              </DemoNotice>

              <div className="mt-8 divide-y divide-line border-y border-line">
                <details className="group py-5" open>
                  <summary className="flex cursor-pointer list-none items-center justify-between text-sm font-semibold tracking-wide">
                    Description <span className="text-muted transition-transform group-open:rotate-45">+</span>
                  </summary>
                  <p className="mt-4 text-sm leading-relaxed text-muted">{product.description}</p>
                  <ul className="mt-4 space-y-2 text-sm text-muted">
                    {product.highlights.map((h) => (
                      <li key={h} className="flex gap-3">
                        <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-silver" aria-hidden />
                        {h}
                      </li>
                    ))}
                  </ul>
                </details>
                {Object.keys(product.specs).length > 0 && (
                  <details className="group py-5">
                    <summary className="flex cursor-pointer list-none items-center justify-between text-sm font-semibold tracking-wide">
                      Specifications <span className="text-muted transition-transform group-open:rotate-45">+</span>
                    </summary>
                    <dl className="mt-4 grid grid-cols-[auto_1fr] gap-x-6 gap-y-2 text-sm">
                      {Object.entries(product.specs).map(([k, v]) => (
                        <div key={k} className="contents">
                          <dt className="text-faint">{k}</dt>
                          <dd className="text-muted">{v}</dd>
                        </div>
                      ))}
                    </dl>
                  </details>
                )}
                <details className="group py-5">
                  <summary className="flex cursor-pointer list-none items-center justify-between text-sm font-semibold tracking-wide">
                    Delivery fees <span className="text-muted transition-transform group-open:rotate-45">+</span>
                  </summary>
                  <table className="mt-4 w-full text-left text-sm">
                    <caption className="sr-only">Delivery fees by zone (demo values)</caption>
                    <tbody className="divide-y divide-line">
                      {Object.values(zones).map((z) => (
                        <tr key={z.zone}>
                          <th scope="row" className="py-2 font-normal text-muted">{z.label}</th>
                          <td className="py-2 text-muted">{z.minDays}–{z.maxDays} days</td>
                          <td className="py-2 text-right">{formatPKR(z.fee)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  <p className="mt-3 text-xs text-faint">Configurable demo values. Final rates will come from courier partners.</p>
                </details>
              </div>
            </div>
          </div>
        </div>
      </div>

      {related.length > 0 && (
        <section className="container-lux py-16" aria-labelledby="related-heading">
          <SectionHeading eyebrow="Complete the look" title={<span id="related-heading">You may also like</span>} />
          <ProductRail products={related} label="Related products" />
        </section>
      )}
      <RecentlyViewed excludeId={product.id} />
    </>
  );
}
