export function ProductCardSkeleton() {
  return (
    <div className="overflow-hidden rounded-[var(--radius-xl)] border border-[var(--border)] bg-white">
      <div className="ks-skeleton aspect-[4/3]" />
      <div className="space-y-3 p-4">
        <div className="ks-skeleton h-5 w-3/4 rounded-md" />
        <div className="ks-skeleton h-4 w-1/2 rounded-md" />
        <div className="ks-skeleton h-11 w-full rounded-xl" />
      </div>
    </div>
  );
}

export function CategoryCardSkeleton() {
  return (
    <div className="overflow-hidden rounded-[var(--radius-lg)] border border-[var(--border)] bg-white">
      <div className="ks-skeleton aspect-[5/4]" />
      <div className="space-y-2 p-3">
        <div className="ks-skeleton h-4 w-2/3 rounded-md" />
        <div className="ks-skeleton h-3 w-1/3 rounded-md" />
      </div>
    </div>
  );
}

export function BannerSkeleton() {
  return (
    <div className="grid gap-4 md:grid-cols-3">
      <div className="ks-skeleton aspect-[16/10] rounded-[var(--radius-xl)] md:col-span-2 md:aspect-auto md:min-h-[280px]" />
      <div className="grid gap-4">
        <div className="ks-skeleton aspect-[16/9] rounded-[var(--radius-xl)]" />
        <div className="ks-skeleton aspect-[16/9] rounded-[var(--radius-xl)]" />
      </div>
    </div>
  );
}
