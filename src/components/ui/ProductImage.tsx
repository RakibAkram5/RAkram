"use client";

import Image, { type ImageProps } from "next/image";
import { useState } from "react";
import { ImageOff } from "lucide-react";
import { imageUrl, cn } from "@/lib/format";
import type { ProductImage as Img } from "@/lib/types";

/**
 * next/image wrapper for catalogue imagery with a graceful fallback so a
 * missing remote image never shows a broken-image icon.
 */
export function ProductImage({
  image,
  className,
  sizes = "(min-width: 1024px) 25vw, (min-width: 640px) 33vw, 50vw",
  ...rest
}: { image: Img } & Omit<ImageProps, "src" | "alt">) {
  const [failed, setFailed] = useState(false);
  if (failed) {
    return (
      <div
        role="img"
        aria-label={image.alt}
        className={cn("absolute inset-0 flex items-center justify-center bg-ink-3 text-faint", className)}
      >
        <ImageOff className="h-6 w-6" aria-hidden />
      </div>
    );
  }
  return (
    <Image
      src={imageUrl(image)}
      alt={image.alt}
      fill
      sizes={sizes}
      className={cn("object-cover", className)}
      onError={() => setFailed(true)}
      {...rest}
    />
  );
}
