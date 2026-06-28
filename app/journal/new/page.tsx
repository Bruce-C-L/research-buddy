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

const MOODS = ['😊 开心', '😐 平静', '😤 焦虑', '😢 沮丧', '🔥 充满干劲', '🤔 困惑']

export default function JournalNew() {
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [tags, setTags] = useState('')
  const [mood, setMood] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim() || !content.trim()) return

    setIsSubmitting(true)

    const entry: JournalEntry = {
      id: Date.now().toString(),
      title: title.trim(),
      content: content.trim(),
      tags: tags.split(',').map(t => t.trim()).filter(Boolean),
      mood: mood || undefined,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    const existing = JSON.parse(localStorage.getItem('journal_entries') || '[]')
    existing.unshift(entry)
    localStorage.setItem('journal_entries', JSON.stringify(existing))

    window.location.href = '/journal'
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-3xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">📝 写日记</h1>
            <p className="text-gray-500 mt-1">
              {new Date().toLocaleDateString('zh-CN', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                weekday: 'long',
              })}
            </p>
          </div>
          <Link
            href="/journal"
            className="text-gray-500 hover:text-gray-700 text-sm"
          >
            ← 返回列表
          </Link>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Mood selector */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              今天的心情
            </label>
            <div className="flex flex-wrap gap-2">
              {MOODS.map((m) => (
                <button
                  key={m}
                  type="button"
                  onClick={() => setMood(m.startsWith('😊') ? m : m)}
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

          {/* Title */}
          <div>
            <label
              htmlFor="title"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              标题
            </label>
            <input
              id="title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="给今天的研究起个标题..."
              className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-100 outline-none transition-all"
              required
            />
          </div>

          {/* Content */}
          <div>
            <label
              htmlFor="content"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              内容
            </label>
            <textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="今天做了什么研究？有什么进展、困惑或想法？&#10;&#10;可以写：&#10;• 今天阅读的文献&#10;• 实验进展&#10;• 遇到的困难&#10;• 新的想法..."
              rows={12}
              className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-100 outline-none transition-all resize-y"
              required
            />
            <p className="text-right text-sm text-gray-400 mt-1">
              {content.length} 字
            </p>
          </div>

          {/* Tags */}
          <div>
            <label
              htmlFor="tags"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              标签（逗号分隔）
            </label>
            <input
              id="tags"
              type="text"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              placeholder="例如: 文献阅读, 实验, 论文写作"
              className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-100 outline-none transition-all"
            />
          </div>

          {/* Submit */}
          <div className="flex gap-3 pt-4">
            <button
              type="submit"
              disabled={isSubmitting || !title.trim() || !content.trim()}
              className="flex-1 bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isSubmitting ? '保存中...' : '保存日记'}
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
