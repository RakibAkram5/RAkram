"use client";

import { useState } from "react";

/**
 * Lightweight SVG charts (no dependency). Single-series only, one silver hue,
 * recessive grid, hover tooltips; every chart is paired with a data table on
 * the page so values are never colour/hover-only.
 */

import { formatPKR } from "@/lib/format";

export type ValueKind = "pkr" | "percent" | "number";
const fmt = (n: number, kind: ValueKind = "number") => (kind === "pkr" ? formatPKR(n) : kind === "percent" ? `${n}%` : n.toLocaleString("en-PK"));

const fmtCompact = (n: number) =>
  n >= 1_000_000 ? `${(n / 1_000_000).toFixed(1)}M` : n >= 1000 ? `${Math.round(n / 1000)}k` : String(n);

export function AreaChart({ data, valueLabel, kind = "number" }: { data: { label: string; value: number }[]; valueLabel: string; kind?: ValueKind }) {
  const format = (n: number) => fmt(n, kind);
  const [hover, setHover] = useState<number | null>(null);
  const W = 640;
  const H = 240;
  const pad = { l: 44, r: 12, t: 16, b: 28 };
  const max = Math.max(...data.map((d) => d.value)) * 1.1;
  const x = (i: number) => pad.l + (i * (W - pad.l - pad.r)) / Math.max(1, data.length - 1);
  const y = (v: number) => H - pad.b - (v / max) * (H - pad.t - pad.b);
  const line = data.map((d, i) => `${i ? "L" : "M"}${x(i)},${y(d.value)}`).join(" ");
  const area = `${line} L${x(data.length - 1)},${H - pad.b} L${x(0)},${H - pad.b} Z`;
  const ticks = [0, 0.25, 0.5, 0.75, 1].map((t) => t * max);

  return (
    <div className="relative">
      <svg viewBox={`0 0 ${W} ${H}`} className="h-auto w-full" role="img" aria-label={`${valueLabel} by month`} onMouseLeave={() => setHover(null)}>
        <defs>
          <linearGradient id="area-fill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#d4d6dc" stopOpacity="0.28" />
            <stop offset="1" stopColor="#d4d6dc" stopOpacity="0" />
          </linearGradient>
        </defs>
        {ticks.map((t) => (
          <g key={t}>
            <line x1={pad.l} x2={W - pad.r} y1={y(t)} y2={y(t)} stroke="rgba(255,255,255,0.06)" />
            <text x={pad.l - 8} y={y(t) + 4} textAnchor="end" fontSize="10" fill="#8a8a94">
              {fmtCompact(t)}
            </text>
          </g>
        ))}
        <path d={area} fill="url(#area-fill)" />
        <path d={line} fill="none" stroke="#e4e5e9" strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" />
        {data.map((d, i) => (
          <g key={d.label}>
            <text x={x(i)} y={H - 8} textAnchor="middle" fontSize="10" fill="#8a8a94">
              {d.label}
            </text>
            {hover === i && <line x1={x(i)} x2={x(i)} y1={pad.t} y2={H - pad.b} stroke="rgba(255,255,255,0.25)" strokeDasharray="3 3" />}
            <circle cx={x(i)} cy={y(d.value)} r={hover === i ? 5 : 4} fill="#08090b" stroke="#e4e5e9" strokeWidth="2" />
            <rect x={x(i) - (W - pad.l - pad.r) / data.length / 2} y={pad.t} width={(W - pad.l - pad.r) / data.length} height={H - pad.t - pad.b} fill="transparent" onMouseEnter={() => setHover(i)} />
          </g>
        ))}
      </svg>
      {hover !== null && (
        <div
          className="glass-strong pointer-events-none absolute top-2 rounded-xl px-3 py-2 text-xs shadow-lg"
          style={{ left: `clamp(0px, calc(${(x(hover) / W) * 100}% - 60px), calc(100% - 130px))` }}
        >
          <p className="text-faint">{data[hover].label}</p>
          <p className="font-semibold">
            {valueLabel}: {format(data[hover].value)}
          </p>
        </div>
      )}
    </div>
  );
}

export function BarList({ data, kind = "number", label }: { data: { name: string; value: number }[]; kind?: ValueKind; label: string }) {
  const format = (n: number) => fmt(n, kind);
  const max = Math.max(...data.map((d) => d.value), 1);
  return (
    <ul className="space-y-3" aria-label={label}>
      {data.map((d) => (
        <li key={d.name} className="group" title={`${d.name}: ${format(d.value)}`}>
          <div className="mb-1.5 flex justify-between text-xs">
            <span className="text-muted group-hover:text-fg">{d.name}</span>
            <span className="font-medium tabular-nums">{format(d.value)}</span>
          </div>
          <div className="h-2 rounded-full bg-white/[0.05]">
            <div className="h-2 rounded-full bg-gradient-to-r from-zinc-400 to-zinc-200 transition-all group-hover:to-white" style={{ width: `${(d.value / max) * 100}%` }} />
          </div>
        </li>
      ))}
    </ul>
  );
}

export function ColumnChart({ data, valueLabel }: { data: { label: string; value: number }[]; valueLabel: string }) {
  const [hover, setHover] = useState<number | null>(null);
  const max = Math.max(...data.map((d) => d.value)) * 1.1;
  return (
    <div className="relative" role="img" aria-label={`${valueLabel} by month`}>
      <div className="flex h-52 items-end gap-3 border-b border-line pb-px">
        {data.map((d, i) => (
          <div key={d.label} className="relative flex h-full flex-1 flex-col justify-end" onMouseEnter={() => setHover(i)} onMouseLeave={() => setHover(null)}>
            {hover === i && (
              <div className="glass-strong absolute -top-1 left-1/2 z-10 -translate-x-1/2 -translate-y-full rounded-lg px-2.5 py-1.5 text-xs whitespace-nowrap">
                {d.label}: <span className="font-semibold">{d.value}</span>
              </div>
            )}
            <div className="rounded-t-[4px] bg-zinc-300/80 transition-colors hover:bg-white" style={{ height: `${(d.value / max) * 100}%` }} />
          </div>
        ))}
      </div>
      <div className="mt-2 flex gap-3">
        {data.map((d) => (
          <span key={d.label} className="flex-1 text-center text-[10px] text-faint">
            {d.label}
          </span>
        ))}
      </div>
    </div>
  );
}
