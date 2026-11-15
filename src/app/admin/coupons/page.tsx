import { AdminHeading } from "@/components/admin/AdminShell";
import { CouponsManager } from "@/components/admin/Managers";

export const metadata = { title: "Coupons" };

export default function Page() {
  return (
    <>
      <AdminHeading title="Coupons" description="Create and manage discount codes. Validation must also run server-side." />
      <CouponsManager />
    </>
  );
}
