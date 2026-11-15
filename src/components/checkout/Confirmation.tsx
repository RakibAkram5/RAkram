"use client";

import { motion } from "motion/react";
import { Check, ShoppingBag } from "lucide-react";
import { paymentMethods } from "@/data/pakistan";
import { formatPKR } from "@/lib/format";
import { useLastOrder } from "@/store/ui";
import { ButtonLink } from "@/components/ui/Button";
import { DemoNotice, EmptyState } from "@/components/ui/bits";
import { ProductImage } from "@/components/ui/ProductImage";

export function Confirmation() {
  const order = useLastOrder();
  if (!order) {
    return (
      <>
        <h1 className="sr-only">Order confirmation</h1>
        <EmptyState
        icon={<ShoppingBag className="h-6 w-6" />}
        title="No recent demo order"
        body="Demo order summaries are kept in memory only, so they disappear when you refresh. Place a demo order from checkout to see one here."
        action={<ButtonLink href="/shop">Continue shopping</ButtonLink>}
        />
      </>
    );
  }
  const pay = paymentMethods.find((m) => m.id === order.paymentMethod)?.name;
  return (
    <div className="mx-auto max-w-3xl">
      <div className="text-center">
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", bounce: 0.4, duration: 0.8 }}
          className="btn-chrome mx-auto flex h-16 w-16 items-center justify-center rounded-full"
        >
          <Check className="h-7 w-7" />
        </motion.div>
        <p className="eyebrow mt-6">Demo order {order.number}</p>
        <h1 className="mt-3 font-display text-5xl">Thank you, {order.customerName.split(" ")[0]}.</h1>
        <p className="mx-auto mt-4 max-w-lg text-muted">This is how your confirmation will look once RAKRAM is live.</p>
      </div>

      <DemoNotice className="mt-8">
        <strong>No order was placed.</strong> Nothing was charged, no confirmation was sent and no courier was booked. This summary exists only in this browser tab
        and is cleared when you refresh.
      </DemoNotice>

      <div className="glass edge mt-8 grid gap-8 rounded-3xl p-6 sm:grid-cols-2 sm:p-8">
        <div>
          <h2 className="eyebrow mb-3">Deliver to</h2>
          <address className="text-sm leading-relaxed text-muted not-italic">
            <span className="text-fg">{order.address.fullName}</span>
            <br />
            {order.address.house}, {order.address.street}
            <br />
            {order.address.area}, {order.address.city}
            <br />
            {order.address.province} {order.address.postalCode}
            <br />
            {order.phone}
          </address>
        </div>
        <div>
          <h2 className="eyebrow mb-3">Payment</h2>
          <p className="text-sm text-muted">{pay}</p>
          <h2 className="eyebrow mt-6 mb-3">Status</h2>
          <p className="text-sm text-muted">Not submitted (demo)</p>
        </div>
        <ul className="space-y-4 border-t border-line pt-6 sm:col-span-2">
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
        <dl className="space-y-2 border-t border-line pt-6 text-sm sm:col-span-2">
          <div className="flex justify-between">
            <dt className="text-muted">Subtotal</dt>
            <dd>{formatPKR(order.subtotal)}</dd>
          </div>
          {order.discount > 0 && (
            <div className="flex justify-between text-success">
              <dt>Discount</dt>
              <dd>−{formatPKR(order.discount)}</dd>
            </div>
          )}
          <div className="flex justify-between">
            <dt className="text-muted">Delivery</dt>
            <dd>{order.deliveryFee === 0 ? "Free" : formatPKR(order.deliveryFee)}</dd>
          </div>
          <div className="flex justify-between border-t border-line pt-3 text-base font-semibold">
            <dt>Total</dt>
            <dd>{formatPKR(order.total)}</dd>
          </div>
        </dl>
      </div>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <ButtonLink href="/shop">Continue shopping</ButtonLink>
        <ButtonLink href="/account/orders" variant="outline">
          View sample orders
        </ButtonLink>
      </div>
    </div>
  );
}
