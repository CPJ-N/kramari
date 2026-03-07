'use client'

import { useState, useRef } from 'react'
import { motion } from 'framer-motion'
import { Play, Pause, Volume2, Check } from 'lucide-react'
import { useBuilderStore } from '../builder-store'

interface VoiceOption {
  id: string
  name: string
  description: string
  tags: string[]
  sampleUrl?: string
}

const VOICE_PROVIDERS = [
  { id: 'elevenlabs', name: 'ElevenLabs', description: 'Premium, natural-sounding voices' },
  { id: 'openai', name: 'OpenAI', description: 'Fast, reliable voices' },
]

const VOICES: Record<string, VoiceOption[]> = {
  elevenlabs: [
    { id: 'rachel', name: 'Rachel', description: 'Warm and conversational', tags: ['female', 'warm', 'american'] },
    { id: 'drew', name: 'Drew', description: 'Professional and confident', tags: ['male', 'professional', 'american'] },
    { id: 'clyde', name: 'Clyde', description: 'Deep and authoritative', tags: ['male', 'deep', 'american'] },
    { id: 'domi', name: 'Domi', description: 'Energetic and friendly', tags: ['female', 'energetic', 'american'] },
    { id: 'bella', name: 'Bella', description: 'Soft and gentle', tags: ['female', 'soft', 'american'] },
    { id: 'antoni', name: 'Antoni', description: 'Well-rounded and clear', tags: ['male', 'clear', 'american'] },
    { id: 'elli', name: 'Elli', description: 'Young and upbeat', tags: ['female', 'young', 'american'] },
    { id: 'josh', name: 'Josh', description: 'Deep and narrative', tags: ['male', 'narrative', 'american'] },
  ],
  openai: [
    { id: 'alloy', name: 'Alloy', description: 'Neutral and balanced', tags: ['neutral', 'balanced'] },
    { id: 'echo', name: 'Echo', description: 'Warm and steady', tags: ['male', 'warm'] },
    { id: 'fable', name: 'Fable', description: 'Expressive and dynamic', tags: ['neutral', 'british'] },
    { id: 'onyx', name: 'Onyx', description: 'Deep and rich', tags: ['male', 'deep'] },
    { id: 'nova', name: 'Nova', description: 'Bright and friendly', tags: ['female', 'bright'] },
    { id: 'shimmer', name: 'Shimmer', description: 'Clear and pleasant', tags: ['female', 'clear'] },
  ],
}

const LANGUAGES = [
  { code: 'en', name: 'English' },
  { code: 'es', name: 'Spanish' },
  { code: 'fr', name: 'French' },
  { code: 'de', name: 'German' },
  { code: 'it', name: 'Italian' },
  { code: 'pt', name: 'Portuguese' },
  { code: 'ja', name: 'Japanese' },
  { code: 'ko', name: 'Korean' },
  { code: 'zh', name: 'Chinese' },
  { code: 'hi', name: 'Hindi' },
  { code: 'ar', name: 'Arabic' },
]

