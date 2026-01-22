import Link from 'next/link'
import { ArrowRight, Phone, Zap, Shield, Code2, Users, Globe } from 'lucide-react'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
          <div className="text-center">
            <h1 className="text-5xl md:text-7xl font-bold text-gray-900 dark:text-white mb-6">
              Voice AI <span className="text-blue-600">Made Simple</span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto">
              Deploy production-ready AI voice agents in seconds.
              Open-source, self-hosted, no vendor lock-in.
            </p>
            <div className="flex gap-4 justify-center">
              <Link
                href="/dashboard"
                className="inline-flex items-center px-8 py-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-lg font-semibold"
              >
                Start Building
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
              <a
                href="https://github.com/kramari/kramari"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center px-8 py-4 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors text-lg font-semibold dark:bg-gray-700 dark:hover:bg-gray-600"
              >
                <Code2 className="mr-2 h-5 w-5" />
                View on GitHub
              </a>
            </div>
          </div>
        </div>

        {/* Animated background elements */}
        <div className="absolute inset-0 -z-10 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-500 rounded-full opacity-10 animate-pulse" />
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-500 rounded-full opacity-10 animate-pulse" />
        </div>
      </div>

      {/* Quick Deploy Section */}
      <div className="py-16 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Deploy in 10 Seconds
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300">
              Choose a template, click deploy, get a phone number. It's that simple.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: 'Customer Service',
                description: 'Handle support inquiries 24/7',
                icon: Users,
              },
              {
                title: 'Sales Qualifier',
                description: 'Qualify leads automatically',
                icon: Phone,
              },
              {
                title: 'Appointment Setter',
                description: 'Book meetings effortlessly',
                icon: Zap,
              },
            ].map((template) => (
              <div
                key={template.title}
                className="p-6 border border-gray-200 dark:border-gray-700 rounded-lg hover:border-blue-500 transition-colors cursor-pointer"
              >
                <template.icon className="h-12 w-12 text-blue-600 mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  {template.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  {template.description}
                </p>
                <button className="text-blue-600 hover:text-blue-700 font-semibold">
                  Deploy Now →
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-16 bg-gray-50 dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Everything You Need
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300">
              Built with the best technologies for reliable voice AI at scale
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: Globe,
                title: 'Multi-Agent Support',
                description: 'Deploy and manage unlimited agents with intelligent routing',
              },
              {
                icon: Shield,
                title: 'Self-Hosted',
                description: 'Your data, your infrastructure, complete control',
              },
              {
                icon: Zap,
                title: 'Real-Time Voice',
                description: 'Powered by LiveKit for ultra-low latency conversations',
              },
              {
                icon: Code2,
                title: 'Claude AI',
                description: 'Advanced language understanding with Anthropic Claude',
              },
              {
                icon: Phone,
                title: 'Phone Integration',
                description: 'Twilio SIP trunks for inbound and outbound calls',
              },
              {
                icon: Users,
                title: 'Open Source',
                description: 'MIT licensed, customize and extend as needed',
              },
            ].map((feature) => (
              <div key={feature.title} className="flex gap-4">
                <feature.icon className="h-6 w-6 text-blue-600 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    {feature.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-20 bg-blue-600">
        <div className="max-w-4xl mx-auto text-center px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Ready to build voice AI?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Join thousands of developers building the future of voice
          </p>
          <div className="flex gap-4 justify-center">
            <Link
              href="/dashboard"
              className="inline-flex items-center px-8 py-4 bg-white text-blue-600 rounded-lg hover:bg-gray-100 transition-colors text-lg font-semibold"
            >
              Get Started Free
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
            <a
              href="/docs"
              className="inline-flex items-center px-8 py-4 bg-blue-700 text-white rounded-lg hover:bg-blue-800 transition-colors text-lg font-semibold"
            >
              Read Docs
            </a>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-lg font-bold text-white">Kramari</p>
              <p className="mt-2">Voice AI made simple. No lock-in. No limits.</p>
            </div>
            <div className="flex gap-6">
              <a href="https://github.com/kramari/kramari" className="hover:text-white">
                GitHub
              </a>
              <a href="/docs" className="hover:text-white">
                Documentation
              </a>
              <a href="/api" className="hover:text-white">
                API
              </a>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-gray-800 text-center">
            <p>© 2024 Kramari. MIT License.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}