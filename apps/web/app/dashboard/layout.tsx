import { Sidebar } from '@/components/layout/sidebar'
import { Header } from '@/components/layout/header'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-kramari-cream dark:bg-kramari-dark">
      <Header />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 px-4 py-8 ml-64 mt-16">
          <div className="max-w-7xl mx-auto">{children}</div>
        </main>
      </div>
    </div>
  )
}
