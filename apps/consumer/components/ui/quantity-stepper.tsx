"use client";

import { Spinner } from "./spinner";

type Props = {
  quantity: number;
  onDecrease: () => void;
  onIncrease: () => void;
  decreaseLabel: string;
  increaseLabel: string;
  disabled?: boolean;
  busy?: boolean;
  className?: string;
};

export function QuantityStepper({
  quantity,
  onDecrease,
  onIncrease,
  decreaseLabel,
  increaseLabel,
  disabled = false,
  busy = false,
  className = "",
}: Props) {
  return (
    <div
      className={`inline-flex h-11 min-w-[7.5rem] items-center justify-between gap-1 rounded-xl bg-[var(--brand-red)] px-1 text-white shadow-sm ${className}`}
      role="group"
      aria-label="Quantity"
    >
      <button
        type="button"
        className="flex h-9 w-9 items-center justify-center rounded-lg text-xl font-bold transition hover:bg-white/15 disabled:opacity-50"
        aria-label={decreaseLabel}
        onClick={onDecrease}
        disabled={disabled || busy}
      >
        −
      </button>
      <span className="min-w-8 text-center text-sm font-extrabold tabular-nums" aria-live="polite">
        {busy ? <Spinner className="mx-auto h-4 w-4" /> : quantity}
      </span>
      <button
        type="button"
        className="flex h-9 w-9 items-center justify-center rounded-lg text-xl font-bold transition hover:bg-white/15 disabled:opacity-50"
        aria-label={increaseLabel}
        onClick={onIncrease}
        disabled={disabled || busy || quantity >= 99}
      >
        +
      </button>
    </div>
  );
}
