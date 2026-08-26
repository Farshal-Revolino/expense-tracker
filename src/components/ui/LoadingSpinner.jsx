export default function LoadingSpinner({ size = 'md' }) {
  const s = size === 'sm' ? 'w-5 h-5' : size === 'lg' ? 'w-10 h-10' : 'w-7 h-7';
  return (
    <div className="flex items-center justify-center py-12">
      <div className={`${s} border-2 border-slate-200 dark:border-slate-700 border-t-emerald-600 rounded-full animate-spin`} />
    </div>
  );
}

export function SkeletonCard() {
  return (
    <div className="glass rounded-2xl p-5 animate-pulse">
      <div className="h-4 bg-slate-200 dark:bg-white/[0.06] rounded w-1/3 mb-3" />
      <div className="h-8 bg-slate-200 dark:bg-white/[0.06] rounded w-1/2 mb-2" />
      <div className="h-3 bg-slate-200 dark:bg-white/[0.06] rounded w-2/3" />
    </div>
  );
}

export function SkeletonList({ count = 5 }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-4 flex items-center gap-4 animate-pulse">
          <div className="w-11 h-11 rounded-xl bg-slate-200 dark:bg-slate-700" />
          <div className="flex-1">
            <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-1/3 mb-2" />
            <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded w-1/4" />
          </div>
          <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-20" />
        </div>
      ))}
    </div>
  );
}
