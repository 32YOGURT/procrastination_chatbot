import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET(request: NextRequest) {
  const userId = request.nextUrl.searchParams.get('user_id')
  if (!userId) return NextResponse.json({ error: 'user_id required' }, { status: 400 })

  const { data, error } = await supabase
    .from('tasks')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  const mapped = data.map((row) => ({
    id: row.id,
    title: row.title,
    personalityType: row.personality_type,
    procrastinationType: row.procrastination_type,
    deadline: row.deadline ?? '',
    importance: row.importance ?? '',
    estimatedTime: row.estimated_time ?? '',
    conversationId: row.conversation_id ?? null,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  }))
  return NextResponse.json(mapped)
}

export async function POST(request: NextRequest) {
  const body = await request.json()

  const { data, error } = await supabase
    .from('tasks')
    .insert({
      id: body.id,
      user_id: body.userId,
      title: body.title,
      personality_type: body.personalityType,
      procrastination_type: body.procrastinationType,
      deadline: body.deadline || null,
      importance: body.importance,
      estimated_time: body.estimatedTime,
      conversation_id: body.conversationId ?? null,
    })
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}
