'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Phone, Activity, MoreVertical, Edit, Trash2, Pause, Play } from 'lucide-react'

interface Agent {
  id: string
  name: string
  type: string
  status: 'live' | 'paused' | 'draft'
  phoneNumber?: string
  currentCalls: number
  totalCalls: number
  lastActiveAt?: string
}

export function AgentsList({ limit }: { limit?: number }) {
  const [agents, setAgents] = useState<Agent[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Mock data - replace with actual API call
    const mockAgents: Agent[] = [
      {
        id: '1',
        name: 'Customer Support Agent',
        type: 'customer-service',
        status: 'live',
        phoneNumber: '+1-555-0100',
        currentCalls: 2,
        totalCalls: 156,
        lastActiveAt: '2 minutes ago',
      },
      {
        id: '2',
        name: 'Sales Qualifier Bot',
        type: 'sales',
        status: 'live',
        phoneNumber: '+1-555-0101',
        currentCalls: 1,
        totalCalls: 89,
        lastActiveAt: '5 minutes ago',
      },
      {
        id: '3',
        name: 'Appointment Scheduler',
        type: 'appointment-setter',
        status: 'paused',
        phoneNumber: '+1-555-0102',
        currentCalls: 0,
        totalCalls: 234,
        lastActiveAt: '1 hour ago',
      },
      {
        id: '4',
        name: 'Technical Support',
        type: 'support',
        status: 'live',
        phoneNumber: '+1-555-0103',
        currentCalls: 3,
        totalCalls: 412,
        lastActiveAt: 'Just now',
      },
      {
        id: '5',
        name: 'Order Processing',
        type: 'custom',
        status: 'draft',
        phoneNumber: undefined,
        currentCalls: 0,
        totalCalls: 0,
        lastActiveAt: undefined,
      },
    ]

    setTimeout(() => {
      setAgents(limit ? mockAgents.slice(0, limit) : mockAgents)
      setLoading(false)
    }, 500)
  }, [limit])

  const getStatusColor = (status: Agent['status']) => {
    switch (status) {
      case 'live':
        return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
      case 'paused':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400'
      case 'draft':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400'
    }
  }

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-16 bg-gray-200 dark:bg-gray-700 rounded-lg" />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead className="bg-gray-50 dark:bg-gray-700">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
              Agent
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
              Status
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
              Phone
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
              Active Calls
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
              Total Calls
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
              Last Active
            </th>
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
          {agents.map((agent) => (
            <tr key={agent.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
              <td className="px-6 py-4 whitespace-nowrap">
                <Link
                  href={`/dashboard/agents/${agent.id}`}
                  className="text-sm font-medium text-gray-900 dark:text-white hover:text-blue-600"
                >
                  {agent.name}
                </Link>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  {agent.type}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span
                  className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(
                    agent.status
                  )}`}
                >
                  {agent.status}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-300">
                {agent.phoneNumber || '-'}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center gap-2 text-sm">
                  {agent.currentCalls > 0 ? (
                    <>
                      <Activity className="h-4 w-4 text-green-500 animate-pulse" />
                      <span className="text-gray-900 dark:text-white">
                        {agent.currentCalls}
                      </span>
                    </>
                  ) : (
                    <span className="text-gray-500 dark:text-gray-400">0</span>
                  )}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-300">
                {agent.totalCalls}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                {agent.lastActiveAt || '-'}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-right">
                <div className="flex items-center justify-end gap-2">
                  {agent.status === 'live' ? (
                    <button className="p-1 text-gray-600 hover:text-orange-600">
                      <Pause className="h-4 w-4" />
                    </button>
                  ) : agent.status === 'paused' ? (
                    <button className="p-1 text-gray-600 hover:text-green-600">
                      <Play className="h-4 w-4" />
                    </button>
                  ) : null}
                  <button className="p-1 text-gray-600 hover:text-blue-600">
                    <Edit className="h-4 w-4" />
                  </button>
                  <button className="p-1 text-gray-600 hover:text-red-600">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}