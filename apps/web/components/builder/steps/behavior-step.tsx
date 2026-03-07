'use client'

import { motion } from 'framer-motion'
import { Sparkles, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { apiPost } from '@/lib/api'
import { useBuilderStore } from '../builder-store'

const MODELS = [
  { id: 'claude-3-sonnet', name: 'Claude 3 Sonnet', description: 'Fast and intelligent' },
  { id: 'claude-3-opus', name: 'Claude 3 Opus', description: 'Most capable' },
  { id: 'claude-3-haiku', name: 'Claude 3 Haiku', description: 'Fastest response time' },
  { id: 'gpt-4o', name: 'GPT-4o', description: 'OpenAI multimodal' },
  { id: 'gpt-4o-mini', name: 'GPT-4o Mini', description: 'OpenAI fast & affordable' },
]

export function BehaviorStep() {
  const { config, updateConfig, isGenerating, setGenerating } = useBuilderStore()

  const handleEnhance = async () => {
    if (!config.systemPrompt.trim()) return
    setGenerating(true)

    try {
      const data = await apiPost('/agents/ai/enhance-prompt', {
        prompt: config.systemPrompt,
        agentName: config.name,
        personality: config.personality.join(', '),
        type: config.type,
      })
      if (data.enhancedPrompt) {
        updateConfig({ systemPrompt: data.enhancedPrompt })
      }
    } catch (err) {
      console.error('Prompt enhancement failed:', err)
    } finally {
      setGenerating(false)
    }
  }

  return (
    <div className="space-y-8 max-w-2xl mx-auto">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-kramari-charcoal dark:text-kramari-taupe">
          Agent Behavior
        </h2>
        <p className="text-kramari-muted mt-1">
          Define how your agent thinks and responds
        </p>
      </div>

      {/* System Prompt */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium text-kramari-charcoal dark:text-kramari-taupe">
            System Prompt
          </label>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleEnhance}
            disabled={!config.systemPrompt.trim() || isGenerating}
          >
            {isGenerating ? (
              <Loader2 className="h-3.5 w-3.5 mr-1.5 animate-spin" />
            ) : (
              <Sparkles className="h-3.5 w-3.5 mr-1.5" />
            )}
            Enhance with AI
          </Button>
        </div>
        <textarea
          value={config.systemPrompt}
          onChange={(e) => updateConfig({ systemPrompt: e.target.value })}
          placeholder="You are a helpful voice agent. Describe how the agent should behave, what it knows, how it should respond to callers, and any rules it should follow..."
          rows={10}
          className="w-full rounded-xl border border-kramari-taupe/20 dark:border-kramari-charcoal/20 bg-kramari-cream dark:bg-kramari-dark px-4 py-3 text-sm text-kramari-charcoal dark:text-kramari-taupe placeholder:text-kramari-muted/60 focus:outline-none focus:ring-2 focus:ring-kramari-charcoal dark:focus:ring-kramari-taupe resize-none transition-all font-mono"
        />
        <p className="text-xs text-kramari-muted">
          {config.systemPrompt.length} characters
        </p>
      </div>

      {/* Model Selection */}
      <div className="space-y-3">
        <label className="text-sm font-medium text-kramari-charcoal dark:text-kramari-taupe">
          AI Model
        </label>
        <div className="grid grid-cols-1 gap-2">
          {MODELS.map((model) => (
            <button
              key={model.id}
              onClick={() => updateConfig({ model: model.id })}
              className={`flex items-center gap-3 p-3 rounded-xl border text-left transition-all ${
                config.model === model.id
                  ? 'border-kramari-charcoal dark:border-kramari-taupe bg-kramari-charcoal/5 dark:bg-kramari-taupe/5'
                  : 'border-kramari-taupe/20 dark:border-kramari-charcoal/30 hover:border-kramari-muted/40'
              }`}
            >
              <div className={`h-3 w-3 rounded-full border-2 ${
                config.model === model.id
                  ? 'border-kramari-charcoal dark:border-kramari-taupe bg-kramari-charcoal dark:bg-kramari-taupe'
                  : 'border-kramari-muted'
              }`} />
              <div>
                <p className="font-medium text-sm text-kramari-charcoal dark:text-kramari-taupe">
                  {model.name}
                </p>
                <p className="text-xs text-kramari-muted">{model.description}</p>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Temperature Slider */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium text-kramari-charcoal dark:text-kramari-taupe">
            Temperature
          </label>
          <span className="text-sm font-mono text-kramari-muted">
            {config.temperature.toFixed(1)}
          </span>
        </div>
        <input
          type="range"
          min="0"
          max="1"
          step="0.1"
          value={config.temperature}
          onChange={(e) => updateConfig({ temperature: parseFloat(e.target.value) })}
          className="w-full accent-kramari-charcoal dark:accent-kramari-taupe"
        />
        <div className="flex justify-between text-xs text-kramari-muted">
          <span>Precise</span>
          <span>Balanced</span>
          <span>Creative</span>
        </div>
      </div>
    </div>
  )
}
