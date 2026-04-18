export default function Loading() {
  return (
    <main className="flex flex-col flex-1 items-center px-6 pt-36 pb-20">
      <div className="w-48 h-5 skeleton mb-6" />
      <div className="w-72 h-16 skeleton mb-3" />
      <div className="w-56 h-16 skeleton mb-12" />
      <div className="w-full max-w-2xl h-36 skeleton rounded-2xl" />
    </main>
  );
}
