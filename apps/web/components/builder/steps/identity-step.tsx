'use client'

import { motion } from 'framer-motion'
import { User, Sparkles } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { useBuilderStore } from '../builder-store'

const personalityTraits = [
  'Friendly', 'Professional', 'Casual', 'Formal', 'Empathetic',
  'Energetic', 'Calm', 'Witty', 'Serious', 'Warm',
]

export function IdentityStep() {
  const { config, updateConfig } = useBuilderStore()

  const toggleTrait = (trait: string) => {
    const current = config.personality.split(', ').filter(Boolean)
    const updated = current.includes(trait)
      ? current.filter(t => t !== trait)
      : [...current, trait]
    updateConfig({ personality: updated.join(', ') })
  }

  const selectedTraits = config.personality.split(', ').filter(Boolean)

  return (
    <div className="space-y-8 max-w-2xl mx-auto">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-kramari-charcoal dark:text-kramari-taupe">
          Agent Identity
        </h2>
        <p className="text-kramari-muted mt-1">
          Give your agent a name and personality
        </p>
      </div>

      {/* Name */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-kramari-charcoal dark:text-kramari-taupe">
          Agent Name
        </label>
        <Input
          value={config.name}
          onChange={(e) => updateConfig({ name: e.target.value })}
          placeholder="e.g. Luna, Max, Sarah"
          className="text-lg h-12"
        />
      </div>

      {/* Description */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-kramari-charcoal dark:text-kramari-taupe">
          Description
        </label>
        <Input
          value={config.description}
          onChange={(e) => updateConfig({ description: e.target.value })}
          placeholder="e.g. A helpful customer service agent for our online store"
        />
      </div>

      {/* Personality Traits */}
      <div className="space-y-3">
        <label className="text-sm font-medium text-kramari-charcoal dark:text-kramari-taupe">
          Personality Traits
        </label>
        <div className="flex flex-wrap gap-2">
          {personalityTraits.map((trait) => {
            const isSelected = selectedTraits.includes(trait)
            return (
              <motion.button
                key={trait}
                onClick={() => toggleTrait(trait)}
                whileTap={{ scale: 0.95 }}
                className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
                  isSelected
                    ? 'bg-gradient-to-r from-kramari-charcoal to-kramari-muted text-white'
                    : 'bg-kramari-taupe/10 dark:bg-kramari-charcoal/20 text-kramari-charcoal dark:text-kramari-taupe hover:bg-kramari-taupe/20'
                }`}
              >
                {trait}
              </motion.button>
            )
          })}
        </div>
      </div>

      {/* First Message */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-kramari-charcoal dark:text-kramari-taupe">
          First Message
        </label>
        <p className="text-xs text-kramari-muted">
          The first thing your agent says when a call starts
        </p>
        <textarea
          value={config.firstMessage}
          onChange={(e) => updateConfig({ firstMessage: e.target.value })}
          placeholder="e.g. Hi there! Thanks for calling. How can I help you today?"
          rows={3}
          className="w-full rounded-xl border border-kramari-taupe/20 dark:border-kramari-charcoal/20 bg-kramari-cream dark:bg-kramari-dark px-3 py-2 text-sm text-kramari-charcoal dark:text-kramari-taupe placeholder:text-kramari-muted/60 focus:outline-none focus:ring-2 focus:ring-kramari-charcoal dark:focus:ring-kramari-taupe resize-none transition-all"
        />
      </div>

      {/* Preview Card */}
      {config.name && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 rounded-xl bg-gradient-to-br from-kramari-charcoal/5 to-kramari-muted/5 dark:from-kramari-charcoal/20 dark:to-kramari-muted/10 border border-kramari-taupe/10 dark:border-kramari-charcoal/20"
        >
          <div className="flex items-center gap-3 mb-2">
            <div className="h-10 w-10 rounded-full bg-gradient-to-br from-kramari-charcoal to-kramari-muted flex items-center justify-center">
              <User className="h-5 w-5 text-white" />
            </div>
            <div>
              <p className="font-semibold text-kramari-charcoal dark:text-kramari-taupe">
                {config.name}
              </p>
              {config.personality && (
                <p className="text-xs text-kramari-muted">{config.personality}</p>
              )}
            </div>
          </div>
          {config.firstMessage && (
            <div className="ml-13 mt-2 bg-white dark:bg-kramari-dark/50 rounded-xl px-3 py-2 text-sm text-kramari-charcoal dark:text-kramari-taupe">
              "{config.firstMessage}"
            </div>
          )}
        </motion.div>
      )}
    </div>
  )
}
