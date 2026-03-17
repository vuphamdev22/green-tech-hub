export function ProductCardSkeleton() {
  return (
    <div className="bg-card border border-white/[0.06] rounded-md overflow-hidden">
      {/* Image */}
      <div className="aspect-[4/3] bg-carbon-900 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full animate-shimmer" />
      </div>
      {/* Content */}
      <div className="p-4 space-y-3">
        <div className="flex justify-between">
          <div className="h-3 w-16 bg-white/5 rounded-sm overflow-hidden relative">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full animate-shimmer" />
          </div>
          <div className="h-3 w-20 bg-white/5 rounded-sm overflow-hidden relative">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full animate-shimmer" />
          </div>
        </div>
        <div className="h-4 w-3/4 bg-white/5 rounded-sm overflow-hidden relative">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full animate-shimmer" />
        </div>
        <div className="h-3 w-full bg-white/5 rounded-sm overflow-hidden relative">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full animate-shimmer" />
        </div>
        <div className="h-3 w-2/3 bg-white/5 rounded-sm overflow-hidden relative">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full animate-shimmer" />
        </div>
        <div className="flex justify-between pt-2 border-t border-white/5">
          <div className="h-6 w-20 bg-white/5 rounded-sm overflow-hidden relative">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full animate-shimmer" />
          </div>
          <div className="h-6 w-16 bg-white/5 rounded-sm overflow-hidden relative">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full animate-shimmer" />
          </div>
        </div>
      </div>
    </div>
  );
}

export function ProductGridSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <ProductCardSkeleton key={i} />
      ))}
    </div>
  );
}
