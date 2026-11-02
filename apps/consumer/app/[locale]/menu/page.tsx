import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { CategoryRow } from "@/components/home/category-row";
import { ProductCard } from "@/components/product/product-card";
import { getCategories, getPublishedProducts } from "@/lib/catalog/catalog";
import { identity, SITE_URL } from "@/lib/identity";
import type { AppLocale } from "@/i18n/routing";
import { localizedText } from "@/lib/catalog/pricing";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const title = locale === "ar" ? "المنيو" : "Menu";
  const brand = locale === "ar" ? "كبابجي شعبان" : "Kababgy Shaaban";
  const path = locale === "ar" ? "/menu" : "/en/menu";
  return {
    title,
    description: identity.lockedCopy[locale as AppLocale].siteDescription,
    alternates: {
      canonical: `${SITE_URL}${path}`,
      languages: { ar: `${SITE_URL}/menu`, en: `${SITE_URL}/en/menu`, "x-default": `${SITE_URL}/menu` },
    },
    robots: { index: true, follow: true },
    openGraph: {
      title: `${title} | ${brand}`,
      images: [{ url: `${SITE_URL}/brand/banners/hero-grill.jpg` }],
    },
  };
}

export default async function MenuPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ category?: string }>;
}) {
  const { locale } = await params;
  const { category: categorySlug } = await searchParams;
  setRequestLocale(locale);
  const t = await getTranslations();
  const categories = getCategories();
  const active = categories.find((c) => c.slug === categorySlug);
  const products = getPublishedProducts().filter((p) =>
    active ? p.categoryId === active.id : true,
  );

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 md:py-10">
      <div className="mb-6">
        <h1 className="text-3xl font-extrabold tracking-tight md:text-4xl">{t("nav.menu")}</h1>
        {active ? (
          <p className="mt-2 text-[var(--muted)]">
            {localizedText(active.name, locale as AppLocale)} · {products.length}{" "}
            {t("home.items")}
          </p>
        ) : (
          <p className="mt-2 text-[var(--muted)]">
            {products.length} {t("home.items")}
          </p>
        )}
      </div>
      <CategoryRow
        categories={categories}
        locale={locale as AppLocale}
        activeId={active?.id}
      />
      {products.length === 0 ? (
        <p className="mt-10 text-center text-[var(--muted)]">{t("cart.empty")}</p>
      ) : (
        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}
