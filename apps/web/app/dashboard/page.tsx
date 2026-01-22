'use client'

import { QuickDeploy } from '@/components/agents/quick-deploy'
import { AgentsList } from '@/components/agents/agents-list'
import { CallMetrics } from '@/components/analytics/call-metrics'
import { Phone, Users, TrendingUp, Clock } from 'lucide-react'

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
        <p className="text-gray-600 dark:text-gray-300 mt-2">
          Manage your voice agents and monitor performance
        </p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          {
            label: 'Active Agents',
            value: '12',
            change: '+2',
            icon: Users,
            color: 'text-blue-600',
            bgColor: 'bg-blue-100',
          },
          {
            label: 'Total Calls',
            value: '1,234',
            change: '+15%',
            icon: Phone,
            color: 'text-green-600',
            bgColor: 'bg-green-100',
          },
          {
            label: 'Avg Duration',
            value: '3:45',
            change: '-12s',
            icon: Clock,
            color: 'text-purple-600',
            bgColor: 'bg-purple-100',
          },
          {
            label: 'Success Rate',
            value: '94%',
            change: '+2%',
            icon: TrendingUp,
            color: 'text-orange-600',
            bgColor: 'bg-orange-100',
          },
        ].map((stat) => (
          <div
            key={stat.label}
            className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">{stat.label}</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                  {stat.value}
                </p>
                <p className="text-sm text-green-600 mt-2">{stat.change}</p>
              </div>
              <div className={`${stat.bgColor} p-3 rounded-lg`}>
                <stat.icon className={`h-6 w-6 ${stat.color}`} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Deploy Section */}
      <QuickDeploy />

      {/* Recent Agents */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            Recent Agents
          </h2>
        </div>
        <AgentsList limit={5} />
      </div>

      {/* Call Metrics Chart */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
          Call Volume (Last 7 Days)
        </h2>
        <CallMetrics />
      </div>
    </div>
  )
}