export function VoiceStep() {
  const { config, updateConfig } = useBuilderStore()
  const [playingVoice, setPlayingVoice] = useState<string | null>(null)
  const [loadingVoice, setLoadingVoice] = useState<string | null>(null)
  const audioRef = useRef<HTMLAudioElement | null>(null)

  const voices = VOICES[config.voiceProvider] || []

  const handlePlayVoice = async (voiceId: string) => {
    if (playingVoice === voiceId) {
      audioRef.current?.pause()
      setPlayingVoice(null)
      return
    }

    if (audioRef.current) {
      audioRef.current.pause()
    }

    setLoadingVoice(voiceId)

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/agents/ai/voice-preview`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            voiceId,
            provider: config.voiceProvider,
            text: 'Hi there! Thanks for calling. How can I help you today?',
          }),
        }
      )

      if (!res.ok) throw new Error('Failed to get preview')

      const blob = await res.blob()
      const url = URL.createObjectURL(blob)
      const audio = new Audio(url)
      audioRef.current = audio

      audio.onended = () => {
        setPlayingVoice(null)
        URL.revokeObjectURL(url)
      }
      audio.onerror = () => {
        setPlayingVoice(null)
        setLoadingVoice(null)
      }

      await audio.play()
      setPlayingVoice(voiceId)
    } catch (err) {
      console.error('Voice preview failed:', err)
    } finally {
      setLoadingVoice(null)
    }
  }

  return (
    <div className="space-y-8 max-w-3xl mx-auto">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-kramari-charcoal dark:text-kramari-taupe">
          Voice & Language
        </h2>
        <p className="text-kramari-muted mt-1">
          Choose how your agent sounds
        </p>
      </div>

      {/* Voice Provider Toggle */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-kramari-charcoal dark:text-kramari-taupe">
          Voice Provider
        </label>
        <div className="flex gap-2">
          {VOICE_PROVIDERS.map((provider) => (
            <button
              key={provider.id}
              onClick={() => updateConfig({ voiceProvider: provider.id, voice: VOICES[provider.id]?.[0]?.id || 'alloy' })}
              className={`flex-1 p-3 rounded-xl border text-left transition-all ${
                config.voiceProvider === provider.id
                  ? 'border-kramari-charcoal dark:border-kramari-taupe bg-kramari-charcoal/5 dark:bg-kramari-taupe/5'
                  : 'border-kramari-taupe/20 dark:border-kramari-charcoal/30 hover:border-kramari-muted/40'
              }`}
            >
              <p className="font-medium text-sm text-kramari-charcoal dark:text-kramari-taupe">
                {provider.name}
              </p>
              <p className="text-xs text-kramari-muted mt-0.5">{provider.description}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Voice Selection Grid */}
      <div className="space-y-3">
        <label className="text-sm font-medium text-kramari-charcoal dark:text-kramari-taupe">
          Select Voice
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {voices.map((voice, i) => {
            const isSelected = config.voice === voice.id
            const isPlaying = playingVoice === voice.id
            const isLoading = loadingVoice === voice.id

            return (
              <motion.div
                key={voice.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.03 }}
                className={`relative flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all ${
                  isSelected
                    ? 'border-kramari-charcoal dark:border-kramari-taupe bg-kramari-charcoal/5 dark:bg-kramari-taupe/5'
                    : 'border-kramari-taupe/20 dark:border-kramari-charcoal/30 hover:border-kramari-muted/40'
                }`}
                onClick={() => updateConfig({ voice: voice.id })}
              >
                {/* Play Button */}
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    handlePlayVoice(voice.id)
                  }}
                  className={`shrink-0 h-10 w-10 rounded-full flex items-center justify-center transition-all ${
                    isPlaying
                      ? 'bg-gradient-to-r from-kramari-charcoal to-kramari-muted text-white'
                      : 'bg-kramari-taupe/10 dark:bg-kramari-charcoal/20 text-kramari-charcoal dark:text-kramari-taupe hover:bg-kramari-taupe/20'
                  }`}
                >
                  {isLoading ? (
                    <div className="h-4 w-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                  ) : isPlaying ? (
                    <Pause className="h-4 w-4" />
                  ) : (
                    <Play className="h-4 w-4 ml-0.5" />
                  )}
                </button>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="font-medium text-sm text-kramari-charcoal dark:text-kramari-taupe">
                      {voice.name}
                    </p>
                    {isSelected && (
                      <Check className="h-3.5 w-3.5 text-kramari-charcoal dark:text-kramari-taupe" />
                    )}
                  </div>
                  <p className="text-xs text-kramari-muted">{voice.description}</p>
                  <div className="flex gap-1 mt-1">
                    {voice.tags.map((tag) => (
                      <span
                        key={tag}
                        className="text-[10px] px-1.5 py-0.5 rounded-full bg-kramari-taupe/10 dark:bg-kramari-charcoal/20 text-kramari-muted"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                {isPlaying && (
                  <div className="flex items-center gap-0.5">
                    {[...Array(4)].map((_, j) => (
                      <motion.div
                        key={j}
                        className="w-0.5 bg-kramari-charcoal dark:bg-kramari-taupe rounded-full"
                        animate={{ height: [8, 16, 8] }}
                        transition={{
                          duration: 0.6,
                          delay: j * 0.1,
                          repeat: Infinity,
                        }}
                      />
                    ))}
                  </div>
                )}
              </motion.div>
            )
          })}
        </div>
      </div>

      {/* Language Selection */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-kramari-charcoal dark:text-kramari-taupe">
          Language
        </label>
        <div className="flex flex-wrap gap-2">
          {LANGUAGES.map((lang) => (
            <button
              key={lang.code}
              onClick={() => updateConfig({ language: lang.code })}
              className={`px-3 py-1.5 rounded-full text-sm transition-all ${
                config.language === lang.code
                  ? 'bg-gradient-to-r from-kramari-charcoal to-kramari-muted text-white'
                  : 'bg-kramari-taupe/10 dark:bg-kramari-charcoal/20 text-kramari-charcoal dark:text-kramari-taupe hover:bg-kramari-taupe/20'
              }`}
            >
              {lang.name}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
