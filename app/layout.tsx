import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Navbar from '@/components/Navbar'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'ResearchBuddy - 你的科研 AI 伙伴',
  description: '陪你做科研的 AI 伙伴 — 记录、回顾、鼓励、打卡、交流',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="zh-CN">
      <body className={inter.className}>
        <Navbar />
        {children}
      </body>
    </html>
  )
}
