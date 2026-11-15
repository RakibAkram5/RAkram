"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion, useMotionValueEvent, useScroll } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { ChevronDown, Heart, Menu, Search, ShoppingBag, User } from "lucide-react";
import { sortedCategories } from "@/data/categories";
import { announcements } from "@/data/content";
import { cn } from "@/lib/format";
import { Logo } from "@/components/ui/Logo";
import { IconButton } from "@/components/ui/Button";
import { ProductImage } from "@/components/ui/ProductImage";
import { useCart, useWishlist } from "@/store/shop";
import { ui } from "@/store/ui";

export const primaryNav = [
  { href: "/collections/new-arrivals", label: "New In" },
  { href: "/collections/best-sellers", label: "Best Sellers" },
  { href: "/category/watches", label: "Watches" },
  { href: "/collections/sale", label: "Sale" },
];

export function AnnouncementBar() {
  const [i, setI] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setI((x) => (x + 1) % announcements.length), 4500);
    return () => clearInterval(t);
  }, []);
  return (
    <div className="relative z-50 border-b border-line bg-black/60 text-[11px] tracking-[0.18em] text-silver uppercase">
      <div className="container-lux flex h-9 items-center justify-center overflow-hidden text-center">
        <AnimatePresence mode="wait">
          <motion.p
            key={i}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.4 }}
            className="truncate"
          >
            {announcements[i]}
          </motion.p>
        </AnimatePresence>
      </div>
    </div>
  );
}

function Count({ n, label }: { n: number; label: string }) {
  return (
    <AnimatePresence>
      {n > 0 && (
        <motion.span
          key={n}
          initial={{ scale: 0.4, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.4, opacity: 0 }}
          className="btn-chrome absolute -top-0.5 -right-0.5 flex h-[18px] min-w-[18px] items-center justify-center rounded-full px-1 text-[10px] font-bold tabular-nums"
          aria-label={`${n} ${label}`}
        >
          {n}
        </motion.span>
      )}
    </AnimatePresence>
  );
}

