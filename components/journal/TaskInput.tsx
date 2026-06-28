'use client'

import { useState } from 'react'
import { ACTIVITY_CATEGORIES, type ActivityCategory } from '@/lib/types'

interface TaskInputProps {
  onAdd: (task: { category: ActivityCategory; description: string; plannedDuration?: number }) => void
}

export default function TaskInput({ onAdd }: TaskInputProps) {
  const [category, setCategory] = useState<ActivityCategory>('other')
  const [description, setDescription] = useState('')
  const [duration, setDuration] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!description.trim()) return

    onAdd({
      category,
      description: description.trim(),
      plannedDuration: duration ? parseInt(duration) : undefined,
    })

    setDescription('')
    setDuration('')
  }

  return (
    <form onSubmit={handleSubmit} className="flex gap-2 mb-3">
      <select
        value={category}
        onChange={(e) => setCategory(e.target.value as ActivityCategory)}
        className="px-3 py-2 rounded-lg border border-gray-200 text-sm bg-white focus:border-blue-400 outline-none"
      >
        {ACTIVITY_CATEGORIES.map((cat) => (
          <option key={cat.id} value={cat.id}>
            {cat.label}
          </option>
        ))}
      </select>

      <input
        type="text"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="添加今天的任务..."
        className="flex-1 px-3 py-2 rounded-lg border border-gray-200 text-sm focus:border-blue-400 outline-none"
      />

      <input
        type="number"
        value={duration}
        onChange={(e) => setDuration(e.target.value)}
        placeholder="计划(分钟)"
        className="w-24 px-3 py-2 rounded-lg border border-gray-200 text-sm focus:border-blue-400 outline-none"
      />

      <button
        type="submit"
        className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 transition-colors"
      >
        添加
      </button>
    </form>
  )
}
