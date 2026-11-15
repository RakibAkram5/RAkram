import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { orderService } from "@/services/orders";
import { OrdersList, ProfileCard } from "@/components/account/AccountViews";

export const metadata: Metadata = { title: "My account", robots: { index: false } };

export default async function AccountPage() {
  const orders = await orderService.listMyOrders();
  return (
    <div className="space-y-8">
      <h1 className="font-display text-4xl sm:text-5xl">Welcome back</h1>
      <ProfileCard />
      <div>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-display text-2xl">Recent orders</h2>
          <Link href="/account/orders" className="inline-flex items-center gap-1 text-xs text-muted hover:text-fg">
            View all <ArrowRight className="h-3 w-3" />
          </Link>
        </div>
        <OrdersList orders={orders.slice(0, 2)} />
      </div>
    </div>
  );
}
