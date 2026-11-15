import Link from "next/link";
import { Banknote, RotateCcw, ShieldCheck, Truck } from "lucide-react";
import { sortedCategories } from "@/data/categories";
import { Logo, SocialIcon } from "@/components/ui/Logo";

const perks = [
  { icon: Truck, title: "Nationwide delivery", body: "All provinces, GB & AJK" },
  { icon: Banknote, title: "Cash on Delivery", body: "Pay when it arrives" },
  { icon: RotateCcw, title: "7-day returns", body: "Planned launch policy" },
  { icon: ShieldCheck, title: "Quality inspected", body: "Every order, every time" },
];

const columns = [
  {
    title: "Customer care",
    links: [
      { href: "/track-order", label: "Track your order" },
      { href: "/delivery", label: "Delivery & fees" },
      { href: "/help#returns", label: "Returns & exchanges" },
      { href: "/help", label: "Help & FAQs" },
    ],
  },
  {
    title: "Account",
    links: [
      { href: "/account/login", label: "Sign in" },
      { href: "/account/register", label: "Create account" },
      { href: "/account/orders", label: "My orders" },
      { href: "/wishlist", label: "Wishlist" },
    ],
  },
  {
    title: "RAKRAM",
    links: [
      { href: "/about", label: "Our story" },
      { href: "/collections/featured", label: "The Signature Edit" },
      { href: "/collections/sale", label: "Private Sale" },
      { href: "/admin", label: "Admin preview" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="mt-24 border-t border-line bg-black/40">
      <div className="container-lux grid grid-cols-2 gap-6 border-b border-line py-10 lg:grid-cols-4">
        {perks.map(({ icon: Icon, title, body }) => (
          <div key={title} className="flex items-start gap-3">
            <span className="glass flex h-10 w-10 shrink-0 items-center justify-center rounded-full">
              <Icon className="h-4 w-4 text-silver" aria-hidden />
            </span>
            <div>
              <p className="text-sm font-semibold">{title}</p>
              <p className="text-xs text-muted">{body}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="container-lux grid gap-12 py-16 lg:grid-cols-12">
        <div className="lg:col-span-4">
          <Logo />
          <p className="mt-5 max-w-xs text-sm leading-relaxed text-muted">
            A considered edit of fashion, technology, timepieces and lifestyle — delivered across Pakistan.
          </p>
          <div className="mt-6 flex gap-2">
            {(["instagram", "facebook", "tiktok", "youtube"] as const).map((s) => (
              <span key={s} className="glass flex h-10 w-10 items-center justify-center rounded-full text-silver" title={`${s} (coming soon)`}>
                <SocialIcon name={s} />
                <span className="sr-only">{s} — coming soon</span>
              </span>
            ))}
          </div>
        </div>
        <div className="grid grid-cols-2 gap-10 sm:grid-cols-4 lg:col-span-8">
          <div>
            <p className="eyebrow mb-4">Shop</p>
            <ul className="space-y-2.5 text-sm">
              {sortedCategories.map((c) => (
                <li key={c.slug}>
                  <Link href={`/category/${c.slug}`} className="text-muted transition-colors hover:text-fg">
                    {c.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          {columns.map((col) => (
            <div key={col.title}>
              <p className="eyebrow mb-4">{col.title}</p>
              <ul className="space-y-2.5 text-sm">
                {col.links.map((l) => (
                  <li key={l.href}>
                    <Link href={l.href} className="text-muted transition-colors hover:text-fg">
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      <div className="border-t border-line">
        <div className="container-lux flex flex-col gap-4 py-6 text-xs text-faint sm:flex-row sm:items-center sm:justify-between">
          <p>© {2026} RAKRAM. Prices in Pakistani Rupees (PKR).</p>
          <p className="max-w-xl sm:text-right">
            Preview storefront: products, prices, ratings, stock and reviews are demonstration data. No orders or payments are processed. Demo photography via Unsplash may show third-party trademarks; no affiliation is implied.
          </p>
          <div className="flex gap-3" aria-label="Accepted payment methods">
            {["COD", "Bank", "Easypaisa", "JazzCash"].map((p) => (
              <span key={p} className="rounded-md border border-line px-2 py-1 text-[10px] tracking-wider text-muted uppercase">
                {p}
              </span>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
