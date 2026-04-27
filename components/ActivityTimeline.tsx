"use client";

import { motion } from 'framer-motion';
import { Activity, ActivityType } from '../types';
import { Zap, Music, UtensilsCrossed, ShoppingBag, Star } from 'lucide-react';

type IconComponent = React.ComponentType<{ className?: string }>;

const activityConfig: Record<string, { color: string; bg: string; Icon: IconComponent }> = {
  RIDE:       { color: 'text-blue-400',    bg: 'bg-blue-500/15 border-blue-500/25',    Icon: Zap },
  SHOW:       { color: 'text-pink-400',    bg: 'bg-pink-500/15 border-pink-500/25',    Icon: Music },
  FOOD:       { color: 'text-orange-400',  bg: 'bg-orange-500/15 border-orange-500/25', Icon: UtensilsCrossed },
  SHOPPING:   { color: 'text-fuchsia-400', bg: 'bg-fuchsia-500/15 border-fuchsia-500/25', Icon: ShoppingBag },
  EXPERIENCE: { color: 'text-violet-400',  bg: 'bg-violet-500/15 border-violet-500/25', Icon: Star },
};

const DEFAULT_CFG = { color: 'text-white/50', bg: 'bg-white/8 border-white/15', Icon: Star };

const containerVariants = {
  hidden: {},
  show:   { transition: { staggerChildren: 0.07 } },
};

const itemVariants = {
  hidden: { opacity: 0, x: -16 },
  show:   { opacity: 1, x: 0, transition: { type: 'spring' as const, stiffness: 120, damping: 16 } },
};

export function ActivityTimeline({ activities }: { activities: Activity[] }) {
  if (!activities?.length) {
    return (
      <div className="py-16 text-center text-white/25 text-sm">
        Este día no tiene actividades programadas.
      </div>
    );
  }

  return (
    <motion.ul
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="space-y-0"
    >
      {activities.map((activity, idx) => {
        const cfg = activityConfig[activity.activityType] ?? DEFAULT_CFG;
        const { Icon } = cfg;
        const isLast = idx === activities.length - 1;

        return (
          <motion.li key={idx} variants={itemVariants} className="relative flex gap-4">
            {/* Connector line */}
            {!isLast && (
              <div className="absolute left-5 top-10 bottom-0 w-px bg-white/[0.06]" />
            )}

            {/* Type icon */}
            <div className={`flex-shrink-0 w-10 h-10 rounded-xl border ${cfg.bg} flex items-center justify-center z-10`}>
              <Icon className={`w-4 h-4 ${cfg.color}`} />
            </div>

            {/* Content */}
            <div className="flex-1 pb-7">
              <div className="flex items-start justify-between gap-4 bg-white/[0.03] border border-white/[0.06] rounded-xl p-4 hover:bg-white/[0.05] transition-colors">
                <div className="flex-1 min-w-0">
                  <p className={`text-xs font-bold font-mono mb-1 ${cfg.color}`}>{activity.startTime ?? '—'}</p>
                  <p className="text-white/90 font-semibold text-sm leading-snug">{activity.name}</p>
                  {activity.notes && (
                    <p className="text-white/35 text-xs mt-1.5 leading-relaxed">{activity.notes}</p>
                  )}
                </div>
                <span className={`flex-shrink-0 mt-0.5 text-[10px] font-bold uppercase tracking-wide px-2 py-0.5 rounded-full border ${cfg.bg} ${cfg.color}`}>
                  {activity.activityType}
                </span>
              </div>
            </div>
          </motion.li>
        );
      })}
    </motion.ul>
  );
}
