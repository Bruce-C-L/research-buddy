'use client'

import { useState, useEffect } from 'react'
import { type Milestone } from '@/lib/types'

export default function Milestones() {
  const [milestones, setMilestones] = useState<Milestone[]>([])
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [deadline, setDeadline] = useState('')
  const [isAdding, setIsAdding] = useState(false)

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem('milestones') || '[]')
    setMilestones(stored.sort((a: Milestone, b: Milestone) => {
      if (a.completed !== b.completed) return a.completed ? 1 : -1
      return new Date(a.deadline).getTime() - new Date(b.deadline).getTime()
    }))
  }, [])

  const addMilestone = () => {
    if (!title.trim() || !deadline) return

    const newMilestone: Milestone = {
      id: Date.now().toString(),
      title: title.trim(),
      description: description.trim(),
      deadline,
      completed: false,
      createdAt: new Date().toISOString(),
    }

    const updated = [...milestones, newMilestone]
    setMilestones(updated)
    localStorage.setItem('milestones', JSON.stringify(updated))

    setTitle('')
    setDescription('')
    setDeadline('')
    setIsAdding(false)
  }

  const toggleComplete = (id: string) => {
    const updated = milestones.map((m) =>
      m.id === id ? { ...m, completed: !m.completed } : m
    )
    setMilestones(updated)
    localStorage.setItem('milestones', JSON.stringify(updated))
  }

  const deleteMilestone = (id: string) => {
    if (!confirm('确定删除这个里程碑？')) return
    const updated = milestones.filter((m) => m.id !== id)
    setMilestones(updated)
    localStorage.setItem('milestones', JSON.stringify(updated))
  }

  const active = milestones.filter((m) => !m.completed)
  const completed = milestones.filter((m) => m.completed)

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">🎯 里程碑管理</h1>
            <p className="text-gray-500 mt-1">
              设定研究目标，追踪长期进展
            </p>
          </div>
          <button
            onClick={() => setIsAdding(!isAdding)}
            className="bg-blue-600 text-white px-5 py-2.5 rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            {isAdding ? '取消' : '+ 新建里程碑'}
          </button>
        </div>

        {/* Add form */}
        {isAdding && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 mb-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">新建里程碑</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">标题</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="例如：完成毕业论文第一章"
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:border-blue-400 outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">描述（可选）</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="详细描述这个里程碑..."
                  rows={2}
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:border-blue-400 outline-none resize-y"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">截止日期</label>
                <input
                  type="date"
                  value={deadline}
                  onChange={(e) => setDeadline(e.target.value)}
                  className="px-4 py-2.5 rounded-lg border border-gray-200 focus:border-blue-400 outline-none"
                />
              </div>

              <button
                onClick={addMilestone}
                disabled={!title.trim() || !deadline}
                className="w-full bg-blue-600 text-white py-2.5 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                创建里程碑
              </button>
            </div>
          </div>
        )}

        {/* Active milestones */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            进行中 ({active.length})
          </h3>
          {active.length === 0 ? (
            <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-8 text-center text-gray-400">
              <p>还没有进行中的里程碑</p>
              <p className="text-sm mt-1">点击上方"新建里程碑"开始设定目标</p>
            </div>
          ) : (
            <div className="space-y-3">
              {active.map((m) => {
                const daysLeft = Math.ceil(
                  (new Date(m.deadline).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
                )
                const isOverdue = daysLeft < 0

                return (
                  <div
                    key={m.id}
                    className={`bg-white rounded-lg shadow-sm border p-5 ${
                      isOverdue ? 'border-red-200' : 'border-gray-100'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-900 mb-1">{m.title}</h4>
                        {m.description && (
                          <p className="text-sm text-gray-600 mb-2">{m.description}</p>
                        )}
                        <div className="flex items-center gap-3 text-xs">
                          <span className={`${isOverdue ? 'text-red-600' : 'text-gray-400'}`}>
                            {isOverdue
                              ? `⚠️ 已逾期 ${Math.abs(daysLeft)} 天`
                              : `截止: ${m.deadline} (还剩 ${daysLeft} 天)`}
                          </span>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => toggleComplete(m.id)}
                          className="px-3 py-1.5 text-sm bg-green-50 text-green-700 rounded-lg hover:bg-green-100 transition-colors"
                        >
                          ✓ 完成
                        </button>
                        <button
                          onClick={() => deleteMilestone(m.id)}
                          className="text-gray-300 hover:text-red-500 transition-colors"
                        >
                          🗑️
                        </button>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>

        {/* Completed milestones */}
        {completed.length > 0 && (
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              已完成 ({completed.length})
            </h3>
            <div className="space-y-3">
              {completed.map((m) => (
                <div
                  key={m.id}
                  className="bg-gray-50 rounded-lg border border-gray-200 p-4 opacity-75"
                >
                  <div className="flex items-center gap-2">
                    <span className="text-green-600">✅</span>
                    <h4 className="font-medium text-gray-700 line-through">{m.title}</h4>
                  </div>
                  <p className="text-xs text-gray-400 mt-1">截止: {m.deadline}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
