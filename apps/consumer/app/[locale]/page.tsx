import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { dehydrate, HydrationBoundary, QueryClient } from "@tanstack/react-query";
import { Hero } from "@/components/home/hero";
import { BannerStrip } from "@/components/home/banner-strip";
import { CategoryGrid } from "@/components/home/category-grid";
import { ProductCard } from "@/components/product/product-card";
import { SeeAllLink } from "@/components/shared/see-all-link";
import {
  catalogQueryKey,
  getCatalog,
  getCategoryCards,
  getFeaturedProducts,
  getPromoBanners,
} from "@/lib/catalog/catalog";
import { homeMetadata, restaurantJsonLd } from "@/lib/seo";
import type { AppLocale } from "@/i18n/routing";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return homeMetadata(locale as AppLocale);
}

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations();
  const queryClient = new QueryClient();
  await queryClient.prefetchQuery({
    queryKey: catalogQueryKey,
    queryFn: async () => getCatalog(),
  });
  const featured = getFeaturedProducts();
  const categories = getCategoryCards();
  const banners = getPromoBanners();

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(restaurantJsonLd()) }}
      />
      <Hero locale={locale as AppLocale} />
      <BannerStrip banners={banners} locale={locale as AppLocale} />
      <section className="mx-auto max-w-6xl px-4 py-10">
        <CategoryGrid categories={categories} locale={locale as AppLocale} />
      </section>
      <section className="mx-auto max-w-6xl px-4 pb-14">
        <div className="mb-5 flex items-end justify-between gap-3">
          <div>
            <h2 className="text-2xl font-extrabold tracking-tight md:text-3xl">
              {t("home.featured")}
            </h2>
          </div>
          <SeeAllLink />
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {featured.map((product, index) => (
            <ProductCard key={product.id} product={product} priority={index < 2} />
          ))}
        </div>
      </section>
    </HydrationBoundary>
  );
}
