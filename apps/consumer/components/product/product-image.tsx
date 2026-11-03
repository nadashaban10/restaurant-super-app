"use client";

import Image from "next/image";
import { useLocale } from "next-intl";
import type { AppLocale } from "@/i18n/routing";
import { localizedText } from "@/lib/catalog/pricing";

type Props = {
  src: string | null | undefined;
  alt: { ar: string; en: string } | string;
  sizes: string;
  priority?: boolean;
  className?: string;
};

export function ProductImage({ src, alt, sizes, priority = false, className }: Props) {
  const locale = useLocale() as AppLocale;
  const label = typeof alt === "string" ? alt : localizedText(alt, locale);
  const resolved = src && src.length > 0 ? src : "/brand/placeholder-product.svg";
  const isSvg = resolved.endsWith(".svg");

  return (
    <div className={`relative w-full overflow-hidden bg-[var(--page-bg)] ${className ?? "aspect-[4/3]"}`}>
      {isSvg ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={resolved} alt={label} className="h-full w-full object-cover" />
      ) : (
        <Image
          src={resolved}
          alt={label}
          fill
          sizes={sizes}
          priority={priority}
          className="object-cover"
        />
      )}
    </div>
  );
}
