/**
 * Pakistan delivery configuration (DEMO VALUES).
 *
 * Fees and lead times are configurable placeholders for the Phase 1 UI.
 * In Phase 2 these should come from the backend / courier rate API
 * (see src/services/delivery.ts) and never be trusted from the client.
 */

export interface Province {
  code: string;
  name: string;
  cities: string[];
}

export const provinces: Province[] = [
  {
    code: "PB",
    name: "Punjab",
    cities: [
      "Lahore", "Rawalpindi", "Faisalabad", "Multan", "Gujranwala", "Sialkot",
      "Bahawalpur", "Sargodha", "Sheikhupura", "Jhelum", "Gujrat", "Sahiwal",
      "Rahim Yar Khan", "Dera Ghazi Khan", "Okara", "Kasur",
    ],
  },
  {
    code: "SD",
    name: "Sindh",
    cities: ["Karachi", "Hyderabad", "Sukkur", "Larkana", "Nawabshah", "Mirpur Khas", "Thatta", "Jacobabad"],
  },
  {
    code: "KP",
    name: "Khyber Pakhtunkhwa",
    cities: ["Peshawar", "Abbottabad", "Mardan", "Swat (Mingora)", "Kohat", "Dera Ismail Khan", "Mansehra", "Nowshera", "Bannu"],
  },
  {
    code: "BA",
    name: "Balochistan",
    cities: ["Quetta", "Gwadar", "Turbat", "Khuzdar", "Sibi", "Zhob", "Chaman"],
  },
  { code: "IS", name: "Islamabad Capital Territory", cities: ["Islamabad"] },
  {
    code: "GB",
    name: "Gilgit-Baltistan",
    cities: ["Gilgit", "Skardu", "Hunza (Karimabad)", "Ghizer", "Chilas"],
  },
  {
    code: "AJK",
    name: "Azad Jammu & Kashmir",
    cities: ["Muzaffarabad", "Mirpur", "Rawalakot", "Kotli", "Bagh"],
  },
];

export type DeliveryZone = "metro" | "standard" | "remote";

export interface ZoneConfig {
  zone: DeliveryZone;
  label: string;
  fee: number;
  minDays: number;
  maxDays: number;
}

export const deliveryConfig = {
  freeDeliveryThreshold: 10000,
  codAvailable: true,
  zones: {
    metro: { zone: "metro", label: "Metro express", fee: 199, minDays: 1, maxDays: 3 },
    standard: { zone: "standard", label: "Standard nationwide", fee: 299, minDays: 3, maxDays: 5 },
    remote: { zone: "remote", label: "Extended areas", fee: 449, minDays: 5, maxDays: 9 },
  } satisfies Record<DeliveryZone, ZoneConfig>,
  metroCities: ["Karachi", "Lahore", "Islamabad", "Rawalpindi"],
  remoteProvinces: ["GB", "AJK"],
  remoteCities: ["Gwadar", "Turbat", "Khuzdar", "Zhob", "Chaman", "Sibi", "Jacobabad", "Thatta"],
} as const;

export function getProvince(nameOrCode: string): Province | undefined {
  return provinces.find((p) => p.code === nameOrCode || p.name === nameOrCode);
}

export function zoneFor(provinceName: string, city: string): ZoneConfig {
  const province = getProvince(provinceName);
  const { zones, metroCities, remoteProvinces, remoteCities } = deliveryConfig;
  if ((metroCities as readonly string[]).includes(city)) return zones.metro;
  if (
    (province && (remoteProvinces as readonly string[]).includes(province.code)) ||
    (remoteCities as readonly string[]).includes(city)
  )
    return zones.remote;
  return zones.standard;
}

export const paymentMethods = [
  {
    id: "cod",
    name: "Cash on Delivery",
    description: "Pay in cash when your parcel arrives.",
  },
  {
    id: "bank_transfer",
    name: "Bank Transfer",
    description: "Transfer to our bank account; order confirmed on receipt.",
  },
  {
    id: "easypaisa",
    name: "Easypaisa",
    description: "Pay securely with your Easypaisa mobile account.",
  },
  {
    id: "jazzcash",
    name: "JazzCash",
    description: "Pay securely with your JazzCash mobile wallet.",
  },
] as const;
