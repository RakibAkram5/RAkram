import type { Metadata } from "next";
import { ArrowRight } from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { ProductImage } from "@/components/ui/ProductImage";
import { ButtonLink } from "@/components/ui/Button";
import { Reveal } from "@/components/ui/Reveal";

export const metadata: Metadata = {
  title: "Our story",
  description: "RAKRAM is building Pakistan's most considered multi-category store — fewer things, better things, delivered nationwide.",
  alternates: { canonical: "/about" },
};

const values = [
  { title: "Curated, not crowded", body: "We would rather offer eight excellent headphones than eighty forgettable ones. Every product earns its place." },
  { title: "Honest by default", body: "Clear prices in rupees, real stock, plain-language policies — and no fake urgency, ever." },
  { title: "Built for Pakistan", body: "Cash on Delivery, mobile wallets, nationwide coverage and support that speaks your language — English today, Urdu next." },
];

export default function AboutPage() {
  return (
    <>
      <PageHeader
        crumbs={[{ href: "/", label: "Home" }, { label: "Our story" }]}
        eyebrow="About RAKRAM"
        title="Fewer things. Better things."
        description="A premium house of fashion, technology, timepieces and lifestyle — curated with intent and delivered across Pakistan."
        image={{ src: "1441986300917-64674bd600d8", alt: "Boutique interior with curated shelves" }}
      />
      <section className="container-lux grid gap-12 py-20 lg:grid-cols-12">
        <Reveal className="space-y-6 text-lg leading-relaxed text-muted lg:col-span-7">
          <p className="font-display text-3xl leading-snug text-fg">
            RAKRAM began with a simple frustration: finding genuinely well-made things in Pakistan meant endless scrolling, uncertain quality and no one to answer for it.
          </p>
          <p>
            We are building the opposite. A single destination where each category — from tailoring to timepieces, audio to skincare — is edited by people who care
            about materials, construction and how a product feels after a year of use.
          </p>
          <p>
            Every order is inspected before it leaves us, packed with care, and delivered from Karachi to Skardu. When something isn’t right, a real person
            makes it right.
          </p>
        </Reveal>
        <Reveal delay={0.1} className="lg:col-span-5">
          <div className="edge relative aspect-[4/5] overflow-hidden rounded-[32px]">
            <ProductImage image={{ src: "1507679799987-c73779587ccf", alt: "Man adjusting a tailored suit jacket" }} sizes="(min-width: 1024px) 40vw, 100vw" />
          </div>
        </Reveal>
      </section>
      <section className="container-lux pb-10">
        <div className="grid gap-4 md:grid-cols-3">
          {values.map((v, i) => (
            <Reveal key={v.title} delay={i * 0.08} className="glass edge rounded-3xl p-8">
              <p className="font-display text-4xl text-faint">0{i + 1}</p>
              <h2 className="mt-6 font-display text-2xl">{v.title}</h2>
              <p className="mt-3 text-sm leading-relaxed text-muted">{v.body}</p>
            </Reveal>
          ))}
        </div>
        <div className="mt-14 flex justify-center">
          <ButtonLink href="/shop" size="lg">
            Explore the collection <ArrowRight className="h-4 w-4" />
          </ButtonLink>
        </div>
      </section>
    </>
  );
}
