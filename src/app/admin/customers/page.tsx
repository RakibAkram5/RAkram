import { AdminHeading } from "@/components/admin/AdminShell";
import { CustomersManager } from "@/components/admin/Managers";
import { mockCustomers } from "@/data/mock-orders";

export const metadata = { title: "Customers" };

export default function Page() {
  return (
    <>
      <AdminHeading title="Customers" description="Sample customer records for demonstration." />
      <CustomersManager customers={mockCustomers} />
    </>
  );
}
