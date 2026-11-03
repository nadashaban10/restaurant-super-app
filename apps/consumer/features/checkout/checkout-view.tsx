"use client";

import { cloneElement, isValidElement, useState, type ReactElement, type ReactNode } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { quoteCart } from "@/lib/catalog/catalog";
import { formatMoney, localizedText } from "@/lib/catalog/pricing";
import { getRestaurantWhatsAppNumber } from "@/lib/config";
import { buildOrderMessage, buildWhatsAppUrl } from "@/lib/checkout/message";
import { firstCheckoutError, validateCheckout, type CheckoutField } from "@/lib/checkout/validate";
import { phones } from "@/lib/identity";
import type { AppLocale } from "@/i18n/routing";
import { useCartStore } from "@/stores/cart-store";
import { useCheckoutStore } from "@/stores/checkout-store";
import { OrderTotals } from "@/features/order/order-totals";
import { MealSuggestions } from "@/features/recommendations/meal-suggestions";
import { checkoutAddonGroups, recommendationLimits } from "@/lib/recommendations/rules";
import { IconCart, IconWhatsApp } from "@/components/ui/icons";
import { Spinner } from "@/components/ui/spinner";
import { CheckoutSkeleton } from "@/components/ui/skeletons";
import { usePersistHydrated } from "@/hooks/use-persist-hydrated";
import { briefActionDelay } from "@/lib/ui";

const inputClass =
  "w-full min-w-0 max-w-full rounded-xl border bg-white px-3 text-base text-[var(--brand-black)] outline-none transition placeholder:text-[var(--muted)] focus:border-[var(--brand-red)]";

