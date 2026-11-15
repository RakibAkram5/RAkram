import { AdminHeading } from "@/components/admin/AdminShell";
import { OrdersManager } from "@/components/admin/Managers";
import { mockOrders } from "@/data/mock-orders";

export const metadata = { title: "Orders" };

export default function Page() {
  return (
    <>
      <AdminHeading title="Orders" description="Sample orders across Pakistan. Click an order to view details and update status." />
      <OrdersManager orders={mockOrders} />
    </>
  );
}
