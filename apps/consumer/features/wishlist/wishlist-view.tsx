"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { useWishlistStore } from "@/stores/wishlist-store";
import { getProductById } from "@/lib/catalog/catalog";
import { ProductCard } from "@/components/product/product-card";
import { IconHeart } from "@/components/ui/icons";

export function WishlistView() {
  const t = useTranslations();
  const ids = useWishlistStore((s) => s.productIds);
  const products = ids
    .map((id) => getProductById(id))
    .filter((p): p is NonNullable<typeof p> => Boolean(p));

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 md:py-10">
      <h1 className="mb-6 text-3xl font-extrabold tracking-tight md:text-4xl">
        {t("wishlist.title")}
      </h1>
      {products.length === 0 ? (
        <div className="rounded-[var(--radius-xl)] border border-dashed border-[var(--border)] bg-white px-6 py-16 text-center">
          <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-[var(--brand-red-soft)] text-[var(--brand-red)]">
            <IconHeart />
          </div>
          <p className="mb-6 text-[var(--muted)]">{t("wishlist.empty")}</p>
          <Link
            href="/menu"
            className="ks-pressable inline-flex min-h-12 items-center rounded-xl bg-[var(--brand-red)] px-6 font-bold text-white transition hover:bg-[var(--brand-red-hover)]"
          >
            {t("wishlist.emptyCta")}
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}
