import type { AppLocale } from "@/i18n/routing";
import type { Product, Variant } from "./schema";

export type Money = {
  currency: "EGP";
  originalAmount: number;
  discountAmount: number;
  finalAmount: number;
};

/** Storefront charges the menu price. Discount rules will be managed from the dashboard. */
const DISCOUNTS_ENABLED = false;

/** Single pricing brain. Cart/UI never invents unit prices. */
export function priceVariant(product: Product, variant: Variant): Money {
  const original = variant.priceAmount;
  let off = 0;
  if (DISCOUNTS_ENABLED && product.discountType === "percent") {
    off = Math.floor((original * product.discountValue) / 100);
  } else if (DISCOUNTS_ENABLED && product.discountType === "fixed") {
    off = product.discountValue;
  }
  off = Math.min(Math.max(off, 0), original);
  return {
    currency: "EGP",
    originalAmount: original,
    discountAmount: off,
    finalAmount: original - off,
  };
}

export function getDefaultVariant(product: Product): Variant {
  return (
    product.variants.find((v) => v.id === product.defaultVariantId) ??
    product.variants[0]
  );
}

export function hasMultipleVariants(product: Product): boolean {
  return product.variants.filter((v) => !v.isImplicit).length > 1;
}

export function formatMoney(amountPiastres: number, locale: AppLocale): string {
  const pounds = amountPiastres / 100;
  return new Intl.NumberFormat(locale === "ar" ? "ar-EG" : "en-EG", {
    style: "currency",
    currency: "EGP",
    maximumFractionDigits: pounds % 1 === 0 ? 0 : 2,
  }).format(pounds);
}

/** Latin digits for WhatsApp, so the restaurant can read amounts without bidi issues. */
export function formatMoneyPlain(amountPiastres: number, locale: AppLocale): string {
  const pounds = amountPiastres / 100;
  const amount = new Intl.NumberFormat("en-EG", {
    minimumFractionDigits: pounds % 1 === 0 ? 0 : 2,
    maximumFractionDigits: 2,
  }).format(pounds);
  return locale === "ar" ? `${amount} ج.م` : `EGP ${amount}`;
}

export function localizedText(
  value: { ar: string | null; en: string | null } | { ar: string; en: string },
  locale: AppLocale,
): string {
  const preferred = value[locale];
  const fallback = locale === "ar" ? value.en : value.ar;
  return preferred || fallback || "—";
}
