import type { AppLocale } from "@/i18n/routing";
import type { CartQuote } from "@/lib/catalog/catalog";
import { formatMoneyPlain, localizedText } from "@/lib/catalog/pricing";
import type { NormalizedOrder } from "./validate";
import { formatEgyptianMobile } from "./phone";

const copy = {
  ar: {
    heading: "طلب جديد — كبابجي شعبان",
    name: "الاسم",
    phone: "الموبايل",
    whatsapp: "واتساب",
    email: "الإيميل",
    district: "المنطقة",
    address: "العنوان",
    notes: "ملاحظات",
    items: "الأصناف",
    each: "للواحد",
    subtotal: "مجموع الأصناف",
    delivery: "رسوم التوصيل",
    deliveryNote: "يتم تحديدها مع المطعم",
    total: "الإجمالي",
  },
  en: {
    heading: "New order — Kababgy Shaaban",
    name: "Name",
    phone: "Phone",
    whatsapp: "WhatsApp",
    email: "Email",
    district: "District",
    address: "Address",
    notes: "Notes",
    items: "Items",
    each: "each",
    subtotal: "Items subtotal",
    delivery: "Delivery fee",
    deliveryNote: "To be agreed with the restaurant",
    total: "Total",
  },
} as const;

function line(label: string, value: string) {
  return `${label}: ${value}`;
}

export function buildOrderMessage(
  order: NormalizedOrder,
  quote: CartQuote,
  locale: AppLocale,
): string {
  const t = copy[locale];
  const products = quote.items
    .filter((item) => item.isAvailable)
    .map((item) => {
      const title = localizedText(item.title, locale);
      const variant = item.isImplicit ? "" : localizedText(item.variantName, locale);
      const name = variant && variant !== "—" ? `${title} (${variant})` : title;
      const unit = formatMoneyPlain(item.unitFinalAmount, locale);
      const total = formatMoneyPlain(item.lineFinalAmount, locale);
      return `• ${name} × ${item.quantity} — ${unit} ${t.each} — ${total}`;
    });

  const parts = [
    t.heading,
    "",
    line(t.name, order.fullName),
    line(t.phone, formatEgyptianMobile(order.phone)),
  ];

  if (order.whatsapp) parts.push(line(t.whatsapp, formatEgyptianMobile(order.whatsapp)));
  parts.push(line(t.email, order.email));
  parts.push(line(t.district, order.district));
  parts.push(line(t.address, order.address));
  if (order.notes) parts.push(line(t.notes, order.notes));

  parts.push("", t.items, ...products, "");
  parts.push(line(t.subtotal, formatMoneyPlain(quote.subtotalFinalAmount, locale)));
  parts.push(line(t.delivery, t.deliveryNote));
  parts.push(line(t.total, formatMoneyPlain(quote.subtotalFinalAmount, locale)));

  return parts.join("\n");
}

export function buildWhatsAppUrl(phoneDigits: string, message: string): string {
  return `https://wa.me/${phoneDigits}?text=${encodeURIComponent(message)}`;
}
