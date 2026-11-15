import type { Metadata } from "next";
import { PageHeader } from "@/components/layout/PageHeader";
import { WishlistView } from "@/components/account/WishlistView";

export const metadata: Metadata = { title: "Wishlist", robots: { index: false } };

export default function WishlistPage() {
  return (
    <>
      <PageHeader crumbs={[{ href: "/", label: "Home" }, { label: "Wishlist" }]} eyebrow="Saved for later" title="Wishlist" />
      <section className="container-lux py-10">
        <WishlistView />
      </section>
    </>
  );
}
