"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { getPersonalityType, getTasks } from "@/lib/storage";
import type { PersonalityType, TaskCard } from "@/lib/types";

const TURTLE_IMAGES = [
  "/assets/turtle1-1.png",
  "/assets/turtle1-2.png",
  "/assets/turtle1-3.png",
  "/assets/turtle1-4.png",
  "/assets/turtle1-5.png",
];

export default function DashboardPage() {
  const [personalityType, setPersonalityType] =
    useState<PersonalityType | null>(null);
  const [tasks, setTasks] = useState<TaskCard[]>([]);
  const [turtleIndex, setTurtleIndex] = useState(0);

  useEffect(() => {
    getPersonalityType().then(setPersonalityType);
    getTasks().then(setTasks);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setTurtleIndex((i) => (i + 1) % TURTLE_IMAGES.length);
    }, 1500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-full flex flex-col bg-emerald-50">
      {/* 히어로 영역 */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 pt-10 pb-4">
        {/* 서비스 소개 */}
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-emerald-800 tracking-tight">
            GO북이
          </h1>
          <p className="text-sm text-emerald-600 mt-1.5 leading-relaxed">
            미루는 나를 혼내지 않고,
            <br />
            작은 한 걸음부터 도와주는 AI 거북이
          </p>
        </div>

        {/* 캐릭터 */}
        <div className="relative mb-6">
          <div className="relative" style={{ width: 220, height: 176 }}>
            <Image
              src={TURTLE_IMAGES[turtleIndex]}
              alt="GO북이 캐릭터"
              fill
              style={{ objectFit: "contain" }}
              priority
            />
          </div>
        </div>

        {/* 메인 버튼 */}
        <div className="w-full flex flex-col gap-3">
          <Link href="/personality_result" className="w-full">
            <div className="bg-emerald-600 rounded-2xl px-5 py-4 flex items-center justify-between shadow-lg shadow-emerald-200">
              <div>
                <p className="text-white font-semibold text-sm">
                  내 미루기 타입 알아보기
                </p>
                <p className="text-emerald-200 text-xs mt-0.5">
                  {personalityType
                    ? `현재 유형: ${personalityType}`
                    : "나의 지연 행동 유형 파악하기"}
                </p>
              </div>
              <span className="text-white/60 text-xl font-light">›</span>
            </div>
          </Link>

          <Link href="/tasks" className="w-full">
            <div className="bg-white rounded-2xl px-5 py-4 flex items-center justify-between shadow-sm border border-emerald-100">
              <div>
                <p className="text-neutral-800 font-semibold text-sm">
                  할 일 정리하기
                </p>
                <p className="text-neutral-400 text-xs mt-0.5">
                  {tasks.length > 0
                    ? `등록된 과제 ${tasks.length}개`
                    : "미루던 일, 오늘 시작해봐요"}
                </p>
              </div>
              <span className="text-neutral-300 text-xl font-light">›</span>
            </div>
          </Link>
        </div>
      </div>

    </div>
  );
}
