export type PersonalityType =
  | '비현실적 낙관주의'
  | '자기 비난'
  | '현실 저항'
  | '완벽주의'
  | '자극 추구'

export type ProcrastinationType =
  | '계획 지연'
  | '착수 지연'
  | '지속 지연'
  | '완수 지연'
  | '결과 평가'

export interface TaskCard {
  id: string
  title: string
  description: string
  personalityType: PersonalityType
  procrastinationType: ProcrastinationType
  deadline: string        // 마감일 (YYYY-MM-DD)
  importance: string      // 중요도 (예: 높음 / 보통 / 낮음)
  taskCategory: string    // 과제 종류 (예: 보고서, 시험, 발표 등)
  estimatedTime: string   // 예상 소요시간 (예: 2시간, 하루 등)
  createdAt: string
}
