/**
 * BilanCompetence.AI - Mark Message as Read
 */

import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

/**
 * PATCH /api/messages/[id]/read
 * Mark message as read
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
    const { data: message, error } = await supabase
      .from('messages')
      .update({
        is_read: true,
        read_at: new Date().toISOString(),
      })
      .eq('id', params.id)
      .eq('receiver_id', user.id)
      .select()
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ data: message })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
