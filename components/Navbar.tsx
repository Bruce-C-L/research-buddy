'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

const navItems = [
  { href: '/dashboard', label: '📊 进度', emoji: '📊' },
  { href: '/journal', label: '📝 日记', emoji: '📝' },
  { href: '/companion', label: '🤖 AI', emoji: '🤖' },
  { href: '/checkin', label: '✅ 打卡', emoji: '✅' },
  { href: '/community', label: '💬 社群', emoji: '💬' },
  { href: '/review', label: '🔄 回顾', emoji: '🔄' },
]

export default function Navbar() {
  const pathname = usePathname()

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex items-center justify-between h-14">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 font-bold text-lg text-gray-900">
            <span>🔬</span>
            <span>ResearchBuddy</span>
          </Link>

          {/* Nav links */}
          <div className="hidden md:flex items-center gap-1">
            {navItems.map((item) => {
              const isActive = pathname === item.href || pathname.startsWith(item.href + '/')
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`px-3 py-1.5 rounded-lg text-sm transition-colors ${
                    isActive
                      ? 'bg-blue-50 text-blue-600 font-medium'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  {item.label}
                </Link>
              )
            })}
          </div>

          {/* Mobile menu button (placeholder) */}
          <button className="md:hidden text-gray-600 p-2">
            ☰
          </button>
        </div>
      </div>
    </nav>
  )
}
