"use client";

import { useTranslations } from "next-intl";
import { formatMoney } from "@/lib/catalog/pricing";
import type { AppLocale } from "@/i18n/routing";

type Props = {
  locale: AppLocale;
  subtotalFinalAmount: number;
  totalAmount: number;
};

export function OrderTotals({ locale, subtotalFinalAmount, totalAmount }: Props) {
  const t = useTranslations();

  return (
    <dl className="space-y-3 text-sm">
      <div className="flex items-center justify-between gap-3">
        <dt className="text-[var(--muted)]">{t("cart.subtotal")}</dt>
        <dd className="font-bold">{formatMoney(subtotalFinalAmount, locale)}</dd>
      </div>
      <div className="flex items-start justify-between gap-3">
        <dt className="text-[var(--muted)]">{t("cart.delivery")}</dt>
        <dd className="min-w-0 max-w-[14rem] text-end font-bold">{t("cart.deliveryNote")}</dd>
      </div>
      <div className="flex items-center justify-between gap-3 border-t border-[var(--border)] pt-3 text-base">
        <dt className="font-extrabold">{t("cart.total")}</dt>
        <dd className="font-extrabold text-[var(--brand-red)]">{formatMoney(totalAmount, locale)}</dd>
      </div>
    </dl>
  );
}
