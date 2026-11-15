import type { Metadata } from "next";
import { PageHeader } from "@/components/layout/PageHeader";
import { CartView } from "@/components/checkout/CartView";

export const metadata: Metadata = { title: "Your bag", robots: { index: false } };

export default function CartPage() {
  return (
    <>
      <PageHeader crumbs={[{ href: "/", label: "Home" }, { label: "Bag" }]} title="Your bag" />
      <section className="container-lux py-10">
        <CartView />
      </section>
    </>
  );
}
