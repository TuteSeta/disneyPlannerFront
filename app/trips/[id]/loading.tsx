export default function Loading() {
  return (
    <main className="max-w-5xl mx-auto px-6 pt-28 pb-24 w-full">
      <div className="w-16 h-4 skeleton mb-8" />
      <div className="w-96 h-10 skeleton mb-3" />
      <div className="w-64 h-4 skeleton mb-10" />
      <div className="bg-white/[0.03] border border-white/[0.06] rounded-2xl p-8">
        <div className="w-32 h-4 skeleton mb-6" />
        <div className="grid grid-cols-2 gap-8">
          {[0, 1].map((i) => (
            <div key={i}>
              <div className="grid grid-cols-7 gap-1">
                {Array.from({ length: 35 }).map((_, j) => (
                  <div key={j} className="aspect-square skeleton rounded-lg" />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
