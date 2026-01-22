import { z } from 'zod';

// STT Providers
export const STTProviderSchema = z.enum([
  'deepgram',
  'whisper',
  'google',
  'azure',
  'aws-transcribe'
]);

export type STTProvider = z.infer<typeof STTProviderSchema>;

// TTS Providers
export const TTSProviderSchema = z.enum([
  'elevenlabs',
  'azure',
  'google',
  'aws-polly',
  'openai'
]);

export type TTSProvider = z.infer<typeof TTSProviderSchema>;

// LiveKit Room State
export const RoomStateSchema = z.enum([
  'connecting',
  'connected',
  'disconnected',
  'reconnecting',
  'failed'
]);

export type RoomState = z.infer<typeof RoomStateSchema>;

// Participant Type
export const ParticipantTypeSchema = z.enum([
  'agent',
  'user',
  'supervisor',
  'recorder'
]);

export type ParticipantType = z.infer<typeof ParticipantTypeSchema>;

// Voice Pipeline Configuration
export const VoicePipelineConfigSchema = z.object({
  stt: z.object({
    provider: STTProviderSchema,
    model: z.string().optional(),
    language: z.string().default('en-US'),
    options: z.object({
      punctuate: z.boolean().default(true),
      profanityFilter: z.boolean().default(false),
      redact: z.array(z.string()).optional(),
      keywords: z.array(z.string()).optional(),
      interim_results: z.boolean().default(true)
    }).optional()
  }),

  tts: z.object({
    provider: TTSProviderSchema,
    voice: z.string(),
    options: z.object({
      speed: z.number().default(1.0),
      pitch: z.number().default(0),
      volume: z.number().default(1.0),
      stability: z.number().optional(),
      similarity_boost: z.number().optional()
    }).optional()
  }),

  vad: z.object({
    enabled: z.boolean().default(true),
    threshold: z.number().default(0.5),
    minSpeechDuration: z.number().default(250), // ms
    minSilenceDuration: z.number().default(500), // ms
    preSpeechPadding: z.number().default(300), // ms
    postSpeechPadding: z.number().default(300) // ms
  }).optional(),

  interruption: z.object({
    enabled: z.boolean().default(true),
    threshold: z.number().default(0.5),
    minDuration: z.number().default(500) // ms
  }).optional(),

  noiseSupression: z.object({
    enabled: z.boolean().default(true),
    provider: z.enum(['krisp', 'rnnoise']).default('krisp')
  }).optional()
});

export type VoicePipelineConfig = z.infer<typeof VoicePipelineConfigSchema>;

// LiveKit Room Configuration
export const LiveKitRoomConfigSchema = z.object({
  name: z.string(),
  emptyTimeout: z.number().default(300), // seconds
  maxParticipants: z.number().default(10),
  audioOnly: z.boolean().default(true),
  adaptiveStream: z.boolean().default(true),
  dynacast: z.boolean().default(true),
  simulcast: z.boolean().default(false),
  e2ee: z.boolean().default(false),
  recording: z.object({
    enabled: z.boolean().default(false),
    audioOnly: z.boolean().default(true),
    outputFormat: z.enum(['mp3', 'wav', 'opus']).default('mp3')
  }).optional()
});

export type LiveKitRoomConfig = z.infer<typeof LiveKitRoomConfigSchema>;

// LiveKit Participant
export const LiveKitParticipantSchema = z.object({
  sid: z.string(),
  identity: z.string(),
  name: z.string().optional(),
  type: ParticipantTypeSchema,
  state: z.enum(['joining', 'joined', 'active', 'disconnected']),
  isSpeaking: z.boolean(),
  isMuted: z.boolean(),
  audioLevel: z.number(),
  connectionQuality: z.enum(['excellent', 'good', 'poor', 'lost']),
  joinedAt: z.date(),
  metadata: z.record(z.any()).optional()
});

export type LiveKitParticipant = z.infer<typeof LiveKitParticipantSchema>;

// LiveKit Room
export const LiveKitRoomSchema = z.object({
  sid: z.string(),
  name: z.string(),
  state: RoomStateSchema,
  participants: z.array(LiveKitParticipantSchema),
  createdAt: z.date(),
  emptyTimeout: z.number(),
  maxParticipants: z.number(),
  metadata: z.record(z.any()).optional()
});

export type LiveKitRoom = z.infer<typeof LiveKitRoomSchema>;

// Voice Event Types
export const VoiceEventTypeSchema = z.enum([
  'speech.start',
  'speech.end',
  'speech.interim',
  'speech.final',
  'utterance.start',
  'utterance.end',
  'interruption',
  'silence.detected',
  'participant.joined',
  'participant.left',
  'room.created',
  'room.ended',
  'error'
]);

export type VoiceEventType = z.infer<typeof VoiceEventTypeSchema>;

// Voice Event
export const VoiceEventSchema = z.object({
  type: VoiceEventTypeSchema,
  roomId: z.string(),
  participantId: z.string().optional(),
  timestamp: z.date(),
  data: z.any()
});

export type VoiceEvent = z.infer<typeof VoiceEventSchema>;

// Audio Processing Options
export const AudioProcessingOptionsSchema = z.object({
  echoCancellation: z.boolean().default(true),
  noiseSuppression: z.boolean().default(true),
  autoGainControl: z.boolean().default(true),
  sampleRate: z.number().default(48000),
  channelCount: z.number().default(1),
  bitDepth: z.number().default(16)
});

export type AudioProcessingOptions = z.infer<typeof AudioProcessingOptionsSchema>;

// WebRTC Stats
export const WebRTCStatsSchema = z.object({
  timestamp: z.date(),
  connectionId: z.string(),

  // Audio Stats
  audio: z.object({
    bytesSent: z.number(),
    bytesReceived: z.number(),
    packetsSent: z.number(),
    packetsReceived: z.number(),
    packetsLost: z.number(),
    jitter: z.number(),
    roundTripTime: z.number(),
    audioLevel: z.number()
  }),

  // Network Stats
  network: z.object({
    candidateType: z.enum(['host', 'srflx', 'prflx', 'relay']),
    protocol: z.enum(['udp', 'tcp']),
    availableOutgoingBitrate: z.number(),
    availableIncomingBitrate: z.number(),
    currentRoundTripTime: z.number()
  }),

  // Quality Metrics
  quality: z.object({
    mos: z.number().min(1).max(5), // Mean Opinion Score
    connectionQuality: z.enum(['excellent', 'good', 'fair', 'poor']),
    packetLossRate: z.number()
  })
});

export type WebRTCStats = z.infer<typeof WebRTCStatsSchema>;

// SIP Configuration
export const SIPConfigSchema = z.object({
  enabled: z.boolean().default(false),
  domain: z.string().optional(),
  username: z.string().optional(),
  password: z.string().optional(),
  transport: z.enum(['UDP', 'TCP', 'TLS']).default('UDP'),
  outboundProxy: z.string().optional(),
  stunServers: z.array(z.string()).optional(),
  turnServers: z.array(z.object({
    urls: z.array(z.string()),
    username: z.string().optional(),
    credential: z.string().optional()
  })).optional()
});

export type SIPConfig = z.infer<typeof SIPConfigSchema>;