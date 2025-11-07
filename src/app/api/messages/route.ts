/**
 * BilanCompetence.AI - Messages API Routes
 */

import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

/**
 * GET /api/messages?bilan_id=xxx
 * Get all messages for a bilan
 */
export async function GET(request: NextRequest) {
  const supabase = createClient()

  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const searchParams = request.nextUrl.searchParams
  const bilanId = searchParams.get('bilan_id')
  const limit = parseInt(searchParams.get('limit') || '50')
  const offset = parseInt(searchParams.get('offset') || '0')

  if (!bilanId) {
    return NextResponse.json({ error: 'bilan_id is required' }, { status: 400 })
  }

  try {
    const { data: messages, error, count } = await supabase
      .from('messages')
      .select(`
        *,
        sender:users!messages_sender_id_fkey(
          id,
          first_name,
          last_name,
          email
        ),
        receiver:users!messages_receiver_id_fkey(
          id,
          first_name,
          last_name,
          email
        )
      `, { count: 'exact' })
      .eq('bilan_id', bilanId)
      .order('created_at', { ascending: true })
      .range(offset, offset + limit - 1)

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    // Get unread count for current user
    const { count: unreadCount } = await supabase
      .from('messages')
      .select('*', { count: 'exact', head: true })
      .eq('bilan_id', bilanId)
      .eq('receiver_id', user.id)
      .eq('is_read', false)

    return NextResponse.json({
      data: messages,
      meta: {
        total: count,
        unread_count: unreadCount,
        limit,
        offset,
      },
    })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

/**
 * POST /api/messages
 * Send a new message
 */
export async function POST(request: NextRequest) {
  const supabase = createClient()

  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const body = await request.json()
    const { bilan_id, receiver_id, content } = body

    if (!bilan_id || !receiver_id || !content) {
      return NextResponse.json(
        { error: 'bilan_id, receiver_id, and content are required' },
        { status: 400 }
      )
    }

    const { data: message, error } = await supabase
      .from('messages')
      .insert({
        bilan_id,
        sender_id: user.id,
        receiver_id,
        content,
      })
      .select(`
        *,
        sender:users!messages_sender_id_fkey(
          id,
          first_name,
          last_name,
          email
        ),
        receiver:users!messages_receiver_id_fkey(
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

    // TODO: Send email notification to receiver

    return NextResponse.json({ data: message }, { status: 201 })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
