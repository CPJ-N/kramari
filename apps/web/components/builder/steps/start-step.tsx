'use client'

import { useState, useRef, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
  Sparkles,
  MessageSquare,
  ArrowRight,
  Loader2,
  Send,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { apiPost } from '@/lib/api'
import { AGENT_TEMPLATES } from '@/lib/templates'
import { useBuilderStore } from '../builder-store'

export function StartStep() {
  const [description, setDescription] = useState('')
  const {
    isGenerating,
    setGenerating,
    setFromAIResponse,
    updateConfig,
    nextStep,
    chatMode,
    setChatMode,
    chatMessages,
    addChatMessage,
  } = useBuilderStore()
  const [chatInput, setChatInput] = useState('')
  const chatEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [chatMessages])

  const handleTemplateSelect = (templateId: string) => {
    const template = AGENT_TEMPLATES.find(t => t.id === templateId)
    if (!template) return
    updateConfig({
      type: templateId,
      name: `${template.name} Agent`,
      description: template.description,
    })
    nextStep()
  }

  const handleGenerate = async () => {
    if (!description.trim()) return
    setGenerating(true)
    try {
      const data = await apiPost('/agents/ai/generate-config', { description })
      setFromAIResponse(data)
      nextStep()
    } catch (err) {
      console.error('AI generation failed:', err)
    } finally {
      setGenerating(false)
    }
  }

  const handleStartChat = () => {
    setChatMode(true)
    addChatMessage({
      role: 'assistant',
      content:
        "Hi! I'll help you build your voice agent step by step. What kind of agent are you looking to create? For example: a receptionist, a sales rep, a support agent, etc.",
    })
  }

  const handleChatSend = async () => {
    if (!chatInput.trim()) return
    const userMsg = chatInput.trim()
    setChatInput('')
    addChatMessage({ role: 'user', content: userMsg })
    setGenerating(true)

    try {
      const data = await apiPost('/agents/ai/generate-config', {
        description: userMsg,
        chatHistory: [...chatMessages, { role: 'user', content: userMsg }],
      })

      if (data.followUp) {
        addChatMessage({ role: 'assistant', content: data.followUp })
      }

      if (data.config) {
        setFromAIResponse(data.config)
        addChatMessage({
          role: 'assistant',
          content:
            "I've configured your agent based on our conversation. Click 'Next' to review and customize each setting.",
        })
      }
    } catch (err) {
      addChatMessage({
        role: 'assistant',
        content: 'Something went wrong. Could you try describing your agent again?',
      })
    } finally {
      setGenerating(false)
    }
  }

  if (chatMode) {
    return (
      <div className="space-y-6">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-kramari-charcoal dark:text-kramari-taupe">
            Build with AI Assistant
          </h2>
          <p className="text-kramari-muted mt-1">
            Describe your agent and I'll help configure it
          </p>
        </div>

        <div className="max-w-2xl mx-auto bg-white dark:bg-kramari-dark/50 rounded-2xl border border-kramari-taupe/20 dark:border-kramari-charcoal/30 overflow-hidden">
          <div className="h-80 overflow-y-auto p-4 space-y-3">
            {chatMessages.map((msg, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-sm ${
                    msg.role === 'user'
                      ? 'bg-gradient-to-r from-kramari-charcoal to-kramari-muted text-white'
                      : 'bg-kramari-cream dark:bg-kramari-charcoal/30 text-kramari-charcoal dark:text-kramari-taupe'
                  }`}
                >
                  {msg.content}
                </div>
              </motion.div>
            ))}
            {isGenerating && (
              <div className="flex justify-start">
                <div className="bg-kramari-cream dark:bg-kramari-charcoal/30 rounded-2xl px-4 py-2.5">
                  <Loader2 className="h-4 w-4 animate-spin text-kramari-muted" />
                </div>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          <div className="border-t border-kramari-taupe/20 dark:border-kramari-charcoal/30 p-3 flex gap-2">
            <input
              type="text"
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && handleChatSend()}
              placeholder="Describe your agent..."
              disabled={isGenerating}
              className="flex-1 bg-transparent border-none outline-none text-sm text-kramari-charcoal dark:text-kramari-taupe placeholder:text-kramari-muted/50"
            />
            <Button
              size="icon"
              onClick={handleChatSend}
              disabled={!chatInput.trim() || isGenerating}
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="text-center">
          <button
            onClick={() => setChatMode(false)}
            className="text-sm text-kramari-muted hover:text-kramari-charcoal dark:hover:text-kramari-taupe transition-colors"
          >
            Back to templates
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-kramari-charcoal dark:text-kramari-taupe">
          How would you like to start?
        </h2>
        <p className="text-kramari-muted mt-1">
          Pick a template, describe your agent, or build with AI guidance
        </p>
      </div>

      {/* AI Description Input */}
      <div className="max-w-2xl mx-auto space-y-3">
        <div className="relative">
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe the agent you want to build... e.g. 'A friendly dental office receptionist that books appointments, answers questions about services, and speaks both English and Spanish'"
            rows={4}
            className="w-full rounded-2xl border border-kramari-taupe/20 dark:border-kramari-charcoal/30 bg-white dark:bg-kramari-dark/50 px-4 py-3 text-sm text-kramari-charcoal dark:text-kramari-taupe placeholder:text-kramari-muted/50 focus:outline-none focus:ring-2 focus:ring-kramari-charcoal dark:focus:ring-kramari-taupe resize-none transition-all"
          />
        </div>
        <div className="flex gap-2 justify-center">
          <Button onClick={handleGenerate} disabled={!description.trim() || isGenerating} size="lg">
            {isGenerating ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <Sparkles className="h-4 w-4 mr-2" />
            )}
            Generate with AI
          </Button>
          <Button variant="outline" onClick={handleStartChat} size="lg">
            <MessageSquare className="h-4 w-4 mr-2" />
            Guided Chat
          </Button>
        </div>
      </div>

      {/* Divider */}
      <div className="flex items-center gap-4 max-w-2xl mx-auto">
        <div className="flex-1 h-px bg-kramari-taupe/20 dark:bg-kramari-charcoal/30" />
        <span className="text-sm text-kramari-muted">or start from a template</span>
        <div className="flex-1 h-px bg-kramari-taupe/20 dark:bg-kramari-charcoal/30" />
      </div>

      {/* Template Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 max-w-3xl mx-auto">
        {AGENT_TEMPLATES.map((template, i) => (
          <motion.button
            key={template.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            onClick={() => handleTemplateSelect(template.id)}
            className="group p-4 rounded-xl border border-kramari-taupe/20 dark:border-kramari-charcoal/30 bg-white dark:bg-kramari-dark/50 text-left hover:border-kramari-charcoal/40 dark:hover:border-kramari-taupe/40 hover:shadow-md transition-all"
          >
            <div className="flex items-start gap-3">
              <div className={`p-2 rounded-lg ${template.color}`}>
                <template.icon className="h-5 w-5" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-sm text-kramari-charcoal dark:text-kramari-taupe">
                  {template.name}
                </h3>
                <p className="text-xs text-kramari-muted mt-0.5">
                  {template.description}
                </p>
              </div>
              <ArrowRight className="h-4 w-4 text-kramari-muted opacity-0 group-hover:opacity-100 transition-opacity mt-0.5" />
            </div>
          </motion.button>
        ))}
      </div>

      {/* Blank start */}
      <div className="text-center">
        <button
          onClick={() => nextStep()}
          className="text-sm text-kramari-muted hover:text-kramari-charcoal dark:hover:text-kramari-taupe transition-colors"
        >
          Start from scratch →
        </button>
      </div>
    </div>
  )
}
