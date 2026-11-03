"use client";

import { useMemo, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { ProductImage } from "@/components/product/product-image";
import { useCartStore } from "@/stores/cart-store";
import { useSuggestionStore } from "@/stores/suggestion-store";
import { useWishlistStore } from "@/stores/wishlist-store";
import { useToastStore } from "@/stores/toast-store";
import type { Product } from "@/lib/catalog/schema";
import {
  formatMoney,
  getDefaultVariant,
  hasMultipleVariants,
  localizedText,
  priceVariant,
} from "@/lib/catalog/pricing";
import type { AppLocale } from "@/i18n/routing";
import { Spinner } from "@/components/ui/spinner";
import { QuantityStepper } from "@/components/ui/quantity-stepper";
import { IconHeart } from "@/components/ui/icons";
import { briefActionDelay } from "@/lib/ui";
import { AddonGroupRows } from "@/features/recommendations/meal-suggestions";

export function ProductDetailView({ product }: { product: Product }) {
  const t = useTranslations();
  const locale = useLocale() as AppLocale;
  const defaultVariant = getDefaultVariant(product);
  const showChips = hasMultipleVariants(product);
  const [variantId, setVariantId] = useState(defaultVariant.id);
  const [qty, setQty] = useState(1);
  const [busy, setBusy] = useState(false);
  const [wishBusy, setWishBusy] = useState(false);
  const variant = product.variants.find((v) => v.id === variantId) ?? defaultVariant;
  const price = useMemo(() => priceVariant(product, variant), [product, variant]);
  const addItem = useCartStore((s) => s.addItem);
  const suggest = useSuggestionStore((s) => s.suggest);
  const toggleWish = useWishlistStore((s) => s.toggle);
  const wished = useWishlistStore((s) => s.productIds.includes(product.id));
  const showToast = useToastStore((s) => s.show);

  async function onAdd() {
    if (!product.isAvailable || busy) return;
    if (showChips && !variantId) {
      showToast(t("toast.selectOption"), "warning");
      return;
    }
    setBusy(true);
    try {
      await briefActionDelay();
      addItem(product.id, variant.id, qty);
      suggest(product.id);
      showToast(t("toast.added"), "success");
    } finally {
      setBusy(false);
    }
  }

  return (
    <article className="mx-auto grid w-full min-w-0 max-w-6xl gap-6 px-4 py-6 md:grid-cols-2 md:items-start md:gap-12 md:py-12">
      <div className="mx-auto w-full min-w-0 max-w-md overflow-hidden rounded-[var(--radius-xl)] border border-[var(--border)] bg-white shadow-[var(--shadow-sm)] md:max-w-none">
        <ProductImage
          src={product.images[0]?.src}
          alt={product.title}
          sizes="(max-width: 768px) 100vw, 480px"
          priority
          className="h-48 sm:h-60 md:aspect-[4/3] md:h-auto md:max-h-[28rem]"
        />
      </div>
      <div className="flex min-w-0 flex-col gap-5">
        <div className="flex items-start justify-between gap-3">
          <h1 className="text-3xl font-extrabold leading-tight md:text-4xl">
            {localizedText(product.title, locale)}
          </h1>
          <button
            type="button"
            disabled={wishBusy}
            onClick={() => {
              if (wishBusy) return;
              setWishBusy(true);
              void briefActionDelay(180).finally(() => {
                toggleWish(product.id);
                setWishBusy(false);
              });
            }}
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-[var(--border)] bg-white text-[var(--brand-red)] shadow-sm transition hover:bg-[var(--brand-red-soft)]"
            aria-pressed={wished}
            aria-label={wished ? t("wishlist.remove") : t("wishlist.add")}
          >
            {wishBusy ? <Spinner className="h-4 w-4" /> : <IconHeart filled={wished} />}
          </button>
        </div>
        {product.description[locale] || product.description.ar || product.description.en ? (
          <p className="text-[var(--muted)] leading-relaxed">
            {localizedText(product.description, locale)}
          </p>
        ) : null}

        {showChips ? (
          <fieldset>
            <legend className="mb-3 font-semibold">{t("product.portion")}</legend>
            <div className="flex flex-wrap gap-2" role="radiogroup" aria-label={t("product.portion")}>
              {product.variants.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  role="radio"
                  aria-checked={item.id === variant.id}
                  onClick={() => setVariantId(item.id)}
                  className={`min-h-11 rounded-full border px-4 text-sm font-semibold transition ${
                    item.id === variant.id
                      ? "border-[var(--brand-red)] bg-[var(--brand-red)] text-white shadow-sm"
                      : "border-[var(--border)] bg-white text-[var(--brand-black)] hover:border-[var(--brand-red)]/40"
                  }`}
                >
                  {localizedText(item.name, locale)}
                </button>
              ))}
            </div>
          </fieldset>
        ) : null}

        <p className="text-3xl font-extrabold text-[var(--brand-red)]">
          {formatMoney(price.finalAmount, locale)}
          {price.discountAmount > 0 ? (
            <s className="ms-3 text-lg font-normal text-[var(--muted)]">
              {formatMoney(price.originalAmount, locale)}
            </s>
          ) : null}
        </p>

        <QuantityStepper
          appearance="outline"
          quantity={qty}
          label={t("product.quantity")}
          decreaseLabel={t("product.decreaseQty")}
          increaseLabel={t("product.increaseQty")}
          onDecrease={() => setQty((n) => Math.max(1, n - 1))}
          onIncrease={() => setQty((n) => Math.min(99, n + 1))}
        />

        <button
          type="button"
          disabled={!product.isAvailable || busy}
          onClick={() => void onAdd()}
          className="ks-pressable sticky bottom-4 inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-[var(--brand-red)] px-6 font-bold text-white shadow-[var(--shadow-md)] transition hover:bg-[var(--brand-red-hover)] disabled:cursor-not-allowed disabled:opacity-50 md:static"
        >
          {busy ? (
            <>
              <Spinner />
              <span>{t("cta.adding")}</span>
            </>
          ) : (
            t("cta.addToOrder")
          )}
        </button>
      </div>
      <div className="min-w-0 pb-20 md:col-span-2 md:pb-0">
        <AddonGroupRows productIds={[product.id]} title={t("suggest.perfect")} />
      </div>
    </article>
  );
}
