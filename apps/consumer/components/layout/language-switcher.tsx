"use client";

import { useLocale } from "next-intl";
import { usePathname, useRouter } from "@/i18n/navigation";
import type { AppLocale } from "@/i18n/routing";

export function LanguageSwitcher() {
  const locale = useLocale() as AppLocale;
  const router = useRouter();
  const pathname = usePathname();

  function switchTo(next: AppLocale) {
    router.replace(pathname, { locale: next });
  }

  return (
    <div
      className="flex items-center rounded-xl bg-[var(--page-bg)] p-1 text-sm font-semibold"
      role="group"
      aria-label="Language"
    >
      <button
        type="button"
        onClick={() => switchTo("ar")}
        className={`min-h-9 min-w-11 rounded-lg px-2.5 transition ${
          locale === "ar"
            ? "bg-white text-[var(--brand-red)] shadow-sm"
            : "text-[var(--muted)] hover:text-[var(--brand-black)]"
        }`}
        aria-pressed={locale === "ar"}
      >
        عربي
      </button>
      <button
        type="button"
        onClick={() => switchTo("en")}
        className={`min-h-9 min-w-11 rounded-lg px-2.5 transition ${
          locale === "en"
            ? "bg-white text-[var(--brand-red)] shadow-sm"
            : "text-[var(--muted)] hover:text-[var(--brand-black)]"
        }`}
        aria-pressed={locale === "en"}
      >
        EN
      </button>
    </div>
  );
}
