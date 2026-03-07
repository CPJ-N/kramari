import {
  Headphones,
  ShoppingCart,
  Calendar,
  Users,
  Phone,
  FileText,
  type LucideIcon,
} from 'lucide-react'

export interface AgentTemplate {
  id: string
  name: string
  description: string
  icon: LucideIcon
  color: string
}

export const AGENT_TEMPLATES: AgentTemplate[] = [
  {
    id: 'customer-service',
    name: 'Customer Service',
    description: 'Handle support inquiries 24/7',
    icon: Headphones,
    color: 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400',
  },
  {
    id: 'sales-qualifier',
    name: 'Sales Qualifier',
    description: 'Qualify leads automatically',
    icon: ShoppingCart,
    color: 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400',
  },
  {
    id: 'appointment-setter',
    name: 'Appointment Setter',
    description: 'Book meetings effortlessly',
    icon: Calendar,
    color: 'bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400',
  },
  {
    id: 'support-agent',
    name: 'Support Agent',
    description: 'Technical support specialist',
    icon: Users,
    color: 'bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400',
  },
  {
    id: 'order-taker',
    name: 'Order Taker',
    description: 'Take orders over the phone',
    icon: Phone,
    color: 'bg-pink-100 text-pink-600 dark:bg-pink-900/30 dark:text-pink-400',
  },
  {
    id: 'survey-conductor',
    name: 'Survey Conductor',
    description: 'Conduct customer surveys',
    icon: FileText,
    color: 'bg-indigo-100 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400',
  },
]
