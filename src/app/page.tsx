'use client'
import { useCallback, useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import Navbar from '@/components/Navbar'
import { getProductos, getEventos, getImgUrl } from '@/lib/api'

const P = 'var(--playfair-font)'
const C = 'var(--cormorant-font)'
const WA = (msg: string) => `https://wa.me/5493482408180?text=${encodeURIComponent(msg)}`

interface Producto { id: number; nombre: string; categoria: string; img: string; offset: boolean }
interface Evento   { id: number; titulo: string; categoria: string; img: string }

/* ─── Slide fijo de Cascada ─────────────────────────────────── */
const CASCADA_SLIDE = {
  id: 0,
  label: 'Experiencia Premium',
  title: 'Cascada de\nChocolate',
  sub: 'La atracción dulce de tu fiesta',
  img: '/cascadanueva.jpeg',
  isLocal: true,
  cta: { text: 'Consultar Cascada', href: WA('Hola Damián! Me interesa la Cascada de Chocolate 🍫🎉'), external: true },
}

/* ─── CSS global ─────────────────────────────────────────────── */
const CSS = `
  .reveal{opacity:0;transform:translateY(48px);transition:opacity .95s cubic-bezier(.16,1,.3,1),transform .95s cubic-bezier(.16,1,.3,1)}
  .reveal.in{opacity:1;transform:none}
  .d1{transition-delay:.1s}.d2{transition-delay:.2s}.d3{transition-delay:.3s}.d4{transition-delay:.4s}
  .hover-red:hover{color:#DC2626!important}
  .hover-scale .img-inner{transition:transform 1.3s cubic-bezier(.16,1,.3,1)}
  .hover-scale:hover .img-inner{transform:scale(1.1)}
  .zoomable{cursor:zoom-in}
  .ev-card:hover .zoom-icon{opacity:1!important}
  .btn-red{display:inline-flex;align-items:center;gap:10px;font-family:var(--cormorant-font);font-size:11px;letter-spacing:.25em;text-transform:uppercase;padding:18px 44px;background:#DC2626;color:#fff;text-decoration:none;border-radius:9999px;transition:background .3s,box-shadow .3s;box-shadow:0 0 30px rgba(220,38,38,.15)}
  .btn-red:hover{background:#b91c1c;box-shadow:0 0 50px rgba(220,38,38,.4)}
  .btn-ghost{display:inline-flex;align-items:center;gap:10px;font-family:var(--cormorant-font);font-size:11px;letter-spacing:.25em;text-transform:uppercase;padding:18px 44px;border:1px solid rgba(255,255,255,.18);color:rgba(255,255,255,.7);text-decoration:none;border-radius:9999px;transition:all .3s}
  .btn-ghost:hover{border-color:#DC2626;color:#DC2626}
  .feat-card{background:rgba(255,255,255,.02);border:1px solid rgba(255,255,255,.06);border-radius:18px;padding:32px;transition:border-color .4s,background .4s,transform .4s}
  .feat-card:hover{border-color:rgba(220,38,38,.25);background:rgba(255,255,255,.04);transform:translateY(-4px)}
  .prod-card{background:#080808;border:1px solid rgba(255,255,255,.05);border-radius:18px;overflow:hidden;transition:border-color .3s,transform .4s;display:flex;flex-direction:column}
  .prod-card:hover{border-color:rgba(220,38,38,.25);transform:translateY(-6px)}
  .ev-card{position:relative;overflow:hidden;border-radius:14px;background:#080808;cursor:pointer}
  .ev-card .img-inner{transition:transform 1.3s cubic-bezier(.16,1,.3,1)}
  .ev-card:hover .img-inner{transform:scale(1.1)}
  .slide-enter{animation:fadeZoomIn .8s cubic-bezier(.16,1,.3,1) forwards}
  .slide-exit{animation:fadeZoomOut .8s cubic-bezier(.16,1,.3,1) forwards}
  @keyframes fadeZoomIn{from{opacity:0;transform:scale(1.04)}to{opacity:1;transform:scale(1)}}
  @keyframes fadeZoomOut{from{opacity:1;transform:scale(1)}to{opacity:0;transform:scale(.97)}}
  .dot{width:6px;height:6px;border-radius:3px;background:rgba(255,255,255,.3);cursor:pointer;transition:all .4s}
  .dot.active{width:24px;background:#DC2626}
  .grain::after{content:'';position:absolute;inset:0;background-image:url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='.03'/%3E%3C/svg%3E");pointer-events:none;z-index:5}
  @media(max-width:767px){.md-hide{display:none!important}.grid-2col{grid-template-columns:1fr!important}.grid-4col{grid-template-columns:repeat(2,1fr)!important}}
`

export default function Home() {
  const [productos, setProductos] = useState<Producto[]>([])
  const [eventos,   setEventos]   = useState<Evento[]>([])
  const [slide,     setSlide]     = useState(0)
  const [exiting,   setExiting]   = useState(false)
  const [scrollPct, setScrollPct] = useState(0)
  const [zoomSrc,   setZoomSrc]   = useState<string | null>(null)
  const timerRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)

  /* ESC closes lightbox */
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setZoomSrc(null) }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  /* API */
  useEffect(() => {
    getProductos().then(r => setProductos(r.data)).catch(() => {})
    getEventos().then(r => setEventos(r.data)).catch(() => {})
  }, [])

  /* Reveal on scroll */
  useEffect(() => {
    const obs = new IntersectionObserver(entries => {
      entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('in') })
    }, { threshold: 0.08, rootMargin: '0px 0px -50px 0px' })
    document.querySelectorAll('.reveal').forEach(el => obs.observe(el))
    return () => obs.disconnect()
  }, [productos, eventos])

  /* Scroll progress */
  useEffect(() => {
    const onScroll = () => {
      const total = document.documentElement.scrollHeight - window.innerHeight
      setScrollPct(total > 0 ? (window.scrollY / total) * 100 : 0)
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  /* Carousel */
  const slides = [CASCADA_SLIDE, ...productos.map(p => ({
    id: p.id,
    label: p.categoria,
    title: p.nombre,
    sub: '',
    img: getImgUrl(p.img),
    isLocal: false,
    cta: { text: 'Cotizar Pedido', href: WA(`Hola Damián! Quiero consultar por ${p.nombre} 🎂`), external: true },
  }))]
  const total = slides.length

  const goTo = useCallback((n: number) => {
    setExiting(true)
    setTimeout(() => { setSlide(n); setExiting(false) }, 300)
  }, [])

  const next = useCallback(() => goTo((slide + 1) % total), [slide, total, goTo])

  useEffect(() => {
    if (total <= 1) return
    timerRef.current = setTimeout(next, 5500)
    return () => clearTimeout(timerRef.current)
  }, [slide, total, next])

  const cur = slides[slide] ?? CASCADA_SLIDE

  /* ─── render ──────────────────────────────────────────────── */
  return (
    <>
      <style>{CSS}</style>
      <Navbar />

      {/* Barra de progreso de scroll */}
      <div style={{ position: 'fixed', top: 0, left: 0, zIndex: 100, width: `${scrollPct}%`, height: 2, background: '#DC2626', transition: 'width .1s linear', pointerEvents: 'none' }} />

      <main style={{ background: '#050505', overflowX: 'hidden', color: '#FAF7F2' }}>

        {/* ═══════════════════════════════════════════════════════
            HERO — título gigante sobre imagen
        ══════════════════════════════════════════════════════════ */}
        <section style={{ position: 'relative', height: '100dvh', overflow: 'hidden', background: '#000', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <video
            autoPlay muted loop playsInline
            style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', filter: 'brightness(0.38)', zIndex: 0 }}
          >
            <source src="/cascada.mp4" type="video/mp4" />
          </video>
          <div style={{ position: 'absolute', inset: 0, zIndex: 1, background: 'linear-gradient(to bottom, rgba(0,0,0,.2) 0%, transparent 50%, #050505 100%)' }} />
          <div style={{ position: 'relative', zIndex: 2, textAlign: 'center', padding: '0 24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 18, marginBottom: 28 }}>
              <div style={{ width: 48, height: 1, background: 'rgba(220,38,38,.6)' }} />
              <span style={{ fontFamily: C, fontSize: 11, letterSpacing: '0.45em', textTransform: 'uppercase', color: 'rgba(255,255,255,.5)' }}>Alta Pastelería & Eventos</span>
              <div style={{ width: 48, height: 1, background: 'rgba(220,38,38,.6)' }} />
            </div>
            <h1 style={{ fontFamily: P, fontSize: 'clamp(5.5rem,20vw,16rem)', lineHeight: 0.83, letterSpacing: '-0.02em', color: 'rgba(255,255,255,.92)', marginBottom: 24 }}>
              Dolche<em style={{ color: '#DC2626', fontStyle: 'normal' }}>&apos;</em>B
            </h1>
            <p style={{ fontFamily: C, fontSize: 'clamp(1rem,2vw,1.3rem)', letterSpacing: '0.38em', textTransform: 'uppercase', color: 'rgba(255,255,255,.45)', marginBottom: 52 }}>
              Damián Borelli
            </p>
            <div style={{ display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap' }}>
              <a href="#showcase" className="btn-red">Explorar →</a>
              <a href="#contacto" className="btn-ghost">Cotizar Evento</a>
            </div>
          </div>
          {/* Scroll hint */}
          <div style={{ position: 'absolute', bottom: 36, left: '50%', transform: 'translateX(-50%)', zIndex: 3, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
            <span style={{ fontFamily: C, fontSize: 10, letterSpacing: '0.3em', textTransform: 'uppercase', color: 'rgba(255,255,255,.25)' }}>scroll</span>
            <div style={{ width: 1, height: 48, background: 'linear-gradient(to bottom, rgba(220,38,38,.6), transparent)' }} />
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════
            SHOWCASE CAROUSEL — cascada + productos de la API
        ══════════════════════════════════════════════════════════ */}
        <section id="showcase" style={{ position: 'relative', height: '100dvh', overflow: 'hidden', background: '#000' }}>

          {/* Slide actual */}
          <div key={slide} className={exiting ? 'slide-exit' : 'slide-enter'} style={{ position: 'absolute', inset: 0 }}>
            {cur.isLocal ? (
              <Image src={cur.img} alt="" fill style={{ objectFit: 'cover', filter: 'brightness(.35)', zIndex: 0 }} />
            ) : cur.img ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={cur.img} alt="" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', filter: 'brightness(.35)', zIndex: 0 }} />
            ) : (
              <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at 30% 50%, rgba(60,10,10,.8), #000)', zIndex: 0 }} />
            )}
          </div>

          {/* Overlay gradiente */}
          <div style={{ position: 'absolute', inset: 0, zIndex: 1, background: 'linear-gradient(135deg, rgba(0,0,0,.5) 0%, rgba(0,0,0,.2) 50%, rgba(220,38,38,.08) 100%)' }} />

          {/* Línea decorativa izquierda */}
          <div style={{ position: 'absolute', left: 48, top: 0, bottom: 0, zIndex: 3, display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 12 }} className="md-hide">
            {slides.map((_, i) => (
              <button key={i} onClick={() => goTo(i)} className={`dot ${i === slide ? 'active' : ''}`} style={{ border: 'none', cursor: 'pointer' }} />
            ))}
          </div>

          {/* Contenido del slide */}
          <div style={{ position: 'absolute', inset: 0, zIndex: 2, display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', padding: 'clamp(40px,6vw,100px)' }}>
            <div key={`content-${slide}`} style={{ animation: 'fadeZoomIn .9s cubic-bezier(.16,1,.3,1) forwards', maxWidth: 700 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
                <div style={{ width: 32, height: 1, background: '#DC2626' }} />
                <span style={{ fontFamily: C, fontSize: 11, letterSpacing: '0.45em', textTransform: 'uppercase', color: 'rgba(220,38,38,.9)' }}>{cur.label}</span>
              </div>
              <h2 style={{ fontFamily: P, fontSize: 'clamp(3rem,7vw,7rem)', fontWeight: 400, lineHeight: 0.9, color: '#FAF7F2', marginBottom: cur.sub ? 20 : 36, whiteSpace: 'pre-line' }}>
                {cur.title}
              </h2>
              {cur.sub && (
                <p style={{ fontFamily: C, fontSize: 'clamp(1.1rem,2vw,1.4rem)', color: 'rgba(255,255,255,.5)', marginBottom: 36, letterSpacing: '0.02em' }}>{cur.sub}</p>
              )}
              <a href={cur.cta.href} target={cur.cta.external ? '_blank' : undefined} rel="noreferrer" className="btn-red">
                {cur.cta.text} →
              </a>
            </div>

            {/* Dots mobile + counter */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginTop: 40 }}>
              <div style={{ display: 'flex', gap: 8 }}>
                {slides.map((_, i) => (
                  <button key={i} onClick={() => goTo(i)} className={`dot ${i === slide ? 'active' : ''}`} style={{ border: 'none', cursor: 'pointer' }} />
                ))}
              </div>
              <span style={{ fontFamily: C, fontSize: 12, color: 'rgba(255,255,255,.25)', letterSpacing: '0.15em' }}>
                {String(slide + 1).padStart(2,'0')} / {String(total).padStart(2,'0')}
              </span>
            </div>
          </div>

          {/* Flechas */}
          <button onClick={() => goTo((slide - 1 + total) % total)} style={{ position: 'absolute', right: 80, bottom: 'clamp(40px,6vw,90px)', zIndex: 4, background: 'rgba(255,255,255,.06)', border: '1px solid rgba(255,255,255,.1)', color: '#fff', width: 48, height: 48, borderRadius: '50%', cursor: 'pointer', fontSize: 18, transition: 'all .3s', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            onMouseEnter={e => { e.currentTarget.style.background = '#DC2626'; e.currentTarget.style.borderColor = '#DC2626' }}
            onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,.06)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,.1)' }}>‹</button>
          <button onClick={() => goTo((slide + 1) % total)} style={{ position: 'absolute', right: 24, bottom: 'clamp(40px,6vw,90px)', zIndex: 4, background: 'rgba(255,255,255,.06)', border: '1px solid rgba(255,255,255,.1)', color: '#fff', width: 48, height: 48, borderRadius: '50%', cursor: 'pointer', fontSize: 18, transition: 'all .3s', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            onMouseEnter={e => { e.currentTarget.style.background = '#DC2626'; e.currentTarget.style.borderColor = '#DC2626' }}
            onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,.06)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,.1)' }}>›</button>
        </section>

        {/* ═══════════════════════════════════════════════════════
            CASCADA DE CHOCOLATE
        ══════════════════════════════════════════════════════════ */}
        <section id="cascada" className="grain" style={{ position: 'relative', background: '#0A0A0A', borderTop: '1px solid rgba(255,255,255,.05)', padding: 'clamp(80px,10vw,140px) 24px', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', top: -100, left: '50%', transform: 'translateX(-50%)', width: 900, height: 900, background: 'radial-gradient(circle, rgba(220,38,38,.035) 0%, transparent 70%)', pointerEvents: 'none' }} />

          <div style={{ maxWidth: 1100, margin: '0 auto' }}>

            <div className="reveal" style={{ textAlign: 'center', marginBottom: 72 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 16, marginBottom: 22 }}>
                <div style={{ width: 48, height: 1, background: 'linear-gradient(to right,transparent,rgba(220,38,38,.7))' }} />
                <span style={{ fontFamily: C, fontSize: 10, letterSpacing: '0.5em', textTransform: 'uppercase', color: 'rgba(220,38,38,.8)' }}>Experiencia Dolche&apos;B</span>
                <div style={{ width: 48, height: 1, background: 'linear-gradient(to left,transparent,rgba(220,38,38,.7))' }} />
              </div>
              <h2 style={{ fontFamily: P, fontSize: 'clamp(2.4rem,5vw,4.8rem)', fontWeight: 400, lineHeight: 1.02, marginBottom: 22 }}>
                Cascada de Chocolate<br /><em style={{ color: '#DC2626' }}>para Eventos</em>
              </h2>
              <p style={{ fontFamily: C, fontSize: 'clamp(1.1rem,2vw,1.3rem)', color: 'rgba(255,255,255,.75)', maxWidth: 640, margin: '0 auto', lineHeight: 1.8 }}>
                Una cascada de chocolate premium que se convierte en el centro de atención de cualquier celebración. Una experiencia interactiva, original y llena de sabor.
              </p>
            </div>

            {/* Grid ideal para */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 14, marginBottom: 72 }} className="grid-4col">
              {[['🎉','Cumpleaños'],['💍','Casamientos'],['🎊','Eventos Sociales'],['🥳','Celebraciones']].map(([ico,lbl],i) => (
                <div key={lbl} className={`feat-card reveal d${i+1}`} style={{ textAlign: 'center' }}>
                  <span style={{ fontSize: 34, display: 'block', marginBottom: 12 }}>{ico}</span>
                  <span style={{ fontFamily: C, fontSize: 13, letterSpacing: '0.15em', textTransform: 'uppercase', color: 'rgba(255,255,255,.65)' }}>{lbl}</span>
                </div>
              ))}
            </div>

            {/* Acompañamientos + Incluye en dos columnas */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 40, marginBottom: 64 }} className="grid-2col">
              <div className="reveal">
                <p style={{ fontFamily: C, fontSize: 10, letterSpacing: '0.4em', textTransform: 'uppercase', color: 'rgba(220,38,38,.7)', marginBottom: 24 }}>Acompañamientos</p>
                {[['Frutas frescas','Frutillas, kiwi, melón, banana, pera, ananá, uvas, duraznos.'],['Bocaditos dulces','Conitos, cubanitos, malvaviscos, cañoncitos y alfajorcitos.'],['Galletitas','De chocolate y vainilla.'],['Pastelería artesanal','Brownies, alfajores, trufas, medialunitas y más delicias.']].map(([t,d]) => (
                  <div key={t} style={{ padding: '16px 0', borderBottom: '1px solid rgba(255,255,255,.05)' }}>
                    <p style={{ fontFamily: P, fontSize: '1rem', color: 'rgba(255,255,255,.85)', marginBottom: 4 }}>{t}</p>
                    <p style={{ fontFamily: C, fontSize: '0.9rem', color: 'rgba(255,255,255,.68)', lineHeight: 1.7 }}>{d}</p>
                  </div>
                ))}
              </div>
              <div className="reveal d1">
                <p style={{ fontFamily: C, fontSize: 10, letterSpacing: '0.4em', textTransform: 'uppercase', color: 'rgba(220,38,38,.7)', marginBottom: 24 }}>Qué incluye</p>
                {['Cascada de chocolate Premium (blanco o negro).','Dos tamaños: grande o chico según el evento.','Traslado e instalación del equipo.','Operador presente durante todo el evento.','Vajilla, descartables y mantelería incluidos.','Servicio 2 horas, con opción de extender.'].map(item => (
                  <div key={item} style={{ display: 'flex', gap: 12, padding: '14px 0', borderBottom: '1px solid rgba(255,255,255,.05)' }}>
                    <span style={{ color: '#DC2626', flexShrink: 0, marginTop: 2 }}>✔</span>
                    <p style={{ fontFamily: C, fontSize: '0.95rem', color: 'rgba(255,255,255,.78)', lineHeight: 1.65 }}>{item}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="reveal" style={{ textAlign: 'center', borderTop: '1px solid rgba(255,255,255,.06)', paddingTop: 52 }}>
              <a href={WA('Hola Damián! Me interesa la Cascada de Chocolate para mi evento 🍫🎉')} target="_blank" rel="noreferrer" className="btn-red">Consultar por la Cascada →</a>
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════
            TORTAS PERSONALIZADAS
        ══════════════════════════════════════════════════════════ */}
        <section id="tortas" style={{ position: 'relative', background: '#050505', borderTop: '1px solid rgba(255,255,255,.05)', padding: 'clamp(80px,10vw,140px) 24px', overflow: 'hidden' }}>
          <div style={{ maxWidth: 1200, margin: '0 auto' }}>
            <div className="reveal" style={{ textAlign: 'center', marginBottom: 64 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 16, marginBottom: 22 }}>
                <div style={{ width: 48, height: 1, background: 'linear-gradient(to right,transparent,rgba(245,158,11,.5))' }} />
                <span style={{ fontFamily: C, fontSize: 10, letterSpacing: '0.5em', textTransform: 'uppercase', color: 'rgba(245,158,11,.8)' }}>Pastelería de Autor</span>
                <div style={{ width: 48, height: 1, background: 'linear-gradient(to left,transparent,rgba(245,158,11,.5))' }} />
              </div>
              <h2 style={{ fontFamily: P, fontSize: 'clamp(2.5rem,5.5vw,5rem)', fontWeight: 400, lineHeight: 1, marginBottom: 20 }}>
                Tortas<br /><em style={{ color: '#DC2626' }}>Personalizadas</em>
              </h2>
              <p style={{ fontFamily: C, fontSize: 'clamp(1.1rem,2vw,1.25rem)', color: 'rgba(255,255,255,.72)', maxWidth: 560, margin: '0 auto', lineHeight: 1.8 }}>
                Diseños exclusivos para cada celebración. Desde fondant hasta naked cakes florales — cada torta es una obra de arte comestible.
              </p>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 20, marginBottom: 52 }} className="grid-2col">
              {[['🎂','Diseño Único','Cada torta creada según tus gustos y la temática de tu evento.'],['✨','Ingredientes Premium','Ingredientes seleccionados para garantizar un sabor inolvidable.'],['🎨','Arte Comestible','Fondant, buttercream, naked cakes, drip cakes. Todas las técnicas.']].map(([ico,t,d],i) => (
                <div key={t} className={`feat-card reveal d${i+1}`} style={{ textAlign: 'center' }}>
                  <span style={{ fontSize: 38, display: 'block', marginBottom: 18 }}>{ico}</span>
                  <h4 style={{ fontFamily: P, fontSize: '1.15rem', color: 'rgba(255,255,255,.9)', marginBottom: 10 }}>{t}</h4>
                  <p style={{ fontFamily: C, fontSize: '0.95rem', color: 'rgba(255,255,255,.7)', lineHeight: 1.75 }}>{d}</p>
                </div>
              ))}
            </div>
            <div className="reveal" style={{ display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap' }}>
              <a href="#catalogo" className="btn-red">Ver Catálogo →</a>
              <a href={WA('Hola Damián! Quiero consultar por una torta personalizada 🎂')} target="_blank" rel="noreferrer" className="btn-ghost">Cotizar Mi Torta</a>
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════
            MESAS DULCES
        ══════════════════════════════════════════════════════════ */}
        <section id="mesas-dulces" style={{ position: 'relative', background: '#0A0A0A', borderTop: '1px solid rgba(255,255,255,.05)', padding: 'clamp(80px,10vw,140px) 24px', overflow: 'hidden' }}>
          <div style={{ maxWidth: 1200, margin: '0 auto' }}>
            <div className="reveal" style={{ textAlign: 'center', marginBottom: 64 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 16, marginBottom: 22 }}>
                <div style={{ width: 48, height: 1, background: 'linear-gradient(to right,transparent,rgba(244,63,94,.5))' }} />
                <span style={{ fontFamily: C, fontSize: 10, letterSpacing: '0.5em', textTransform: 'uppercase', color: 'rgba(244,63,94,.8)' }}>Experiencia Gourmet</span>
                <div style={{ width: 48, height: 1, background: 'linear-gradient(to left,transparent,rgba(244,63,94,.5))' }} />
              </div>
              <h2 style={{ fontFamily: P, fontSize: 'clamp(2.5rem,5.5vw,5rem)', fontWeight: 400, lineHeight: 1, marginBottom: 20 }}>
                Mesas Dulces<br /><em style={{ color: '#DC2626' }}>Premium</em>
              </h2>
              <p style={{ fontFamily: C, fontSize: 'clamp(1.1rem,2vw,1.25rem)', color: 'rgba(255,255,255,.72)', maxWidth: 560, margin: '0 auto', lineHeight: 1.8 }}>
                Bocaditos de autor, shots, tartas y pastelería moderna para deslumbrar a tus invitados.
              </p>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: 20, marginBottom: 52 }} className="grid-2col">
              {[['🍰','Bocaditos de Autor','Petit fours, macarons, mini tartaletas y bombones artesanales.'],['🥂','Shots & Vasitos','Mousse, tiramisú, cheesecake y cremas en presentaciones elegantes.'],['🧁','Pastelería Clásica','Alfajores de maicena, brownies, cookies, medialunas rellenas.'],['🍫','Mesa Personalizada','Diseño y decoración adaptados a la paleta y temática de tu evento.']].map(([ico,t,d],i) => (
                <div key={t} style={{ display: 'flex', gap: 20, alignItems: 'flex-start' }} className={`feat-card reveal d${i+1}`}>
                  <span style={{ fontSize: 26, flexShrink: 0, marginTop: 2 }}>{ico}</span>
                  <div>
                    <h4 style={{ fontFamily: P, fontSize: '1.1rem', color: 'rgba(255,255,255,.88)', marginBottom: 8 }}>{t}</h4>
                    <p style={{ fontFamily: C, fontSize: '0.9rem', color: 'rgba(255,255,255,.7)', lineHeight: 1.75 }}>{d}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="reveal" style={{ textAlign: 'center' }}>
              <a href={WA('Hola Damián! Me interesa una Mesa Dulce Premium para mi evento 🍰🥂')} target="_blank" rel="noreferrer" className="btn-red">Cotizar Mesa Dulce →</a>
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════
            CATÁLOGO — grid de productos de la API
        ══════════════════════════════════════════════════════════ */}
        <section id="catalogo" style={{ background: '#050505', borderTop: '1px solid rgba(255,255,255,.05)', padding: 'clamp(80px,10vw,140px) 24px' }}>
          <div style={{ maxWidth: 1440, margin: '0 auto' }}>
            <div className="reveal" style={{ textAlign: 'center', marginBottom: 64 }}>
              <h2 style={{ fontFamily: P, fontSize: 'clamp(2.8rem,5vw,5rem)', fontWeight: 400, lineHeight: 1.1 }}>
                Catálogo de <em style={{ color: '#DC2626' }}>Especialidades</em>
              </h2>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(220px,1fr))', gap: 20 }}>
              {productos.length === 0
                ? [...Array(6)].map((_,i) => (
                    <div key={i} style={{ background: '#080808', border: '1px solid rgba(255,255,255,.05)', borderRadius: 18, overflow: 'hidden' }}>
                      <div style={{ aspectRatio: '4/5', background: 'rgba(255,255,255,.04)' }} />
                      <div style={{ padding: 24 }}>
                        <div style={{ height: 18, background: 'rgba(255,255,255,.07)', borderRadius: 4, width: '65%', marginBottom: 16 }} />
                        <div style={{ height: 38, background: 'rgba(255,255,255,.04)', borderRadius: 10 }} />
                      </div>
                    </div>
                  ))
                : productos.map((p, i) => (
                    <div key={p.id} className="prod-card reveal hover-scale" style={{ marginTop: p.offset ? 40 : 0, transitionDelay: `${(i % 5) * 0.07}s` }}>
                      <div style={{ aspectRatio: '4/5', overflow: 'hidden', position: 'relative', background: '#0d0d0d', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        {p.img && (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={getImgUrl(p.img)} alt={p.nombre}
                            className="img-inner zoomable"
                            onClick={() => setZoomSrc(getImgUrl(p.img))}
                            style={{ width: '100%', height: '100%', objectFit: 'contain', display: 'block', padding: 8 }}
                          />
                        )}
                      </div>
                      <div style={{ padding: '18px 22px 22px' }}>
                        <h3 style={{ fontFamily: P, fontSize: '1.05rem', color: 'rgba(255,255,255,.95)', marginBottom: 14, fontWeight: 400 }}>{p.nombre}</h3>
                        <a
                          href={WA(`Hola Damián! Quiero consultar por ${p.nombre} 🎂`)}
                          target="_blank" rel="noreferrer"
                          style={{ display: 'block', textAlign: 'center', fontFamily: C, fontSize: 11, letterSpacing: '0.2em', textTransform: 'uppercase', padding: '10px', border: '1px solid rgba(255,255,255,.15)', color: 'rgba(255,255,255,.7)', textDecoration: 'none', borderRadius: 10, transition: 'all .3s' }}
                          onMouseEnter={e => { e.currentTarget.style.borderColor = '#DC2626'; e.currentTarget.style.color = '#DC2626' }}
                          onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,.15)'; e.currentTarget.style.color = 'rgba(255,255,255,.7)' }}
                        >
                          Cotizar Pedido →
                        </a>
                      </div>
                    </div>
                  ))
              }
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════
            PORTFOLIO — masonry de eventos
        ══════════════════════════════════════════════════════════ */}
        <section id="eventos" style={{ background: '#0A0A0A', borderTop: '1px solid rgba(255,255,255,.05)', padding: 'clamp(80px,10vw,140px) 24px', overflow: 'hidden' }}>
          <div style={{ maxWidth: 1440, margin: '0 auto' }}>
            <div className="reveal" style={{ marginBottom: 56, display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 24, flexWrap: 'wrap' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 14 }}>
                  <div style={{ width: 28, height: 1, background: 'rgba(220,38,38,.4)' }} />
                  <span style={{ fontFamily: C, fontSize: 10, letterSpacing: '0.4em', textTransform: 'uppercase', color: 'rgba(220,38,38,.7)' }}>Portfolio</span>
                </div>
                <h2 style={{ fontFamily: P, fontSize: 'clamp(2.2rem,4vw,3.8rem)', fontWeight: 400, lineHeight: 1.05 }}>
                  Obras <em style={{ color: '#DC2626' }}>Realizadas</em>
                </h2>
              </div>
              <a href={WA('Hola Damián! Quiero consultar por un evento 🥂')} target="_blank" rel="noreferrer" style={{ fontFamily: C, fontSize: 11, letterSpacing: '0.25em', textTransform: 'uppercase', color: 'rgba(255,255,255,.35)', textDecoration: 'none', borderBottom: '1px solid rgba(255,255,255,.1)', paddingBottom: 2, transition: 'color .3s' }}
                onMouseEnter={e => (e.currentTarget.style.color = '#DC2626')}
                onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,.35)')}>
                Consultar →
              </a>
            </div>

            {eventos.length === 0
              ? (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 12 }}>
                  {[...Array(4)].map((_,i) => (
                    <div key={i} style={{ aspectRatio: i % 3 === 0 ? '3/4' : '3/5', background: '#080808', border: '1px solid rgba(255,255,255,.05)', borderRadius: 14 }} />
                  ))}
                </div>
              )
              : (
                /* Masonry simulado: dos columnas con heights variables */
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(260px,1fr))', gap: 14 }}>
                  {eventos.map((ev, i) => (
                    <div
                      key={ev.id} className="ev-card reveal zoomable"
                      style={{ aspectRatio: '4/3', transitionDelay: `${(i % 4) * 0.06}s` }}
                      onClick={() => ev.img && setZoomSrc(getImgUrl(ev.img))}
                    >
                      {ev.img && (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={getImgUrl(ev.img)} alt={ev.titulo} className="img-inner" style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center', display: 'block' }} />
                      )}
                      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,.82) 0%, transparent 50%)', transition: 'opacity .4s' }} />
                      <div style={{ position: 'absolute', bottom: 0, left: 0, padding: '16px 18px' }}>
                        <p style={{ fontFamily: C, fontSize: 10, letterSpacing: '0.3em', textTransform: 'uppercase', color: '#DC2626', marginBottom: 4 }}>{ev.categoria}</p>
                        <h3 style={{ fontFamily: P, fontSize: '1rem', color: '#FAF7F2', fontWeight: 400 }}>{ev.titulo}</h3>
                      </div>
                      {/* Zoom icon */}
                      <div style={{ position: 'absolute', top: 12, right: 12, width: 32, height: 32, borderRadius: '50%', background: 'rgba(0,0,0,.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: 0, transition: 'opacity .3s' }} className="zoom-icon">
                        <svg width="14" height="14" fill="none" stroke="#fff" strokeWidth="2" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35M11 8v6M8 11h6"/></svg>
                      </div>
                    </div>
                  ))}
                </div>
              )
            }
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════
            BANNER CTA
        ══════════════════════════════════════════════════════════ */}
        <section style={{ background: '#DC2626', padding: '64px 24px', textAlign: 'center' }}>
          <div style={{ maxWidth: 700, margin: '0 auto' }}>
            <h2 style={{ fontFamily: P, fontSize: 'clamp(2rem,4vw,3.5rem)', fontWeight: 400, color: '#fff', marginBottom: 16, lineHeight: 1.1 }}>
              ¿Tu próximo evento merece algo especial?
            </h2>
            <p style={{ fontFamily: C, fontSize: '1.2rem', color: 'rgba(255,255,255,.7)', marginBottom: 36, lineHeight: 1.7 }}>
              Escribinos y diseñamos juntos la experiencia perfecta para tu celebración.
            </p>
            <a href={WA('Hola Damián! Estuve viendo tu web y quiero consultar por un evento especial 🥂🍫')} target="_blank" rel="noreferrer" style={{ display: 'inline-flex', alignItems: 'center', gap: 10, fontFamily: C, fontSize: 12, letterSpacing: '0.25em', textTransform: 'uppercase', padding: '18px 48px', background: '#fff', color: '#DC2626', textDecoration: 'none', borderRadius: 9999, fontWeight: 600, transition: 'all .3s' }}
              onMouseEnter={e => { e.currentTarget.style.background = '#0E0C0C'; e.currentTarget.style.color = '#fff' }}
              onMouseLeave={e => { e.currentTarget.style.background = '#fff'; e.currentTarget.style.color = '#DC2626' }}>
              Escribir por WhatsApp →
            </a>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════
            FOOTER
        ══════════════════════════════════════════════════════════ */}
        <footer id="contacto" style={{ background: '#0a0a0a', borderTop: '1px solid rgba(220,38,38,0.18)' }}>

          {/* Main footer grid */}
          <div style={{ maxWidth: 1280, margin: '0 auto', padding: '72px 32px 48px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '48px 40px' }}>

            {/* Brand col */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <Image src="/logo.jpg" alt="Logo" width={48} height={48}
                  style={{ borderRadius: '50%', objectFit: 'cover', border: '1px solid rgba(220,38,38,0.5)', boxShadow: '0 0 18px rgba(220,38,38,0.3)' }} />
                <span style={{ fontFamily: P, fontSize: 22, color: '#fff', letterSpacing: '-0.01em' }}>
                  Dolche<em style={{ color: '#DC2626', fontStyle: 'normal' }}>&apos;</em>B
                </span>
              </div>
              <p style={{ fontFamily: C, fontSize: 16, color: 'rgba(255,255,255,0.72)', lineHeight: 1.7, maxWidth: 240 }}>
                Alta pastelería & catering en Tacuarendi, Santa Fe y Corrientes. Diseñamos momentos que se recuerdan.
              </p>
              {/* Decorative red line */}
              <div style={{ width: 48, height: 2, background: 'linear-gradient(90deg,#DC2626,transparent)', borderRadius: 2, marginTop: 4 }} />
            </div>

            {/* Links col */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <p style={{ fontFamily: C, fontSize: 11, letterSpacing: '0.25em', textTransform: 'uppercase', color: '#DC2626', marginBottom: 8 }}>Menú</p>
              {[
                { href: '#cascada',      label: 'Cascada de Chocolate' },
                { href: '#tortas',       label: 'Tortas'               },
                { href: '#mesas-dulces', label: 'Mesas Dulces'         },
                { href: '#catalogo',     label: 'Catálogo'             },
                { href: '#eventos',      label: 'Eventos'              },
              ].map(l => (
                <a key={l.href} href={l.href} style={{
                  fontFamily: C, fontSize: 16, color: 'rgba(255,255,255,0.75)',
                  textDecoration: 'none', transition: 'color 0.25s', display: 'inline-block',
                }}
                  onMouseEnter={e => (e.currentTarget.style.color = '#DC2626')}
                  onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.55)')}
                >{l.label}</a>
              ))}
            </div>

            {/* Contact col */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <p style={{ fontFamily: C, fontSize: 11, letterSpacing: '0.25em', textTransform: 'uppercase', color: '#DC2626', marginBottom: 8 }}>Contacto</p>
              <a href={WA('Hola Damián, quiero consultar sobre un evento')}
                target="_blank" rel="noopener noreferrer"
                style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none', transition: 'opacity 0.25s' }}
                onMouseEnter={e => (e.currentTarget.style.opacity = '0.75')}
                onMouseLeave={e => (e.currentTarget.style.opacity = '1')}
              >
                <span style={{ width: 36, height: 36, borderRadius: '50%', background: 'rgba(220,38,38,0.12)', border: '1px solid rgba(220,38,38,0.35)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <svg width="16" height="16" fill="#DC2626" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                </span>
                <div>
                  <p style={{ fontFamily: P, fontSize: 14, color: '#fff', margin: 0 }}>WhatsApp</p>
                  <p style={{ fontFamily: C, fontSize: 14, color: 'rgba(255,255,255,0.45)', margin: 0 }}>+54 9 3482 408180</p>
                </div>
              </a>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 4 }}>
                <span style={{ width: 36, height: 36, borderRadius: '50%', background: 'rgba(220,38,38,0.08)', border: '1px solid rgba(220,38,38,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <svg width="14" height="14" fill="none" stroke="#DC2626" strokeWidth="1.8" viewBox="0 0 24 24"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/><circle cx="12" cy="9" r="2.5"/></svg>
                </span>
                <div>
                  <p style={{ fontFamily: P, fontSize: 14, color: '#fff', margin: 0 }}>Tacuarendi</p>
                  <p style={{ fontFamily: C, fontSize: 14, color: 'rgba(255,255,255,0.45)', margin: 0 }}>Santa Fe y Corrientes, Argentina</p>
                </div>
              </div>
            </div>

            {/* CTA col */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <p style={{ fontFamily: C, fontSize: 11, letterSpacing: '0.25em', textTransform: 'uppercase', color: '#DC2626', marginBottom: 8 }}>¿Tenés un evento?</p>
              <p style={{ fontFamily: C, fontSize: 17, color: 'rgba(255,255,255,0.78)', lineHeight: 1.6 }}>Cotizá tu celebración con nosotros, sin compromiso.</p>
              <a href={WA('Hola Damián! Me gustaría cotizar un evento 🎂')}
                target="_blank" rel="noopener noreferrer"
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: 8,
                  background: '#DC2626', color: '#fff', fontFamily: C,
                  fontSize: 13, letterSpacing: '0.15em', textTransform: 'uppercase',
                  textDecoration: 'none', padding: '14px 24px', borderRadius: 2,
                  transition: 'background 0.3s, transform 0.3s', alignSelf: 'flex-start',
                }}
                onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.background = '#b91c1c'; (e.currentTarget as HTMLAnchorElement).style.transform = 'translateY(-2px)' }}
                onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.background = '#DC2626'; (e.currentTarget as HTMLAnchorElement).style.transform = 'translateY(0)' }}
              >
                Cotizar ahora
              </a>
            </div>

          </div>

          {/* Bottom bar */}
          <div style={{ borderTop: '1px solid rgba(255,255,255,0.08)', padding: '22px 32px', maxWidth: 1280, margin: '0 auto', display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: 8 }}>
            <p style={{ fontFamily: P, fontSize: 14, color: 'rgba(255,255,255,0.55)', margin: 0, letterSpacing: '0.02em' }}>
              © 2026 <span style={{ color: '#DC2626' }}>Dolche&apos;B</span> — Damián Borelli
            </p>
            <p style={{ fontFamily: C, fontSize: 13, color: 'rgba(255,255,255,0.38)', margin: 0, letterSpacing: '0.05em' }}>
              Desarrollado por <span style={{ color: '#DC2626', fontWeight: 500 }}>Franco Mora</span>
            </p>
          </div>

        </footer>

      </main>

      {/* ── LIGHTBOX ─────────────────────────────────────────── */}
      {zoomSrc && (
        <div
          onClick={() => setZoomSrc(null)}
          style={{
            position: 'fixed', inset: 0, zIndex: 999,
            background: 'rgba(0,0,0,0.94)', backdropFilter: 'blur(12px)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'zoom-out', padding: 24,
            animation: 'fadeZoomIn .25s cubic-bezier(.16,1,.3,1) forwards',
          }}
        >
          {/* Close button */}
          <button
            onClick={() => setZoomSrc(null)}
            style={{ position: 'absolute', top: 20, right: 20, background: 'rgba(255,255,255,.08)', border: '1px solid rgba(255,255,255,.15)', color: '#fff', width: 44, height: 44, borderRadius: '50%', cursor: 'pointer', fontSize: 20, display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'background .2s', zIndex: 10 }}
            onMouseEnter={e => (e.currentTarget.style.background = '#DC2626')}
            onMouseLeave={e => (e.currentTarget.style.background = 'rgba(255,255,255,.08)')}
          >×</button>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={zoomSrc} alt="zoom"
            onClick={e => e.stopPropagation()}
            style={{ maxWidth: '92vw', maxHeight: '90vh', objectFit: 'contain', borderRadius: 8, boxShadow: '0 32px 80px rgba(0,0,0,.8)', cursor: 'default' }}
          />
          <p style={{ position: 'absolute', bottom: 20, left: '50%', transform: 'translateX(-50%)', fontFamily: C, fontSize: 11, letterSpacing: '0.3em', textTransform: 'uppercase', color: 'rgba(255,255,255,.3)' }}>ESC para cerrar</p>
        </div>
      )}
    </>
  )
}
