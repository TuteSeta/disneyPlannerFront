import { NextRequest, NextResponse } from 'next/server';

// POST /plan puede tardar hasta 2 minutos — el proxy de rewrites cierra la conexión antes.
// Este Route Handler maneja el timeout manualmente.
export const maxDuration = 1000;

const BACKEND = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

export async function POST(req: NextRequest) {
  const body = await req.json();

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 270_000); // 4.5 min

  try {
    const upstream = await fetch(`${BACKEND}/plan`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
      signal: controller.signal,
    });

    const data = await upstream.json();
    clearTimeout(timeout);

    return NextResponse.json(data, { status: upstream.status });
  } catch (err: unknown) {
    clearTimeout(timeout);
    const isAbort = err instanceof Error && err.name === 'AbortError';
    return NextResponse.json(
      { error: isAbort ? 'La generación tardó demasiado. Intentá de nuevo.' : 'Error al contactar el backend.' },
      { status: 504 },
    );
  }
}
