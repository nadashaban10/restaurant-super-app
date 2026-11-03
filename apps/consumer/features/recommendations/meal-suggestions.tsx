"use client";

import { useMemo, useState, type ReactNode } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { ProductImage } from "@/components/product/product-image";
import { Spinner } from "@/components/ui/spinner";
import { getCategories } from "@/lib/catalog/catalog";
import { recommendAddonGroups, recommendAddonPicks, recommendForProducts } from "@/lib/recommendations/recommend";
import type { AddonGroupId } from "@/lib/recommendations/rules";
import { formatMoney, getDefaultVariant, localizedText, priceVariant } from "@/lib/catalog/pricing";
import type { Product } from "@/lib/catalog/schema";
import type { AppLocale } from "@/i18n/routing";
import { useCartStore } from "@/stores/cart-store";
import { useToastStore } from "@/stores/toast-store";
import { briefActionDelay } from "@/lib/ui";

function useAnchorKeys(productIds: string[]) {
  const items = useCartStore((state) => state.items);
  const anchorKey = productIds.join("|");
  const excludeKey = items.map((item) => item.productId).join("|");
  return { anchorKey, excludeKey };
}

export function useRecommendations(productIds: string[], limit: number): Product[] {
  const { anchorKey, excludeKey } = useAnchorKeys(productIds);

  return useMemo(() => {
    if (!anchorKey || limit < 1) return [];
    const exclude = excludeKey ? excludeKey.split("|") : [];
    return recommendForProducts(anchorKey.split("|"), exclude, limit);
  }, [anchorKey, excludeKey, limit]);
}

export function useAddonPicks(productIds: string[], groupIds: readonly AddonGroupId[], limit: number): Product[] {
  const { anchorKey, excludeKey } = useAnchorKeys(productIds);
  const groupKey = groupIds.join("|");

  return useMemo(() => {
    if (!anchorKey || limit < 1 || !groupKey) return [];
    const exclude = excludeKey ? excludeKey.split("|") : [];
    return recommendAddonPicks(anchorKey.split("|"), exclude, groupKey.split("|") as AddonGroupId[], limit);
  }, [anchorKey, excludeKey, groupKey, limit]);
}

export function useAddonGroups(productIds: string[]) {
  const { anchorKey, excludeKey } = useAnchorKeys(productIds);

  return useMemo(() => {
    if (!anchorKey) return [];
    const exclude = excludeKey ? excludeKey.split("|") : [];
    return recommendAddonGroups(anchorKey.split("|"), exclude);
  }, [anchorKey, excludeKey]);
}

export function MealSuggestions({
  productIds,
  title,
  hint,
  limit,
  groups,
  compact = false,
  action,
  className = "",
}: {
  productIds: string[];
  title: string;
  hint?: string;
  limit: number;
  groups?: readonly AddonGroupId[];
  compact?: boolean;
  action?: ReactNode;
  className?: string;
}) {
  const recommended = useRecommendations(productIds, groups ? 0 : limit);
  const picks = useAddonPicks(productIds, groups ?? [], groups ? limit : 0);
  const products = groups ? picks : recommended;
  if (products.length === 0) return null;

  return (
    <section aria-label={title} className={`min-w-0 ${className}`}>
      <div className="mb-3 flex items-start justify-between gap-3">
        <div>
          <h2 className={compact ? "text-base font-extrabold" : "text-xl font-extrabold"}>{title}</h2>
          {hint ? <p className="mt-1 text-sm leading-relaxed text-[var(--muted)]">{hint}</p> : null}
        </div>
        {action}
      </div>
      <SuggestionStrip products={products} compact={compact} />
    </section>
  );
}

export function AddonGroupRows({
  productIds,
  title,
  hint,
  className = "",
}: {
  productIds: string[];
  title: string;
  hint?: string;
  className?: string;
}) {
  const t = useTranslations();
  const groups = useAddonGroups(productIds);
  if (groups.length === 0) return null;

  return (
    <section aria-label={title} className={`min-w-0 ${className}`}>
      <h2 className="text-xl font-extrabold">{title}</h2>
      {hint ? <p className="mt-1 text-sm leading-relaxed text-[var(--muted)]">{hint}</p> : null}
      <div className="mt-4 flex flex-col gap-5">
        {groups.map((group) => (
          <div key={group.id} className="min-w-0">
            <h3 className="mb-2 text-base font-extrabold">{t(`suggest.${group.id}`)}</h3>
            <SuggestionStrip products={group.products} />
          </div>
        ))}
      </div>
    </section>
  );
}

function SuggestionStrip({ products, compact = false }: { products: Product[]; compact?: boolean }) {
  return (
    <ul className="-mx-1 flex w-full min-w-0 snap-x gap-3 overflow-x-auto px-1 pb-1">
      {products.map((product) => (
        <li key={product.id} className="snap-start">
          <SuggestionCard product={product} compact={compact} />
        </li>
      ))}
    </ul>
  );
}

function SuggestionCard({ product, compact }: { product: Product; compact: boolean }) {
  const t = useTranslations();
  const locale = useLocale() as AppLocale;
  const addItem = useCartStore((state) => state.addItem);
  const showToast = useToastStore((state) => state.show);
  const [busy, setBusy] = useState(false);
  const variant = getDefaultVariant(product);
  const price = formatMoney(priceVariant(product, variant).finalAmount, locale);
  const category = getCategories().find((item) => item.id === product.categoryId);
  const description = product.description[locale] || product.description.ar || product.description.en;
  const title = localizedText(product.title, locale);

  async function add() {
    if (busy || !variant) return;
    setBusy(true);
    try {
      await briefActionDelay(180);
      addItem(product.id, variant.id, 1);
      showToast(t("toast.added"), "success");
    } finally {
      setBusy(false);
    }
  }

  return (
    <article
      className={`flex flex-col overflow-hidden rounded-2xl border border-[var(--border)] bg-white shadow-[var(--shadow-sm)] ${
        compact ? "w-[8.5rem]" : "w-[10.25rem]"
      }`}
    >
      <Link href={`/menu/${product.slug}`} className="block">
        <ProductImage src={product.images[0]?.src} alt={product.title} sizes="160px" />
      </Link>
      <div className="flex flex-1 flex-col gap-1.5 p-2.5">
        {category ? (
          <p className="text-[11px] font-bold tracking-wide text-[var(--brand-red)]">
            {localizedText(category.name, locale)}
          </p>
        ) : null}
        <Link href={`/menu/${product.slug}`} className="line-clamp-2 text-sm font-extrabold leading-snug">
          {title}
        </Link>
        {description && !compact ? (
          <p className="line-clamp-2 text-xs leading-relaxed text-[var(--muted)]">{description}</p>
        ) : null}
        <p className="text-sm font-extrabold text-[var(--brand-red)]">{price}</p>
        <button
          type="button"
          onClick={() => void add()}
          disabled={busy || !product.isAvailable}
          className="ks-pressable mt-auto inline-flex min-h-11 items-center justify-center gap-1.5 rounded-xl bg-[var(--brand-red)] px-2 text-sm font-bold text-white hover:bg-[var(--brand-red-hover)] disabled:opacity-50"
        >
          {busy ? <Spinner /> : t("suggest.add")}
        </button>
      </div>
    </article>
  );
}
