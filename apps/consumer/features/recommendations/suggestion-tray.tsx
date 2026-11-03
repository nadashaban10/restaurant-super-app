"use client";

import { useEffect } from "react";
import { usePathname } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import { IconClose } from "@/components/ui/icons";
import { recommendationLimits, trayAddonGroups } from "@/lib/recommendations/rules";
import { useSuggestionStore } from "@/stores/suggestion-store";
import { MealSuggestions, useAddonPicks } from "./meal-suggestions";

function trayHidden(pathname: string) {
  return pathname === "/cart" || pathname === "/checkout" || pathname.startsWith("/menu/");
}

export function SuggestionTray() {
  const t = useTranslations();
  const pathname = usePathname();
  const anchorId = useSuggestionStore((state) => state.anchorId);
  const dismiss = useSuggestionStore((state) => state.dismiss);
  const suggestions = useAddonPicks(anchorId ? [anchorId] : [], trayAddonGroups, recommendationLimits.tray);

  useEffect(() => {
    if (anchorId && trayHidden(pathname)) {
      useSuggestionStore.setState({ anchorId: null });
    }
  }, [anchorId, pathname]);

  if (!anchorId || trayHidden(pathname) || suggestions.length === 0) return null;

  return (
    <div className="ks-sheet-in fixed inset-x-0 bottom-0 z-30 border-t border-[var(--border)] bg-white shadow-[var(--shadow-lg)]">
      <div className="mx-auto max-w-6xl px-4 pt-3 pb-[max(0.75rem,env(safe-area-inset-bottom))]">
        <MealSuggestions
          productIds={[anchorId]}
          title={t("suggest.withThis")}
          limit={recommendationLimits.tray}
          groups={trayAddonGroups}
          compact
          action={
            <button
              type="button"
              onClick={dismiss}
              className="inline-flex min-h-11 shrink-0 items-center gap-1 rounded-xl px-2 text-sm font-bold text-[var(--muted)]"
            >
              {t("suggest.notNow")}
              <IconClose />
            </button>
          }
        />
      </div>
    </div>
  );
}
