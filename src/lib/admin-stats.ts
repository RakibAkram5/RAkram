import { categories } from "@/data/categories";
import { mockCustomers, mockOrders, monthlySales } from "@/data/mock-orders";
import { allProducts } from "./catalog";

/** Derived demo metrics for the admin dashboard (all from mock data). */
export function adminStats() {
  const valid = mockOrders.filter((o) => o.status !== "cancelled");
  const revenue = valid.reduce((s, o) => s + o.total, 0);
  const byCategory = new Map<string, number>();
  const byProduct = new Map<string, { name: string; units: number; revenue: number }>();
  for (const o of valid) {
    for (const l of o.lines) {
      const p = allProducts.find((x) => x.id === l.productId);
      if (!p) continue;
      byCategory.set(p.category, (byCategory.get(p.category) ?? 0) + l.price * l.quantity);
      const cur = byProduct.get(p.id) ?? { name: p.name, units: 0, revenue: 0 };
      cur.units += l.quantity;
      cur.revenue += l.price * l.quantity;
      byProduct.set(p.id, cur);
    }
  }
  const last = monthlySales[monthlySales.length - 1];
  const prev = monthlySales[monthlySales.length - 2];
  return {
    revenue,
    orderCount: mockOrders.length,
    aov: Math.round(revenue / Math.max(1, valid.length)),
    customers: mockCustomers.length,
    monthRevenue: last.revenue,
    monthOrders: last.orders,
    revenueDelta: ((last.revenue - prev.revenue) / prev.revenue) * 100,
    ordersDelta: ((last.orders - prev.orders) / prev.orders) * 100,
    salesByCategory: categories
      .map((c) => ({ name: c.name, value: byCategory.get(c.slug) ?? 0 }))
      .sort((a, b) => b.value - a.value),
    topProducts: [...byProduct.values()].sort((a, b) => b.revenue - a.revenue).slice(0, 6),
    lowStock: allProducts.filter((p) => p.stock <= 5).sort((a, b) => a.stock - b.stock),
    pendingOrders: mockOrders.filter((o) => ["pending", "confirmed", "packed"].includes(o.status)).length,
    statusCounts: mockOrders.reduce<Record<string, number>>((acc, o) => ((acc[o.status] = (acc[o.status] ?? 0) + 1), acc), {}),
  };
}