export function Header() {
  const pathname = usePathname();
  const { lines } = useCart();
  const saved = useWishlist();
  const bagCount = lines.reduce((s, l) => s + l.quantity, 0);
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [mega, setMega] = useState(false);
  const [activeCat, setActiveCat] = useState(sortedCategories[0].slug);
  const closeTimer = useRef<number | undefined>(undefined);
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (y) => {
    const prev = scrollY.getPrevious() ?? 0;
    setScrolled(y > 24);
    setHidden(y > 400 && y > prev && !mega);
  });

  // Close transient menus on navigation
  const [lastPath, setLastPath] = useState(pathname);
  if (lastPath !== pathname) {
    setLastPath(pathname);
    setMega(false);
  }

  const openMega = () => {
    window.clearTimeout(closeTimer.current);
    setMega(true);
  };
  const closeMegaSoon = () => {
    closeTimer.current = window.setTimeout(() => setMega(false), 160);
  };
  const cat = sortedCategories.find((c) => c.slug === activeCat) ?? sortedCategories[0];

  return (
    <motion.header
      className="sticky top-0 z-40"
      animate={{ y: hidden ? "-100%" : "0%" }}
      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      onKeyDown={(e) => e.key === "Escape" && setMega(false)}
    >
      <div
        className={cn(
          "transition-all duration-500 ease-[var(--ease-lux)]",
          scrolled || mega ? "glass-strong border-x-0 border-t-0 shadow-[0_10px_40px_-20px_rgba(0,0,0,0.8)]" : "border-b border-transparent bg-transparent",
        )}
      >
        <div className={cn("container-lux flex items-center gap-2 transition-[height] duration-500", scrolled ? "h-16" : "h-20")}>
          <div className="flex flex-1 items-center gap-1 lg:hidden">
            <IconButton label="Open menu" onClick={ui.openMenu}>
              <Menu className="h-5 w-5" />
            </IconButton>
            <IconButton label="Search" onClick={ui.openSearch}>
              <Search className="h-5 w-5" />
            </IconButton>
          </div>

          <Link href="/" aria-label="RAKRAM home" className="shrink-0 lg:mr-10">
            <Logo />
          </Link>

          <nav aria-label="Primary" className="hidden flex-1 items-center gap-1 lg:flex">
            <div onMouseEnter={openMega} onMouseLeave={closeMegaSoon}>
              <button
                type="button"
                aria-expanded={mega}
                aria-controls="mega-menu"
                onClick={() => setMega((m) => !m)}
                className="group flex h-10 items-center gap-1.5 rounded-full px-4 text-[13px] font-medium tracking-wide text-silver hover:text-fg"
              >
                Shop
                <ChevronDown className={cn("h-3.5 w-3.5 transition-transform", mega && "rotate-180")} />
              </button>
            </div>
            {primaryNav.map((n) => (
              <Link
                key={n.href}
                href={n.href}
                className={cn(
                  "relative flex h-10 items-center rounded-full px-4 text-[13px] font-medium tracking-wide transition-colors",
                  pathname === n.href ? "text-fg" : "text-silver hover:text-fg",
                )}
              >
                {n.label}
                {pathname === n.href && <motion.span layoutId="nav-dot" className="absolute bottom-1 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full bg-white" />}
              </Link>
            ))}
          </nav>

          <div className="flex flex-1 items-center justify-end gap-0.5 lg:flex-none">
            <span className="hidden lg:contents">
              <IconButton label="Search" onClick={ui.openSearch}>
                <Search className="h-5 w-5" />
              </IconButton>
            </span>
            <Link href="/account" aria-label="Account" title="Account" className="hidden h-10 w-10 items-center justify-center rounded-full text-silver hover:bg-white/8 hover:text-fg sm:flex">
              <User className="h-5 w-5" />
            </Link>
            <Link href="/wishlist" aria-label="Wishlist" title="Wishlist" className="relative flex h-10 w-9 items-center justify-center rounded-full text-silver hover:bg-white/8 hover:text-fg sm:w-10">
              <Heart className="h-5 w-5" />
              <Count n={saved.length} label="saved items" />
            </Link>
            <IconButton label="Open bag" onClick={ui.openCart}>
              <ShoppingBag className="h-5 w-5" />
              <Count n={bagCount} label="items in bag" />
            </IconButton>
          </div>
        </div>

        <AnimatePresence>
          {mega && (
            <motion.div
              id="mega-menu"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              className="hidden overflow-hidden border-t border-line lg:block"
              onMouseEnter={openMega}
              onMouseLeave={closeMegaSoon}
            >
              <div className="container-lux grid grid-cols-12 gap-8 py-10">
                <ul className="col-span-3 space-y-1" aria-label="Categories">
                  {sortedCategories.map((c) => (
                    <li key={c.slug}>
                      <Link
                        href={`/category/${c.slug}`}
                        onMouseEnter={() => setActiveCat(c.slug)}
                        onFocus={() => setActiveCat(c.slug)}
                        className={cn(
                          "flex items-center justify-between rounded-xl px-4 py-2.5 text-sm transition-colors",
                          activeCat === c.slug ? "bg-white/[0.06] text-fg" : "text-muted hover:text-fg",
                        )}
                      >
                        {c.name}
                      </Link>
                    </li>
                  ))}
                </ul>
                <div className="col-span-4 border-l border-line pl-8">
                  <p className="eyebrow mb-4">{cat.tagline}</p>
                  <ul className="grid gap-1">
                    {cat.subcategories.map((s) => (
                      <li key={s.slug}>
                        <Link href={`/category/${cat.slug}?sub=${s.slug}`} className="block py-1.5 font-display text-2xl text-silver transition-colors hover:text-fg">
                          {s.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                  <Link href={`/category/${cat.slug}`} className="mt-5 inline-block text-xs font-semibold tracking-widest text-muted uppercase hover:text-fg">
                    Shop all {cat.name} →
                  </Link>
                </div>
                <Link href={`/category/${cat.slug}`} className="edge group relative col-span-5 overflow-hidden rounded-3xl" aria-label={`Explore ${cat.name}`}>
                  <div className="relative aspect-[16/10]">
                    <ProductImage image={cat.image} sizes="40vw" className="transition-transform duration-1000 group-hover:scale-105" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />
                    <div className="absolute bottom-5 left-6">
                      <p className="eyebrow text-silver">Explore</p>
                      <p className="font-display text-3xl">{cat.name}</p>
                    </div>
                  </div>
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.header>
  );
}
