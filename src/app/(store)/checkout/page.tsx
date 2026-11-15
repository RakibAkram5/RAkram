import type { Metadata } from "next";
import { PageHeader } from "@/components/layout/PageHeader";
import { CheckoutForm } from "@/components/checkout/CheckoutForm";

export const metadata: Metadata = { title: "Checkout", robots: { index: false } };

export default function CheckoutPage() {
  return (
    <>
      <PageHeader crumbs={[{ href: "/", label: "Home" }, { href: "/cart", label: "Bag" }, { label: "Checkout" }]} eyebrow="Secure checkout · demo" title="Checkout" />
      <section className="container-lux py-10">
        <CheckoutForm />
      </section>
    </>
  );
}
