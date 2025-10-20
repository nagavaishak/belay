// app/api/congestion/route.ts
import { NextResponse } from 'next/server';
import { connections } from '@/lib/solana/connection';
import { getCurrentCongestion } from '@/lib/solana/congestion';

export async function GET() {
  try {
    const congestionData = await getCurrentCongestion(connections.default);
    return NextResponse.json(congestionData);
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch congestion data' },
      { status: 500 }
    );
  }
}