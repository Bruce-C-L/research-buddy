'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

interface JournalEntry {
  id: string
  title: string
  content: string
  tags: string[]
  createdAt: string
  updatedAt: string
  mood?: string
}

export default function Journal() {
  const [entries, setEntries] = useState<JournalEntry[]>([])
  const [filter, setFilter] = useState('all')

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem('journal_entries') || '[]')
    setEntries(stored)
  }, [])

  const getFilteredEntries = () => {
    if (filter === 'all') return entries
    return entries.filter((e) => e.tags.includes(filter))
  }

  const getAllTags = () => {
    const tagSet = new Set<string>()
    entries.forEach((e) => e.tags.forEach((t) => tagSet.add(t)))
    return Array.from(tagSet)
  }

  const deleteEntry = (id: string) => {
    if (!confirm('确定删除这篇日记？')) return
    const updated = entries.filter((e) => e.id !== id)
    setEntries(updated)
    localStorage.setItem('journal_entries', JSON.stringify(updated))
  }

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr)
    const now = new Date()
    const diff = now.getTime() - date.getTime()
    const days = Math.floor(diff / (1000 * 60 * 60 * 24))

    if (days === 0) return '今天 ' + date.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })
    if (days === 1) return '昨天'
    if (days < 7) return `${days}天前`
    return date.toLocaleDateString('zh-CN', { month: 'short', day: 'numeric' })
  }

  const filtered = getFilteredEntries()
  const allTags = getAllTags()

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">📝 科研日记</h1>
            <p className="text-gray-500 mt-1">
              共 {entries.length} 篇日记
              {entries.length > 0 && (
                <span> · 连续记录 {Math.max(...entries.map(e => {
                  const d = new Date(e.createdAt)
                  const now = new Date()
                  return Math.floor((now.getTime() - d.getTime()) / (1000 * 60 * 60 * 24))
                }))} 天</span>
              )}
            </p>
          </div>
          <Link
            href="/journal/new"
            className="bg-blue-600 text-white px-5 py-2.5 rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            + 写日记
          </Link>
        </div>

        {/* Filters */}
        {allTags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-6">
            <button
              onClick={() => setFilter('all')}
              className={`px-3 py-1 rounded-full text-sm transition-colors ${
                filter === 'all'
                  ? 'bg-blue-100 text-blue-700'
                  : 'bg-white text-gray-600 hover:bg-gray-100 border'
              }`}
            >
              全部
            </button>
            {allTags.map((tag) => (
              <button
                key={tag}
                onClick={() => setFilter(tag)}
                className={`px-3 py-1 rounded-full text-sm transition-colors ${
                  filter === tag
                    ? 'bg-blue-100 text-blue-700'
                    : 'bg-white text-gray-600 hover:bg-gray-100 border'
                }`}
              >
                {tag}
              </button>
            ))}
          </div>
        )}

        {/* Entry list */}
        {filtered.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-12 text-center">
            <div className="text-6xl mb-4">📭</div>
            <h3 className="text-lg font-medium text-gray-700 mb-2">还没有日记</h3>
            <p className="text-gray-400 mb-6">
              写下你的第一篇科研日记吧，记录今天的进展和想法
            </p>
            <Link
              href="/journal/new"
              className="inline-block bg-blue-600 text-white px-6 py-2.5 rounded-lg hover:bg-blue-700 transition-colors"
            >
              写第一篇日记
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {filtered.map((entry) => (
              <div
                key={entry.id}
                className="bg-white rounded-lg shadow-sm border border-gray-100 p-5 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                      {entry.mood && (
                        <span className="text-lg">{entry.mood.split(' ')[0]}</span>
                      )}
                      <Link
                        href={`/journal/${entry.id}`}
                        className="text-lg font-semibold text-gray-900 hover:text-blue-600 transition-colors truncate"
                      >
                        {entry.title}
                      </Link>
                    </div>
                    <p className="text-gray-600 text-sm line-clamp-2 mb-3">
                      {entry.content}
                    </p>
                    <div className="flex items-center gap-3 text-xs text-gray-400">
                      <span>{formatDate(entry.createdAt)}</span>
                      {entry.tags.length > 0 && (
                        <div className="flex gap-1">
                          {entry.tags.map((tag) => (
                            <span
                              key={tag}
                              className="px-2 py-0.5 bg-gray-100 rounded-full"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                  <button
                    onClick={() => deleteEntry(entry.id)}
                    className="ml-4 text-gray-300 hover:text-red-500 transition-colors"
                    title="删除"
                  >
                    🗑️
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
