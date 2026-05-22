export type PersonalityType =
  | '비현실적 낙관주의'
  | '자기비난'
  | '현실저항'
  | '완벽주의'
  | '자극추구'

export type ProcrastinationType =
  | '계획 지연'
  | '착수 지연'
  | '지속 지연'
  | '완수 지연'
  | '결과 평가'

export interface TaskCard {
  id: string
  title: string
  personalityType: PersonalityType
  procrastinationType: ProcrastinationType
  deadline: string
  importance: string
  estimatedTime: string
  conversationId: string | null
  createdAt: string
  updatedAt: string
}
