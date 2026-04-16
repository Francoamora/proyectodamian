'use client'
import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import Link from 'next/link'
import Navbar from '@/components/Navbar'
import WhatsAppButton from '@/components/WhatsAppButton'

const P = 'var(--playfair-font)'
const C = 'var(--cormorant-font)'

const reveal = (delay = 0) => ({
  initial:     { opacity: 0, y: 40 },
  whileInView: { opacity: 1, y: 0  },
  viewport:    { once: true, margin: '-10%' },
  transition:  { duration: 1.1, delay, ease: [0.16, 1, 0.3, 1] as const },
})

const WA = 'https://wa.me/5491112345678?text=' + encodeURIComponent('Hola Damián! Vi tu sitio y quiero consultar 🎂')
const IG = 'https://instagram.com/dolcheb_pasteles'
const FB = 'https://facebook.com/dolcheb'

/* ─── data ─────────────────────────────────────── */
const services = [
  {
    n: '01',
    t: 'Tortas & Pasteles',
    d: 'Diseñamos cada torta desde cero. Sin moldes, sin atajos. Solo técnica, tiempo y los mejores ingredientes.',
    href: '/galeria',
  },
  {
    n: '02',
    t: 'Cascadas de Chocolate',
    d: 'Una experiencia visual y gastronómica única. Instalamos fuentes de chocolate artesanal para bodas, cumpleaños y eventos corporativos de alto impacto.',
    href: '/eventos',
  },
  {
    n: '03',
    t: 'Fondue & Catering',
    d: 'Fondues de queso y chocolate, más propuestas de catering completas para que tu evento sea memorable de principio a fin.',
    href: '/eventos',
  },
]

const gallery = [
  {
    title: 'Torta Red Velvet',
    sub:   'Frosting de queso crema artesanal',
    img:   'https://images.unsplash.com/photo-1578985545062-69928b1d9587?q=80&w=1400&auto=format&fit=crop',
    href:  '/galeria',
    big:   true,
  },
  {
    title: 'Crème Brûlée',
    sub:   'Vainilla de Madagascar',
    img:   'https://images.unsplash.com/photo-1473093295043-cdd812d0e601?q=80&w=900&auto=format&fit=crop',
    href:  '/blog/creme-brulee-clasica',
    big:   false,
  },
  {
    title: 'Opera Cake',
    sub:   'Café, almendras y ganache 70%',
    img:   'https://images.unsplash.com/photo-1611293388250-580b08c4a145?q=80&w=900&auto=format&fit=crop',
    href:  '/galeria',
    big:   false,
  },
]

const stats = [
  { n: '15+',  l: 'Años de trayectoria' },
  { n: '+500', l: 'Eventos realizados'  },
  { n: '100%', l: 'Hecho a mano'        },
  { n: '5 ★',  l: 'Calificación Google' },
]

