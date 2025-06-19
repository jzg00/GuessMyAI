import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { validateDateAccess } from '@/lib/dateValidation'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const date = searchParams.get('date')

  if (!date) {
    return NextResponse.json({ error: 'Date parameter is required' }, { status: 400 })
  }

  // server side date validation
  const validation = validateDateAccess(date)
  if (!validation.valid) {
    return NextResponse.json({ error: validation.error }, { status: 403 })
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
    console.error('Error fetching daily prompt:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}