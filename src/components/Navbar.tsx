'use client'
import { useState, useEffect } from 'react'
import Image from 'next/image'

const links = [
  { href: '#cascada',     label: 'Cascada'      },
  { href: '#tortas',      label: 'Tortas'       },
  { href: '#mesas-dulces',label: 'Mesas Dulces' },
  { href: '#catalogo',    label: 'Catálogo'     },
  { href: '#eventos',     label: 'Eventos'      },
  { href: '#contacto',    label: 'Contacto'     },
]

const P = 'var(--playfair-font)'
const C = 'var(--cormorant-font)'

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <>
      <nav style={{
        position: 'fixed', top: 0, left: 0, width: '100%', zIndex: 40,
        padding: '16px 24px',
        background: scrolled ? 'rgba(5,5,5,0.92)' : 'transparent',
        borderBottom: scrolled ? '1px solid rgba(255,255,255,0.06)' : '1px solid transparent',
        backdropFilter: scrolled ? 'blur(12px)' : 'none',
        transition: 'all 0.5s ease',
      }}>
        <div style={{ maxWidth: 1500, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>

          {/* Logo */}
          <a href="#" style={{ display: 'flex', alignItems: 'center', gap: 12, textDecoration: 'none' }}>
            <Image
              src="/logo.jpg"
              alt="Logo Dolche'B"
              width={44}
              height={44}
              style={{ borderRadius: '50%', objectFit: 'cover', border: '1px solid rgba(220,38,38,0.4)', boxShadow: '0 0 14px rgba(220,38,38,0.25)' }}
            />
            <span style={{ fontFamily: P, fontSize: 22, color: '#fff', letterSpacing: '-0.01em' }}>
              Dolche<em style={{ color: '#DC2626', fontStyle: 'normal' }}>&apos;</em>B
            </span>
          </a>

          {/* Desktop nav */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 40 }} className="hidden-mobile">
            {links.map(l => (
              <a key={l.href} href={l.href} style={{
                fontFamily: C, fontSize: 11, letterSpacing: '0.25em', textTransform: 'uppercase',
                color: 'rgba(255,255,255,0.7)', textDecoration: 'none', transition: 'color 0.3s',
              }}
                onMouseEnter={e => (e.currentTarget.style.color = '#DC2626')}
                onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.7)')}
              >
                {l.label}
              </a>
            ))}
          </div>

          {/* Burger */}
          <button
            onClick={() => setOpen(!open)}
            style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 8, display: 'flex', flexDirection: 'column', gap: 6 }}
            className="show-mobile"
            aria-label="Menú"
          >
            {[0, 1, 2].map(i => (
              <span key={i} style={{
                display: 'block', width: 24, height: 1, background: '#fff', transition: 'all 0.3s',
                transform: open ? (i === 0 ? 'rotate(45deg) translateY(7px)' : i === 2 ? 'rotate(-45deg) translateY(-7px)' : 'scaleX(0)') : 'none',
              }} />
            ))}
          </button>
        </div>
      </nav>

      {/* Mobile overlay */}
      {open && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 39,
          background: 'rgba(5,5,5,0.97)', backdropFilter: 'blur(16px)',
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 36,
        }}>
          {links.map(l => (
            <a key={l.href} href={l.href} onClick={() => setOpen(false)} style={{
              fontFamily: P, fontSize: 32, color: '#FAF7F2', textDecoration: 'none', letterSpacing: '0.04em', transition: 'color 0.2s',
            }}
              onMouseEnter={e => (e.currentTarget.style.color = '#DC2626')}
              onMouseLeave={e => (e.currentTarget.style.color = '#FAF7F2')}
            >
              {l.label}
            </a>
          ))}
        </div>
      )}

      <style>{`
        @media (min-width: 768px) { .show-mobile { display: none !important; } }
        @media (max-width: 767px) { .hidden-mobile { display: none !important; } }
      `}</style>
    </>
  )
}
