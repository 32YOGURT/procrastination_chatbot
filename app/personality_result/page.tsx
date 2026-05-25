'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { getPersonalityType, clearPersonalityType } from '@/lib/storage'
import type { PersonalityType } from '@/lib/types'

const TYPE_DATA: Record<PersonalityType, {
  tag: string
  traits: string[]
  accent: string
  bg: string
}> = {
  '비현실적 낙관주의': {
    tag: '낙관주의형',
    traits: [
      '"나중에 하면 된다"는 막연한 자신감이 강함',
      '실제 소요 시간을 과소평가함',
      '마감 직전에 몰아서 처리하려는 경향',
    ],
    accent: '#B45309',
    bg: '#FFFBF0',
  },
  '자기비난': {
    tag: '자기비난형',
    traits: [
      '미루는 자신을 강하게 자책함',
      '실패 경험을 자기 가치와 연결함',
      '우울감, 무기력으로 시작 자체가 어려움',
    ],
    accent: '#4338CA',
    bg: '#F5F5FF',
  },
  '현실저항': {
    tag: '현실저항형',
    traits: [
      '하기 싫은 일에 대한 반감이 큼',
      '미루는 순간 오히려 통제감을 느낌',
      '해야 하는 이유보다 하기 싫은 이유를 먼저 찾음',
    ],
    accent: '#BE123C',
    bg: '#FFF5F7',
  },
  '완벽주의': {
    tag: '완벽주의형',
    traits: [
      '실패와 평가에 대한 불안이 큼',
      '완벽하게 해야 한다는 압박이 강함',
      '준비만 오래 하다가 시작이 늦어짐',
    ],
    accent: '#6D28D9',
    bg: '#FAF5FF',
  },
  '자극추구': {
    tag: '자극추구형',
    traits: [
      '새롭고 재미있는 일에 쉽게 끌림',
      '흥미가 떨어지면 금방 포기함',
      '즉각적인 보상과 자극을 선호함',
    ],
    accent: '#065F46',
    bg: '#F0FDF9',
  },
}

export default function PersonalityResultPage() {
  const [personalityType, setPersonalityType] = useState<PersonalityType | null>(null)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    getPersonalityType().then(setPersonalityType)
    setMounted(true)
  }, [])

  const handleRetake = async () => {
    await clearPersonalityType()
    setPersonalityType(null)
  }

  if (!mounted) return null

  if (!personalityType) {
    return (
      <div className="min-h-full bg-emerald-50 flex flex-col items-center justify-center px-6 py-16">
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
                <div className="w-8 h-8 rounded-full bg-emerald-100 group-hover:bg-emerald-700 transition-colors duration-200 mb-4 flex items-center justify-center">
                  <span className="text-xs font-bold text-emerald-700 group-hover:text-white transition-colors duration-200">1</span>
                </div>
                <h3 className="text-sm font-semibold text-neutral-800 mb-1">검사 1</h3>
                <p className="text-xs text-neutral-400 leading-relaxed">설문 기반 유형 분류</p>
              </div>
            </Link>
            <Link href="/personality_test2">
              <div className="group rounded-2xl border border-neutral-200 bg-white p-6 hover:border-neutral-400 hover:shadow-md transition-all duration-200 cursor-pointer">
                <div className="w-8 h-8 rounded-full bg-emerald-100 group-hover:bg-emerald-700 transition-colors duration-200 mb-4 flex items-center justify-center">
                  <span className="text-xs font-bold text-emerald-700 group-hover:text-white transition-colors duration-200">2</span>
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
    <div className="min-h-full flex flex-col items-center justify-center px-6 py-16" style={{ backgroundColor: data.bg }}>
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

        <ul className="text-left flex flex-col gap-2 mb-12">
          {data.traits.map((trait, i) => (
            <li key={i} className="flex items-start gap-2 text-sm text-neutral-600 leading-relaxed">
              <span className="mt-1.5 w-1.5 h-1.5 rounded-full shrink-0" style={{ backgroundColor: data.accent }} />
              {trait}
            </li>
          ))}
        </ul>

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
