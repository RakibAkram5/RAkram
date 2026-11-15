import { AdminHeading } from "@/components/admin/AdminShell";
import { SettingsForm } from "@/components/admin/Managers";

export const metadata = { title: "Settings" };

export default function Page() {
  return (
    <>
      <AdminHeading title="Settings" description="Store, delivery and payment configuration (demo — not persisted)." />
      <SettingsForm />
    </>
  );
}
