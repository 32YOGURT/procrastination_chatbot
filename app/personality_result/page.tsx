"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { getPersonalityType, clearPersonalityType } from "@/lib/storage";
import type { PersonalityType } from "@/lib/types";

const TYPE_DATA: Record<
  PersonalityType,
  {
    tag: string;
    traits: string[];
    accent: string;
    turtle: string;
  }
> = {
  "비현실적 낙관주의": {
    tag: "낙관주의형",
    traits: [
      '"나중에 하면 된다"는 막연한 자신감이 강함',
      "실제 소요 시간을 과소평가함",
      "마감 직전에 몰아서 처리하려는 경향",
    ],
    accent: "#B45309",
    turtle: "/assets/turtle1-1.png",
  },
  자기비난: {
    tag: "자기비난형",
    traits: [
      "미루는 자신을 강하게 자책함",
      "실패 경험을 자기 가치와 연결함",
      "우울감, 무기력으로 시작 자체가 어려움",
    ],
    accent: "#4338CA",
    turtle: "/assets/turtle1-2.png",
  },
  현실저항: {
    tag: "현실저항형",
    traits: [
      "하기 싫은 일에 대한 반감이 큼",
      "미루는 순간 오히려 통제감을 느낌",
      "해야 하는 이유보다 하기 싫은 이유를 먼저 찾음",
    ],
    accent: "#BE123C",
    turtle: "/assets/turtle1-3.png",
  },
  완벽주의: {
    tag: "완벽주의형",
    traits: [
      "실패와 평가에 대한 불안이 큼",
      "완벽하게 해야 한다는 압박이 강함",
      "준비만 오래 하다가 시작이 늦어짐",
    ],
    accent: "#6D28D9",
    turtle: "/assets/turtle1-4.png",
  },
  자극추구: {
    tag: "자극추구형",
    traits: [
      "새롭고 재미있는 일에 쉽게 끌림",
      "흥미가 떨어지면 금방 포기함",
      "즉각적인 보상과 자극을 선호함",
    ],
    accent: "#065F46",
    turtle: "/assets/turtle1-5.png",
  },
};

const BUBBLE_TEXTS: Record<string, string> = {
  default:
    "안녕! 나는 GO북이야 🐢\n네가 왜 미루는지 함께 알아보자!\n어떤 방식으로 검사할까?",
  test1: "설문에 답하면서\n나의 유형을 찾아가는 방식이야!\n솔직하게 답해줘 😊",
  test2:
    "실제 상황을 보고\n가장 나다운 선택을 고르면 돼!\n직관적으로 골라봐 ✨",
};

