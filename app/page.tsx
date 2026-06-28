'use client'

import { getRandomQuote } from '@/lib/quotes'
import Link from 'next/link'
import { useEffect, useState } from 'react'

export default function Home() {
  const [quote, setQuote] = useState<ReturnType<typeof getRandomQuote> | null>(null)
  const [greeting, setGreeting] = useState('👋 你好')

  useEffect(() => {
    setQuote(getRandomQuote())

    const hour = new Date().getHours()
    if (hour < 6) setGreeting('🌙 夜深了')
    else if (hour < 9) setGreeting('☀️ 早上好')
    else if (hour < 12) setGreeting('🌤️ 上午好')
    else if (hour < 14) setGreeting('🌞 中午好')
    else if (hour < 18) setGreeting('🌇 下午好')
    else setGreeting('🌙 晚上好')
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
            {greeting}，研究者
          </p>
          <p className="text-gray-500">
            记录每一天的科研成长 · 让努力被看见
          </p>
        </div>

        {/* Primary CTA */}
        <div className="max-w-2xl mx-auto mb-16">
          <Link
            href="/planning"
            className="block bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-2xl shadow-lg p-8 text-center hover:shadow-xl transition-shadow"
          >
            <div className="text-4xl mb-3">📋</div>
            <h2 className="text-2xl font-bold mb-2">开始今日科研计划</h2>
            <p className="text-blue-100 text-sm">
              规划今天要做什么，记录收获，追踪成长
            </p>
          </Link>
        </div>

        {/* Quote card */}
        {quote && (
          <div className="max-w-2xl mx-auto mb-16">
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-8 text-center border border-white/50">
              <div className="text-4xl mb-4">💡</div>
              <blockquote className="text-lg text-gray-700 leading-relaxed mb-4 italic">
                &ldquo;{quote.text}&rdquo;
              </blockquote>
              <div className="flex items-center justify-center gap-2 text-gray-500">
                <span className="font-medium">— {quote.author}</span>
                <span className="px-2 py-0.5 bg-blue-50 text-blue-600 text-xs rounded-full">
                  {quote.category}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Feature cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {[
            {
              title: '📝 科研日记',
              desc: '结构化记录每日科研进展',
              href: '/journal',
              emoji: '📝',
            },
            {
              title: '🤖 AI 回顾',
              desc: '基于历史日记智能分析',
              href: '/review',
              emoji: '🤖',
            },
            {
              title: '📊 总览面板',
              desc: '每日简报、进度追踪、里程碑',
              href: '/dashboard',
              emoji: '📊',
            },
            {
              title: '🔄 AI 回顾',
              desc: '智能分析你的科研模式',
              href: '/review',
              emoji: '🔄',
            },
            {
              title: '🎯 里程碑',
              desc: '设定长期目标，追踪进度',
              href: '/milestones',
              emoji: '🎯',
            },
            {
              title: '⚙️ 设置',
              desc: '配置 AI、导出数据',
              href: '/settings',
              emoji: '⚙️',
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
          <p>v0.4.0 · 科研成长伙伴</p>
        </div>
      </main>
    </div>
  )
}
