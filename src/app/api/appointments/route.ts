/**
 * BilanCompetence.AI - Appointments API Routes
 */

import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

/**
 * GET /api/appointments?bilan_id=xxx
 * Get all appointments for a bilan
 */
export async function GET(request: NextRequest) {
  const supabase = createClient()

  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const searchParams = request.nextUrl.searchParams
  const bilanId = searchParams.get('bilan_id')

  if (!bilanId) {
    return NextResponse.json({ error: 'bilan_id is required' }, { status: 400 })
  }

  try {
    const { data: appointments, error } = await supabase
      .from('appointments')
      .select(`
        *,
        proposed_by:users!appointments_proposed_by_id_fkey(
          id,
          first_name,
          last_name,
          email
        )
      `)
      .eq('bilan_id', bilanId)
      .order('scheduled_at', { ascending: true })

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ data: appointments })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

/**
 * POST /api/appointments
 * Create a new appointment
 */
export async function POST(request: NextRequest) {
  const supabase = createClient()

  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const body = await request.json()
    const { bilan_id, scheduled_at, duration_minutes, meeting_type } = body

    if (!bilan_id || !scheduled_at) {
      return NextResponse.json(
        { error: 'bilan_id and scheduled_at are required' },
        { status: 400 }
      )
    }

    const { data: appointment, error } = await supabase
      .from('appointments')
      .insert({
        bilan_id,
        scheduled_at,
        duration_minutes: duration_minutes || 60,
        meeting_type: meeting_type || 'investigation',
        proposed_by_id: user.id,
        status: 'proposed',
      })
      .select(`
        *,
        proposed_by:users!appointments_proposed_by_id_fkey(
          id,
          first_name,
          last_name,
          email
        )
      `)
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ data: appointment }, { status: 201 })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
