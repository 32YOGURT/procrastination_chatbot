'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { getPersonalityType, clearPersonalityType } from '@/lib/storage'
import type { PersonalityType } from '@/lib/types'

const TYPE_DATA: Record<PersonalityType, {
  tag: string
  description: string
  accent: string
  bg: string
}> = {
  '비현실적 낙관주의': {
    tag: '과신형',
    description: '시간이 충분하다고 믿으며 미루는 유형입니다. 낙관적 사고가 계획의 현실성을 흐리게 만들어, 막상 시작하면 시간이 부족해지는 패턴이 반복됩니다.',
    accent: '#B45309',
    bg: '#FFFBF0',
  },
  '자기 비난': {
    tag: '회피형',
    description: '실수에 대한 두려움으로 시작을 꺼리는 유형입니다. 완벽하지 않을 바엔 아예 하지 않으려는 마음이 행동을 가로막습니다.',
    accent: '#4338CA',
    bg: '#F5F5FF',
  },
  '현실 저항': {
    tag: '저항형',
    description: '해야 할 일에 반감을 느끼며 회피하는 유형입니다. 외부의 압박에 내면이 저항하면서 의도치 않은 지연이 생겨납니다.',
    accent: '#BE123C',
    bg: '#FFF5F7',
  },
  '완벽주의': {
    tag: '이상형',
    description: '완벽한 조건이 갖춰질 때를 기다리는 유형입니다. 높은 기준이 오히려 시작을 가로막고, 결국 아무것도 완성하지 못하는 역설에 빠집니다.',
    accent: '#6D28D9',
    bg: '#FAF5FF',
  },
  '자극 추구': {
    tag: '긴장형',
    description: '마감의 압박이 있어야 비로소 집중하는 유형입니다. 긴장감이 없으면 시작이 어렵고, 아슬아슬한 순간을 반복하게 됩니다.',
    accent: '#065F46',
    bg: '#F0FDF9',
  },
}

export default function PersonalityResultPage() {
  const [personalityType, setPersonalityType] = useState<PersonalityType | null>(null)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setPersonalityType(getPersonalityType())
    setMounted(true)
  }, [])

  const handleRetake = () => {
    clearPersonalityType()
    setPersonalityType(null)
  }

  if (!mounted) return null

  if (!personalityType) {
    return (
      <div className="min-h-screen bg-[#FAF8F5] flex flex-col items-center justify-center px-6 py-16">
        <style>{`@import url('https://fonts.googleapis.com/css2?family=Nanum+Myeongjo:wght@400;700;800&display=swap');`}</style>
        <div className="w-full max-w-md">
          <div className="mb-12 text-center">
            <p className="text-xs font-medium tracking-[0.2em] uppercase text-neutral-400 mb-4">지연 행동 교정 프로그램</p>
            <h1 style={{ fontFamily: "'Nanum Myeongjo', serif" }} className="text-3xl font-bold text-neutral-900 leading-snug mb-4">
              나의 성격 유형을<br />알아보세요
            </h1>
            <p className="text-sm text-neutral-500 leading-relaxed">
              두 가지 검사 중 하나를 선택해<br />나의 지연 행동 성격 유형을 파악합니다.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Link href="/personality_test1">
              <div className="group rounded-2xl border border-neutral-200 bg-white p-6 hover:border-neutral-400 hover:shadow-md transition-all duration-200 cursor-pointer">
                <div className="w-8 h-8 rounded-full bg-neutral-100 group-hover:bg-neutral-900 transition-colors duration-200 mb-4 flex items-center justify-center">
                  <span className="text-xs font-bold text-neutral-600 group-hover:text-white transition-colors duration-200">1</span>
                </div>
                <h3 className="text-sm font-semibold text-neutral-800 mb-1">검사 1</h3>
                <p className="text-xs text-neutral-400 leading-relaxed">설문 기반 유형 분류</p>
              </div>
            </Link>
            <Link href="/personality_test2">
              <div className="group rounded-2xl border border-neutral-200 bg-white p-6 hover:border-neutral-400 hover:shadow-md transition-all duration-200 cursor-pointer">
                <div className="w-8 h-8 rounded-full bg-neutral-100 group-hover:bg-neutral-900 transition-colors duration-200 mb-4 flex items-center justify-center">
                  <span className="text-xs font-bold text-neutral-600 group-hover:text-white transition-colors duration-200">2</span>
                </div>
                <h3 className="text-sm font-semibold text-neutral-800 mb-1">검사 2</h3>
                <p className="text-xs text-neutral-400 leading-relaxed">행동 패턴 기반 분류</p>
              </div>
            </Link>
          </div>
        </div>
      </div>
    )
  }

  const data = TYPE_DATA[personalityType]

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 py-16" style={{ backgroundColor: data.bg }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Nanum+Myeongjo:wght@400;700;800&display=swap');`}</style>
      <div className="w-full max-w-md text-center">
        <p className="text-xs font-medium tracking-[0.2em] uppercase text-neutral-400 mb-8">나의 성격 유형</p>

        <span
          className="inline-block px-3 py-1 rounded-full text-xs font-medium mb-6"
          style={{ backgroundColor: data.accent + '18', color: data.accent }}
        >
          {data.tag}
        </span>

        <h1
          style={{ fontFamily: "'Nanum Myeongjo', serif", color: data.accent }}
          className="text-4xl font-extrabold leading-tight mb-5"
        >
          {personalityType}
        </h1>

        <div className="w-10 h-px mx-auto mb-6" style={{ backgroundColor: data.accent + '60' }} />

        <p className="text-sm text-neutral-600 leading-relaxed mb-12">
          {data.description}
        </p>

        <div className="flex flex-col gap-3">
          <Link href="/dashboard">
            <div
              className="w-full rounded-xl py-3.5 text-center text-sm font-semibold text-white transition-opacity hover:opacity-90"
              style={{ backgroundColor: data.accent }}
            >
              대시보드로 가기
            </div>
          </Link>
          <button
            onClick={handleRetake}
            className="w-full rounded-xl py-3.5 text-sm font-medium text-neutral-500 border border-neutral-200 hover:bg-white transition-colors"
          >
            다시 검사하기
          </button>
        </div>
      </div>
    </div>
  )
}
