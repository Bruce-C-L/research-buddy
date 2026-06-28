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

export default function JournalEntry({ params }: { params: { id: string } }) {
  const [entry, setEntry] = useState<JournalEntry | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [editTitle, setEditTitle] = useState('')
  const [editContent, setEditContent] = useState('')
  const [editTags, setEditTags] = useState('')

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem('journal_entries') || '[]')
    const found = stored.find((e: JournalEntry) => e.id === params.id)
    if (found) {
      setEntry(found)
      setEditTitle(found.title)
      setEditContent(found.content)
      setEditTags(found.tags.join(', '))
    }
  }, [params.id])

  const handleSave = () => {
    if (!editTitle.trim() || !editContent.trim()) return

    const stored = JSON.parse(localStorage.getItem('journal_entries') || '[]')
    const updated = stored.map((e: JournalEntry) =>
      e.id === params.id
        ? {
            ...e,
            title: editTitle.trim(),
            content: editContent.trim(),
            tags: editTags.split(',').map((t) => t.trim()).filter(Boolean),
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
          <p className="text-gray-500 mb-4">日记不存在或已被删除</p>
          <Link href="/journal" className="text-blue-600 hover:underline">
            返回日记列表
          </Link>
        </div>
      </div>
    )
  }

  const formatFullDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      weekday: 'long',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-3xl mx-auto px-4 py-8">
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
                    setEditTitle(entry.title)
                    setEditContent(entry.content)
                    setEditTags(entry.tags.join(', '))
                  }}
                  className="text-sm text-gray-600 px-3 py-1.5 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  取消
                </button>
              </>
            )}
          </div>
        </div>

        {/* Entry content */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-8">
          {!isEditing ? (
            <>
              <div className="flex items-center gap-3 mb-4">
                {entry.mood && <span className="text-2xl">{entry.mood.split(' ')[0]}</span>}
                <h1 className="text-2xl font-bold text-gray-900">{entry.title}</h1>
              </div>

              <div className="text-sm text-gray-400 mb-6 space-x-4">
                <span>📅 {formatFullDate(entry.createdAt)}</span>
                {entry.updatedAt !== entry.createdAt && (
                  <span>· 编辑于 {formatFullDate(entry.updatedAt)}</span>
                )}
              </div>

              {/* Tags */}
              {entry.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-6">
                  {entry.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-3 py-1 bg-blue-50 text-blue-600 text-sm rounded-full"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}

              {/* Content */}
              <div className="prose prose-gray max-w-none">
                {entry.content.split('\n').map((para, i) => (
                  <p key={i} className="text-gray-700 leading-relaxed whitespace-pre-wrap mb-3">
                    {para}
                  </p>
                ))}
              </div>
            </>
          ) : (
            <div className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">标题</label>
                <input
                  type="text"
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-100 outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">内容</label>
                <textarea
                  value={editContent}
                  onChange={(e) => setEditContent(e.target.value)}
                  rows={12}
                  className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-100 outline-none resize-y"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">标签（逗号分隔）</label>
                <input
                  type="text"
                  value={editTags}
                  onChange={(e) => setEditTags(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-100 outline-none"
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
