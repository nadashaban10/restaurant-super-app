import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { identity } from "@/lib/identity";
import type { AppLocale } from "@/i18n/routing";

export async function Hero({ locale }: { locale: AppLocale }) {
  const t = await getTranslations();
  const copy = identity.lockedCopy[locale];
  const dir = locale === "ar" ? "rtl" : "ltr";
  const isAr = locale === "ar";
  const foundedYear = identity.restaurantIdentity.foundedYear;
  const yearLabel = new Intl.NumberFormat(isAr ? "ar-EG" : "en", {
    useGrouping: false,
  }).format(foundedYear);
  const headline = isAr
    ? identity.restaurantIdentity.arabicNameVocalized
    : identity.restaurantIdentity.officialName;
  const tagline = isAr ? identity.lockedCopy.ar.taglineVocalized : copy.tagline;

  return (
    <section
      lang={locale}
      dir={dir}
      className="relative min-h-[70svh] overflow-hidden bg-[var(--brand-black)] sm:min-h-[62vh] md:min-h-[72vh]"
    >
      <video
        className="absolute inset-0 h-full w-full object-cover"
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
        poster="/brand/banners/hero-grill.jpg"
        aria-label={copy.ogTitle}
      >
        <source src="/brand/banners/hero.mp4" type="video/mp4" />
      </video>
      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/45 to-black/20" />

      <div className="relative z-10 mx-auto flex min-h-[70svh] max-w-6xl flex-col justify-end px-4 py-8 text-start text-white sm:min-h-[62vh] sm:py-12 md:min-h-[72vh] md:py-16">
        <div className="flex max-w-2xl flex-col items-start gap-3 sm:gap-4">
          <p
            className={`ks-fade-in text-sm font-bold text-white/90 sm:text-lg md:text-2xl ${
              isAr ? "ks-naskh leading-[1.75] sm:leading-[1.9]" : "leading-snug tracking-wide"
            }`}
            lang={locale}
            dir={dir}
          >
            {tagline}
          </p>

          <h1
            className={`ks-fade-in text-[1.65rem] font-bold text-white drop-shadow-sm sm:text-4xl md:text-6xl ${
              isAr ? "ks-naskh leading-[1.55] sm:leading-[1.7] md:leading-[1.8]" : "leading-tight"
            }`}
            lang={locale}
            dir={dir}
          >
            {headline}
          </h1>

          <div
            className="ks-fade-in flex w-full max-w-md items-center gap-2.5 sm:gap-3"
            lang={locale}
            dir={dir}
            aria-label={t("home.since", { year: yearLabel })}
          >
            <span className="h-px w-7 shrink-0 bg-[var(--brand-red)] sm:w-10" aria-hidden />
            <span className="flex items-baseline gap-2 whitespace-nowrap">
              <span className="text-[11px] font-bold text-white/80 sm:text-sm">
                {t("home.sinceLabel")}
              </span>
              <span className="text-xl font-black tabular-nums leading-none text-white sm:text-3xl">
                {yearLabel}
              </span>
            </span>
            <span className="h-px min-w-6 flex-1 bg-white/30" aria-hidden />
          </div>

          <p className="ks-fade-in text-sm leading-relaxed text-white/90 sm:text-base md:text-lg">
            {t("home.location")}
            <span className="mx-2 text-white/40" aria-hidden>
              ·
            </span>
            {t("home.hours")}
          </p>

          <div className="ks-fade-in flex w-full flex-col gap-2 pt-1 sm:flex-row sm:flex-wrap sm:gap-3">
            <Link
              href="/menu"
              className="ks-pressable inline-flex min-h-12 w-full items-center justify-center rounded-xl bg-[var(--brand-red)] px-6 text-sm font-bold text-white shadow-[var(--shadow-md)] transition hover:bg-[var(--brand-red-hover)] sm:w-auto sm:px-7 sm:text-base"
            >
              {t("cta.orderNow")}
            </Link>
            <Link
              href="/menu"
              className="ks-pressable inline-flex min-h-12 w-full items-center justify-center rounded-xl border border-white/30 bg-white/95 px-6 text-sm font-bold text-[var(--brand-black)] backdrop-blur transition hover:bg-white sm:w-auto sm:px-7 sm:text-base"
            >
              {t("cta.viewMenu")}
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
