import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { getServerDate, formatDateForDB } from '@/lib/dateValidation'

export async function GET() {
  try {
    const serverDate = getServerDate()
    const todayString = formatDateForDB(serverDate)

    // only fetch dates up to today
    const { data, error } = await supabase
      .from('daily_prompts')
      .select('date')
      .lte('date', todayString) // less than or equal to today
      .order('date', { ascending: false })

    if (error) {
      console.error('Error fetching available dates:', error)
      return NextResponse.json({ error: 'Database error' }, { status: 500 })
    }

    // extract just the date strings
    const dates = data?.map(item => item.date) || []

    return NextResponse.json({ dates })
  } catch (error) {
    console.error('Error fetching available dates:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}