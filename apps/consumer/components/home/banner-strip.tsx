import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import type { AppLocale } from "@/i18n/routing";
import type { PromoBanner } from "@/lib/catalog/catalog";
import { formatMoney, localizedText } from "@/lib/catalog/pricing";

function OfferImage({ src, alt, priority }: { src: string; alt: string; priority: boolean }) {
  const isSvg = src.endsWith(".svg");

  if (isSvg) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img src={src} alt={alt} className="absolute inset-0 h-full w-full object-cover" />
    );
  }

  return (
    <Image
      src={src}
      alt={alt}
      fill
      priority={priority}
      sizes="(max-width: 768px) 85vw, (max-width: 1024px) 45vw, 33vw"
      className="object-cover transition duration-500 group-hover:scale-105"
    />
  );
}

export async function BannerStrip({
  banners,
  locale,
}: {
  banners: PromoBanner[];
  locale: AppLocale;
}) {
  if (!banners.length) return null;
  const t = await getTranslations();

  return (
    <section className="mx-auto max-w-6xl px-4 py-8" aria-labelledby="home-offers">
      <div className="mb-5">
        <h2 id="home-offers" className="text-2xl font-extrabold tracking-tight md:text-3xl">
          {t("home.offers")}
        </h2>
        <p className="mt-1 text-sm text-[var(--muted)]">{t("home.offersHint")}</p>
      </div>

      <div className="-mx-4 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-2 [scrollbar-width:none] md:mx-0 md:grid md:grid-cols-3 md:overflow-visible md:px-0 md:pb-0 [&::-webkit-scrollbar]:hidden">
        {banners.map((banner, index) => {
          const title = localizedText(banner.title, locale);
          const showPercent =
            banner.discountType === "percent" && banner.discountValue > 0;
          const showSale = Boolean(banner.price && banner.price.discountAmount > 0);

          return (
            <Link
              key={banner.id}
              href={banner.link}
              className="group relative min-w-[82%] snap-start overflow-hidden rounded-2xl bg-[var(--brand-black)] shadow-[var(--shadow-sm)] transition duration-300 hover:-translate-y-0.5 hover:shadow-[var(--shadow-lg)] md:min-w-0"
            >
              <div className="relative aspect-[4/5] sm:aspect-[16/10] md:aspect-[4/5]">
                <OfferImage src={banner.src} alt={title} priority={index === 0} />
                <span className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-black/10" />

                {showSale ? (
                  <span className="absolute top-3 start-3 rounded-full bg-[var(--brand-red)] px-3 py-1 text-xs font-extrabold text-white shadow-sm">
                    {showPercent
                      ? t("home.percentOff", { percent: banner.discountValue })
                      : t("product.sale")}
                  </span>
                ) : null}

                <span className="absolute inset-x-0 bottom-0 flex flex-col gap-3 p-4 text-white md:p-5">
                  <span className="text-xl font-extrabold leading-snug md:text-2xl">{title}</span>
                  {banner.price ? (
                    <span className="flex flex-wrap items-baseline gap-2">
                      <span className="text-lg font-extrabold">
                        {formatMoney(banner.price.finalAmount, locale)}
                      </span>
                      {banner.price.discountAmount > 0 ? (
                        <s className="text-sm text-white/70">
                          {formatMoney(banner.price.originalAmount, locale)}
                        </s>
                      ) : null}
                    </span>
                  ) : null}
                  <span className="inline-flex w-fit items-center rounded-xl bg-white px-4 py-2 text-sm font-bold text-[var(--brand-black)] transition group-hover:bg-[var(--brand-red)] group-hover:text-white">
                    {t("home.orderOffer")}
                  </span>
                </span>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
