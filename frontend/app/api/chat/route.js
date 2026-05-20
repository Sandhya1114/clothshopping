import { NextResponse } from 'next/server';
import { getChatReply } from '@/lib/chatbot';

export async function POST(request) {
  try {
    const body = await request.json();
    const reply = await getChatReply(body || {});

    return NextResponse.json(reply);
  } catch {
    return NextResponse.json(
      {
        reply:
          'I had trouble processing that request. Please try again or contact support if you need immediate help.',
        source: 'ai',
        suggestions: [{ question: 'How can I contact support?' }]
      },
      { status: 200 }
    );
  }
}
