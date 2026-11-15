import Link from "next/link";
import { Logo } from "@/components/ui/Logo";
import { ButtonLink } from "@/components/ui/Button";

export default function GlobalNotFound() {
  return (
    <main className="container-lux flex min-h-dvh flex-col items-center justify-center py-24 text-center">
      <Link href="/" aria-label="RAKRAM home" className="mb-16">
        <Logo />
      </Link>
      <p className="eyebrow">Error 404</p>
      <h1 className="mt-4 font-display text-6xl sm:text-8xl">
        <span className="chrome-text italic">Lost</span> in the edit.
      </h1>
      <p className="mt-5 max-w-md text-muted">The page you’re looking for has moved, sold out, or never existed.</p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <ButtonLink href="/">Back to home</ButtonLink>
        <ButtonLink href="/shop" variant="outline">
          Shop all
        </ButtonLink>
      </div>
    </main>
  );
}
