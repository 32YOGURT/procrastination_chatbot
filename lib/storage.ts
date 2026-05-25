import type { PersonalityType, TaskCard } from './types'
import { supabaseBrowser } from './supabase-browser'

export async function getAuthUserId(): Promise<string> {
  if (typeof window === 'undefined') return ''
  const { data: { session } } = await supabaseBrowser.auth.getSession()
  if (session?.user) return session.user.id
  const { data } = await supabaseBrowser.auth.signInAnonymously()
  return data.user?.id ?? ''
}

export async function getUser(): Promise<{ personalityType: PersonalityType | null; userName: string | null }> {
  const userId = await getAuthUserId()
  if (!userId) return { personalityType: null, userName: null }
  const res = await fetch(`/api/users/${userId}`)
  if (!res.ok) return { personalityType: null, userName: null }
  const data = await res.json()
  return {
    personalityType: data.personality_type as PersonalityType | null,
    userName: data.user_name as string | null,
  }
}

export async function getPersonalityType(): Promise<PersonalityType | null> {
  const { personalityType } = await getUser()
  return personalityType
}

export async function getUserName(): Promise<string | null> {
  const { userName } = await getUser()
  return userName
}

export async function setUserName(name: string): Promise<void> {
  const userId = await getAuthUserId()
  if (!userId) return
  await fetch(`/api/users/${userId}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ userName: name }),
  })
}

export async function setPersonalityType(type: PersonalityType): Promise<void> {
  const userId = await getAuthUserId()
  if (!userId) return
  await fetch(`/api/users/${userId}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ personalityType: type }),
  })
}

export async function clearPersonalityType(): Promise<void> {
  const userId = await getAuthUserId()
  if (!userId) return
  await fetch(`/api/users/${userId}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ personalityType: null }),
  })
}

export async function getTasks(): Promise<TaskCard[]> {
  const userId = await getAuthUserId()
  if (!userId) return []
  const res = await fetch(`/api/tasks?user_id=${userId}`)
  if (!res.ok) return []
  return res.json()
}

export async function saveTask(task: Omit<TaskCard, 'updatedAt' | 'conversationId'>): Promise<void> {
  const userId = await getAuthUserId()
  if (!userId) return
  await fetch('/api/tasks', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ ...task, userId }),
  })
}

export async function getTaskById(id: string): Promise<TaskCard | null> {
  const tasks = await getTasks()
  return tasks.find((t) => t.id === id) ?? null
}

export async function updateConversationId(taskId: string, conversationId: string): Promise<void> {
  await fetch(`/api/tasks/${taskId}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ conversationId }),
  })
}
