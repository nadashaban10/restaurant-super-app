"use client";

import { useEffect, useState, useTransition } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { useCartStore } from "@/stores/cart-store";
import { useSuggestionStore } from "@/stores/suggestion-store";
import { useWishlistStore } from "@/stores/wishlist-store";
import { useToastStore } from "@/stores/toast-store";
import type { Product } from "@/lib/catalog/schema";
import {
  getDefaultVariant,
  hasMultipleVariants,
  localizedText,
  formatMoney,
  priceVariant,
} from "@/lib/catalog/pricing";
import { ProductImage } from "./product-image";
import type { AppLocale } from "@/i18n/routing";
import { QuantityStepper } from "@/components/ui/quantity-stepper";
import { Spinner } from "@/components/ui/spinner";
import { IconHeart } from "@/components/ui/icons";
import { briefActionDelay } from "@/lib/ui";

export function ProductCard({ product, priority = false }: { product: Product; priority?: boolean }) {
  const t = useTranslations();
  const locale = useLocale() as AppLocale;
  const variant = getDefaultVariant(product);
  const price = priceVariant(product, variant);
  const multiple = hasMultipleVariants(product);
  const title = localizedText(product.title, locale);
  const description =
    product.description[locale] || product.description.ar || product.description.en;
  const addItem = useCartStore((s) => s.addItem);
  const suggest = useSuggestionStore((s) => s.suggest);
  const setQuantity = useCartStore((s) => s.setQuantity);
  const cartQty = useCartStore(
    (s) =>
      s.items.find((item) => item.productId === product.id && item.variantId === variant.id)
        ?.quantity ?? 0,
  );
  const toggleWish = useWishlistStore((s) => s.toggle);
  const wishHas = useWishlistStore((s) => s.productIds.includes(product.id));
  const showToast = useToastStore((s) => s.show);
  const [hydrated, setHydrated] = useState(false);
  const [busy, setBusy] = useState(false);
  const [wishBusy, setWishBusy] = useState(false);
  const [, startTransition] = useTransition();

  useEffect(() => setHydrated(true), []);

  async function runCartAction(action: () => void, toastMsg: string) {
    if (busy || !product.isAvailable) return;
    setBusy(true);
    try {
      await briefActionDelay();
      startTransition(() => {
        action();
        showToast(toastMsg, "success");
      });
    } finally {
      setBusy(false);
    }
  }

  function addDefault(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    void runCartAction(() => {
      addItem(product.id, variant.id, 1);
      suggest(product.id);
    }, t("toast.added"));
  }

  function increase() {
    void runCartAction(
      () => setQuantity(product.id, variant.id, cartQty + 1),
      t("toast.updated"),
    );
  }

  function decrease() {
    const next = cartQty - 1;
    void runCartAction(
      () => setQuantity(product.id, variant.id, next),
      next < 1 ? t("toast.removed") : t("toast.updated"),
    );
  }

  async function onWish(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    if (wishBusy) return;
    setWishBusy(true);
    try {
      await briefActionDelay(180);
      toggleWish(product.id);
    } finally {
      setWishBusy(false);
    }
  }

  return (
    <article className="ks-card group flex flex-col overflow-hidden">
      <Link href={`/menu/${product.slug}`} className="relative block overflow-hidden">
        <div className="transition duration-500 group-hover:scale-[1.04]">
          <ProductImage
            src={product.images[0]?.src}
            alt={product.title}
            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 25vw"
            priority={priority}
          />
        </div>

        {!product.isAvailable ? (
          <span className="absolute inset-0 flex items-center justify-center bg-black/55 text-sm font-bold text-white">
            {t("product.soldOut")}
          </span>
        ) : null}

        {multiple && product.isAvailable ? (
          <>
            <span className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/55 via-black/10 to-transparent opacity-100 transition duration-300 md:opacity-0 md:group-hover:opacity-100 md:group-focus-within:opacity-100" />
            <span className="pointer-events-none absolute inset-x-3 bottom-3 flex translate-y-0 items-center justify-center rounded-xl bg-white/95 px-3 py-2 text-center text-xs font-bold text-[var(--brand-black)] shadow-sm transition duration-300 md:translate-y-2 md:opacity-0 md:group-hover:translate-y-0 md:group-hover:opacity-100 md:group-focus-within:translate-y-0 md:group-focus-within:opacity-100">
              {t("cta.chooseOptions")}
              <span className="ms-1 font-semibold text-[var(--muted)]">
                · {product.variants.length} {t("product.options")}
              </span>
            </span>
          </>
        ) : null}

        {price.discountAmount > 0 ? (
          <span className="absolute top-3 start-3 rounded-full bg-[var(--brand-red)] px-2.5 py-1 text-[11px] font-extrabold text-white shadow-sm">
            {t("product.sale")}
          </span>
        ) : null}

        <button
          type="button"
          onClick={onWish}
          className="absolute top-3 end-3 flex h-11 w-11 items-center justify-center rounded-full bg-white/95 text-[var(--brand-red)] shadow-sm transition hover:scale-105"
          aria-label={hydrated && wishHas ? t("wishlist.remove") : t("wishlist.add")}
          aria-pressed={hydrated && wishHas}
          disabled={wishBusy}
        >
          {wishBusy ? <Spinner className="h-4 w-4" /> : <IconHeart filled={hydrated && wishHas} />}
        </button>
      </Link>

      <div className="flex flex-1 flex-col gap-2.5 p-4">
        <div className="space-y-1">
          <Link
            href={`/menu/${product.slug}`}
            className="line-clamp-2 text-base font-extrabold leading-snug text-[var(--brand-black)] transition hover:text-[var(--brand-red)]"
          >
            {title}
          </Link>
          {description ? (
            <p className="line-clamp-2 text-sm leading-relaxed text-[var(--muted)]">{description}</p>
          ) : null}
        </div>

        <div className="mt-auto flex flex-wrap items-end justify-between gap-2 pt-1">
          <div className="min-w-0">
            {!variant.isImplicit ? (
              <p className="mb-0.5 text-xs font-medium text-[var(--muted)]">
                {localizedText(variant.name, locale)}
              </p>
            ) : null}
            <div className="flex flex-wrap items-baseline gap-2">
              <span className="text-lg font-extrabold text-[var(--brand-red)]">
                {formatMoney(price.finalAmount, locale)}
              </span>
              {price.discountAmount > 0 ? (
                <s className="text-sm text-[var(--muted)]">
                  {formatMoney(price.originalAmount, locale)}
                </s>
              ) : null}
            </div>
          </div>
        </div>

        {hydrated && cartQty > 0 ? (
          <div
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
            }}
          >
            <QuantityStepper
              quantity={cartQty}
              label={t("product.quantity")}
              onDecrease={decrease}
              onIncrease={increase}
              decreaseLabel={t("product.decreaseQty")}
              increaseLabel={t("product.increaseQty")}
              disabled={!product.isAvailable}
              busy={busy}
              className="w-full justify-between"
            />
          </div>
        ) : (
          <button
            type="button"
            onClick={addDefault}
            disabled={!product.isAvailable || busy}
            className="ks-pressable mt-1 inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-[var(--brand-red)] px-4 text-sm font-bold text-white transition hover:bg-[var(--brand-red-hover)] disabled:cursor-not-allowed disabled:opacity-50"
          >
            {busy ? (
              <>
                <Spinner />
                <span>{t("cta.adding")}</span>
              </>
            ) : (
              t("cta.add")
            )}
          </button>
        )}
      </div>
    </article>
  );
}
