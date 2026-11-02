"use client";

import { useToastStore } from "@/stores/toast-store";
import { IconAlert, IconCheck, IconClose } from "@/components/ui/icons";

const toneStyles = {
  success: {
    wrap: "border-[var(--success)]/25 bg-white text-[var(--success)]",
    iconWrap: "bg-[var(--success-soft)] text-[var(--success)]",
    Icon: IconCheck,
  },
  error: {
    wrap: "border-[var(--danger)]/25 bg-white text-[var(--danger)]",
    iconWrap: "bg-[var(--danger-soft)] text-[var(--danger)]",
    Icon: IconClose,
  },
  warning: {
    wrap: "border-[var(--warning)]/30 bg-white text-[var(--warning)]",
    iconWrap: "bg-[var(--warning-soft)] text-[var(--warning)]",
    Icon: IconAlert,
  },
} as const;

export function Toast() {
  const message = useToastStore((s) => s.message);
  const tone = useToastStore((s) => s.tone);

  if (!message) return null;

  const style = toneStyles[tone];
  const Icon = style.Icon;

  return (
    <div
      role="status"
      aria-live="polite"
      className={`ks-toast-in fixed top-[calc(var(--header-offset)+0.75rem)] end-3 z-50 flex w-[min(26rem,calc(100vw-1.5rem))] items-center gap-3 rounded-2xl border px-5 py-4 shadow-[var(--shadow-lg)] sm:end-6 ${style.wrap}`}
    >
      <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${style.iconWrap}`}>
        <Icon />
      </span>
      <p className="text-[15px] font-medium leading-snug tracking-wide">{message}</p>
    </div>
  );
}
