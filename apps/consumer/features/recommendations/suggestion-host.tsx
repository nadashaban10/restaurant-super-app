"use client";

import { useEffect, useState, type ComponentType } from "react";
import { useSuggestionStore } from "@/stores/suggestion-store";

export function SuggestionHost() {
  const anchorId = useSuggestionStore((state) => state.anchorId);
  const [Tray, setTray] = useState<ComponentType | null>(null);

  useEffect(() => {
    if (!anchorId || Tray) return;
    let cancelled = false;
    void import("./suggestion-tray").then((module) => {
      if (!cancelled) setTray(() => module.SuggestionTray);
    });
    return () => {
      cancelled = true;
    };
  }, [anchorId, Tray]);

  if (!anchorId || !Tray) return null;
  return <Tray />;
}
