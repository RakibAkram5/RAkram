"use client";

import Link from "next/link";
import { useState } from "react";
import { ChevronRight, MapPin, Package, Pencil, Plus, Search, Trash } from "lucide-react";
import type { Address, Order } from "@/lib/types";
import { demoCustomer } from "@/data/mock-orders";
import { provinces } from "@/data/pakistan";
import { formatDate, formatPKR } from "@/lib/format";
import { cleanText, hasErrors, normalisePhone, validators, type Errors } from "@/lib/validation";
import { ui } from "@/store/ui";
import { ProductImage } from "@/components/ui/ProductImage";
import { Button, ButtonLink } from "@/components/ui/Button";
import { SelectField, TextField } from "@/components/ui/Field";
import { DemoNotice, EmptyState } from "@/components/ui/bits";
import { Modal } from "@/components/ui/Overlay";
import { OrderTimeline, StatusPill } from "./OrderBits";

/* ---------------- Profile ---------------- */
export function ProfileCard() {
  const [editing, setEditing] = useState(false);
  const [profile, setProfile] = useState({ name: demoCustomer.name, email: demoCustomer.email, phone: demoCustomer.phone });
  const [draft, setDraft] = useState(profile);
  const [errors, setErrors] = useState<Errors<"name" | "email" | "phone">>({});

  return (
    <div className="glass edge rounded-3xl p-6">
      <div className="flex items-center justify-between">
        <h2 className="font-display text-2xl">Profile</h2>
        {!editing && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              setDraft(profile);
              setEditing(true);
            }}
          >
            <Pencil className="h-3.5 w-3.5" /> Edit
          </Button>
        )}
      </div>
      {editing ? (
        <form
          noValidate
          className="mt-5 grid gap-4 sm:grid-cols-2"
          onSubmit={(e) => {
            e.preventDefault();
            const errs = { name: validators.name(draft.name), email: validators.email(draft.email), phone: validators.phone(draft.phone) };
            setErrors(errs);
            if (hasErrors(errs)) return;
            setProfile({ name: cleanText(draft.name, 80), email: cleanText(draft.email, 320), phone: normalisePhone(draft.phone) });
            setEditing(false);
            ui.toast("Profile updated (demo — not saved)", "success");
          }}
        >
          <TextField label="Full name" value={draft.name} onChange={(e) => setDraft({ ...draft, name: e.target.value })} error={errors.name} maxLength={80} className="sm:col-span-2" />
          <TextField label="Email" type="email" value={draft.email} onChange={(e) => setDraft({ ...draft, email: e.target.value })} error={errors.email} maxLength={320} />
          <TextField label="Mobile" type="tel" value={draft.phone} onChange={(e) => setDraft({ ...draft, phone: e.target.value })} error={errors.phone} maxLength={16} />
          <div className="flex gap-2 sm:col-span-2">
            <Button type="submit">Save</Button>
            <Button variant="ghost" onClick={() => setEditing(false)}>
              Cancel
            </Button>
          </div>
        </form>
      ) : (
        <dl className="mt-5 grid gap-5 text-sm sm:grid-cols-2">
          {[
            ["Name", profile.name],
            ["Email", profile.email],
            ["Mobile", profile.phone],
            ["Member since", formatDate(demoCustomer.memberSince)],
          ].map(([k, v]) => (
            <div key={k}>
              <dt className="text-xs text-faint">{k}</dt>
              <dd className="mt-1">{v}</dd>
            </div>
          ))}
        </dl>
      )}
    </div>
  );
}

