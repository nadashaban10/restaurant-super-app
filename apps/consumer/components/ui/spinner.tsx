export function Spinner({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <span
      className={`inline-block rounded-full border-2 border-current border-r-transparent ks-spin ${className}`}
      aria-hidden
    />
  );
}
