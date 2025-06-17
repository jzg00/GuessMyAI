// app/api/play/route.ts
import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'

// Toggle this to switch between mock and real responses
const USE_MOCK = true;

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export async function POST(req: NextRequest) {
  const { prompt, guess } = await req.json()

  if (!prompt || !guess) {
    return NextResponse.json({ error: 'Missing prompt or guess' }, { status: 400 })
  }

  if (USE_MOCK) {
    const aiResponse = "Usually blue, but can change.";
    const score = similarityScore(aiResponse, guess);
    return NextResponse.json({ aiResponse, score });
  }

  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 1,
    })

    const aiResponse = completion.choices[0]?.message?.content?.trim() || ''
    const score = similarityScore(aiResponse, guess)

    return NextResponse.json({ aiResponse, score })
  } catch (error: any) {
  console.error('OpenAI error:', error);
  return NextResponse.json({ error: error.message || 'AI generation failed' }, { status: 500 });
}

}

function similarityScore(a: string, b: string): number {
    const clean = (str: string) =>
    str.toLowerCase().replace(/[^a-z0-9\s]/g, '').trim();

    const cleanedA = clean(a);
    const cleanedB = clean(b);

    const setA = new Set(cleanedA.split(/\s+/));
    const setB = new Set(cleanedB.split(/\s+/));

    const intersection = new Set([...setA].filter(word => setB.has(word)));
    const union = new Set([...setA, ...setB]);

    const score = (intersection.size / Math.max(union.size, 1)) * 100;
    return Math.round(score);
}
