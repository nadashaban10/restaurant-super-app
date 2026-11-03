"use client";

import { Spinner } from "./spinner";

type Props = {
  quantity: number;
  onDecrease: () => void;
  onIncrease: () => void;
  decreaseLabel: string;
  increaseLabel: string;
  label?: string;
  disabled?: boolean;
  busy?: boolean;
  appearance?: "brand" | "quiet" | "outline";
  className?: string;
};

const frame = {
  brand: "inline-flex h-11 min-w-[7.5rem] items-center justify-between gap-1 rounded-xl bg-[var(--brand-red)] px-1 text-white shadow-sm",
  quiet: "inline-flex items-center gap-1 rounded-xl bg-[var(--page-bg)] p-1 text-[var(--brand-black)]",
  outline: "inline-flex items-center gap-2 rounded-2xl border border-[var(--border)] bg-white p-1 text-[var(--brand-black)] shadow-sm",
} as const;

const control = {
  brand: "flex h-9 w-9 items-center justify-center rounded-lg text-xl font-bold transition hover:bg-white/15 disabled:opacity-50",
  quiet: "flex h-11 w-11 items-center justify-center rounded-lg text-lg disabled:opacity-50",
  outline: "flex h-11 w-11 items-center justify-center rounded-xl text-xl transition hover:bg-[var(--page-bg)] disabled:opacity-50",
} as const;

const figure = {
  brand: "min-w-8 text-center text-sm font-extrabold tabular-nums",
  quiet: "min-w-8 text-center font-extrabold tabular-nums",
  outline: "min-w-10 text-center font-extrabold tabular-nums",
} as const;

export function QuantityStepper({
  quantity,
  onDecrease,
  onIncrease,
  decreaseLabel,
  increaseLabel,
  label = "Quantity",
  disabled = false,
  busy = false,
  appearance = "brand",
  className = "",
}: Props) {
  return (
    <div className={`${frame[appearance]} ${className}`} role="group" aria-label={label}>
      <button
        type="button"
        className={control[appearance]}
        aria-label={decreaseLabel}
        onClick={onDecrease}
        disabled={disabled || busy}
      >
        −
      </button>
      <span className={figure[appearance]} aria-live="polite">
        {busy ? <Spinner className="mx-auto h-4 w-4" /> : quantity}
      </span>
      <button
        type="button"
        className={control[appearance]}
        aria-label={increaseLabel}
        onClick={onIncrease}
        disabled={disabled || busy || quantity >= 99}
      >
        +
      </button>
    </div>
  );
}
