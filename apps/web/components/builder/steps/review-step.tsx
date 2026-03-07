'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  User,
  Volume2,
  Brain,
  Wrench,
  BookOpen,
  Rocket,
  Headphones,
  Loader2,
  Check,
  ChevronRight,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useBuilderStore, BUILDER_STEPS } from '../builder-store'
import { useRouter } from 'next/navigation'

export function ReviewStep() {
  const { config, setStep } = useBuilderStore()
  const [deploying, setDeploying] = useState(false)
  const [deployed, setDeployed] = useState<{ agentId: string; phoneNumber?: string } | null>(null)
  const [testing, setTesting] = useState(false)
  const router = useRouter()

  const enabledTools = config.tools.filter(t => t.enabled)

  const handleDeploy = async () => {
    setDeploying(true)
    try {
      // Create agent
      const createRes = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/agents`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: config.name,
            description: config.description,
            type: config.type,
            systemPrompt: config.systemPrompt,
            firstMessage: config.firstMessage,
            voice: config.voice,
            voiceProvider: config.voiceProvider,
            model: config.model,
            maxConcurrentCalls: config.maxConcurrentCalls,
            maxCallDuration: config.maxCallDuration,
            config: {
              temperature: config.temperature,
              language: config.language,
              personality: config.personality,
              tools: enabledTools.map(t => ({ id: t.id, name: t.name })),
              knowledgeBase: config.knowledgeBase,
            },
          }),
        }
      )
      const agent = await createRes.json()

      // Deploy agent
      await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/agents/${agent.id}/deploy`,
        { method: 'POST' }
      )

      setDeployed({ agentId: agent.id })
    } catch (err) {
      console.error('Deploy failed:', err)
    } finally {
      setDeploying(false)
    }
  }

  if (deployed) {
    return (
      <div className="text-center space-y-6 py-8">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 200 }}
          className="h-20 w-20 mx-auto rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center"
        >
          <Check className="h-10 w-10 text-green-600 dark:text-green-400" />
        </motion.div>
        <div>
          <h2 className="text-2xl font-bold text-kramari-charcoal dark:text-kramari-taupe">
            Agent Deployed!
          </h2>
          <p className="text-kramari-muted mt-1">
            {config.name} is now live and ready to take calls
          </p>
        </div>
        <div className="flex gap-3 justify-center">
          <Button
            variant="outline"
            onClick={() => router.push(`/dashboard/agents/${deployed.agentId}`)}
          >
            View Agent
          </Button>
          <Button onClick={() => router.push('/dashboard')}>
            Go to Dashboard
          </Button>
        </div>
      </div>
    )
  }

  const sections = [
    {
      icon: User,
      label: 'Identity',
      step: 'identity' as const,
      items: [
        { label: 'Name', value: config.name || '—' },
        { label: 'Description', value: config.description || '—' },
        { label: 'Personality', value: config.personality || '—' },
        { label: 'First Message', value: config.firstMessage || '—' },
      ],
    },
    {
      icon: Volume2,
      label: 'Voice & Language',
      step: 'voice' as const,
      items: [
        { label: 'Provider', value: config.voiceProvider },
        { label: 'Voice', value: config.voice },
        { label: 'Language', value: config.language },
      ],
    },
    {
      icon: Brain,
      label: 'Behavior',
      step: 'behavior' as const,
      items: [
        { label: 'Model', value: config.model },
        { label: 'Temperature', value: config.temperature.toFixed(1) },
        { label: 'System Prompt', value: config.systemPrompt ? `${config.systemPrompt.slice(0, 100)}...` : '—' },
      ],
    },
    {
      icon: Wrench,
      label: 'Tools',
      step: 'tools' as const,
      items: [
        {
          label: 'Enabled Tools',
          value: enabledTools.length > 0
            ? enabledTools.map(t => t.name).join(', ')
            : 'None',
        },
      ],
    },
    {
      icon: BookOpen,
      label: 'Knowledge Base',
      step: 'knowledge' as const,
      items: [
        {
          label: 'Entries',
          value: config.knowledgeBase.length > 0
            ? `${config.knowledgeBase.filter(e => e.type === 'faq').length} FAQs, ${config.knowledgeBase.filter(e => e.type === 'document').length} documents`
            : 'None',
        },
      ],
    },
  ]

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-kramari-charcoal dark:text-kramari-taupe">
          Review & Deploy
        </h2>
        <p className="text-kramari-muted mt-1">
          Review your agent configuration before deploying
        </p>
      </div>

      {/* Config Summary */}
      <div className="space-y-3">
        {sections.map((section, i) => (
          <motion.div
            key={section.label}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="p-4 rounded-xl border border-kramari-taupe/20 dark:border-kramari-charcoal/30 bg-white dark:bg-kramari-dark/50"
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <section.icon className="h-4 w-4 text-kramari-muted" />
                <p className="font-medium text-sm text-kramari-charcoal dark:text-kramari-taupe">
                  {section.label}
                </p>
              </div>
              <button
                onClick={() => setStep(section.step)}
                className="text-xs text-kramari-muted hover:text-kramari-charcoal dark:hover:text-kramari-taupe transition-colors flex items-center gap-0.5"
              >
                Edit <ChevronRight className="h-3 w-3" />
              </button>
            </div>
            <div className="space-y-1">
              {section.items.map((item) => (
                <div key={item.label} className="flex gap-2 text-xs">
                  <span className="text-kramari-muted shrink-0 w-24">{item.label}:</span>
                  <span className="text-kramari-charcoal dark:text-kramari-taupe truncate">
                    {item.value}
                  </span>
                </div>
              ))}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Deploy Actions */}
      <div className="flex gap-3 justify-center pt-4">
        <Button variant="outline" size="lg" disabled>
          <Headphones className="h-4 w-4 mr-2" />
          Test Agent
        </Button>
        <Button size="lg" onClick={handleDeploy} disabled={deploying || !config.name || !config.systemPrompt}>
          {deploying ? (
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
          ) : (
            <Rocket className="h-4 w-4 mr-2" />
          )}
          {deploying ? 'Deploying...' : 'Deploy Agent'}
        </Button>
      </div>

      {!config.name && (
        <p className="text-xs text-red-500 text-center">
          Agent name is required before deploying
        </p>
      )}
      {!config.systemPrompt && (
        <p className="text-xs text-red-500 text-center">
          System prompt is required before deploying
        </p>
      )}
    </div>
  )
}
