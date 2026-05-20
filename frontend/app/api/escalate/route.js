import { NextResponse } from 'next/server';
import { proxyEscalation } from '@/lib/chatbot';

export async function POST(request) {
  try {
    const body = await request.json();
    const result = await proxyEscalation(body || {});

    return NextResponse.json(result);
  } catch {
    return NextResponse.json(
      {
        error: 'Unable to submit the escalation request right now. Please try again shortly.'
      },
      { status: 502 }
    );
  }
}
