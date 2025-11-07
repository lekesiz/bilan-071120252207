/**
 * BilanCompetence.AI - Single Appointment API Routes
 */

import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

/**
 * PATCH /api/appointments/[id]
 * Update appointment (confirm, reject, complete)
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const supabase = createClient()

  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const body = await request.json()
    const { status, rejection_reason, meeting_notes } = body

    const updateData: any = {}
    if (status) updateData.status = status
    if (rejection_reason) updateData.rejection_reason = rejection_reason
    if (meeting_notes) updateData.meeting_notes = meeting_notes

    const { data: appointment, error } = await supabase
      .from('appointments')
      .update(updateData)
      .eq('id', params.id)
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

    return NextResponse.json({ data: appointment })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
