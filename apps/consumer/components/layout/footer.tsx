import { getTranslations } from "next-intl/server";
import { identity, phones } from "@/lib/identity";
import {
  IconClock,
  IconFacebook,
  IconInstagram,
  IconMapPin,
  IconPhone,
  IconTikTok,
  IconWhatsApp,
} from "@/components/ui/icons";

function whatsappHref(e164: string) {
  return `https://wa.me/${e164.replace(/\D/g, "")}`;
}

type SocialLink = {
  key: "facebook" | "instagram" | "tiktok";
  href: string | null | undefined;
  Icon: typeof IconFacebook;
  className?: string;
};

export async function Footer() {
  const t = await getTranslations("footer");
  const seo = identity.seo as {
    facebook?: string | null;
    instagram?: string | null;
    tiktok?: string | null;
  };

  const social: SocialLink[] = [
    { key: "facebook", href: seo.facebook, Icon: IconFacebook, className: "text-[#1877F2]" },
    { key: "instagram", href: seo.instagram, Icon: IconInstagram, className: "text-[#E1306C]" },
    { key: "tiktok", href: seo.tiktok, Icon: IconTikTok, className: "text-white" },
  ];

  return (
    <footer className="mt-20 border-t border-white/10 bg-[var(--brand-black)] text-white">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-12 md:grid-cols-12">
        <div className="md:col-span-4">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/brand/logo.jpg"
            alt="كبابجي شعبان"
            className="mb-4 h-16 w-auto rounded-lg object-contain"
          />
          <p className="text-base font-semibold text-white/90">{t("tagline")}</p>
          <div className="mt-4 flex items-start gap-3 text-sm text-white/75">
            <IconMapPin className="mt-0.5 shrink-0 text-[var(--brand-red)]" />
            <span>{t("address")}</span>
          </div>
          <div className="mt-3 flex items-center gap-3 text-sm font-semibold text-[var(--brand-red)]">
            <IconClock className="shrink-0" />
            <span>{t("hours")}</span>
          </div>
        </div>

        <div className="md:col-span-4">
          <h2 className="mb-4 text-sm font-extrabold tracking-wide text-white/50 uppercase">
            {t("contact")}
          </h2>
          <ul className="flex flex-col gap-2">
            <li>
              <a
                href={`tel:${phones.primary.e164}`}
                className="flex min-h-11 items-center gap-3 rounded-xl px-2 transition hover:bg-white/5"
              >
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-[var(--brand-red)]">
                  <IconPhone />
                </span>
                <span className="text-sm font-semibold">{phones.primary.displayAr}</span>
              </a>
            </li>
            <li>
              <a
                href={`tel:${phones.secondary.e164}`}
                className="flex min-h-11 items-center gap-3 rounded-xl px-2 transition hover:bg-white/5"
              >
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-[var(--brand-red)]">
                  <IconPhone />
                </span>
                <span className="text-sm font-semibold">{phones.secondary.displayAr}</span>
              </a>
            </li>
            <li>
              <a
                href={whatsappHref(phones.primary.e164)}
                target="_blank"
                rel="noopener noreferrer"
                className="flex min-h-11 items-center gap-3 rounded-xl px-2 transition hover:bg-white/5"
              >
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#25D366]/20 text-[#25D366]">
                  <IconWhatsApp />
                </span>
                <span className="text-sm font-semibold">{t("whatsapp")}</span>
              </a>
            </li>
            <li>
              <a
                href={`tel:${phones.complaints.e164}`}
                className="flex min-h-11 items-center gap-3 rounded-xl px-2 transition hover:bg-white/5"
              >
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-white/80">
                  <IconPhone />
                </span>
                <span className="text-sm">
                  <span className="font-semibold">{t("complaints")}</span>
                  <span className="ms-2 text-white/70">{phones.complaints.displayAr}</span>
                </span>
              </a>
            </li>
          </ul>
        </div>

        <div className="md:col-span-4">
          <h2 className="mb-4 text-sm font-extrabold tracking-wide text-white/50 uppercase">
            {t("social")}
          </h2>
          <div className="flex flex-wrap gap-3">
            {social.map(({ key, href, Icon, className }) => {
              const ready = Boolean(href);
              const label = t(key);
              const classNames =
                "inline-flex min-h-11 items-center gap-2 rounded-xl border border-white/15 bg-white/5 px-4 text-sm font-semibold transition hover:border-white/30 hover:bg-white/10";

              if (!ready) {
                return (
                  <span
                    key={key}
                    className={`${classNames} cursor-default opacity-80`}
                    title={t("comingSoon")}
                    aria-label={`${label} — ${t("comingSoon")}`}
                  >
                    <Icon className={className} />
                    {label}
                  </span>
                );
              }

              return (
                <a
                  key={key}
                  href={href!}
                  rel="noopener noreferrer"
                  target="_blank"
                  className={classNames}
                  aria-label={label}
                >
                  <Icon className={className} />
                  {label}
                </a>
              );
            })}
          </div>
          <p className="mt-6 text-sm text-white/55">{t("pricesIn")}</p>
        </div>
      </div>
    </footer>
  );
}
