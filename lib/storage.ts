import type { PersonalityType, TaskCard } from './types'

const KEYS = {
  userId: 'user_id',
} as const

// --- 유저 ID ---

export function getUserId(): string {
  if (typeof window === 'undefined') return ''
  let id = localStorage.getItem(KEYS.userId)
  if (!id) {
    id = crypto.randomUUID()
    localStorage.setItem(KEYS.userId, id)
  }
  return id
}

// --- 성격 유형 ---

export async function getPersonalityType(): Promise<PersonalityType | null> {
  const userId = getUserId()
  const res = await fetch(`/api/users/${userId}`)
  if (!res.ok) return null
  const data = await res.json()
  return data.personality_type as PersonalityType | null
}

export async function setPersonalityType(type: PersonalityType): Promise<void> {
  const userId = getUserId()
  await fetch(`/api/users/${userId}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ personalityType: type }),
  })
}

export async function clearPersonalityType(): Promise<void> {
  const userId = getUserId()
  await fetch(`/api/users/${userId}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ personalityType: null }),
  })
}

// --- 과제 ---

export async function getTasks(): Promise<TaskCard[]> {
  const userId = getUserId()
  const res = await fetch(`/api/tasks?user_id=${userId}`)
  if (!res.ok) return []
  return res.json()
}

export async function saveTask(task: Omit<TaskCard, 'updatedAt'>): Promise<void> {
  const userId = getUserId()
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
