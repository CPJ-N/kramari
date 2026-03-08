'use client'

import { motion } from 'framer-motion'
import {
  Clock,
  CloudSun,
  PhoneForwarded,
  Calendar,
  UserSearch,
  MessageSquare,
  Ticket,
  CalendarPlus,
} from 'lucide-react'
import { useBuilderStore } from '../builder-store'

const TOOL_ICONS: Record<string, any> = {
  get_current_time: Clock,
  get_weather: CloudSun,
  transfer_call: PhoneForwarded,
  check_calendar: Calendar,
  lookup_customer: UserSearch,
  send_sms: MessageSquare,
  create_ticket: Ticket,
  book_appointment: CalendarPlus,
}

export function ToolsStep() {
  const { config, toggleTool } = useBuilderStore()

  return (
    <div className="space-y-8 max-w-3xl mx-auto">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-kramari-charcoal dark:text-kramari-taupe">
          Tools & Actions
        </h2>
        <p className="text-kramari-muted mt-1">
          Choose what your agent can do during calls
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {config.tools.map((tool, i) => {
          const Icon = TOOL_ICONS[tool.id] || Clock
          return (
            <motion.button
              key={tool.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04 }}
              onClick={() => toggleTool(tool.id)}
              className={`flex items-start gap-3 p-4 rounded-xl border text-left transition-all ${
                tool.enabled
                  ? 'border-kramari-charcoal dark:border-kramari-taupe bg-kramari-charcoal/5 dark:bg-kramari-taupe/5'
                  : 'border-kramari-taupe/20 dark:border-kramari-charcoal/30 hover:border-kramari-muted/40'
              }`}
            >
              <div className={`shrink-0 p-2 rounded-lg transition-colors ${
                tool.enabled
                  ? 'bg-gradient-to-br from-kramari-charcoal to-kramari-muted text-white'
                  : 'bg-kramari-taupe/10 dark:bg-kramari-charcoal/20 text-kramari-muted'
              }`}>
                <Icon className="h-5 w-5" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <p className="font-medium text-sm text-kramari-charcoal dark:text-kramari-taupe">
                    {tool.name}
                  </p>
                  <div className={`shrink-0 h-5 w-9 rounded-full transition-colors relative ${
                    tool.enabled
                      ? 'bg-kramari-charcoal dark:bg-kramari-taupe'
                      : 'bg-kramari-taupe/30 dark:bg-kramari-charcoal/40'
                  }`}>
                    <motion.div
                      className="absolute top-0.5 h-4 w-4 rounded-full bg-white shadow-sm"
                      animate={{ left: tool.enabled ? 18 : 2 }}
                      transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                    />
                  </div>
                </div>
                <p className="text-xs text-kramari-muted mt-0.5">{tool.description}</p>
              </div>
            </motion.button>
          )
        })}
      </div>

      <div className="text-center">
        <p className="text-xs text-kramari-muted">
          {(() => { const c = config.tools.filter(t => t.enabled).length; return `${c} tool${c !== 1 ? 's' : ''} enabled` })()}
        </p>
      </div>
    </div>
  )
}
