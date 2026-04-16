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
  img: '/cascada.png',
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
  .hover-scale:hover .img-inner{transform:scale(1.07)}
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
  .ev-card:hover .img-inner{transform:scale(1.07)}
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
  const timerRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)

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
          <Image src="/cascada.png" alt="" fill priority style={{ objectFit: 'cover', filter: 'brightness(0.38)', zIndex: 0 }} />
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
              <p style={{ fontFamily: C, fontSize: 'clamp(1.1rem,2vw,1.3rem)', color: 'rgba(255,255,255,.45)', maxWidth: 640, margin: '0 auto', lineHeight: 1.8 }}>
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
                    <p style={{ fontFamily: C, fontSize: '0.9rem', color: 'rgba(255,255,255,.4)', lineHeight: 1.7 }}>{d}</p>
                  </div>
                ))}
              </div>
              <div className="reveal d1">
                <p style={{ fontFamily: C, fontSize: 10, letterSpacing: '0.4em', textTransform: 'uppercase', color: 'rgba(220,38,38,.7)', marginBottom: 24 }}>Qué incluye</p>
                {['Cascada de chocolate Premium (blanco o negro).','Dos tamaños: grande o chico según el evento.','Traslado e instalación del equipo.','Operador presente durante todo el evento.','Vajilla, descartables y mantelería incluidos.','Servicio 2 horas, con opción de extender.'].map(item => (
                  <div key={item} style={{ display: 'flex', gap: 12, padding: '14px 0', borderBottom: '1px solid rgba(255,255,255,.05)' }}>
                    <span style={{ color: '#DC2626', flexShrink: 0, marginTop: 2 }}>✔</span>
                    <p style={{ fontFamily: C, fontSize: '0.95rem', color: 'rgba(255,255,255,.55)', lineHeight: 1.65 }}>{item}</p>
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
              <p style={{ fontFamily: C, fontSize: 'clamp(1.1rem,2vw,1.25rem)', color: 'rgba(255,255,255,.4)', maxWidth: 560, margin: '0 auto', lineHeight: 1.8 }}>
                Diseños exclusivos para cada celebración. Desde fondant hasta naked cakes florales — cada torta es una obra de arte comestible.
              </p>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 20, marginBottom: 52 }} className="grid-2col">
              {[['🎂','Diseño Único','Cada torta creada según tus gustos y la temática de tu evento.'],['✨','Ingredientes Premium','Ingredientes seleccionados para garantizar un sabor inolvidable.'],['🎨','Arte Comestible','Fondant, buttercream, naked cakes, drip cakes. Todas las técnicas.']].map(([ico,t,d],i) => (
                <div key={t} className={`feat-card reveal d${i+1}`} style={{ textAlign: 'center' }}>
                  <span style={{ fontSize: 38, display: 'block', marginBottom: 18 }}>{ico}</span>
                  <h4 style={{ fontFamily: P, fontSize: '1.15rem', color: 'rgba(255,255,255,.9)', marginBottom: 10 }}>{t}</h4>
                  <p style={{ fontFamily: C, fontSize: '0.95rem', color: 'rgba(255,255,255,.38)', lineHeight: 1.75 }}>{d}</p>
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
              <p style={{ fontFamily: C, fontSize: 'clamp(1.1rem,2vw,1.25rem)', color: 'rgba(255,255,255,.4)', maxWidth: 560, margin: '0 auto', lineHeight: 1.8 }}>
                Bocaditos de autor, shots, tartas y pastelería moderna para deslumbrar a tus invitados.
              </p>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: 20, marginBottom: 52 }} className="grid-2col">
              {[['🍰','Bocaditos de Autor','Petit fours, macarons, mini tartaletas y bombones artesanales.'],['🥂','Shots & Vasitos','Mousse, tiramisú, cheesecake y cremas en presentaciones elegantes.'],['🧁','Pastelería Clásica','Alfajores de maicena, brownies, cookies, medialunas rellenas.'],['🍫','Mesa Personalizada','Diseño y decoración adaptados a la paleta y temática de tu evento.']].map(([ico,t,d],i) => (
                <div key={t} style={{ display: 'flex', gap: 20, alignItems: 'flex-start' }} className={`feat-card reveal d${i+1}`}>
                  <span style={{ fontSize: 26, flexShrink: 0, marginTop: 2 }}>{ico}</span>
                  <div>
                    <h4 style={{ fontFamily: P, fontSize: '1.1rem', color: 'rgba(255,255,255,.88)', marginBottom: 8 }}>{t}</h4>
                    <p style={{ fontFamily: C, fontSize: '0.9rem', color: 'rgba(255,255,255,.38)', lineHeight: 1.75 }}>{d}</p>
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
                      <div style={{ aspectRatio: '4/5', overflow: 'hidden', position: 'relative', background: '#111' }}>
                        {p.img && (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={getImgUrl(p.img)} alt={p.nombre} className="img-inner" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                        )}
                      </div>
                      <div style={{ padding: '18px 22px 22px' }}>
                        <h3 style={{ fontFamily: P, fontSize: '1.05rem', color: 'rgba(255,255,255,.9)', marginBottom: 14, fontWeight: 400 }}>{p.nombre}</h3>
                        <a
                          href={WA(`Hola Damián! Quiero consultar por ${p.nombre} 🎂`)}
                          target="_blank" rel="noreferrer"
                          style={{ display: 'block', textAlign: 'center', fontFamily: C, fontSize: 11, letterSpacing: '0.2em', textTransform: 'uppercase', padding: '10px', border: '1px solid rgba(255,255,255,.09)', color: 'rgba(255,255,255,.45)', textDecoration: 'none', borderRadius: 10, transition: 'all .3s' }}
                          onMouseEnter={e => { e.currentTarget.style.borderColor = '#DC2626'; e.currentTarget.style.color = '#DC2626' }}
                          onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,.09)'; e.currentTarget.style.color = 'rgba(255,255,255,.45)' }}
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
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(200px,1fr))', gap: 12 }}>
                  {eventos.map((ev, i) => (
                    <div key={ev.id} className="ev-card reveal" style={{ aspectRatio: i % 5 === 0 ? '4/5' : i % 3 === 0 ? '3/4' : '2/3', transitionDelay: `${(i % 4) * 0.06}s` }}>
                      {ev.img && (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={getImgUrl(ev.img)} alt={ev.titulo} className="img-inner" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                      )}
                      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,.78) 0%, transparent 55%)', transition: 'opacity .4s' }} />
                      <div style={{ position: 'absolute', bottom: 0, left: 0, padding: '18px 18px' }}>
                        <p style={{ fontFamily: C, fontSize: 10, letterSpacing: '0.3em', textTransform: 'uppercase', color: '#DC2626', marginBottom: 4 }}>{ev.categoria}</p>
                        <h3 style={{ fontFamily: P, fontSize: '1rem', color: '#FAF7F2', fontWeight: 400 }}>{ev.titulo}</h3>
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
        <footer id="contacto" style={{ background: '#020202', borderTop: '1px solid rgba(255,255,255,.05)' }}>
          <div style={{ maxWidth: 1440, margin: '0 auto', padding: '20px 24px', display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: 12 }}>
            <p style={{ fontFamily: P, fontSize: 12, color: 'rgba(255,255,255,.2)', letterSpacing: '0.05em' }}>
              Desarrollado por <span style={{ color: 'rgba(255,255,255,.35)' }}>Franco Mora</span>
            </p>
            <p style={{ fontFamily: C, fontSize: 10, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(255,255,255,.15)' }}>© 2026 Dolche&apos;B</p>
          </div>
        </footer>

      </main>
    </>
  )
}
