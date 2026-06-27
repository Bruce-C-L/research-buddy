import Link from 'next/link'

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <main className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {[
            {
              title: '📝 科研日记',
              desc: '每日记录科研进展，自由输入或模板引导',
              href: '/journal',
              emoji: '📝',
            },
            {
              title: '🤖 AI 陪伴',
              desc: '基于日记内容对话，情绪识别，提供支持和建议',
              href: '/companion',
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
          <p>v0.1.0 · 原型阶段</p>
        </div>
      </main>
    </div>
  )
}
