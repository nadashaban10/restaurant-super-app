import { Link } from "@/i18n/navigation";
import type { Category } from "@/lib/catalog/schema";
import type { AppLocale } from "@/i18n/routing";
import { localizedText } from "@/lib/catalog/pricing";

export function CategoryRow({
  categories,
  locale,
  activeId,
  allLabel,
}: {
  categories: Category[];
  locale: AppLocale;
  activeId?: string;
  allLabel: string;
}) {
  const chip =
    "inline-flex min-h-11 shrink-0 items-center rounded-full border px-4 text-sm font-semibold transition";

  return (
    <ul className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-2">
      <li>
        <Link
          href="/menu"
          className={`${chip} ${
            !activeId
              ? "border-[var(--brand-red)] bg-[var(--brand-red)] text-white shadow-sm"
              : "border-[var(--border)] bg-white text-[var(--brand-black)] hover:border-[var(--brand-red)]/40"
          }`}
        >
          {allLabel}
        </Link>
      </li>
      {categories.map((category) => (
        <li key={category.id}>
          <Link
            href={`/menu?category=${category.slug}`}
            className={`${chip} ${
              activeId === category.id
                ? "border-[var(--brand-red)] bg-[var(--brand-red)] text-white shadow-sm"
                : "border-[var(--border)] bg-white text-[var(--brand-black)] hover:border-[var(--brand-red)]/40"
            }`}
          >
            {localizedText(category.name, locale)}
          </Link>
        </li>
      ))}
    </ul>
  );
}