export function CheckoutView() {
  const t = useTranslations();
  const locale = useLocale() as AppLocale;
  const cartReady = usePersistHydrated(useCartStore.persist);
  const draftReady = usePersistHydrated(useCheckoutStore.persist);
  const items = useCartStore((s) => s.items);
  const draft = useCheckoutStore((s) => s.draft);
  const setField = useCheckoutStore((s) => s.setField);
  const [errors, setErrors] = useState<Partial<Record<CheckoutField, true>>>({});
  const [handedOff, setHandedOff] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [inputFocused, setInputFocused] = useState(false);
  const whatsappNumber = getRestaurantWhatsAppNumber();

  const quote = useQuery({
    queryKey: ["cart-quote", items],
    queryFn: () => quoteCart(items),
    enabled: cartReady && items.length > 0,
  });

  if (!cartReady || !draftReady) {
    return <CheckoutSkeleton />;
  }

  if (!items.length) {
    return (
      <div className="mx-auto max-w-xl px-4 py-20 text-center">
        <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full border border-[var(--border)] bg-white text-[var(--brand-red)] shadow-[var(--shadow-sm)]">
          <IconCart size={28} />
        </div>
        <h1 className="mb-3 text-3xl font-extrabold">{t("checkout.title")}</h1>
        <p className="mb-8 text-[var(--muted)]">{t("checkout.empty")}</p>
        <Link
          href="/menu"
          className="ks-pressable inline-flex min-h-12 items-center rounded-xl bg-[var(--brand-red)] px-6 font-bold text-white shadow-sm transition hover:bg-[var(--brand-red-hover)]"
        >
          {t("checkout.emptyCta")}
        </Link>
      </div>
    );
  }

  const data = quote.data;
  const hasUnavailable = (data?.unavailableItemIds.length ?? 0) > 0;
  const canSubmit = Boolean(whatsappNumber) && Boolean(data) && !hasUnavailable && data!.items.some((item) => item.isAvailable);

  function update(field: CheckoutField, value: string) {
    setField(field, value);
    setHandedOff(false);
    setErrors((current) => {
      if (!current[field]) return current;
      const next = { ...current };
      delete next[field];
      return next;
    });
  }

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (submitting) return;
    setHandedOff(false);

    const result = validateCheckout(draft);
    if (!result.success) {
      setErrors(result.errors);
      const field = firstCheckoutError(result.errors);
      if (field) {
        const el = document.getElementById(`checkout-${field}`);
        const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        el?.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "center" });
        el?.focus();
      }
      return;
    }

    const latest = quoteCart(useCartStore.getState().items);
    if (latest.unavailableItemIds.length > 0 || !latest.items.some((item) => item.isAvailable)) {
      document.getElementById("order-summary")?.scrollIntoView({ block: "center" });
      return;
    }

    const number = getRestaurantWhatsAppNumber();
    if (!number) return;

    setSubmitting(true);
    try {
      await briefActionDelay(220);
      const url = buildWhatsAppUrl(number, buildOrderMessage(result.data, latest, locale));
      setHandedOff(true);
      // `noopener` makes Chrome return null even when the tab opens, which would
      // also redirect this page. Drop the opener after a normal open instead.
      const popup = window.open(url, "_blank");
      if (popup) {
        popup.opener = null;
        return;
      }
      window.location.assign(url);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form
      id="checkout-form"
      noValidate
      onSubmit={onSubmit}
      className={`mx-auto w-full min-w-0 max-w-6xl px-4 py-8 md:py-12 ${whatsappNumber ? "pb-36 lg:pb-12" : ""}`}
      onFocusCapture={(event) => {
        const tag = (event.target as HTMLElement).tagName;
        if (tag === "INPUT" || tag === "TEXTAREA") setInputFocused(true);
      }}
      onBlurCapture={() => {
        window.setTimeout(() => {
          const tag = document.activeElement?.tagName;
          setInputFocused(tag === "INPUT" || tag === "TEXTAREA");
        }, 0);
      }}
    >
      <div className="mb-6">
        <h1 className="text-3xl font-extrabold tracking-tight md:text-4xl">{t("checkout.title")}</h1>
        <p className="mt-2 max-w-2xl text-base leading-relaxed text-[var(--muted)]">{t("checkout.intro")}</p>
      </div>

      <div className="grid min-w-0 items-start gap-6 lg:grid-cols-[minmax(0,1fr)_22rem]">
        <section className="min-w-0 rounded-[var(--radius-xl)] border border-[var(--border)] bg-white p-4 shadow-[var(--shadow-sm)] sm:p-6">
          <h2 className="text-xl font-extrabold">{t("checkout.customer")}</h2>
          <p className="mt-1 text-sm text-[var(--muted)]">{t("checkout.requiredHint")}</p>

          {Object.keys(errors).length > 0 ? (
            <p className="mt-4 rounded-xl bg-[var(--danger-soft)] px-3 py-3 text-sm font-medium text-[var(--danger)]" role="alert">
              {t("checkout.fixErrors")}
            </p>
          ) : null}

          <div className="mt-5 grid gap-4">
            <Field
              id="checkout-fullName"
              label={t("checkout.fullName")}
              required
              error={errors.fullName ? t("checkout.errors.fullName") : undefined}
            >
              <input
                id="checkout-fullName"
                name="fullName"
                autoComplete="name"
                value={draft.fullName}
                placeholder={t("checkout.fullNamePlaceholder")}
                aria-invalid={errors.fullName || undefined}
                onChange={(event) => update("fullName", event.target.value)}
                className={`${inputClass} min-h-12 ${errors.fullName ? "border-[var(--danger)]" : "border-[var(--border)]"}`}
              />
            </Field>

            <Field
              id="checkout-phone"
              label={t("checkout.phone")}
              required
              error={errors.phone ? t("checkout.errors.phone") : undefined}
            >
              <input
                id="checkout-phone"
                name="phone"
                type="tel"
                inputMode="tel"
                autoComplete="tel"
                dir="ltr"
                value={draft.phone}
                placeholder={t("checkout.phonePlaceholder")}
                aria-invalid={errors.phone || undefined}
                onChange={(event) => update("phone", event.target.value)}
                className={`${inputClass} min-h-12 text-left ${errors.phone ? "border-[var(--danger)]" : "border-[var(--border)]"}`}
              />
            </Field>

            <Field
              id="checkout-email"
              label={t("checkout.email")}
              required
              error={errors.email ? t("checkout.errors.email") : undefined}
            >
              <input
                id="checkout-email"
                name="email"
                type="email"
                inputMode="email"
                autoComplete="email"
                dir="ltr"
                value={draft.email}
                placeholder={t("checkout.emailPlaceholder")}
                aria-invalid={errors.email || undefined}
                onChange={(event) => update("email", event.target.value)}
                className={`${inputClass} min-h-12 text-left ${errors.email ? "border-[var(--danger)]" : "border-[var(--border)]"}`}
              />
            </Field>

            <Field
              id="checkout-district"
              label={t("checkout.district")}
              required
              error={errors.district ? t("checkout.errors.district") : undefined}
            >
              <input
                id="checkout-district"
                name="district"
                autoComplete="address-level2"
                value={draft.district}
                placeholder={t("checkout.districtPlaceholder")}
                aria-invalid={errors.district || undefined}
                onChange={(event) => update("district", event.target.value)}
                className={`${inputClass} min-h-12 ${errors.district ? "border-[var(--danger)]" : "border-[var(--border)]"}`}
              />
            </Field>

            <Field
              id="checkout-address"
              label={t("checkout.address")}
              required
              error={errors.address ? t("checkout.errors.address") : undefined}
            >
              <textarea
                id="checkout-address"
                name="address"
                autoComplete="street-address"
                rows={3}
                value={draft.address}
                placeholder={t("checkout.addressPlaceholder")}
                aria-invalid={errors.address || undefined}
                onChange={(event) => update("address", event.target.value)}
                className={`${inputClass} min-h-24 py-3 ${errors.address ? "border-[var(--danger)]" : "border-[var(--border)]"}`}
              />
            </Field>

            <Field
              id="checkout-whatsapp"
              label={t("checkout.whatsapp")}
              hint={t("checkout.whatsappHint")}
              optionalLabel={t("checkout.optional")}
              error={errors.whatsapp ? t("checkout.errors.whatsapp") : undefined}
            >
              <input
                id="checkout-whatsapp"
                name="whatsapp"
                type="tel"
                inputMode="tel"
                autoComplete="tel"
                dir="ltr"
                value={draft.whatsapp}
                placeholder={t("checkout.whatsappPlaceholder")}
                aria-invalid={errors.whatsapp || undefined}
                onChange={(event) => update("whatsapp", event.target.value)}
                className={`${inputClass} min-h-12 text-left ${errors.whatsapp ? "border-[var(--danger)]" : "border-[var(--border)]"}`}
              />
            </Field>

            <Field
              id="checkout-notes"
              label={t("checkout.notes")}
              optionalLabel={t("checkout.optional")}
              error={errors.notes ? t("checkout.errors.notes") : undefined}
            >
              <textarea
                id="checkout-notes"
                name="notes"
                rows={3}
                value={draft.notes}
                placeholder={t("checkout.notesPlaceholder")}
                aria-invalid={errors.notes || undefined}
                onChange={(event) => update("notes", event.target.value)}
                className={`${inputClass} min-h-24 py-3 ${errors.notes ? "border-[var(--danger)]" : "border-[var(--border)]"}`}
              />
            </Field>
          </div>
        </section>

        <aside id="order-summary" className="min-w-0 lg:sticky lg:top-[calc(var(--header-offset)+0.75rem)]">
          <div className="min-w-0 overflow-hidden rounded-[var(--radius-xl)] border border-[var(--border)] bg-white p-5 shadow-[var(--shadow-md)]">
            <div className="mb-4 flex items-center justify-between gap-3">
              <h2 className="text-lg font-extrabold">{t("cart.summary")}</h2>
              <Link href="/cart" className="min-h-11 text-sm font-bold text-[var(--brand-red)]">
                {t("checkout.backToCart")}
              </Link>
            </div>

            {!data ? (
              <div className="space-y-3" aria-busy="true">
                <div className="ks-skeleton h-12 w-full rounded-md" />
                <div className="ks-skeleton h-12 w-full rounded-md" />
                <div className="ks-skeleton h-4 w-full rounded-md" />
              </div>
            ) : (
              <>
                <ul className="mb-4 max-h-80 space-y-3 overflow-auto pe-1">
                  {data.items.map((item) => {
                    const title = localizedText(item.title, locale);
                    const variant = item.isImplicit ? "" : localizedText(item.variantName, locale);
                    return (
                      <li key={`${item.productId}:${item.variantId}`} className="flex items-start justify-between gap-3 text-sm">
                        <div className="min-w-0">
                          <p className="font-bold leading-snug">
                            {title === "—" ? t("cart.unavailableItem") : title}
                          </p>
                          {variant && variant !== "—" ? (
                            <p className="text-[var(--muted)]">{variant}</p>
                          ) : null}
                          {item.isAvailable ? (
                            <p className="text-[var(--muted)]">
                              {formatMoney(item.unitFinalAmount, locale)} × {item.quantity}
                            </p>
                          ) : (
                            <p className="font-semibold text-[var(--danger)]">{t("product.soldOut")}</p>
                          )}
                        </div>
                        {item.isAvailable ? (
                          <p className="shrink-0 font-bold">{formatMoney(item.lineFinalAmount, locale)}</p>
                        ) : null}
                      </li>
                    );
                  })}
                </ul>
                <OrderTotals
                  locale={locale}
                  subtotalFinalAmount={data.subtotalFinalAmount}
                  totalAmount={data.totalAmount}
                />
              </>
            )}

            <MealSuggestions
              className="mt-5"
              productIds={[...new Set(items.map((item) => item.productId))]}
              title={t("suggest.extra")}
              hint={t("suggest.extraHint")}
              limit={recommendationLimits.checkout}
              groups={checkoutAddonGroups}
              compact
            />

            {hasUnavailable ? (
              <p className="mt-4 rounded-xl bg-[var(--warning-soft)] px-3 py-3 text-sm font-medium leading-relaxed text-[var(--warning)]" role="alert">
                {t("cart.unavailable")}
              </p>
            ) : null}

            <div className="mt-5 flex flex-col gap-3">
              {whatsappNumber ? (
                <button
                  type="submit"
                  disabled={!canSubmit || submitting}
                  className="ks-pressable inline-flex min-h-14 w-full items-center justify-center gap-2 rounded-xl bg-[#128C7E] px-4 text-base font-extrabold text-white shadow-sm transition hover:bg-[#075E54] disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {submitting ? <Spinner className="h-5 w-5" /> : <IconWhatsApp className="h-5 w-5" />}
                  {t("checkout.confirm")}
                </button>
              ) : (
                <div className="rounded-xl bg-[var(--warning-soft)] px-3 py-3 text-sm leading-relaxed text-[var(--warning)]" role="alert">
                  <p className="font-medium">{t("checkout.missingWhatsapp")}</p>
                  <a href={`tel:${phones.primary.e164}`} className="mt-2 inline-flex min-h-11 items-center font-extrabold text-[var(--brand-red)]">
                    {phones.primary.displayAr}
                  </a>
                </div>
              )}
              <p className="text-sm leading-relaxed text-[var(--muted)]">{t("checkout.explain")}</p>
              {handedOff ? (
                <p className="rounded-xl bg-[var(--warning-soft)] px-3 py-3 text-sm font-medium leading-relaxed text-[var(--warning)]" role="status">
                  {t("checkout.pending")}
                </p>
              ) : null}
            </div>
          </div>
        </aside>
      </div>

      {whatsappNumber && !inputFocused ? (
        <div className="fixed inset-x-0 bottom-0 z-30 overflow-hidden border-t border-[var(--border)] bg-white p-3 shadow-[var(--shadow-lg)] lg:hidden">
          <div className="mx-auto flex w-full min-w-0 max-w-6xl items-center gap-3">
            <div className="min-w-0 shrink">
              <p className="text-xs text-[var(--muted)]">{t("cart.total")}</p>
              <p className="text-base font-extrabold text-[var(--brand-red)]">
                {data ? formatMoney(data.totalAmount, locale) : "…"}
              </p>
            </div>
            <button
              type="submit"
              disabled={!canSubmit || submitting}
              className="ks-pressable inline-flex min-h-12 min-w-0 flex-1 items-center justify-center gap-2 rounded-xl bg-[#128C7E] px-3 text-sm font-extrabold text-white disabled:cursor-not-allowed disabled:opacity-50"
            >
              {submitting ? <Spinner className="h-5 w-5 shrink-0" /> : <IconWhatsApp className="h-5 w-5 shrink-0" />}
              <span className="truncate">{t("checkout.confirm")}</span>
            </button>
          </div>
        </div>
      ) : null}
    </form>
  );
}

