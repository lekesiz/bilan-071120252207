/**
 * BilanCompetence.AI - Bilans API Routes
 */

import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

/**
 * GET /api/bilans
 * Get all bilans for current user (filtered by role)
 */
export async function GET(request: NextRequest) {
  const supabase = createClient()

  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const searchParams = request.nextUrl.searchParams
  const status = searchParams.get('status')
  const limit = parseInt(searchParams.get('limit') || '10')
  const offset = parseInt(searchParams.get('offset') || '0')

  try {
    // Get user data with role
    const { data: userData } = await supabase
      .from('users')
      .select('user_type')
      .eq('id', user.id)
      .single()

    if (!userData) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    let query = supabase
      .from('bilans')
      .select(`
        *,
        beneficiaire:beneficiaires!bilans_beneficiaire_id_fkey(
          id,
          user:users!beneficiaires_user_id_fkey(
            id,
            first_name,
            last_name,
            email
          )
        ),
        consultant:consultants!bilans_consultant_id_fkey(
          id,
          user:users!consultants_user_id_fkey(
            id,
            first_name,
            last_name,
            email
          )
        ),
        organisme:organismes!bilans_organisme_id_fkey(
          id,
          name
        )
      `)
      .range(offset, offset + limit - 1)
      .order('created_at', { ascending: false })

    // Filter based on user role
    if (userData.user_type === 'consultant') {
      const { data: consultant } = await supabase
        .from('consultants')
        .select('id')
        .eq('user_id', user.id)
        .single()

      if (consultant) {
        query = query.eq('consultant_id', consultant.id)
      }
    } else if (userData.user_type === 'beneficiaire') {
      const { data: beneficiaire } = await supabase
        .from('beneficiaires')
        .select('id')
        .eq('user_id', user.id)
        .single()

      if (beneficiaire) {
        query = query.eq('beneficiaire_id', beneficiaire.id)
      }
    } else if (userData.user_type === 'organisme_admin') {
      const { data: organisme } = await supabase
        .from('organismes')
        .select('id')
        .eq('admin_id', user.id)
        .single()

      if (organisme) {
        query = query.eq('organisme_id', organisme.id)
      }
    }

    // Apply status filter
    if (status) {
      query = query.eq('status', status)
    }

    const { data: bilans, error, count } = await query

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({
      data: bilans,
      meta: {
        total: count,
        limit,
        offset,
      },
    })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

/**
 * POST /api/bilans
 * Create a new bilan (consultants only)
 */
export async function POST(request: NextRequest) {
  const supabase = createClient()

  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const body = await request.json()
    const { beneficiaire_email, beneficiaire_first_name, beneficiaire_last_name, start_date, notes } = body

    // Get consultant
    const { data: consultant } = await supabase
      .from('consultants')
      .select('id, organisme_id')
      .eq('user_id', user.id)
      .single()

    if (!consultant) {
      return NextResponse.json({ error: 'Not a consultant' }, { status: 403 })
    }

    // Check if beneficiaire exists
    let beneficiaireId: string

    const { data: existingUser } = await supabase
      .from('users')
      .select('id')
      .eq('email', beneficiaire_email)
      .single()

    if (existingUser) {
      // User exists, check if beneficiaire record exists
      const { data: existingBeneficiaire } = await supabase
        .from('beneficiaires')
        .select('id')
        .eq('user_id', existingUser.id)
        .single()

      if (existingBeneficiaire) {
        beneficiaireId = existingBeneficiaire.id
      } else {
        // Create beneficiaire record
        const { data: newBeneficiaire, error: beneficiaireError } = await supabase
          .from('beneficiaires')
          .insert({
            user_id: existingUser.id,
            consultant_id: consultant.id,
          })
          .select()
          .single()

        if (beneficiaireError || !newBeneficiaire) {
          return NextResponse.json({ error: 'Failed to create beneficiaire' }, { status: 500 })
        }

        beneficiaireId = newBeneficiaire.id
      }
    } else {
      // Create new user and beneficiaire
      const tempPassword = Math.random().toString(36).slice(-8) + 'Aa1!'

      const { data: authData, error: authError } = await supabase.auth.admin.createUser({
        email: beneficiaire_email,
        password: tempPassword,
        email_confirm: false,
        user_metadata: {
          first_name: beneficiaire_first_name,
          last_name: beneficiaire_last_name,
        },
      })

      if (authError || !authData.user) {
        return NextResponse.json({ error: 'Failed to create user' }, { status: 500 })
      }

      // Create user record
      await supabase
        .from('users')
        .insert({
          id: authData.user.id,
          email: beneficiaire_email,
          first_name: beneficiaire_first_name,
          last_name: beneficiaire_last_name,
          user_type: 'beneficiaire',
        })

      // Create beneficiaire record
      const { data: newBeneficiaire, error: beneficiaireError } = await supabase
        .from('beneficiaires')
        .insert({
          user_id: authData.user.id,
          consultant_id: consultant.id,
        })
        .select()
        .single()

      if (beneficiaireError || !newBeneficiaire) {
        return NextResponse.json({ error: 'Failed to create beneficiaire' }, { status: 500 })
      }

      beneficiaireId = newBeneficiaire.id
    }

    // Create bilan
    const { data: bilan, error: bilanError } = await supabase
      .from('bilans')
      .insert({
        beneficiaire_id: beneficiaireId,
        consultant_id: consultant.id,
        organisme_id: consultant.organisme_id,
        start_date,
        notes,
        status: 'draft',
        phase: 'preliminary',
      })
      .select()
      .single()

    if (bilanError || !bilan) {
      return NextResponse.json({ error: 'Failed to create bilan' }, { status: 500 })
    }

    return NextResponse.json({ data: bilan }, { status: 201 })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
