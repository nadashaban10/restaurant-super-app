import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/identity";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: [
        "/cart",
        "/checkout",
        "/wishlist",
        "/en/cart",
        "/en/checkout",
        "/en/wishlist",
        "/api",
      ],
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
