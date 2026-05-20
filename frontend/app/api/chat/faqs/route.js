import { NextResponse } from 'next/server';
import { getQuickReplies } from '@/lib/chatbot';

export async function GET() {
  return NextResponse.json({
    faqs: getQuickReplies()
  });
}
