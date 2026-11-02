import { identity, phones, SITE_URL } from "./identity";
import type { AppLocale } from "@/i18n/routing";
import type { Product } from "./catalog/schema";
import { localizedText } from "./catalog/pricing";
import { priceVariant } from "./catalog/pricing";

export function homeMetadata(locale: AppLocale) {
  const copy = identity.lockedCopy[locale];
  return {
    title: { absolute: copy.siteTitle },
    description: copy.siteDescription,
    openGraph: {
      title: copy.ogTitle,
      description: copy.siteDescription,
      locale: locale === "ar" ? "ar_EG" : "en_US",
      type: "website" as const,
      url: locale === "ar" ? SITE_URL : `${SITE_URL}/en`,
      images: [{ url: `${SITE_URL}/brand/banners/hero-grill.jpg` }],
    },
    twitter: {
      card: "summary_large_image" as const,
      title: copy.ogTitle,
      description: copy.siteDescription,
    },
    alternates: {
      canonical: locale === "ar" ? SITE_URL : `${SITE_URL}/en`,
      languages: {
        ar: SITE_URL,
        en: `${SITE_URL}/en`,
        "x-default": SITE_URL,
      },
    },
    robots: { index: true, follow: true },
  };
}

export function productJsonLd(product: Product, locale: AppLocale) {
  return {
    "@context": "https://schema.org",
    "@type": "MenuItem",
    name: localizedText(product.title, locale),
    description: localizedText(product.description, locale) || undefined,
    image: product.images[0]?.src
      ? `${SITE_URL}${product.images[0].src}`
      : undefined,
    offers: product.variants.map((variant) => {
      const money = priceVariant(product, variant);
      return {
        "@type": "Offer",
        price: (money.finalAmount / 100).toFixed(2),
        priceCurrency: "EGP",
        availability: product.isAvailable
          ? "https://schema.org/InStock"
          : "https://schema.org/OutOfStock",
        name: localizedText(variant.name, locale),
      };
    }),
  };
}

export function restaurantJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": ["Restaurant", "LocalBusiness"],
    name: identity.restaurantIdentity.arabicName,
    alternateName: identity.restaurantIdentity.officialName,
    description: identity.restaurantIdentity.description,
    image: `${SITE_URL}/brand/logo.jpg`,
    url: SITE_URL,
    telephone: [phones.primary.e164, phones.secondary.e164],
    servesCuisine: identity.seo.servesCuisine,
    priceRange: identity.seo.priceRange,
    address: {
      "@type": "PostalAddress",
      streetAddress: identity.seo.locality,
      addressLocality: identity.seo.district,
      addressRegion: identity.seo.city,
      addressCountry: identity.seo.country,
    },
    openingHoursSpecification: {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
        "Sunday",
      ],
      opens: "00:00",
      closes: "24:00",
    },
    sameAs: [identity.seo.facebook],
    hasMenu: `${SITE_URL}/menu`,
    contactPoint: [
      {
        "@type": "ContactPoint",
        telephone: phones.primary.e164,
        contactType: "reservations",
      },
      {
        "@type": "ContactPoint",
        telephone: phones.complaints.e164,
        contactType: "customer support",
      },
    ],
  };
}
