"use client";

import { QUESTIONS } from "@/lib/questions/test1";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { setPersonalityType } from "@/lib/storage";
import type { PersonalityType } from "@/lib/types";

function calculatePersonalityType(answers: number[]): PersonalityType {
  const scores: Record<PersonalityType, number> = {
    "비현실적 낙관주의": 0,
    "자기비난": 0,
    "현실저항": 0,
    "완벽주의": 0,
    "자극추구": 0,
  };

  QUESTIONS.forEach((q, i) => {
    const raw = answers[i];
    scores[q.type] += q.reverse ? 6 - raw : raw;
  });

  return (Object.entries(scores) as [PersonalityType, number][]).reduce(
    (best, [type, score]) => (score > best[1] ? [type, score] : best),
    ["비현실적 낙관주의", -Infinity] as [PersonalityType, number]
  )[0];
}

export default function PersonalityTest1Page() {
  const router = useRouter();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<(number | null)[]>(
    Array(QUESTIONS.length).fill(null),
  );

  const currentAnswer = answers[currentIndex];
  const isLast = currentIndex === QUESTIONS.length - 1;
  const progress = ((currentIndex + 1) / QUESTIONS.length) * 100;

  const handleSelect = (score: number) => {
    const next = [...answers];
    next[currentIndex] = score;
    setAnswers(next);
  };

  const handleNext = async () => {
    if (isLast) {
      const type = calculatePersonalityType(answers as number[]);
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
    <div className="min-h-screen bg-neutral-50 flex flex-col items-center justify-center px-6 py-12">
      <div className="w-full max-w-lg">
        {/* 진행률 */}
        <div className="mb-10">
          <div className="flex justify-between text-xs text-neutral-400 mb-2">
            <span>
              {currentIndex + 1} / {QUESTIONS.length}
            </span>
            <span>검사 1</span>
          </div>
          <div className="h-1 bg-neutral-200 rounded-full">
            <div
              className="h-1 bg-neutral-800 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* 문항 */}
        <p className="text-lg font-medium text-neutral-800 leading-relaxed mb-10">
          {QUESTIONS[currentIndex].text}
        </p>

        {/* 척도 선택 */}
        <div className="mb-12">
          <div className="flex gap-3 mb-3">
            {[1, 2, 3, 4, 5].map((score) => (
              <button
                key={score}
                onClick={() => handleSelect(score)}
                className={`flex-1 py-4 rounded-xl text-sm font-semibold border-2 transition-all duration-150
                  ${
                    currentAnswer === score
                      ? "border-neutral-800 bg-neutral-800 text-white"
                      : "border-neutral-200 bg-white text-neutral-500 hover:border-neutral-400"
                  }`}
              >
                {score}
              </button>
            ))}
          </div>
          <div className="flex justify-between text-xs text-neutral-400 px-1">
            <span>매우 그렇지 않다</span>
            <span>매우 그렇다</span>
          </div>
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
            disabled={currentAnswer === null}
            className="flex-1 rounded-xl bg-neutral-800 py-3.5 text-sm font-semibold text-white disabled:opacity-30 hover:bg-neutral-700 transition-colors"
          >
            {isLast ? "결과 보기" : "다음"}
          </button>
        </div>
      </div>
    </div>
  );
}
