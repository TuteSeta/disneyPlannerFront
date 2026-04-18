# Disney Planner — Frontend

Frontend del sistema Disney Planner. Consume el backend de microservicios NestJS que vive en otro repo (`my-disney-planner`).

## Backend

- **Repo del backend:** `D:\Projects\my-disney-planner`
- **URL base (dev):** `http://localhost:3000` (api-gateway)
- **Arquitectura:** 4 microservicios detrás del gateway. El front solo habla con el gateway por HTTP.

Para levantar el backend:
```bash
# En el repo del backend
docker compose up --build   # primera vez
docker compose up           # las siguientes
```

Requiere un archivo `.env` en la raíz del repo del backend (copiar desde `.env.example` y completar `ANTHROPIC_API_KEY` y credenciales de postgres). El puerto 3000 queda expuesto en el host — no hace falta tocar nada más.

## Endpoints principales

### `POST /plan` — Planificar viaje con lenguaje natural
Orquestador completo: Claude parsea la descripción, distribuye los días, genera el schedule de los parques, enriquece los días REST/SHOPPING y devuelve el calendario final.

**Request:**
```json
{ "description": "vamos a orlando del 22 dic al 7 ene somos 11 (2 niños)..." }
```

**Response:** mismo shape que `GET /trips/:id/calendar` (ver abajo).

Tarda 30s–2min según la duración del viaje. Mostrar loader.

### `GET /trips/:id/calendar` — Vista resumen del viaje
Un día por fila, sin actividades — para render de calendario/cards del viaje completo.

```json
{
  "tripId": 4,
  "name": "Orlando Vacaciones Perfectas 2026-2027",
  "startDate": "2026-12-22",
  "endDate": "2027-01-07",
  "travelers": ["Adulto 1", "Adulto 2", "Niño 1"],
  "days": [
    {
      "dayNumber": 1,
      "date": "2026-12-22",
      "dayType": "REST",
      "locationLabel": "Llegada y check-in",
      "passRecommendation": null,
      "totalActivities": 4
    }
  ]
}
```

### `GET /trips/:id/calendar/:dayNumber` — Detalle de un día
Todas las actividades ordenadas por hora.

```json
{
  "dayNumber": 2,
  "date": "2026-12-23",
  "dayType": "DISNEY",
  "locationLabel": "Magic Kingdom Park",
  "passRecommendation": "Se recomienda Lightning Lane Multi Pass: ...",
  "activities": [
    {
      "time": "09:00 - 10:30",
      "name": "Space Mountain",
      "type": "RIDE",
      "notes": "Ir temprano, fila corta al abrir."
    }
  ]
}
```

### `GET /trips` — Lista de trips
Devuelve todos los trips (entidades crudas con relaciones — probablemente uses solo `id`, `name`, `startDate`, `endDate`).

### `GET /trips/:id` — Trip completo con toda la jerarquía
Raw entity con `days → timeBlocks → groups → activities`. Para la UI usar los endpoints `/calendar` que ya vienen formateados.

### `DELETE /trips/:id` — Eliminar trip

## Tipos compartidos

```ts
type DayType = 'DISNEY' | 'UNIVERSAL' | 'REST' | 'SHOPPING' | 'MIXED';

type ActivityType = 'RIDE' | 'SHOW' | 'FOOD' | 'SHOPPING' | 'EXPERIENCE';
```

- `passRecommendation` es `string | null`. Solo tiene contenido en días `DISNEY`/`UNIVERSAL` cuando Claude recomendó Lightning Lane (Disney) o Express Pass (Universal). El texto incluye la razón — mostralo como tip/callout.
- `locationLabel` es el nombre humano del día ("Magic Kingdom Park", "Disney Springs", "Nochebuena en el hotel").

## UI sugerida — 2 niveles

1. **Vista de viaje completo:** grilla tipo calendario con los 17 días. Cada card muestra `date`, `dayType` (badge de color), `locationLabel`, `totalActivities`. Click en un día → vista detalle.
2. **Vista de día:** header con `locationLabel` + `date` + badge de `dayType`. Si hay `passRecommendation`, mostrarlo destacado arriba. Debajo, timeline de actividades con `time`, `name`, `notes`.

## Detalles operativos

- CORS: el api-gateway no tiene CORS configurado todavía. Si el front corre en otro puerto (ej. `localhost:5173`), habilitar CORS en `apps/api-gateway/src/main.ts` del backend cuando haga falta.
- No hay auth todavía — los endpoints son públicos.
- El trip creado por `POST /plan` se persiste en PostgreSQL del trip-service. No expira.
