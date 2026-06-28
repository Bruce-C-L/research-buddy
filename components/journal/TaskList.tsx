'use client'

import { ACTIVITY_CATEGORIES, type ActivityCategory, type JournalTask } from '@/lib/types'

interface TaskListProps {
  tasks: JournalTask[]
  onToggle: (id: string) => void
  onDelete: (id: string) => void
  onUpdateActual: (id: string, minutes: number) => void
  readonly?: boolean
}

const categoryMap = ACTIVITY_CATEGORIES.reduce(
  (acc, cat) => {
    acc[cat.id] = cat
    return acc
  },
  {} as Record<string, (typeof ACTIVITY_CATEGORIES)[number]>
)

export default function TaskList({ tasks, onToggle, onDelete, onUpdateActual, readonly }: TaskListProps) {
  if (tasks.length === 0) {
    return (
      <div className="text-center py-8 text-gray-400 text-sm">
        还没有任务，开始规划今天吧
      </div>
    )
  }

  // Group by category
  const grouped = tasks.reduce(
    (acc, task) => {
      const cat = categoryMap[task.category]?.label || '其他'
      if (!acc[cat]) acc[cat] = []
      acc[cat].push(task)
      return acc
    },
    {} as Record<string, JournalTask[]>
  )

  return (
    <div className="space-y-4">
      {Object.entries(grouped).map(([category, categoryTasks]) => (
        <div key={category}>
          <h4 className="text-sm font-medium text-gray-500 mb-2">{category}</h4>
          <div className="space-y-2">
            {categoryTasks.map((task) => {
              const cat = categoryMap[task.category]
              return (
                <div
                  key={task.id}
                  className={`flex items-start gap-3 p-3 rounded-lg border ${
                    task.completed
                      ? 'bg-gray-50 border-gray-200'
                      : 'bg-white border-gray-100 hover:border-blue-200'
                  }`}
                >
                  <button
                    onClick={() => !readonly && onToggle(task.id)}
                    disabled={readonly}
                    className={`mt-0.5 w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-colors ${
                      task.completed
                        ? 'bg-green-500 border-green-500 text-white'
                        : 'border-gray-300 hover:border-blue-400'
                    } ${readonly ? 'cursor-default' : 'cursor-pointer'}`}
                  >
                    {task.completed && '✓'}
                  </button>

                  <div className="flex-1 min-w-0">
                    <p
                      className={`text-sm ${
                        task.completed ? 'text-gray-400 line-through' : 'text-gray-700'
                      }`}
                    >
                      {task.description}
                    </p>
                    <div className="flex items-center gap-3 mt-1 text-xs text-gray-400">
                      {task.plannedDuration && (
                        <span>计划 {task.plannedDuration} 分钟</span>
                      )}
                      {task.actualDuration && (
                        <span className={task.actualDuration > (task.plannedDuration || 0) ? 'text-orange-500' : 'text-green-600'}>
                          实际 {task.actualDuration} 分钟
                          {task.plannedDuration && task.actualDuration > task.plannedDuration && ' ⚠️ 超时'}
                        </span>
                      )}
                      {!task.completed && !readonly && (
                        <span className="text-blue-400">进行中...</span>
                      )}
                    </div>
                  </div>

                  {!readonly && (
                    <button
                      onClick={() => onDelete(task.id)}
                      className="text-gray-300 hover:text-red-500 transition-colors text-sm"
                    >
                      ✕
                    </button>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      ))}
    </div>
  )
}
