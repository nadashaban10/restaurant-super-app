import { cloneElement, isValidElement, type ReactElement, type ReactNode } from "react";

export function CheckoutField({
  id,
  label,
  required = false,
  optionalLabel,
  hint,
  error,
  children,
}: {
  id: string;
  label: string;
  required?: boolean;
  optionalLabel?: string;
  hint?: string;
  error?: string;
  children: ReactNode;
}) {
  const hintId = hint ? `${id}-hint` : undefined;
  const errorId = error ? `${id}-error` : undefined;
  const describedBy = [hintId, errorId].filter(Boolean).join(" ") || undefined;
  const control = isValidElement(children)
    ? cloneElement(children as ReactElement<{ "aria-describedby"?: string; "aria-required"?: boolean }>, {
        "aria-describedby": describedBy,
        "aria-required": required || undefined,
      })
    : children;

  return (
    <div>
      <label htmlFor={id} className="mb-1.5 flex items-baseline justify-between gap-3">
        <span className="text-sm font-bold">
          {label}
          {required ? (
            <span className="ms-1 text-[var(--brand-red)]" aria-hidden>
              *
            </span>
          ) : null}
        </span>
        {optionalLabel ? <span className="text-xs font-medium text-[var(--muted)]">{optionalLabel}</span> : null}
      </label>
      {hint ? (
        <p id={hintId} className="mb-1.5 text-sm text-[var(--muted)]">
          {hint}
        </p>
      ) : null}
      {control}
      {error ? (
        <p id={errorId} className="mt-1.5 text-sm font-medium text-[var(--danger)]" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}
