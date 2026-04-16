'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { getProductos, getEventos } from '@/lib/adminApi'

export default function DashboardPage() {
  const [counts, setCounts] = useState({ productos: 0, eventos: 0 })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([getProductos(), getEventos()])
      .then(([p, e]) => setCounts({ productos: p.data.length, eventos: e.data.length }))
      .finally(() => setLoading(false))
  }, [])

  const cards = [
    { label: 'Productos', count: counts.productos, href: '/admin/productos', icon: '🍰', desc: 'Tortas, tartas, bocados y más' },
    { label: 'Eventos', count: counts.eventos, href: '/admin/eventos', icon: '📸', desc: 'Bodas, cumpleaños, cascadas' },
  ]

  return (
    <div style={{ padding: '40px 40px', maxWidth: 900 }}>
      <div style={{ marginBottom: 36 }}>
        <h1 style={{ fontSize: 28, fontWeight: 700, color: '#FAF7F2', marginBottom: 6 }}>Bienvenido, Damián 👋</h1>
        <p style={{ color: '#8A7878', fontSize: 15 }}>Desde acá podés gestionar todo el contenido del sitio.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 20 }}>
        {cards.map(({ label, count, href, icon, desc }) => (
          <Link key={href} href={href} style={{ textDecoration: 'none' }}>
            <div style={{
              background: '#1A1515', borderRadius: 14, padding: 28,
              border: '1px solid #2A2020', cursor: 'pointer',
              transition: 'border-color 0.15s',
            }}
              onMouseEnter={e => (e.currentTarget.style.borderColor = '#CC1F1F')}
              onMouseLeave={e => (e.currentTarget.style.borderColor = '#2A2020')}
            >
              <div style={{ fontSize: 32, marginBottom: 16 }}>{icon}</div>
              <div style={{ fontSize: 13, color: '#8A7878', marginBottom: 6 }}>{label}</div>
              <div style={{ fontSize: 40, fontWeight: 800, color: '#FAF7F2', lineHeight: 1, marginBottom: 10 }}>
                {loading ? '—' : count}
              </div>
              <div style={{ fontSize: 13, color: '#8A7878' }}>{desc}</div>
              <div style={{ marginTop: 20, fontSize: 13, color: '#CC1F1F', fontWeight: 600 }}>
                Gestionar →
              </div>
            </div>
          </Link>
        ))}
      </div>

      <div style={{ marginTop: 40, padding: 24, background: '#1A1515', borderRadius: 14, border: '1px solid #2A2020' }}>
        <h2 style={{ fontSize: 16, fontWeight: 600, color: '#FAF7F2', marginBottom: 16 }}>Accesos rápidos</h2>
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
          <Link href="/admin/productos" style={{ padding: '10px 18px', background: '#CC1F1F', color: '#fff', borderRadius: 8, textDecoration: 'none', fontSize: 14, fontWeight: 600 }}>
            + Agregar Producto
          </Link>
          <Link href="/admin/eventos" style={{ padding: '10px 18px', background: '#2A2020', color: '#FAF7F2', borderRadius: 8, textDecoration: 'none', fontSize: 14, fontWeight: 600 }}>
            + Agregar Evento
          </Link>
          <a href="https://dolcheb.com.ar" target="_blank" rel="noopener noreferrer" style={{ padding: '10px 18px', background: 'transparent', color: '#8A7878', border: '1px solid #2A2020', borderRadius: 8, textDecoration: 'none', fontSize: 14 }}>
            ↗ Ver sitio
          </a>
        </div>
      </div>
    </div>
  )
}
