'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { ACTIVITY_CATEGORIES, type JournalEntry, type Milestone, type JournalTask } from '@/lib/types'
import TaskInput from '@/components/journal/TaskInput'
import TaskList from '@/components/journal/TaskList'

const MOODS = ['😊 开心', '😐 平静', '😤 焦虑', '😢 沮丧', '🔥 充满干劲', '🤔 困惑']

export default function JournalNew() {
  const today = new Date().toISOString().split('T')[0]

  // Check if editing existing entry
  const [isEditing, setIsEditing] = useState(false)

  const [date, setDate] = useState(today)
  const [mood, setMood] = useState('')
  const [morningTasks, setMorningTasks] = useState<JournalTask[]>([])
  const [completedTasks, setCompletedTasks] = useState<JournalTask[]>([])
  const [gains, setGains] = useState('')
  const [reflection, setReflection] = useState('')
  const [tomorrowPlan, setTomorrowPlan] = useState('')
  const [linkedMilestone, setLinkedMilestone] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const [milestones, setMilestones] = useState<Milestone[]>([])

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem('milestones') || '[]')
    setMilestones(stored)

    // Check if there's an existing entry for today
    const entries = JSON.parse(localStorage.getItem('journal_entries') || '[]')
    const todayEntry = entries.find((e: JournalEntry) => e.date === today)
    if (todayEntry) {
      setIsEditing(true)
      setMood(todayEntry.mood || '')
      setMorningTasks(todayEntry.morningTasks || [])
      setCompletedTasks(todayEntry.completedTasks || [])
      setGains(todayEntry.gains || '')
      setReflection(todayEntry.reflection || '')
      setTomorrowPlan(todayEntry.tomorrowPlan || '')
      setLinkedMilestone(todayEntry.linkedMilestone || '')
    }
  }, [])

  const addTask = (type: 'morning' | 'completed', task: Omit<JournalTask, 'id' | 'completed'>) => {
    const newTask: JournalTask = {
      ...task,
      id: Date.now().toString() + Math.random().toString(36).slice(2, 7),
      completed: type === 'completed',
    }
    if (type === 'morning') {
      setMorningTasks([...morningTasks, newTask])
    } else {
      setCompletedTasks([...completedTasks, newTask])
    }
  }

  const toggleTask = (type: 'morning' | 'completed', id: string) => {
    if (type === 'morning') {
      setMorningTasks(morningTasks.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t)))
    } else {
      setCompletedTasks(completedTasks.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t)))
    }
  }

  const deleteTask = (type: 'morning' | 'completed', id: string) => {
    if (type === 'morning') {
      setMorningTasks(morningTasks.filter((t) => t.id !== id))
    } else {
      setCompletedTasks(completedTasks.filter((t) => t.id !== id))
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (morningTasks.length === 0 && completedTasks.length === 0) return

    setIsSubmitting(true)

    const entry: JournalEntry = {
      id: isEditing ? `entry_${date}` : Date.now().toString(),
      date,
      mood: mood || undefined,
      morningTasks,
      completedTasks,
      gains: gains.trim(),
      reflection: reflection.trim(),
      tomorrowPlan: tomorrowPlan.trim(),
      linkedMilestone: linkedMilestone || undefined,
      createdAt: isEditing ? new Date().toISOString() : new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    const existing = JSON.parse(localStorage.getItem('journal_entries') || '[]')
    const filtered = existing.filter((e: JournalEntry) => e.id !== entry.id)
    filtered.unshift(entry)
    localStorage.setItem('journal_entries', JSON.stringify(filtered))

    setTimeout(() => {
      window.location.href = '/journal'
    }, 300)
  }

  const totalPlanned = morningTasks.reduce((sum, t) => sum + (t.plannedDuration || 0), 0)
  const totalActual = completedTasks.reduce((sum, t) => sum + (t.actualDuration || 0), 0)
  const completedCount = [...morningTasks, ...completedTasks].filter((t) => t.completed).length
  const totalCount = morningTasks.length + completedTasks.length

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              {isEditing ? '✏️ 编辑今日记录' : '📝 今日科研记录'}
            </h1>
            <p className="text-gray-500 mt-1">
              {new Date(date).toLocaleDateString('zh-CN', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                weekday: 'long',
              })}
            </p>
          </div>
          <Link href="/journal" className="text-gray-500 hover:text-gray-700 text-sm">
            ← 返回列表
          </Link>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Quick stats */}
          <div className="grid grid-cols-4 gap-3">
            <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-3 text-center">
              <div className="text-lg font-bold text-blue-600">
                {completedCount}/{totalCount}
              </div>
              <div className="text-xs text-gray-500">任务完成</div>
            </div>
            <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-3 text-center">
              <div className="text-lg font-bold text-green-600">{totalPlanned}</div>
              <div className="text-xs text-gray-500">计划(分钟)</div>
            </div>
            <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-3 text-center">
              <div className="text-lg font-bold text-purple-600">{totalActual}</div>
              <div className="text-xs text-gray-500">实际(分钟)</div>
            </div>
            <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-3 text-center">
              <div className="text-lg font-bold text-orange-600">
                {totalPlanned > 0 ? Math.round((totalActual / totalPlanned) * 100) : 0}%
              </div>
              <div className="text-xs text-gray-500">时间达成率</div>
            </div>
          </div>

          {/* Date and Mood */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
            <div className="flex flex-wrap items-center gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">日期</label>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="px-3 py-2 rounded-lg border border-gray-200 text-sm focus:border-blue-400 outline-none"
                />
              </div>

              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">今天的心情</label>
                <div className="flex flex-wrap gap-2">
                  {MOODS.map((m) => (
                    <button
                      key={m}
                      type="button"
                      onClick={() => setMood(m)}
                      className={`px-3 py-1.5 rounded-full text-sm transition-colors ${
                        mood === m
                          ? 'bg-blue-100 text-blue-700 ring-2 ring-blue-400'
                          : 'bg-white text-gray-600 hover:bg-gray-100 border'
                      }`}
                    >
                      {m}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Morning Tasks - Planning */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-2xl">📋</span>
              <div>
                <h2 className="text-lg font-semibold text-gray-900">今日计划</h2>
                <p className="text-xs text-gray-400">早上规划今天要做的事</p>
              </div>
            </div>

            <TaskInput onAdd={(task) => addTask('morning', task)} />

            <TaskList
              tasks={morningTasks}
              onToggle={(id) => toggleTask('morning', id)}
              onDelete={(id) => deleteTask('morning', id)}
              onUpdateActual={(id, mins) => {
                setMorningTasks(morningTasks.map((t) => (t.id === id ? { ...t, actualDuration: mins } : t)))
              }}
            />
          </div>

          {/* Completed Tasks - Actual */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-2xl">✅</span>
              <div>
                <h2 className="text-lg font-semibold text-gray-900">实际完成</h2>
                <p className="text-xs text-gray-400">记录实际做了什么</p>
              </div>
            </div>

            <TaskInput onAdd={(task) => addTask('completed', task)} />

            <TaskList
              tasks={completedTasks}
              onToggle={(id) => toggleTask('completed', id)}
              onDelete={(id) => deleteTask('completed', id)}
              onUpdateActual={(id, mins) => {
                setCompletedTasks(completedTasks.map((t) => (t.id === id ? { ...t, actualDuration: mins } : t)))
              }}
            />
          </div>

          {/* Today's Gains */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-2xl">💡</span>
              <div>
                <h2 className="text-lg font-semibold text-gray-900">今日收获</h2>
                <p className="text-xs text-gray-400">今天学到了什么？有什么突破？</p>
              </div>
            </div>

            <textarea
              value={gains}
              onChange={(e) => setGains(e.target.value)}
              placeholder="• 今天读了一篇关于 XXX 的论文，发现了...&#10;• 实验结果表明...&#10;• 解决了一个困扰很久的 bug，原因是...&#10;&#10;哪怕是很小的收获也值得记录！"
              rows={5}
              className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-100 outline-none resize-y text-sm leading-relaxed"
            />
            <p className="text-right text-xs text-gray-400 mt-1">{gains.length} 字</p>
          </div>

          {/* Reflection */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-2xl">🤔</span>
              <div>
                <h2 className="text-lg font-semibold text-gray-900">反思与感悟</h2>
                <p className="text-xs text-gray-400">今天的研究有什么感悟？哪里可以改进？</p>
              </div>
            </div>

            <textarea
              value={reflection}
              onChange={(e) => setReflection(e.target.value)}
              placeholder="• 今天的时间分配合理吗？&#10;• 遇到了什么问题？如何解决的？&#10;• 明天要改进的地方..."
              rows={4}
              className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-100 outline-none resize-y text-sm leading-relaxed"
            />
          </div>

          {/* Tomorrow's Plan */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-2xl">📅</span>
              <div>
                <h2 className="text-lg font-semibold text-gray-900">明日规划</h2>
                <p className="text-xs text-gray-400">提前想好明天要做什么</p>
              </div>
            </div>

            <textarea
              value={tomorrowPlan}
              onChange={(e) => setTomorrowPlan(e.target.value)}
              placeholder="• 继续阅读 XXX 论文&#10;• 完成实验数据分析&#10;• 和导师讨论..."
              rows={3}
              className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-100 outline-none resize-y text-sm leading-relaxed"
            />
          </div>

          {/* Linked Milestone */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-2xl">🎯</span>
              <div>
                <h2 className="text-lg font-semibold text-gray-900">关联里程碑</h2>
                <p className="text-xs text-gray-400">今天的工作推进了哪个长期目标？</p>
              </div>
            </div>

            <select
              value={linkedMilestone}
              onChange={(e) => setLinkedMilestone(e.target.value)}
              className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-sm focus:border-blue-400 outline-none"
            >
              <option value="">— 不关联 —</option>
              {milestones.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.title} {m.completed ? '✅' : ''} (截止: {m.deadline})
                </option>
              ))}
            </select>

            {milestones.length === 0 && (
              <p className="text-xs text-gray-400 mt-2">
                还没有里程碑。
                <Link href="/dashboard" className="text-blue-600 hover:underline">
                  去进度追踪创建
                </Link>
              </p>
            )}
          </div>

          {/* Submit */}
          <div className="flex gap-3">
            <button
              type="submit"
              disabled={isSubmitting || (morningTasks.length === 0 && completedTasks.length === 0)}
              className="flex-1 bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isSubmitting ? '保存中...' : isEditing ? '更新记录' : '保存今日记录'}
            </button>
            <Link
              href="/journal"
              className="px-6 py-3 text-gray-600 hover:text-gray-800 border border-gray-200 rounded-lg transition-colors"
            >
              取消
            </Link>
          </div>
        </form>
      </div>
    </div>
  )
}
