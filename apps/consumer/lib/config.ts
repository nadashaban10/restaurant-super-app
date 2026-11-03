import { phones } from "./identity";
import { toWhatsAppDigits } from "./checkout/phone";

/**
 * Restaurant click-to-chat number, digits only, no plus.
 * `NEXT_PUBLIC_WHATSAPP_NUMBER` overrides the primary phone in restaurant identity.
 * Returns null when neither source is a usable number.
 */
export function getRestaurantWhatsAppNumber(): string | null {
  const fromEnv = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER?.trim();
  const source = fromEnv ? fromEnv : (phones.primary?.e164 ?? "");
  if (!source) return null;
  return toWhatsAppDigits(source);
}

/**
 * Flat delivery fee in piastres (1 EGP = 100).
 * Set `NEXT_PUBLIC_DELIVERY_FEE_EGP` in pounds, for example `20`.
 * This is the only place the fee is read. Quote math adds it once.
 * Swap this function when fees depend on district.
 */
export function getDeliveryFeeAmount(): number {
  const raw = process.env.NEXT_PUBLIC_DELIVERY_FEE_EGP;
  if (raw == null || raw.trim() === "") return 2000;
  const pounds = Number(raw);
  if (!Number.isFinite(pounds) || pounds < 0 || pounds > 10000) return 2000;
  return Math.round(pounds * 100);
}
