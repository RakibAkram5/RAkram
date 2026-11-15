import type { Metadata } from "next";
import { orderService } from "@/services/orders";
import { OrdersList } from "@/components/account/AccountViews";

export const metadata: Metadata = { title: "My orders", robots: { index: false } };

export default async function OrdersPage() {
  const orders = await orderService.listMyOrders();
  return (
    <div>
      <h1 className="mb-6 font-display text-4xl">My orders</h1>
      <OrdersList orders={orders} />
    </div>
  );
}
