import { getTripDayDetailServer } from '../../../../../lib/api';
import { ActivityTimeline } from '../../../../../components/ActivityTimeline';
import { PassRecommendationBanner } from '../../../../../components/PassRecommendationBanner';
import { DayTypeBadge } from '../../../../../components/DayTypeBadge';
import { formatDate } from '../../../../../lib/utils';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { DayType } from '../../../../../types';

interface Props {
  params: Promise<{ id: string; dayNumber: string }>;
}

const headerGradients: Record<DayType, string> = {
  DISNEY:     'from-blue-600/20    to-transparent',
  UNIVERSAL:  'from-orange-600/20  to-transparent',
  REST:       'from-emerald-600/20 to-transparent',
  SHOPPING:   'from-fuchsia-600/20 to-transparent',
  MIXED:      'from-violet-600/20  to-transparent',
  OTHER_PARK: 'from-teal-600/20    to-transparent',
};

export default async function TripDayDetailPage({ params }: Props) {
  const { id, dayNumber } = await params;
  let dayData;

  try {
    dayData = await getTripDayDetailServer(id, dayNumber);
  } catch {
    return (
      <main className="flex flex-col items-center justify-center min-h-[70vh] px-6">
        <p className="text-5xl mb-6">📅</p>
        <h2 className="text-2xl font-bold text-white mb-3">Día no encontrado</h2>
        <Link
          href={`/trips/${id}`}
          className="px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold transition-colors"
        >
          Volver al viaje
        </Link>
      </main>
    );
  }

  const gradient = headerGradients[dayData.dayType];

  return (
    <>
      {/* Ambient glow */}
      <div
        className="fixed inset-0 -z-10 overflow-hidden pointer-events-none"
        aria-hidden
      >
        <div className={`absolute -top-32 left-1/2 -translate-x-1/2 w-[600px] h-[500px] rounded-full blur-[120px] bg-gradient-to-b ${gradient}`} />
      </div>

      <main className="max-w-3xl mx-auto px-6 pt-28 pb-24 w-full">
        {/* Back */}
        <Link
          href={`/trips/${id}`}
          className="inline-flex items-center gap-1.5 text-sm text-white/35 hover:text-white/70 transition-colors mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          Volver al calendario
        </Link>

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-8">
          <div>
            <p className="text-white/30 text-xs font-bold uppercase tracking-widest mb-1">
              Día {dayData.dayNumber}
            </p>
            <h1 className="text-3xl md:text-4xl font-black text-white tracking-tight mb-2">
              {formatDate(dayData.date)}
            </h1>
            <p className="text-white/50 text-lg font-medium">
              {dayData.locationLabel || 'Sin ubicación'}
            </p>
          </div>
          <DayTypeBadge type={dayData.dayType} locationLabel={dayData.locationLabel} className="text-sm px-4 py-1.5 self-start" />
        </div>

        {/* Pass recommendation */}
        {dayData.passRecommendation && (
          <div className="mb-8">
            <PassRecommendationBanner recommendation={dayData.passRecommendation} />
          </div>
        )}

        {/* Timeline */}
        <div className="bg-white/[0.03] border border-white/[0.06] rounded-2xl p-6 md:p-8">
          <h2 className="text-lg font-bold text-white/70 mb-6 pb-4 border-b border-white/[0.06]">
            Itinerario del día
          </h2>
          <ActivityTimeline activities={dayData.activities} />
        </div>
      </main>
    </>
  );
}
