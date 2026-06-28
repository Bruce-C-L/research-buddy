'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { type JournalEntry, type Milestone, ACTIVITY_CATEGORIES } from '@/lib/types'

const categoryMap = ACTIVITY_CATEGORIES.reduce(
  (acc, cat) => {
    acc[cat.id] = cat
    return acc
  },
  {} as Record<string, (typeof ACTIVITY_CATEGORIES)[number]>
)

export default function Dashboard() {
  const [entries, setEntries] = useState<JournalEntry[]>([])
  const [milestones, setMilestones] = useState<Milestone[]>([])
  const today = new Date().toISOString().split('T')[0]

  useEffect(() => {
    const storedEntries = JSON.parse(localStorage.getItem('journal_entries') || '[]')
    setEntries(storedEntries)

    const storedMilestones = JSON.parse(localStorage.getItem('milestones') || '[]')
    setMilestones(storedMilestones.sort((a: Milestone, b: Milestone) => {
      if (a.completed !== b.completed) return a.completed ? 1 : -1
      return new Date(a.deadline).getTime() - new Date(b.deadline).getTime()
    }))
  }, [])

  // Today's plan
  const todayEntry = entries.find((e) => e.date === today)
  const todayTasks = todayEntry?.morningTasks || []
  const completedToday = todayEntry?.completedTasks?.filter((t) => t.completed) || []
  const totalTodayTasks = todayTasks.length + completedToday.length

  // Weekly stats
  const weekAgo = new Date()
  weekAgo.setDate(weekAgo.getDate() - 7)
  const weekEntries = entries.filter((e) => new Date(e.date) >= weekAgo)
  const weekTasks = weekEntries.reduce((sum, e) => sum + (e.morningTasks?.length || 0) + (e.completedTasks?.length || 0), 0)
  const weekCompleted = weekEntries.reduce((sum, e) => sum + (e.completedTasks?.filter((t: any) => t.completed).length || 0) + (e.morningTasks?.filter((t: any) => t.completed).length || 0), 0)

  // Activity breakdown
  const activityBreakdown = entries.reduce((acc, e) => {
    const allTasks = [...(e.morningTasks || []), ...(e.completedTasks || [])]
    allTasks.forEach((task) => {
      const cat = categoryMap[task.category]?.label || '其他'
      if (!acc[cat]) acc[cat] = { planned: 0, actual: 0 }
      if (task.plannedDuration) acc[cat].planned += task.plannedDuration
      if (task.actualDuration) acc[cat].actual += task.actualDuration
    })
    return acc
  }, {} as Record<string, { planned: number; actual: number }>)

  // Streak
  const getStreak = () => {
    if (entries.length === 0) return 0
    const dates = entries.map((e) => e.date).sort().reverse()
    const uniqueDates = [...new Set(dates)]
    let streak = 0
    let checkDate = new Date()

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

  const upcomingMilestones = milestones.filter((m) => !m.completed).slice(0, 3)
  const overdueMilestones = milestones.filter((m) => !m.completed && new Date(m.deadline) < new Date())

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header - Morning Briefing */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                {new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' }) < '12:00' ? '☀️ 早上好' : '🌙 晚上好'}
                ， researcher
              </h1>
              <p className="text-gray-500 mt-1">
                {new Date().toLocaleDateString('zh-CN', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  weekday: 'long',
                })}
                {streak > 0 && (
                  <span className="ml-3 text-orange-600">🔥 已连续记录 {streak} 天</span>
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

          {/* Morning Briefing Card */}
          <div className="bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl shadow-lg p-6 text-white">
            <h2 className="text-xl font-semibold mb-3">📋 今日任务简报</h2>
            {todayTasks.length > 0 ? (
              <div className="space-y-2">
                {todayTasks.map((task) => {
                  const cat = categoryMap[task.category]
                  return (
                    <div key={task.id} className="flex items-center gap-3 bg-white/10 rounded-lg px-4 py-2.5">
                      <span>{cat?.icon}</span>
                      <span className="flex-1">{task.description}</span>
                      {task.plannedDuration && (
                        <span className="text-sm text-white/70">{task.plannedDuration}分钟</span>
                      )}
                    </div>
                  )
                })}
                <div className="text-sm text-white/70 mt-3">
                  共 {todayTasks.length} 个计划任务 · 预计 {todayTasks.reduce((s, t) => s + (t.plannedDuration || 0), 0)} 分钟
                </div>
              </div>
            ) : (
              <div>
                <p className="text-white/80 mb-3">今天还没有计划，开始规划你的一天吧！</p>
                <Link
                  href="/journal/new"
                  className="inline-block bg-white text-blue-600 px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-50 transition-colors"
                >
                  开始规划
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Weekly Progress */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
            <h3 className="text-sm font-medium text-gray-500 mb-4">本周进度</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">记录天数</span>
                <span className="text-lg font-bold text-blue-600">{weekEntries.length} 天</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">任务完成率</span>
                <span className="text-lg font-bold text-green-600">
                  {weekTasks > 0 ? Math.round((weekCompleted / weekTasks) * 100) : 0}%
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-green-500 h-2 rounded-full transition-all"
                  style={{ width: `${weekTasks > 0 ? (weekCompleted / weekTasks) * 100 : 0}%` }}
                />
              </div>
            </div>
          </div>

          {/* Activity Distribution */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
            <h3 className="text-sm font-medium text-gray-500 mb-4">研究活动分布</h3>
            <div className="space-y-2">
              {Object.entries(activityBreakdown)
                .sort(([, a], [, b]) => (b.actual || b.planned) - (a.actual || a.planned))
                .slice(0, 4)
                .map(([cat, data]) => (
                  <div key={cat} className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">{cat}</span>
                    <span className="text-gray-400">{data.actual || data.planned || 0} 分钟</span>
                  </div>
                ))}
              {Object.keys(activityBreakdown).length === 0 && (
                <p className="text-sm text-gray-400">暂无数据</p>
              )}
            </div>
          </div>

          {/* Milestones */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium text-gray-500">里程碑</h3>
              <Link href="/dashboard" className="text-xs text-blue-600 hover:underline">
                管理
              </Link>
            </div>
            <div className="space-y-2">
              {overdueMilestones.length > 0 && (
                <div className="p-2 bg-red-50 rounded-lg">
                  <p className="text-xs text-red-700 font-medium">⚠️ {overdueMilestones.length} 个已逾期</p>
                </div>
              )}
              {upcomingMilestones.slice(0, 2).map((m) => (
                <div key={m.id} className="flex items-center justify-between text-sm">
                  <span className="text-gray-700">{m.title}</span>
                  <span className="text-xs text-gray-400">{m.deadline}</span>
                </div>
              ))}
              {milestones.length === 0 && (
                <p className="text-sm text-gray-400">
                  <Link href="/dashboard" className="text-blue-600 hover:underline">
                    创建里程碑
                  </Link>
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Recent Entries */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">最近记录</h3>
            <Link href="/journal" className="text-sm text-blue-600 hover:underline">
              查看全部
            </Link>
          </div>

          {entries.length === 0 ? (
            <div className="text-center py-8 text-gray-400 text-sm">
              还没有记录，开始你的第一篇科研日记吧
            </div>
          ) : (
            <div className="space-y-3">
              {entries.slice(0, 5).map((entry) => (
                <Link
                  key={entry.id}
                  href={`/journal/${entry.id}`}
                  className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-lg">{entry.mood?.split(' ')[0] || '📝'}</span>
                    <div>
                      <div className="text-sm font-medium text-gray-700">
                        {new Date(entry.date).toLocaleDateString('zh-CN', {
                          month: 'short',
                          day: 'numeric',
                          weekday: 'short',
                        })}
                      </div>
                      <div className="text-xs text-gray-400">
                        {entry.morningTasks?.length || 0} 个计划 · {entry.completedTasks?.filter((t: any) => t.completed).length || 0} 完成
                      </div>
                    </div>
                  </div>
                  <span className="text-gray-400 text-sm">→</span>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
