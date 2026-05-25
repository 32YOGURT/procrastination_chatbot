import type { TaskCard as TaskCardType } from "@/lib/types";
import Link from "next/link";

export default function TaskCard({ task }: { task: TaskCardType }) {
  return (
    <Link href={`/agent2/${task.id}`}>
      <div className="flex flex-col gap-3 rounded-xl border border-neutral-200 bg-white p-5 shadow-sm transition hover:shadow-md cursor-pointer">
        {/* 과제명 + 지연 단계 */}
        <div className="flex items-center justify-between gap-3">
          <h3 className="text-base font-semibold text-neutral-800">
            {task.title}
          </h3>
          <span className="shrink-0 rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-medium text-emerald-700">
            {task.procrastinationType}
          </span>
        </div>

        {/* 메타 정보 */}
        <div className="flex flex-wrap gap-2">
          {task.importance && (
            <span className="rounded-md bg-neutral-100 px-2 py-0.5 text-xs text-neutral-500">
              중요도 {task.importance}
            </span>
          )}
          {task.estimatedTime && (
            <span className="rounded-md bg-neutral-100 px-2 py-0.5 text-xs text-neutral-500">
              약 {task.estimatedTime}
            </span>
          )}
          {task.deadline && (
            <span className="rounded-md bg-neutral-100 px-2 py-0.5 text-xs text-neutral-500">
              마감 {task.deadline}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
