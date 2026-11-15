import type { Customer, Order, OrderStatus, PaymentMethod } from "@/lib/types";
import { products } from "./products";
import { zoneFor, deliveryConfig } from "./pakistan";

/**
 * DEMO orders & customers for the customer portal and admin dashboard.
 * Generated deterministically so server and client render identical data.
 * None of these are real people or real orders.
 */

function rng(seed: number) {
  let s = seed;
  return () => {
    s = (s * 1664525 + 1013904223) % 4294967296;
    return s / 4294967296;
  };
}

const firstNames = ["Ayesha", "Hamza", "Sana", "Bilal", "Mahnoor", "Usman", "Zainab", "Ali", "Fatima", "Omar", "Hira", "Saad", "Iqra", "Danish", "Maryam", "Fahad", "Areeba", "Taimoor", "Noor", "Shahzaib"];
const lastNames = ["Khan", "Raza", "Malik", "Ahmed", "Siddiqui", "Tariq", "Hussain", "Qureshi", "Butt", "Chaudhry", "Shah", "Abbasi"];
const places: Array<[string, string, string]> = [
  ["Lahore", "Punjab", "54000"], ["Karachi", "Sindh", "75500"], ["Islamabad", "Islamabad Capital Territory", "44000"],
  ["Rawalpindi", "Punjab", "46000"], ["Faisalabad", "Punjab", "38000"], ["Multan", "Punjab", "60000"],
  ["Peshawar", "Khyber Pakhtunkhwa", "25000"], ["Quetta", "Balochistan", "87300"], ["Hyderabad", "Sindh", "71000"],
  ["Sialkot", "Punjab", "51310"], ["Gilgit", "Gilgit-Baltistan", "15100"], ["Muzaffarabad", "Azad Jammu & Kashmir", "13100"],
];
const areas = ["DHA Phase 5", "Gulberg III", "F-7/2", "Clifton Block 4", "Bahria Town", "Model Town", "Satellite Town", "Johar Town", "Hayatabad", "Cantt"];
const statuses: OrderStatus[] = ["pending", "confirmed", "packed", "shipped", "out_for_delivery", "delivered", "delivered", "delivered", "cancelled"];
const pay: PaymentMethod[] = ["cod", "cod", "cod", "bank_transfer", "easypaisa", "jazzcash"];
const flow: OrderStatus[] = ["pending", "confirmed", "packed", "shipped", "out_for_delivery", "delivered"];

const REF = Date.UTC(2026, 10, 14, 9, 0, 0); // fixed reference date for determinism

function buildCustomers(): Customer[] {
  const r = rng(7);
  return Array.from({ length: 24 }, (_, i) => {
    const fn = firstNames[i % firstNames.length];
    const ln = lastNames[Math.floor(r() * lastNames.length)];
    const [city] = places[Math.floor(r() * places.length)];
    return {
      id: `c${100 + i}`,
      name: `${fn} ${ln}`,
      email: `${fn}.${ln}${i}@example.com`.toLowerCase(),
      phone: `03${Math.floor(r() * 5)}${String(Math.floor(r() * 1e8)).padStart(8, "0")}`,
      city,
      orders: 0,
      totalSpent: 0,
      joinedAt: new Date(REF - Math.floor(r() * 400) * 864e5).toISOString(),
      status: r() > 0.95 ? "blocked" : "active",
    };
  });
}

