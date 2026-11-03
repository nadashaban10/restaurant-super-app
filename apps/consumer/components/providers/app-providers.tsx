"use client";

import { QueryProvider } from "./query-provider";
import { Toast } from "@/components/shared/toast";
import { SuggestionHost } from "@/features/recommendations/suggestion-host";
import type { ReactNode } from "react";

export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <QueryProvider>
      {children}
      <Toast />
      <SuggestionHost />
    </QueryProvider>
  );
}
