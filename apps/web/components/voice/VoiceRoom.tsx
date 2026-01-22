'use client'

import { useState, useCallback } from 'react'
import {
  LiveKitRoom,
  RoomAudioRenderer,
  useConnectionState,
  useLocalParticipant,
  useRoomContext,
} from '@livekit/components-react'
import { ConnectionState } from 'livekit-client'
import { Mic, MicOff, PhoneOff, Loader2 } from 'lucide-react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'

interface VoiceRoomProps {
  token: string
  serverUrl: string
  roomName: string
  onDisconnect?: () => void
}

function AudioWaveform() {
  return (
    <div className="flex items-center justify-center gap-1 h-16">
      {[...Array(12)].map((_, i) => (
        <motion.div
          key={i}
          className="w-1.5 bg-gradient-to-t from-kramari-taupe to-kramari-charcoal dark:from-kramari-charcoal dark:to-kramari-taupe rounded-full"
          animate={{
            height: [15, 30 + Math.random() * 20, 15],
          }}
          transition={{
            duration: 1.2,
            repeat: Infinity,
            delay: i * 0.05,
            ease: 'easeInOut',
          }}
        />
      ))}
    </div>
  )
}

function VoiceControls({ onDisconnect }: { onDisconnect?: () => void }) {
  const room = useRoomContext()
  const connectionState = useConnectionState()
  const { localParticipant } = useLocalParticipant()
  const [isMuted, setIsMuted] = useState(false)

  const toggleMute = useCallback(async () => {
    if (localParticipant) {
      await localParticipant.setMicrophoneEnabled(isMuted)
      setIsMuted(!isMuted)
    }
  }, [localParticipant, isMuted])

  const handleDisconnect = useCallback(() => {
    room.disconnect()
    onDisconnect?.()
  }, [room, onDisconnect])

  const isConnected = connectionState === ConnectionState.Connected
  const isConnecting = connectionState === ConnectionState.Connecting

  return (
    <motion.div
      className="flex flex-col items-center gap-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Connection Status */}
      <div className="flex items-center gap-2">
        <div
          className={`w-3 h-3 rounded-full ${
            isConnected
              ? 'bg-green-500'
              : isConnecting
              ? 'bg-kramari-muted'
              : 'bg-kramari-taupe/50'
          }`}
          style={{
            animation: isConnected || isConnecting ? 'pulse 2s infinite' : 'none',
          }}
        />
        <span className="text-sm text-kramari-charcoal dark:text-kramari-taupe">
          {isConnected
            ? 'Connected to Kramari'
            : isConnecting
            ? 'Connecting...'
            : 'Disconnected'}
        </span>
      </div>

      {/* Voice Visualization */}
      {isConnected && <AudioWaveform />}

      {/* Control Buttons */}
      <div className="flex items-center gap-4">
        <motion.button
          onClick={toggleMute}
          disabled={!isConnected}
          className={`p-5 rounded-full transition-all duration-300 ${
            isMuted
              ? 'bg-red-500 hover:bg-red-600 text-white shadow-lg shadow-red-500/30'
              : 'bg-gradient-to-br from-kramari-taupe/20 to-kramari-muted/20 hover:from-kramari-taupe/30 hover:to-kramari-muted/30 text-kramari-charcoal dark:text-kramari-taupe border border-kramari-muted/20'
          } ${!isConnected ? 'opacity-50 cursor-not-allowed' : ''}`}
          whileHover={isConnected ? { scale: 1.05 } : {}}
          whileTap={isConnected ? { scale: 0.95 } : {}}
          title={isMuted ? 'Unmute' : 'Mute'}
        >
          {isMuted ? <MicOff className="w-6 h-6" /> : <Mic className="w-6 h-6" />}
        </motion.button>

        <motion.button
          onClick={handleDisconnect}
          disabled={!isConnected}
          className={`p-5 rounded-full bg-red-500 hover:bg-red-600 text-white transition-all duration-300 shadow-lg shadow-red-500/30 ${
            !isConnected ? 'opacity-50 cursor-not-allowed' : ''
          }`}
          whileHover={isConnected ? { scale: 1.05 } : {}}
          whileTap={isConnected ? { scale: 0.95 } : {}}
          title="End call"
        >
          <PhoneOff className="w-6 h-6" />
        </motion.button>
      </div>

      {/* Instructions */}
      {isConnected && (
        <motion.p
          className="text-sm text-kramari-muted text-center max-w-xs"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          Speak to interact with Kramari. The agent will respond to your voice.
        </motion.p>
      )}
    </motion.div>
  )
}

export function VoiceRoom({ token, serverUrl, roomName, onDisconnect }: VoiceRoomProps) {
  return (
    <LiveKitRoom
      token={token}
      serverUrl={serverUrl}
      connect={true}
      audio={true}
      video={false}
      onDisconnected={onDisconnect}
      className="flex flex-col items-center justify-center p-8"
    >
      <RoomAudioRenderer />
      <VoiceControls onDisconnect={onDisconnect} />
    </LiveKitRoom>
  )
}

export function VoiceRoomLoader() {
  return (
    <motion.div
      className="flex flex-col items-center justify-center gap-4 p-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <Loader2 className="w-8 h-8 animate-spin text-kramari-muted" />
      <p className="text-sm text-kramari-muted">
        Connecting to voice session...
      </p>
    </motion.div>
  )
}