/* ---------------- Orders list ---------------- */
export function OrdersList({ orders, compact = false }: { orders: Order[]; compact?: boolean }) {
  if (!orders.length) return <EmptyState icon={<Package className="h-6 w-6" />} title="No orders yet" body="When you place an order, it will appear here." action={<ButtonLink href="/shop">Start shopping</ButtonLink>} />;
  return (
    <ul className="space-y-3">
      {orders.map((o) => (
        <li key={o.id}>
          <Link href={`/account/orders/${o.id}`} className="glass edge group flex flex-col gap-4 rounded-3xl p-5 transition hover:bg-white/[0.06] sm:flex-row sm:items-center">
            <div className="flex -space-x-3">
              {o.lines.slice(0, 3).map((l, i) => (
                <span key={i} className="relative h-14 w-12 overflow-hidden rounded-xl border-2 border-ink bg-ink-3">
                  <ProductImage image={l.image} sizes="48px" />
                </span>
              ))}
            </div>
            <div className="min-w-0 flex-1">
              <p className="font-semibold">{o.number}</p>
              <p className="text-xs text-faint">
                {formatDate(o.createdAt)} · {o.lines.reduce((s, l) => s + l.quantity, 0)} items
              </p>
            </div>
            <div className="flex items-center justify-between gap-4 sm:justify-end">
              <StatusPill status={o.status} />
              <span className="font-semibold">{formatPKR(o.total)}</span>
              {!compact && <ChevronRight className="h-4 w-4 text-faint transition group-hover:translate-x-0.5 group-hover:text-fg" />}
            </div>
          </Link>
        </li>
      ))}
    </ul>
  );
}

