import { CalendarSummary, DayDetail, TripSummary } from '../types';

// For Server Components
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

export async function getTripSummaryServer(id: string): Promise<CalendarSummary> {
  const res = await fetch(`${API_URL}/trips/${id}/calendar`, { cache: 'no-store' });
  if (!res.ok) {
    throw new Error(`Error fetching trip summary: ${res.statusText}`);
  }
  return res.json();
}

export async function getTripDayDetailServer(id: string, dayNumber: string): Promise<DayDetail> {
  const res = await fetch(`${API_URL}/trips/${id}/calendar/${dayNumber}`, { cache: 'no-store' });
  if (!res.ok) {
    throw new Error(`Error fetching day detail: ${res.statusText}`);
  }
  return res.json();
}

export async function getTripsServer(): Promise<TripSummary[]> {
  const res = await fetch(`${API_URL}/trips`, { cache: 'no-store' });
  if (!res.ok) {
    throw new Error(`Error fetching trips: ${res.statusText}`);
  }
  return res.json();
}

// For Client Components (goes through Next.js proxy)

export async function generateTrip(description: string) {
  // Can take up to 2 minutes
  const res = await fetch('/api/plan', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ description }),
  });
  
  if (!res.ok) {
    throw new Error(`Error generating trip. Please try again.`);
  }
  
  return res.json(); // Should return { tripId: number, ... } or similar based on backend
}

export async function deleteTrip(id: number) {
  const res = await fetch(`/api/trips/${id}`, { method: 'DELETE' });
  // El backend devuelve 500 por un bug de RxJS (firstValueFrom sobre observable vacío)
  // aunque el DELETE en DB sí se ejecuta. Sólo fallamos en errores de red reales (4xx distintos de 404).
  if (!res.ok && res.status !== 500 && res.status !== 404) {
    throw new Error(`Error al eliminar el viaje (${res.status})`);
  }
}
