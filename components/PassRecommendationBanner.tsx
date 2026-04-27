import { Lightbulb } from 'lucide-react';

interface PassRecommendationBannerProps {
  recommendation: string;
}

export function PassRecommendationBanner({ recommendation }: PassRecommendationBannerProps) {
  return (
    <div className="flex gap-4 p-5 rounded-2xl bg-amber-500/8 border border-amber-500/20">
      <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-amber-500/15 border border-amber-500/25 flex items-center justify-center">
        <Lightbulb className="w-5 h-5 text-amber-400" />
      </div>
      <div>
        <p className="text-amber-300 font-bold text-sm mb-1">Recomendación</p>
        <p className="text-amber-200/60 text-sm leading-relaxed">{recommendation}</p>
      </div>
    </div>
  );
}
