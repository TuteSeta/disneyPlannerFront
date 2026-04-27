"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { deleteTrip } from '../lib/api';
import { formatDate } from '../lib/utils';
import { TripSummary } from '../types';
import { Trash2, CalendarDays, ArrowRight } from 'lucide-react';

interface TripListProps {
  initialTrips: TripSummary[];
}

export function TripList({ initialTrips }: TripListProps) {
  const [trips, setTrips]       = useState<TripSummary[]>(initialTrips);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const router = useRouter();

  const handleDelete = async (e: React.MouseEvent, id: number) => {
    e.preventDefault();
    e.stopPropagation();
    if (!confirm('¿Eliminar este viaje? Esta acción no se puede deshacer.')) return;

    setDeletingId(id);
    try {
      await deleteTrip(id);
      setTrips((prev) => prev.filter((t) => t.id !== id));
      router.refresh();
    } catch {
      alert('Hubo un error al eliminar el viaje.');
    } finally {
      setDeletingId(null);
    }
  };

  if (trips.length === 0) return null;

  return (
    <div className="w-full max-w-5xl mx-auto">
      <p className="text-xs font-bold uppercase tracking-widest text-white/25 mb-6">
        Viajes guardados
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {trips.map((trip) => (
          <Link
            key={trip.id}
            href={`/trips/${trip.id}`}
            className="group relative flex flex-col bg-white/[0.04] hover:bg-white/[0.07] border border-white/[0.07] hover:border-sky-500/30 rounded-2xl overflow-hidden transition-all duration-300 hover:-translate-y-0.5"
          >
            {/* Color stripe */}
            <div className="h-[2px] w-full bg-gradient-to-r from-sky-400 via-cyan-400 to-teal-400 opacity-60 group-hover:opacity-100 transition-opacity" />

            <div className="p-5 flex flex-col flex-1">
              <div className="flex items-start justify-between gap-2 mb-3">
                <h3 className="text-white/90 font-semibold text-[15px] leading-snug line-clamp-2 flex-1">
                  {trip.name}
                </h3>
                <button
                  onClick={(e) => handleDelete(e, trip.id)}
                  disabled={deletingId === trip.id}
                  className="flex-shrink-0 w-7 h-7 flex items-center justify-center rounded-lg bg-white/5 text-white/25 hover:bg-red-500/15 hover:text-red-400 transition-colors disabled:opacity-40"
                  aria-label="Eliminar viaje"
                >
                  {deletingId === trip.id ? (
                    <span className="w-3 h-3 border border-red-400/50 border-t-red-400 rounded-full animate-spin block" />
                  ) : (
                    <Trash2 className="w-3.5 h-3.5" />
                  )}
                </button>
              </div>

              <div className="flex items-center gap-2 text-white/35 text-xs mb-5">
                <CalendarDays className="w-3.5 h-3.5 flex-shrink-0" />
                <span>{formatDate(trip.startDate)} — {formatDate(trip.endDate)}</span>
              </div>

              <div className="mt-auto flex items-center gap-1 text-sky-400/80 text-sm font-medium group-hover:text-sky-300 transition-colors">
                Ver calendario
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
