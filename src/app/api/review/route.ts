import { NextRequest, NextResponse } from 'next/server';
import { reviewCode } from '@/lib/gemini';
import { ReviewRequest } from '@/types/review';

export async function POST(req: NextRequest) {
  const { code, language }: ReviewRequest = await req.json();

  if (!code?.trim()) {
    return NextResponse.json({ error: 'Code is required' }, { status: 400 });
  }

  try {
    const review = await reviewCode(code, language);
    return NextResponse.json(review);
  } catch (err) {
    console.error('[review] error:', err);
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
