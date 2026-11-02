import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import type { AppLocale } from "@/i18n/routing";
import { localizedText } from "@/lib/catalog/pricing";
import { SeeAllLink } from "@/components/shared/see-all-link";

type CategoryCard = {
  id: string;
  slug: string;
  name: { ar: string; en: string };
  description: { ar: string | null; en: string | null };
  productCount: number;
  image: string | null;
};

export async function CategoryGrid({
  categories,
  locale,
}: {
  categories: CategoryCard[];
  locale: AppLocale;
}) {
  const t = await getTranslations();

  return (
    <div>
      <div className="mb-6 flex items-end justify-between gap-3">
        <div>
          <h2 className="text-2xl font-extrabold tracking-tight md:text-3xl">
            {t("home.categories")}
          </h2>
          <p className="mt-1 text-sm text-[var(--muted)]">{t("home.categoriesHint")}</p>
        </div>
        <SeeAllLink />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {categories.slice(0, 6).map((category, index) => {
          const name = localizedText(category.name, locale);
          const rawDescription =
            category.description[locale] ||
            category.description.ar ||
            category.description.en ||
            "";
          const description = rawDescription.trim();
          const src = category.image ?? "/brand/placeholder-product.svg";
          const isSvg = src.endsWith(".svg");

          return (
            <Link
              key={category.id}
              href={`/menu?category=${category.slug}`}
              className="ks-fade-in group relative block min-h-[220px] overflow-hidden rounded-lg bg-[var(--brand-black)] shadow-[var(--shadow-sm)] transition duration-300 hover:-translate-y-1 hover:shadow-[var(--shadow-lg)] sm:min-h-[260px] md:min-h-[280px]"
              style={{ animationDelay: `${Math.min(index, 8) * 40}ms` }}
            >
              {isSvg ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={src}
                  alt=""
                  className="absolute inset-0 h-full w-full object-cover transition duration-500 group-hover:scale-105"
                />
              ) : (
                <Image
                  src={src}
                  alt=""
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  className="object-cover transition duration-500 group-hover:scale-105"
                />
              )}

              {/* Default gradient + title */}
              <span className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent transition duration-300 group-hover:from-black/90 group-hover:via-black/55 group-hover:to-black/35" />

              <span className="absolute inset-x-0 bottom-0 flex flex-col gap-2 p-4 text-white md:p-5">
                <span className="text-lg font-extrabold leading-snug md:text-xl">{name}</span>

                {/* Details: always soft on mobile, reveal more on hover/desktop */}
                <span className="max-h-24 space-y-1.5 overflow-hidden opacity-100 transition duration-300 md:max-h-0 md:translate-y-2 md:opacity-0 md:group-hover:max-h-28 md:group-hover:translate-y-0 md:group-hover:opacity-100 md:group-focus-within:max-h-28 md:group-focus-within:translate-y-0 md:group-focus-within:opacity-100">
                  {description ? (
                    <span className="line-clamp-2 block text-sm leading-relaxed text-white/85">
                      {description}
                    </span>
                  ) : (
                    <span className="block text-sm text-white/80">
                      {t("home.categoryBrowse", { count: category.productCount })}
                    </span>
                  )}
                  <span className="inline-flex items-center gap-1 text-sm font-semibold text-white">
                    {t("home.viewCategory")}
                    <span aria-hidden>→</span>
                  </span>
                </span>
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
