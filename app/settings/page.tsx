'use client'

import { useState, useEffect } from 'react'

export interface AIConfig {
  provider: 'openai' | 'openrouter' | 'custom'
  apiKey: string
  apiUrl: string
  model: string
}

const DEFAULT_CONFIG: AIConfig = {
  provider: 'openrouter',
  apiKey: '',
  apiUrl: 'https://openrouter.ai/api/v1/chat/completions',
  model: 'anthropic/claude-3-5-haiku-20241022',
}

const PROVIDER_PRESETS: Record<string, { url: string; model: string; label: string }> = {
  openai: {
    url: 'https://api.openai.com/v1/chat/completions',
    model: 'gpt-4o-mini',
    label: 'OpenAI',
  },
  openrouter: {
    url: 'https://openrouter.ai/api/v1/chat/completions',
    model: 'anthropic/claude-3-5-haiku-20241022',
    label: 'OpenRouter',
  },
  stepfun: {
    url: 'https://api.stepfun.com/step_plan/v1/chat/completions',
    model: 'step-3.7-flash',
    label: 'StepFun',
  },
  custom: {
    url: '',
    model: '',
    label: '自定义',
  },
}

export function useAIConfig() {
  const [config, setConfig] = useState<AIConfig>(DEFAULT_CONFIG)
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    const stored = localStorage.getItem('ai_config')
    if (stored) {
      try {
        setConfig(JSON.parse(stored))
      } catch {
        // ignore invalid stored data
      }
    }
    setIsLoaded(true)
  }, [])

  const saveConfig = (newConfig: AIConfig) => {
    setConfig(newConfig)
    localStorage.setItem('ai_config', JSON.stringify(newConfig))
  }

  return { config, saveConfig, isLoaded }
}

export default function Settings() {
  const { config, saveConfig, isLoaded } = useAIConfig()
  const [saved, setSaved] = useState(false)

  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  const handleProviderChange = (provider: AIConfig['provider']) => {
    const preset = PROVIDER_PRESETS[provider]
    saveConfig({
      ...config,
      provider,
      apiUrl: preset.url,
      model: preset.model,
    })
  }

  const handleSave = () => {
    saveConfig(config)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  const isConfigured = config.apiKey.length > 0

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-2xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">⚙️ 设置</h1>
          <p className="text-gray-500">配置 AI 功能，让你的 ResearchBuddy 更智能</p>
        </div>

        {/* AI Configuration */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 mb-6">
          <div className="flex items-center gap-2 mb-6">
            <span className="text-2xl">🤖</span>
            <h2 className="text-xl font-semibold text-gray-900">AI 配置</h2>
            {isConfigured && (
              <span className="px-2 py-0.5 bg-green-50 text-green-600 text-xs rounded-full">
                已配置
              </span>
            )}
          </div>

          {/* Provider selection */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              AI 服务商
            </label>
            <div className="grid grid-cols-4 gap-3">
              {Object.entries(PROVIDER_PRESETS).map(([key, preset]) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => handleProviderChange(key as AIConfig['provider'])}
                  className={`p-3 rounded-lg border-2 text-sm font-medium transition-all ${
                    config.provider === key
                      ? 'border-blue-500 bg-blue-50 text-blue-700'
                      : 'border-gray-200 hover:border-gray-300 text-gray-600'
                  }`}
                >
                  <div className="text-lg mb-1">
                    {key === 'openai' && '🟢'}
                    {key === 'openrouter' && '🔵'}
                    {key === 'stepfun' && '🧠'}
                    {key === 'custom' && '⚙️'}
                  </div>
                  {preset.label}
                </button>
              ))}
            </div>
          </div>

          {/* API Key */}
          <div className="mb-5">
            <label htmlFor="apiKey" className="block text-sm font-medium text-gray-700 mb-1">
              API Key
            </label>
            <input
              id="apiKey"
              type="password"
              value={config.apiKey}
              onChange={(e) => saveConfig({ ...config, apiKey: e.target.value })}
              placeholder="sk-..."
              className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-100 outline-none font-mono text-sm"
            />
            <p className="text-xs text-gray-400 mt-1">
              {config.provider === 'openrouter'
                ? '在 https://openrouter.ai/keys 获取'
                : config.provider === 'openai'
                  ? '在 https://platform.openai.com/api-keys 获取'
                  : '填入你的 API Key'}
            </p>
          </div>

          {/* API URL */}
          <div className="mb-5">
            <label htmlFor="apiUrl" className="block text-sm font-medium text-gray-700 mb-1">
              API 地址
            </label>
            <input
              id="apiUrl"
              type="text"
              value={config.apiUrl}
              onChange={(e) => saveConfig({ ...config, apiUrl: e.target.value })}
              placeholder="https://api.openai.com/v1/chat/completions"
              className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-100 outline-none font-mono text-sm"
            />
          </div>

          {/* Model */}
          <div className="mb-5">
            <label htmlFor="model" className="block text-sm font-medium text-gray-700 mb-1">
              模型
            </label>
            <input
              id="model"
              type="text"
              value={config.model}
              onChange={(e) => saveConfig({ ...config, model: e.target.value })}
              placeholder="gpt-4o-mini"
              className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-100 outline-none font-mono text-sm"
            />
            <p className="text-xs text-gray-400 mt-1">
              推荐模型：GPT-4o-mini / Claude 3.5 Haiku（性价比高）
            </p>
          </div>

          {/* Save button */}
          <button
            onClick={handleSave}
            className="w-full bg-blue-600 text-white py-2.5 rounded-lg font-medium hover:bg-blue-700 transition-colors"
          >
            {saved ? '✓ 已保存' : '保存配置'}
          </button>
        </div>

        {/* Data management */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
            📦 数据管理
          </h2>

          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div>
                <div className="text-sm font-medium text-gray-700">本地存储</div>
                <div className="text-xs text-gray-400">数据保存在浏览器 localStorage</div>
              </div>
              <span className="text-xs text-green-600 bg-green-50 px-2 py-1 rounded-full">
                正常
              </span>
            </div>

            <button
              onClick={() => {
                if (confirm('确定要导出所有数据吗？')) {
                  const data = {
                    journal_entries: localStorage.getItem('journal_entries'),
                    ai_config: localStorage.getItem('ai_config'),
                    checkins: localStorage.getItem('checkins'),
                    exportedAt: new Date().toISOString(),
                  }
                  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
                  const url = URL.createObjectURL(blob)
                  const a = document.createElement('a')
                  a.href = url
                  a.download = `research-buddy-backup-${new Date().toISOString().split('T')[0]}.json`
                  a.click()
                  URL.revokeObjectURL(url)
                }
              }}
              className="w-full text-left px-4 py-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-sm"
            >
              📥 导出数据（JSON）
            </button>

            <button
              onClick={() => {
                if (confirm('确定要清除所有数据吗？此操作不可恢复！')) {
                  localStorage.clear()
                  window.location.reload()
                }
              }}
              className="w-full text-left px-4 py-3 border border-red-200 text-red-600 rounded-lg hover:bg-red-50 transition-colors text-sm"
            >
              🗑️ 清除所有数据
            </button>
          </div>
        </div>

        {/* About */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">ℹ️ 关于</h2>
          <div className="text-sm text-gray-600 space-y-2">
            <p>
              <strong>ResearchBuddy</strong> v0.3.0
            </p>
            <p>陪你做科研的 AI 伙伴 — 记录、回顾、鼓励、打卡、交流</p>
            <p className="text-gray-400">
              数据仅存储在你的浏览器本地，不会上传到任何服务器。
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
