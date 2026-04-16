'use client'
import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import Navbar from '@/components/Navbar'
import { getProductos, getEventos, getImgUrl } from '@/lib/api'

const P = 'var(--playfair-font)'
const C = 'var(--cormorant-font)'

const WA_BASE = 'https://wa.me/5493482408180?text='
const wa = (msg: string) => WA_BASE + encodeURIComponent(msg)

interface Producto { id: number; nombre: string; categoria: string; img: string; offset: boolean }
interface Evento   { id: number; titulo: string; categoria: string; img: string }

/* ─────────────────────────── helpers ─────────────────────────── */
function reveal(el: Element) {
  el.classList.add('visible')
}

export default function Home() {
  const [productos, setProductos] = useState<Producto[]>([])
  const [eventos,   setEventos]   = useState<Evento[]>([])
  const [loadingP,  setLoadingP]  = useState(true)
  const [loadingE,  setLoadingE]  = useState(true)
  const heroRef = useRef<HTMLElement>(null)

  useEffect(() => {
    getProductos().then(r => setProductos(r.data)).finally(() => setLoadingP(false))
    getEventos().then(r => setEventos(r.data)).finally(() => setLoadingE(false))
  }, [])

  /* Intersection observer for reveal animations */
  useEffect(() => {
    const obs = new IntersectionObserver(entries => {
      entries.forEach(e => { if (e.isIntersecting) reveal(e.target) })
    }, { threshold: 0.1, rootMargin: '0px 0px -60px 0px' })
    document.querySelectorAll('.reveal').forEach(el => obs.observe(el))
    return () => obs.disconnect()
  }, [productos, eventos])

  /* Parallax hero */
  useEffect(() => {
    const hero = heroRef.current
    if (!hero) return
    const onScroll = () => {
      const y = window.scrollY
      const video = hero.querySelector('.hero-bg') as HTMLElement
      if (video) video.style.transform = `translateY(${y * 0.3}px)`
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <>
      <style>{`
        .reveal { opacity: 0; transform: translateY(40px); transition: opacity 0.9s cubic-bezier(.16,1,.3,1), transform 0.9s cubic-bezier(.16,1,.3,1); }
        .reveal.visible { opacity: 1; transform: translateY(0); }
        .reveal-d1 { transition-delay: 0.1s; }
        .reveal-d2 { transition-delay: 0.2s; }
        .reveal-d3 { transition-delay: 0.3s; }
        .card-img { transition: transform 1.2s cubic-bezier(.16,1,.3,1); }
        .card-img:hover { transform: scale(1.05); }
        .btn-red { display: inline-flex; align-items: center; gap: 10px; font-family: var(--cormorant-font); font-size: 11px; letter-spacing: .25em; text-transform: uppercase; padding: 18px 44px; background: #DC2626; color: #fff; text-decoration: none; border-radius: 9999px; transition: background .3s, box-shadow .3s; box-shadow: 0 0 30px rgba(220,38,38,.15); }
        .btn-red:hover { background: #b91c1c; box-shadow: 0 0 40px rgba(220,38,38,.35); }
        .btn-outline { display: inline-flex; align-items: center; gap: 10px; font-family: var(--cormorant-font); font-size: 11px; letter-spacing: .25em; text-transform: uppercase; padding: 18px 44px; border: 1px solid rgba(255,255,255,.15); color: rgba(255,255,255,.7); text-decoration: none; border-radius: 9999px; transition: all .3s; }
        .btn-outline:hover { border-color: #DC2626; color: #DC2626; }
        .feature-card { background: rgba(255,255,255,.02); border: 1px solid rgba(255,255,255,.06); border-radius: 16px; padding: 32px; transition: border-color .4s, background .4s; }
        .feature-card:hover { border-color: rgba(220,38,38,.2); background: rgba(255,255,255,.04); }
        .check-item { display: flex; align-items: flex-start; gap: 16px; padding: 18px 0; border-bottom: 1px solid rgba(255,255,255,.05); }
        .check-item:last-child { border-bottom: none; }
        .include-card { background: rgba(255,255,255,.015); border: 1px solid rgba(255,255,255,.05); border-radius: 16px; padding: 28px 32px; transition: border-color .4s; }
        .include-card:hover { border-color: rgba(220,38,38,.15); }
        .product-card { background: #080808; border: 1px solid rgba(255,255,255,.05); border-radius: 16px; overflow: hidden; display: flex; flex-direction: column; transition: border-color .3s; }
        .product-card:hover { border-color: rgba(220,38,38,.2); }
        .event-card { position: relative; overflow: hidden; border-radius: 12px; background: #080808; }
        .event-card:hover .card-img { transform: scale(1.06); }
        @media(max-width:768px) { .grid-cols-4 { grid-template-columns: repeat(2,1fr) !important; } }
      `}</style>

      <Navbar />

      <main style={{ background: '#050505', overflowX: 'hidden', color: '#FAF7F2' }}>

        {/* ═══════════════════════════════════════════
            HERO — pantalla completa
        ═══════════════════════════════════════════ */}
        <section ref={heroRef} style={{ position: 'relative', height: '100dvh', overflow: 'hidden', background: '#000', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <video
            autoPlay loop muted playsInline
            className="hero-bg"
            style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', filter: 'brightness(0.45)', zIndex: 0 }}
          >
            <source src="/cascada.mp4" type="video/mp4" />
          </video>
          {/* fallback image si no hay video */}
          <Image
            src="/cascada.png"
            alt=""
            fill
            priority
            className="hero-bg"
            style={{ objectFit: 'cover', filter: 'brightness(0.45)', zIndex: 0 }}
          />
          <div style={{ position: 'absolute', inset: 0, zIndex: 1, background: 'linear-gradient(to bottom, rgba(0,0,0,.25) 0%, transparent 50%, #050505 100%)' }} />

          <div style={{ position: 'relative', zIndex: 2, textAlign: 'center', padding: '0 24px' }}>
            <h1 style={{ fontFamily: P, fontSize: 'clamp(5rem,18vw,14rem)', lineHeight: 0.85, letterSpacing: '-0.02em', color: 'rgba(255,255,255,.9)', marginBottom: 16 }}>
              Dolche<em style={{ color: '#DC2626', fontStyle: 'normal' }}>&apos;</em>B
            </h1>
            <p style={{ fontFamily: C, fontSize: 'clamp(1rem,2vw,1.4rem)', letterSpacing: '0.4em', textTransform: 'uppercase', color: 'rgba(255,255,255,.55)', marginBottom: 48 }}>
              Damián Borelli
            </p>
            <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' }}>
              <a href="#cascada" className="btn-red">Cascada de Chocolate</a>
              <a href="#catalogo" className="btn-outline">Ver Catálogo</a>
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════
            CASCADA DE CHOCOLATE
        ═══════════════════════════════════════════ */}
        <section id="cascada" style={{ position: 'relative', background: '#0A0A0A', borderTop: '1px solid rgba(255,255,255,.05)', overflow: 'hidden', padding: '120px 24px' }}>
          <div style={{ position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)', width: 800, height: 800, background: 'rgba(220,38,38,.02)', borderRadius: '50%', filter: 'blur(200px)', pointerEvents: 'none' }} />

          <div style={{ maxWidth: 1100, margin: '0 auto' }}>

            {/* Header */}
            <div className="reveal" style={{ textAlign: 'center', marginBottom: 80 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 16, marginBottom: 24 }}>
                <div style={{ width: 48, height: 1, background: 'linear-gradient(to right, transparent, rgba(220,38,38,.6))' }} />
                <span style={{ fontFamily: C, fontSize: 10, letterSpacing: '0.5em', textTransform: 'uppercase', color: 'rgba(220,38,38,.8)' }}>Experiencia Dolche&apos;B</span>
                <div style={{ width: 48, height: 1, background: 'linear-gradient(to left, transparent, rgba(220,38,38,.6))' }} />
              </div>
              <h2 style={{ fontFamily: P, fontSize: 'clamp(2.2rem,5vw,4.5rem)', fontWeight: 400, lineHeight: 1.05, marginBottom: 20 }}>
                Cascada de Chocolate<br /><em style={{ color: '#DC2626' }}>para Eventos</em>
              </h2>
              <p style={{ fontFamily: C, fontSize: 'clamp(1.1rem,2vw,1.3rem)', color: 'rgba(255,255,255,.5)', maxWidth: 680, margin: '0 auto', lineHeight: 1.75 }}>
                Una experiencia única para eventos: una cascada de chocolate premium que se convierte en el centro de atención de cualquier celebración. El chocolate fluye continuamente en una elegante fuente donde los invitados pueden sumergir frutas y dulces.
              </p>
            </div>

            {/* Ideal para */}
            <div className="reveal" style={{ marginBottom: 80 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 28 }}>
                <div style={{ width: 28, height: 1, background: 'rgba(220,38,38,.4)' }} />
                <span style={{ fontFamily: C, fontSize: 10, letterSpacing: '0.4em', textTransform: 'uppercase', color: 'rgba(220,38,38,.7)' }}>Ideal para</span>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 16 }} className="grid-cols-4">
                {[['🎉','Cumpleaños'],['💍','Casamientos'],['🎊','Eventos Sociales'],['🥳','Celebraciones']].map(([ico,lbl]) => (
                  <div key={lbl} className="feature-card reveal" style={{ textAlign: 'center' }}>
                    <span style={{ fontSize: 36, display: 'block', marginBottom: 12 }}>{ico}</span>
                    <span style={{ fontFamily: C, fontSize: 13, letterSpacing: '0.15em', textTransform: 'uppercase', color: 'rgba(255,255,255,.7)' }}>{lbl}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Acompañamientos */}
            <div className="reveal" style={{ marginBottom: 80 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 28 }}>
                <div style={{ width: 28, height: 1, background: 'rgba(220,38,38,.4)' }} />
                <span style={{ fontFamily: C, fontSize: 10, letterSpacing: '0.4em', textTransform: 'uppercase', color: 'rgba(220,38,38,.7)' }}>Variedad de acompañamientos</span>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(280px,1fr))', gap: 20 }}>
                {[
                  ['Frutas frescas de estación','Frutillas, kiwi, melón, banana, pera, manzana, ananá, uvas, duraznos y naranja.'],
                  ['Bocaditos dulces','Conitos con dulce de leche, cubanitos, malvaviscos, cañoncitos y alfajorcitos.'],
                  ['Galletitas dulces','De chocolate y vainilla.'],
                  ['Pastelería artesanal','Brownies, alfajores de maicena, trufas, medialunitas y otras delicias.'],
                ].map(([t,d]) => (
                  <div key={t} className="include-card">
                    <h4 style={{ fontFamily: P, fontSize: '1.1rem', color: 'rgba(255,255,255,.9)', marginBottom: 8 }}>{t}</h4>
                    <p style={{ fontFamily: C, fontSize: '0.95rem', color: 'rgba(255,255,255,.45)', lineHeight: 1.75 }}>{d}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Qué incluye */}
            <div className="reveal" style={{ marginBottom: 64 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 28 }}>
                <div style={{ width: 28, height: 1, background: 'rgba(220,38,38,.4)' }} />
                <span style={{ fontFamily: C, fontSize: 10, letterSpacing: '0.4em', textTransform: 'uppercase', color: 'rgba(220,38,38,.7)' }}>¿Qué incluye el servicio?</span>
              </div>
              <div style={{ maxWidth: 640 }}>
                {[
                  'Cascada de chocolate Premium (blanco o negro).',
                  'Dos tamaños disponibles: grande o chico según el evento.',
                  'Traslado e instalación del equipo.',
                  'Operador presente durante todo el evento.',
                  'Vajilla, descartables y mantelería incluidos.',
                  'Servicio durante 2 horas, con posibilidad de extender.',
                ].map(item => (
                  <div key={item} className="check-item">
                    <span style={{ color: 'rgba(220,38,38,.8)', fontSize: '1.1rem', flexShrink: 0 }}>✔</span>
                    <p style={{ fontFamily: C, fontSize: '1.05rem', color: 'rgba(255,255,255,.6)', lineHeight: 1.7 }}>{item}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* CTA */}
            <div className="reveal" style={{ textAlign: 'center', borderTop: '1px solid rgba(255,255,255,.05)', paddingTop: 56 }}>
              <a href={wa('Hola Damián! Me interesa la Cascada de Chocolate para mi evento 🍫🎉')} target="_blank" rel="noreferrer" className="btn-red">
                Consultar por la Cascada →
              </a>
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════
            TORTAS PERSONALIZADAS
        ═══════════════════════════════════════════ */}
        <section id="tortas" style={{ position: 'relative', background: '#050505', borderTop: '1px solid rgba(255,255,255,.05)', padding: '120px 24px', overflow: 'hidden' }}>
          <div style={{ maxWidth: 1200, margin: '0 auto' }}>
            <div className="reveal" style={{ textAlign: 'center', marginBottom: 64 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 16, marginBottom: 24 }}>
                <div style={{ width: 48, height: 1, background: 'linear-gradient(to right,transparent,rgba(245,158,11,.5))' }} />
                <span style={{ fontFamily: C, fontSize: 10, letterSpacing: '0.5em', textTransform: 'uppercase', color: 'rgba(245,158,11,.8)' }}>Pastelería de Autor</span>
                <div style={{ width: 48, height: 1, background: 'linear-gradient(to left,transparent,rgba(245,158,11,.5))' }} />
              </div>
              <h2 style={{ fontFamily: P, fontSize: 'clamp(2.5rem,5.5vw,5rem)', fontWeight: 400, lineHeight: 1, marginBottom: 20 }}>
                Tortas<br /><em style={{ color: '#DC2626' }}>Personalizadas</em>
              </h2>
              <p style={{ fontFamily: C, fontSize: 'clamp(1.1rem,2vw,1.3rem)', color: 'rgba(255,255,255,.45)', maxWidth: 580, margin: '0 auto', lineHeight: 1.75 }}>
                Diseños exclusivos para cada celebración. Desde clásicos pisos fondant hasta naked cakes florales, cada torta es una obra de arte comestible diseñada a tu medida.
              </p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(280px,1fr))', gap: 20, marginBottom: 56 }}>
              {[
                ['🎂','Diseño Único','Cada torta es una creación exclusiva, diseñada según tus gustos y la temática de tu evento.'],
                ['✨','Ingredientes Premium','Trabajamos con ingredientes seleccionados para garantizar un sabor inolvidable.'],
                ['🎨','Arte Comestible','Fondant, buttercream, naked cakes, drip cakes. Dominamos todas las técnicas.'],
              ].map(([ico,t,d]) => (
                <div key={t} className="feature-card reveal" style={{ textAlign: 'center' }}>
                  <span style={{ fontSize: 40, display: 'block', marginBottom: 20 }}>{ico}</span>
                  <h4 style={{ fontFamily: P, fontSize: '1.15rem', color: 'rgba(255,255,255,.9)', marginBottom: 12 }}>{t}</h4>
                  <p style={{ fontFamily: C, fontSize: '0.95rem', color: 'rgba(255,255,255,.4)', lineHeight: 1.75 }}>{d}</p>
                </div>
              ))}
            </div>

            <div className="reveal" style={{ textAlign: 'center', display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' }}>
              <a href="#catalogo" className="btn-red">Ver Galería de Diseños →</a>
              <a href={wa('Hola Damián! Quiero consultar por una torta personalizada 🎂')} target="_blank" rel="noreferrer" className="btn-outline">Cotizar Mi Torta →</a>
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════
            MESAS DULCES PREMIUM
        ═══════════════════════════════════════════ */}
        <section id="mesas-dulces" style={{ position: 'relative', background: '#0A0A0A', borderTop: '1px solid rgba(255,255,255,.05)', padding: '120px 24px', overflow: 'hidden' }}>
          <div style={{ maxWidth: 1200, margin: '0 auto' }}>
            <div className="reveal" style={{ textAlign: 'center', marginBottom: 64 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 16, marginBottom: 24 }}>
                <div style={{ width: 48, height: 1, background: 'linear-gradient(to right,transparent,rgba(244,63,94,.5))' }} />
                <span style={{ fontFamily: C, fontSize: 10, letterSpacing: '0.5em', textTransform: 'uppercase', color: 'rgba(244,63,94,.8)' }}>Experiencia Gourmet</span>
                <div style={{ width: 48, height: 1, background: 'linear-gradient(to left,transparent,rgba(244,63,94,.5))' }} />
              </div>
              <h2 style={{ fontFamily: P, fontSize: 'clamp(2.5rem,5.5vw,5rem)', fontWeight: 400, lineHeight: 1, marginBottom: 20 }}>
                Mesas Dulces<br /><em style={{ color: '#DC2626' }}>Premium</em>
              </h2>
              <p style={{ fontFamily: C, fontSize: 'clamp(1.1rem,2vw,1.3rem)', color: 'rgba(255,255,255,.45)', maxWidth: 580, margin: '0 auto', lineHeight: 1.75 }}>
                Bocaditos de autor, shots, tartas clásicas y pastelería moderna para deslumbrar a tus invitados.
              </p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(280px,1fr))', gap: 20, marginBottom: 56 }}>
              {[
                ['🍰','Bocaditos de Autor','Petit fours, macarons, mini tartaletas y bombones artesanales.'],
                ['🥂','Shots & Vasitos','Mousse, tiramisú, cheesecake y cremas en presentaciones individuales elegantes.'],
                ['🧁','Pastelería Clásica','Alfajores de maicena, brownies, cookies, medialunas rellenas y tartas frutales.'],
                ['🍫','Mesa Personalizada','Diseño y decoración adaptados a la paleta de colores y temática de tu evento.'],
              ].map(([ico,t,d]) => (
                <div key={t} className="include-card reveal" style={{ display: 'flex', gap: 20, alignItems: 'flex-start' }}>
                  <span style={{ fontSize: 28, flexShrink: 0, marginTop: 2 }}>{ico}</span>
                  <div>
                    <h4 style={{ fontFamily: P, fontSize: '1.1rem', color: 'rgba(255,255,255,.9)', marginBottom: 8 }}>{t}</h4>
                    <p style={{ fontFamily: C, fontSize: '0.95rem', color: 'rgba(255,255,255,.4)', lineHeight: 1.75 }}>{d}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="reveal" style={{ textAlign: 'center' }}>
              <a href={wa('Hola Damián! Me interesa una Mesa Dulce Premium para mi evento 🍰🥂')} target="_blank" rel="noreferrer" className="btn-red">
                Cotizar Mesa Dulce →
              </a>
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════
            CATÁLOGO — productos desde API
        ═══════════════════════════════════════════ */}
        <section id="catalogo" style={{ background: '#050505', borderTop: '1px solid rgba(255,255,255,.05)', padding: '120px 24px' }}>
          <div style={{ maxWidth: 1400, margin: '0 auto' }}>
            <div className="reveal" style={{ textAlign: 'center', marginBottom: 64 }}>
              <h2 style={{ fontFamily: P, fontSize: 'clamp(2.8rem,5vw,5rem)', fontWeight: 400, lineHeight: 1.1 }}>
                Catálogo de <em style={{ color: '#DC2626' }}>Especialidades</em>
              </h2>
            </div>

            {loadingP ? (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(240px,1fr))', gap: 20 }}>
                {[...Array(6)].map((_,i) => (
                  <div key={i} style={{ background: '#080808', border: '1px solid rgba(255,255,255,.05)', borderRadius: 16, overflow: 'hidden' }}>
                    <div style={{ aspectRatio: '4/5', background: 'rgba(255,255,255,.04)' }} />
                    <div style={{ padding: 24 }}>
                      <div style={{ height: 20, background: 'rgba(255,255,255,.07)', borderRadius: 4, width: '70%', marginBottom: 16 }} />
                      <div style={{ height: 36, background: 'rgba(255,255,255,.04)', borderRadius: 8 }} />
                    </div>
                  </div>
                ))}
              </div>
            ) : productos.length === 0 ? (
              <p style={{ fontFamily: C, textAlign: 'center', color: 'rgba(255,255,255,.3)', fontSize: '1.1rem' }}>Próximamente...</p>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(240px,1fr))', gap: 20 }}>
                {productos.map((p, i) => (
                  <div key={p.id} className="product-card reveal" style={{ marginTop: p.offset ? 40 : 0, transitionDelay: `${(i % 4) * 0.08}s` }}>
                    <div style={{ aspectRatio: '4/5', overflow: 'hidden', position: 'relative' }}>
                      {p.img && (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={getImgUrl(p.img)} alt={p.nombre} className="card-img" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                      )}
                    </div>
                    <div style={{ padding: '20px 24px 24px' }}>
                      <h3 style={{ fontFamily: P, fontSize: '1.1rem', color: 'rgba(255,255,255,.9)', marginBottom: 16, fontWeight: 400 }}>{p.nombre}</h3>
                      <a
                        href={wa(`Hola Damián! Quiero consultar por ${p.nombre} 🎂`)}
                        target="_blank" rel="noreferrer"
                        style={{ display: 'block', textAlign: 'center', fontFamily: C, fontSize: 11, letterSpacing: '0.2em', textTransform: 'uppercase', padding: '10px', border: '1px solid rgba(255,255,255,.1)', color: 'rgba(255,255,255,.5)', textDecoration: 'none', borderRadius: 8, transition: 'all .3s' }}
                        onMouseEnter={e => { e.currentTarget.style.borderColor = '#DC2626'; e.currentTarget.style.color = '#DC2626' }}
                        onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,.1)'; e.currentTarget.style.color = 'rgba(255,255,255,.5)' }}
                      >
                        Cotizar Pedido →
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* ═══════════════════════════════════════════
            PORTFOLIO / EVENTOS
        ═══════════════════════════════════════════ */}
        <section id="eventos" style={{ background: '#0A0A0A', borderTop: '1px solid rgba(255,255,255,.05)', padding: '120px 24px', overflow: 'hidden' }}>
          <div style={{ maxWidth: 1400, margin: '0 auto' }}>
            <div className="reveal" style={{ marginBottom: 56 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
                <div style={{ width: 28, height: 1, background: 'rgba(220,38,38,.4)' }} />
                <span style={{ fontFamily: C, fontSize: 10, letterSpacing: '0.4em', textTransform: 'uppercase', color: 'rgba(220,38,38,.7)' }}>Portfolio</span>
              </div>
              <h2 style={{ fontFamily: P, fontSize: 'clamp(2.2rem,4vw,3.8rem)', fontWeight: 400, lineHeight: 1.05 }}>
                Obras <em style={{ color: '#DC2626' }}>Realizadas</em>
              </h2>
            </div>

            {loadingE ? (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(200px,1fr))', gap: 12 }}>
                {[...Array(4)].map((_,i) => (
                  <div key={i} style={{ aspectRatio: '3/4', background: '#080808', border: '1px solid rgba(255,255,255,.05)', borderRadius: 12 }} />
                ))}
              </div>
            ) : eventos.length === 0 ? (
              <p style={{ fontFamily: C, color: 'rgba(255,255,255,.3)', fontSize: '1.1rem' }}>Próximamente...</p>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(220px,1fr))', gap: 12 }}>
                {eventos.map((ev, i) => (
                  <div key={ev.id} className="event-card reveal" style={{ aspectRatio: '3/4', transitionDelay: `${(i % 4) * 0.07}s` }}>
                    {ev.img && (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={getImgUrl(ev.img)} alt={ev.titulo} className="card-img" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                    )}
                    <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,.75) 0%, transparent 55%)' }} />
                    <div style={{ position: 'absolute', bottom: 0, left: 0, padding: '20px 20px' }}>
                      <p style={{ fontFamily: C, fontSize: 10, letterSpacing: '0.3em', textTransform: 'uppercase', color: '#DC2626', marginBottom: 6 }}>{ev.categoria}</p>
                      <h3 style={{ fontFamily: P, fontSize: '1.1rem', color: '#FAF7F2', fontWeight: 400 }}>{ev.titulo}</h3>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* ═══════════════════════════════════════════
            FOOTER / CONTACTO
        ═══════════════════════════════════════════ */}
        <footer id="contacto" style={{ background: '#020202', borderTop: '1px solid rgba(255,255,255,.05)' }}>
          <div style={{ maxWidth: 1400, margin: '0 auto', padding: '40px 24px', display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: 24 }}>
            <h3 style={{ fontFamily: P, fontSize: 'clamp(1.1rem,2vw,1.4rem)', fontWeight: 300, color: 'rgba(255,255,255,.7)' }}>
              ¿Listo para tu próximo <em style={{ color: '#DC2626' }}>evento</em>?
            </h3>
            <a href={wa('Hola Damián! Estuve viendo tu web y quiero consultar por un evento 🥂')} target="_blank" rel="noreferrer" className="btn-red" style={{ padding: '12px 32px' }}>
              Contactate con nosotros
            </a>
          </div>
          <div style={{ maxWidth: 1400, margin: '0 auto', borderTop: '1px solid rgba(255,255,255,.05)', padding: '20px 24px', display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: 12 }}>
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
