"use client";

import { useState } from "react";
import { Clock, MapPin, Truck } from "lucide-react";
import { deliveryConfig, provinces, zoneFor } from "@/data/pakistan";
import { formatPKR } from "@/lib/format";
import { estimateWindow } from "@/lib/pricing";
import { SelectField } from "@/components/ui/Field";

export function DeliveryEstimator() {
  const [province, setProvince] = useState("");
  const [city, setCity] = useState("");
  const cities = provinces.find((p) => p.name === province)?.cities ?? [];
  const zone = province && city ? zoneFor(province, city) : null;
  return (
    <div className="glass-strong edge rounded-3xl p-6 sm:p-8">
      <h2 className="flex items-center gap-2 font-display text-3xl">
        <MapPin className="h-5 w-5 text-silver" aria-hidden /> Delivery estimator
      </h2>
      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <SelectField
          label="Province / territory"
          value={province}
          onChange={(e) => {
            setProvince(e.target.value);
            setCity("");
          }}
          placeholder="Select province"
          options={provinces.map((p) => ({ value: p.name, label: p.name }))}
        />
        <SelectField label="City" value={city} disabled={!province} onChange={(e) => setCity(e.target.value)} placeholder={province ? "Select city" : "Select province first"} options={cities.map((c) => ({ value: c, label: c }))} />
      </div>
      <div className="mt-6 min-h-24 rounded-2xl border border-line p-5" aria-live="polite">
        {zone ? (
          <div className="grid gap-4 sm:grid-cols-3">
            <div>
              <p className="text-xs text-faint">Service</p>
              <p className="mt-1 flex items-center gap-2 font-semibold">
                <Truck className="h-4 w-4 text-silver" aria-hidden /> {zone.label}
              </p>
            </div>
            <div>
              <p className="text-xs text-faint">Delivery fee</p>
              <p className="mt-1 font-semibold">
                {formatPKR(zone.fee)} <span className="text-xs font-normal text-faint">· free over {formatPKR(deliveryConfig.freeDeliveryThreshold)}</span>
              </p>
            </div>
            <div>
              <p className="text-xs text-faint">Estimated arrival</p>
              <p className="mt-1 flex items-center gap-2 font-semibold">
                <Clock className="h-4 w-4 text-silver" aria-hidden /> {estimateWindow(zone)}
              </p>
            </div>
          </div>
        ) : (
          <p className="text-sm text-muted">Choose a province and city to see your delivery fee and estimated arrival window.</p>
        )}
      </div>
      <p className="mt-4 text-xs text-faint">Estimates use configurable demo values and exclude Sundays and public holidays. Live courier rates will replace these in Phase 2.</p>
    </div>
  );
}
