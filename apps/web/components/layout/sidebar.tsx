'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion } from 'framer-motion'
import {
  LayoutDashboard,
  Users,
  Phone,
  BarChart3,
  Settings,
  FileCode,
  Headphones,
  Globe,
  Zap,
} from 'lucide-react'

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Agents', href: '/dashboard/agents', icon: Users },
  { name: 'Calls', href: '/dashboard/calls', icon: Phone },
  { name: 'Analytics', href: '/dashboard/analytics', icon: BarChart3 },
  { name: 'Templates', href: '/dashboard/templates', icon: FileCode },
  { name: 'Voice Test', href: '/dashboard/test', icon: Headphones },
  { name: 'API', href: '/dashboard/api', icon: Globe },
  { name: 'Settings', href: '/dashboard/settings', icon: Settings },
]

export function Sidebar() {
  const pathname = usePathname()

  return (
    <div className="fixed inset-y-0 left-0 w-64 bg-kramari-cream dark:bg-kramari-dark border-r border-kramari-taupe/20 dark:border-kramari-charcoal/20">
      <div className="flex flex-col h-full">
        {/* Logo */}
        <div className="px-6 py-6 border-b border-kramari-taupe/20 dark:border-kramari-charcoal/20">
          <Link href="/dashboard" className="flex items-center gap-3">
            <div className="h-10 w-10 bg-gradient-to-br from-kramari-charcoal to-kramari-muted rounded-xl flex items-center justify-center">
              <Zap className="h-6 w-6 text-white" />
            </div>
            <span className="text-xl font-bold text-gradient-kramari">
              Kramari
            </span>
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-4 space-y-1 overflow-y-auto">
          {navigation.map((item) => {
            const isActive = pathname === item.href
            return (
              <Link
                key={item.name}
                href={item.href}
                className="relative block"
              >
                <motion.div
                  className={`
                    flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-300
                    ${
                      isActive
                        ? 'bg-gradient-to-r from-kramari-charcoal to-kramari-muted text-white'
                        : 'text-kramari-charcoal dark:text-kramari-taupe hover:bg-kramari-taupe/10 dark:hover:bg-kramari-charcoal/20'
                    }
                  `}
                  whileHover={{ x: isActive ? 0 : 4 }}
                  transition={{ duration: 0.2 }}
                >
                  <item.icon className="h-5 w-5" />
                  {item.name}
                </motion.div>
              </Link>
            )
          })}
        </nav>

        {/* Bottom section */}
        <div className="p-4 border-t border-kramari-taupe/20 dark:border-kramari-charcoal/20">
          <div className="px-3 py-2">
            <p className="text-xs text-kramari-muted">Version 0.1.0</p>
            <a
              href="https://github.com/kramari/kramari"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-kramari-charcoal dark:text-kramari-taupe hover:text-kramari-muted transition-colors"
            >
              View on GitHub
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
