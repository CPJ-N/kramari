'use client'

import { useState, useCallback } from 'react'
import { Phone, Loader2, AlertCircle, RefreshCw, Headphones } from 'lucide-react'
import { motion } from 'framer-motion'
import { VoiceRoom, VoiceRoomLoader } from '@/components/voice/VoiceRoom'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'

interface SessionData {
  roomName: string
  token: string
  livekitUrl: string
}

type SessionState = 'idle' | 'creating' | 'connected' | 'error'

export default function VoiceTestPage() {
  const [sessionState, setSessionState] = useState<SessionState>('idle')
  const [sessionData, setSessionData] = useState<SessionData | null>(null)
  const [error, setError] = useState<string | null>(null)

  const createSession = useCallback(async () => {
    setSessionState('creating')
    setError(null)

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'
      const response = await fetch(`${apiUrl}/voice/test-session`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          participantName: `test-user-${Date.now()}`,
        }),
      })

      if (!response.ok) {
        throw new Error(`Failed to create session: ${response.statusText}`)
      }

      const data: SessionData = await response.json()
      setSessionData(data)
      setSessionState('connected')
    } catch (err) {
      console.error('Failed to create voice session:', err)
      setError(err instanceof Error ? err.message : 'Failed to create session')
      setSessionState('error')
    }
  }, [])

  const handleDisconnect = useCallback(() => {
    setSessionData(null)
    setSessionState('idle')
  }, [])

  return (
    <div className="p-6 max-w-4xl mx-auto">
      {/* Header */}
      <motion.div
        className="mb-8"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-3xl font-bold text-gradient-kramari">
          Voice Test
        </h1>
        <p className="text-kramari-muted mt-2">
          Test your voice agent in real-time
        </p>
      </motion.div>

      {/* Main Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <Card className="relative overflow-hidden">
          {/* Background Blobs */}
          <div className="absolute top-0 right-0 w-64 h-64 blob blob-primary -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-48 h-48 blob blob-secondary translate-y-1/2 -translate-x-1/2" />

          <CardContent className="relative p-8">
            {/* Idle State - Start Button */}
            {sessionState === 'idle' && (
              <motion.div
                className="flex flex-col items-center justify-center gap-6 py-12"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-kramari-muted to-kramari-taupe flex items-center justify-center">
                  <Headphones className="w-12 h-12 text-white" />
                </div>
                <div className="text-center">
                  <h2 className="text-xl font-semibold text-kramari-charcoal dark:text-kramari-taupe mb-2">
                    Ready to Test
                  </h2>
                  <p className="text-kramari-muted max-w-md">
                    Click the button below to start a voice session with Kramari.
                    Make sure your microphone is enabled.
                  </p>
                </div>
                <Button
                  onClick={createSession}
                  size="xl"
                  className="gap-2"
                >
                  <Phone className="w-5 h-5" />
                  Start Voice Session
                </Button>
              </motion.div>
            )}

            {/* Creating State - Loading */}
            {sessionState === 'creating' && (
              <motion.div
                className="flex flex-col items-center justify-center gap-4 py-12"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <Loader2 className="w-12 h-12 animate-spin text-kramari-muted" />
                <p className="text-kramari-muted">
                  Creating voice session...
                </p>
              </motion.div>
            )}

            {/* Connected State - Voice Room */}
            {sessionState === 'connected' && sessionData && (
              <motion.div
                className="flex flex-col items-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <div className="mb-4 text-center">
                  <p className="text-sm text-kramari-muted">
                    Room: <span className="font-mono">{sessionData.roomName}</span>
                  </p>
                </div>
                <VoiceRoom
                  token={sessionData.token}
                  serverUrl={sessionData.livekitUrl}
                  roomName={sessionData.roomName}
                  onDisconnect={handleDisconnect}
                />
              </motion.div>
            )}

            {/* Error State */}
            {sessionState === 'error' && (
              <motion.div
                className="flex flex-col items-center justify-center gap-6 py-12"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <div className="w-16 h-16 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
                  <AlertCircle className="w-8 h-8 text-red-600 dark:text-red-400" />
                </div>
                <div className="text-center">
                  <h2 className="text-xl font-semibold text-kramari-charcoal dark:text-kramari-taupe mb-2">
                    Connection Failed
                  </h2>
                  <p className="text-kramari-muted max-w-md mb-2">
                    {error || 'Unable to create voice session'}
                  </p>
                  <p className="text-sm text-kramari-taupe dark:text-kramari-charcoal">
                    Make sure the API server is running and LiveKit is configured.
                  </p>
                </div>
                <Button
                  onClick={createSession}
                  variant="outline"
                  size="lg"
                  className="gap-2"
                >
                  <RefreshCw className="w-5 h-5" />
                  Try Again
                </Button>
              </motion.div>
            )}
          </CardContent>
        </Card>
      </motion.div>

      {/* Instructions */}
      <motion.div
        className="mt-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <Card className="border-kramari-muted/30 bg-gradient-to-br from-kramari-taupe/10 to-kramari-muted/10">
          <CardContent className="p-6">
            <h3 className="font-semibold text-kramari-charcoal dark:text-kramari-taupe mb-3">
              Before Testing
            </h3>
            <ul className="space-y-2 text-sm text-kramari-charcoal/80 dark:text-kramari-taupe/80">
              <li className="flex items-start gap-2">
                <span className="font-mono bg-kramari-taupe/20 dark:bg-kramari-charcoal/20 px-2 py-0.5 rounded text-xs">1</span>
                Start the agent worker: <code className="bg-kramari-taupe/20 dark:bg-kramari-charcoal/20 px-2 py-0.5 rounded">cd apps/agents/node && pnpm dev</code>
              </li>
              <li className="flex items-start gap-2">
                <span className="font-mono bg-kramari-taupe/20 dark:bg-kramari-charcoal/20 px-2 py-0.5 rounded text-xs">2</span>
                Start the API server: <code className="bg-kramari-taupe/20 dark:bg-kramari-charcoal/20 px-2 py-0.5 rounded">cd apps/api && pnpm dev</code>
              </li>
              <li className="flex items-start gap-2">
                <span className="font-mono bg-kramari-taupe/20 dark:bg-kramari-charcoal/20 px-2 py-0.5 rounded text-xs">3</span>
                Ensure your browser has microphone permissions
              </li>
              <li className="flex items-start gap-2">
                <span className="font-mono bg-kramari-taupe/20 dark:bg-kramari-charcoal/20 px-2 py-0.5 rounded text-xs">4</span>
                Configure API keys in <code className="bg-kramari-taupe/20 dark:bg-kramari-charcoal/20 px-2 py-0.5 rounded">.env.local</code> files
              </li>
            </ul>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