/* ─── component ─────────────────────────────────── */
export default function Home() {
  const heroRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] })
  const imgY = useTransform(scrollYProgress, [0, 1], ['0%', '25%'])
  const txtY = useTransform(scrollYProgress, [0, 1], ['0%', '12%'])
  const op   = useTransform(scrollYProgress, [0, 0.6], [1, 0])

  return (
    <main style={{ background: '#FAF7F2', overflowX: 'hidden' }}>
      <Navbar />
      <WhatsAppButton />

      {/* ══════════════════════════════════════════
          HERO — pantalla completa, imagen + título enorme
      ══════════════════════════════════════════ */}
      <section
        ref={heroRef}
        style={{ position: 'relative', height: '100vh', overflow: 'hidden', background: '#0E0C0C' }}
      >
        {/* Imagen parallax */}
        <motion.div style={{ y: imgY, position: 'absolute', inset: '-10% 0', zIndex: 0 }}>
          <img
            src="/cascada.png"
            alt="Dolche'B"
            style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'brightness(0.45)' }}
          />
        </motion.div>

        {/* Gradiente bottom */}
        <div style={{ position: 'absolute', inset: 0, zIndex: 1,
          background: 'linear-gradient(to bottom, transparent 40%, #0E0C0C 100%)' }} />

        {/* Contenido central */}
        <motion.div style={{ y: txtY, opacity: op, position: 'absolute', inset: 0, zIndex: 2,
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-end',
          paddingBottom: '8vh', textAlign: 'center', padding: '0 2rem 8vh' }}>

          {/* Eyebrow */}
          <motion.div
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.3 }}
            style={{ display: 'flex', alignItems: 'center', gap: 20, marginBottom: 32 }}
          >
            <div style={{ width: 48, height: 1, background: '#CC1F1F' }} />
            <span style={{ fontFamily: C, fontSize: 11, letterSpacing: '0.4em',
              textTransform: 'uppercase', color: 'rgba(250,247,242,0.6)' }}>
              Placeres culinarios · Tacuarendi, Santa Fe - Corrientes Capital
            </span>
            <div style={{ width: 48, height: 1, background: '#CC1F1F' }} />
          </motion.div>

          {/* Título hero */}
          <motion.h1
            initial={{ opacity: 0, y: 60 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, delay: 0.5, ease: [0.16,1,0.3,1] }}
            style={{ fontFamily: P, fontSize: 'clamp(5rem, 16vw, 15rem)',
              lineHeight: 0.85, color: '#FAF7F2', fontWeight: 400,
              letterSpacing: '-0.02em', marginBottom: 40 }}
          >
            Dolche<em style={{ color: '#CC1F1F', fontStyle: 'normal' }}>'</em>B
          </motion.h1>

          {/* CTA hero */}
          <motion.div
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.9 }}
            style={{ display: 'flex', gap: 16, flexWrap: 'wrap', justifyContent: 'center' }}
          >
            <Link href="/contacto" style={{
              fontFamily: C, fontSize: 11, letterSpacing: '0.25em', textTransform: 'uppercase',
              padding: '16px 44px', background: '#CC1F1F', color: '#fff',
              textDecoration: 'none', transition: 'background 0.3s',
            }}
              onMouseEnter={e => (e.currentTarget.style.background = '#A01818')}
              onMouseLeave={e => (e.currentTarget.style.background = '#CC1F1F')}
            >
              Hacer un Pedido
            </Link>
            <a href={WA} target="_blank" rel="noopener noreferrer" style={{
              display: 'flex', alignItems: 'center', gap: 10,
              fontFamily: C, fontSize: 11, letterSpacing: '0.25em', textTransform: 'uppercase',
              padding: '16px 36px', border: '1px solid rgba(250,247,242,0.2)',
              color: 'rgba(250,247,242,0.7)', textDecoration: 'none', transition: 'all 0.3s',
            }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = '#25D366'; e.currentTarget.style.color = '#25D366' }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(250,247,242,0.2)'; e.currentTarget.style.color = 'rgba(250,247,242,0.7)' }}
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
              </svg>
              WhatsApp
            </a>
          </motion.div>
        </motion.div>

        {/* Scroll hint — solo línea, sin texto */}
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2 }}
          style={{ position: 'absolute', bottom: 40, right: '2.5rem', zIndex: 3,
            display: 'flex', flexDirection: 'column', alignItems: 'center' }}
        >
          <motion.div
            animate={{ scaleY: [0, 1, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            style={{ width: 1, height: 56,
              background: 'linear-gradient(to bottom, #CC1F1F, transparent)',
              transformOrigin: 'top' }}
          />
        </motion.div>
      </section>

      {/* ══════════════════════════════════════════
          INTRO — frase editorial con mucho aire
      ══════════════════════════════════════════ */}
      <section style={{ background: '#FAF7F2', padding: '14rem 2.5rem' }}>
        <div style={{ maxWidth: 1000, margin: '0 auto', textAlign: 'center' }}>
          {/* línea vertical entrada */}
          <motion.div {...reveal()} style={{ display: 'flex', justifyContent: 'center', marginBottom: 64 }}>
            <div style={{ width: 1, height: 80, background: 'rgba(14,12,12,0.08)' }} />
          </motion.div>

          <motion.h2 {...reveal(0.1)} style={{
            fontFamily: P, fontSize: 'clamp(2rem, 4.5vw, 4rem)',
            fontWeight: 400, lineHeight: 1.45, color: '#0E0C0C',
          }}>
            "Cada creación es un equilibrio exacto entre las{' '}
            <em style={{ color: '#CC1F1F', fontStyle: 'italic' }}>recetas de nuestro norte</em>
            {' '}y la calidez de los ingredientes de nuestra tierra."
          </motion.h2>

          <motion.div {...reveal(0.2)} style={{ marginTop: 64, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
            <div style={{ width: 1, height: 48, background: 'rgba(14,12,12,0.08)' }} />
            <span style={{ fontFamily: C, fontSize: 11, letterSpacing: '0.4em',
              textTransform: 'uppercase', color: 'rgba(14,12,12,0.35)' }}>
              Damián Borelli — Chef Pastelero
            </span>
          </motion.div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          STATS BAR
      ══════════════════════════════════════════ */}
      <section style={{ background: '#CC1F1F', padding: '0 2.5rem' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto',
          display: 'grid', gridTemplateColumns: 'repeat(4,1fr)',
          borderLeft: '1px solid rgba(255,255,255,0.15)' }}>
          {stats.map((s, i) => (
            <motion.div key={i} {...reveal(i * 0.08)} style={{
              padding: '36px 40px', textAlign: 'center',
              borderRight: '1px solid rgba(255,255,255,0.15)',
            }}>
              <p style={{ fontFamily: P, fontSize: '2.4rem', fontWeight: 700, color: '#fff', lineHeight: 1 }}>{s.n}</p>
              <p style={{ fontFamily: C, fontSize: 10, letterSpacing: '0.25em',
                textTransform: 'uppercase', color: 'rgba(255,255,255,0.55)', marginTop: 8 }}>{s.l}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ══════════════════════════════════════════
          GALERÍA EDITORIAL — layout asimétrico
      ══════════════════════════════════════════ */}
      <section style={{ background: '#0E0C0C', padding: '12rem 2.5rem' }}>
        <div style={{ maxWidth: 1400, margin: '0 auto' }}>

          {/* Header sección */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end',
            marginBottom: '7rem', flexWrap: 'wrap', gap: 32 }}>
            <motion.div {...reveal()}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 24 }}>
                <div style={{ width: 40, height: 1, background: '#CC1F1F' }} />
                <span style={{ fontFamily: C, fontSize: 10, letterSpacing: '0.4em',
                  textTransform: 'uppercase', color: '#CC1F1F' }}>Del obrador</span>
              </div>
              <h2 style={{ fontFamily: P, fontSize: 'clamp(3rem, 7vw, 7rem)',
                fontWeight: 400, lineHeight: 0.9, color: '#FAF7F2' }}>
                Obras<br />
                <em style={{ color: '#CC1F1F', fontStyle: 'italic' }}>Destacadas</em>
              </h2>
            </motion.div>
            <Link href="/galeria" style={{
              display: 'flex', alignItems: 'center', gap: 10,
              fontFamily: C, fontSize: 11, letterSpacing: '0.3em', textTransform: 'uppercase',
              color: 'rgba(250,247,242,0.3)', textDecoration: 'none', transition: 'color 0.3s',
              paddingBottom: 2, borderBottom: '1px solid rgba(250,247,242,0.1)',
            }}
              onMouseEnter={e => (e.currentTarget.style.color = '#CC1F1F')}
              onMouseLeave={e => (e.currentTarget.style.color = 'rgba(250,247,242,0.3)')}
            >
              Ver catálogo completo →
            </Link>
          </div>

          {/* Grid editorial asimétrico */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 4 }}>

            {/* Imagen grande izquierda */}
            <motion.div {...reveal()} style={{ position: 'relative', overflow: 'hidden', aspectRatio: '4/5' }}>
              <Link href="/galeria" style={{ display: 'block', width: '100%', height: '100%' }}>
                <img src={gallery[0].img} alt={gallery[0].title}
                  style={{ width: '100%', height: '100%', objectFit: 'cover',
                    transition: 'transform 1.2s ease', filter: 'brightness(0.75)' }}
                  onMouseEnter={e => (e.currentTarget.style.transform = 'scale(1.04)')}
                  onMouseLeave={e => (e.currentTarget.style.transform = 'scale(1)')}
                />
                <div style={{ position: 'absolute', inset: 0,
                  background: 'linear-gradient(to top, rgba(14,12,12,0.85) 0%, transparent 50%)' }} />
                <div style={{ position: 'absolute', bottom: 0, left: 0, padding: '3rem' }}>
                  <p style={{ fontFamily: C, fontSize: 10, letterSpacing: '0.3em',
                    textTransform: 'uppercase', color: '#CC1F1F', marginBottom: 10 }}>Tortas</p>
                  <h3 style={{ fontFamily: P, fontSize: 'clamp(1.8rem, 3vw, 3rem)',
                    color: '#FAF7F2', fontWeight: 400, lineHeight: 1.1 }}>{gallery[0].title}</h3>
                  <p style={{ fontFamily: C, fontSize: '1.1rem', fontWeight: 300,
                    color: 'rgba(250,247,242,0.55)', marginTop: 8 }}>{gallery[0].sub}</p>
                </div>
              </Link>
            </motion.div>

            {/* Columna derecha — dos imágenes verticales */}
            <div style={{ display: 'grid', gridTemplateRows: '1fr 1fr', gap: 4 }}>
              {gallery.slice(1).map((item, i) => (
                <motion.div key={i} {...reveal(0.1 + i * 0.1)}
                  style={{ position: 'relative', overflow: 'hidden' }}>
                  <Link href={item.href} style={{ display: 'block', width: '100%', height: '100%' }}>
                    <img src={item.img} alt={item.title}
                      style={{ width: '100%', height: '100%', objectFit: 'cover',
                        transition: 'transform 1.2s ease', filter: 'brightness(0.75)' }}
                      onMouseEnter={e => (e.currentTarget.style.transform = 'scale(1.04)')}
                      onMouseLeave={e => (e.currentTarget.style.transform = 'scale(1)')}
                    />
                    <div style={{ position: 'absolute', inset: 0,
                      background: 'linear-gradient(to top, rgba(14,12,12,0.85) 0%, transparent 55%)' }} />
                    <div style={{ position: 'absolute', bottom: 0, left: 0, padding: '2.5rem' }}>
                      <h3 style={{ fontFamily: P, fontSize: 'clamp(1.4rem, 2.5vw, 2.2rem)',
                        color: '#FAF7F2', fontWeight: 400 }}>{item.title}</h3>
                      <p style={{ fontFamily: C, fontSize: '1rem', fontWeight: 300,
                        color: 'rgba(250,247,242,0.5)', marginTop: 6 }}>{item.sub}</p>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          SERVICIOS — sticky left, scroll right
      ══════════════════════════════════════════ */}
      <section style={{ background: '#FAF7F2', padding: '12rem 2.5rem' }}>
        <div style={{ maxWidth: 1400, margin: '0 auto',
          display: 'grid', gridTemplateColumns: '1fr 1.4fr', gap: '8rem', alignItems: 'start' }}>

          {/* Sticky heading */}
          <motion.div {...reveal()} style={{ position: 'sticky', top: '8rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 28 }}>
              <div style={{ width: 40, height: 1, background: '#CC1F1F' }} />
              <span style={{ fontFamily: C, fontSize: 10, letterSpacing: '0.4em',
                textTransform: 'uppercase', color: '#CC1F1F' }}>Servicios</span>
            </div>
            <h2 style={{ fontFamily: P, fontSize: 'clamp(3rem, 6vw, 5.5rem)',
              fontWeight: 400, lineHeight: 0.95, color: '#0E0C0C', marginBottom: 32 }}>
              Lo que<br />
              <em style={{ color: '#CC1F1F', fontStyle: 'italic' }}>ofrecemos</em>
            </h2>
            <p style={{ fontFamily: C, fontSize: '1.3rem', fontWeight: 300,
              color: '#8A7878', lineHeight: 1.7, maxWidth: 340, marginBottom: 40 }}>
              Transformamos tus momentos especiales en experiencias memorables.
            </p>
            <Link href="/eventos" style={{
              display: 'inline-flex', alignItems: 'center', gap: 10,
              fontFamily: C, fontSize: 11, letterSpacing: '0.25em', textTransform: 'uppercase',
              color: '#CC1F1F', textDecoration: 'none',
              paddingBottom: 2, borderBottom: '1px solid rgba(204,31,31,0.3)',
            }}>
              Ver todos los servicios →
            </Link>
          </motion.div>

          {/* Lista servicios */}
          <div style={{ borderTop: '1px solid rgba(14,12,12,0.08)', paddingTop: 0 }}>
            {services.map((s, i) => (
              <motion.div key={i} {...reveal(i * 0.12)}>
                <Link href={s.href} style={{ textDecoration: 'none', display: 'block' }}>
                  <div
                    style={{ display: 'flex', gap: '3rem', padding: '4.5rem 0',
                      borderBottom: '1px solid rgba(14,12,12,0.08)',
                      cursor: 'pointer', transition: 'padding-left 0.4s' }}
                    onMouseEnter={e => (e.currentTarget.style.paddingLeft = '1.5rem')}
                    onMouseLeave={e => (e.currentTarget.style.paddingLeft = '0')}
                  >
                    <span style={{ fontFamily: P, fontSize: '3.5rem', fontWeight: 400,
                      color: 'rgba(204,31,31,0.15)', lineHeight: 1, flexShrink: 0,
                      paddingTop: 4, minWidth: 60, transition: 'color 0.4s' }}
                      onMouseEnter={e => (e.currentTarget.style.color = 'rgba(204,31,31,0.7)')}
                      onMouseLeave={e => (e.currentTarget.style.color = 'rgba(204,31,31,0.15)')}
                    >
                      {s.n}
                    </span>
                    <div style={{ flex: 1 }}>
                      <h3 style={{ fontFamily: P, fontSize: 'clamp(1.4rem, 2.5vw, 2rem)',
                        fontWeight: 400, color: '#0E0C0C', marginBottom: 16, lineHeight: 1.1 }}>
                        {s.t}
                      </h3>
                      <p style={{ fontFamily: C, fontSize: '1.2rem', fontWeight: 300,
                        color: '#8A7878', lineHeight: 1.65, maxWidth: 440 }}>
                        {s.d}
                      </p>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', color: 'rgba(204,31,31,0.3)',
                      fontSize: '1.4rem', flexShrink: 0, transition: 'color 0.3s, transform 0.3s' }}
                      onMouseEnter={e => { e.currentTarget.style.color = '#CC1F1F'; e.currentTarget.style.transform = 'translateX(6px)' }}
                      onMouseLeave={e => { e.currentTarget.style.color = 'rgba(204,31,31,0.3)'; e.currentTarget.style.transform = 'translateX(0)' }}
                    >
                      →
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          CTA — fondo oscuro, pantalla parcial
      ══════════════════════════════════════════ */}
      <section style={{ background: '#0E0C0C', padding: '12rem 2.5rem' }}>
        <div style={{ maxWidth: 1400, margin: '0 auto',
          display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6rem', alignItems: 'center' }}>

          <motion.div {...reveal()}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 28 }}>
              <div style={{ width: 40, height: 1, background: '#CC1F1F' }} />
              <span style={{ fontFamily: C, fontSize: 10, letterSpacing: '0.4em',
                textTransform: 'uppercase', color: '#CC1F1F' }}>Contacto</span>
            </div>
            <h2 style={{ fontFamily: P, fontSize: 'clamp(2.8rem, 6vw, 5.5rem)',
              fontWeight: 400, lineHeight: 0.95, color: '#FAF7F2', marginBottom: 32 }}>
              ¿Tenés un<br />evento{' '}
              <em style={{ color: '#CC1F1F', fontStyle: 'italic' }}>especial?</em>
            </h2>
            <p style={{ fontFamily: C, fontSize: '1.3rem', fontWeight: 300,
              color: 'rgba(250,247,242,0.45)', lineHeight: 1.75, maxWidth: 420, marginBottom: 52 }}>
              Conversemos. Diseñamos propuestas únicas para cada ocasión, desde una torta de cumpleaños hasta el catering completo de tu boda.
            </p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 14 }}>
              <Link href="/contacto" style={{
                fontFamily: C, fontSize: 11, letterSpacing: '0.25em', textTransform: 'uppercase',
                padding: '16px 44px', background: '#CC1F1F', color: '#fff',
                textDecoration: 'none', transition: 'background 0.3s',
              }}
                onMouseEnter={e => (e.currentTarget.style.background = '#A01818')}
                onMouseLeave={e => (e.currentTarget.style.background = '#CC1F1F')}
              >
                Enviar Consulta
              </Link>
              <a href={WA} target="_blank" rel="noopener noreferrer" style={{
                display: 'flex', alignItems: 'center', gap: 10,
                fontFamily: C, fontSize: 11, letterSpacing: '0.25em', textTransform: 'uppercase',
                padding: '16px 32px', border: '1px solid rgba(37,211,102,0.3)',
                color: '#25D366', textDecoration: 'none', transition: 'all 0.3s',
              }}
                onMouseEnter={e => { e.currentTarget.style.background = 'rgba(37,211,102,0.08)'; e.currentTarget.style.borderColor = '#25D366' }}
                onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.borderColor = 'rgba(37,211,102,0.3)' }}
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                </svg>
                WhatsApp directo
              </a>
            </div>
          </motion.div>

          {/* Info card */}
          <motion.div {...reveal(0.15)} style={{ background: '#1A1515', padding: '3.5rem' }}>
            <p style={{ fontFamily: C, fontSize: 10, letterSpacing: '0.35em',
              textTransform: 'uppercase', color: 'rgba(250,247,242,0.2)', marginBottom: 36 }}>
              Encontranos
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
              {[
                { icon: '📍', l: 'Ubicación', v: 'Tacuarendi, Santa Fe' },
                { icon: '📞', l: 'Teléfono',  v: '+54 9 11 XXXX-XXXX'              },
                { icon: '📧', l: 'Email',     v: 'contacto@dolcheb.com'             },
                { icon: '📸', l: 'Instagram', v: '@dolcheb_pasteles'                },
              ].map((row, i, arr) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 18,
                  padding: '20px 0', borderBottom: i < arr.length - 1 ? '1px solid rgba(250,247,242,0.05)' : 'none' }}>
                  <span style={{ fontSize: '1.3rem', flexShrink: 0 }}>{row.icon}</span>
                  <div>
                    <p style={{ fontFamily: C, fontSize: 9, letterSpacing: '0.25em',
                      textTransform: 'uppercase', color: 'rgba(250,247,242,0.22)' }}>{row.l}</p>
                    <p style={{ fontFamily: C, fontSize: '1.15rem', color: 'rgba(250,247,242,0.75)', marginTop: 3 }}>{row.v}</p>
                  </div>
                </div>
              ))}
            </div>
            {/* Redes */}
            <div style={{ display: 'flex', gap: 10, marginTop: 32, paddingTop: 28,
              borderTop: '1px solid rgba(250,247,242,0.06)' }}>
              {[
                { href: IG, label: 'IG', svg: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="2" y="2" width="20" height="20" rx="5"/><path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg> },
                { href: FB, label: 'FB', svg: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z"/></svg> },
                { href: WA, label: 'WA', svg: <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/></svg> },
              ].map(s => (
                <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer" style={{
                  width: 40, height: 40, background: 'rgba(250,247,242,0.05)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: 'rgba(250,247,242,0.3)', textDecoration: 'none', transition: 'all 0.25s',
                }}
                  onMouseEnter={e => { e.currentTarget.style.background = '#CC1F1F'; e.currentTarget.style.color = '#fff' }}
                  onMouseLeave={e => { e.currentTarget.style.background = 'rgba(250,247,242,0.05)'; e.currentTarget.style.color = 'rgba(250,247,242,0.3)' }}
                >
                  {s.svg}
                </a>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          FOOTER
      ══════════════════════════════════════════ */}
      <footer style={{ background: '#0E0C0C', borderTop: '1px solid rgba(250,247,242,0.06)', padding: '4rem 2.5rem' }}>
        <div style={{ maxWidth: 1400, margin: '0 auto' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            flexWrap: 'wrap', gap: 28, marginBottom: 36, paddingBottom: 36,
            borderBottom: '1px solid rgba(250,247,242,0.06)' }}>

            {/* Brand */}
            <div>
              <p style={{ fontFamily: P, fontWeight: 400, color: '#FAF7F2',
                fontSize: 'clamp(1.5rem, 3vw, 2.2rem)', letterSpacing: '0.02em', lineHeight: 1 }}>
                Dolche'B
              </p>
              <p style={{ fontFamily: C, color: 'rgba(250,247,242,0.3)',
                fontSize: 11, letterSpacing: '0.25em', textTransform: 'uppercase', marginTop: 6 }}>
                Damián Borelli · Pastelería Artesanal
              </p>
            </div>

            {/* Nav */}
            <div style={{ display: 'flex', gap: 32, flexWrap: 'wrap' }}>
              {[
                { href: '/sobre-mi', l: 'El Chef'  },
                { href: '/galeria',  l: 'Galería'  },
                { href: '/blog',     l: 'Recetas'  },
                { href: '/eventos',  l: 'Eventos'  },
                { href: '/contacto', l: 'Contacto' },
              ].map(n => (
                <Link key={n.href} href={n.href} style={{
                  fontFamily: C, fontSize: 12, letterSpacing: '0.18em', textTransform: 'uppercase',
                  color: 'rgba(250,247,242,0.28)', textDecoration: 'none', transition: 'color 0.25s',
                }}
                  onMouseEnter={e => (e.currentTarget.style.color = '#CC1F1F')}
                  onMouseLeave={e => (e.currentTarget.style.color = 'rgba(250,247,242,0.28)')}
                >
                  {n.l}
                </Link>
              ))}
            </div>

            {/* Socials */}
            <div style={{ display: 'flex', gap: 10 }}>
              {[
                { href: IG, svg: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="2" y="2" width="20" height="20" rx="5"/><path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg> },
                { href: FB, svg: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z"/></svg> },
                { href: WA, svg: <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/></svg> },
              ].map((s, i) => (
                <a key={i} href={s.href} target="_blank" rel="noopener noreferrer" style={{
                  width: 38, height: 38, background: 'rgba(250,247,242,0.05)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: 'rgba(250,247,242,0.28)', textDecoration: 'none', transition: 'all 0.25s',
                }}
                  onMouseEnter={e => { e.currentTarget.style.background = '#CC1F1F'; e.currentTarget.style.color = '#fff' }}
                  onMouseLeave={e => { e.currentTarget.style.background = 'rgba(250,247,242,0.05)'; e.currentTarget.style.color = 'rgba(250,247,242,0.28)' }}
                >
                  {s.svg}
                </a>
              ))}
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
            <p style={{ fontFamily: C, color: 'rgba(250,247,242,0.15)', fontSize: 13 }}>
              © 2026 Dolche'B — Todos los derechos reservados
            </p>
            <p style={{ fontFamily: C, color: 'rgba(250,247,242,0.15)', fontSize: 13 }}>
              Desarrollado por Franco Agustin Mora
            </p>
          </div>
        </div>
      </footer>
    </main>
  )
}