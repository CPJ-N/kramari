import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Providers } from './providers'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Kramari - Voice Agent Orchestration Platform',
  description: 'Deploy production-ready AI voice agents in seconds. Open-source alternative to Vapi.',
  keywords: 'voice ai, ai agents, voice agents, livekit, anthropic, claude, twilio, open source',
  authors: [{ name: 'Kramari' }],
  openGraph: {
    title: 'Kramari - Voice Agent Orchestration Platform',
    description: 'Deploy production-ready AI voice agents in seconds',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}