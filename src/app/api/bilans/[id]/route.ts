/**
 * BilanCompetence.AI - Single Bilan API Routes
 */

import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

/**
 * GET /api/bilans/[id]
 * Get single bilan with full details
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const supabase = createClient()

  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const { data: bilan, error } = await supabase
      .from('bilans')
      .select(`
        *,
        beneficiaire:beneficiaires!bilans_beneficiaire_id_fkey(
          id,
          current_job_title,
          current_industry,
          user:users!beneficiaires_user_id_fkey(
            id,
            first_name,
            last_name,
            email,
            phone
          )
        ),
        consultant:consultants!bilans_consultant_id_fkey(
          id,
          bio,
          user:users!consultants_user_id_fkey(
            id,
            first_name,
            last_name,
            email,
            phone
          )
        ),
        organisme:organismes!bilans_organisme_id_fkey(
          id,
          name,
          branding_color,
          logo_url
        ),
        evaluations:evaluations(
          id,
          self_maitrise_level,
          self_appetence_level,
          consultant_maitrise_level,
          consultant_appetence_level,
          consultant_notes,
          competence:competences(
            id,
            name,
            category,
            description
          )
        )
      `)
      .eq('id', params.id)
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 404 })
    }

    return NextResponse.json({ data: bilan })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

/**
 * PATCH /api/bilans/[id]
 * Update bilan
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
    const { status, phase, notes, end_date, hours_completed } = body

    const updateData: any = {}
    if (status !== undefined) updateData.status = status
    if (phase !== undefined) updateData.phase = phase
    if (notes !== undefined) updateData.notes = notes
    if (end_date !== undefined) updateData.end_date = end_date
    if (hours_completed !== undefined) updateData.hours_completed = hours_completed

    const { data: bilan, error } = await supabase
      .from('bilans')
      .update(updateData)
      .eq('id', params.id)
      .select()
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ data: bilan })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

/**
 * DELETE /api/bilans/[id]
 * Delete bilan (archive)
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const supabase = createClient()

  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    // Soft delete - change status to archived
    const { error } = await supabase
      .from('bilans')
      .update({ status: 'archived' })
      .eq('id', params.id)

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
