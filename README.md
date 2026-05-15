2026년 1학기 행동심리학과디지털멘탈케어 (PSY3173.01-00) 프로젝트입니다.

## 기술 스택

- Frontend: Next.js (App Router), TypeScript, Tailwind CSS
- AI: Dify (Cloud)
- Backend: Next.js API Routes
- DB: 미도입 (LocalStorage 기반), 향후 Supabase 예정

## 페이지 구조

| 경로               | 설명                                                                   |
| ------------------ | ---------------------------------------------------------------------- |
| `/onboarding`      | 성격 검사 설문 → `personality_type` 저장                               |
| `/dashboard`       | 과제 카드 목록                                                         |
| `/agent1`          | Agent1 채팅 — 과제 정보 수집 → `procrastination_type` 산출 → 카드 생성 |
| `/agent2/[cardId]` | Agent2 채팅 — 카드별 CBT 솔루션 제공                                   |

## 폴더 구조

```
app/
├── onboarding/page.tsx       # 성격 검사
├── dashboard/page.tsx        # 과제 카드 목록
├── agent1/page.tsx           # 과제 추가 채팅
├── agent2/[cardId]/page.tsx  # 솔루션 채팅
└── api/
    ├── agent1/route.ts       # Dify Agent1 프록시
    └── agent2/route.ts       # Dify Agent2 프록시

components/
├── ui/                       # 공용 UI 컴포넌트
├── chat/
│   ├── ChatWindow.tsx
│   └── MessageBubble.tsx
├── dashboard/
│   ├── TaskCard.tsx
│   └── TaskCardList.tsx
└── onboarding/
    └── QuestionStep.tsx

lib/
├── storage.ts                # LocalStorage 유틸
└── types.ts                  # 공용 타입 정의
```
