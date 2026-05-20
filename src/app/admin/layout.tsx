'use client'

import { useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import Link from 'next/link'
import { isLoggedIn, logout } from '@/lib/adminApi'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
  const [ready, setReady] = useState(false)

  useEffect(() => {
    if (!isLoggedIn() && pathname !== '/admin/login') {
      router.replace('/admin/login')
    } else {
      setReady(true)
    }
  }, [pathname, router])

  if (pathname === '/admin/login') return <>{children}</>
  if (!ready) return null

  function handleLogout() {
    logout()
    router.push('/admin/login')
  }

  const nav = [
    { href: '/admin/dashboard',  label: 'Dashboard',       icon: '⊞' },
    { href: '/admin/productos',  label: 'Productos',        icon: '🍰' },
    { href: '/admin/eventos',    label: 'Eventos',          icon: '📸' },
    { href: '/admin/videos',     label: 'Videos',           icon: '🎬' },
    { href: '/admin/settings',   label: 'Configuración',    icon: '⚙' },
  ]

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#0E0C0C', color: '#FAF7F2', fontFamily: 'system-ui, sans-serif' }}>
      {/* Sidebar */}
      <aside style={{ width: 220, background: '#1A1515', borderRight: '1px solid #2A2020', display: 'flex', flexDirection: 'column', position: 'sticky', top: 0, height: '100vh' }}>
        <div style={{ padding: '28px 24px 20px', borderBottom: '1px solid #2A2020' }}>
          <div style={{ fontSize: 11, letterSpacing: 3, color: '#CC1F1F', fontWeight: 700, textTransform: 'uppercase', marginBottom: 4 }}>Panel Admin</div>
          <div style={{ fontSize: 20, fontWeight: 700, color: '#FAF7F2', letterSpacing: 1 }}>Dolche&apos;B</div>
        </div>

        <nav style={{ flex: 1, padding: '16px 12px' }}>
          {nav.map(({ href, label, icon }) => {
            const active = pathname.startsWith(href)
            return (
              <Link key={href} href={href} style={{
                display: 'flex', alignItems: 'center', gap: 10,
                padding: '10px 12px', borderRadius: 8, marginBottom: 4,
                textDecoration: 'none',
                background: active ? '#CC1F1F' : 'transparent',
                color: active ? '#fff' : '#C8BFBF',
                fontWeight: active ? 600 : 400,
                fontSize: 14,
                transition: 'all 0.15s',
              }}>
                <span style={{ fontSize: 16 }}>{icon}</span>
                {label}
              </Link>
            )
          })}
        </nav>

        <div style={{ padding: '16px 12px', borderTop: '1px solid #2A2020' }}>
          <Link href="/" target="_blank" style={{ display: 'block', padding: '8px 12px', borderRadius: 8, color: '#8A7878', fontSize: 13, textDecoration: 'none', marginBottom: 6 }}>
            ↗ Ver sitio web
          </Link>
          <button onClick={handleLogout} style={{ width: '100%', padding: '8px 12px', borderRadius: 8, background: 'transparent', border: '1px solid #2A2020', color: '#8A7878', fontSize: 13, cursor: 'pointer', textAlign: 'left' }}>
            Cerrar sesión
          </button>
        </div>
      </aside>

      {/* Main */}
      <main style={{ flex: 1, overflowY: 'auto' }}>
        {children}
      </main>
    </div>
  )
}
