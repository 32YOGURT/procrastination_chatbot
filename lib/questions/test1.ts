import type { PersonalityType } from "@/lib/types";

export interface Test1Question {
  text: string;
  type: PersonalityType;
  reverse: boolean;
}

// 5개 유형 × 8문항, 라운드별 번갈아 배치
export const QUESTIONS: Test1Question[] = [
  // 라운드 1
  {
    text: "나는 마감이 가까워져도 결국 해낼 수 있다고 믿는다.",
    type: "비현실적 낙관주의",
    reverse: false,
  },
  {
    text: "일을 미루는 나 자신이 실망스럽다.",
    type: "자기비난",
    reverse: false,
  },
  {
    text: "하기 싫은 일은 가능한 한 피하려 한다.",
    type: "현실저항",
    reverse: false,
  },
  {
    text: "일을 완벽하게 하고 싶다는 생각이 강하다.",
    type: "완벽주의",
    reverse: false,
  },
  {
    text: "새로운 일이 더 흥미롭게 느껴진다.",
    type: "자극추구",
    reverse: false,
  },

  // 라운드 2
  {
    text: "예상한 시간보다 일이 오래 걸리는 경우가 많다.",
    type: "비현실적 낙관주의",
    reverse: false,
  },
  {
    text: "'나는 잘 못하는 사람이다'라는 생각이 든다.",
    type: "자기비난",
    reverse: false,
  },
  {
    text: "내 스타일과 맞지 않는 일은 미루고 싶다.",
    type: "현실저항",
    reverse: false,
  },
  { text: "실패할까 봐 시작이 늦어진다.", type: "완벽주의", reverse: false },
  {
    text: "흥미를 잃으면 일을 쉽게 포기한다.",
    type: "자극추구",
    reverse: false,
  },

  // 라운드 3
  {
    text: "나는 시간을 넉넉하게 잡는 편이다.",
    type: "비현실적 낙관주의",
    reverse: true,
  },
  {
    text: "해야 할 일을 못하면 기분이 크게 나빠진다.",
    type: "자기비난",
    reverse: false,
  },
  {
    text: "나는 해야 할 일을 바로 시작하는 편이다.",
    type: "현실저항",
    reverse: true,
  },
  {
    text: "나는 적당히 해도 괜찮다고 생각한다.",
    type: "완벽주의",
    reverse: true,
  },
  {
    text: "나는 꾸준히 일을 지속하는 편이다.",
    type: "자극추구",
    reverse: true,
  },

  // 라운드 4
  {
    text: "'아마 괜찮겠지'라는 생각을 자주 한다.",
    type: "비현실적 낙관주의",
    reverse: false,
  },
  { text: "나는 나 자신에게 관대하다.", type: "자기비난", reverse: true },
  {
    text: "일을 미루기 위한 이유를 찾을 때가 있다.",
    type: "현실저항",
    reverse: false,
  },
  { text: "다른 사람의 평가가 신경 쓰인다.", type: "완벽주의", reverse: false },
  {
    text: "성과가 빨리 나오지 않으면 지친다.",
    type: "자극추구",
    reverse: false,
  },

  // 라운드 5
  {
    text: "계획 없이도 잘 해낼 수 있다고 믿는다.",
    type: "비현실적 낙관주의",
    reverse: false,
  },
  { text: "작은 실패도 크게 받아들인다.", type: "자기비난", reverse: false },
  {
    text: "나는 주어진 일을 그대로 받아들이는 편이다.",
    type: "현실저항",
    reverse: true,
  },
  {
    text: "나는 실수를 크게 신경 쓰지 않는다.",
    type: "완벽주의",
    reverse: true,
  },
  { text: "나는 지루한 일도 끝까지 해낸다.", type: "자극추구", reverse: true },

  // 라운드 6
  {
    text: "나는 일을 미루지 않으려고 노력한다.",
    type: "비현실적 낙관주의",
    reverse: true,
  },
  {
    text: "나는 나의 능력을 긍정적으로 평가한다.",
    type: "자기비난",
    reverse: true,
  },
  {
    text: "미루기로 결정하면 마음이 편해진다.",
    type: "현실저항",
    reverse: false,
  },
  {
    text: "일을 시작하기 전에 많은 준비를 한다.",
    type: "완벽주의",
    reverse: false,
  },
  {
    text: "새로운 자극을 자주 찾는 편이다.",
    type: "자극추구",
    reverse: false,
  },

  // 라운드 7
  {
    text: "시작이 늦어도 결과에는 큰 문제가 없다고 생각한다.",
    type: "비현실적 낙관주의",
    reverse: false,
  },
  {
    text: "우울하거나 기분이 가라앉으면 일을 시작하기 어렵다.",
    type: "자기비난",
    reverse: false,
  },
  {
    text: "귀찮다는 이유로 일을 미루는 경우가 많다.",
    type: "현실저항",
    reverse: false,
  },
  {
    text: "나는 결과보다 과정을 중요하게 생각한다.",
    type: "완벽주의",
    reverse: true,
  },
  {
    text: "흥미로운 일이 생기면 기존 일을 중단한다.",
    type: "자극추구",
    reverse: false,
  },

  // 라운드 8
  {
    text: "나는 현실적인 시간 계획을 세운다.",
    type: "비현실적 낙관주의",
    reverse: true,
  },
  { text: "나는 내 실수를 쉽게 넘긴다.", type: "자기비난", reverse: true },
  {
    text: "나는 책임감을 느끼면 바로 행동한다.",
    type: "현실저항",
    reverse: true,
  },
  {
    text: "사소한 부분까지 신경 쓰다가 시간이 지체된다.",
    type: "완벽주의",
    reverse: false,
  },
  { text: "나는 집중력을 오래 유지한다.", type: "자극추구", reverse: true },
];
