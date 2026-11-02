import { Link } from "@/i18n/navigation";
import type { Category } from "@/lib/catalog/schema";
import type { AppLocale } from "@/i18n/routing";
import { localizedText } from "@/lib/catalog/pricing";

export function CategoryRow({
  categories,
  locale,
  activeId,
}: {
  categories: Category[];
  locale: AppLocale;
  activeId?: string;
}) {
  return (
    <div className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-2" role="list">
      <Link
        href="/menu"
        role="listitem"
        className={`min-h-11 shrink-0 rounded-full border px-4 text-sm font-semibold leading-[44px] transition ${
          !activeId
            ? "border-[var(--brand-red)] bg-[var(--brand-red)] text-white shadow-sm"
            : "border-[var(--border)] bg-white text-[var(--brand-black)] hover:border-[var(--brand-red)]/40"
        }`}
      >
        {locale === "ar" ? "الكل" : "All"}
      </Link>
      {categories.map((category) => (
        <Link
          key={category.id}
          href={`/menu?category=${category.slug}`}
          role="listitem"
          className={`min-h-11 shrink-0 rounded-full border px-4 text-sm font-semibold leading-[44px] transition ${
            activeId === category.id
              ? "border-[var(--brand-red)] bg-[var(--brand-red)] text-white shadow-sm"
              : "border-[var(--border)] bg-white text-[var(--brand-black)] hover:border-[var(--brand-red)]/40"
          }`}
        >
          {localizedText(category.name, locale)}
        </Link>
      ))}
    </div>
  );
}
