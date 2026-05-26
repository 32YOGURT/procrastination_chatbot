"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getPersonalityType, getTasks, clearPersonalityType } from "@/lib/storage";
import type { PersonalityType, TaskCard } from "@/lib/types";

const TYPE_EMOJI: Record<PersonalityType, string> = {
  "비현실적 낙관주의": "😄",
  "자기비난": "😔",
  "현실저항": "😤",
  "완벽주의": "😰",
  "자극추구": "⚡",
};

export default function MyPage() {
  const [personalityType, setPersonalityType] = useState<PersonalityType | null>(null);
  const [tasks, setTasks] = useState<TaskCard[]>([]);

  useEffect(() => {
    getPersonalityType().then(setPersonalityType);
    getTasks().then(setTasks);
  }, []);

  const handleRetake = async () => {
    await clearPersonalityType();
    setPersonalityType(null);
  };

  return (
    <div className="min-h-full bg-emerald-50 px-5 pt-8 pb-6 flex flex-col gap-4">

      <h2 className="text-lg font-bold text-neutral-800">마이페이지</h2>

      {/* 내 유형 카드 */}
      <div className="bg-white rounded-2xl p-5 shadow-sm border border-emerald-100">
        <p className="text-xs text-neutral-400 font-medium mb-3">나의 미루기 유형</p>
        {personalityType ? (
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-3xl">{TYPE_EMOJI[personalityType]}</span>
              <div>
                <p className="text-sm font-bold text-neutral-800">{personalityType}</p>
                <p className="text-xs text-neutral-400 mt-0.5">유형 검사 완료</p>
              </div>
            </div>
            <button
              onClick={handleRetake}
              className="text-xs text-neutral-400 border border-neutral-200 rounded-lg px-3 py-1.5"
            >
              재검사
            </button>
          </div>
        ) : (
          <div className="flex items-center justify-between">
            <p className="text-sm text-neutral-400">아직 검사를 하지 않았어요</p>
            <Link
              href="/personality_result"
              className="text-xs text-emerald-600 border border-emerald-200 rounded-lg px-3 py-1.5 font-medium"
            >
              검사하기
            </Link>
          </div>
        )}
      </div>

      {/* 활동 통계 */}
      <div className="bg-white rounded-2xl p-5 shadow-sm border border-emerald-100">
        <p className="text-xs text-neutral-400 font-medium mb-3">활동 현황</p>
        <div className="flex gap-4">
          <div className="flex-1 text-center">
            <p className="text-2xl font-bold text-emerald-600">{tasks.length}</p>
            <p className="text-xs text-neutral-400 mt-1">등록한 과제</p>
          </div>
          <div className="w-px bg-neutral-100" />
          <div className="flex-1 text-center">
            <p className="text-2xl font-bold text-emerald-600">{personalityType ? 1 : 0}</p>
            <p className="text-xs text-neutral-400 mt-1">완료한 검사</p>
          </div>
        </div>
      </div>

    </div>
  );
}