function buildOrders(customers: Customer[]): Order[] {
  const r = rng(42);
  const orders: Order[] = [];
  for (let i = 0; i < 64; i++) {
    const customer = customers[Math.floor(r() * customers.length)];
    const place = places.find((p) => p[0] === customer.city) ?? places[0];
    const lineCount = 1 + Math.floor(r() * 3);
    const lines = Array.from({ length: lineCount }, () => {
      const p = products[Math.floor(r() * products.length)];
      return {
        productId: p.id,
        name: p.name,
        image: p.images[0],
        price: p.price,
        quantity: 1 + Math.floor(r() * 2),
        color: p.variants?.colors?.[0]?.name,
        size: p.variants?.sizes?.[Math.floor(r() * (p.variants?.sizes?.length ?? 1))],
      };
    });
    const subtotal = lines.reduce((s, l) => s + l.price * l.quantity, 0);
    const zone = zoneFor(place[1], place[0]);
    const deliveryFee = subtotal >= deliveryConfig.freeDeliveryThreshold ? 0 : zone.fee;
    const discount = r() > 0.75 ? Math.round(subtotal * 0.1) : 0;
    const daysAgo = Math.floor((i / 64) * 180 + r() * 3);
    const createdAt = new Date(REF - daysAgo * 864e5 - Math.floor(r() * 864e5)).toISOString();
    const status: OrderStatus = daysAgo > 12 ? (r() > 0.92 ? "cancelled" : "delivered") : statuses[Math.floor(r() * statuses.length)];
    const paymentMethod = pay[Math.floor(r() * pay.length)];
    const reached = status === "cancelled" ? ["pending", "cancelled"] : flow.slice(0, flow.indexOf(status) + 1);
    const timeline = (reached as OrderStatus[]).map((s, idx) => ({
      status: s,
      at: new Date(new Date(createdAt).getTime() + idx * 20 * 3600e3).toISOString(),
    }));
    const total = subtotal - discount + deliveryFee;
    customer.orders += 1;
    if (status !== "cancelled") customer.totalSpent += total;
    orders.push({
      id: `o${5000 + i}`,
      number: `RK-${10482 - i}`,
      createdAt,
      status,
      customerName: customer.name,
      customerEmail: customer.email,
      phone: customer.phone,
      address: {
        fullName: customer.name,
        phone: customer.phone,
        house: `House ${10 + Math.floor(r() * 300)}`,
        street: `Street ${1 + Math.floor(r() * 40)}`,
        area: areas[Math.floor(r() * areas.length)],
        city: place[0],
        province: place[1],
        postalCode: place[2],
      },
      lines,
      subtotal,
      discount,
      deliveryFee,
      total,
      paymentMethod,
      paymentStatus:
        status === "cancelled" ? "refunded" : status === "delivered" || paymentMethod !== "cod" ? "paid" : "unpaid",
      timeline,
    });
  }
  return orders;
}

export const mockCustomers = buildCustomers();
export const mockOrders = buildOrders(mockCustomers);

/** The demo customer whose account is shown in the customer portal. */
export const demoCustomer = {
  name: "Ayesha Khan",
  email: "ayesha.demo@example.com",
  phone: "03001234567",
  memberSince: "2025-03-14",
};

export const demoCustomerOrders: Order[] = mockOrders.slice(0, 5).map((o, i) => ({
  ...o,
  number: `RK-${20481 - i}`,
  id: `d${i + 1}`,
  customerName: demoCustomer.name,
  customerEmail: demoCustomer.email,
  address: { ...o.address, fullName: demoCustomer.name, city: "Lahore", province: "Punjab", area: "Gulberg III", postalCode: "54660" },
}));

export function findDemoOrder(number: string): Order | undefined {
  const n = number.trim().toUpperCase();
  return demoCustomerOrders.find((o) => o.number === n) ?? mockOrders.find((o) => o.number === n);
}

/** Monthly revenue series for analytics (PKR). */
export const monthlySales = [
  { month: "Jun", revenue: 2_140_000, orders: 318 },
  { month: "Jul", revenue: 2_480_000, orders: 362 },
  { month: "Aug", revenue: 2_910_000, orders: 401 },
  { month: "Sep", revenue: 2_760_000, orders: 388 },
  { month: "Oct", revenue: 3_420_000, orders: 466 },
  { month: "Nov", revenue: 3_980_000, orders: 521 },
];

export const salesByProvince = [
  { name: "Punjab", value: 46 },
  { name: "Sindh", value: 27 },
  { name: "KP", value: 11 },
  { name: "ICT", value: 9 },
  { name: "Balochistan", value: 3 },
  { name: "GB & AJK", value: 4 },
];
