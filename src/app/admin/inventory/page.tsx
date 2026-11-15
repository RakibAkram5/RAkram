import { AdminHeading } from "@/components/admin/AdminShell";
import { InventoryManager } from "@/components/admin/Managers";

export const metadata = { title: "Inventory" };

export default function Page() {
  return (
    <>
      <AdminHeading title="Inventory" description="Demo stock levels. Real inventory will sync from the backend." />
      <InventoryManager />
    </>
  );
}
