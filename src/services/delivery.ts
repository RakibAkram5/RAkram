import { zoneFor, type ZoneConfig } from "@/data/pakistan";

/**
 * Courier integration seam (Phase 2: TCS, Leopards, M&P, PostEx, Trax, etc.).
 * Implement `DeliveryProvider` per courier on the SERVER — courier API keys
 * must never reach the browser. The demo provider only returns configured
 * quotes and never fabricates tracking events.
 */
export interface DeliveryQuote {
  zone: ZoneConfig;
  fee: number;
  minDays: number;
  maxDays: number;
  provider: string;
}

export interface TrackingEvent {
  status: string;
  at: string;
  location?: string;
}

export interface DeliveryProvider {
  id: string;
  name: string;
  quote(input: { province: string; city: string; subtotal: number }): Promise<DeliveryQuote>;
  createShipment?(orderId: string): Promise<{ trackingNumber: string }>;
  track?(trackingNumber: string): Promise<TrackingEvent[]>;
}

export const demoDeliveryProvider: DeliveryProvider = {
  id: "demo",
  name: "RAKRAM Delivery (demo rates)",
  async quote({ province, city }) {
    const zone = zoneFor(province, city);
    return { zone, fee: zone.fee, minDays: zone.minDays, maxDays: zone.maxDays, provider: this.name };
  },
  // createShipment / track intentionally not implemented in Phase 1.
};
