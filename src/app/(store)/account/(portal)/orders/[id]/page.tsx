import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { demoCustomerOrders } from "@/data/mock-orders";
import { orderService } from "@/services/orders";
import { OrderDetail } from "@/components/account/AccountViews";

export const metadata: Metadata = { title: "Order details", robots: { index: false } };

export function generateStaticParams() {
  return demoCustomerOrders.map((o) => ({ id: o.id }));
}

export default async function OrderPage({ params }: PageProps<"/account/orders/[id]">) {
  const { id } = await params;
  const order = await orderService.getMyOrder(id);
  if (!order) notFound();
  return <OrderDetail order={order} />;
}
