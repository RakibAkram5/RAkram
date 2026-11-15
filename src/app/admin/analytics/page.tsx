import { monthlySales, salesByProvince } from "@/data/mock-orders";
import { adminStats } from "@/lib/admin-stats";
import { formatPKR } from "@/lib/format";
import { AdminHeading, DataTable, Panel, StatTile } from "@/components/admin/AdminShell";
import { AreaChart, BarList, ColumnChart } from "@/components/admin/Charts";

export const metadata = { title: "Sales analytics" };

export default function AnalyticsPage() {
  const s = adminStats();
  const total6m = monthlySales.reduce((a, m) => a + m.revenue, 0);
  const orders6m = monthlySales.reduce((a, m) => a + m.orders, 0);
  return (
    <>
      <AdminHeading title="Sales analytics" description="Six-month performance (mock data)." />
      <div className="grid grid-cols-2 gap-4 xl:grid-cols-4">
        <StatTile label="Revenue · 6 months" value={formatPKR(total6m)} />
        <StatTile label="Orders · 6 months" value={orders6m.toLocaleString("en-PK")} />
        <StatTile label="Avg. order value" value={formatPKR(Math.round(total6m / orders6m))} />
        <StatTile label="Registered customers" value={String(s.customers)} hint="Sample customer records" />
      </div>
      <div className="mt-6 grid gap-6 xl:grid-cols-2">
        <Panel title="Revenue (PKR)">
          <AreaChart data={monthlySales.map((m) => ({ label: m.month, value: m.revenue }))} valueLabel="Revenue" kind="pkr" />
        </Panel>
        <Panel title="Orders per month">
          <ColumnChart data={monthlySales.map((m) => ({ label: m.month, value: m.orders }))} valueLabel="Orders" />
        </Panel>
        <Panel title="Sales by category (sample orders)">
          <BarList data={s.salesByCategory} kind="pkr" label="Sales by category" />
        </Panel>
        <Panel title="Share of orders by region (%)">
          <BarList data={salesByProvince} kind="percent" label="Orders by region" />
        </Panel>
      </div>
      <div className="mt-6 grid gap-6 xl:grid-cols-2">
        <Panel title="Monthly figures">
          <DataTable label="Monthly sales table">
            <thead>
              <tr>
                <th scope="col">Month</th>
                <th scope="col" className="text-right">Orders</th>
                <th scope="col" className="text-right">Revenue</th>
                <th scope="col" className="text-right">AOV</th>
              </tr>
            </thead>
            <tbody>
              {monthlySales.map((m) => (
                <tr key={m.month}>
                  <td>{m.month} 2026</td>
                  <td className="text-right tabular-nums">{m.orders}</td>
                  <td className="text-right tabular-nums">{formatPKR(m.revenue)}</td>
                  <td className="text-right tabular-nums">{formatPKR(Math.round(m.revenue / m.orders))}</td>
                </tr>
              ))}
            </tbody>
          </DataTable>
        </Panel>
        <Panel title="Top products (sample orders)">
          <DataTable label="Top products table">
            <thead>
              <tr>
                <th scope="col">Product</th>
                <th scope="col" className="text-right">Units</th>
                <th scope="col" className="text-right">Revenue</th>
              </tr>
            </thead>
            <tbody>
              {s.topProducts.map((p) => (
                <tr key={p.name}>
                  <td>{p.name}</td>
                  <td className="text-right tabular-nums">{p.units}</td>
                  <td className="text-right tabular-nums">{formatPKR(p.revenue)}</td>
                </tr>
              ))}
            </tbody>
          </DataTable>
        </Panel>
      </div>
    </>
  );
}
