"use client";

import { useEffect, useState } from "react";

type PersistApi = {
  hasHydrated: () => boolean;
  onFinishHydration: (fn: () => void) => () => void;
};

export function usePersistHydrated(persist: PersistApi): boolean {
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setHydrated(persist.hasHydrated());
    return persist.onFinishHydration(() => setHydrated(true));
  }, [persist]);

  return hydrated;
}
