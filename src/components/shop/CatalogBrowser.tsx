"use client";

import { AnimatePresence, motion } from "motion/react";
import { useDeferredValue, useMemo, useState } from "react";
import { Search, SlidersHorizontal, Star, X } from "lucide-react";
import type { CatalogFilters, Product, SortKey } from "@/lib/types";
import { applyFilters, countActiveFilters, defaultFilters, sortOptions } from "@/lib/catalog";
import { categories } from "@/data/categories";
import { cn, formatPKR } from "@/lib/format";
import { ProductGrid } from "@/components/product/ProductCard";
import { Drawer } from "@/components/ui/Overlay";
import { Button } from "@/components/ui/Button";
import { EmptyState, ProductCardSkeleton } from "@/components/ui/bits";

const pricePresets: { label: string; min: number | null; max: number | null }[] = [
  { label: "Under Rs. 5,000", min: null, max: 5000 },
  { label: "Rs. 5,000 – 20,000", min: 5000, max: 20000 },
  { label: "Rs. 20,000 – 100,000", min: 20000, max: 100000 },
  { label: "Over Rs. 100,000", min: 100000, max: null },
];

interface Props {
  products: Product[];
  initial?: Partial<CatalogFilters>;
  /** Which facet groups to show */
  facets?: { categories?: boolean; subcategories?: { slug: string; name: string }[] };
  /** Show the in-page search box */
  searchable?: boolean;
}

function toggle(list: string[], v: string) {
  return list.includes(v) ? list.filter((x) => x !== v) : [...list, v];
}

