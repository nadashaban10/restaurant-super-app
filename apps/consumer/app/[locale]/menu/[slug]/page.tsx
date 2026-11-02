import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import { ProductDetailView } from "@/features/catalog/product-detail-view";
import { getProductBySlug, getPublishedProducts } from "@/lib/catalog/catalog";
import { localizedText } from "@/lib/catalog/pricing";
import { productJsonLd } from "@/lib/seo";
import { SITE_URL } from "@/lib/identity";
import { routing, type AppLocale } from "@/i18n/routing";

export function generateStaticParams() {
  const products = getPublishedProducts();
  return routing.locales.flatMap((locale) =>
    products.map((product) => ({ locale, slug: product.slug })),
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  const product = getProductBySlug(slug);
  if (!product) return { robots: { index: false } };
  const name = localizedText(product.title, locale as AppLocale);
  const brand = locale === "ar" ? "كبابجي شعبان" : "Kababgy Shaaban";
  const path = locale === "ar" ? `/menu/${slug}` : `/en/menu/${slug}`;
  const description =
    localizedText(product.description, locale as AppLocale) !== "—"
      ? localizedText(product.description, locale as AppLocale)
      : `${name} — ${brand}`;
  return {
    title: name,
    description,
    alternates: {
      canonical: `${SITE_URL}${path}`,
      languages: {
        ar: `${SITE_URL}/menu/${slug}`,
        en: `${SITE_URL}/en/menu/${slug}`,
        "x-default": `${SITE_URL}/menu/${slug}`,
      },
    },
    openGraph: {
      title: `${name} | ${brand}`,
      description,
      images: product.images[0]
        ? [{ url: `${SITE_URL}${product.images[0].src}` }]
        : [{ url: `${SITE_URL}/brand/logo.jpg` }],
    },
    robots: { index: true, follow: true },
  };
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const product = getProductBySlug(slug);
  if (!product) notFound();

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(productJsonLd(product, locale as AppLocale)),
        }}
      />
      <ProductDetailView product={product} />
    </>
  );
}
