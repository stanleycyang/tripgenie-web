import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

// GET /api/trips - Fetch all trips for the authenticated user
export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()
    
    // Get authenticated user
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // TODO: Fetch trips from database
    // const { data: trips, error } = await supabase
    //   .from('trips')
    //   .select('*')
    //   .eq('user_id', user.id)
    //   .order('created_at', { ascending: false })

    // Placeholder response
    return NextResponse.json({
      trips: [],
      message: 'Placeholder: GET /api/trips endpoint'
    })
  } catch (error) {
    console.error('Error fetching trips:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// POST /api/trips - Create a new trip
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    
    // Get authenticated user
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { destination, start_date, end_date, travelers, preferences } = body

    // Validate required fields
    if (!destination || !start_date || !end_date) {
      return NextResponse.json(
        { error: 'Missing required fields: destination, start_date, end_date' },
        { status: 400 }
      )
    }

    // Insert trip into database
    const { data: trip, error } = await supabase
      .from('trips')
      .insert({
        user_id: user.id,
        destination,
        start_date,
        end_date,
        travelers: travelers || 1,
        traveler_type: preferences?.travelerType,
        vibes: preferences?.vibes,
        status: 'draft',
      })
      .select()
      .single()

    if (error) {
      console.error('Database error:', error)
      return NextResponse.json(
        { error: 'Failed to create trip' },
        { status: 500 }
      )
    }

    return NextResponse.json({ trip }, { status: 201 })
  } catch (error) {
    console.error('Error creating trip:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
