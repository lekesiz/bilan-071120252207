/**
 * BilanCompetence.AI - Evaluations API Routes
 */

import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

/**
 * GET /api/evaluations?bilan_id=xxx
 * Get all evaluations for a bilan
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
    const { data: evaluations, error } = await supabase
      .from('evaluations')
      .select(`
        *,
        competence:competences(
          id,
          name,
          category,
          description,
          rome_code
        )
      `)
      .eq('bilan_id', bilanId)
      .order('created_at', { ascending: true })

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ data: evaluations })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

/**
 * POST /api/evaluations
 * Create or update evaluation
 */
export async function POST(request: NextRequest) {
  const supabase = createClient()

  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const body = await request.json()
    const {
      bilan_id,
      competence_id,
      self_maitrise_level,
      self_appetence_level,
      self_context,
      consultant_maitrise_level,
      consultant_appetence_level,
      consultant_notes,
      is_consultant,
    } = body

    // Check if evaluation exists
    const { data: existing } = await supabase
      .from('evaluations')
      .select('id')
      .eq('bilan_id', bilan_id)
      .eq('competence_id', competence_id)
      .single()

    if (existing) {
      // Update existing
      const updateData: any = {}

      if (is_consultant) {
        // Consultant updating
        if (consultant_maitrise_level !== undefined) updateData.consultant_maitrise_level = consultant_maitrise_level
        if (consultant_appetence_level !== undefined) updateData.consultant_appetence_level = consultant_appetence_level
        if (consultant_notes !== undefined) updateData.consultant_notes = consultant_notes
        updateData.consultant_eval_date = new Date().toISOString()
      } else {
        // Beneficiaire updating
        if (self_maitrise_level !== undefined) updateData.self_maitrise_level = self_maitrise_level
        if (self_appetence_level !== undefined) updateData.self_appetence_level = self_appetence_level
        if (self_context !== undefined) updateData.self_context = self_context
        updateData.self_eval_date = new Date().toISOString()
      }

      const { data: evaluation, error } = await supabase
        .from('evaluations')
        .update(updateData)
        .eq('id', existing.id)
        .select(`
          *,
          competence:competences(*)
        `)
        .single()

      if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 })
      }

      return NextResponse.json({ data: evaluation })
    } else {
      // Create new
      const insertData: any = {
        bilan_id,
        competence_id,
      }

      if (is_consultant) {
        insertData.consultant_maitrise_level = consultant_maitrise_level
        insertData.consultant_appetence_level = consultant_appetence_level
        insertData.consultant_notes = consultant_notes
        insertData.consultant_eval_date = new Date().toISOString()
      } else {
        insertData.self_maitrise_level = self_maitrise_level
        insertData.self_appetence_level = self_appetence_level
        insertData.self_context = self_context
        insertData.self_eval_date = new Date().toISOString()
      }

      const { data: evaluation, error } = await supabase
        .from('evaluations')
        .insert(insertData)
        .select(`
          *,
          competence:competences(*)
        `)
        .single()

      if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 })
      }

      return NextResponse.json({ data: evaluation }, { status: 201 })
    }
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
