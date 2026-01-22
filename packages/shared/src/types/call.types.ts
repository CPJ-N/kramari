import { z } from 'zod';

// Call Status
export const CallStatusSchema = z.enum([
  'queued',
  'ringing',
  'in-progress',
  'completed',
  'failed',
  'no-answer',
  'busy',
  'canceled',
  'transferred'
]);

export type CallStatus = z.infer<typeof CallStatusSchema>;

// Call Direction
export const CallDirectionSchema = z.enum([
  'inbound',
  'outbound'
]);

export type CallDirection = z.infer<typeof CallDirectionSchema>;

// Call Type
export const CallTypeSchema = z.enum([
  'phone',
  'web',
  'api'
]);

export type CallType = z.infer<typeof CallTypeSchema>;

// Transcript Entry
export const TranscriptEntrySchema = z.object({
  role: z.enum(['user', 'assistant', 'system']),
  content: z.string(),
  timestamp: z.date(),
  duration: z.number().optional(),
  confidence: z.number().optional()
});

export type TranscriptEntry = z.infer<typeof TranscriptEntrySchema>;

// Call Transfer
export const CallTransferSchema = z.object({
  fromAgentId: z.string().uuid(),
  toAgentId: z.string().uuid(),
  reason: z.string(),
  context: z.record(z.any()).optional(),
  timestamp: z.date()
});

export type CallTransfer = z.infer<typeof CallTransferSchema>;

// Call Metrics
export const CallMetricsSchema = z.object({
  responseTime: z.number(), // Time to first response in ms
  talkTime: z.number(), // Total talk time in seconds
  holdTime: z.number(), // Total hold time in seconds
  silenceTime: z.number(), // Total silence time in seconds
  interruptions: z.number(),
  sentimentScore: z.number().min(-1).max(1).optional(),
  customerSatisfaction: z.number().min(1).max(5).optional()
});

export type CallMetrics = z.infer<typeof CallMetricsSchema>;

// Call Recording
export const CallRecordingSchema = z.object({
  url: z.string().url(),
  duration: z.number(),
  size: z.number(),
  format: z.enum(['mp3', 'wav', 'opus']),
  createdAt: z.date()
});

export type CallRecording = z.infer<typeof CallRecordingSchema>;

// Call Entity
export const CallSchema = z.object({
  id: z.string().uuid(),
  organizationId: z.string().uuid(),
  agentId: z.string().uuid(),
  agentInstanceId: z.string().uuid().optional(),
  userId: z.string().uuid().optional(),

  // Call Details
  direction: CallDirectionSchema,
  type: CallTypeSchema,
  status: CallStatusSchema,

  // Phone Details
  from: z.string(),
  to: z.string(),
  phoneNumberId: z.string().optional(),

  // LiveKit Details
  roomId: z.string(),
  roomName: z.string().optional(),
  participantId: z.string().optional(),

  // Timing
  queuedAt: z.date().optional(),
  startedAt: z.date(),
  answeredAt: z.date().optional(),
  endedAt: z.date().optional(),
  duration: z.number().optional(), // in seconds

  // Content
  transcript: z.array(TranscriptEntrySchema).optional(),
  summary: z.string().optional(),
  recording: CallRecordingSchema.optional(),

  // Transfers
  transfers: z.array(CallTransferSchema).optional(),

  // Metrics
  metrics: CallMetricsSchema.optional(),

  // Cost
  cost: z.object({
    telephony: z.number(),
    transcription: z.number(),
    llm: z.number(),
    tts: z.number(),
    total: z.number()
  }).optional(),

  // Metadata
  metadata: z.record(z.any()).optional(),
  tags: z.array(z.string()).optional()
});

export type Call = z.infer<typeof CallSchema>;

// Call Queue Entry
export const CallQueueEntrySchema = z.object({
  id: z.string().uuid(),
  callId: z.string().uuid(),
  agentId: z.string().uuid(),
  priority: z.number().default(0),
  queuedAt: z.date(),
  estimatedWait: z.number().optional() // in seconds
});

export type CallQueueEntry = z.infer<typeof CallQueueEntrySchema>;

// Real-time Call State (for WebSocket)
export const RealtimeCallStateSchema = z.object({
  callId: z.string().uuid(),
  status: CallStatusSchema,
  duration: z.number(),
  isMuted: z.boolean(),
  isRecording: z.boolean(),
  currentSpeaker: z.enum(['user', 'agent', 'none']),
  transcript: z.array(TranscriptEntrySchema),
  metrics: z.object({
    latency: z.number(),
    audioQuality: z.number()
  }).optional()
});

export type RealtimeCallState = z.infer<typeof RealtimeCallStateSchema>;

// Call Analytics
export const CallAnalyticsSchema = z.object({
  organizationId: z.string().uuid(),
  period: z.enum(['hour', 'day', 'week', 'month']),
  timestamp: z.date(),

  // Volume Metrics
  totalCalls: z.number(),
  inboundCalls: z.number(),
  outboundCalls: z.number(),
  completedCalls: z.number(),
  failedCalls: z.number(),

  // Performance Metrics
  averageDuration: z.number(),
  averageWaitTime: z.number(),
  averageResponseTime: z.number(),
  abandonRate: z.number(),

  // Quality Metrics
  averageSentiment: z.number(),
  averageSatisfaction: z.number().optional(),
  transferRate: z.number(),

  // Cost Metrics
  totalCost: z.number(),
  averageCostPerCall: z.number(),

  // Agent Performance
  agentUtilization: z.number(),
  concurrentCalls: z.object({
    min: z.number(),
    max: z.number(),
    avg: z.number()
  })
});

export type CallAnalytics = z.infer<typeof CallAnalyticsSchema>;