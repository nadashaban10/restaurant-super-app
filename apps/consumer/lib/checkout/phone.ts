const ARABIC_INDIC = "٠١٢٣٤٥٦٧٨٩";
const EXTENDED_ARABIC_INDIC = "۰۱۲۳۴۵۶۷۸۹";

/** Fold Arabic-Indic digits to ASCII, then keep digits only. */
export function digitsOnly(input: string): string {
  const ascii = input.replace(/[٠-٩۰-۹]/g, (digit) => {
    const arabic = ARABIC_INDIC.indexOf(digit);
    if (arabic >= 0) return String(arabic);
    return String(EXTENDED_ARABIC_INDIC.indexOf(digit));
  });
  return ascii.replace(/\D/g, "");
}

/**
 * Egyptian mobile numbers: 010, 011, 012, 015.
 * Accepts local, +20, and 0020 forms, with spaces or dashes.
 * Returns the national number `01xxxxxxxxx`, or null.
 */
export function normalizeEgyptianMobile(input: string): string | null {
  let national = digitsOnly(input);
  if (!national) return null;

  if (national.startsWith("0020")) national = national.slice(4);
  else if (national.startsWith("20") && (national.length === 12 || national.length === 13)) {
    national = national.slice(2);
  }

  if (national.length === 10 && national.startsWith("1")) national = `0${national}`;
  if (!/^01[0125]\d{8}$/.test(national)) return null;
  return national;
}

/** `01154626325` → `011 5462 6325`. */
export function formatEgyptianMobile(national: string): string {
  if (!/^01\d{9}$/.test(national)) return national;
  return `${national.slice(0, 3)} ${national.slice(3, 7)} ${national.slice(7)}`;
}

/**
 * Digits for `wa.me`, without a leading plus.
 * Egyptian mobiles are rewritten to country code 20.
 * Other international numbers (8–15 digits, no leading zero) pass through.
 */
export function toWhatsAppDigits(input: string): string | null {
  const digits = digitsOnly(input);
  if (!digits) return null;
  const local = normalizeEgyptianMobile(digits);
  if (local) return `20${local.slice(1)}`;
  if (/^[1-9]\d{7,14}$/.test(digits)) return digits;
  return null;
}
