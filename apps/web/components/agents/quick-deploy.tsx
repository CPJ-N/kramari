'use client'

import { useState } from 'react'
import { Users, Phone, Calendar, ShoppingCart, Headphones, FileText } from 'lucide-react'
import { useRouter } from 'next/navigation'

const templates = [
  {
    id: 'customer-service',
    name: 'Customer Service',
    description: 'Handle support inquiries 24/7',
    icon: Headphones,
    color: 'bg-blue-100 text-blue-600',
  },
  {
    id: 'sales-qualifier',
    name: 'Sales Qualifier',
    description: 'Qualify leads automatically',
    icon: ShoppingCart,
    color: 'bg-green-100 text-green-600',
  },
  {
    id: 'appointment-setter',
    name: 'Appointment Setter',
    description: 'Book meetings effortlessly',
    icon: Calendar,
    color: 'bg-purple-100 text-purple-600',
  },
  {
    id: 'support-agent',
    name: 'Support Agent',
    description: 'Technical support specialist',
    icon: Users,
    color: 'bg-orange-100 text-orange-600',
  },
  {
    id: 'order-taker',
    name: 'Order Taker',
    description: 'Take orders over the phone',
    icon: Phone,
    color: 'bg-pink-100 text-pink-600',
  },
  {
    id: 'survey-conductor',
    name: 'Survey Conductor',
    description: 'Conduct customer surveys',
    icon: FileText,
    color: 'bg-indigo-100 text-indigo-600',
  },
]

export function QuickDeploy() {
  const [deploying, setDeploying] = useState<string | null>(null)
  const [deployedAgent, setDeployedAgent] = useState<any>(null)
  const router = useRouter()

  const handleDeploy = async (templateId: string) => {
    setDeploying(templateId)

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/agents/quick-deploy`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ templateId }),
        }
      )

      const data = await response.json()
      setDeployedAgent(data)

      // Show success message
      setTimeout(() => {
        router.push(`/dashboard/agents/${data.agentId}`)
      }, 2000)
    } catch (error) {
      console.error('Deploy failed:', error)
      alert('Failed to deploy agent. Please try again.')
    } finally {
      setDeploying(null)
    }
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
      <div className="p-6 border-b border-gray-200 dark:border-gray-700">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
          Quick Deploy
        </h2>
        <p className="text-gray-600 dark:text-gray-300 mt-1">
          Deploy a pre-configured agent in seconds
        </p>
      </div>

      {deployedAgent && (
        <div className="p-4 bg-green-50 dark:bg-green-900/20 border-b border-green-200 dark:border-green-800">
          <p className="text-green-800 dark:text-green-300">
            ✓ Agent deployed successfully! Phone: {deployedAgent.phoneNumber}
          </p>
        </div>
      )}

      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {templates.map((template) => (
            <button
              key={template.id}
              onClick={() => handleDeploy(template.id)}
              disabled={deploying !== null}
              className={`
                p-4 rounded-lg border transition-all text-left
                ${deploying === template.id
                  ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                  : 'border-gray-200 dark:border-gray-700 hover:border-blue-500 hover:shadow-md'
                }
                ${deploying !== null && deploying !== template.id ? 'opacity-50' : ''}
              `}
            >
              <div className="flex items-start gap-3">
                <div className={`p-2 rounded-lg ${template.color}`}>
                  <template.icon className="h-5 w-5" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 dark:text-white">
                    {template.name}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                    {template.description}
                  </p>
                </div>
              </div>

              {deploying === template.id && (
                <div className="mt-3">
                  <div className="flex items-center gap-2 text-sm text-blue-600">
                    <div className="animate-spin h-4 w-4 border-2 border-blue-600 border-t-transparent rounded-full" />
                    Deploying...
                  </div>
                </div>
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}