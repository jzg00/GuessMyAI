// app/api/play/route.ts
import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export async function POST(req: NextRequest) {
  const { prompt, guess } = await req.json()

  if (!prompt || !guess) {
    return NextResponse.json({ error: 'Missing prompt or guess' }, { status: 400 })
  }

  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 11,
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
  const setA = new Set(a.toLowerCase().split(/\s+/))
  const setB = new Set(b.toLowerCase().split(/\s+/))
  const common = [...setA].filter(word => setB.has(word))
  return Math.round((common.length / Math.max(setA.size, 1)) * 100)
}
