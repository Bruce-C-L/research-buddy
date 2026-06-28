'use client'

import { getRandomQuote } from '@/lib/quotes'
import Link from 'next/link'
import { useEffect, useState } from 'react'

export default function Home() {
  const [quote, setQuote] = useState(getRandomQuote())

  useEffect(() => {
    // 每次刷新页面换一条名言
    setQuote(getRandomQuote())
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <main className="container mx-auto px-4 py-16">
        {/* Hero section */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            🔬 ResearchBuddy
          </h1>
          <p className="text-xl text-gray-600 mb-2">
            陪你做科研的 AI 伙伴
          </p>
          <p className="text-gray-500">
            记录 · 回顾 · 鼓励 · 打卡 · 交流
          </p>
        </div>

        {/* Quote card */}
        <div className="max-w-2xl mx-auto mb-16">
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-8 text-center border border-white/50">
            <div className="text-4xl mb-4">💡</div>
            <blockquote className="text-lg text-gray-700 leading-relaxed mb-4 italic">
              "{quote.text}"
            </blockquote>
            <div className="flex items-center justify-center gap-2 text-gray-500">
              <span className="font-medium">— {quote.author}</span>
              <span className="px-2 py-0.5 bg-blue-50 text-blue-600 text-xs rounded-full">
                {quote.category}
              </span>
            </div>
          </div>
        </div>

        {/* Feature cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {[
            {
              title: '📝 科研日记',
              desc: '每日记录科研进展，自由输入或模板引导',
              href: '/journal',
              emoji: '📝',
            },
            {
              title: '🤖 AI 回顾',
              desc: '基于历史日记智能分析，发现科研模式',
              href: '/review',
              emoji: '🤖',
            },
            {
              title: '📊 进度追踪',
              desc: '可视化科研进度，里程碑管理',
              href: '/dashboard',
              emoji: '📊',
            },
            {
              title: '🔄 回顾系统',
              desc: '周/月总结，对比历史，发现模式',
              href: '/review',
              emoji: '🔄',
            },
            {
              title: '✅ 自律打卡',
              desc: '每日科研习惯打卡，streak 激励',
              href: '/checkin',
              emoji: '✅',
            },
            {
              title: '💬 社群交流',
              desc: '科研人员匿名/实名交流区',
              href: '/community',
              emoji: '💬',
            },
          ].map((item) => (
            <Link
              key={item.title}
              href={item.href}
              className="block p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow"
            >
              <div className="text-4xl mb-3">{item.emoji}</div>
              <h2 className="text-xl font-semibold text-gray-900 mb-2">
                {item.title}
              </h2>
              <p className="text-gray-600 text-sm">{item.desc}</p>
            </Link>
          ))}
        </div>

        <div className="text-center mt-16 text-gray-400 text-sm">
          <p>v0.2.0 · 原型阶段</p>
        </div>
      </main>
    </div>
  )
}
