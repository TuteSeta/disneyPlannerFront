import Link from 'next/link';

export function Navbar() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 h-16 border-b border-white/[0.06] bg-[#080A1A]/80 backdrop-blur-xl">
      <div className="max-w-6xl mx-auto px-6 h-full flex items-center">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="relative w-8 h-8 rounded-xl overflow-hidden shadow-lg shadow-blue-500/20 group-hover:shadow-blue-500/40 transition-shadow duration-300">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-indigo-600" />
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-white text-[10px] font-black tracking-tight">MP</span>
            </div>
          </div>
          <span className="font-bold text-white/90 text-[17px] tracking-tight group-hover:text-white transition-colors hidden sm:block">
            My Disney Planner
          </span>
        </Link>
      </div>
    </header>
  );
}
