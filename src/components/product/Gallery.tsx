"use client";

import { AnimatePresence, motion } from "motion/react";
import { useRef, useState } from "react";
import { ChevronLeft, ChevronRight, Expand } from "lucide-react";
import type { ProductImage as Img } from "@/lib/types";
import { cn } from "@/lib/format";
import { ProductImage } from "@/components/ui/ProductImage";
import { Modal } from "@/components/ui/Overlay";

export function Gallery({ images, name }: { images: Img[]; name: string }) {
  const [index, setIndex] = useState(0);
  const [zoom, setZoom] = useState<{ x: number; y: number } | null>(null);
  const [lightbox, setLightbox] = useState(false);
  const frame = useRef<HTMLDivElement>(null);
  const go = (d: number) => setIndex((i) => (i + d + images.length) % images.length);

  const onMove = (e: React.PointerEvent) => {
    if (e.pointerType !== "mouse" || !frame.current) return;
    const r = frame.current.getBoundingClientRect();
    setZoom({ x: ((e.clientX - r.left) / r.width) * 100, y: ((e.clientY - r.top) / r.height) * 100 });
  };

  return (
    <div className="flex flex-col-reverse gap-3 lg:flex-row lg:gap-4">
      <div className="no-scrollbar flex gap-2.5 overflow-x-auto lg:w-20 lg:flex-col lg:overflow-visible" role="tablist" aria-label="Product images">
        {images.map((img, i) => (
          <button
            key={i}
            type="button"
            role="tab"
            aria-selected={i === index}
            aria-label={`View image ${i + 1} of ${images.length}`}
            onClick={() => setIndex(i)}
            className={cn(
              "relative aspect-[4/5] w-16 shrink-0 overflow-hidden rounded-xl border transition lg:w-full",
              i === index ? "border-silver" : "border-line opacity-60 hover:opacity-100",
            )}
          >
            <ProductImage image={img} sizes="80px" />
          </button>
        ))}
      </div>

      <div className="relative flex-1">
        <div
          ref={frame}
          className="edge relative aspect-[4/5] cursor-zoom-in overflow-hidden rounded-3xl bg-ink-3"
          onPointerMove={onMove}
          onPointerLeave={() => setZoom(null)}
          onClick={() => setLightbox(true)}
        >
          <AnimatePresence mode="popLayout" initial={false}>
            <motion.div
              key={index}
              className="absolute inset-0"
              initial={{ opacity: 0, scale: 1.03 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            >
              <div
                className="absolute inset-0 transition-transform duration-300 ease-out"
                style={zoom ? { transform: "scale(2)", transformOrigin: `${zoom.x}% ${zoom.y}%` } : undefined}
              >
                <ProductImage image={images[index]} preload={index === 0} sizes="(min-width: 1024px) 50vw, 100vw" quality={85} />
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
        <div className="pointer-events-none absolute inset-x-3 bottom-3 flex items-center justify-between">
          <div className="pointer-events-auto flex gap-2">
            <button type="button" onClick={() => go(-1)} aria-label="Previous image" className="glass-strong flex h-10 w-10 items-center justify-center rounded-full">
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button type="button" onClick={() => go(1)} aria-label="Next image" className="glass-strong flex h-10 w-10 items-center justify-center rounded-full">
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
          <button
            type="button"
            onClick={() => setLightbox(true)}
            className="glass-strong pointer-events-auto flex h-10 items-center gap-2 rounded-full px-4 text-xs font-semibold"
          >
            <Expand className="h-3.5 w-3.5" /> Zoom
          </button>
        </div>
      </div>

      <Modal open={lightbox} onClose={() => setLightbox(false)} title={`${name} — image ${index + 1}`} hideTitle className="sm:max-w-4xl">
        <div className="relative aspect-[4/5] max-h-[86dvh] w-full sm:aspect-[4/5]">
          <ProductImage image={images[index]} sizes="(min-width: 1024px) 900px, 100vw" quality={85} className="object-contain" />
          <div className="absolute inset-x-4 bottom-4 flex justify-center gap-2">
            <button type="button" onClick={() => go(-1)} aria-label="Previous image" className="glass-strong flex h-11 w-11 items-center justify-center rounded-full">
              <ChevronLeft className="h-5 w-5" />
            </button>
            <span className="glass-strong flex h-11 items-center rounded-full px-4 text-xs tabular-nums">
              {index + 1} / {images.length}
            </span>
            <button type="button" onClick={() => go(1)} aria-label="Next image" className="glass-strong flex h-11 w-11 items-center justify-center rounded-full">
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
