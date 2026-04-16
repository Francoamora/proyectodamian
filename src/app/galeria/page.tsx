'use client'
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Navbar from '@/components/Navbar'
import WhatsAppButton from '@/components/WhatsAppButton'
import Link from 'next/link'
import { getGaleria } from '@/lib/api'

const P = 'var(--playfair-font)'
const C = 'var(--cormorant-font)'

const inView = (delay = 0) => ({
  initial: { opacity: 0, y: 32 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 1, delay, ease: [0.16, 1, 0.3, 1] as const },
})

const FILTROS = [
  { key: '',         label: 'Todos'    },
  { key: 'tortas',   label: 'Tortas'   },
  { key: 'postres',  label: 'Postres'  },
  { key: 'cascadas', label: 'Cascadas' },
  { key: 'catering', label: 'Catering' },
  { key: 'eventos',  label: 'Eventos'  },
]

interface GaleriaItem {
  id: number
  titulo: string
  subtitulo: string
  imagen_url: string
  categoria: string
  destacado: boolean
  orden: number
}

export default function Galeria() {
  const [items, setItems]       = useState<GaleriaItem[]>([])
  const [filtro, setFiltro]     = useState('')
  const [loading, setLoading]   = useState(true)
  const [lightbox, setLightbox] = useState<GaleriaItem | null>(null)
  const [imgError, setImgError] = useState<Record<number, boolean>>({})

  useEffect(() => {
    setLoading(true)
    getGaleria(filtro || undefined)
      .then(data => setItems(Array.isArray(data) ? data : data.results ?? []))
      .catch(() => setItems([]))
      .finally(() => setLoading(false))
  }, [filtro])

  return (
    <main style={{ background: '#0E0C0C', minHeight: '100vh' }}>
      <Navbar />
      <WhatsAppButton />

      {/* ── HERO ── */}
      <section style={{ padding: '11rem 2.5rem 6rem', position: 'relative', overflow: 'hidden' }}>
        <div style={{
          position: 'absolute', inset: 0, opacity: 0.04, pointerEvents: 'none',
          backgroundImage: 'linear-gradient(#FAF7F2 1px,transparent 1px),linear-gradient(90deg,#FAF7F2 1px,transparent 1px)',
          backgroundSize: '80px 80px',
        }} />
        <div style={{
          position: 'absolute', top: '20%', right: '-5%', width: 500, height: 500,
          borderRadius: '50%', background: 'radial-gradient(circle, rgba(204,31,31,0.12) 0%, transparent 70%)',
          pointerEvents: 'none',
        }} />

        <div style={{ maxWidth: 1400, margin: '0 auto', position: 'relative' }}>
          <motion.div {...inView()}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 28 }}>
              <div style={{ width: 48, height: 1, background: '#CC1F1F' }} />
              <span style={{ fontFamily: C, fontSize: 10, letterSpacing: '0.45em', textTransform: 'uppercase', color: '#CC1F1F' }}>
                Portfolio · Dolche&apos;B
              </span>
            </div>
            <h1 style={{
              fontFamily: P, fontSize: 'clamp(4rem, 10vw, 10rem)', lineHeight: 0.85,
              color: '#FAF7F2', fontWeight: 400, letterSpacing: '-0.02em',
            }}>
              Galería<br />
              <em style={{ color: '#CC1F1F', fontStyle: 'italic' }}>de Obras</em>
            </h1>
            <p style={{
              fontFamily: C, fontSize: '1.25rem', fontWeight: 300, lineHeight: 1.75,
              color: 'rgba(250,247,242,0.4)', maxWidth: 500, marginTop: 32,
            }}>
              Cada imagen es una historia. Creaciones únicas hechas con técnica, pasión y un toque de magia.
            </p>
          </motion.div>

          <motion.div {...inView(0.3)} style={{
            display: 'flex', gap: 48, marginTop: 56, flexWrap: 'wrap',
            borderTop: '1px solid rgba(250,247,242,0.08)', paddingTop: 40,
          }}>
            {[['500+', 'Creaciones'], ['15', 'Años'], ['100%', 'Artesanal']].map(([n, l]) => (
              <div key={l}>
                <div style={{ fontFamily: P, fontSize: '2.5rem', color: '#CC1F1F', lineHeight: 1 }}>{n}</div>
                <div style={{ fontFamily: C, fontSize: 11, letterSpacing: '0.3em', textTransform: 'uppercase', color: 'rgba(250,247,242,0.3)', marginTop: 6 }}>{l}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── FILTROS ── */}
      <div style={{
        position: 'sticky', top: 68, zIndex: 40,
        borderTop: '1px solid rgba(250,247,242,0.06)',
        borderBottom: '1px solid rgba(250,247,242,0.06)',
        background: 'rgba(14,12,12,0.92)', backdropFilter: 'blur(16px)',
      }}>
        <div style={{ maxWidth: 1400, margin: '0 auto', padding: '0 2.5rem', display: 'flex', overflowX: 'auto' }}>
          {FILTROS.map(f => (
            <button key={f.key} onClick={() => setFiltro(f.key)} style={{
              fontFamily: C, fontSize: 10, letterSpacing: '0.35em', textTransform: 'uppercase',
              padding: '18px 28px', border: 'none', cursor: 'pointer', whiteSpace: 'nowrap',
              background: 'transparent', transition: 'all 0.3s',
              color: filtro === f.key ? '#CC1F1F' : 'rgba(250,247,242,0.28)',
              borderBottom: filtro === f.key ? '2px solid #CC1F1F' : '2px solid transparent',
            }}>
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* ── GRID ── */}
      <section style={{ padding: '5rem 2.5rem 8rem' }}>
        <div style={{ maxWidth: 1400, margin: '0 auto' }}>

          {loading && (
            <div style={{ textAlign: 'center', padding: '8rem 0' }}>
              <div style={{ display: 'inline-block', width: 40, height: 40, border: '2px solid rgba(250,247,242,0.1)', borderTop: '2px solid #CC1F1F', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
              <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
              <p style={{ fontFamily: C, fontSize: '1rem', color: 'rgba(250,247,242,0.2)', marginTop: 20, letterSpacing: '0.2em', textTransform: 'uppercase' }}>Cargando</p>
            </div>
          )}

          {!loading && items.length === 0 && (
            <motion.div {...inView()} style={{ textAlign: 'center', padding: '8rem 0' }}>
              <div style={{ fontSize: '4rem', marginBottom: 24, opacity: 0.3 }}>📷</div>
              <h2 style={{ fontFamily: P, fontSize: '2.5rem', color: '#FAF7F2', fontWeight: 400, marginBottom: 16 }}>
                Sin imágenes aún
              </h2>
              <p style={{ fontFamily: C, fontSize: '1.2rem', color: 'rgba(250,247,242,0.3)', marginBottom: 32 }}>
                Subí fotos desde el panel de administración
              </p>
              <a href="http://127.0.0.1:8000/admin" target="_blank" rel="noopener noreferrer" style={{
                fontFamily: C, fontSize: 11, letterSpacing: '0.3em', textTransform: 'uppercase',
                padding: '14px 36px', background: '#CC1F1F', color: '#fff', textDecoration: 'none', display: 'inline-block',
              }}>
                Abrir Admin →
              </a>
            </motion.div>
          )}

          {!loading && items.length > 0 && (
            <div style={{ columns: '3 280px', gap: 3 }}>
              {items.map((item, i) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.7, delay: i * 0.05, ease: [0.16, 1, 0.3, 1] }}
                  style={{ breakInside: 'avoid', marginBottom: 3, cursor: 'zoom-in', position: 'relative' }}
                  onClick={() => setLightbox(item)}
                >
                  <div
                    style={{ position: 'relative', overflow: 'hidden', display: 'block', background: '#1a1515' }}
                    onMouseEnter={e => {
                      const img = e.currentTarget.querySelector('img') as HTMLImageElement
                      const ov  = e.currentTarget.querySelector('.ov') as HTMLElement
                      if (img) img.style.transform = 'scale(1.06)'
                      if (ov)  ov.style.opacity = '1'
                    }}
                    onMouseLeave={e => {
                      const img = e.currentTarget.querySelector('img') as HTMLImageElement
                      const ov  = e.currentTarget.querySelector('.ov') as HTMLElement
                      if (img) img.style.transform = 'scale(1)'
                      if (ov)  ov.style.opacity = '0'
                    }}
                  >
                    {!imgError[item.id] ? (
                      <img
                        src={item.imagen_url}
                        alt={item.titulo}
                        onError={() => setImgError(p => ({ ...p, [item.id]: true }))}
                        style={{
                          width: '100%', display: 'block',
                          transition: 'transform 1.4s cubic-bezier(0.16,1,0.3,1)',
                          filter: 'brightness(0.85)',
                        }}
                      />
                    ) : (
                      <div style={{ height: 240, display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#1a1515' }}>
                        <span style={{ fontFamily: C, color: 'rgba(250,247,242,0.2)', fontSize: 12, letterSpacing: '0.2em' }}>SIN IMAGEN</span>
                      </div>
                    )}

                    <div className="ov" style={{
                      position: 'absolute', inset: 0, opacity: 0,
                      background: 'linear-gradient(to top, rgba(14,12,12,0.95) 0%, rgba(14,12,12,0.2) 50%, transparent 100%)',
                      transition: 'opacity 0.5s',
                    }}>
                      <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '2rem' }}>
                        <p style={{ fontFamily: C, fontSize: 9, letterSpacing: '0.4em', textTransform: 'uppercase', color: '#CC1F1F', marginBottom: 8 }}>
                          {item.categoria}
                        </p>
                        <h3 style={{ fontFamily: P, fontSize: '1.3rem', color: '#FAF7F2', fontWeight: 400, lineHeight: 1.2 }}>
                          {item.titulo}
                        </h3>
                        {item.subtitulo && (
                          <p style={{ fontFamily: C, fontSize: '0.9rem', color: 'rgba(250,247,242,0.45)', marginTop: 6 }}>
                            {item.subtitulo}
                          </p>
                        )}
                        <div style={{ marginTop: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
                          <div style={{ width: 20, height: 1, background: '#CC1F1F' }} />
                          <span style={{ fontFamily: C, fontSize: 9, letterSpacing: '0.3em', textTransform: 'uppercase', color: 'rgba(250,247,242,0.4)' }}>Ver detalle</span>
                        </div>
                      </div>
                    </div>

                    {item.destacado && (
                      <div style={{ position: 'absolute', top: 14, right: 14, background: '#CC1F1F', padding: '5px 12px' }}>
                        <span style={{ fontFamily: C, fontSize: 8, letterSpacing: '0.3em', textTransform: 'uppercase', color: '#fff' }}>Destacado</span>
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ── LIGHTBOX ── */}
      <AnimatePresence>
        {lightbox && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            style={{ position: 'fixed', inset: 0, zIndex: 100, background: 'rgba(5,4,4,0.97)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}
            onClick={() => setLightbox(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              onClick={e => e.stopPropagation()}
              style={{ maxWidth: 960, width: '100%', display: 'grid', gridTemplateColumns: '1fr 320px', background: '#141111', overflow: 'hidden' }}
            >
              <div style={{ position: 'relative', minHeight: 480, background: '#0E0C0C' }}>
                <img src={lightbox.imagen_url} alt={lightbox.titulo} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
              </div>
              <div style={{ padding: '3rem 2.5rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div>
                  <p style={{ fontFamily: C, fontSize: 9, letterSpacing: '0.4em', textTransform: 'uppercase', color: '#CC1F1F', marginBottom: 20 }}>{lightbox.categoria}</p>
                  <h2 style={{ fontFamily: P, fontSize: '2rem', color: '#FAF7F2', fontWeight: 400, lineHeight: 1.1, marginBottom: 16 }}>{lightbox.titulo}</h2>
                  {lightbox.subtitulo && (
                    <p style={{ fontFamily: C, fontSize: '1.1rem', fontWeight: 300, color: 'rgba(250,247,242,0.4)', lineHeight: 1.7 }}>{lightbox.subtitulo}</p>
                  )}
                  {lightbox.destacado && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 32, paddingTop: 20, borderTop: '1px solid rgba(250,247,242,0.08)' }}>
                      <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#CC1F1F' }} />
                      <span style={{ fontFamily: C, fontSize: 10, letterSpacing: '0.25em', textTransform: 'uppercase', color: 'rgba(250,247,242,0.3)' }}>Obra destacada</span>
                    </div>
                  )}
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  <Link href="/contacto" onClick={() => setLightbox(null)} style={{
                    fontFamily: C, fontSize: 10, letterSpacing: '0.35em', textTransform: 'uppercase',
                    padding: '16px 24px', background: '#CC1F1F', color: '#fff', textDecoration: 'none', textAlign: 'center', display: 'block',
                  }}>
                    Solicitar Presupuesto
                  </Link>
                  <button onClick={() => setLightbox(null)} style={{
                    fontFamily: C, fontSize: 10, letterSpacing: '0.35em', textTransform: 'uppercase',
                    padding: '14px 24px', background: 'transparent', border: '1px solid rgba(250,247,242,0.1)',
                    color: 'rgba(250,247,242,0.3)', cursor: 'pointer',
                  }}>Cerrar</button>
                </div>
              </div>
            </motion.div>
            <button onClick={() => setLightbox(null)} style={{
              position: 'fixed', top: 24, right: 24, background: 'rgba(250,247,242,0.06)',
              border: 'none', color: 'rgba(250,247,242,0.5)', width: 48, height: 48,
              cursor: 'pointer', fontSize: '1.2rem', display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}
              onMouseEnter={e => { e.currentTarget.style.background = '#CC1F1F'; e.currentTarget.style.color = '#fff' }}
              onMouseLeave={e => { e.currentTarget.style.background = 'rgba(250,247,242,0.06)'; e.currentTarget.style.color = 'rgba(250,247,242,0.5)' }}
            >✕</button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── CTA ── */}
      <section style={{ padding: '7rem 2.5rem', borderTop: '1px solid rgba(250,247,242,0.06)' }}>
        <div style={{ maxWidth: 1400, margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 80, alignItems: 'center' }}>
          <motion.div {...inView()}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 24 }}>
              <div style={{ width: 32, height: 1, background: '#CC1F1F' }} />
              <span style={{ fontFamily: C, fontSize: 10, letterSpacing: '0.4em', textTransform: 'uppercase', color: '#CC1F1F' }}>Tu próxima creación</span>
            </div>
            <h2 style={{ fontFamily: P, fontSize: 'clamp(2.5rem, 4vw, 4rem)', color: '#FAF7F2', fontWeight: 400, lineHeight: 1, marginBottom: 24 }}>
              ¿Tenés una<br />idea en mente?
            </h2>
            <p style={{ fontFamily: C, fontSize: '1.2rem', fontWeight: 300, color: 'rgba(250,247,242,0.4)', lineHeight: 1.75, marginBottom: 40 }}>
              Convertimos tus ideas en piezas únicas. Cada creación es un mundo nuevo.
            </p>
            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
              <Link href="/contacto" style={{
                fontFamily: C, fontSize: 11, letterSpacing: '0.3em', textTransform: 'uppercase',
                padding: '16px 40px', background: '#CC1F1F', color: '#fff', textDecoration: 'none',
              }}>Hacer un Pedido</Link>
              <Link href="/sobre-mi" style={{
                fontFamily: C, fontSize: 11, letterSpacing: '0.3em', textTransform: 'uppercase',
                padding: '16px 40px', border: '1px solid rgba(250,247,242,0.15)',
                color: 'rgba(250,247,242,0.5)', textDecoration: 'none',
              }}>Sobre el Chef</Link>
            </div>
          </motion.div>

          <motion.div {...inView(0.2)} style={{ background: '#141111', padding: '2.5rem', border: '1px solid rgba(250,247,242,0.06)' }}>
            {[
              { icon: '📍', label: 'Ubicación', val: 'Tacuarendi, Santa Fe'  },
              { icon: '📱', label: 'WhatsApp',  val: '+54 9 11 XXXX-XXXX'   },
              { icon: '✉️',  label: 'Email',     val: 'contacto@dolcheb.com' },
              { icon: '📸', label: 'Instagram', val: '@dolcheb_pasteles'    },
            ].map(({ icon, label, val }) => (
              <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 20, padding: '16px 0', borderBottom: '1px solid rgba(250,247,242,0.05)' }}>
                <span style={{ fontSize: '1.3rem', width: 28, textAlign: 'center' }}>{icon}</span>
                <div>
                  <p style={{ fontFamily: C, fontSize: 9, letterSpacing: '0.3em', textTransform: 'uppercase', color: 'rgba(250,247,242,0.2)', marginBottom: 2 }}>{label}</p>
                  <p style={{ fontFamily: C, fontSize: '1rem', color: 'rgba(250,247,242,0.6)' }}>{val}</p>
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer style={{ borderTop: '1px solid rgba(250,247,242,0.06)', padding: '3rem 2.5rem' }}>
        <div style={{ maxWidth: 1400, margin: '0 auto' }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: 40, marginBottom: 40 }}>
            <div>
              <p style={{ fontFamily: P, fontSize: '1.8rem', color: '#FAF7F2', fontWeight: 400, marginBottom: 8 }}>Dolche&apos;B</p>
              <p style={{ fontFamily: C, fontSize: '0.95rem', color: 'rgba(250,247,242,0.25)', fontWeight: 300 }}>Damián Borelli · Chef Pastelero</p>
            </div>
            <div style={{ display: 'flex', gap: 32, flexWrap: 'wrap' }}>
              {[['/', 'Inicio'], ['/sobre-mi', 'Sobre Mí'], ['/galeria', 'Galería'], ['/eventos', 'Eventos'], ['/blog', 'Blog'], ['/contacto', 'Contacto']].map(([href, label]) => (
                <Link key={href} href={href} style={{
                  fontFamily: C, fontSize: 11, letterSpacing: '0.25em', textTransform: 'uppercase',
                  color: 'rgba(250,247,242,0.25)', textDecoration: 'none',
                }}
                  onMouseEnter={e => (e.currentTarget.style.color = '#CC1F1F')}
                  onMouseLeave={e => (e.currentTarget.style.color = 'rgba(250,247,242,0.25)')}
                >{label}</Link>
              ))}
            </div>
            <div style={{ display: 'flex', gap: 12 }}>
              {[{ label: 'IG', href: 'https://instagram.com/dolcheb_pasteles' }, { label: 'FB', href: 'https://facebook.com/dolcheb' }, { label: 'WA', href: 'https://wa.me/5491112345678' }].map(s => (
                <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer" style={{
                  fontFamily: C, fontSize: 9, letterSpacing: '0.25em', width: 42, height: 42,
                  border: '1px solid rgba(250,247,242,0.1)', display: 'flex', alignItems: 'center',
                  justifyContent: 'center', color: 'rgba(250,247,242,0.3)', textDecoration: 'none', transition: 'all 0.2s',
                }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = '#CC1F1F'; e.currentTarget.style.color = '#CC1F1F' }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(250,247,242,0.1)'; e.currentTarget.style.color = 'rgba(250,247,242,0.3)' }}
                >{s.label}</a>
              ))}
            </div>
          </div>
          <div style={{ borderTop: '1px solid rgba(250,247,242,0.05)', paddingTop: 24, display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
            <p style={{ fontFamily: C, fontSize: 11, letterSpacing: '0.15em', color: 'rgba(250,247,242,0.12)' }}>© 2026 Dolche&apos;B — Todos los derechos reservados</p>
            <p style={{ fontFamily: C, fontSize: 11, letterSpacing: '0.15em', color: 'rgba(250,247,242,0.12)' }}>Tacuarendi, Santa Fe · Argentina</p>
          </div>
        </div>
      </footer>
    </main>
  )
}