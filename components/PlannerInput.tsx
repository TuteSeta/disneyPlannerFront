"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { generateTrip } from '../lib/api';
import { SendHorizontal, Sparkles } from 'lucide-react';

const LOADING_MESSAGES = [
  'Analizando fechas y parques...',
  'Calculando tiempos de espera...',
  'Distribuyendo días por parque...',
  'Armando el itinerario perfecto...',
  'Generando actividades y consejos...',
  'Casi listo...',
];

export function PlannerInput() {
  const [description, setDescription] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [msgIdx, setMsgIdx]       = useState(0);
  const [error, setError]         = useState<string | null>(null);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim()) return;

    setIsLoading(true);
    setError(null);

    const interval = setInterval(() => {
      setMsgIdx((i) => (i + 1) % LOADING_MESSAGES.length);
    }, 7000);

    try {
      const result = await generateTrip(description);
      clearInterval(interval);
      const id = result?.tripId ?? result?.id;
      if (!id) throw new Error('No se recibió el ID del viaje.');
      router.push(`/trips/${id}`);
    } catch (err: unknown) {
      clearInterval(interval);
      setError(err instanceof Error ? err.message : 'Error al planificar. Intentá de nuevo.');
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="w-full max-w-2xl mx-auto">
        <div className="relative overflow-hidden rounded-2xl border border-indigo-500/25 bg-indigo-500/5 p-12 text-center">
          {/* Animated gradient bg */}
          <div
            className="absolute inset-0 opacity-30 animate-gradient-pan"
            style={{
              background: 'linear-gradient(135deg, rgba(59,130,246,0.2), rgba(139,92,246,0.2), rgba(236,72,153,0.2), rgba(59,130,246,0.2))',
              backgroundSize: '300% auto',
            }}
          />
          <div className="relative z-10 flex flex-col items-center">
            {/* Spinner */}
            <div className="relative w-16 h-16 mb-8">
              <div className="absolute inset-0 rounded-full border-2 border-indigo-500/20 border-t-indigo-400 animate-spin" />
              <div
                className="absolute inset-2 rounded-full border-2 border-violet-500/20 border-t-violet-400 animate-spin"
                style={{ animationDirection: 'reverse', animationDuration: '1.4s' }}
              />
              <Sparkles className="absolute inset-0 m-auto w-5 h-5 text-indigo-300" />
            </div>
            <p className="text-white font-bold text-xl mb-3">Armando tu viaje...</p>
            <p className="text-white/40 text-sm transition-all duration-500">
              {LOADING_MESSAGES[msgIdx]}
            </p>
            <p className="text-white/20 text-xs mt-6">Este proceso puede tardar hasta 2 minutos</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-2xl mx-auto">
      <form onSubmit={handleSubmit} className="group relative">
        {/* Glow border on focus */}
        <div className="absolute -inset-px rounded-2xl bg-gradient-to-r from-blue-500 via-indigo-500 to-violet-500 opacity-0 group-focus-within:opacity-40 transition-opacity duration-500 blur-sm pointer-events-none" />

        <div className="relative border border-white/10 group-focus-within:border-indigo-500/50 rounded-2xl bg-white/[0.04] backdrop-blur-sm transition-colors duration-300 overflow-hidden">
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder='Ej: "Somos 11, vamos del 22 dic al 7 ene, queremos Disney, Universal, un día de shopping, evitar filas largas..."'
            className="w-full bg-transparent px-6 pt-5 pb-16 text-[15px] text-white/90 placeholder-white/20 outline-none resize-none h-36 font-medium leading-relaxed"
            disabled={isLoading}
          />

          <div className="absolute bottom-3 right-3 flex items-center gap-3">
            {error && (
              <span className="text-red-400 text-xs font-medium bg-red-500/10 px-3 py-1.5 rounded-lg border border-red-500/20">
                {error}
              </span>
            )}
            <button
              type="submit"
              disabled={!description.trim()}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-semibold text-sm shadow-lg shadow-blue-500/20 hover:shadow-blue-500/35 hover:from-blue-400 hover:to-indigo-500 transition-all disabled:opacity-30 disabled:cursor-not-allowed disabled:shadow-none"
            >
              <SendHorizontal className="w-4 h-4" />
              Planificar
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
