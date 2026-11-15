"use client";

import Link from "next/link";
import { motion, useScroll, useTransform } from "motion/react";
import { useRef } from "react";
import { ArrowRight, Star } from "lucide-react";
import type { Product } from "@/lib/types";
import { formatPKR } from "@/lib/format";
import { ProductImage } from "@/components/ui/ProductImage";
import { ButtonLink } from "@/components/ui/Button";

const ease = [0.22, 1, 0.36, 1] as const;

export function Hero({ spotlight, secondary }: { spotlight: Product; secondary: Product }) {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const imgY = useTransform(scrollYProgress, [0, 1], ["0%", "18%"]);
  const imgScale = useTransform(scrollYProgress, [0, 1], [1.02, 1.12]);
  const textY = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const fade = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  const words = ["The", "art", "of"];

  return (
    <section ref={ref} className="relative overflow-hidden" aria-label="Featured">
      <div className="container-lux relative grid items-center lg:min-h-[calc(100svh-7.25rem)] gap-10 pt-8 pb-16 lg:grid-cols-12 lg:gap-6 lg:pt-0 lg:pb-0">
        {/* Copy */}
        <motion.div style={{ y: textY, opacity: fade }} className="relative z-10 lg:col-span-6 xl:col-span-5">
          <motion.p initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease }} className="eyebrow mb-6 flex items-center gap-3">
            <span className="h-px w-10 bg-gradient-to-r from-transparent to-silver" />
            Winter Edit · 2026
          </motion.p>
          <h1 className="font-display text-[3.4rem] leading-[0.92] font-medium tracking-tight sm:text-7xl xl:text-[6.2rem]">
            <span className="block overflow-hidden pb-1">
              {words.map((w, i) => (
                <motion.span key={w} className="mr-[0.22em] inline-block" initial={{ y: "110%" }} animate={{ y: 0 }} transition={{ duration: 1, delay: 0.1 + i * 0.08, ease }}>
                  {w}
                </motion.span>
              ))}
            </span>
            <span className="block overflow-hidden pb-2">
              <motion.span className="chrome-text chrome-sheen inline-block italic" initial={{ y: "110%" }} animate={{ y: 0 }} transition={{ duration: 1.1, delay: 0.38, ease }}>
                considered
              </motion.span>
            </span>
            <span className="block overflow-hidden pb-1">
              <motion.span className="inline-block" initial={{ y: "110%" }} animate={{ y: 0 }} transition={{ duration: 1, delay: 0.5, ease }}>
                luxury.
              </motion.span>
            </span>
          </h1>
          <motion.p initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, delay: 0.75, ease }} className="mt-7 max-w-md text-base leading-relaxed text-muted sm:text-lg">
            Timepieces, tailoring, technology and objects of quiet distinction — curated in one place and delivered to every corner of Pakistan.
          </motion.p>
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, delay: 0.9, ease }} className="mt-9 flex flex-wrap gap-3">
            <ButtonLink href="/collections/featured" size="lg">
              Shop the edit <ArrowRight className="h-4 w-4" />
            </ButtonLink>
            <ButtonLink href="/shop" size="lg" variant="glass">
              Browse all
            </ButtonLink>
          </motion.div>
          <motion.dl initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1, delay: 1.1 }} className="mt-12 grid max-w-md grid-cols-3 gap-6 border-t border-line pt-6">
            {[
              ["8", "Categories"],
              ["7", "Regions served"],
              ["COD", "Nationwide"],
            ].map(([v, l]) => (
              <div key={l}>
                <dt className="sr-only">{l}</dt>
                <dd className="font-display text-3xl">{v}</dd>
                <dd className="mt-1 text-[11px] tracking-[0.18em] text-faint uppercase">{l}</dd>
              </div>
            ))}
          </motion.dl>
        </motion.div>

        {/* Visual */}
        <div className="relative lg:col-span-6 xl:col-span-7">
          <motion.div
            initial={{ opacity: 0, scale: 0.96, clipPath: "inset(12% 12% 12% 12% round 32px)" }}
            animate={{ opacity: 1, scale: 1, clipPath: "inset(0% 0% 0% 0% round 32px)" }}
            transition={{ duration: 1.6, ease }}
            className="edge relative ml-auto aspect-[4/5] w-full max-w-[640px] overflow-hidden rounded-[32px] shadow-[0_60px_120px_-40px_rgba(0,0,0,0.9)] sm:aspect-[5/6] lg:aspect-[4/5]"
          >
            <motion.div style={{ y: imgY, scale: imgScale }} className="absolute inset-0">
              <ProductImage image={spotlight.images[0]} preload fetchPriority="high" sizes="(min-width: 1024px) 55vw, 100vw" quality={85} />
            </motion.div>
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/0 to-black/20" />
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(255,255,255,0.12),transparent_55%)]" />
          </motion.div>

          {/* Floating spotlight card */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 1, ease }}
            className="absolute bottom-5 left-4 right-4 sm:right-auto sm:bottom-10 sm:left-0 lg:-left-10"
          >
            <Link href={`/product/${spotlight.slug}`} className="glass-strong edge group flex items-center gap-4 rounded-3xl p-3 pr-5 transition hover:bg-white/10 sm:w-[340px]">
              <span className="relative h-18 w-16 shrink-0 overflow-hidden rounded-2xl">
                <ProductImage image={spotlight.images[1] ?? spotlight.images[0]} sizes="64px" />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block text-[10px] tracking-[0.2em] text-faint uppercase">Spotlight</span>
                <span className="block truncate text-sm font-semibold">{spotlight.name}</span>
                <span className="mt-0.5 block text-xs text-silver">{formatPKR(spotlight.price)}</span>
              </span>
              <ArrowRight className="h-4 w-4 text-muted transition group-hover:translate-x-1 group-hover:text-fg" />
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 1.2, ease }}
            className="absolute top-6 right-4 hidden sm:block lg:-right-4 xl:right-[-1.5rem]"
          >
            <Link href={`/product/${secondary.slug}`} className="glass-strong edge block w-48 rounded-3xl p-3 transition hover:bg-white/10">
              <span className="relative block aspect-square overflow-hidden rounded-2xl">
                <ProductImage image={secondary.images[0]} sizes="180px" />
              </span>
              <span className="mt-3 flex items-center gap-1 text-[11px] text-silver">
                <Star className="h-3 w-3 fill-silver" aria-hidden /> {secondary.rating.toFixed(1)} · Best seller
              </span>
              <span className="mt-1 block truncate text-sm font-semibold">{secondary.name}</span>
            </Link>
          </motion.div>
        </div>
      </div>

    </section>
  );
}
