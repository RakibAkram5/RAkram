import type { Metadata } from "next";
import { AddressBook } from "@/components/account/AccountViews";

export const metadata: Metadata = { title: "Saved addresses", robots: { index: false } };

export default function AddressesPage() {
  return <AddressBook />;
}
