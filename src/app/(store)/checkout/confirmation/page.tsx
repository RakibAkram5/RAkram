import type { Metadata } from "next";
import { Confirmation } from "@/components/checkout/Confirmation";

export const metadata: Metadata = { title: "Order confirmation (demo)", robots: { index: false } };

export default function ConfirmationPage() {
  return (
    <section className="container-lux py-16">
      <Confirmation />
    </section>
  );
}
