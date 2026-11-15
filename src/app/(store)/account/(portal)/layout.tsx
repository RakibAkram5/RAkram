import { PortalShell } from "@/components/account/Portal";

export default function PortalLayout({ children }: { children: React.ReactNode }) {
  return (
    <section className="container-lux py-10 sm:py-14">
      <PortalShell>{children}</PortalShell>
    </section>
  );
}