/* ---------------- Order detail ---------------- */
export function OrderDetail({ order }: { order: Order }) {
  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="eyebrow">Order</p>
          <h1 className="mt-2 font-display text-4xl">{order.number}</h1>
          <p className="mt-1 text-sm text-faint">Placed {formatDate(order.createdAt, { hour: "numeric", minute: "2-digit" })}</p>
        </div>
        <StatusPill status={order.status} />
      </div>
      <div className="glass edge rounded-3xl p-6">
        <h2 className="mb-6 text-sm font-semibold tracking-wide">Tracking</h2>
        <OrderTimeline order={order} />
        <p className="mt-6 text-xs text-faint">Sample timeline. Live courier tracking will be connected in Phase 2.</p>
      </div>
      <div className="grid gap-6 md:grid-cols-2">
        <div className="glass edge rounded-3xl p-6">
          <h2 className="mb-4 text-sm font-semibold tracking-wide">Items</h2>
          <ul className="space-y-4">
            {order.lines.map((l, i) => (
              <li key={i} className="flex items-center gap-4">
                <span className="relative h-16 w-13 shrink-0 overflow-hidden rounded-xl bg-ink-3">
                  <ProductImage image={l.image} sizes="52px" />
                </span>
                <span className="min-w-0 flex-1 text-sm">
                  {l.name} <span className="text-faint">× {l.quantity}</span>
                  <span className="block text-xs text-faint">{[l.color, l.size].filter(Boolean).join(" · ")}</span>
                </span>
                <span className="text-sm">{formatPKR(l.price * l.quantity)}</span>
              </li>
            ))}
          </ul>
          <dl className="mt-6 space-y-2 border-t border-line pt-4 text-sm">
            <div className="flex justify-between"><dt className="text-muted">Subtotal</dt><dd>{formatPKR(order.subtotal)}</dd></div>
            {order.discount > 0 && <div className="flex justify-between text-success"><dt>Discount</dt><dd>−{formatPKR(order.discount)}</dd></div>}
            <div className="flex justify-between"><dt className="text-muted">Delivery</dt><dd>{order.deliveryFee ? formatPKR(order.deliveryFee) : "Free"}</dd></div>
            <div className="flex justify-between border-t border-line pt-2 font-semibold"><dt>Total</dt><dd>{formatPKR(order.total)}</dd></div>
          </dl>
        </div>
        <div className="glass edge space-y-6 rounded-3xl p-6 text-sm">
          <div>
            <h2 className="mb-3 text-sm font-semibold tracking-wide">Delivery address</h2>
            <address className="leading-relaxed text-muted not-italic">
              {order.address.fullName}<br />
              {order.address.house}, {order.address.street}<br />
              {order.address.area}, {order.address.city}<br />
              {order.address.province} {order.address.postalCode}
            </address>
          </div>
          <div>
            <h2 className="mb-3 text-sm font-semibold tracking-wide">Payment</h2>
            <p className="text-muted capitalize">{order.paymentMethod.replace("_", " ")} · {order.paymentStatus}</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <ButtonLink href="/help" variant="outline" size="sm">Get help</ButtonLink>
            <ButtonLink href="/account/orders" variant="ghost" size="sm">All orders</ButtonLink>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ---------------- Track order (public) ---------------- */
export function TrackOrder({ lookup }: { lookup: Record<string, Order> }) {
  const [num, setNum] = useState("");
  const [phone, setPhone] = useState("");
  const [result, setResult] = useState<Order | null | undefined>(undefined);
  const [errors, setErrors] = useState<Errors<"num" | "phone">>({});
  return (
    <div className="mx-auto max-w-3xl space-y-8">
      <form
        noValidate
        className="glass-strong edge grid gap-4 rounded-3xl p-6 sm:grid-cols-[1fr_1fr_auto] sm:items-end sm:p-8"
        onSubmit={(e) => {
          e.preventDefault();
          const n = num.trim().toUpperCase();
          const errs = { num: /^RK-\d{4,6}$/.test(n) ? undefined : "Enter an order number like RK-20481", phone: validators.phone(phone) };
          setErrors(errs);
          if (hasErrors(errs)) return;
          setResult(lookup[n] ?? null);
        }}
      >
        <TextField label="Order number" placeholder="RK-20481" value={num} onChange={(e) => setNum(e.target.value)} maxLength={10} error={errors.num} autoComplete="off" />
        <TextField label="Mobile number" type="tel" placeholder="0300 1234567" value={phone} onChange={(e) => setPhone(e.target.value)} maxLength={16} error={errors.phone} />
        <Button type="submit" size="lg" className="sm:mb-[1px]">
          <Search className="h-4 w-4" /> Track
        </Button>
      </form>
      <DemoNotice>
        Tracking shows sample orders only (try <strong>RK-20481</strong> to <strong>RK-20477</strong> with any valid mobile number). No real courier data is
        queried. In Phase 2 the mobile number will be verified against the order on the server.
      </DemoNotice>
      {result === null && (
        <EmptyState icon={<Package className="h-6 w-6" />} title="Order not found" body="We couldn’t find a sample order with that number. Check the number and try again." />
      )}
      {result && (
        <div className="glass edge rounded-3xl p-6 sm:p-8">
          <div className="mb-8 flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="eyebrow">Order {result.number}</p>
              <p className="mt-1 text-sm text-muted">To {result.address.city}, {result.address.province}</p>
            </div>
            <StatusPill status={result.status} />
          </div>
          <OrderTimeline order={result} />
        </div>
      )}
    </div>
  );
}

/* ---------------- Addresses ---------------- */
const seedAddresses: Address[] = [
  { id: "a1", label: "Home", fullName: "Ayesha Khan", phone: "03001234567", house: "House 24, Block C", street: "Street 7", area: "Gulberg III", city: "Lahore", province: "Punjab", postalCode: "54660" },
  { id: "a2", label: "Office", fullName: "Ayesha Khan", phone: "03001234567", house: "Floor 5, Arfa Tower", street: "Ferozepur Road", area: "Model Town Link", city: "Lahore", province: "Punjab", postalCode: "54700" },
];

type AddrField = "label" | "fullName" | "phone" | "house" | "street" | "area" | "province" | "city" | "postalCode";

export function AddressBook() {
  const [list, setList] = useState(seedAddresses);
  const [open, setOpen] = useState(false);
  const blank: Record<AddrField, string> = { label: "", fullName: "", phone: "", house: "", street: "", area: "", province: "", city: "", postalCode: "" };
  const [v, setV] = useState(blank);
  const [errors, setErrors] = useState<Errors<AddrField>>({});
  const cities = provinces.find((p) => p.name === v.province)?.cities ?? [];
  const bind = (f: AddrField) => ({
    value: v[f],
    error: errors[f],
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => setV((s) => ({ ...s, [f]: e.target.value, ...(f === "province" ? { city: "" } : {}) })),
  });

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="font-display text-4xl">Addresses</h1>
        <Button size="sm" onClick={() => { setV(blank); setErrors({}); setOpen(true); }}>
          <Plus className="h-3.5 w-3.5" /> Add address
        </Button>
      </div>
      <ul className="grid gap-4 md:grid-cols-2">
        {list.map((a, i) => (
          <li key={a.id} className="glass edge rounded-3xl p-6">
            <div className="flex items-start justify-between gap-3">
              <p className="flex items-center gap-2 font-semibold">
                <MapPin className="h-4 w-4 text-silver" aria-hidden /> {a.label}
                {i === 0 && <span className="rounded-full bg-white/10 px-2 py-0.5 text-[10px] tracking-wider text-silver uppercase">Default</span>}
              </p>
              <button type="button" aria-label={`Delete ${a.label} address`} onClick={() => setList((l) => l.filter((x) => x.id !== a.id))} className="flex h-8 w-8 items-center justify-center rounded-full text-faint hover:text-fg">
                <Trash className="h-4 w-4" />
              </button>
            </div>
            <address className="mt-3 text-sm leading-relaxed text-muted not-italic">
              {a.fullName} · {a.phone}<br />
              {a.house}, {a.street}<br />
              {a.area}, {a.city}<br />
              {a.province} {a.postalCode}
            </address>
          </li>
        ))}
      </ul>
      <p className="mt-6 text-xs text-faint">Demo: changes are kept in memory only and reset when you leave the page.</p>

      <Modal open={open} onClose={() => setOpen(false)} title="Add address" className="sm:max-w-xl">
        <form
          noValidate
          className="grid gap-4 p-6 sm:grid-cols-2"
          onSubmit={(e) => {
            e.preventDefault();
            const errs: Errors<AddrField> = {
              label: validators.required(v.label, "Label"),
              fullName: validators.name(v.fullName),
              phone: validators.phone(v.phone),
              house: validators.required(v.house, "House / building"),
              street: validators.required(v.street, "Street"),
              area: validators.required(v.area, "Area"),
              province: v.province ? undefined : "Select a province",
              city: v.city ? undefined : "Select a city",
              postalCode: validators.postal(v.postalCode),
            };
            setErrors(errs);
            if (hasErrors(errs)) return;
            setList((l) => [...l, { id: `a${Date.now()}`, ...Object.fromEntries(Object.entries(v).map(([k, x]) => [k, cleanText(x, 120)])), phone: normalisePhone(v.phone) } as Address]);
            setOpen(false);
            ui.toast("Address added (demo)", "success");
          }}
        >
          <TextField label="Label" placeholder="Home, Office…" maxLength={30} {...bind("label")} />
          <TextField label="Full name" maxLength={80} {...bind("fullName")} />
          <TextField label="Mobile" type="tel" maxLength={16} {...bind("phone")} />
          <TextField label="House / building" maxLength={80} {...bind("house")} />
          <TextField label="Street" maxLength={120} {...bind("street")} />
          <TextField label="Area" maxLength={80} {...bind("area")} />
          <SelectField label="Province" placeholder="Select province" options={provinces.map((p) => ({ value: p.name, label: p.name }))} {...bind("province")} />
          <SelectField label="City" placeholder="Select city" disabled={!v.province} options={cities.map((c) => ({ value: c, label: c }))} {...bind("city")} />
          <TextField label="Postal code" inputMode="numeric" maxLength={5} {...bind("postalCode")} />
          <div className="flex items-end">
            <Button type="submit" className="w-full">Save address</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
