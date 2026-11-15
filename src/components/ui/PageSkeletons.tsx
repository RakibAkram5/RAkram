import { ProductCardSkeleton, Skeleton } from "./bits";

export function ListingSkeleton() {
  return (
    <div className="container-lux pt-4 pb-16" aria-busy="true" aria-label="Loading">
      <Skeleton className="h-[320px] w-full rounded-[32px] sm:h-[400px]" />
      <div className="mt-12 grid gap-10 lg:grid-cols-[260px_1fr]">
        <div className="hidden space-y-4 lg:block">
          {Array.from({ length: 8 }, (_, i) => (
            <Skeleton key={i} className="h-5 w-3/4" />
          ))}
        </div>
        <div className="grid grid-cols-2 gap-x-3 gap-y-10 sm:gap-x-5 md:grid-cols-3 xl:grid-cols-4">
          {Array.from({ length: 8 }, (_, i) => (
            <ProductCardSkeleton key={i} />
          ))}
        </div>
      </div>
    </div>
  );
}

export function ProductSkeleton() {
  return (
    <div className="container-lux pt-10 pb-16" aria-busy="true" aria-label="Loading product">
      <Skeleton className="mb-6 h-3 w-64" />
      <div className="grid gap-10 lg:grid-cols-12 lg:gap-14">
        <Skeleton className="aspect-[4/5] w-full rounded-3xl lg:col-span-7" />
        <div className="space-y-5 lg:col-span-5">
          <Skeleton className="h-3 w-24" />
          <Skeleton className="h-12 w-4/5" />
          <Skeleton className="h-4 w-40" />
          <Skeleton className="h-20 w-full" />
          <Skeleton className="h-10 w-1/2" />
          <Skeleton className="h-14 w-full rounded-full" />
        </div>
      </div>
    </div>
  );
}

export function PanelSkeleton() {
  return (
    <div className="space-y-6" aria-busy="true" aria-label="Loading">
      <Skeleton className="h-10 w-64" />
      <Skeleton className="h-64 w-full rounded-3xl" />
      <Skeleton className="h-40 w-full rounded-3xl" />
    </div>
  );
}
