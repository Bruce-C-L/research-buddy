'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { ACTIVITY_CATEGORIES, type JournalEntry, type Milestone } from '@/lib/types'

const categoryMap = ACTIVITY_CATEGORIES.reduce(
  (acc, cat) => {
    acc[cat.id] = cat
    return acc
  },
  {} as Record<string, (typeof ACTIVITY_CATEGORIES)[number]>
)

export default function Journal() {
  const [entries, setEntries] = useState<JournalEntry[]>([])
  const [milestones, setMilestones] = useState<Milestone[]>([])
  const [filter, setFilter] = useState('all')

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem('journal_entries') || '[]')
    setEntries(stored.sort((a: JournalEntry, b: JournalEntry) => b.date.localeCompare(a.date)))

    const ms = JSON.parse(localStorage.getItem('milestones') || '[]')
    setMilestones(ms)
  }, [])

  const deleteEntry = (id: string) => {
    if (!confirm('确定删除这篇记录？')) return
    const updated = entries.filter((e) => e.id !== id)
    setEntries(updated)
    localStorage.setItem('journal_entries', JSON.stringify(updated))
  }

  const getMilestone = (milestoneId?: string) => {
    if (!milestoneId) return null
    return milestones.find((m) => m.id === milestoneId)
  }

  const getStreak = () => {
    if (entries.length === 0) return 0
    const dates = entries.map((e) => e.date).sort().reverse()
    const uniqueDates = [...new Set(dates)]
    let streak = 0
    const today = new Date()
    let checkDate = new Date(today)

    for (const dateStr of uniqueDates) {
      const entryDate = new Date(dateStr)
      const diffDays = Math.floor((checkDate.getTime() - entryDate.getTime()) / (1000 * 60 * 60 * 24))

      if (diffDays <= 1) {
        streak++
        checkDate = entryDate
      } else {
        break
      }
    }
    return streak
  }

  const streak = getStreak()

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">📝 科研日记</h1>
            <p className="text-gray-500 mt-1">
              共 {entries.length} 篇记录
              {streak > 0 && (
                <span className="ml-2 text-orange-600">
                  🔥 连续记录 {streak} 天
                </span>
              )}
            </p>
          </div>
          <Link
            href="/journal/new"
            className="bg-blue-600 text-white px-5 py-2.5 rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            + 今日记录
          </Link>
        </div>

        {/* Entry list */}
        {entries.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-12 text-center">
            <div className="text-6xl mb-4">📭</div>
            <h3 className="text-lg font-medium text-gray-700 mb-2">还没有记录</h3>
            <p className="text-gray-400 mb-6">
              写下你的第一篇科研日记，开始追踪你的研究成长
            </p>
            <Link
              href="/journal/new"
              className="inline-block bg-blue-600 text-white px-6 py-2.5 rounded-lg hover:bg-blue-700 transition-colors"
            >
              写第一篇记录
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {entries.map((entry) => {
              const totalTasks = entry.morningTasks.length + entry.completedTasks.length
              const completedTasks = entry.completedTasks.filter((t) => t.completed).length
              const milestone = getMilestone(entry.linkedMilestone)

              return (
                <div
                  key={entry.id}
                  className="bg-white rounded-lg shadow-sm border border-gray-100 p-5 hover:shadow-md transition-shadow"
                >
                  {/* Date and mood */}
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      {entry.mood && <span className="text-xl">{entry.mood.split(' ')[0]}</span>}
                      <div>
                        <Link
                          href={`/journal/${entry.id}`}
                          className="text-lg font-semibold text-gray-900 hover:text-blue-600 transition-colors"
                        >
                          {new Date(entry.date).toLocaleDateString('zh-CN', {
                            month: 'long',
                            day: 'numeric',
                            weekday: 'short',
                          })}
                        </Link>
                        {milestone && (
                          <div className="flex items-center gap-1 mt-1">
                            <span className="text-xs">🎯</span>
                            <span className="text-xs text-blue-600">{milestone.title}</span>
                          </div>
                        )}
                      </div>
                    </div>
                    <button
                      onClick={() => deleteEntry(entry.id)}
                      className="text-gray-300 hover:text-red-500 transition-colors"
                      title="删除"
                    >
                      🗑️
                    </button>
                  </div>

                  {/* Task summary */}
                  <div className="flex flex-wrap gap-2 mb-3">
                    {entry.morningTasks.slice(0, 5).map((task) => {
                      const cat = categoryMap[task.category]
                      return (
                        <span
                          key={task.id}
                          className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs ${
                            task.completed
                              ? 'bg-green-50 text-green-700'
                              : 'bg-gray-100 text-gray-600'
                          }`}
                        >
                          {cat?.icon} {task.description.slice(0, 10)}
                          {task.completed ? ' ✓' : ''}
                        </span>
                      )
                    })}
                    {(entry.morningTasks.length + entry.completedTasks.length) > 5 && (
                      <span className="text-xs text-gray-400">
                        +{(entry.morningTasks.length + entry.completedTasks.length) - 5} 更多
                      </span>
                    )}
                  </div>

                  {/* Gains preview */}
                  {entry.gains && (
                    <p className="text-sm text-gray-600 line-clamp-2 mb-3">
                      💡 {entry.gains}
                    </p>
                  )}

                  {/* Stats */}
                  <div className="flex items-center gap-4 text-xs text-gray-400">
                    <span>✅ {completedTasks}/{totalTasks} 任务</span>
                    {entry.gains && <span>· 💡 有收获</span>}
                    {entry.tomorrowPlan && <span>· 📅 有计划</span>}
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
