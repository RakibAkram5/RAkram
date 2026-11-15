import type { Metadata } from "next";
import { RegisterForm } from "@/components/account/AuthForms";

export const metadata: Metadata = { title: "Create account", robots: { index: false } };

export default function Page() {
  return (
    <section className="container-lux py-14 sm:py-20">
      <RegisterForm />
    </section>
  );
}
