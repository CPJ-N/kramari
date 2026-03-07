import { create } from 'zustand'

export interface AgentTool {
  id: string
  name: string
  description: string
  enabled: boolean
  config?: Record<string, any>
}

export interface KnowledgeEntry {
  id: string
  type: 'faq' | 'document'
  question?: string
  answer?: string
  fileName?: string
  content?: string
}

export interface AgentConfig {
  name: string
  description: string
  type: string
  personality: string
  firstMessage: string
  voice: string
  voiceProvider: string
  language: string
  systemPrompt: string
  model: string
  temperature: number
  maxConcurrentCalls: number
  maxCallDuration: number
  tools: AgentTool[]
  knowledgeBase: KnowledgeEntry[]
}

export type BuilderStep =
  | 'start'
  | 'identity'
  | 'voice'
  | 'behavior'
  | 'tools'
  | 'knowledge'
  | 'review'

export const BUILDER_STEPS: { id: BuilderStep; label: string }[] = [
  { id: 'start', label: 'Start' },
  { id: 'identity', label: 'Identity' },
  { id: 'voice', label: 'Voice' },
  { id: 'behavior', label: 'Behavior' },
  { id: 'tools', label: 'Tools' },
  { id: 'knowledge', label: 'Knowledge' },
  { id: 'review', label: 'Review' },
]

const DEFAULT_TOOLS: AgentTool[] = [
  { id: 'get_current_time', name: 'Get Current Time', description: 'Returns the current date and time', enabled: false },
  { id: 'get_weather', name: 'Get Weather', description: 'Gets weather for a given location', enabled: false },
  { id: 'transfer_call', name: 'Transfer Call', description: 'Transfers the call to a human agent', enabled: false },
  { id: 'check_calendar', name: 'Check Calendar', description: 'Checks availability on a calendar', enabled: false },
  { id: 'lookup_customer', name: 'Lookup Customer', description: 'Looks up customer info by phone or email', enabled: false },
  { id: 'send_sms', name: 'Send SMS', description: 'Sends an SMS message to a phone number', enabled: false },
  { id: 'create_ticket', name: 'Create Ticket', description: 'Creates a support ticket in your helpdesk', enabled: false },
  { id: 'book_appointment', name: 'Book Appointment', description: 'Books an appointment on a calendar', enabled: false },
]

const DEFAULT_CONFIG: AgentConfig = {
  name: '',
  description: '',
  type: 'custom',
  personality: '',
  firstMessage: '',
  voice: 'alloy',
  voiceProvider: 'elevenlabs',
  language: 'en',
  systemPrompt: '',
  model: 'claude-3-sonnet',
  temperature: 0.7,
  maxConcurrentCalls: 10,
  maxCallDuration: 1800,
  tools: DEFAULT_TOOLS,
  knowledgeBase: [],
}

interface ChatMessage {
  role: 'assistant' | 'user'
  content: string
}

interface BuilderState {
  currentStep: BuilderStep
  config: AgentConfig
  isGenerating: boolean
  chatMode: boolean
  chatMessages: ChatMessage[]
  direction: 1 | -1

  setStep: (step: BuilderStep) => void
  nextStep: () => void
  prevStep: () => void
  updateConfig: (partial: Partial<AgentConfig>) => void
  setFromAIResponse: (config: Partial<AgentConfig>) => void
  toggleTool: (toolId: string) => void
  addKnowledgeEntry: (entry: KnowledgeEntry) => void
  removeKnowledgeEntry: (id: string) => void
  updateKnowledgeEntry: (id: string, updates: Partial<KnowledgeEntry>) => void
  setGenerating: (v: boolean) => void
  setChatMode: (v: boolean) => void
  addChatMessage: (msg: ChatMessage) => void
  resetBuilder: () => void
}

export const useBuilderStore = create<BuilderState>((set, get) => ({
  currentStep: 'start',
  config: { ...DEFAULT_CONFIG },
  isGenerating: false,
  chatMode: false,
  chatMessages: [],
  direction: 1,

  setStep: (step) => {
    const currentIndex = BUILDER_STEPS.findIndex(s => s.id === get().currentStep)
    const nextIndex = BUILDER_STEPS.findIndex(s => s.id === step)
    set({ currentStep: step, direction: nextIndex > currentIndex ? 1 : -1 })
  },

  nextStep: () => {
    const idx = BUILDER_STEPS.findIndex(s => s.id === get().currentStep)
    if (idx < BUILDER_STEPS.length - 1) {
      set({ currentStep: BUILDER_STEPS[idx + 1].id, direction: 1 })
    }
  },

  prevStep: () => {
    const idx = BUILDER_STEPS.findIndex(s => s.id === get().currentStep)
    if (idx > 0) {
      set({ currentStep: BUILDER_STEPS[idx - 1].id, direction: -1 })
    }
  },

  updateConfig: (partial) =>
    set((state) => ({ config: { ...state.config, ...partial } })),

  setFromAIResponse: (aiConfig) =>
    set((state) => {
      const merged = { ...state.config, ...aiConfig }
      if (aiConfig.tools) {
        merged.tools = state.config.tools.map(tool => {
          const aiTool = (aiConfig.tools || []).find(t => t.id === tool.id)
          return aiTool ? { ...tool, enabled: true, config: aiTool.config } : tool
        })
      }
      return { config: merged }
    }),

  toggleTool: (toolId) =>
    set((state) => ({
      config: {
        ...state.config,
        tools: state.config.tools.map(t =>
          t.id === toolId ? { ...t, enabled: !t.enabled } : t
        ),
      },
    })),

  addKnowledgeEntry: (entry) =>
    set((state) => ({
      config: {
        ...state.config,
        knowledgeBase: [...state.config.knowledgeBase, entry],
      },
    })),

  removeKnowledgeEntry: (id) =>
    set((state) => ({
      config: {
        ...state.config,
        knowledgeBase: state.config.knowledgeBase.filter(e => e.id !== id),
      },
    })),

  updateKnowledgeEntry: (id, updates) =>
    set((state) => ({
      config: {
        ...state.config,
        knowledgeBase: state.config.knowledgeBase.map(e =>
          e.id === id ? { ...e, ...updates } : e
        ),
      },
    })),

  setGenerating: (v) => set({ isGenerating: v }),
  setChatMode: (v) => set({ chatMode: v }),
  addChatMessage: (msg) =>
    set((state) => ({ chatMessages: [...state.chatMessages, msg] })),
  resetBuilder: () =>
    set({
      currentStep: 'start',
      config: { ...DEFAULT_CONFIG },
      isGenerating: false,
      chatMode: false,
      chatMessages: [],
      direction: 1,
    }),
}))
