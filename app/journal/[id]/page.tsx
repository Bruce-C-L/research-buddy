'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { ACTIVITY_CATEGORIES, type JournalEntry, type Milestone } from '@/lib/types'
import TaskList from '@/components/journal/TaskList'

const categoryMap = ACTIVITY_CATEGORIES.reduce(
  (acc, cat) => {
    acc[cat.id] = cat
    return acc
  },
  {} as Record<string, (typeof ACTIVITY_CATEGORIES)[number]>
)

export default function JournalEntry({ params }: { params: { id: string } }) {
  const [entry, setEntry] = useState<JournalEntry | null>(null)
  const [milestones, setMilestones] = useState<Milestone[]>([])
  const [isEditing, setIsEditing] = useState(false)

  // Edit state
  const [editGains, setEditGains] = useState('')
  const [editReflection, setEditReflection] = useState('')
  const [editTomorrowPlan, setEditTomorrowPlan] = useState('')
  const [editLinkedMilestone, setEditLinkedMilestone] = useState('')
  const [editMood, setEditMood] = useState('')

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem('journal_entries') || '[]')
    const found = stored.find((e: JournalEntry) => e.id === params.id)
    if (found) {
      setEntry(found)
      setEditGains(found.gains || '')
      setEditReflection(found.reflection || '')
      setEditTomorrowPlan(found.tomorrowPlan || '')
      setEditLinkedMilestone(found.linkedMilestone || '')
      setEditMood(found.mood || '')
    }

    const ms = JSON.parse(localStorage.getItem('milestones') || '[]')
    setMilestones(ms)
  }, [params.id])

  const handleSave = () => {
    if (!entry) return

    const stored = JSON.parse(localStorage.getItem('journal_entries') || '[]')
    const updated = stored.map((e: JournalEntry) =>
      e.id === params.id
        ? {
            ...e,
            mood: editMood || undefined,
            gains: editGains.trim(),
            reflection: editReflection.trim(),
            tomorrowPlan: editTomorrowPlan.trim(),
            linkedMilestone: editLinkedMilestone || undefined,
            updatedAt: new Date().toISOString(),
          }
        : e
    )
    localStorage.setItem('journal_entries', JSON.stringify(updated))

    const updatedEntry = updated.find((e: JournalEntry) => e.id === params.id)
    setEntry(updatedEntry)
    setIsEditing(false)
  }

  if (!entry) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-500 mb-4">记录不存在或已被删除</p>
          <Link href="/journal" className="text-blue-600 hover:underline">
            返回日记列表
          </Link>
        </div>
      </div>
    )
  }

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      weekday: 'long',
    })
  }

  const linkedMilestone = milestones.find((m) => m.id === entry.linkedMilestone)
  const totalTasks = (entry.morningTasks?.length || 0) + (entry.completedTasks?.length || 0)
  const completedCount = [
    ...(entry.morningTasks || []),
    ...(entry.completedTasks || []),
  ].filter((t) => t.completed).length

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <Link
            href="/journal"
            className="text-gray-500 hover:text-gray-700 text-sm flex items-center gap-1"
          >
            ← 返回列表
          </Link>
          <div className="flex gap-2">
            {!isEditing ? (
              <button
                onClick={() => setIsEditing(true)}
                className="text-sm text-blue-600 hover:text-blue-700 px-3 py-1.5 rounded-lg hover:bg-blue-50 transition-colors"
              >
                ✏️ 编辑
              </button>
            ) : (
              <>
                <button
                  onClick={handleSave}
                  className="text-sm bg-blue-600 text-white px-4 py-1.5 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  保存
                </button>
                <button
                  onClick={() => {
                    setIsEditing(false)
                    setEditGains(entry.gains || '')
                    setEditReflection(entry.reflection || '')
                    setEditTomorrowPlan(entry.tomorrowPlan || '')
                    setEditLinkedMilestone(entry.linkedMilestone || '')
                    setEditMood(entry.mood || '')
                  }}
                  className="text-sm text-gray-600 px-3 py-1.5 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  取消
                </button>
              </>
            )}
          </div>
        </div>

        {/* Stats bar */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-3 text-center">
            <div className="text-lg font-bold text-blue-600">
              {completedCount}/{totalTasks}
            </div>
            <div className="text-xs text-gray-500">任务完成</div>
          </div>
          <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-3 text-center">
            <div className="text-lg font-bold text-green-600">
              {[...(entry.morningTasks || []), ...(entry.completedTasks || [])].reduce(
                (s, t) => s + (t.actualDuration || 0),
                0
              )}
            </div>
            <div className="text-xs text-gray-500">实际工作(分钟)</div>
          </div>
          <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-3 text-center">
            <div className="text-lg font-bold text-purple-600">
              {entry.gains ? '有' : '无'}收获
            </div>
            <div className="text-xs text-gray-500">今日总结</div>
          </div>
        </div>

        {/* Content */}
        <div className="space-y-6">
          {/* Morning Tasks */}
          {(entry.morningTasks?.length || 0) > 0 && (
            <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                📋 今日计划
              </h3>
              <TaskList
                tasks={entry.morningTasks || []}
                onToggle={() => {}}
                onDelete={() => {}}
                onUpdateActual={() => {}}
                readonly
              />
            </div>
          )}

          {/* Completed Tasks */}
          {(entry.completedTasks?.length || 0) > 0 && (
            <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                ✅ 实际完成
              </h3>
              <TaskList
                tasks={entry.completedTasks || []}
                onToggle={() => {}}
                onDelete={() => {}}
                onUpdateActual={() => {}}
                readonly
              />
            </div>
          )}

          {/* Gains */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
              💡 今日收获
            </h3>
            {isEditing ? (
              <textarea
                value={editGains}
                onChange={(e) => setEditGains(e.target.value)}
                rows={4}
                className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-blue-400 outline-none resize-y text-sm leading-relaxed"
              />
            ) : (
              entry.gains && (
                <div className="text-sm text-gray-700 whitespace-pre-wrap leading-relaxed">
                  {entry.gains}
                </div>
              )
            )}
            {!entry.gains && !isEditing && (
              <p className="text-gray-400 text-sm">还没有记录收获</p>
            )}
          </div>

          {/* Reflection */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
              🤔 反思与感悟
            </h3>
            {isEditing ? (
              <textarea
                value={editReflection}
                onChange={(e) => setEditReflection(e.target.value)}
                rows={4}
                className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-blue-400 outline-none resize-y text-sm leading-relaxed"
              />
            ) : (
              entry.reflection && (
                <div className="text-sm text-gray-700 whitespace-pre-wrap leading-relaxed">
                  {entry.reflection}
                </div>
              )
            )}
            {!entry.reflection && !isEditing && (
              <p className="text-gray-400 text-sm">还没有写反思</p>
            )}
          </div>

          {/* Tomorrow's Plan */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
              📅 明日规划
            </h3>
            {isEditing ? (
              <textarea
                value={editTomorrowPlan}
                onChange={(e) => setEditTomorrowPlan(e.target.value)}
                rows={3}
                className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-blue-400 outline-none resize-y text-sm leading-relaxed"
              />
            ) : (
              entry.tomorrowPlan && (
                <div className="text-sm text-gray-700 whitespace-pre-wrap leading-relaxed">
                  {entry.tomorrowPlan}
                </div>
              )
            )}
            {!entry.tomorrowPlan && !isEditing && (
              <p className="text-gray-400 text-sm">还没有规划明天</p>
            )}
          </div>

          {/* Linked Milestone */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
              🎯 关联里程碑
            </h3>
            {isEditing ? (
              <select
                value={editLinkedMilestone}
                onChange={(e) => setEditLinkedMilestone(e.target.value)}
                className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-sm focus:border-blue-400 outline-none"
              >
                <option value="">— 不关联 —</option>
                {milestones.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.title} {m.completed ? '✅' : ''} (截止: {m.deadline})
                  </option>
                ))}
              </select>
            ) : (
              linkedMilestone ? (
                <div className="flex items-center gap-2">
                  <span className="px-3 py-1.5 bg-blue-50 text-blue-700 text-sm rounded-full">
                    🎯 {linkedMilestone.title}
                  </span>
                  <span className="text-xs text-gray-400">
                    截止: {linkedMilestone.deadline}
                  </span>
                </div>
              ) : (
                <p className="text-gray-400 text-sm">未关联里程碑</p>
              )
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
