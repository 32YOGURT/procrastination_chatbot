import type { TaskCard as TaskCardType } from "@/lib/types";
import Link from "next/link";

function formatDeadline(raw: string): string {
  if (!raw) return "";

  // ISO or "YYYY-MM-DD HH:mm" 형식
  const dt = new Date(raw.replace(" ", "T"));
  if (!isNaN(dt.getTime())) {
    const month = dt.getMonth() + 1;
    const day = dt.getDate();
    const hour = dt.getHours();
    const hasTime = raw.includes(":") || raw.includes("T");
    return hasTime
      ? `${month}월 ${day}일 ${hour}시`
      : `${month}월 ${day}일`;
  }

  // "MM월 DD일 HH시" 이미 한국어 형식이면 그대로
  if (/\d+월/.test(raw)) return raw;

  return raw;
}

export default function TaskCard({ task }: { task: TaskCardType }) {
  return (
    <div className="flex flex-col gap-3 rounded-xl border border-neutral-200 bg-white p-5 shadow-sm">
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
        {task.deadline && (
          <span className="rounded-md bg-neutral-100 px-2 py-0.5 text-xs text-neutral-500">
            마감 {formatDeadline(task.deadline)}
          </span>
        )}
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
      </div>

      {/* 과제 시작하기 버튼 */}
      <Link href={`/agent2/${task.id}`}>
        <div className="flex items-center justify-between rounded-xl bg-emerald-50 px-4 py-3 mt-1">
          <span className="text-sm font-semibold text-emerald-700">과제 시작하기</span>
          <span className="text-emerald-400 text-lg font-light">›</span>
        </div>
      </Link>
    </div>
  );
}
