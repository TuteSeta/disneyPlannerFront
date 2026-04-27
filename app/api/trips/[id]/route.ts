import { NextRequest, NextResponse } from 'next/server';

const BACKEND = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

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
