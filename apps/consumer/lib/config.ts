import { phones } from "./identity";
import { toWhatsAppDigits } from "./checkout/phone";

/**
 * Restaurant click-to-chat number, digits only, no plus.
 * `NEXT_PUBLIC_WHATSAPP_NUMBER` overrides the WhatsApp order number in restaurant identity.
 * Returns null when neither source is a usable number.
 */
export function getRestaurantWhatsAppNumber(): string | null {
  const fromEnv = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER?.trim();
  const source = fromEnv ? fromEnv : (phones.whatsapp?.e164 ?? "");
  if (!source) return null;
  return toWhatsAppDigits(source);
}
