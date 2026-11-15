"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useRef, useState } from "react";
import { Banknote, Clock, Landmark, Lock, MapPin, ShoppingBag, Smartphone, Wallet } from "lucide-react";
import { paymentMethods, provinces } from "@/data/pakistan";
import { cn, formatPKR } from "@/lib/format";
import { computeTotals, estimateWindow, priceLines } from "@/lib/pricing";
import { cleanText, hasErrors, normalisePhone, validators, type Errors } from "@/lib/validation";
import type { Order, PaymentMethod } from "@/lib/types";
import { cart, useCart } from "@/store/shop";
import { lastOrderStore } from "@/store/ui";
import { useHydrated } from "@/store/create-store";
import { SelectField, TextArea, TextField } from "@/components/ui/Field";
import { Button, ButtonLink } from "@/components/ui/Button";
import { DemoNotice, EmptyState, Skeleton } from "@/components/ui/bits";
import { ProductImage } from "@/components/ui/ProductImage";
import { CouponForm, SummaryRows } from "./CartView";

type FieldName = "fullName" | "phone" | "email" | "house" | "street" | "area" | "city" | "province" | "postalCode" | "instructions";

const empty: Record<FieldName, string> = {
  fullName: "",
  phone: "",
  email: "",
  house: "",
  street: "",
  area: "",
  city: "",
  province: "",
  postalCode: "",
  instructions: "",
};

const payIcons: Record<PaymentMethod, typeof Banknote> = {
  cod: Banknote,
  bank_transfer: Landmark,
  easypaisa: Smartphone,
  jazzcash: Wallet,
};

/** Event-time only: random demo reference (not an order id). */
function demoOrderNumber() {
  const n = crypto.getRandomValues(new Uint32Array(1))[0] % 900000;
  return `DEMO-${100000 + n}`;
}

function validate(v: Record<FieldName, string>): Errors<FieldName> {
  return {
    fullName: validators.name(v.fullName),
    phone: validators.phone(v.phone),
    email: validators.email(v.email),
    house: validators.required(v.house, "House / building") ?? validators.maxLen(v.house, 80, "House / building"),
    street: validators.required(v.street, "Street address") ?? validators.maxLen(v.street, 120, "Street address"),
    area: validators.required(v.area, "Area") ?? validators.maxLen(v.area, 80, "Area"),
    province: v.province ? undefined : "Select your province",
    city: v.city ? undefined : "Select your city",
    postalCode: validators.postal(v.postalCode),
    instructions: validators.maxLen(v.instructions, 300, "Delivery instructions"),
  };
}

