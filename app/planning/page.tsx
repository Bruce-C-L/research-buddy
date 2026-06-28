'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function Planning() {
  const router = useRouter()
  const today = new Date().toISOString().split('T')[0]

  useEffect(() => {
    // Check if there's already an entry for today
    const entries = JSON.parse(localStorage.getItem('journal_entries') || '[]')
    const todayEntry = entries.find((e: any) => e.date === today)

    if (todayEntry) {
      router.push(`/journal/${todayEntry.id}`)
    } else {
      router.push('/journal/new')
    }
  }, [router, today])

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-gray-600">正在准备今日计划...</p>
      </div>
    </div>
  )
}
