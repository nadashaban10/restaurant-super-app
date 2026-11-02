import type { MetadataRoute } from "next";
import { getPublishedProducts } from "@/lib/catalog/catalog";
import { SITE_URL } from "@/lib/identity";

export default function sitemap(): MetadataRoute.Sitemap {
  const products = getPublishedProducts();
  const staticRoutes = ["", "/menu"];
  const entries: MetadataRoute.Sitemap = [];

  for (const route of staticRoutes) {
    entries.push({
      url: `${SITE_URL}${route}`,
      alternates: {
        languages: {
          ar: `${SITE_URL}${route}`,
          en: `${SITE_URL}/en${route}`,
        },
      },
    });
  }

  for (const product of products) {
    entries.push({
      url: `${SITE_URL}/menu/${product.slug}`,
      alternates: {
        languages: {
          ar: `${SITE_URL}/menu/${product.slug}`,
          en: `${SITE_URL}/en/menu/${product.slug}`,
        },
      },
    });
  }

  return entries;
}
