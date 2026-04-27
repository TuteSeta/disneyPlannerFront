import { PlannerInput } from '../components/PlannerInput';
import { TripList } from '../components/TripList';
import { getTripsServer } from '../lib/api';
import type { TripSummary } from '../types';

export const dynamic = 'force-dynamic';

export default async function Home() {
  let trips: TripSummary[] = [];
  try {
    trips = await getTripsServer();
  } catch { /* silently show empty list */ }

  return (
    <>
      {/* Ambient background glows */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none" aria-hidden>
        <div className="absolute -top-48 left-1/2 -translate-x-1/2 w-[900px] h-[700px] rounded-full bg-sky-500/8 blur-[130px]" />
        <div className="absolute top-1/3 -right-40  w-[500px] h-[500px] rounded-full bg-cyan-500/6  blur-[110px]" />
        <div className="absolute bottom-0   -left-40  w-[400px] h-[400px] rounded-full bg-teal-500/6   blur-[100px]" />
      </div>

      <main className="flex flex-col flex-1">
        {/* ── Hero ───────────────────────────────────────────── */}
        <section className="flex flex-col items-center justify-center pt-36 pb-20 px-6 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-sky-500/10 border border-sky-500/20 text-sky-300 text-xs font-semibold tracking-widest uppercase mb-8">
            <span className="w-1.5 h-1.5 rounded-full bg-sky-400 animate-pulse" />
            Planificador de viajes con IA
          </div>

          <h1 className="text-5xl md:text-7xl font-black tracking-tight text-white leading-[0.95] mb-6 max-w-4xl">
            Planificá tu{' '}
            <span className="bg-gradient-to-r from-sky-400 via-cyan-400 to-teal-400 bg-clip-text text-transparent animate-gradient-pan">
              próxima aventura
            </span>
          </h1>

          <p className="text-white/40 text-lg md:text-xl max-w-xl mx-auto mb-12 font-medium leading-relaxed">
            Describí tus vacaciones y la IA armará el itinerario perfecto, día por día, para cualquier destino del mundo.
          </p>

          <PlannerInput />
        </section>

        {/* ── Saved trips ────────────────────────────────────── */}
        {trips.length > 0 && (
          <section className="px-6 pb-28">
            <TripList initialTrips={trips} />
          </section>
        )}
      </main>
    </>
  );
}
