import type { PersonalityType, TaskCard } from './types'

const KEYS = {
  personalityType: 'personality_type',
  tasks: 'tasks',
} as const

export function getPersonalityType(): PersonalityType | null {
  if (typeof window === 'undefined') return null
  return localStorage.getItem(KEYS.personalityType) as PersonalityType | null
}

export function setPersonalityType(type: PersonalityType): void {
  localStorage.setItem(KEYS.personalityType, type)
}

export function clearPersonalityType(): void {
  localStorage.removeItem(KEYS.personalityType)
}

export function getTasks(): TaskCard[] {
  if (typeof window === 'undefined') return []
  const raw = localStorage.getItem(KEYS.tasks)
  return raw ? JSON.parse(raw) : []
}

export function saveTask(task: TaskCard): void {
  const tasks = getTasks()
  localStorage.setItem(KEYS.tasks, JSON.stringify([...tasks, task]))
}

export function getTaskById(id: string): TaskCard | null {
  return getTasks().find((t) => t.id === id) ?? null
}
