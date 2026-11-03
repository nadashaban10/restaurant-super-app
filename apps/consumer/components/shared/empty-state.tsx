import type { ReactNode } from "react";

export function EmptyState({
  icon,
  title,
  message,
  action,
}: {
  icon: ReactNode;
  title: string;
  message: string;
  action: ReactNode;
}) {
  return (
    <div className="mx-auto max-w-xl px-4 py-20 text-center">
      <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full border border-[var(--border)] bg-white text-[var(--brand-red)] shadow-[var(--shadow-sm)]">
        {icon}
      </div>
      <h1 className="mb-3 text-3xl font-extrabold">{title}</h1>
      <p className="mb-8 text-[var(--muted)]">{message}</p>
      {action}
    </div>
  );
}
