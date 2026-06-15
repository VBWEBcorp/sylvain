'use client'

import { useEffect, useState } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { AdminSidebar, MobileMenuButton } from '@/components/admin/sidebar'
import { SidebarProvider, useSidebar } from '@/components/admin/sidebar-context'
import { cn } from '@/lib/utils'

const publicPaths = ['/admin/login', '/admin/register']

function AdminMain({ children }: { children: React.ReactNode }) {
  const { collapsed, isMobile } = useSidebar()
  return (
    <main className={cn(
      'flex-1 min-h-screen bg-muted/30 transition-all duration-200',
      isMobile ? 'ml-0 pt-14' : collapsed ? 'ml-[60px]' : 'ml-[220px]'
    )}>
      {children}
    </main>
  )
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const router = useRouter()
  const [authenticated, setAuthenticated] = useState(false)
  const [loading, setLoading] = useState(true)

  const isPublicPage = publicPaths.includes(pathname)

  useEffect(() => {
    const token = localStorage.getItem('authToken')

    if (isPublicPage) {
      if (token) {
        router.push('/admin/dashboard')
      }
      setLoading(false)
      return
    }

    if (!token) {
      router.push('/admin/login')
      return
    }

    // On ne se contente pas de constater qu'un token existe : on vérifie qu'il
    // est encore valide (non expiré, bon secret). Sinon un token périmé laisse
    // « entrer » dans l'admin mais chaque upload / enregistrement échoue en 401
    // sans explication. Token mort → on le purge et on renvoie vers la connexion.
    fetch('/api/auth/verify', { headers: { Authorization: `Bearer ${token}` } })
      .then((r) => {
        if (r.ok) {
          setAuthenticated(true)
          setLoading(false)
        } else {
          localStorage.removeItem('authToken')
          localStorage.removeItem('authUser')
          router.push('/admin/login')
        }
      })
      .catch(() => {
        // Coupure réseau : on n'enferme pas l'utilisateur dehors. Les API
        // d'écriture restent protégées côté serveur de toute façon.
        setAuthenticated(true)
        setLoading(false)
      })
  }, [router, isPublicPage])

  if (loading) return null
  if (isPublicPage) return children
  if (!authenticated) return null

  return (
    <SidebarProvider>
      <div className="flex min-h-screen">
        <AdminSidebar />
        <MobileMenuButton />
        <AdminMain>{children}</AdminMain>
      </div>
    </SidebarProvider>
  )
}
