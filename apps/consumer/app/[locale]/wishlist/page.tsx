import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { WishlistView } from "@/features/wishlist/wishlist-view";

export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default async function WishlistPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <WishlistView />;
}
