'use client'

import { usePathname } from 'next/navigation'

import { Chatbot } from '@/components/chatbot'
import { Footer } from '@/components/layout/footer'
import { Navbar } from '@/components/layout/navbar'

export function RootWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const isAdmin = pathname?.startsWith('/admin')

  if (isAdmin) return children

  return (
    <>
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
      <Chatbot />
    </>
  )
}
