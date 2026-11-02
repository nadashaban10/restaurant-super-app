import { ArrowRight } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";

export async function SeeAllLink({
  href = "/menu",
  className = "",
}: {
  href?: "/menu";
  className?: string;
}) {
  const t = await getTranslations("cta");

  return (
    <Link
      href={href}
      className={`inline-flex min-h-11 shrink-0 items-center gap-1.5 px-1 text-sm font-bold text-[var(--brand-black)] transition hover:text-[var(--brand-red)] ${className}`}
    >
      {t("seeAll")}
      <ArrowRight size={18} strokeWidth={2.2} className="rtl:rotate-180" aria-hidden />
    </Link>
  );
}
