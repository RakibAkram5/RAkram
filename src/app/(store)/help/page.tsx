import type { Metadata } from "next";
import { Mail, Phone, Clock } from "lucide-react";
import { faqs } from "@/data/content";
import { PageHeader } from "@/components/layout/PageHeader";
import { ButtonLink } from "@/components/ui/Button";

export const metadata: Metadata = {
  title: "Help & FAQs",
  description: "Answers about delivery, Cash on Delivery, returns and orders at RAKRAM.",
  alternates: { canonical: "/help" },
};

export default function HelpPage() {
  return (
    <>
      <PageHeader crumbs={[{ href: "/", label: "Home" }, { label: "Help" }]} eyebrow="Customer care" title="How can we help?" />
      <section className="container-lux grid gap-10 py-12 lg:grid-cols-12">
        <div className="lg:col-span-8">
          <h2 className="mb-4 font-display text-3xl">Frequently asked</h2>
          <div className="divide-y divide-line border-y border-line">
            {faqs.map((f) => (
              <details key={f.q} className="group py-5">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-medium">
                  {f.q}
                  <span className="text-xl text-muted transition-transform group-open:rotate-45" aria-hidden>
                    +
                  </span>
                </summary>
                <p className="mt-3 text-sm leading-relaxed text-muted">{f.a}</p>
              </details>
            ))}
          </div>

          <h2 id="returns" className="mt-14 mb-4 scroll-mt-28 font-display text-3xl">
            Returns & exchanges
          </h2>
          <div className="glass edge space-y-3 rounded-3xl p-6 text-sm leading-relaxed text-muted">
            <p>
              <span className="text-fg">Planned policy:</span> unused items in original packaging can be returned within 7 days of delivery. Exchanges for size or
              colour are free for metro cities.
            </p>
            <p>Hygiene items (opened skincare, earbuds) and personalised gifts are final sale. Final terms will be published at launch.</p>
            <p>To start a return, contact us with your order number. Refunds will be issued to the original payment method or bank account for COD orders.</p>
          </div>
        </div>
        <aside className="lg:col-span-4">
          <div className="glass-strong edge space-y-5 rounded-3xl p-6 lg:sticky lg:top-24">
            <h2 className="font-display text-2xl">Contact us</h2>
            <ul className="space-y-4 text-sm text-muted">
              <li className="flex gap-3">
                <Clock className="h-4 w-4 shrink-0 text-silver" aria-hidden /> Mon–Sat, 10am–7pm PKT
              </li>
              <li className="flex gap-3">
                <Mail className="h-4 w-4 shrink-0 text-silver" aria-hidden /> Support email to be announced at launch
              </li>
              <li className="flex gap-3">
                <Phone className="h-4 w-4 shrink-0 text-silver" aria-hidden /> WhatsApp support to be announced at launch
              </li>
            </ul>
            <ButtonLink href="/track-order" variant="outline" className="w-full">
              Track an order
            </ButtonLink>
          </div>
        </aside>
      </section>
    </>
  );
}
