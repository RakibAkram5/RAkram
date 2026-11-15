import type { Metadata } from "next";
import { Banknote, PackageCheck, Phone, Truck } from "lucide-react";
import { deliveryConfig, provinces } from "@/data/pakistan";
import { formatPKR } from "@/lib/format";
import { PageHeader } from "@/components/layout/PageHeader";
import { DeliveryEstimator } from "@/components/checkout/DeliveryEstimator";
import { DemoNotice } from "@/components/ui/bits";

export const metadata: Metadata = {
  title: "Delivery across Pakistan",
  description: "RAKRAM delivers to every province, Islamabad, Gilgit-Baltistan and AJK. See delivery fees, timelines and Cash on Delivery details.",
  alternates: { canonical: "/delivery" },
};

const steps = [
  { icon: PackageCheck, title: "Inspected & packed", body: "Every order is quality-checked and gift-wrapped in RAKRAM packaging." },
  { icon: Phone, title: "Confirmed by phone", body: "For Cash on Delivery we call to confirm before dispatch." },
  { icon: Truck, title: "Dispatched nationwide", body: "Handed to our courier partner with tracking (Phase 2)." },
  { icon: Banknote, title: "Pay on arrival", body: "Pay the rider in cash, or prepay by bank, Easypaisa or JazzCash." },
];

export default function DeliveryPage() {
  const { zones, freeDeliveryThreshold } = deliveryConfig;
  return (
    <>
      <PageHeader
        crumbs={[{ href: "/", label: "Home" }, { label: "Delivery" }]}
        eyebrow="Karachi to Skardu"
        title="Delivery across Pakistan"
        description={`Every province and territory, with Cash on Delivery nationwide and free delivery over ${formatPKR(freeDeliveryThreshold)}.`}
      />
      <section className="container-lux grid gap-10 py-12 lg:grid-cols-12">
        <div className="space-y-8 lg:col-span-7">
          <DeliveryEstimator />
          <div className="grid gap-4 sm:grid-cols-2">
            {steps.map(({ icon: Icon, title, body }, i) => (
              <div key={title} className="glass edge rounded-3xl p-6">
                <div className="flex items-center gap-3">
                  <span className="font-display text-2xl text-faint">0{i + 1}</span>
                  <Icon className="h-5 w-5 text-silver" aria-hidden />
                </div>
                <h2 className="mt-4 font-semibold">{title}</h2>
                <p className="mt-1 text-sm text-muted">{body}</p>
              </div>
            ))}
          </div>
        </div>
        <aside className="space-y-6 lg:col-span-5">
          <div className="glass edge rounded-3xl p-6">
            <h2 className="font-display text-2xl">Fees & timelines</h2>
            <table className="mt-4 w-full text-left text-sm">
              <caption className="sr-only">Delivery zones (demo values)</caption>
              <thead className="text-xs text-faint">
                <tr>
                  <th scope="col" className="pb-2 font-normal">Zone</th>
                  <th scope="col" className="pb-2 font-normal">Time</th>
                  <th scope="col" className="pb-2 text-right font-normal">Fee</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {Object.values(zones).map((z) => (
                  <tr key={z.zone}>
                    <th scope="row" className="py-3 font-medium">{z.label}</th>
                    <td className="py-3 text-muted">{z.minDays}–{z.maxDays} working days</td>
                    <td className="py-3 text-right">{formatPKR(z.fee)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <ul className="mt-4 space-y-1 text-xs text-faint">
              <li>Metro: {deliveryConfig.metroCities.join(", ")}.</li>
              <li>Extended: Gilgit-Baltistan, AJK and selected remote districts.</li>
            </ul>
          </div>
          <div className="glass edge rounded-3xl p-6">
            <h2 className="font-display text-2xl">Coverage</h2>
            <ul className="mt-4 space-y-3 text-sm">
              {provinces.map((p) => (
                <li key={p.code}>
                  <p className="font-medium">{p.name}</p>
                  <p className="text-xs text-faint">{p.cities.slice(0, 6).join(" · ")}{p.cities.length > 6 ? " · and more" : ""}</p>
                </li>
              ))}
            </ul>
          </div>
          <DemoNotice>Fees, timelines and coverage are configurable demo values. Courier tracking is not yet connected.</DemoNotice>
        </aside>
      </section>
    </>
  );
}
