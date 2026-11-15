import type { Metadata } from "next";
import { LoginForm } from "@/components/account/AuthForms";

export const metadata: Metadata = { title: "Sign in", robots: { index: false } };

export default function Page() {
  return (
    <section className="container-lux py-14 sm:py-20">
      <LoginForm />
    </section>
  );
}
