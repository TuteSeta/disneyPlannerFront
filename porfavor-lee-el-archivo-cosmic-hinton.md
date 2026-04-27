# Plan: Integración completa Frontend ↔ API

## Context

El backend fue actualizado con breaking changes documentados en `FRONTEND_INTEGRATION.md`. El frontend no refleja ninguno de esos cambios. El resultado: **cada request al API falla con 403** (falta el header `x-api-key`), y los tipos son incompatibles con la forma actual del backend.

Los tres problemas centrales son:
1. **Autenticación ausente** — ningún fetch envía `x-api-key`
2. **DayType enum desactualizado** — el backend ya no conoce `DISNEY`, `UNIVERSAL`, `OTHER_PARK`
3. **Campos renombrados** — `Activity.type` → `activityType`, `Activity.time` → `startTime`; `Trip.tripId` → `id`

---

## Cambios por archivo

### 1. `.env.local.example` ← NUEVO

```bash
NEXT_PUBLIC_API_URL=http://localhost:3000
API_KEY=tu-clave-aqui
```

`API_KEY` sin prefijo `NEXT_PUBLIC_` — nunca exponer la clave al browser.

---

### 2. `types/index.ts` — reescritura completa

```typescript
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
```

`CalendarSummary`, `CalendarDay`, `DayDetail` desaparecen — reemplazados por `Trip`, `TripDay`.

---

### 3. `lib/api.ts` — agregar autenticación + alinear tipos

```typescript
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
const API_KEY = process.env.API_KEY ?? '';

function authHeaders() {
  return { 'x-api-key': API_KEY };
}
```

Cada `fetch` del lado servidor agrega `headers: authHeaders()`:

```typescript
export async function getTripSummaryServer(id: string): Promise<Trip> {
  const res = await fetch(`${API_URL}/trips/${id}/calendar`, {
    cache: 'no-store',
    headers: authHeaders(),
  });
  ...
}
// ídem getTripDayDetailServer (retorna TripDay) y getTripsServer (retorna TripSummary[])
```

`generateTrip` y `deleteTrip` van por route handlers → el header lo agrega el servidor.

---

### 4. `app/api/plan/route.ts` — agregar `x-api-key` al upstream

```typescript
const upstream = await fetch(`${BACKEND}/plan`, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'x-api-key': process.env.API_KEY ?? '',   // ← agregar
  },
  body: JSON.stringify(body),
  signal: controller.signal,
});
```

---

### 5. `app/api/trips/[id]/route.ts` ← NUEVO

El rewrite proxy de `next.config.ts` no puede inyectar headers, así que el DELETE del cliente nunca enviaría la clave. Se crea un route handler que hace el proxy con auth:

```typescript
export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const res = await fetch(`${BACKEND}/trips/${id}`, {
    method: 'DELETE',
    headers: { 'x-api-key': process.env.API_KEY ?? '' },
  });
  // mismo workaround: ignorar 500/404 por bug RxJS del backend
  if (!res.ok && res.status !== 500 && res.status !== 404) {
    return NextResponse.json({ error: 'delete_failed' }, { status: res.status });
  }
  return new NextResponse(null, { status: 204 });
}
```

---

### 6. `components/DayTypeBadge.tsx`

Reemplazar `typeConfig` con nuevas claves:

```typescript
const typeConfig: Record<DayType, { label: string; styles: string }> = {
  THEME_PARK:  { label: 'Parque temático', styles: 'bg-blue-500/15 text-blue-300 border-blue-500/25' },
  SIGHTSEEING: { label: 'Turismo',         styles: 'bg-teal-500/15 text-teal-300 border-teal-500/25' },
  REST:        { label: 'Descanso',        styles: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/25' },
  SHOPPING:    { label: 'Shopping',        styles: 'bg-fuchsia-500/15 text-fuchsia-300 border-fuchsia-500/25' },
  MIXED:       { label: 'Día mixto',       styles: 'bg-violet-500/15 text-violet-300 border-violet-500/25' },
};
```

Lógica de label: `THEME_PARK` usa `locationLabel` si está disponible (igual que antes hacía `OTHER_PARK`).

---

### 7. `components/TripCalendar.tsx`

- Reemplazar `dayTypeConfig` con las 5 nuevas claves
- El prop cambia de `CalendarSummary` a `Trip`
- Fix crítico en el `Link`:
  ```tsx
  // Antes:
  href={`/trips/${trip.tripId}/day/${tripDay.dayNumber}`}
  // Después:
  href={`/trips/${trip.id}/day/${tripDay.dayNumber}`}
  ```
- La leyenda renderiza los nuevos tipos

---

### 8. `components/ActivityTimeline.tsx`

```tsx
// Antes:
const cfg = activityConfig[activity.type] ?? DEFAULT_CFG;
<p ...>{activity.time}</p>
<span ...>{activity.type}</span>

// Después:
const cfg = activityConfig[activity.activityType] ?? DEFAULT_CFG;
<p ...>{activity.startTime ?? '—'}</p>   // startTime puede ser null
<span ...>{activity.activityType}</span>
```

---

### 9. `app/trips/[id]/day/[dayNumber]/page.tsx`

Reemplazar `headerGradients` con nuevas claves:

```typescript
const headerGradients: Record<DayType, string> = {
  THEME_PARK:  'from-blue-600/20    to-transparent',
  SIGHTSEEING: 'from-teal-600/20    to-transparent',
  REST:        'from-emerald-600/20 to-transparent',
  SHOPPING:    'from-fuchsia-600/20 to-transparent',
  MIXED:       'from-violet-600/20  to-transparent',
};
```

El return type de `getTripDayDetailServer` cambia a `TripDay`, ajustar referencias: `dayData.activities` viene directo del `TripDay`.

---

## Archivos que NO cambian

| Archivo | Por qué |
|---------|---------|
| `components/PlannerInput.tsx` | Ya maneja `result?.tripId ?? result?.id` |
| `components/TripList.tsx` | Usa `trip.id` correctamente |
| `app/page.tsx` | `trips.length` funciona igual |
| `app/trips/[id]/page.tsx` | `travelers.length` y `days.length` funcionan igual |
| `next.config.ts` | El rewrite sigue siendo útil para paths sin route handler |

---

## Orden de ejecución

1. `.env.local.example` — documentar las vars
2. `types/index.ts` — definir los tipos; todo lo demás depende de esto
3. `lib/api.ts` — auth + tipos actualizados
4. `app/api/plan/route.ts` — auth
5. `app/api/trips/[id]/route.ts` — nuevo route handler DELETE
6. `components/DayTypeBadge.tsx`
7. `components/TripCalendar.tsx`
8. `components/ActivityTimeline.tsx`
9. `app/trips/[id]/day/[dayNumber]/page.tsx`

---

## Verificación

1. Crear `.env.local` con `API_KEY` y `NEXT_PUBLIC_API_URL`
2. `npm run dev` → home debe listar viajes sin errores
3. Crear un viaje desde `PlannerInput` → debe redirigir a `/trips/{id}`
4. Vista de calendario → días con colores correctos (THEME_PARK = azul, etc.)
5. Click en un día → actividades con hora y tipo correctos
6. Eliminar un viaje → debe desaparecer sin errores de consola
7. Probar con API_KEY inválida → debe fallar gracefully (no silently)
