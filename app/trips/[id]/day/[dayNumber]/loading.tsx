export default function Loading() {
  return (
    <main className="max-w-3xl mx-auto px-6 pt-28 pb-24 w-full">
      <div className="w-40 h-4 skeleton mb-8" />
      <div className="w-24 h-3 skeleton mb-2" />
      <div className="w-64 h-10 skeleton mb-2" />
      <div className="w-48 h-5 skeleton mb-8" />
      <div className="bg-white/[0.03] border border-white/[0.06] rounded-2xl p-8">
        <div className="w-40 h-5 skeleton mb-6" />
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="flex gap-4 mb-6">
            <div className="w-10 h-10 skeleton rounded-xl flex-shrink-0" />
            <div className="flex-1 h-20 skeleton rounded-xl" />
          </div>
        ))}
      </div>
    </main>
  );
}
