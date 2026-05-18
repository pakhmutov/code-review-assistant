import { NextRequest, NextResponse } from 'next/server';
import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';
import { reviewCode } from '@/lib/gemini';
import { ReviewRequest } from '@/types/review';

const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(10, '1 m'),
});

export async function POST(req: NextRequest) {
  const ip = req.headers.get('x-forwarded-for') ?? 'anonymous';
  const { success } = await ratelimit.limit(ip);

  if (!success) {
    return NextResponse.json({ error: 'Too many requests. Please wait a minute.' }, { status: 429 });
  }

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
