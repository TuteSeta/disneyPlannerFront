import { DayType } from '../types';

interface DayTypeBadgeProps {
  type: DayType;
  locationLabel?: string | null;
  className?: string;
}

const typeConfig: Record<DayType, { label: string; styles: string }> = {
  DISNEY:     { label: 'Disney Parks', styles: 'bg-blue-500/15 text-blue-300 border-blue-500/25' },
  UNIVERSAL:  { label: 'Universal',    styles: 'bg-orange-500/15 text-orange-300 border-orange-500/25' },
  REST:       { label: 'Descanso',     styles: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/25' },
  SHOPPING:   { label: 'Shopping',     styles: 'bg-fuchsia-500/15 text-fuchsia-300 border-fuchsia-500/25' },
  MIXED:      { label: 'Día Mixto',    styles: 'bg-violet-500/15 text-violet-300 border-violet-500/25' },
  OTHER_PARK: { label: 'Otro parque',  styles: 'bg-teal-500/15 text-teal-300 border-teal-500/25' },
};

export function DayTypeBadge({ type, locationLabel, className = '' }: DayTypeBadgeProps) {
  const normalizedType = (type || '').toUpperCase() as DayType;
  const config = typeConfig[normalizedType] || { label: type || 'Desconocido', styles: 'bg-gray-500/15 text-gray-300 border-gray-500/25' };
  const label = normalizedType === 'OTHER_PARK' ? (locationLabel ?? config.label) : config.label;
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${config.styles} ${className}`}>
      {label}
    </span>
  );
}
