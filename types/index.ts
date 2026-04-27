export type DayType = 'THEME_PARK' | 'SHOPPING' | 'REST' | 'MIXED' | 'SIGHTSEEING';
export type ActivityType = 'RIDE' | 'SHOW' | 'FOOD' | 'SHOPPING' | 'EXPERIENCE';

export interface Traveler {
  id: number;
  name: string;
  age: number | null;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface Activity {
  id: number;
  name: string;
  activityType: ActivityType;
  startTime: string | null;   // "HH:MM" — puede ser null
  endTime: string | null;
  sortOrder: number;
  priority: number;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface TripDay {
  id: number;
  dayNumber: number;
  date: string;
  dayType: DayType;
  locationLabel: string | null;
  passRecommendation: string | null;
  createdAt: string;
  updatedAt: string;
  activities: Activity[];    // calendar endpoint devuelve actividades aplanadas
}

export interface Trip {
  id: number;                 // era tripId en CalendarSummary
  name: string;
  startDate: string;
  endDate: string;
  description: string | null;
  createdAt: string;
  updatedAt: string;
  travelers: Traveler[];      // era string[] en CalendarSummary
  days: TripDay[];
}

export interface TripSummary {
  id: number;
  name: string;
  startDate: string;
  endDate: string;
}
