import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { mockOrders, monthlySales } from "@/data/mock-orders";
import { adminStats } from "@/lib/admin-stats";
import { formatDate, formatPKR } from "@/lib/format";
import { AdminHeading, DataTable, Panel, StatTile } from "@/components/admin/AdminShell";
import { AreaChart, BarList } from "@/components/admin/Charts";
import { StatusPill } from "@/components/account/OrderBits";
import { ButtonLink } from "@/components/ui/Button";

export const metadata = { title: { absolute: "Overview · RAKRAM Admin" } };

export default function AdminOverview() {
  const s = adminStats();
  return (
    <>
      <AdminHeading
        title="Overview"
        description="Store performance at a glance — mock data for demonstration."
        action={
          <ButtonLink href="/admin/products/new" size="sm">
            Add product
          </ButtonLink>
        }
      />
      <div className="grid grid-cols-2 gap-4 xl:grid-cols-4">
        <StatTile label="Revenue · November" value={formatPKR(s.monthRevenue)} delta={s.revenueDelta} />
        <StatTile label="Orders · November" value={String(s.monthOrders)} delta={s.ordersDelta} />
        <StatTile label="Average order value" value={formatPKR(s.aov)} hint="Across sample orders" />
        <StatTile label="Awaiting fulfilment" value={String(s.pendingOrders)} hint="Pending, confirmed or packed" />
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-3">
        <Panel title="Revenue (PKR) · last 6 months" className="xl:col-span-2">
          <AreaChart data={monthlySales.map((m) => ({ label: m.month, value: m.revenue }))} valueLabel="Revenue" kind="pkr" />
        </Panel>
        <Panel title="Sales by category">
          <BarList data={s.salesByCategory.slice(0, 6)} kind="pkr" label="Sales by category" />
        </Panel>
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-3">
        <Panel
          title="Recent orders"
          className="xl:col-span-2"
          action={
            <Link href="/admin/orders" className="inline-flex items-center gap-1 text-xs text-muted hover:text-fg">
              All orders <ArrowRight className="h-3 w-3" />
            </Link>
          }
        >
          <DataTable label="Recent orders">
            <thead>
              <tr>
                <th scope="col">Order</th>
                <th scope="col">Customer</th>
                <th scope="col">City</th>
                <th scope="col">Status</th>
                <th scope="col" className="text-right">Total</th>
              </tr>
            </thead>
            <tbody>
              {mockOrders.slice(0, 7).map((o) => (
                <tr key={o.id}>
                  <td>
                    <span className="font-medium">{o.number}</span>
                    <span className="block text-xs text-faint">{formatDate(o.createdAt)}</span>
                  </td>
                  <td>{o.customerName}</td>
                  <td className="text-muted">{o.address.city}</td>
                  <td>
                    <StatusPill status={o.status} />
                  </td>
                  <td className="text-right tabular-nums">{formatPKR(o.total)}</td>
                </tr>
              ))}
            </tbody>
          </DataTable>
        </Panel>
        <Panel
          title="Low stock"
          action={
            <Link href="/admin/inventory" className="inline-flex items-center gap-1 text-xs text-muted hover:text-fg">
              Inventory <ArrowRight className="h-3 w-3" />
            </Link>
          }
        >
          <ul className="divide-y divide-line">
            {s.lowStock.slice(0, 8).map((p) => (
              <li key={p.id} className="flex items-center justify-between gap-3 py-2.5 text-sm">
                <Link href={`/admin/products/${p.id}/edit`} className="truncate hover:underline">
                  {p.name}
                </Link>
                <span className={p.stock === 0 ? "text-danger" : "text-warning"}>{p.stock === 0 ? "Out" : `${p.stock} left`}</span>
              </li>
            ))}
          </ul>
        </Panel>
      </div>
    </>
  );
}
