import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { CheckoutView } from "@/features/checkout/checkout-view";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return {
    title: locale === "ar" ? "إتمام الطلب" : "Checkout",
    robots: { index: false, follow: false },
  };
}

export default async function CheckoutPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <CheckoutView />;
}
