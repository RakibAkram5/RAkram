import type { Metadata } from "next";
import { demoCustomerOrders } from "@/data/mock-orders";
import { PageHeader } from "@/components/layout/PageHeader";
import { TrackOrder } from "@/components/account/AccountViews";

export const metadata: Metadata = {
  title: "Track your order",
  description: "Track a RAKRAM order with your order number and mobile number.",
};

export default function TrackOrderPage() {
  // Only the demo customer's sample orders are exposed to the client.
  const lookup = Object.fromEntries(demoCustomerOrders.map((o) => [o.number, o]));
  return (
    <>
      <PageHeader crumbs={[{ href: "/", label: "Home" }, { label: "Track order" }]} eyebrow="Customer care" title="Track your order" description="Enter your order number and the mobile number used at checkout." />
      <section className="container-lux py-10">
        <TrackOrder lookup={lookup} />
      </section>
    </>
  );
}
