'use client'

import { useState, useEffect } from 'react'
import { generateReview, type JournalEntry, type ReviewResult } from '@/lib/ai'

export default function Review() {
  const [entries, setEntries] = useState<JournalEntry[]>([])
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [result, setResult] = useState<ReviewResult | null>(null)
  const [error, setError] = useState('')

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem('journal_entries') || '[]')
    setEntries(stored)
  }, [])

  const handleAnalyze = async () => {
    if (entries.length === 0) {
      setError('还没有日记，先去写几篇吧！')
      return
    }

    setIsAnalyzing(true)
    setError('')
    setResult(null)

    try {
      const review = await generateReview(entries)
      setResult(review)
    } catch (err) {
      setError(err instanceof Error ? err.message : '分析失败，请重试')
    } finally {
      setIsAnalyzing(false)
    }
  }

  const stats = {
    total: entries.length,
    thisWeek: entries.filter((e) => {
      const d = new Date(e.createdAt)
      const now = new Date()
      const diff = (now.getTime() - d.getTime()) / (1000 * 60 * 60 * 24)
      return diff <= 7
    }).length,
    allTags: Array.from(new Set(entries.flatMap((e) => e.tags))),
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">🔄 AI 回顾</h1>
          <p className="text-gray-500">
            基于你的科研日记，智能分析你的研究进展和模式
          </p>
        </div>

        {/* Stats overview */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4 text-center">
            <div className="text-2xl font-bold text-blue-600">{stats.total}</div>
            <div className="text-sm text-gray-500">总日记数</div>
          </div>
          <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4 text-center">
            <div className="text-2xl font-bold text-green-600">{stats.thisWeek}</div>
            <div className="text-sm text-gray-500">本周记录</div>
          </div>
          <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4 text-center">
            <div className="text-2xl font-bold text-purple-600">{stats.allTags.length}</div>
            <div className="text-sm text-gray-500">研究标签</div>
          </div>
        </div>

        {/* Tags cloud */}
        {stats.allTags.length > 0 && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-5 mb-8">
            <h3 className="text-sm font-medium text-gray-500 mb-3">你的研究标签</h3>
            <div className="flex flex-wrap gap-2">
              {stats.allTags.map((tag) => (
                <span
                  key={tag}
                  className="px-3 py-1 bg-blue-50 text-blue-600 text-sm rounded-full"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* CTA */}
        {!result && !isAnalyzing && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-8 text-center">
            <div className="text-4xl mb-4">🤖</div>
            <h3 className="text-lg font-medium text-gray-700 mb-2">
              AI 将分析你的科研日记
            </h3>
            <p className="text-gray-400 text-sm mb-6">
              基于你最近的 {stats.total} 篇日记，生成科研进展总结、主题分析、
              情绪趋势和建议
            </p>
            <button
              onClick={handleAnalyze}
              disabled={stats.total === 0}
              className="bg-blue-600 text-white px-8 py-3 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {stats.total === 0 ? '先写几篇日记吧' : '开始 AI 分析'}
            </button>

            {error && (
              <div className="mt-4 p-3 bg-red-50 text-red-600 text-sm rounded-lg">
                {error}
              </div>
            )}
          </div>
        )}

        {/* Loading */}
        {isAnalyzing && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-12 text-center">
            <div className="inline-block w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-4" />
            <p className="text-gray-600">AI 正在阅读你的科研日记...</p>
            <p className="text-gray-400 text-sm mt-1">这可能需要几秒钟</p>
          </div>
        )}

        {/* Results */}
        {result && !isAnalyzing && (
          <div className="space-y-6">
            {/* Summary */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                📋 科研总结
              </h3>
              <p className="text-gray-700 leading-relaxed">{result.summary}</p>
            </div>

            {/* Mood trend */}
            {result.moodTrend && (
              <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  😊 情绪趋势
                </h3>
                <p className="text-gray-700">{result.moodTrend}</p>
              </div>
            )}

            {/* Themes */}
            {result.themes.length > 0 && (
              <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  🏷️ 主要研究主题
                </h3>
                <div className="flex flex-wrap gap-2">
                  {result.themes.map((theme) => (
                    <span
                      key={theme}
                      className="px-4 py-1.5 bg-indigo-50 text-indigo-700 text-sm rounded-full"
                    >
                      {theme}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Highlights */}
            {result.highlights.length > 0 && (
              <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  ⭐ 高光时刻
                </h3>
                <ul className="space-y-2">
                  {result.highlights.map((h, i) => (
                    <li key={i} className="flex items-start gap-2 text-gray-700">
                      <span className="text-yellow-500 mt-0.5">★</span>
                      <span>{h}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Suggestions */}
            {result.suggestions.length > 0 && (
              <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  💡 建议
                </h3>
                <ul className="space-y-2">
                  {result.suggestions.map((s, i) => (
                    <li key={i} className="flex items-start gap-2 text-gray-700">
                      <span className="text-blue-500 mt-0.5">→</span>
                      <span>{s}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Re-analyze */}
            <div className="text-center pb-8">
              <button
                onClick={handleAnalyze}
                className="text-blue-600 hover:text-blue-700 text-sm px-4 py-2 rounded-lg hover:bg-blue-50 transition-colors"
              >
                🔄 重新分析
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
