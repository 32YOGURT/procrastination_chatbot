"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { getTasks } from "@/lib/storage";
import TaskCard from "@/components/dashboard/TaskCard";
import type { TaskCard as TaskCardType } from "@/lib/types";

export default function TasksPage() {
  const router = useRouter();
  const [tasks, setTasks] = useState<TaskCardType[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    getTasks().then((t) => {
      setTasks(t);
      setMounted(true);
    });
  }, []);

  if (!mounted) return null;

  return (
    <div className="min-h-full bg-emerald-50 flex flex-col relative">
      {/* 헤더 */}
      <div className="shrink-0 flex items-center gap-3 px-5 pt-6 pb-3">
        <button
          onClick={() => router.push("/dashboard")}
          className="w-8 h-8 rounded-full bg-white border border-emerald-100 shadow-sm flex items-center justify-center"
        >
          <span className="text-neutral-500 text-base leading-none">‹</span>
        </button>
        <p className="text-sm font-semibold text-neutral-700">할 일 목록</p>
      </div>

      {/* 과제 목록 */}
      <div className="flex-1 px-5 py-3 flex flex-col gap-3">
        {tasks.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center gap-3 pb-16">
            <p className="text-sm text-neutral-400">
              아직 등록된 과제가 없어요.
            </p>
            <Link href="/agent1">
              <div className="rounded-xl bg-emerald-600 px-5 py-3 text-sm font-semibold text-white shadow-md shadow-emerald-200">
                첫 과제 등록하기
              </div>
            </Link>
          </div>
        ) : (
          tasks.map((task) => <TaskCard key={task.id} task={task} />)
        )}
      </div>

      {/* FAB */}
      <Link href="/agent1" className="absolute bottom-6 right-5">
        <div className="w-14 h-14 rounded-full bg-emerald-600 shadow-lg shadow-emerald-200 flex items-center justify-center">
          <span className="text-white text-2xl leading-none">+</span>
        </div>
      </Link>
    </div>
  );
}