function Field({
  id,
  label,
  required = false,
  optionalLabel,
  hint,
  error,
  children,
}: {
  id: string;
  label: string;
  required?: boolean;
  optionalLabel?: string;
  hint?: string;
  error?: string;
  children: ReactNode;
}) {
  const hintId = hint ? `${id}-hint` : undefined;
  const errorId = error ? `${id}-error` : undefined;
  const describedBy = [hintId, errorId].filter(Boolean).join(" ") || undefined;
  const control = isValidElement(children)
    ? cloneElement(children as ReactElement<{ "aria-describedby"?: string; "aria-required"?: boolean }>, {
        "aria-describedby": describedBy,
        "aria-required": required || undefined,
      })
    : children;

  return (
    <div>
      <label htmlFor={id} className="mb-1.5 flex items-baseline justify-between gap-3">
        <span className="text-sm font-bold">
          {label}
          {required ? (
            <span className="ms-1 text-[var(--brand-red)]" aria-hidden>
              *
            </span>
          ) : null}
        </span>
        {optionalLabel ? <span className="text-xs font-medium text-[var(--muted)]">{optionalLabel}</span> : null}
      </label>
      {hint ? (
        <p id={hintId} className="mb-1.5 text-sm text-[var(--muted)]">
          {hint}
        </p>
      ) : null}
      {control}
      {error ? (
        <p id={errorId} className="mt-1.5 text-sm font-medium text-[var(--danger)]" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}
