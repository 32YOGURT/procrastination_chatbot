"use client";

import { QUESTIONS } from "@/lib/questions/test2";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { setPersonalityType } from "@/lib/storage";
import type { PersonalityType } from "@/lib/types";

function calculatePersonalityType(
  selected: (PersonalityType | null)[],
): PersonalityType {
  const counts: Record<PersonalityType, number> = {
    "비현실적 낙관주의": 0,
    "자기비난": 0,
    "현실저항": 0,
    완벽주의: 0,
    "자극추구": 0,
  };

  selected.forEach((type) => {
    if (type) counts[type] += 1;
  });

  return (Object.entries(counts) as [PersonalityType, number][]).reduce(
    (best, [type, count]) => (count > best[1] ? [type, count] : best),
    ["비현실적 낙관주의", -Infinity] as [PersonalityType, number],
  )[0];
}

export default function PersonalityTest2Page() {
  const router = useRouter();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selected, setSelected] = useState<(PersonalityType | null)[]>(
    Array(QUESTIONS.length).fill(null),
  );

  const currentSelected = selected[currentIndex];
  const isLast = currentIndex === QUESTIONS.length - 1;
  const progress = ((currentIndex + 1) / QUESTIONS.length) * 100;
  const question = QUESTIONS[currentIndex];

  const handleSelect = (type: PersonalityType) => {
    const next = [...selected];
    next[currentIndex] = type;
    setSelected(next);
  };

  const handleNext = async () => {
    if (isLast) {
      const type = calculatePersonalityType(selected);
      await setPersonalityType(type);
      router.push("/personality_result");
    } else {
      setCurrentIndex((i) => i + 1);
    }
  };

  const handlePrev = () => {
    setCurrentIndex((i) => i - 1);
  };

  return (
    <div className="min-h-full bg-emerald-50 flex flex-col items-center justify-center px-6 py-12">
      <div className="w-full max-w-lg">
        {/* 진행률 */}
        <div className="mb-10">
          <div className="flex justify-between text-xs text-neutral-400 mb-2">
            <span>
              {currentIndex + 1} / {QUESTIONS.length}
            </span>
            <span>검사 2</span>
          </div>
          <div className="h-1 bg-neutral-200 rounded-full">
            <div
              className="h-1 bg-emerald-600 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* 시나리오 */}
        <div className="bg-neutral-100 rounded-xl px-5 py-4 mb-8">
          <p className="text-sm text-neutral-600 leading-relaxed">
            {question.scenario}
          </p>
        </div>

        {/* 선택지 */}
        <div className="flex flex-col gap-3 mb-10">
          {question.options.map((option, i) => (
            <button
              key={i}
              onClick={() => handleSelect(option.type)}
              className={`w-full text-left px-5 py-4 rounded-xl border-2 text-sm leading-relaxed transition-all duration-150
                ${
                  currentSelected === option.type
                    ? "border-emerald-700 bg-emerald-700 text-white"
                    : "border-neutral-200 bg-white text-neutral-600 hover:border-neutral-400"
                }`}
            >
              <span
                className={`font-semibold mr-2 ${currentSelected === option.type ? "text-white" : "text-neutral-400"}`}
              >
                {String.fromCharCode(65 + i)}.
              </span>
              {option.text}
            </button>
          ))}
        </div>

        {/* 네비게이션 */}
        <div className="flex gap-3">
          {currentIndex > 0 && (
            <button
              onClick={handlePrev}
              className="flex-1 rounded-xl border border-neutral-200 py-3.5 text-sm font-medium text-neutral-600 hover:bg-neutral-100 transition-colors"
            >
              이전
            </button>
          )}
          <button
            onClick={handleNext}
            disabled={currentSelected === null}
            className="flex-1 rounded-xl bg-emerald-700 py-3.5 text-sm font-semibold text-white disabled:opacity-30 hover:bg-emerald-800 transition-colors"
          >
            {isLast ? "결과 보기" : "다음"}
          </button>
        </div>
      </div>
    </div>
  );
}
