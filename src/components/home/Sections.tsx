"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { useState } from "react";
import { ArrowRight, ArrowUpRight, Quote } from "lucide-react";
import type { Category, Product, Review } from "@/lib/types";
import { cn } from "@/lib/format";
import { validators } from "@/lib/validation";
import { ProductImage } from "@/components/ui/ProductImage";
import { ButtonLink, Button } from "@/components/ui/Button";
import { DemoNotice, Rating, SectionHeading } from "@/components/ui/bits";
import { Reveal } from "@/components/ui/Reveal";
import { ProductGrid } from "@/components/product/ProductCard";
import { SocialIcon } from "@/components/ui/Logo";

/* ---------------- Marquee ---------------- */
export function Marquee({ items }: { items: string[] }) {
  const row = [...items, ...items];
  return (
    <div className="relative overflow-hidden border-y border-line py-5" aria-hidden>
      <div className="marquee flex w-max gap-12 whitespace-nowrap">
        {row.map((t, i) => (
          <span key={i} className="flex items-center gap-12 font-display text-2xl text-faint italic sm:text-3xl">
            {t}
            <span className="h-1.5 w-1.5 rotate-45 bg-silver/40" />
          </span>
        ))}
      </div>
    </div>
  );
}

/* ---------------- Categories bento ---------------- */
// Desktop: [0 0 1 2] [0 0 3 4] [5 6 6 7]. Mobile (2 cols): hero tile, pairs, last tile full width.
const spans = ["md:col-span-2 md:row-span-2", "", "", "", "", "", "md:col-span-2", "col-span-2 md:col-span-1"];

