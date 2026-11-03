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

function Bone({ className }: { className: string }) {
  return <div className={`ks-skeleton ${className}`} />;
}

export function HomeSkeleton() {
  return (
    <div>
      <div className="min-h-[70svh] bg-[var(--brand-black)] sm:min-h-[62vh] md:min-h-[72vh]" />
      <div className="mx-auto max-w-6xl px-4 py-8">
        <BannerSkeleton />
      </div>
      <div className="mx-auto grid max-w-6xl grid-cols-1 gap-4 px-4 pb-10 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }, (_, index) => (
          <CategoryCardSkeleton key={index} />
        ))}
      </div>
      <div className="mx-auto grid max-w-6xl grid-cols-1 gap-4 px-4 pb-14 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {Array.from({ length: 4 }, (_, index) => (
          <ProductCardSkeleton key={index} />
        ))}
      </div>
    </div>
  );
}

export function CardGridSkeleton({ count = 8 }: { count?: number }) {
  return (
    <div className="mx-auto max-w-6xl px-4 py-8 md:py-10">
      <Bone className="mb-3 h-10 w-40 rounded-md" />
      <Bone className="mb-6 h-4 w-28 rounded-md" />
      <div className="mb-6 flex gap-2 overflow-hidden">
        {Array.from({ length: 5 }, (_, index) => (
          <Bone key={index} className="h-11 w-24 shrink-0 rounded-full" />
        ))}
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {Array.from({ length: count }, (_, index) => (
          <ProductCardSkeleton key={index} />
        ))}
      </div>
    </div>
  );
}

export function CartSkeleton() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-8 md:py-12">
      <Bone className="mb-6 h-9 w-36 rounded-md" />
      <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_20.5rem]">
        <div className="flex min-w-0 flex-col gap-4">
          {Array.from({ length: 3 }, (_, index) => (
            <div
              key={index}
              className="grid grid-cols-[96px_1fr] gap-4 rounded-[var(--radius-xl)] border border-[var(--border)] bg-white p-3"
            >
              <Bone className="aspect-square rounded-xl" />
              <div className="space-y-3">
                <Bone className="h-5 w-2/3 rounded-md" />
                <Bone className="h-4 w-1/3 rounded-md" />
                <Bone className="h-11 w-36 rounded-xl" />
              </div>
            </div>
          ))}
        </div>
        <div className="rounded-[var(--radius-xl)] border border-[var(--border)] bg-white p-5">
          <Bone className="h-6 w-1/2 rounded-md" />
          <div className="mt-6 space-y-3">
            <Bone className="h-4 w-full rounded-md" />
            <Bone className="h-4 w-full rounded-md" />
            <Bone className="h-12 w-full rounded-xl" />
          </div>
        </div>
      </div>
    </div>
  );
}

export function CheckoutSkeleton() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-8 md:py-12">
      <Bone className="h-10 w-48 rounded-md" />
      <Bone className="mt-3 h-4 w-72 max-w-full rounded-md" />
      <div className="mt-6 grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_22rem]">
        <div className="rounded-[var(--radius-xl)] border border-[var(--border)] bg-white p-4 sm:p-6">
          <Bone className="h-6 w-40 rounded-md" />
          <div className="mt-5 grid gap-4">
            {Array.from({ length: 6 }, (_, index) => (
              <div key={index} className="space-y-2">
                <Bone className="h-4 w-28 rounded-md" />
                <Bone className={`w-full rounded-xl ${index === 4 ? "h-24" : "h-12"}`} />
              </div>
            ))}
          </div>
        </div>
        <div className="rounded-[var(--radius-xl)] border border-[var(--border)] bg-white p-5">
          <Bone className="h-6 w-32 rounded-md" />
          <div className="mt-5 space-y-3">
            <Bone className="h-12 w-full rounded-md" />
            <Bone className="h-12 w-full rounded-md" />
            <Bone className="h-4 w-full rounded-md" />
            <Bone className="h-14 w-full rounded-xl" />
          </div>
        </div>
      </div>
    </div>
  );
}

export function ProductDetailSkeleton() {
  return (
    <div className="mx-auto grid max-w-6xl gap-6 px-4 py-6 md:grid-cols-2 md:gap-12 md:py-12">
      <Bone className="h-48 rounded-[var(--radius-xl)] sm:h-60 md:aspect-[4/3] md:h-auto" />
      <div className="space-y-4">
        <Bone className="h-10 w-3/4 rounded-md" />
        <Bone className="h-4 w-full rounded-md" />
        <Bone className="h-4 w-2/3 rounded-md" />
        <Bone className="h-8 w-32 rounded-md" />
        <Bone className="h-12 w-40 rounded-xl" />
        <Bone className="h-12 w-full rounded-xl" />
      </div>
    </div>
  );
}
