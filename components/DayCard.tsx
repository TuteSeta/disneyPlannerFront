import { CalendarDay } from '../types';
import { DayTypeBadge } from './DayTypeBadge';
import { formatDate } from '../lib/utils';
import Link from 'next/link';

interface DayCardProps {
  day: CalendarDay;
  tripId: number;
}

export function DayCard({ day, tripId }: DayCardProps) {
  return (
    <Link 
      href={`/trips/${tripId}/day/${day.dayNumber}`}
      className="block p-4 bg-white rounded-xl shadow-sm border border-slate-200 hover:shadow-md transition-all hover:-translate-y-1 group"
    >
      <div className="flex justify-between items-start mb-2">
        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Día {day.dayNumber}</span>
        <DayTypeBadge type={day.dayType} locationLabel={day.locationLabel} />
      </div>

      <p className="text-sm font-semibold text-slate-700 mb-1">{formatDate(day.date)}</p>

      <p className="text-slate-500 text-sm mb-3 min-h-[36px] line-clamp-2">
        {day.locationLabel || 'Sin ubicación específica'}
      </p>

      <div className="flex items-center justify-between mt-auto pt-2 border-t border-slate-100">
        <span className="text-xs text-slate-400">
          {day.totalActivities === 0 ? 'Sin actividades' : `${day.totalActivities} actividades`}
        </span>
        {day.passRecommendation && (
          <span
            title={day.passRecommendation}
            className="text-xs font-medium text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-100"
          >
            Pase recomendado
          </span>
        )}
      </div>
    </Link>
  );
}
