"use client";

import { useMemo, useState } from "react";
import { Minus, Plus, Search, Trash, X } from "lucide-react";
import type { Category, Coupon, Customer, Order, OrderStatus } from "@/lib/types";
import { categories as seedCategories } from "@/data/categories";
import { coupons as seedCoupons } from "@/data/content";
import { deliveryConfig, paymentMethods } from "@/data/pakistan";
import { allProducts } from "@/lib/catalog";
import { cn, formatDate, formatPKR, stockStatus } from "@/lib/format";
import { cleanText, hasErrors, validators, type Errors } from "@/lib/validation";
import { ui } from "@/store/ui";
import { Button } from "@/components/ui/Button";
import { SelectField, TextField } from "@/components/ui/Field";
import { Drawer, Modal } from "@/components/ui/Overlay";
import { ProductImage } from "@/components/ui/ProductImage";
import { StockIndicator } from "@/components/ui/bits";
import { StatusPill, statusLabel, OrderTimeline } from "@/components/account/OrderBits";
import { DataTable, Panel } from "./AdminShell";

const slugify = (s: string) =>
  s
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 40);

/* ---------------- Categories ---------------- */
export function CategoryManager() {
  const [list, setList] = useState<Category[]>(seedCategories);
  const [name, setName] = useState("");
  const [error, setError] = useState<string>();
  const [confirm, setConfirm] = useState<Category | null>(null);
  const count = (slug: string) => allProducts.filter((p) => p.category === slug).length;

  return (
    <div className="grid gap-6 xl:grid-cols-3">
      <Panel title={`Categories (${list.length})`} className="xl:col-span-2">
        <DataTable label="Categories">
          <thead>
            <tr>
              <th scope="col">Category</th>
              <th scope="col">Subcategories</th>
              <th scope="col" className="text-right">Products</th>
              <th scope="col" className="text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {list.map((c) => (
              <tr key={c.slug}>
                <td>
                  <div className="flex items-center gap-3">
                    <span className="relative h-10 w-10 shrink-0 overflow-hidden rounded-lg bg-ink-3">
                      <ProductImage image={c.image} sizes="40px" />
                    </span>
                    <span>
                      <span className="block font-medium">{c.name}</span>
                      <span className="block text-xs text-faint">/{c.slug}</span>
                    </span>
                  </div>
                </td>
                <td className="max-w-[280px] text-xs text-muted">{c.subcategories.map((s) => s.name).join(", ") || "—"}</td>
                <td className="text-right tabular-nums">{count(c.slug)}</td>
                <td className="text-right">
                  <button type="button" onClick={() => setConfirm(c)} aria-label={`Delete ${c.name}`} className="inline-flex h-9 w-9 items-center justify-center rounded-full text-muted hover:bg-red-500/10 hover:text-danger">
                    <Trash className="h-4 w-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </DataTable>
      </Panel>
      <Panel title="Add category">
        <form
          noValidate
          className="space-y-4"
          onSubmit={(e) => {
            e.preventDefault();
            const n = cleanText(name, 60);
            const slug = slugify(n);
            const err = !n ? "Name is required" : list.some((c) => c.slug === slug) ? "A category with this name already exists" : undefined;
            setError(err);
            if (err) return;
            setList((l) => [...l, { slug, name: n, tagline: "New category", description: "", image: { src: "1513475382585-d06e58bcb0e0", alt: n }, subcategories: [], order: l.length + 1 }]);
            setName("");
            ui.toast(`Category "${n}" added (demo)`, "success");
          }}
        >
          <TextField label="Category name" value={name} onChange={(e) => setName(e.target.value)} maxLength={60} error={error} hint={name ? `URL: /category/${slugify(name)}` : "Categories are data-driven; navigation updates automatically."} />
          <Button type="submit" className="w-full">
            <Plus className="h-4 w-4" /> Add category
          </Button>
        </form>
      </Panel>
      <Modal open={!!confirm} onClose={() => setConfirm(null)} title="Delete category?">
        {confirm && (
          <div className="p-6">
            <p className="text-sm text-muted">
              Delete <span className="font-semibold text-fg">{confirm.name}</span>?{" "}
              {count(confirm.slug) > 0 ? `${count(confirm.slug)} products must be reassigned first in production.` : "It has no products."}
            </p>
            <div className="mt-6 flex justify-end gap-2">
              <Button variant="ghost" onClick={() => setConfirm(null)} data-autofocus>
                Cancel
              </Button>
              <Button
                variant="danger"
                onClick={() => {
                  setList((l) => l.filter((x) => x.slug !== confirm.slug));
                  ui.toast("Category deleted (demo)", "success");
                  setConfirm(null);
                }}
              >
                Delete
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}

/* ---------------- Inventory ---------------- */
export function InventoryManager() {
  const [stock, setStock] = useState<Record<string, number>>(() => Object.fromEntries(allProducts.map((p) => [p.id, p.stock])));
  const [filter, setFilter] = useState("attention");
  const rows = allProducts
    .filter((p) => (filter === "attention" ? stock[p.id] <= 5 : true))
    .sort((a, b) => stock[a.id] - stock[b.id]);
  const adjust = (id: string, d: number) => setStock((s) => ({ ...s, [id]: Math.max(0, Math.min(9999, s[id] + d)) }));
  const total = Object.values(stock).reduce((a, b) => a + b, 0);
  const value = allProducts.reduce((a, p) => a + p.price * stock[p.id], 0);

  return (
    <Panel
      title={`${total.toLocaleString("en-PK")} units · ${formatPKR(value)} retail value`}
      action={
        <div className="flex rounded-full border border-line p-1 text-xs" role="tablist" aria-label="Inventory filter">
          {[
            ["attention", "Needs attention"],
            ["all", "All products"],
          ].map(([k, l]) => (
            <button key={k} role="tab" type="button" aria-selected={filter === k} onClick={() => setFilter(k)} className={cn("rounded-full px-3 py-1.5", filter === k ? "bg-white text-ink" : "text-muted")}>
              {l}
            </button>
          ))}
        </div>
      }
    >
      <DataTable label="Inventory">
        <thead>
          <tr>
            <th scope="col">Product</th>
            <th scope="col">SKU</th>
            <th scope="col">Status</th>
            <th scope="col" className="text-right">On hand</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((p) => (
            <tr key={p.id}>
              <td className="font-medium">{p.name}</td>
              <td className="text-xs text-faint">{p.sku}</td>
              <td>
                <StockIndicator stock={stock[p.id]} />
              </td>
              <td>
                <div className="flex items-center justify-end gap-2">
                  <button type="button" onClick={() => adjust(p.id, -1)} aria-label={`Decrease stock for ${p.name}`} className="flex h-8 w-8 items-center justify-center rounded-full border border-line text-muted hover:text-fg">
                    <Minus className="h-3.5 w-3.5" />
                  </button>
                  <span className={cn("w-10 text-center tabular-nums", stockStatus(stock[p.id]) === "out_of_stock" && "text-danger")}>{stock[p.id]}</span>
                  <button type="button" onClick={() => adjust(p.id, 1)} aria-label={`Increase stock for ${p.name}`} className="flex h-8 w-8 items-center justify-center rounded-full border border-line text-muted hover:text-fg">
                    <Plus className="h-3.5 w-3.5" />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </DataTable>
      {rows.length === 0 && <p className="py-6 text-center text-sm text-muted">Everything is well stocked.</p>}
      <p className="mt-4 text-xs text-faint">Demo adjustments are not saved. Production stock changes must be server-authorised and audited.</p>
    </Panel>
  );
}

/* ---------------- Orders ---------------- */
const allStatuses: OrderStatus[] = ["pending", "confirmed", "packed", "shipped", "out_for_delivery", "delivered", "cancelled"];

export function OrdersManager({ orders }: { orders: Order[] }) {
  const [list, setList] = useState(orders);
  const [status, setStatus] = useState<string>("");
  const [q, setQ] = useState("");
  const [openId, setOpenId] = useState<string | null>(null);
  const shown = useMemo(() => {
    const t = q.trim().toLowerCase();
    return list.filter((o) => (!status || o.status === status) && (!t || o.number.toLowerCase().includes(t) || o.customerName.toLowerCase().includes(t) || o.address.city.toLowerCase().includes(t)));
  }, [list, status, q]);
  const open = list.find((o) => o.id === openId);

  return (
    <Panel>
      <div className="no-scrollbar -mx-1 mb-4 flex gap-2 overflow-x-auto px-1">
        {["", ...allStatuses].map((s) => (
          <button key={s || "all"} type="button" onClick={() => setStatus(s)} aria-pressed={status === s} className={cn("shrink-0 rounded-full border px-3 py-1.5 text-xs", status === s ? "border-white bg-white text-ink" : "border-line text-muted hover:text-fg")}>
            {s ? statusLabel[s as OrderStatus] : "All"} <span className="opacity-60">({s ? list.filter((o) => o.status === s).length : list.length})</span>
          </button>
        ))}
      </div>
      <div className="relative mb-5">
        <Search className="pointer-events-none absolute top-1/2 left-4 h-4 w-4 -translate-y-1/2 text-faint" aria-hidden />
        <label htmlFor="oq" className="sr-only">Search orders</label>
        <input id="oq" value={q} onChange={(e) => setQ(e.target.value)} maxLength={60} placeholder="Search order #, customer or city" className="field h-11 pl-11" />
      </div>
      <DataTable label="Orders">
        <thead>
          <tr>
            <th scope="col">Order</th>
            <th scope="col">Customer</th>
            <th scope="col">Payment</th>
            <th scope="col">Status</th>
            <th scope="col" className="text-right">Total</th>
          </tr>
        </thead>
        <tbody>
          {shown.map((o) => (
            <tr key={o.id} className="cursor-pointer" onClick={() => setOpenId(o.id)}>
              <td>
                <button type="button" className="font-medium hover:underline" onClick={() => setOpenId(o.id)}>
                  {o.number}
                </button>
                <span className="block text-xs text-faint">{formatDate(o.createdAt)}</span>
              </td>
              <td>
                {o.customerName}
                <span className="block text-xs text-faint">{o.address.city}</span>
              </td>
              <td className="text-xs text-muted">
                {paymentMethods.find((m) => m.id === o.paymentMethod)?.name}
                <span className={cn("block", o.paymentStatus === "paid" ? "text-success" : "text-faint")}>{o.paymentStatus}</span>
              </td>
              <td>
                <StatusPill status={o.status} />
              </td>
              <td className="text-right tabular-nums">{formatPKR(o.total)}</td>
            </tr>
          ))}
        </tbody>
      </DataTable>
      {shown.length === 0 && <p className="py-6 text-center text-sm text-muted">No orders match.</p>}

      <Drawer open={!!open} onClose={() => setOpenId(null)} title={open ? `Order ${open.number}` : "Order"} widthClass="w-full sm:w-[520px]">
        {open && (
          <div className="space-y-6 p-5">
            <SelectField
              label="Update status"
              value={open.status}
              onChange={(e) => {
                const s = e.target.value as OrderStatus;
                setList((l) => l.map((o) => (o.id === open.id ? { ...o, status: s, timeline: [...o.timeline, { status: s, at: new Date().toISOString() }] } : o)));
                ui.toast(`Status set to ${statusLabel[s]} (demo)`, "success");
              }}
              options={allStatuses.map((s) => ({ value: s, label: statusLabel[s] }))}
              hint="Demo only. Customers would be notified via SMS/email in Phase 2."
            />
            <div className="rounded-2xl border border-line p-4">
              <OrderTimeline order={open} />
            </div>
            <div className="grid gap-4 text-sm sm:grid-cols-2">
              <div>
                <p className="mb-1 text-xs text-faint">Customer</p>
                <p>{open.customerName}</p>
                <p className="text-muted">{open.customerEmail}</p>
                <p className="text-muted">{open.phone}</p>
              </div>
              <div>
                <p className="mb-1 text-xs text-faint">Ship to</p>
                <address className="text-muted not-italic">
                  {open.address.house}, {open.address.street}, {open.address.area}, {open.address.city}, {open.address.province} {open.address.postalCode}
                </address>
              </div>
            </div>
            <ul className="divide-y divide-line border-y border-line">
              {open.lines.map((l, i) => (
                <li key={i} className="flex justify-between gap-3 py-3 text-sm">
                  <span>
                    {l.name} <span className="text-faint">× {l.quantity}</span>
                  </span>
                  <span className="tabular-nums">{formatPKR(l.price * l.quantity)}</span>
                </li>
              ))}
            </ul>
            <dl className="space-y-1 text-sm">
              <div className="flex justify-between"><dt className="text-muted">Subtotal</dt><dd>{formatPKR(open.subtotal)}</dd></div>
              <div className="flex justify-between"><dt className="text-muted">Discount</dt><dd>−{formatPKR(open.discount)}</dd></div>
              <div className="flex justify-between"><dt className="text-muted">Delivery</dt><dd>{formatPKR(open.deliveryFee)}</dd></div>
              <div className="flex justify-between font-semibold"><dt>Total</dt><dd>{formatPKR(open.total)}</dd></div>
            </dl>
          </div>
        )}
      </Drawer>
    </Panel>
  );
}

/* ---------------- Customers ---------------- */
export function CustomersManager({ customers }: { customers: Customer[] }) {
  const [list, setList] = useState(customers);
  const [q, setQ] = useState("");
  const t = q.trim().toLowerCase();
  const shown = list.filter((c) => !t || c.name.toLowerCase().includes(t) || c.email.includes(t) || c.city.toLowerCase().includes(t));
  return (
    <Panel>
      <div className="relative mb-5">
        <Search className="pointer-events-none absolute top-1/2 left-4 h-4 w-4 -translate-y-1/2 text-faint" aria-hidden />
        <label htmlFor="cq" className="sr-only">Search customers</label>
        <input id="cq" value={q} onChange={(e) => setQ(e.target.value)} maxLength={60} placeholder="Search name, email or city" className="field h-11 pl-11" />
      </div>
      <DataTable label="Customers">
        <thead>
          <tr>
            <th scope="col">Customer</th>
            <th scope="col">City</th>
            <th scope="col">Joined</th>
            <th scope="col" className="text-right">Orders</th>
            <th scope="col" className="text-right">Spent</th>
            <th scope="col" className="text-right">Status</th>
          </tr>
        </thead>
        <tbody>
          {shown.map((c) => (
            <tr key={c.id}>
              <td>
                <span className="block font-medium">{c.name}</span>
                <span className="block text-xs text-faint">{c.email}</span>
              </td>
              <td className="text-muted">{c.city}</td>
              <td className="text-muted">{formatDate(c.joinedAt)}</td>
              <td className="text-right tabular-nums">{c.orders}</td>
              <td className="text-right tabular-nums">{formatPKR(c.totalSpent)}</td>
              <td className="text-right">
                <button
                  type="button"
                  onClick={() => {
                    setList((l) => l.map((x) => (x.id === c.id ? { ...x, status: x.status === "active" ? "blocked" : "active" } : x)));
                    ui.toast(`${c.name} ${c.status === "active" ? "blocked" : "re-activated"} (demo)`);
                  }}
                  className={cn("rounded-full border px-2.5 py-1 text-[11px]", c.status === "active" ? "border-emerald-400/20 text-success" : "border-red-400/20 text-danger")}
                  aria-label={`${c.status === "active" ? "Block" : "Activate"} ${c.name}`}
                >
                  {c.status}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </DataTable>
      <p className="mt-4 text-xs text-faint">Sample customer records with example.com emails — not real people.</p>
    </Panel>
  );
}

/* ---------------- Coupons ---------------- */
type CF = "code" | "value" | "minSubtotal" | "description";
export function CouponsManager() {
  const [list, setList] = useState<Coupon[]>(seedCoupons);
  const [open, setOpen] = useState(false);
  const [type, setType] = useState<Coupon["type"]>("percent");
  const [v, setV] = useState<Record<CF, string>>({ code: "", value: "", minSubtotal: "0", description: "" });
  const [errors, setErrors] = useState<Errors<CF>>({});

  return (
    <Panel
      action={
        <Button size="sm" onClick={() => setOpen(true)}>
          <Plus className="h-3.5 w-3.5" /> New coupon
        </Button>
      }
      title={`${list.filter((c) => c.active).length} active coupons`}
    >
      <DataTable label="Coupons">
        <thead>
          <tr>
            <th scope="col">Code</th>
            <th scope="col">Discount</th>
            <th scope="col" className="text-right">Min. spend</th>
            <th scope="col" className="text-right">Usage</th>
            <th scope="col">Expires</th>
            <th scope="col" className="text-right">Active</th>
          </tr>
        </thead>
        <tbody>
          {list.map((c) => (
            <tr key={c.code}>
              <td>
                <span className="font-mono font-semibold">{c.code}</span>
                <span className="block text-xs text-faint">{c.description}</span>
              </td>
              <td className="text-muted">{c.type === "percent" ? `${c.value}%` : c.type === "fixed" ? formatPKR(c.value) : "Free delivery"}</td>
              <td className="text-right tabular-nums">{formatPKR(c.minSubtotal)}</td>
              <td className="text-right tabular-nums">
                {c.used ?? 0}/{c.usageLimit ?? "∞"}
              </td>
              <td className="text-muted">{c.expiresAt ? formatDate(c.expiresAt) : "—"}</td>
              <td className="text-right">
                <button
                  type="button"
                  role="switch"
                  aria-checked={c.active}
                  aria-label={`Toggle ${c.code}`}
                  onClick={() => setList((l) => l.map((x) => (x.code === c.code ? { ...x, active: !x.active } : x)))}
                  className={cn("relative inline-flex h-6 w-11 rounded-full border transition", c.active ? "border-white bg-white" : "border-line-strong bg-white/5")}
                >
                  <span className={cn("absolute top-0.5 h-4.5 w-4.5 rounded-full transition-all", c.active ? "left-[22px] bg-ink" : "left-0.5 bg-white/50")} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </DataTable>
      <Modal open={open} onClose={() => setOpen(false)} title="New coupon">
        <form
          noValidate
          className="grid gap-4 p-6 sm:grid-cols-2"
          onSubmit={(e) => {
            e.preventDefault();
            const code = v.code.trim().toUpperCase();
            const errs: Errors<CF> = {
              code: !/^[A-Z0-9]{3,20}$/.test(code) ? "3–20 letters or digits" : list.some((c) => c.code === code) ? "Code already exists" : undefined,
              value: type === "free_shipping" ? undefined : validators.positiveInt(v.value, "Value") ?? (type === "percent" && Number(v.value) > 90 ? "Max 90%" : undefined),
              minSubtotal: validators.nonNegativeInt(v.minSubtotal, "Minimum spend"),
              description: validators.required(v.description, "Description"),
            };
            setErrors(errs);
            if (hasErrors(errs)) return;
            setList((l) => [{ code, type, value: Number(v.value) || 0, minSubtotal: Number(v.minSubtotal), description: cleanText(v.description, 120), active: true, used: 0 }, ...l]);
            setOpen(false);
            setV({ code: "", value: "", minSubtotal: "0", description: "" });
            ui.toast(`Coupon ${code} created (demo)`, "success");
          }}
        >
          <TextField label="Code" value={v.code} onChange={(e) => setV({ ...v, code: e.target.value.toUpperCase() })} maxLength={20} error={errors.code} />
          <SelectField
            label="Type"
            value={type}
            onChange={(e) => setType(e.target.value as Coupon["type"])}
            options={[
              { value: "percent", label: "Percentage" },
              { value: "fixed", label: "Fixed amount (PKR)" },
              { value: "free_shipping", label: "Free delivery" },
            ]}
          />
          {type !== "free_shipping" && <TextField label={type === "percent" ? "Percent off" : "Amount off (PKR)"} inputMode="numeric" value={v.value} onChange={(e) => setV({ ...v, value: e.target.value })} maxLength={7} error={errors.value} />}
          <TextField label="Minimum spend (PKR)" inputMode="numeric" value={v.minSubtotal} onChange={(e) => setV({ ...v, minSubtotal: e.target.value })} maxLength={9} error={errors.minSubtotal} />
          <TextField label="Description" className="sm:col-span-2" value={v.description} onChange={(e) => setV({ ...v, description: e.target.value })} maxLength={120} error={errors.description} />
          <Button type="submit" className="sm:col-span-2">
            Create coupon
          </Button>
        </form>
      </Modal>
    </Panel>
  );
}

/* ---------------- Settings ---------------- */
export function SettingsForm() {
  const [v, setV] = useState({
    storeName: "RAKRAM",
    supportEmail: "support@example.com",
    supportPhone: "03001234567",
    freeThreshold: String(deliveryConfig.freeDeliveryThreshold),
    metroFee: String(deliveryConfig.zones.metro.fee),
    standardFee: String(deliveryConfig.zones.standard.fee),
    remoteFee: String(deliveryConfig.zones.remote.fee),
  });
  const [cod, setCod] = useState(true);
  const [errors, setErrors] = useState<Record<string, string | undefined>>({});
  const set = (k: keyof typeof v) => (e: React.ChangeEvent<HTMLInputElement>) => setV({ ...v, [k]: e.target.value });

  return (
    <form
      noValidate
      className="grid gap-6 xl:grid-cols-2"
      onSubmit={(e) => {
        e.preventDefault();
        const errs = {
          storeName: validators.required(v.storeName, "Store name"),
          supportEmail: validators.email(v.supportEmail),
          supportPhone: validators.phone(v.supportPhone),
          freeThreshold: validators.nonNegativeInt(v.freeThreshold, "Threshold"),
          metroFee: validators.nonNegativeInt(v.metroFee, "Fee"),
          standardFee: validators.nonNegativeInt(v.standardFee, "Fee"),
          remoteFee: validators.nonNegativeInt(v.remoteFee, "Fee"),
        };
        setErrors(errs);
        if (Object.values(errs).some(Boolean)) return;
        ui.toast("Settings validated — not saved (demo)", "success");
      }}
    >
      <Panel title="Store">
        <div className="grid gap-4">
          <TextField label="Store name" value={v.storeName} onChange={set("storeName")} maxLength={40} error={errors.storeName} />
          <TextField label="Support email" type="email" value={v.supportEmail} onChange={set("supportEmail")} maxLength={320} error={errors.supportEmail} />
          <TextField label="Support mobile" type="tel" value={v.supportPhone} onChange={set("supportPhone")} maxLength={16} error={errors.supportPhone} />
          <TextField label="Currency" value="Pakistani Rupee (PKR)" disabled readOnly />
          <TextField label="Default language" value="English (Urdu planned)" disabled readOnly />
        </div>
      </Panel>
      <Panel title="Delivery & payments">
        <div className="grid gap-4 sm:grid-cols-2">
          <TextField label="Free delivery over (PKR)" inputMode="numeric" value={v.freeThreshold} onChange={set("freeThreshold")} maxLength={7} error={errors.freeThreshold} className="sm:col-span-2" />
          <TextField label="Metro fee (PKR)" inputMode="numeric" value={v.metroFee} onChange={set("metroFee")} maxLength={5} error={errors.metroFee} />
          <TextField label="Standard fee (PKR)" inputMode="numeric" value={v.standardFee} onChange={set("standardFee")} maxLength={5} error={errors.standardFee} />
          <TextField label="Extended-area fee (PKR)" inputMode="numeric" value={v.remoteFee} onChange={set("remoteFee")} maxLength={5} error={errors.remoteFee} />
          <label className="flex items-center justify-between gap-3 rounded-2xl border border-line p-4 text-sm sm:col-span-2">
            Cash on Delivery
            <input type="checkbox" checked={cod} onChange={(e) => setCod(e.target.checked)} className="h-5 w-5 accent-white" />
          </label>
        </div>
      </Panel>
      <Panel title="Integrations (Phase 2)" className="xl:col-span-2">
        <ul className="grid gap-3 text-sm sm:grid-cols-2 lg:grid-cols-4">
          {["Courier API", "Easypaisa", "JazzCash", "Email / SMS"].map((i) => (
            <li key={i} className="flex items-center justify-between rounded-2xl border border-dashed border-line p-4">
              {i} <span className="flex items-center gap-1 text-xs text-faint"><X className="h-3 w-3" /> Not connected</span>
            </li>
          ))}
        </ul>
        <p className="mt-4 text-xs text-faint">API keys for these services must be stored as server-side environment variables, never in the browser.</p>
      </Panel>
      <div className="xl:col-span-2">
        <Button type="submit">Save settings</Button>
      </div>
    </form>
  );
}
