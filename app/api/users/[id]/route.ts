import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params

  const { data, error } = await supabase
    .from('users')
    .select('personality_type, user_name')
    .eq('id', id)
    .single()

  if (error) return NextResponse.json({ personality_type: null })
  return NextResponse.json(data)
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const { personalityType, userName } = await request.json()

  const updates: Record<string, string | null> = {}
  if (personalityType !== undefined) updates.personality_type = personalityType ?? null
  if (userName !== undefined) updates.user_name = userName ?? null

  const { error } = await supabase
    .from('users')
    .update(updates)
    .eq('id', id)

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ ok: true })
}
