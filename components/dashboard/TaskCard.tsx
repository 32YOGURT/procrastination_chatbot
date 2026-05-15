import type { TaskCard as TaskCardType } from '@/lib/types'
import Link from 'next/link'

export default function TaskCard({ task }: { task: TaskCardType }) {
  return (
    <Link href={`/agent2/${task.id}`}>
      <div className="flex flex-col gap-2 rounded-xl border border-neutral-200 bg-white p-5 shadow-sm transition hover:shadow-md cursor-pointer">
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-neutral-400">{task.personalityType}</span>
          <span className="rounded-full bg-indigo-50 px-2.5 py-0.5 text-xs font-medium text-indigo-600">
            {task.procrastinationType}
          </span>
        </div>
        <h3 className="text-base font-semibold text-neutral-800">{task.title}</h3>
        <p className="text-sm text-neutral-500 line-clamp-2">{task.description}</p>
        <span className="mt-1 text-xs text-neutral-300">{new Date(task.createdAt).toLocaleDateString('ko-KR')}</span>
      </div>
    </Link>
  )
}
