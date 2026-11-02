"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { useCartStore } from "@/stores/cart-store";
import { useToastStore } from "@/stores/toast-store";
import { quoteCart } from "@/lib/catalog/catalog";
import { formatMoney, localizedText } from "@/lib/catalog/pricing";
import { ProductImage } from "@/components/product/product-image";
import type { AppLocale } from "@/i18n/routing";
import { Spinner } from "@/components/ui/spinner";
import { IconCart } from "@/components/ui/icons";
import { briefActionDelay } from "@/lib/ui";

export function CartView() {
  const t = useTranslations();
  const locale = useLocale() as AppLocale;
  const items = useCartStore((s) => s.items);
  const setQuantity = useCartStore((s) => s.setQuantity);
  const removeItem = useCartStore((s) => s.removeItem);
  const showToast = useToastStore((s) => s.show);
  const [busyKey, setBusyKey] = useState<string | null>(null);

  const quote = useQuery({
    queryKey: ["cart-quote", items],
    queryFn: () => quoteCart(items),
  });

  async function withBusy(key: string, action: () => void, toastMsg: string) {
    if (busyKey) return;
    setBusyKey(key);
    try {
      await briefActionDelay(220);
      action();
      showToast(toastMsg, "success");
    } finally {
      setBusyKey(null);
    }
  }

  if (!items.length) {
    return (
      <div className="mx-auto max-w-xl px-4 py-20 text-center">
        <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full border border-[var(--border)] bg-white text-[var(--brand-red)] shadow-[var(--shadow-sm)]">
          <IconCart size={28} />
        </div>
        <h1 className="mb-3 text-3xl font-extrabold">{t("cart.title")}</h1>
        <p className="mb-8 text-[var(--muted)]">{t("cart.empty")}</p>
        <Link
          href="/menu"
          className="ks-pressable inline-flex min-h-12 items-center rounded-xl bg-[var(--brand-red)] px-6 font-bold text-white shadow-sm transition hover:bg-[var(--brand-red-hover)]"
        >
          {t("cart.emptyCta")}
        </Link>
      </div>
    );
  }

  const data = quote.data;

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 md:py-12">
      <h1 className="mb-6 text-3xl font-extrabold">{t("cart.title")}</h1>
      <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_20.5rem]">
        <ul className="flex flex-col gap-4">
          {(data?.items ?? []).map((line) => {
            const key = `${line.productId}:${line.variantId}`;
            const lineBusy = busyKey === key;
            return (
              <li
                key={key}
                className="grid grid-cols-[96px_1fr] gap-4 rounded-[var(--radius-xl)] border border-[var(--border)] bg-white p-3 shadow-[var(--shadow-sm)] sm:grid-cols-[104px_1fr]"
              >
                <div className="overflow-hidden rounded-xl">
                  <ProductImage src={line.image} alt={line.title} sizes="104px" />
                </div>
                <div className="min-w-0">
                  <p className="font-extrabold leading-snug">{localizedText(line.title, locale)}</p>
                  <p className="mt-0.5 text-sm text-[var(--muted)]">
                    {localizedText(line.variantName, locale)}
                  </p>
                  <p className="mt-2 font-bold text-[var(--brand-red)]">
                    {formatMoney(line.lineFinalAmount, locale)}
                  </p>
                  <div className="mt-3 flex flex-wrap items-center gap-2">
                    <div className="inline-flex items-center gap-1 rounded-xl bg-[var(--page-bg)] p-1">
                      <button
                        type="button"
                        className="flex h-10 w-10 items-center justify-center rounded-lg text-lg disabled:opacity-50"
                        aria-label={t("product.decreaseQty")}
                        disabled={!!busyKey}
                        onClick={() =>
                          void withBusy(
                            key,
                            () => setQuantity(line.productId, line.variantId, line.quantity - 1),
                            line.quantity - 1 < 1 ? t("toast.removed") : t("toast.updated"),
                          )
                        }
                      >
                        −
                      </button>
                      <span className="min-w-8 text-center font-extrabold tabular-nums">
                        {lineBusy ? <Spinner className="mx-auto h-4 w-4" /> : line.quantity}
                      </span>
                      <button
                        type="button"
                        className="flex h-10 w-10 items-center justify-center rounded-lg text-lg disabled:opacity-50"
                        aria-label={t("product.increaseQty")}
                        disabled={!!busyKey}
                        onClick={() =>
                          void withBusy(
                            key,
                            () => setQuantity(line.productId, line.variantId, line.quantity + 1),
                            t("toast.updated"),
                          )
                        }
                      >
                        +
                      </button>
                    </div>
                    <button
                      type="button"
                      className="ms-auto min-h-10 rounded-lg px-2 text-sm font-semibold text-[var(--danger)] transition hover:bg-[var(--danger-soft)] disabled:opacity-50"
                      disabled={!!busyKey}
                      onClick={() =>
                        void withBusy(
                          key,
                          () => removeItem(line.productId, line.variantId),
                          t("toast.removed"),
                        )
                      }
                    >
                      {t("cart.remove")}
                    </button>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>

        <aside className="lg:sticky lg:top-[calc(var(--header-offset)+0.75rem)]">
          {quote.isLoading && !data ? (
            <div className="flex items-center justify-center gap-2 rounded-[var(--radius-xl)] border border-[var(--border)] bg-white p-6 text-[var(--muted)] shadow-[var(--shadow-sm)]">
              <Spinner />
              <span>{t("cart.calculating")}</span>
            </div>
          ) : (
            <div className="rounded-[var(--radius-xl)] border border-[var(--border)] bg-white p-5 shadow-[var(--shadow-md)]">
              <h2 className="mb-4 text-lg font-extrabold">{t("cart.summary")}</h2>
              <dl className="space-y-3 text-sm">
                <div className="flex items-center justify-between gap-3">
                  <dt className="text-[var(--muted)]">{t("cart.subtotal")}</dt>
                  <dd className="font-bold">
                    {data ? formatMoney(data.subtotalFinalAmount, locale) : "…"}
                  </dd>
                </div>
                {data && data.subtotalOriginalAmount > data.subtotalFinalAmount ? (
                  <div className="flex items-center justify-between gap-3">
                    <dt className="text-[var(--muted)]">{t("product.sale")}</dt>
                    <dd className="font-bold text-[var(--success)]">
                      −{formatMoney(data.subtotalOriginalAmount - data.subtotalFinalAmount, locale)}
                    </dd>
                  </div>
                ) : null}
                <div className="flex items-center justify-between gap-3">
                  <dt className="text-[var(--muted)]">{t("cart.delivery")}</dt>
                  <dd className="font-bold">
                    {data ? formatMoney(data.deliveryFeeAmount, locale) : "…"}
                  </dd>
                </div>
                <div className="flex items-center justify-between gap-3 border-t border-[var(--border)] pt-3 text-base">
                  <dt className="font-extrabold">{t("cart.total")}</dt>
                  <dd className="font-extrabold text-[var(--brand-red)]">
                    {data ? formatMoney(data.totalAmount, locale) : "…"}
                  </dd>
                </div>
              </dl>
              <p className="mt-4 text-sm leading-relaxed text-[var(--muted)]">{t("cart.staticNote")}</p>
            </div>
          )}
        </aside>
      </div>
    </div>
  );
}