export function CatalogBrowser({ products, initial, facets = { categories: true }, searchable = true }: Props) {
  const [filters, setFilters] = useState<CatalogFilters>({ ...defaultFilters, ...initial });
  const [mobileOpen, setMobileOpen] = useState(false);
  const [minInput, setMinInput] = useState(initial?.minPrice?.toString() ?? "");
  const [maxInput, setMaxInput] = useState(initial?.maxPrice?.toString() ?? "");

  // Controls update urgently (so inputs never revert); results render from a deferred copy.
  const update = (patch: Partial<CatalogFilters>) => setFilters((f) => ({ ...f, ...patch }));
  const deferred = useDeferredValue(filters);
  const isPending = deferred !== filters;
  const results = useMemo(() => applyFilters(products, deferred), [products, deferred]);
  const brands = useMemo(() => [...new Set(products.map((p) => p.brand))].sort(), [products]);
  const presentCats = categories.filter((c) => products.some((p) => p.category === c.slug));
  const active = countActiveFilters(filters);

  const clearAll = () => {
    setMinInput("");
    setMaxInput("");
    update({ ...defaultFilters, query: filters.query, sort: filters.sort });
  };

  const applyPriceInputs = () => {
    const min = minInput.trim() === "" ? null : Math.max(0, Math.floor(Number(minInput)));
    const max = maxInput.trim() === "" ? null : Math.max(0, Math.floor(Number(maxInput)));
    update({
      minPrice: Number.isFinite(min) ? min : null,
      maxPrice: Number.isFinite(max) ? max : null,
    });
  };

  const panel = (
    <div className="space-y-8">
      {facets.categories && presentCats.length > 1 && (
        <FacetGroup title="Category">
          {presentCats.map((c) => (
            <Check key={c.slug} label={c.name} count={products.filter((p) => p.category === c.slug).length} checked={filters.categories.includes(c.slug)} onChange={() => update({ categories: toggle(filters.categories, c.slug) })} />
          ))}
        </FacetGroup>
      )}
      {facets.subcategories && facets.subcategories.length > 0 && (
        <FacetGroup title="Type">
          {facets.subcategories.map((s) => (
            <Check key={s.slug} label={s.name} count={products.filter((p) => p.subcategory === s.slug).length} checked={filters.subcategories.includes(s.slug)} onChange={() => update({ subcategories: toggle(filters.subcategories, s.slug) })} />
          ))}
        </FacetGroup>
      )}
      <FacetGroup title="Price (PKR)">
        {pricePresets.map((p) => {
          const on = filters.minPrice === p.min && filters.maxPrice === p.max;
          return (
            <Check
              key={p.label}
              radio
              label={p.label}
              checked={on}
              onChange={() => {
                setMinInput(on ? "" : (p.min?.toString() ?? ""));
                setMaxInput(on ? "" : (p.max?.toString() ?? ""));
                update(on ? { minPrice: null, maxPrice: null } : { minPrice: p.min, maxPrice: p.max });
              }}
            />
          );
        })}
        <form
          className="mt-3 flex items-center gap-2"
          onSubmit={(e) => {
            e.preventDefault();
            applyPriceInputs();
          }}
        >
          <label className="sr-only" htmlFor="min-price">Minimum price</label>
          <input id="min-price" inputMode="numeric" pattern="[0-9]*" placeholder="Min" value={minInput} onChange={(e) => setMinInput(e.target.value.replace(/\D/g, "").slice(0, 7))} className="field h-10 px-3 py-0 text-sm" />
          <span className="text-faint">–</span>
          <label className="sr-only" htmlFor="max-price">Maximum price</label>
          <input id="max-price" inputMode="numeric" pattern="[0-9]*" placeholder="Max" value={maxInput} onChange={(e) => setMaxInput(e.target.value.replace(/\D/g, "").slice(0, 7))} className="field h-10 px-3 py-0 text-sm" />
          <button type="submit" className="glass h-10 shrink-0 rounded-full px-4 text-xs font-semibold">Go</button>
        </form>
      </FacetGroup>
      {brands.length > 1 && (
        <FacetGroup title="Brand">
          {brands.map((b) => (
            <Check key={b} label={b} count={products.filter((p) => p.brand === b).length} checked={filters.brands.includes(b)} onChange={() => update({ brands: toggle(filters.brands, b) })} />
          ))}
        </FacetGroup>
      )}
      <FacetGroup title="Rating">
        {[4.5, 4, 3].map((r) => (
          <Check
            key={r}
            radio
            label={
              <span className="inline-flex items-center gap-1">
                {r}
                <Star className="h-3 w-3 fill-silver text-silver" aria-hidden /> & up
              </span>
            }
            checked={filters.minRating === r}
            onChange={() => update({ minRating: filters.minRating === r ? null : r })}
          />
        ))}
      </FacetGroup>
      <FacetGroup title="Availability">
        <Check label="In stock only" checked={filters.inStockOnly} onChange={() => update({ inStockOnly: !filters.inStockOnly })} />
        <Check label="On sale" checked={filters.onSaleOnly} onChange={() => update({ onSaleOnly: !filters.onSaleOnly })} />
      </FacetGroup>
    </div>
  );

  const chips: { label: string; clear: () => void }[] = [
    ...filters.categories.map((c) => ({ label: categories.find((x) => x.slug === c)?.name ?? c, clear: () => update({ categories: filters.categories.filter((x) => x !== c) }) })),
    ...filters.subcategories.map((s) => ({ label: facets.subcategories?.find((x) => x.slug === s)?.name ?? s, clear: () => update({ subcategories: filters.subcategories.filter((x) => x !== s) }) })),
    ...filters.brands.map((b) => ({ label: b, clear: () => update({ brands: filters.brands.filter((x) => x !== b) }) })),
    ...(filters.minPrice != null || filters.maxPrice != null
      ? [{
          label: `${filters.minPrice != null ? formatPKR(filters.minPrice) : "Rs. 0"} – ${filters.maxPrice != null ? formatPKR(filters.maxPrice) : "any"}`,
          clear: () => {
            setMinInput("");
            setMaxInput("");
            update({ minPrice: null, maxPrice: null });
          },
        }]
      : []),
    ...(filters.minRating != null ? [{ label: `${filters.minRating}★ & up`, clear: () => update({ minRating: null }) }] : []),
    ...(filters.inStockOnly ? [{ label: "In stock", clear: () => update({ inStockOnly: false }) }] : []),
    ...(filters.onSaleOnly ? [{ label: "On sale", clear: () => update({ onSaleOnly: false }) }] : []),
  ];

  return (
    <div className="grid gap-10 lg:grid-cols-[260px_1fr] xl:gap-14">
      <aside className="hidden lg:block" aria-label="Filters">
        <div className="sticky top-24 max-h-[calc(100dvh-7rem)] overflow-y-auto pr-2 pb-8">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-xs font-bold tracking-[0.2em] uppercase">Filters</h2>
            {active > 0 && (
              <button type="button" onClick={clearAll} className="text-xs text-muted underline-offset-4 hover:text-fg hover:underline">
                Clear all
              </button>
            )}
          </div>
          {panel}
        </div>
      </aside>

      <div className="min-w-0">
        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center">
          {searchable && (
            <div className="relative flex-1">
              <Search className="pointer-events-none absolute top-1/2 left-4 h-4 w-4 -translate-y-1/2 text-faint" aria-hidden />
              <label htmlFor="catalog-q" className="sr-only">Search within results</label>
              <input
                id="catalog-q"
                type="search"
                value={filters.query}
                maxLength={80}
                onChange={(e) => update({ query: e.target.value })}
                placeholder="Search products, brands, categories…"
                className="field h-12 rounded-full pl-11"
              />
            </div>
          )}
          <div className="flex items-center gap-2 sm:ml-auto">
            <button type="button" onClick={() => setMobileOpen(true)} className="glass flex h-12 flex-1 items-center justify-center gap-2 rounded-full px-5 text-sm font-semibold sm:flex-none lg:hidden">
              <SlidersHorizontal className="h-4 w-4" /> Filters
              {active > 0 && <span className="btn-chrome flex h-5 min-w-5 items-center justify-center rounded-full px-1 text-[10px]">{active}</span>}
            </button>
            <label htmlFor="sort" className="sr-only">Sort by</label>
            <select id="sort" value={filters.sort} onChange={(e) => update({ sort: e.target.value as SortKey })} className="field h-12 w-auto flex-1 rounded-full py-0 text-sm sm:flex-none">
              {sortOptions.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="mb-6 flex flex-wrap items-center gap-2">
          <p className="mr-2 text-sm text-muted" aria-live="polite">
            <span className="font-semibold text-fg">{results.length}</span> {results.length === 1 ? "product" : "products"}
            {filters.query.trim() && (
              <>
                {" "}for “<span className="text-fg">{filters.query.trim()}</span>”
              </>
            )}
          </p>
          <AnimatePresence>
            {chips.map((c) => (
              <motion.button
                key={c.label}
                type="button"
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                onClick={c.clear}
                className="glass inline-flex items-center gap-1.5 rounded-full py-1.5 pr-2.5 pl-3.5 text-xs"
                aria-label={`Remove filter ${c.label}`}
              >
                {c.label} <X className="h-3 w-3" />
              </motion.button>
            ))}
          </AnimatePresence>
          {chips.length > 1 && (
            <button type="button" onClick={clearAll} className="text-xs text-muted underline underline-offset-4 hover:text-fg">
              Clear filters
            </button>
          )}
        </div>

        <div className={cn("transition-opacity duration-300", isPending && "opacity-60")}>
          {results.length > 0 ? (
            <ProductGrid products={results} priorityCount={4} />
          ) : (
            <EmptyState
              icon={<Search className="h-5 w-5" />}
              title="Nothing matches — yet"
              body="Try removing a filter or searching for something broader."
              action={
                <Button
                  variant="outline"
                  onClick={() => {
                    clearAll();
                    update({ query: "" });
                  }}
                >
                  Clear search & filters
                </Button>
              }
            />
          )}
        </div>
      </div>

      <Drawer
        open={mobileOpen}
        onClose={() => setMobileOpen(false)}
        title="Filter & sort"
        footer={
          <div className="grid grid-cols-2 gap-2">
            <Button variant="outline" onClick={clearAll}>
              Clear all
            </Button>
            <Button onClick={() => setMobileOpen(false)}>Show {results.length}</Button>
          </div>
        }
      >
        <div className="p-5">{panel}</div>
      </Drawer>
    </div>
  );
}

function FacetGroup({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <fieldset>
      <legend className="mb-3 text-[11px] font-bold tracking-[0.2em] text-silver uppercase">{title}</legend>
      <div className="space-y-1">{children}</div>
    </fieldset>
  );
}

function Check({ label, count, checked, onChange, radio = false }: { label: React.ReactNode; count?: number; checked: boolean; onChange: () => void; radio?: boolean }) {
  return (
    <label className="group flex cursor-pointer items-center gap-3 rounded-lg py-1.5 text-sm text-muted hover:text-fg">
      <input type="checkbox" checked={checked} onChange={onChange} className="peer sr-only" />
      <span
        aria-hidden
        className={cn(
          "flex h-4.5 w-4.5 shrink-0 items-center justify-center border border-line-strong transition peer-focus-visible:ring-2 peer-focus-visible:ring-white",
          radio ? "rounded-full" : "rounded-[5px]",
          checked && "border-white bg-white",
        )}
      >
        {checked && <span className={cn("bg-ink", radio ? "h-1.5 w-1.5 rounded-full" : "h-2 w-2 rounded-[2px]")} />}
      </span>
      <span className={cn("flex-1", checked && "text-fg")}>{label}</span>
      {count !== undefined && <span className="text-xs text-faint tabular-nums">{count}</span>}
    </label>
  );
}

export function CatalogSkeleton() {
  return (
    <div className="grid grid-cols-2 gap-x-3 gap-y-10 sm:gap-x-5 md:grid-cols-3 xl:grid-cols-4">
      {Array.from({ length: 8 }, (_, i) => (
        <ProductCardSkeleton key={i} />
      ))}
    </div>
  );
}
