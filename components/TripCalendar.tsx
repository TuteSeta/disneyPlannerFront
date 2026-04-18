"use client";

import { motion } from 'framer-motion';
import Link from 'next/link';
import { CalendarSummary, CalendarDay, DayType } from '../types';

interface TripCalendarProps {
  trip: CalendarSummary;
}

// ── Config ────────────────────────────────────────────────────────────────────

const dayTypeConfig: Record<DayType, { bg: string; text: string; ring: string; label: string }> = {
  DISNEY:    { bg: 'bg-blue-500',    text: 'text-white', ring: 'ring-blue-400',    label: 'Disney' },
  UNIVERSAL: { bg: 'bg-orange-500',  text: 'text-white', ring: 'ring-orange-400',  label: 'Universal' },
  REST:      { bg: 'bg-emerald-500', text: 'text-white', ring: 'ring-emerald-400', label: 'Descanso' },
  SHOPPING:  { bg: 'bg-fuchsia-500', text: 'text-white', ring: 'ring-fuchsia-400', label: 'Shopping' },
  MIXED:     { bg: 'bg-violet-500',  text: 'text-white', ring: 'ring-violet-400',  label: 'Mixto' },
};

const MONTH_NAMES = [
  'Enero','Febrero','Marzo','Abril','Mayo','Junio',
  'Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre',
];
const DAY_NAMES = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];

// ── Helpers ───────────────────────────────────────────────────────────────────

function getMonthsBetween(start: string, end: string) {
  const s = new Date(start + 'T00:00:00Z');
  const e = new Date(end   + 'T00:00:00Z');
  const months: { year: number; month: number }[] = [];
  let cur = new Date(Date.UTC(s.getUTCFullYear(), s.getUTCMonth(), 1));
  while (cur <= e) {
    months.push({ year: cur.getUTCFullYear(), month: cur.getUTCMonth() });
    cur = new Date(Date.UTC(cur.getUTCFullYear(), cur.getUTCMonth() + 1, 1));
  }
  return months;
}

function daysInMonth(year: number, month: number) {
  return new Date(Date.UTC(year, month + 1, 0)).getUTCDate();
}

function firstWeekday(year: number, month: number) {
  return new Date(Date.UTC(year, month, 1)).getUTCDay(); // 0=Sun
}

function pad2(n: number) { return String(n).padStart(2, '0'); }

// ── Legend ────────────────────────────────────────────────────────────────────

function Legend() {
  return (
    <div className="flex flex-wrap gap-3">
      {(Object.entries(dayTypeConfig) as [DayType, typeof dayTypeConfig[DayType]][]).map(([type, cfg]) => (
        <div key={type} className="flex items-center gap-1.5">
          <span className={`w-2.5 h-2.5 rounded-full ${cfg.bg}`} />
          <span className="text-white/40 text-xs font-medium">{cfg.label}</span>
        </div>
      ))}
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────────────────

export function TripCalendar({ trip }: TripCalendarProps) {
  const dayMap = new Map<string, CalendarDay>();
  for (const day of trip.days) {
    dayMap.set(day.date, day);
  }

  const months = getMonthsBetween(trip.startDate, trip.endDate);

  return (
    <div className="space-y-2">
      <div className="mb-6">
        <Legend />
      </div>

      <div className={months.length === 1 ? 'max-w-sm' : 'grid grid-cols-1 md:grid-cols-2 gap-8'}>
        {months.map(({ year, month }) => {
          const total  = daysInMonth(year, month);
          const offset = firstWeekday(year, month);

          const cells: (number | null)[] = [
            ...Array(offset).fill(null),
            ...Array.from({ length: total }, (_, i) => i + 1),
          ];
          while (cells.length % 7 !== 0) cells.push(null);

          return (
            <div key={`${year}-${month}`}>
              <h3 className="text-sm font-bold uppercase tracking-widest text-white/40 mb-4">
                {MONTH_NAMES[month]} {year}
              </h3>

              {/* Day-of-week headers */}
              <div className="grid grid-cols-7 mb-1">
                {DAY_NAMES.map((d) => (
                  <div key={d} className="text-center text-[11px] font-bold text-white/20 uppercase py-1">
                    {d}
                  </div>
                ))}
              </div>

              {/* Calendar cells */}
              <div className="grid grid-cols-7 gap-1">
                {cells.map((day, i) => {
                  if (!day) return <div key={i} />;

                  const dateStr = `${year}-${pad2(month + 1)}-${pad2(day)}`;
                  const tripDay = dayMap.get(dateStr);

                  if (!tripDay) {
                    return (
                      <div
                        key={i}
                        className="aspect-square flex items-center justify-center rounded-lg"
                      >
                        <span className="text-sm text-white/15 font-medium">{day}</span>
                      </div>
                    );
                  }

                  const cfg = dayTypeConfig[tripDay.dayType];

                  return (
                    <motion.div
                      key={i}
                      whileHover={{ scale: 1.12, zIndex: 10 }}
                      whileTap={{ scale: 0.95 }}
                      className="relative"
                    >
                      <Link
                        href={`/trips/${trip.tripId}/day/${tripDay.dayNumber}`}
                        className={`aspect-square flex flex-col items-center justify-center rounded-lg ${cfg.bg} ${cfg.text} cursor-pointer relative hover:ring-2 ${cfg.ring} transition-shadow`}
                        title={tripDay.locationLabel ?? undefined}
                      >
                        <span className="font-bold text-sm leading-none">{day}</span>
                        <span className="text-[9px] mt-0.5 opacity-70 hidden sm:block font-medium">
                          {cfg.label}
                        </span>
                        {tripDay.passRecommendation && (
                          <span className="absolute top-0.5 right-0.5 w-2 h-2 rounded-full bg-amber-400 shadow-sm shadow-amber-400/50" />
                        )}
                      </Link>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {/* Amber dot legend */}
      <p className="text-white/20 text-xs mt-6 flex items-center gap-2">
        <span className="w-2 h-2 rounded-full bg-amber-400 inline-block" />
        Días con pase rápido recomendado
      </p>
    </div>
  );
}
