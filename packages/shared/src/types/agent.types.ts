import { z } from 'zod';

// Agent Models
export const AgentModelSchema = z.enum([
  'claude-3-opus',
  'claude-3-sonnet',
  'claude-3-haiku',
  'gpt-4',
  'gpt-4-turbo',
  'gpt-3.5-turbo'
]);

export type AgentModel = z.infer<typeof AgentModelSchema>;

// Voice Providers
export const VoiceProviderSchema = z.enum([
  'elevenlabs',
  'deepgram',
  'azure',
  'google',
  'aws-polly'
]);

export type VoiceProvider = z.infer<typeof VoiceProviderSchema>;

// Voice Models
export const VoiceModelSchema = z.enum([
  'alloy',
  'echo',
  'fable',
  'onyx',
  'nova',
  'shimmer'
]);

export type VoiceModel = z.infer<typeof VoiceModelSchema>;

// Agent Types
export const AgentTypeSchema = z.enum([
  'customer-service',
  'sales',
  'support',
  'appointment-setter',
  'lead-qualifier',
  'survey',
  'custom'
]);

export type AgentType = z.infer<typeof AgentTypeSchema>;

// Agent Status
export const AgentStatusSchema = z.enum([
  'draft',
  'testing',
  'live',
  'paused',
  'archived'
]);

export type AgentStatus = z.infer<typeof AgentStatusSchema>;

// Agent Instance Status
export const AgentInstanceStatusSchema = z.enum([
  'idle',
  'busy',
  'offline',
  'error',
  'scaling'
]);

export type AgentInstanceStatus = z.infer<typeof AgentInstanceStatusSchema>;

// Tool Configuration
export const ToolConfigSchema = z.object({
  name: z.string(),
  description: z.string(),
  parameters: z.record(z.any()),
  endpoint: z.string().optional(),
  apiKey: z.string().optional()
});

export type ToolConfig = z.infer<typeof ToolConfigSchema>;

// Transfer Rules
export const TransferRuleSchema = z.object({
  id: z.string(),
  condition: z.string(), // e.g., "intent:sales", "keyword:billing"
  targetAgent: z.string(),
  context: z.record(z.any()).optional()
});

export type TransferRule = z.infer<typeof TransferRuleSchema>;

// Agent Configuration
export const AgentConfigSchema = z.object({
  model: AgentModelSchema,
  voice: z.object({
    provider: VoiceProviderSchema,
    model: VoiceModelSchema,
    settings: z.object({
      speed: z.number().min(0.5).max(2.0).default(1.0),
      pitch: z.number().min(-2).max(2).default(0),
      temperature: z.number().min(0).max(1).default(0.7)
    }).optional()
  }),
  systemPrompt: z.string(),
  firstMessage: z.string().optional(),
  tools: z.array(ToolConfigSchema).optional(),
  transferRules: z.array(TransferRuleSchema).optional(),
  maxDuration: z.number().default(1800), // 30 minutes
  interruptionThreshold: z.number().default(0.5),
  silenceTimeout: z.number().default(10000), // 10 seconds
  endCallPhrases: z.array(z.string()).optional(),
  webhooks: z.object({
    onCallStart: z.string().url().optional(),
    onCallEnd: z.string().url().optional(),
    onTransfer: z.string().url().optional()
  }).optional()
});

export type AgentConfig = z.infer<typeof AgentConfigSchema>;

// Agent Entity
export const AgentSchema = z.object({
  id: z.string().uuid(),
  organizationId: z.string().uuid(),
  name: z.string(),
  description: z.string().optional(),
  type: AgentTypeSchema,
  status: AgentStatusSchema,
  config: AgentConfigSchema,
  phoneNumbers: z.array(z.string()).optional(),
  maxConcurrentCalls: z.number().default(10),
  currentCalls: z.number().default(0),
  totalCalls: z.number().default(0),
  averageCallDuration: z.number().optional(),
  createdAt: z.date(),
  updatedAt: z.date(),
  lastActiveAt: z.date().optional()
});

export type Agent = z.infer<typeof AgentSchema>;

// Agent Instance (runtime)
export const AgentInstanceSchema = z.object({
  id: z.string().uuid(),
  agentId: z.string().uuid(),
  status: AgentInstanceStatusSchema,
  roomId: z.string().optional(),
  callId: z.string().uuid().optional(),
  startedAt: z.date(),
  lastPingAt: z.date(),
  metrics: z.object({
    cpu: z.number(),
    memory: z.number(),
    activeCalls: z.number()
  }).optional()
});

export type AgentInstance = z.infer<typeof AgentInstanceSchema>;

// Agent Pool Configuration
export const AgentPoolConfigSchema = z.object({
  agentId: z.string().uuid(),
  minInstances: z.number().default(1),
  maxInstances: z.number().default(10),
  targetUtilization: z.number().default(0.7),
  scaleUpThreshold: z.number().default(0.8),
  scaleDownThreshold: z.number().default(0.3),
  cooldownPeriod: z.number().default(60) // seconds
});

export type AgentPoolConfig = z.infer<typeof AgentPoolConfigSchema>;

// Agent Metrics
export const AgentMetricsSchema = z.object({
  agentId: z.string().uuid(),
  timestamp: z.date(),
  callsHandled: z.number(),
  averageResponseTime: z.number(),
  averageCallDuration: z.number(),
  successRate: z.number(),
  transferRate: z.number(),
  errorRate: z.number(),
  sentimentScore: z.number().optional()
});

export type AgentMetrics = z.infer<typeof AgentMetricsSchema>;

// Agent Template
export const AgentTemplateSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
  category: AgentTypeSchema,
  thumbnail: z.string().url().optional(),
  config: AgentConfigSchema,
  prompts: z.object({
    system: z.string(),
    examples: z.array(z.object({
      user: z.string(),
      assistant: z.string()
    })).optional()
  }),
  requiredEnvVars: z.array(z.string()).optional(),
  popular: z.boolean().default(false),
  deployCount: z.number().default(0),
  rating: z.number().min(0).max(5).optional()
});

export type AgentTemplate = z.infer<typeof AgentTemplateSchema>;