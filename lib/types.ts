// Research activity categories
export const ACTIVITY_CATEGORIES = [
  { id: 'reading', label: '📖 文献阅读', icon: '📖', color: 'blue' },
  { id: 'writing', label: '✍️ 论文写作', icon: '✍️', color: 'green' },
  { id: 'coding', label: '💻 编程建模', icon: '💻', color: 'purple' },
  { id: 'experiment', label: '📊 实验分析', icon: '📊', color: 'orange' },
  { id: 'meeting', label: '👥 组会讨论', icon: '👥', color: 'teal' },
  { id: 'advisor', label: '💬 导师沟通', icon: '💬', color: 'pink' },
  { id: 'course', label: '📚 课程学习', icon: '📚', color: 'indigo' },
  { id: 'presentation', label: '🎤 汇报演讲', icon: '🎤', color: 'red' },
  { id: 'skill', label: '🔧 技能提升', icon: '🔧', color: 'yellow' },
  { id: 'other', label: '📝 其他', icon: '📝', color: 'gray' },
] as const

export type ActivityCategory = typeof ACTIVITY_CATEGORIES[number]['id']

export interface JournalTask {
  id: string
  category: ActivityCategory
  description: string
  completed: boolean
  plannedDuration?: number // minutes
  actualDuration?: number
}

export interface JournalEntry {
  id: string
  date: string // YYYY-MM-DD
  morningTasks: JournalTask[] // 早晨规划
  completedTasks: JournalTask[] // 实际完成
  gains: string // 今日收获
  reflection: string // 反思/感悟
  tomorrowPlan: string // 明日规划
  mood: string
  linkedMilestone?: string // 关联的里程碑
  createdAt: string
  updatedAt: string
}

export interface Milestone {
  id: string
  title: string
  description: string
  deadline: string
  completed: boolean
  createdAt: string
}
