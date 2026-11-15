import type { Address, CartLine, Order, PaymentMethod } from "@/lib/types";
import { demoCustomerOrders, findDemoOrder } from "@/data/mock-orders";

/**
 * Order service. Phase 1 NEVER submits orders anywhere.
 * Phase 2: `placeOrder` must POST to the backend, which re-prices the cart,
 * validates stock & coupon, and initiates payment (COD / bank / Easypaisa /
 * JazzCash) server-side. Payment credentials are never handled in the browser.
 */
export interface PlaceOrderInput {
  lines: CartLine[];
  email: string;
  address: Address;
  paymentMethod: PaymentMethod;
  couponCode: string | null;
}

export const orderService = {
  async listMyOrders(): Promise<Order[]> {
    return demoCustomerOrders;
  },
  async getMyOrder(id: string): Promise<Order | null> {
    return demoCustomerOrders.find((o) => o.id === id) ?? null;
  },
  async track(orderNumber: string): Promise<Order | null> {
    return findDemoOrder(orderNumber) ?? null;
  },
};
