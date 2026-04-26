export type DayType = 'DISNEY' | 'UNIVERSAL' | 'REST' | 'SHOPPING' | 'MIXED' | 'OTHER_PARK';
export type ActivityType = 'RIDE' | 'SHOW' | 'FOOD' | 'SHOPPING' | 'EXPERIENCE';

export interface CalendarDay {
  dayNumber: number;
  date: string;
  dayType: DayType;
  locationLabel: string | null;
  passRecommendation: string | null;
  totalActivities: number;
}

export interface CalendarSummary {
  tripId: number;
  name: string;
  startDate: string;
  endDate: string;
  travelers: string[];
  days: CalendarDay[];
}

export interface Activity {
  time: string;
  name: string;
  type: ActivityType | string;
  notes: string | null;
}

export interface DayDetail {
  dayNumber: number;
  date: string;
  dayType: DayType;
  locationLabel: string | null;
  passRecommendation: string | null;
  activities: Activity[];
}

export interface TripSummary {
  id: number;
  name: string;
  startDate: string;
  endDate: string;
}
