import type { Metadata } from "next";
import { ForgotPasswordForm } from "@/components/account/AuthForms";

export const metadata: Metadata = { title: "Reset password", robots: { index: false } };

export default function Page() {
  return (
    <section className="container-lux py-14 sm:py-20">
      <ForgotPasswordForm />
    </section>
  );
}
