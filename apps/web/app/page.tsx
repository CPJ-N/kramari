'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowRight, Phone, Zap, Shield, Code2, Users, Globe, Headphones, Github, FileText, ExternalLink } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { ThemeToggle } from '@/components/ui/theme-toggle'

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 }
}

const stagger = {
  animate: {
    transition: {
      staggerChildren: 0.1
    }
  }
}

function AudioWaveform() {
  return (
    <div className="flex items-center justify-center gap-1 h-16">
      {[...Array(20)].map((_, i) => (
        <motion.div
          key={i}
          className="w-1 bg-gradient-to-t from-kramari-taupe to-kramari-charcoal dark:from-kramari-charcoal dark:to-kramari-taupe rounded-full"
          animate={{
            height: [15, 30 + Math.random() * 20, 15],
          }}
          transition={{
            duration: 1.2,
            repeat: Infinity,
            delay: i * 0.05,
            ease: 'easeInOut',
          }}
        />
      ))}
    </div>
  )
}

function SectionDivider() {
  return (
    <div className="relative w-full py-8">
      <div className="absolute inset-0 flex items-center">
        <div className="w-full border-t border-kramari-taupe/30 dark:border-kramari-charcoal/30" />
      </div>
      <div className="relative flex justify-center">
        <div className="flex items-center space-x-2 bg-kramari-cream dark:bg-kramari-dark px-4">
          <div className="h-2 w-2 rounded-full bg-kramari-taupe dark:bg-kramari-charcoal" />
          <div className="h-2 w-2 rounded-full bg-kramari-muted" />
          <div className="h-2 w-2 rounded-full bg-kramari-charcoal dark:bg-kramari-taupe" />
        </div>
      </div>
    </div>
  )
}