export default function PersonalityResultPage() {
  const router = useRouter();
  const [personalityType, setPersonalityType] =
    useState<PersonalityType | null>(null);
  const [mounted, setMounted] = useState(false);
  const [hovered, setHovered] = useState("default");

  useEffect(() => {
    getPersonalityType().then(setPersonalityType);
    setMounted(true);
  }, []);

  const handleRetake = async () => {
    await clearPersonalityType();
    setPersonalityType(null);
  };

  if (!mounted) return null;

  if (!personalityType) {
    return (
      <div className="h-full bg-emerald-50 flex flex-col">
        {/* 상단 헤더 */}
        <div className="shrink-0 flex items-center gap-3 px-5 pt-6 pb-3">
          <button
            onClick={() => router.back()}
            className="w-8 h-8 rounded-full bg-white border border-emerald-100 shadow-sm flex items-center justify-center"
          >
            <span className="text-neutral-500 text-base leading-none">‹</span>
          </button>
          <p className="text-sm font-semibold text-neutral-700">
            GO북이와 내 미루기 타입 진단하기
          </p>
        </div>

        {/* 중간 + 버튼 전체 */}
        <div className="flex-1 flex flex-col items-center justify-center px-6 gap-5 pb-16">
          <div className="relative" style={{ width: 140, height: 140 }}>
            <Image
              src="/assets/turtle1-2.png"
              alt="GO북이"
              fill
              style={{ objectFit: "contain" }}
              priority
            />
          </div>

          {/* 말풍선 */}
          <div className="relative w-full">
            <div
              className="absolute -top-3 left-1/2 -translate-x-1/2 w-0 h-0"
              style={{
                borderLeft: "10px solid transparent",
                borderRight: "10px solid transparent",
                borderBottom: "12px solid #d1fae5",
              }}
            />
            <div
              className="absolute -top-[10px] left-1/2 -translate-x-1/2 w-0 h-0"
              style={{
                borderLeft: "9px solid transparent",
                borderRight: "9px solid transparent",
                borderBottom: "11px solid white",
              }}
            />
            <div className="bg-white rounded-2xl px-5 py-4 border border-emerald-100 shadow-sm">
              <p className="text-sm text-neutral-700 text-center leading-relaxed">
                {BUBBLE_TEXTS[hovered].split("\n").map((line, i) => (
                  <span key={i}>
                    {line}
                    {i < 2 && <br />}
                  </span>
                ))}
              </p>
            </div>
          </div>

          {/* 버튼 */}
          <div className="w-full flex flex-col gap-3 mt-8">
            <Link
              href="/personality_test1"
              className="w-full"
              onMouseEnter={() => setHovered("test1")}
              onMouseLeave={() => setHovered("default")}
            >
              <div className="bg-emerald-600 rounded-2xl px-5 py-4 flex items-center justify-between shadow-lg shadow-emerald-200">
                <div>
                  <p className="text-white font-semibold text-sm">
                    검사 1 시작하기
                  </p>
                  <p className="text-emerald-200 text-xs mt-0.5">
                    설문 기반 유형 분류
                  </p>
                </div>
                <span className="text-white/60 text-xl font-light">›</span>
              </div>
            </Link>
            <Link
              href="/personality_test2"
              className="w-full"
              onMouseEnter={() => setHovered("test2")}
              onMouseLeave={() => setHovered("default")}
            >
              <div className="bg-white rounded-2xl px-5 py-4 flex items-center justify-between shadow-sm border border-emerald-100">
                <div>
                  <p className="text-neutral-800 font-semibold text-sm">
                    검사 2 시작하기
                  </p>
                  <p className="text-neutral-400 text-xs mt-0.5">
                    행동 패턴 기반 분류
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

  const data = TYPE_DATA[personalityType];

  return (
    <div className="h-full bg-emerald-50 flex flex-col">
      {/* 결과 내용 */}
      <div className="flex-1 flex flex-col justify-center px-5 pb-4">
        <span
          className="inline-block px-3 py-1 rounded-full text-xs font-semibold mb-4 self-start"
          style={{ backgroundColor: data.accent + "20", color: data.accent }}
        >
          {data.tag}
        </span>

        <h1 className="text-3xl font-bold text-neutral-800 tracking-tight mb-5">
          {personalityType}
        </h1>

        <div className="bg-white/60 rounded-2xl px-5 py-4 border border-white/80 flex flex-col gap-3">
          {data.traits.map((trait, i) => (
            <div key={i} className="flex items-start gap-2.5">
              <span
                className="mt-1.5 w-1.5 h-1.5 rounded-full shrink-0"
                style={{ backgroundColor: data.accent }}
              />
              <p className="text-sm text-neutral-600 leading-relaxed">
                {trait}
              </p>
            </div>
          ))}
        </div>

        <div className="flex justify-center mt-5">
          <div className="relative" style={{ width: 220, height: 176 }}>
            <Image
              src={data.turtle}
              alt="GO북이"
              fill
              style={{ objectFit: "contain" }}
            />
          </div>
        </div>
      </div>

      {/* 버튼 */}
      <div className="shrink-0 px-5 pb-5 flex flex-col gap-3">
        <Link href="/dashboard" className="w-full">
          <div
            className="rounded-2xl px-5 py-4 flex items-center justify-between shadow-lg"
            style={{ backgroundColor: data.accent }}
          >
            <p className="text-white font-semibold text-sm">대시보드로 가기</p>
            <span className="text-white/60 text-xl font-light">›</span>
          </div>
        </Link>
        <button
          onClick={handleRetake}
          className="w-full rounded-2xl px-5 py-4 bg-white/60 border border-white/80 text-sm font-medium text-neutral-500"
        >
          다시 검사하기
        </button>
      </div>
    </div>
  );
}
