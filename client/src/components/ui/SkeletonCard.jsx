function SkeletonCard() {
  return (
    <div className="animate-pulse overflow-hidden rounded-[32px] bg-white shadow-lg">
      <div className="h-72 bg-slate-200" />

      <div className="p-5">
        <div className="h-6 w-40 rounded-full bg-slate-200" />

        <div className="mt-4 space-y-2">
          <div className="h-3 rounded-full bg-slate-200" />
          <div className="h-3 w-5/6 rounded-full bg-slate-200" />
        </div>

        <div className="mt-6 flex items-center justify-between">
          <div className="h-8 w-24 rounded-full bg-slate-200" />

          <div className="h-12 w-28 rounded-full bg-slate-200" />
        </div>
      </div>
    </div>
  );
}

export default SkeletonCard;