export default function HomePage() {
  return (
    <div className="min-h-screen bg-kramari-cream dark:bg-kramari-dark">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-40 bg-kramari-cream/95 dark:bg-kramari-dark/95 backdrop-blur-md border-b border-kramari-taupe/20 dark:border-kramari-charcoal/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="flex items-center gap-3">
              <div className="h-9 w-9 bg-gradient-to-br from-kramari-charcoal to-kramari-muted rounded-xl flex items-center justify-center">
                <Zap className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-bold text-gradient-kramari">Kramari</span>
            </Link>
            <div className="flex items-center gap-4">
              <Link href="/dashboard" className="text-kramari-charcoal dark:text-kramari-taupe hover:text-kramari-muted transition-colors font-medium">
                Dashboard
              </Link>
              <a href="https://github.com/kramari/kramari" target="_blank" rel="noopener noreferrer" className="text-kramari-charcoal dark:text-kramari-taupe hover:text-kramari-muted transition-colors">
                <Github className="h-5 w-5" />
              </a>
              <ThemeToggle />
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-32 pb-20">
        {/* Background Blobs */}
        <div className="absolute top-1/3 -left-20 w-40 h-40 blob blob-primary" />
        <div className="absolute bottom-1/4 -right-20 w-32 h-32 blob blob-secondary" />
        <div className="absolute top-20 right-1/4 w-24 h-24 blob blob-primary" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center"
            initial="initial"
            animate="animate"
            variants={stagger}
          >
            <motion.h1
              className="text-5xl md:text-7xl font-bold mb-6"
              variants={fadeInUp}
            >
              <span className="text-gradient-kramari">Voice AI</span>
              <br />
              <span className="text-kramari-charcoal dark:text-kramari-taupe">Made Simple</span>
            </motion.h1>

            <motion.p
              className="text-xl md:text-2xl text-kramari-muted mb-8 max-w-3xl mx-auto"
              variants={fadeInUp}
            >
              Deploy production-ready AI voice agents in seconds.
              Open-source, self-hosted, no vendor lock-in.
            </motion.p>

            {/* Audio Waveform */}
            <motion.div
              className="mb-8"
              variants={fadeInUp}
            >
              <AudioWaveform />
            </motion.div>

            <motion.div
              className="flex gap-4 justify-center flex-wrap"
              variants={fadeInUp}
            >
              <Button asChild size="xl">
                <Link href="/dashboard">
                  Start Building
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="xl">
                <a href="https://github.com/kramari/kramari" target="_blank" rel="noopener noreferrer">
                  <Github className="mr-2 h-5 w-5" />
                  View on GitHub
                </a>
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </section>

      <SectionDivider />

      {/* Quick Deploy Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gradient-kramari">
              Deploy in 10 Seconds
            </h2>
            <p className="text-lg text-kramari-muted max-w-2xl mx-auto">
              Choose a template, click deploy, get a phone number. It's that simple.
            </p>
          </motion.div>

          <motion.div
            className="grid md:grid-cols-3 gap-8"
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={stagger}
          >
            {[
              {
                title: 'Customer Service',
                description: 'Handle support inquiries 24/7 with intelligent routing and escalation',
                icon: Users,
              },
              {
                title: 'Sales Qualifier',
                description: 'Qualify leads automatically and book meetings with prospects',
                icon: Phone,
              },
              {
                title: 'Appointment Setter',
                description: 'Book meetings effortlessly with calendar integration',
                icon: Zap,
              },
            ].map((template, index) => (
              <motion.div key={template.title} variants={fadeInUp}>
                <Card className="h-full group cursor-pointer">
                  <CardContent className="p-6">
                    <div className="w-12 h-12 bg-gradient-to-br from-kramari-muted to-kramari-taupe rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                      <template.icon className="h-6 w-6 text-white" />
                    </div>
                    <h3 className="text-xl font-semibold text-kramari-charcoal dark:text-kramari-taupe mb-2">
                      {template.title}
                    </h3>
                    <p className="text-kramari-muted mb-4">
                      {template.description}
                    </p>
                    <span className="text-kramari-charcoal dark:text-kramari-taupe font-semibold inline-flex items-center group-hover:gap-2 transition-all">
                      Deploy Now
                      <ArrowRight className="h-4 w-4 ml-1 group-hover:translate-x-1 transition-transform" />
                    </span>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      <SectionDivider />

      {/* Features Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gradient-kramari">
              Everything You Need
            </h2>
            <p className="text-lg text-kramari-muted max-w-2xl mx-auto">
              Built with the best technologies for reliable voice AI at scale
            </p>
          </motion.div>

          <motion.div
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={stagger}
          >
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
                icon: Headphones,
                title: 'Real-Time Voice',
                description: 'Powered by LiveKit for ultra-low latency conversations',
              },
              {
                icon: Code2,
                title: 'OpenAI + More',
                description: 'Advanced language understanding with your choice of LLM',
              },
              {
                icon: Phone,
                title: 'Phone Integration',
                description: 'SIP trunks for inbound and outbound calls',
              },
              {
                icon: Users,
                title: 'Open Source',
                description: 'MIT licensed, customize and extend as needed',
              },
            ].map((feature, index) => (
              <motion.div
                key={feature.title}
                className="flex gap-4"
                variants={fadeInUp}
              >
                <div className="w-10 h-10 bg-gradient-to-br from-kramari-taupe/20 to-kramari-muted/20 rounded-lg flex items-center justify-center flex-shrink-0">
                  <feature.icon className="h-5 w-5 text-kramari-charcoal dark:text-kramari-taupe" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-kramari-charcoal dark:text-kramari-taupe mb-1">
                    {feature.title}
                  </h3>
                  <p className="text-kramari-muted">
                    {feature.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      <SectionDivider />

      {/* CTA Section */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <Card className="bg-gradient-to-br from-kramari-charcoal to-kramari-muted p-1">
              <div className="bg-kramari-cream dark:bg-kramari-dark rounded-xl p-8 md:p-12 text-center">
                <h2 className="text-3xl md:text-4xl font-bold text-gradient-kramari mb-4">
                  Ready to build voice AI?
                </h2>
                <p className="text-xl text-kramari-muted mb-8">
                  Join developers building the future of voice
                </p>
                <div className="flex gap-4 justify-center flex-wrap">
                  <Button asChild size="xl">
                    <Link href="/dashboard">
                      Get Started Free
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Link>
                  </Button>
                  <Button asChild variant="outline" size="xl">
                    <Link href="/dashboard/test">
                      <Headphones className="mr-2 h-5 w-5" />
                      Try Voice Test
                    </Link>
                  </Button>
                </div>
              </div>
            </Card>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-kramari-dark text-kramari-taupe/80 py-12 border-t border-kramari-charcoal/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 bg-gradient-to-br from-kramari-muted to-kramari-taupe rounded-lg flex items-center justify-center">
                <Zap className="h-4 w-4 text-white" />
              </div>
              <div>
                <p className="text-lg font-bold text-kramari-taupe">Kramari</p>
                <p className="text-sm">Voice AI made simple. No lock-in.</p>
              </div>
            </div>
            <div className="flex gap-6">
              <a href="https://github.com/kramari/kramari" target="_blank" rel="noopener noreferrer" className="hover:text-kramari-taupe transition-colors flex items-center gap-1">
                <Github className="h-4 w-4" />
                GitHub
              </a>
              <Link href="/dashboard" className="hover:text-kramari-taupe transition-colors">
                Dashboard
              </Link>
              <Link href="/dashboard/test" className="hover:text-kramari-taupe transition-colors">
                Voice Test
              </Link>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-kramari-charcoal/30 text-center text-sm">
            <p>© {new Date().getFullYear()} Kramari. MIT License.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