export function CategoryShowcase({ categories, counts }: { categories: Category[]; counts: Record<string, number> }) {
  return (
    <section className="container-lux py-20 sm:py-28" aria-labelledby="cat-heading">
      <SectionHeading
        eyebrow="Shop by category"
        title={
          <span id="cat-heading">
            Eight worlds, <em className="chrome-text">one standard.</em>
          </span>
        }
        action={
          <ButtonLink href="/shop" variant="outline" size="sm">
            View all products <ArrowRight className="h-3.5 w-3.5" />
          </ButtonLink>
        }
      />
      <div className="grid auto-rows-[180px] grid-cols-2 gap-3 sm:auto-rows-[220px] sm:gap-4 md:grid-cols-4">
        {categories.map((c, i) => (
          <motion.div
            key={c.slug}
            className={cn("relative", spans[i % spans.length], i === 0 && "col-span-2 row-span-2")}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.8, delay: (i % 4) * 0.08, ease: [0.22, 1, 0.36, 1] }}
          >
            <Link href={`/category/${c.slug}`} className="edge group absolute inset-0 overflow-hidden rounded-3xl bg-ink-3">
              <ProductImage image={c.image} sizes="(min-width: 768px) 40vw, 50vw" className="transition-transform duration-[1.4s] ease-[var(--ease-lux)] group-hover:scale-[1.07]" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent transition-opacity group-hover:opacity-90" />
              <div className="absolute inset-x-4 bottom-4 flex items-end justify-between gap-3 sm:inset-x-5 sm:bottom-5">
                <div className="min-w-0">
                  <p className="hidden text-[10px] tracking-[0.25em] text-silver/80 uppercase sm:block">{c.tagline}</p>
                  <p className={cn("font-display leading-tight", i === 0 ? "text-3xl sm:text-5xl" : "text-xl sm:text-2xl")}>{c.name}</p>
                  <p className="mt-1 text-xs text-muted">{counts[c.slug] ?? 0} pieces</p>
                </div>
                <span className="glass flex h-9 w-9 shrink-0 items-center justify-center rounded-full transition-transform duration-500 group-hover:rotate-45">
                  <ArrowUpRight className="h-4 w-4" />
                </span>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

/* ---------------- Best sellers with tabs ---------------- */
export function BestSellers({ products, categories }: { products: Product[]; categories: Category[] }) {
  const tabs = [{ slug: "all", name: "All" }, ...categories.filter((c) => products.some((p) => p.category === c.slug))];
  const [tab, setTab] = useState("all");
  const shown = (tab === "all" ? products : products.filter((p) => p.category === tab)).slice(0, 8);
  return (
    <section className="container-lux py-20 sm:py-28" aria-labelledby="best-heading">
      <SectionHeading eyebrow="Most loved" title={<span id="best-heading">Best sellers</span>} description="The pieces customers return to — chosen for craftsmanship, longevity and value." />
      <div className="no-scrollbar -mx-4 mb-10 flex gap-2 overflow-x-auto px-4 sm:mx-0 sm:px-0" role="tablist" aria-label="Filter best sellers by category">
        {tabs.map((t) => (
          <button
            key={t.slug}
            role="tab"
            type="button"
            aria-selected={tab === t.slug}
            onClick={() => setTab(t.slug)}
            className={cn(
              "relative shrink-0 rounded-full px-5 py-2.5 text-xs font-semibold tracking-wide transition-colors",
              tab === t.slug ? "text-ink" : "text-muted hover:text-fg",
            )}
          >
            {tab === t.slug && <motion.span layoutId="best-tab" className="btn-chrome absolute inset-0 rounded-full" transition={{ type: "spring", bounce: 0.15, duration: 0.5 }} />}
            <span className="relative">{t.name}</span>
          </button>
        ))}
      </div>
      <ProductGrid key={tab} products={shown} />
      <div className="mt-12 flex justify-center">
        <ButtonLink href="/collections/best-sellers" variant="outline">
          Shop all best sellers <ArrowRight className="h-4 w-4" />
        </ButtonLink>
      </div>
    </section>
  );
}

/* ---------------- Promotional collection ---------------- */
export function PromoBanner({ products }: { products: Product[] }) {
  return (
    <section className="container-lux py-10" aria-labelledby="promo-heading">
      <Reveal className="edge relative overflow-hidden rounded-[36px] bg-ink-2">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_20%_0%,rgba(212,214,220,0.16),transparent_55%),radial-gradient(ellipse_at_100%_100%,rgba(120,125,135,0.18),transparent_55%)]" />
        <div className="relative grid gap-10 p-6 sm:p-10 lg:grid-cols-12 lg:p-16">
          <div className="flex flex-col justify-center lg:col-span-5">
            <p className="eyebrow">The Private Sale</p>
            <h2 id="promo-heading" className="mt-4 font-display text-5xl leading-[0.95] sm:text-6xl">
              Exceptional pieces. <em className="chrome-text">Rare prices.</em>
            </h2>
            <p className="mt-5 max-w-md text-muted">
              Up to 25% off selected watches, audio, leather and home — a members-style edit, open to everyone this season.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <ButtonLink href="/collections/sale" size="lg">
                Enter the sale <ArrowRight className="h-4 w-4" />
              </ButtonLink>
            </div>
            <p className="mt-6 text-xs text-faint">Demo promotion — discounts shown are illustrative.</p>
          </div>
          <div className="grid grid-cols-3 gap-3 lg:col-span-7">
            {products.slice(0, 3).map((p, i) => (
              <Link
                key={p.id}
                href={`/product/${p.slug}`}
                className={cn("group edge relative overflow-hidden rounded-3xl bg-ink-3", i === 1 ? "translate-y-6 sm:translate-y-10" : "")}
              >
                <div className="relative aspect-[3/4]">
                  <ProductImage image={p.images[0]} sizes="(min-width: 1024px) 20vw, 33vw" className="transition-transform duration-1000 group-hover:scale-105" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                  <div className="absolute inset-x-3 bottom-3">
                    <p className="truncate text-xs font-semibold sm:text-sm">{p.name}</p>
                    <p className="text-[11px] text-silver">
                      −{Math.round(((p.compareAtPrice! - p.price) / p.compareAtPrice!) * 100)}%
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </Reveal>
    </section>
  );
}

/* ---------------- Editorial story ---------------- */
export function Editorial() {
  return (
    <section className="container-lux py-24 sm:py-32" aria-labelledby="story-heading">
      <div className="grid items-center gap-12 lg:grid-cols-12 lg:gap-16">
        <Reveal className="relative lg:col-span-6">
          <div className="grid grid-cols-5 gap-3">
            <div className="edge relative col-span-3 aspect-[3/4] overflow-hidden rounded-3xl">
              <ProductImage image={{ src: "1441986300917-64674bd600d8", alt: "Boutique interior with curated shelves" }} sizes="(min-width: 1024px) 30vw, 60vw" />
            </div>
            <div className="col-span-2 flex flex-col gap-3 pt-12">
              <div className="edge relative aspect-square overflow-hidden rounded-3xl">
                <ProductImage image={{ src: "1617038220319-276d3cfab638", alt: "Fine jewellery detail" }} sizes="20vw" />
              </div>
              <div className="edge relative aspect-[3/4] overflow-hidden rounded-3xl">
                <ProductImage image={{ src: "1507679799987-c73779587ccf", alt: "Man adjusting a tailored suit jacket" }} sizes="20vw" />
              </div>
            </div>
          </div>
        </Reveal>
        <Reveal delay={0.1} className="lg:col-span-6">
          <p className="eyebrow">Our story</p>
          <h2 id="story-heading" className="mt-4 font-display text-5xl leading-[1] sm:text-6xl">
            Fewer things. <br />
            <em className="chrome-text">Better things.</em>
          </h2>
          <div className="mt-8 space-y-5 text-base leading-relaxed text-muted">
            <p>
              RAKRAM began with a simple frustration: finding genuinely well-made things in Pakistan meant endless scrolling, uncertain quality and
              no one to answer for it.
            </p>
            <p>
              So we are building the opposite — a tightly curated house of fashion, technology, timepieces and lifestyle, where every piece is
              chosen for how it is made and how long it will last, then delivered with care from Karachi to Skardu.
            </p>
          </div>
          <dl className="mt-10 grid grid-cols-3 gap-6 border-t border-line pt-8">
            {[
              ["01", "Curated, not crowded"],
              ["02", "Inspected before dispatch"],
              ["03", "Service that answers"],
            ].map(([n, t]) => (
              <div key={n}>
                <dt className="font-display text-2xl text-silver">{n}</dt>
                <dd className="mt-2 text-sm text-muted">{t}</dd>
              </div>
            ))}
          </dl>
          <ButtonLink href="/about" variant="outline" className="mt-10">
            Read our story <ArrowRight className="h-4 w-4" />
          </ButtonLink>
        </Reveal>
      </div>
    </section>
  );
}

/* ---------------- Reviews ---------------- */
export function Reviews({ reviews }: { reviews: Review[] }) {
  return (
    <section className="py-20 sm:py-28" aria-labelledby="reviews-heading">
      <div className="container-lux">
        <SectionHeading align="center" eyebrow="In their words" title={<span id="reviews-heading">Loved across Pakistan</span>} />
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {reviews.map((r, i) => (
            <Reveal key={r.id} delay={(i % 3) * 0.08} className="glass edge flex flex-col rounded-3xl p-7">
              <Quote className="h-6 w-6 text-silver/50" aria-hidden />
              <Rating value={r.rating} />
              <h3 className="mt-4 font-display text-2xl leading-tight">“{r.title}”</h3>
              <p className="mt-3 flex-1 text-sm leading-relaxed text-muted">{r.body}</p>
              <div className="mt-6 flex items-center gap-3 border-t border-line pt-5">
                <span className="btn-chrome flex h-10 w-10 items-center justify-center rounded-full text-sm font-bold" aria-hidden>
                  {r.name.charAt(0)}
                </span>
                <div className="min-w-0">
                  <p className="text-sm font-semibold">
                    {r.name} <span className="font-normal text-faint">· {r.city}</span>
                  </p>
                  <p className="truncate text-xs text-faint">on {r.product}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
        <p className="mt-8 text-center text-xs text-faint">Sample reviews for demonstration — not genuine customer feedback.</p>
      </div>
    </section>
  );
}

/* ---------------- Newsletter ---------------- */
export function Newsletter() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string>();
  const [done, setDone] = useState(false);
  return (
    <section className="container-lux py-16" aria-labelledby="news-heading">
      <Reveal className="glass-strong edge relative overflow-hidden rounded-[36px] px-6 py-14 text-center sm:px-12 sm:py-20">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_-20%,rgba(255,255,255,0.12),transparent_60%)]" aria-hidden />
        <div className="relative mx-auto max-w-xl">
          <p className="eyebrow">The RAKRAM letter</p>
          <h2 id="news-heading" className="mt-4 font-display text-4xl leading-tight sm:text-5xl">
            First access, quietly delivered.
          </h2>
          <p className="mt-4 text-muted">New arrivals, private sales and stories — twice a month, never more.</p>
          {done ? (
            <div className="mt-8">
              <DemoNotice className="text-left">
                Thanks! In this preview your email is not stored or sent anywhere. Newsletter sign-up will connect to the email provider in Phase 2.
              </DemoNotice>
            </div>
          ) : (
            <form
              noValidate
              className="mt-8 flex flex-col gap-3 sm:flex-row"
              onSubmit={(e) => {
                e.preventDefault();
                const err = validators.email(email);
                setError(err);
                if (!err) setDone(true);
              }}
            >
              <label htmlFor="nl-email" className="sr-only">
                Email address
              </label>
              <input
                id="nl-email"
                type="email"
                inputMode="email"
                autoComplete="email"
                maxLength={320}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                aria-invalid={error ? true : undefined}
                aria-describedby={error ? "nl-err" : undefined}
                className="field h-13 min-h-[3.25rem] flex-1 rounded-full px-6"
              />
              <Button type="submit" size="lg">
                Subscribe
              </Button>
            </form>
          )}
          {error && (
            <p id="nl-err" role="alert" className="mt-3 text-sm text-danger">
              {error}
            </p>
          )}
        </div>
      </Reveal>
    </section>
  );
}

/* ---------------- Social ---------------- */
export function SocialShowcase({ posts }: { posts: { src: string; alt: string; handle: string }[] }) {
  return (
    <section className="container-lux py-20" aria-labelledby="social-heading">
      <SectionHeading
        eyebrow="@rakram"
        title={<span id="social-heading">Seen on social</span>}
        description="Tag #RAKRAM to be featured. Official channels launch soon."
      />
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
        {posts.map((p, i) => (
          <Reveal key={p.src} delay={i * 0.05} className="group edge relative aspect-square overflow-hidden rounded-2xl bg-ink-3">
            <ProductImage image={p} sizes="(min-width: 1024px) 16vw, 50vw" className="transition-transform duration-1000 group-hover:scale-110" />
            <div className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 transition-opacity duration-500 group-hover:opacity-100">
              <SocialIcon name="instagram" className="h-6 w-6" />
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
