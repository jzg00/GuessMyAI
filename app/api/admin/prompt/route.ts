import { NextRequest, NextResponse } from 'next/server'
import { createSupabaseAdmin } from '@/lib/supabase'

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
    const supabaseAdmin = createSupabaseAdmin()
    const { error } = await supabaseAdmin
      .from('daily_prompts')
      .upsert([{ date, prompt, ai_response: aiResponse }], { onConflict: 'date' })

    if (error) {
      console.error('Database error:', error)
      return NextResponse.json({ error: `Database error: ${error.message}` }, { status: 500 })
    }

    return NextResponse.json({ message: 'Prompt saved successfully' })
  } catch (error) {
    console.error('Error saving prompt:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function GET(req: NextRequest) {
  console.log('=== DEBUG: Environment Variables ===')
  console.log('SUPABASE_SERVICE_ROLE_KEY exists:', !!process.env.SUPABASE_SERVICE_ROLE_KEY)
  console.log('SUPABASE_SERVICE_ROLE_KEY length:', process.env.SUPABASE_SERVICE_ROLE_KEY?.length || 0)
  console.log('First 4 chars:', process.env.SUPABASE_SERVICE_ROLE_KEY?.substring(0, 4) || 'none')
  console.log('All env keys:', Object.keys(process.env).filter(key => key.includes('SUPABASE')))
  console.log('=== DEBUG END ===')

  console.log('=== ADMIN GET REQUEST START ===')

  try {
    const { searchParams } = new URL(req.url)
    const date = searchParams.get('date')
    console.log('Requested date:', date)

    if (!date) {
      console.log('No date provided')
      return NextResponse.json({ error: 'Date parameter is required' }, { status: 400 })
    }

    // for admin, we can allow access to future dates
    // but we still validate the date format
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/
    if (!dateRegex.test(date)) {
      console.log('Invalid date format:', date)
      return NextResponse.json({ error: 'Invalid date format' }, { status: 400 })
    }

    console.log('Creating Supabase admin client...')
    const supabaseAdmin = createSupabaseAdmin()
    console.log('Supabase admin client created successfully')

    console.log('Querying database for date:', date)
    const { data, error } = await supabaseAdmin
      .from('daily_prompts')
      .select('*')
      .eq('date', date)
      .single()

    console.log('Database response:', { data, error })

    if (error) {
      console.error('Database error details:', {
        code: error.code,
        message: error.message,
        details: error.details,
        hint: error.hint
      })

      if (error.code === 'PGRST116') {
        // no rows returned
        console.log('No rows found for date:', date)
        return NextResponse.json({ error: 'No prompt found for the selected date' }, { status: 404 })
      }

      console.log('Returning database error')
      return NextResponse.json({
        error: 'Database error',
        details: error.message,
        code: error.code
      }, { status: 500 })
    }

    console.log('Successfully returning data:', data)
    return NextResponse.json(data)

  } catch (error) {
    console.error('=== CRITICAL ERROR IN ADMIN GET ===')
    console.error('Error type:', typeof error)
    console.error('Error message:', error)
    console.error('Error stack:', error instanceof Error ? error.stack : 'No stack trace')
    return NextResponse.json({
      error: 'Internal server error',
      details: error instanceof Error ? error.message : String(error)
    }, { status: 500 })
  } finally {
    console.log('=== ADMIN GET REQUEST END ===')
  }
}