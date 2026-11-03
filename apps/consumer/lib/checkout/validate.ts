import { normalizeEgyptianMobile } from "./phone";

export const checkoutFields = [
  "fullName",
  "phone",
  "email",
  "district",
  "address",
  "whatsapp",
  "notes",
] as const;

export type CheckoutField = (typeof checkoutFields)[number];

export type CheckoutInput = Record<CheckoutField, string>;

export type CheckoutErrors = Partial<Record<CheckoutField, true>>;

export type NormalizedOrder = {
  fullName: string;
  phone: string;
  email: string;
  district: string;
  address: string;
  whatsapp: string | null;
  notes: string | null;
};

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i;

function collapse(value: string): string {
  return value.trim().replace(/\s+/g, " ");
}

export function validateCheckout(
  input: CheckoutInput,
): { success: true; data: NormalizedOrder } | { success: false; errors: CheckoutErrors } {
  const errors: CheckoutErrors = {};

  const fullName = collapse(input.fullName);
  if (fullName.length < 2 || fullName.length > 80) errors.fullName = true;

  const phone = normalizeEgyptianMobile(input.phone);
  if (!phone) errors.phone = true;

  const email = input.email.trim().toLowerCase();
  if (email.length > 120 || !EMAIL.test(email)) errors.email = true;

  const district = collapse(input.district);
  if (district.length < 2 || district.length > 80) errors.district = true;

  const address = collapse(input.address);
  if (address.length < 5 || address.length > 300) errors.address = true;

  const whatsappRaw = input.whatsapp.trim();
  let whatsapp: string | null = null;
  if (whatsappRaw) {
    whatsapp = normalizeEgyptianMobile(whatsappRaw);
    if (!whatsapp) errors.whatsapp = true;
  }

  const notes = collapse(input.notes);
  if (notes.length > 500) errors.notes = true;

  if (Object.keys(errors).length > 0) return { success: false, errors };

  return {
    success: true,
    data: {
      fullName,
      phone: phone as string,
      email,
      district,
      address,
      whatsapp,
      notes: notes || null,
    },
  };
}

export function firstCheckoutError(errors: CheckoutErrors): CheckoutField | null {
  return checkoutFields.find((field) => errors[field]) ?? null;
}
