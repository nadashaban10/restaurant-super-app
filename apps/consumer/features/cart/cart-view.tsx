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
import { CartSkeleton } from "@/components/ui/skeletons";
import { IconCart } from "@/components/ui/icons";
import { briefActionDelay } from "@/lib/ui";
import { OrderTotals } from "@/features/order/order-totals";
import { AddonGroupRows } from "@/features/recommendations/meal-suggestions";
import { usePersistHydrated } from "@/hooks/use-persist-hydrated";

export function CartView() {
  const t = useTranslations();
  const locale = useLocale() as AppLocale;
  const ready = usePersistHydrated(useCartStore.persist);
  const items = useCartStore((s) => s.items);
  const setQuantity = useCartStore((s) => s.setQuantity);
  const removeItem = useCartStore((s) => s.removeItem);
  const showToast = useToastStore((s) => s.show);
  const [busyKey, setBusyKey] = useState<string | null>(null);

  const quote = useQuery({
    queryKey: ["cart-quote", items],
    queryFn: () => quoteCart(items),
    enabled: ready,
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

  if (!ready || (quote.isLoading && !quote.data)) {
    return <CartSkeleton />;
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
  const checkoutBlocked =
    !data || data.unavailableItemIds.length > 0 || !data.items.some((item) => item.isAvailable);

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 pb-28 md:py-12 lg:pb-12">
      <h1 className="mb-6 text-3xl font-extrabold">{t("cart.title")}</h1>
      <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_20.5rem]">
        <div className="flex min-w-0 flex-col gap-8">
        <ul className="flex flex-col gap-4">
          {(data?.items ?? []).map((line) => {
            const key = `${line.productId}:${line.variantId}`;
            const qtyBusy = busyKey === `${key}:dec` || busyKey === `${key}:inc`;
            const title = localizedText(line.title, locale);
            const variant = line.isImplicit ? "" : localizedText(line.variantName, locale);
            return (
              <li
                key={key}
                className="grid grid-cols-[96px_1fr] gap-4 rounded-[var(--radius-xl)] border border-[var(--border)] bg-white p-3 shadow-[var(--shadow-sm)] sm:grid-cols-[104px_1fr]"
              >
                <div className="overflow-hidden rounded-xl">
                  <ProductImage src={line.image} alt={line.title} sizes="104px" />
                </div>
                <div className="min-w-0">
                  <p className="font-extrabold leading-snug">
                    {title === "—" ? t("cart.unavailableItem") : title}
                  </p>
                  {variant && variant !== "—" ? (
                    <p className="mt-0.5 text-sm text-[var(--muted)]">{variant}</p>
                  ) : null}
                  {line.isAvailable ? (
                    <>
                      <p className="mt-2 text-sm text-[var(--muted)]">
                        {formatMoney(line.unitFinalAmount, locale)} × {line.quantity}
                      </p>
                      <p className="mt-1 font-bold text-[var(--brand-red)]">
                        {formatMoney(line.lineFinalAmount, locale)}
                      </p>
                    </>
                  ) : (
                    <p className="mt-2 text-sm font-semibold text-[var(--danger)]">{t("product.soldOut")}</p>
                  )}
                  <div className="mt-3 flex flex-wrap items-center gap-2">
                    {line.isAvailable ? (
                      <div className="inline-flex items-center gap-1 rounded-xl bg-[var(--page-bg)] p-1">
                        <button
                          type="button"
                          className="flex h-11 w-11 items-center justify-center rounded-lg text-lg disabled:opacity-50"
                          aria-label={t("product.decreaseQty")}
                          disabled={!!busyKey}
                          onClick={() =>
                            void withBusy(
                              `${key}:dec`,
                              () => setQuantity(line.productId, line.variantId, line.quantity - 1),
                              line.quantity - 1 < 1 ? t("toast.removed") : t("toast.updated"),
                            )
                          }
                        >
                          −
                        </button>
                        <span className="min-w-8 text-center font-extrabold tabular-nums">
                          {qtyBusy ? <Spinner className="mx-auto h-4 w-4" /> : line.quantity}
                        </span>
                        <button
                          type="button"
                          className="flex h-11 w-11 items-center justify-center rounded-lg text-lg disabled:opacity-50"
                          aria-label={t("product.increaseQty")}
                          disabled={!!busyKey || line.quantity >= 99}
                          onClick={() =>
                            void withBusy(
                              `${key}:inc`,
                              () => setQuantity(line.productId, line.variantId, line.quantity + 1),
                              t("toast.updated"),
                            )
                          }
                        >
                          +
                        </button>
                      </div>
                    ) : null}
                    <button
                      type="button"
                      className="ms-auto min-h-11 rounded-lg px-2 text-sm font-semibold text-[var(--danger)] transition hover:bg-[var(--danger-soft)] disabled:opacity-50"
                      disabled={!!busyKey}
                      onClick={() =>
                        void withBusy(
                          `${key}:remove`,
                          () => removeItem(line.productId, line.variantId),
                          t("toast.removed"),
                        )
                      }
                    >
                      {busyKey === `${key}:remove` ? <Spinner /> : t("cart.remove")}
                    </button>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
        <AddonGroupRows
          productIds={[...new Set(items.map((item) => item.productId))]}
          title={t("suggest.complete")}
          hint={t("suggest.completeHint")}
        />
        </div>

        <aside className="lg:sticky lg:top-[calc(var(--header-offset)+0.75rem)]">
          <div className="rounded-[var(--radius-xl)] border border-[var(--border)] bg-white p-5 shadow-[var(--shadow-md)]">
            <h2 className="mb-4 text-lg font-extrabold">{t("cart.summary")}</h2>
            {data ? (
              <OrderTotals
                locale={locale}
                subtotalFinalAmount={data.subtotalFinalAmount}
                totalAmount={data.totalAmount}
              />
            ) : (
              <p className="text-sm text-[var(--muted)]">{t("cart.calculating")}</p>
            )}
            {data && data.unavailableItemIds.length > 0 ? (
              <p
                className="mt-4 rounded-xl bg-[var(--warning-soft)] px-3 py-3 text-sm font-medium leading-relaxed text-[var(--warning)]"
                role="alert"
              >
                {t("cart.unavailable")}
              </p>
            ) : null}
            <div className="mt-5 flex flex-col gap-3">
              <div className="hidden lg:block">
                <CheckoutButton blocked={checkoutBlocked} label={t("cart.checkout")} />
              </div>
              <Link
                href="/menu"
                className="inline-flex min-h-12 items-center justify-center rounded-xl border border-[var(--border)] bg-white px-4 text-base font-bold"
              >
                {t("cart.continue")}
              </Link>
            </div>
            <p className="mt-4 text-sm leading-relaxed text-[var(--muted)]">{t("cart.staticNote")}</p>
          </div>
        </aside>
      </div>

      <div className="fixed inset-x-0 bottom-0 z-30 border-t border-[var(--border)] bg-white p-3 shadow-[var(--shadow-lg)] lg:hidden">
        <div className="mx-auto flex max-w-6xl items-center gap-3">
          <div className="min-w-[5.5rem]">
            <p className="text-xs text-[var(--muted)]">{t("cart.total")}</p>
            <p className="text-base font-extrabold text-[var(--brand-red)]">
              {data ? formatMoney(data.totalAmount, locale) : "…"}
            </p>
          </div>
          <div className="min-w-0 flex-1">
            <CheckoutButton blocked={checkoutBlocked} label={t("cart.checkout")} />
          </div>
        </div>
      </div>
    </div>
  );
}

function CheckoutButton({ blocked, label }: { blocked: boolean; label: string }) {
  const className =
    "ks-pressable inline-flex min-h-12 w-full items-center justify-center rounded-xl bg-[var(--brand-red)] px-4 text-base font-extrabold text-white shadow-sm transition hover:bg-[var(--brand-red-hover)] disabled:cursor-not-allowed disabled:opacity-50";

  if (blocked) {
    return (
      <button type="button" className={className} disabled>
        {label}
      </button>
    );
  }

  return (
    <Link href="/checkout" className={className}>
      {label}
    </Link>
  );
}
