import { getTranslations } from "next-intl/server";
import { CartSkeleton } from "@/components/ui/skeletons";

export default async function Loading() {
  const t = await getTranslations("status");

  return (
    <div aria-busy="true" aria-live="polite">
      <span className="sr-only">{t("loading")}</span>
      <CartSkeleton />
    </div>
  );
}
