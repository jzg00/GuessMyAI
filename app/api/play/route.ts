// app/api/play/route.ts
import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'
import { calculateSimilarityScore } from '@/lib/scoring'

// toggle this to switch between mock and real responses
const USE_MOCK = false;

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

const getWordCountPrompt = (wordCount: string) => {
  switch (wordCount) {
    case '1': return 'Answer in exactly 1 word'
    case '5': return 'Answer in exactly 5 words no more no less'
    case '10': return 'Answer in exactly 10 words no more no less'
    default: return 'Answer in exactly 1 word'
  }
}

const getMaxTokens = (wordCount: string) => {
  switch (wordCount) {
    case '1': return 10
    case '5': return 25
    case '10': return 35
    default: return 10
  }
}

export async function POST(req: NextRequest) {
  try {
    const { prompt, guess, wordCount } = await req.json()

    if (!prompt || !guess || !wordCount) {
      return NextResponse.json({ error: 'Missing prompt, guess, or wordCount' }, { status: 400 })
    }

    if (USE_MOCK) {
      const aiResponse = "Usually blue, but can change."
      const score = calculateSimilarityScore(aiResponse, guess)
      return NextResponse.json({ aiResponse, score })
    }

    const systemPrompt = ` Be coherent and respond with exactly ${wordCount} words. No more, no less.`

    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: prompt }
      ],
      max_tokens: getMaxTokens(wordCount),
      temperature: 0.7,
      top_p: 0.9,
    })

    let aiResponse = completion.choices[0]?.message?.content?.trim() || ''

    // ensure complete sentence
    if (aiResponse && !aiResponse.match(/[.!?]$/)) {
      const words = aiResponse.split(' ')
      if (words.length > 1) {
        aiResponse = words.slice(0, -1).join(' ') + '.'
      } else {
        aiResponse += '.'
      }
    }

    const score = calculateSimilarityScore(aiResponse, guess)
    return NextResponse.json({ aiResponse, score })
  } catch (error: any) {
    console.error('OpenAI error:', error)
    return NextResponse.json({ error: error.message || 'AI generation failed' }, { status: 500 })
  }
}
