import Link from "next/link";
import { ChevronRight } from "lucide-react";
import type { ReactNode } from "react";
import type { ProductImage as Img } from "@/lib/types";
import { ProductImage } from "@/components/ui/ProductImage";

export interface Crumb {
  href?: string;
  label: string;
}

export function Breadcrumbs({ items }: { items: Crumb[] }) {
  return (
    <nav aria-label="Breadcrumb" className="mb-6">
      <ol className="flex flex-wrap items-center gap-1.5 text-xs text-faint">
        {items.map((c, i) => (
          <li key={i} className="flex items-center gap-1.5">
            {c.href ? (
              <Link href={c.href} className="hover:text-fg">
                {c.label}
              </Link>
            ) : (
              <span aria-current="page" className="text-muted">
                {c.label}
              </span>
            )}
            {i < items.length - 1 && <ChevronRight className="h-3 w-3" aria-hidden />}
          </li>
        ))}
      </ol>
    </nav>
  );
}

export function PageHeader({
  crumbs,
  eyebrow,
  title,
  description,
  image,
  children,
}: {
  crumbs: Crumb[];
  eyebrow?: string;
  title: ReactNode;
  description?: string;
  image?: Img;
  children?: ReactNode;
}) {
  if (image) {
    return (
      <header className="container-lux pt-4">
        <div className="edge relative overflow-hidden rounded-[32px]">
          <ProductImage image={image} preload sizes="100vw" quality={75} />
          <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/65 to-black/15" />
          <div className="relative flex min-h-[320px] flex-col justify-end p-6 sm:min-h-[400px] sm:p-12">
            <Breadcrumbs items={crumbs} />
            {eyebrow && <p className="eyebrow">{eyebrow}</p>}
            <h1 className="mt-3 max-w-2xl font-display text-5xl leading-[0.95] sm:text-7xl">{title}</h1>
            {description && <p className="mt-4 max-w-xl text-sm text-silver sm:text-base">{description}</p>}
            {children}
          </div>
        </div>
      </header>
    );
  }
  return (
    <header className="container-lux pt-8 pb-2 sm:pt-12">
      <Breadcrumbs items={crumbs} />
      {eyebrow && <p className="eyebrow">{eyebrow}</p>}
      <h1 className="mt-3 font-display text-5xl leading-[0.95] sm:text-6xl">{title}</h1>
      {description && <p className="mt-4 max-w-2xl text-sm text-muted sm:text-base">{description}</p>}
      {children}
    </header>
  );
}
