'use client'

import { Bell, Search, User } from 'lucide-react'
import { ThemeToggle } from '@/components/ui/theme-toggle'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

export function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 z-40 bg-kramari-cream/95 dark:bg-kramari-dark/95 backdrop-blur-md border-b border-kramari-taupe/20 dark:border-kramari-charcoal/20">
      <div className="px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Search */}
          <div className="flex-1 max-w-lg">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-kramari-muted" />
              <Input
                type="search"
                placeholder="Search agents, calls, templates..."
                className="w-full pl-10"
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2 ml-4">
            {/* Dark mode toggle */}
            <ThemeToggle />

            {/* Notifications */}
            <Button variant="ghost" size="icon" className="relative h-9 w-9">
              <Bell className="h-4 w-4" />
              <span className="absolute top-1 right-1 h-2 w-2 bg-red-500 rounded-full" />
              <span className="sr-only">Notifications</span>
            </Button>

            {/* User menu */}
            <Button variant="ghost" size="icon" className="h-9 w-9">
              <div className="h-7 w-7 bg-gradient-to-br from-kramari-muted to-kramari-taupe rounded-full flex items-center justify-center">
                <User className="h-4 w-4 text-white" />
              </div>
              <span className="sr-only">User menu</span>
            </Button>
          </div>
        </div>
      </div>
    </header>
  )
}
