import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function POST(req: NextRequest) {
  const { date, prompt, aiResponse } = await req.json()

  if (!date || !prompt || !aiResponse) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
  }

  // for admin operations, we might want to allow future dates
  // but we can still validate the date format
  const dateRegex = /^\d{4}-\d{2}-\d{2}$/
  if (!dateRegex.test(date)) {
    return NextResponse.json({ error: 'Invalid date format. Use YYYY-MM-DD' }, { status: 400 })
  }

  try {
    const { error } = await supabase
      .from('daily_prompts')
      .upsert([{ date, prompt, ai_response: aiResponse }], { onConflict: 'date' })

    if (error) {
      console.error('Database error:', error)
      return NextResponse.json({ error: 'Database error' }, { status: 500 })
    }

    return NextResponse.json({ message: 'Prompt saved successfully' })
  } catch (error) {
    console.error('Error saving prompt:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const date = searchParams.get('date')

  if (!date) {
    return NextResponse.json({ error: 'Date parameter is required' }, { status: 400 })
  }

  // for admin, we can allow access to future dates
  // but we still validate the date format
  const dateRegex = /^\d{4}-\d{2}-\d{2}$/
  if (!dateRegex.test(date)) {
    return NextResponse.json({ error: 'Invalid date format' }, { status: 400 })
  }

  try {
    const { data, error } = await supabase
      .from('daily_prompts')
      .select('*')
      .eq('date', date)
      .single()

    if (error) {
      if (error.code === 'PGRST116') {
        // no rows returned
        return NextResponse.json({ error: 'No prompt found for the selected date' }, { status: 404 })
      }
      return NextResponse.json({ error: 'Database error' }, { status: 500 })
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error('Error fetching prompt:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}