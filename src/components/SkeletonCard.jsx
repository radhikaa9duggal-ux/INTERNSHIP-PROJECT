// Proper shimmer skeleton placeholders for the movie grid
export default function SkeletonCard() {
  return (
    <div className="rounded-md overflow-hidden bg-[#0A0A0A] border border-white/5 flex flex-col animate-pulse">
      {/* Poster shimmer */}
      <div className="aspect-[2/3] w-full bg-gradient-to-br from-neutral-900 via-neutral-800 to-neutral-900 relative overflow-hidden">
        <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-white/5 to-transparent" />
      </div>
      {/* Text shimmer */}
      <div className="p-4 space-y-2">
        <div className="h-4 bg-neutral-800 rounded w-3/4" />
        <div className="h-3 bg-neutral-800/60 rounded w-1/2" />
      </div>
    </div>
  );
}
