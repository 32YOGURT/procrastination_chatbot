"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getPersonalityType, getTasks } from "@/lib/storage";
import type { PersonalityType, TaskCard } from "@/lib/types";
import TaskCardComponent from "@/components/dashboard/TaskCard";

export default function DashboardPage() {
  const [personalityType, setPersonalityType] =
    useState<PersonalityType | null>(null);
  const [tasks, setTasks] = useState<TaskCard[]>([]);

  useEffect(() => {
    getPersonalityType().then(setPersonalityType);
    getTasks().then(setTasks);
  }, []);

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* 헤더 */}
      <header className="border-b border-neutral-200 bg-white px-6 py-4">
        <div className="mx-auto flex max-w-3xl items-center justify-between">
          <div>
            <h1 className="text-lg font-bold text-neutral-800">내 과제 목록</h1>
            {personalityType ? (
              <p className="text-sm text-neutral-400">
                성격 유형 {personalityType}
              </p>
            ) : (
              <p className="text-sm text-amber-500">성격 검사를 완료해주세요</p>
            )}
          </div>
          <Link
            href="/personality_result"
            className="rounded-lg border border-neutral-200 px-4 py-2 text-sm font-medium text-neutral-600 transition hover:bg-neutral-100"
          >
            {personalityType ? "성격 재검사" : "성격 검사하기"}
          </Link>
        </div>
      </header>

      {/* 본문 */}
      <main className="mx-auto max-w-3xl px-6 py-8">
        {tasks.length === 0 ? (
          <div className="flex flex-col items-center gap-4 py-24 text-center">
            <p className="text-neutral-400">아직 등록된 과제가 없어요.</p>
            <Link
              href="/agent1"
              className="rounded-xl bg-indigo-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-indigo-700"
            >
              첫 과제 추가하기
            </Link>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {tasks.map((task) => (
                <TaskCardComponent key={task.id} task={task} />
              ))}
            </div>
            <div className="mt-8 flex justify-center">
              <Link
                href="/agent1"
                className="rounded-xl bg-indigo-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-indigo-700"
              >
                + 과제 추가
              </Link>
            </div>
          </>
        )}
      </main>
    </div>
  );
}