export function CheckoutForm() {
  const router = useRouter();
  const hydrated = useHydrated();
  const { lines, coupon } = useCart();
  const [values, setValues] = useState(empty);
  const [touched, setTouched] = useState<Partial<Record<FieldName, boolean>>>({});
  const [submitted, setSubmitted] = useState(false);
  const [payment, setPayment] = useState<PaymentMethod>("cod");
  const [placing, setPlacing] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  const priced = priceLines(lines);
  const totals = computeTotals(priced, coupon, { province: values.province, city: values.city });
  const errors = useMemo(() => validate(values), [values]);
  const cities = provinces.find((p) => p.name === values.province)?.cities ?? [];
  const show = (f: FieldName) => (submitted || touched[f] ? errors[f] : undefined);

  const set = (f: FieldName) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const value = e.target.value;
    setValues((v) => ({ ...v, [f]: value, ...(f === "province" ? { city: "" } : {}) }));
  };
  const blur = (f: FieldName) => () => setTouched((t) => ({ ...t, [f]: true }));
  const bind = (f: FieldName) => ({ name: f, value: values[f], onChange: set(f), onBlur: blur(f), error: show(f) });

  if (!hydrated) {
    return (
      <div className="grid gap-10 lg:grid-cols-12">
        <Skeleton className="h-[640px] rounded-3xl lg:col-span-7" />
        <Skeleton className="h-96 rounded-3xl lg:col-span-5" />
      </div>
    );
  }

  if (!priced.length) {
    return (
      <EmptyState
        icon={<ShoppingBag className="h-6 w-6" />}
        title="Nothing to check out"
        body="Your bag is empty. Add a few pieces and come back here to complete your (demo) order."
        action={<ButtonLink href="/shop">Continue shopping</ButtonLink>}
      />
    );
  }

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    if (hasErrors(errors)) {
      const first = Object.keys(errors).find((k) => errors[k as FieldName]);
      formRef.current?.querySelector<HTMLElement>(`[name="${first}"]`)?.focus();
      return;
    }
    setPlacing(true);
    // DEMO ONLY: nothing is sent anywhere. Phase 2 posts to orderService.placeOrder().
    const now = new Date().toISOString();
    const order: Order = {
      id: "demo",
      number: demoOrderNumber(),
      createdAt: now,
      status: "pending",
      customerName: cleanText(values.fullName, 80),
      customerEmail: cleanText(values.email, 320),
      phone: normalisePhone(values.phone),
      address: {
        fullName: cleanText(values.fullName, 80),
        phone: normalisePhone(values.phone),
        house: cleanText(values.house, 80),
        street: cleanText(values.street, 120),
        area: cleanText(values.area, 80),
        city: values.city,
        province: values.province,
        postalCode: values.postalCode.trim(),
        instructions: cleanText(values.instructions, 300) || undefined,
      },
      lines: priced.map((l) => ({ productId: l.productId, name: l.product.name, image: l.product.images[0], price: l.unitPrice, quantity: l.quantity, color: l.color, size: l.size })),
      subtotal: totals.subtotal,
      discount: totals.discount,
      deliveryFee: totals.deliveryFee,
      total: totals.total,
      paymentMethod: payment,
      paymentStatus: "unpaid",
      timeline: [{ status: "pending", at: now }],
    };
    lastOrderStore.set(order); // memory only — never persisted
    setTimeout(() => {
      cart.clear();
      router.push("/checkout/confirmation");
    }, 700);
  };

  return (
    <form ref={formRef} noValidate onSubmit={onSubmit} className="grid gap-10 lg:grid-cols-12">
      <div className="space-y-8 lg:col-span-7">
        <DemoNotice>
          This checkout is a working demonstration of the order flow. <strong>No order is created, nothing is charged</strong>, and the details you enter stay in
          this browser tab only — they are not stored or sent anywhere.
        </DemoNotice>

        <fieldset className="glass edge rounded-3xl p-5 sm:p-7">
          <legend className="sr-only">Contact information</legend>
          <h2 className="mb-6 flex items-center gap-3 font-display text-2xl">
            <span className="btn-chrome flex h-7 w-7 items-center justify-center rounded-full font-sans text-xs font-bold">1</span> Contact
          </h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <TextField label="Full name" required autoComplete="name" maxLength={80} className="sm:col-span-2" {...bind("fullName")} />
            <TextField label="Mobile number" required type="tel" inputMode="tel" autoComplete="tel" placeholder="0300 1234567" maxLength={16} hint="We’ll call to confirm COD orders" {...bind("phone")} />
            <TextField label="Email" required type="email" inputMode="email" autoComplete="email" maxLength={320} placeholder="you@example.com" {...bind("email")} />
          </div>
        </fieldset>

        <fieldset className="glass edge rounded-3xl p-5 sm:p-7">
          <legend className="sr-only">Delivery address</legend>
          <h2 className="mb-6 flex items-center gap-3 font-display text-2xl">
            <span className="btn-chrome flex h-7 w-7 items-center justify-center rounded-full font-sans text-xs font-bold">2</span> Delivery address
          </h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <TextField label="House / building" required autoComplete="address-line1" maxLength={80} placeholder="House 24, Block C" {...bind("house")} />
            <TextField label="Street address" required autoComplete="address-line2" maxLength={120} placeholder="Street 7" {...bind("street")} />
            <TextField label="Area / locality" required maxLength={80} placeholder="e.g. Gulberg III, DHA Phase 6" className="sm:col-span-2" {...bind("area")} />
            <SelectField label="Province / territory" required autoComplete="address-level1" placeholder="Select province" options={provinces.map((p) => ({ value: p.name, label: p.name }))} {...bind("province")} />
            <SelectField
              label="City"
              required
              autoComplete="address-level2"
              disabled={!values.province}
              placeholder={values.province ? "Select city" : "Select province first"}
              options={cities.map((c) => ({ value: c, label: c }))}
              {...bind("city")}
            />
            <TextField label="Postal code" required inputMode="numeric" autoComplete="postal-code" maxLength={5} placeholder="54000" {...bind("postalCode")} />
            <TextArea label="Delivery instructions" maxLength={300} rows={3} placeholder="Landmark, preferred time, gate code…" hint={`${values.instructions.length}/300 · optional`} className="sm:col-span-2" {...bind("instructions")} />
          </div>

          <div className={cn("mt-6 flex items-start gap-4 rounded-2xl border p-4 transition", totals.zone ? "border-line-strong bg-white/[0.03]" : "border-dashed border-line")} aria-live="polite">
            <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-silver" aria-hidden />
            {totals.zone ? (
              <div className="text-sm">
                <p className="font-semibold">
                  {totals.zone.label} to {values.city} — {totals.deliveryFee === 0 ? <span className="text-success">Free</span> : formatPKR(totals.deliveryFee)}
                </p>
                <p className="mt-1 flex items-center gap-1.5 text-muted">
                  <Clock className="h-3.5 w-3.5" aria-hidden /> Estimated arrival {estimateWindow(totals.zone)}
                </p>
                <p className="mt-1 text-xs text-faint">Demo estimate. Courier integration will provide live rates and timelines.</p>
              </div>
            ) : (
              <p className="text-sm text-muted">Select your province and city to see delivery fees and estimated arrival.</p>
            )}
          </div>
        </fieldset>

        <fieldset className="glass edge rounded-3xl p-5 sm:p-7">
          <legend className="sr-only">Payment method</legend>
          <h2 className="mb-6 flex items-center gap-3 font-display text-2xl">
            <span className="btn-chrome flex h-7 w-7 items-center justify-center rounded-full font-sans text-xs font-bold">3</span> Payment
          </h2>
          <div className="grid gap-3 sm:grid-cols-2" role="radiogroup" aria-label="Payment method">
            {paymentMethods.map((m) => {
              const Icon = payIcons[m.id];
              const on = payment === m.id;
              return (
                <label key={m.id} className={cn("flex cursor-pointer items-start gap-3 rounded-2xl border p-4 transition", on ? "border-silver bg-white/[0.06]" : "border-line hover:border-line-strong")}>
                  <input type="radio" name="payment" value={m.id} checked={on} onChange={() => setPayment(m.id)} className="peer sr-only" />
                  <span className={cn("mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full border peer-focus-visible:ring-2 peer-focus-visible:ring-white", on ? "border-white" : "border-line-strong")} aria-hidden>
                    {on && <span className="h-2 w-2 rounded-full bg-white" />}
                  </span>
                  <span className="min-w-0">
                    <span className="flex items-center gap-2 text-sm font-semibold">
                      <Icon className="h-4 w-4 text-silver" aria-hidden /> {m.name}
                    </span>
                    <span className="mt-1 block text-xs text-muted">{m.description}</span>
                  </span>
                </label>
              );
            })}
          </div>
          <p className="mt-4 text-xs text-faint">
            {payment === "cod" && "Keep the exact amount ready. Our rider will confirm your order by phone before dispatch."}
            {payment === "bank_transfer" && "Bank details will be shared after order confirmation (Phase 2). Orders are held for 24 hours pending transfer."}
            {(payment === "easypaisa" || payment === "jazzcash") &&
              "In Phase 2 you’ll be securely redirected to the provider to approve payment. RAKRAM never asks for your PIN or OTP."}
          </p>
        </fieldset>
      </div>

      <aside className="lg:col-span-5" aria-label="Order summary">
        <div className="glass edge space-y-6 rounded-3xl p-6 lg:sticky lg:top-24">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-2xl">Your order</h2>
            <Link href="/cart" className="text-xs text-muted underline underline-offset-4 hover:text-fg">
              Edit bag
            </Link>
          </div>
          <ul className="max-h-72 space-y-4 overflow-y-auto pr-1">
            {priced.map((l) => (
              <li key={l.key} className="flex items-center gap-3">
                <span className="relative h-16 w-13 shrink-0 overflow-hidden rounded-xl bg-ink-3">
                  <ProductImage image={l.product.images[0]} sizes="52px" />
                  <span className="btn-chrome absolute top-1 right-1 flex h-5 min-w-5 items-center justify-center rounded-full px-1 text-[10px] font-bold">{l.quantity}</span>
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-sm">{l.product.name}</span>
                  <span className="block text-xs text-faint">{[l.color, l.size].filter(Boolean).join(" · ")}</span>
                </span>
                <span className="text-sm">{formatPKR(l.lineTotal)}</span>
              </li>
            ))}
          </ul>
          <CouponForm subtotal={totals.subtotal} applied={coupon} />
          <SummaryRows totals={totals} deliveryKnown={!!totals.zone} />
          <Button type="submit" size="lg" className="w-full" disabled={placing}>
            <Lock className="h-4 w-4" /> {placing ? "Placing demo order…" : `Place demo order · ${formatPKR(totals.total)}`}
          </Button>
          {submitted && hasErrors(errors) && (
            <p role="alert" className="text-center text-xs text-danger">
              Please fix the highlighted fields above.
            </p>
          )}
          <p className="text-center text-[11px] text-faint">No real order or payment will be processed.</p>
        </div>
      </aside>
    </form>
  );
}
