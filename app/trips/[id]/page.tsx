import { getTripSummaryServer } from '../../../lib/api';
import { TripCalendar } from '../../../components/TripCalendar';
import { formatDate } from '../../../lib/utils';
import Link from 'next/link';
import { ArrowLeft, CalendarDays, Users } from 'lucide-react';

interface Props {
  params: Promise<{ id: string }>;
}

export default async function TripSummaryPage({ params }: Props) {
  const { id } = await params;
  let tripData;

  try {
    tripData = await getTripSummaryServer(id);
  } catch {
    return (
      <main className="flex flex-col items-center justify-center min-h-[70vh] px-6">
        <p className="text-5xl mb-6">🗺️</p>
        <h2 className="text-2xl font-bold text-white mb-3">Viaje no encontrado</h2>
        <p className="text-white/40 mb-8 text-center max-w-sm">
          Es posible que el viaje haya sido eliminado o el ID sea incorrecto.
        </p>
        <Link href="/" className="px-6 py-3 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-semibold transition-colors">
          Volver al inicio
        </Link>
      </main>
    );
  }

  return (
    <>
      {/* Ambient glow matching trip */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none" aria-hidden>
        <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[700px] h-[500px] rounded-full bg-sky-500/8 blur-[120px]" />
      </div>

      <main className="max-w-5xl mx-auto px-6 pt-28 pb-24 w-full">
        {/* Back */}
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-sm text-white/35 hover:text-sky-400 transition-colors mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          Inicio
        </Link>

        {/* Header */}
        <div className="mb-10">
          <h1 className="text-3xl md:text-5xl font-black text-white tracking-tight leading-tight mb-4">
            {tripData.name}
          </h1>
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-white/40 text-sm font-medium">
            <span className="flex items-center gap-2">
              <CalendarDays className="w-4 h-4" />
              {formatDate(tripData.startDate)} — {formatDate(tripData.endDate)}
            </span>
            <span className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              {tripData.travelers.length} viajeros
            </span>
            <span className="text-white/20">
              {tripData.days.length} días
            </span>
          </div>
        </div>

        {/* Calendar */}
        <div className="bg-white/[0.03] border border-white/[0.06] rounded-2xl p-6 md:p-8">
          <TripCalendar trip={tripData} />
        </div>
      </main>
    </>
  );
}
