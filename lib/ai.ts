// AI client for generating insights from journal entries
// Uses OpenAI-compatible API (works with OpenAI, Claude via OpenRouter, etc.)

const API_KEY = process.env.NEXT_PUBLIC_AI_API_KEY || ''
const API_URL = process.env.NEXT_PUBLIC_AI_API_URL || 'https://api.openai.com/v1/chat/completions'
const MODEL = process.env.NEXT_PUBLIC_AI_MODEL || 'gpt-4o-mini'

export interface JournalEntry {
  id: string
  title: string
  content: string
  tags: string[]
  createdAt: string
  mood?: string
}

export interface ReviewResult {
  summary: string
  themes: string[]
  moodTrend: string
  suggestions: string[]
  highlights: string[]
}

export async function generateReview(entries: JournalEntry[]): Promise<ReviewResult> {
  if (!API_KEY) {
    throw new Error('请配置 AI API Key（NEXT_PUBLIC_AI_API_KEY）')
  }

  if (entries.length === 0) {
    throw new Error('没有足够的日记可以分析，先写几篇吧！')
  }

  // Prepare journal entries for the prompt
  const entriesText = entries
    .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())
    .map((e, i) => {
      const date = new Date(e.createdAt).toLocaleDateString('zh-CN', {
        month: 'short',
        day: 'numeric',
      })
      const mood = e.mood ? ` [心情: ${e.mood}]` : ''
      const tags = e.tags.length > 0 ? ` [标签: ${e.tags.join(', ')}]` : ''
      return `[${date}]${mood}${tags}\n标题: ${e.title}\n内容: ${e.content}\n`
    })
    .join('\n---\n\n')

  const systemPrompt = `你是一位温暖的科研导师。请分析用户提供的科研日记，用中文回答。
返回 JSON 格式（不要包含其他内容）：
{
  "summary": "整体科研进展总结（150字以内）",
  "themes": ["主要研究主题1", "主题2"],
  "moodTrend": "情绪趋势描述（如：整体积极，近期遇到困难等）",
  "suggestions": ["具体建议1", "建议2"],
  "highlights": ["高光时刻1", "突破点2"]
}`

  const response = await fetch(API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${API_KEY}`,
    },
    body: JSON.stringify({
      model: MODEL,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: `以下是我的科研日记（共 ${entries.length} 篇），请分析：\n\n${entriesText}` },
      ],
      temperature: 0.7,
      max_tokens: 1000,
    }),
  })

  if (!response.ok) {
    const error = await response.text()
    throw new Error(`AI API 请求失败: ${response.status} - ${error}`)
  }

  const data = await response.json()
  const content = data.choices[0]?.message?.content || '{}'

  try {
    const parsed = JSON.parse(content)
    return {
      summary: parsed.summary || '暂无总结',
      themes: Array.isArray(parsed.themes) ? parsed.themes : [],
      moodTrend: parsed.moodTrend || '暂无数据',
      suggestions: Array.isArray(parsed.suggestions) ? parsed.suggestions : [],
      highlights: Array.isArray(parsed.highlights) ? parsed.highlights : [],
    }
  } catch {
    // If JSON parsing fails, return the raw content as summary
    return {
      summary: content,
      themes: [],
      moodTrend: '',
      suggestions: [],
      highlights: [],
    }
  }
}
