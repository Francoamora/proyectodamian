'use client'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import Navbar from '@/components/Navbar'
import { useEffect, useState, useCallback } from 'react'
import { getVideosEventos } from '@/lib/api'

const P = 'var(--playfair-font)'
const C = 'var(--cormorant-font)'

const inView = (delay = 0) => ({
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.7, delay, ease: [0.25,0.1,0.25,1] as const },
})

const TAG_STYLE = {
  display:'flex', alignItems:'center', gap:10,
  fontFamily: C, fontSize:11, letterSpacing:'0.28em',
  textTransform:'uppercase' as const, color:'#CC1F1F',
}
const LINE = { width:28, height:1, background:'#CC1F1F', flexShrink:0 as const }

const eventos = [
  {
    tipo:'Bodas & Casamientos', emoji:'💍',
    desc:'Hacemos realidad la torta y el catering de tu día más especial. Desde el diseño hasta el último bocado, todo bajo la dirección de Damián.',
    incluye:['Torta nupcial personalizada','Mesa de dulces','Catering completo','Degustación previa','Coordinación el día del evento'],
    desde:'$150.000',
  },
  {
    tipo:'Cumpleaños & Celebraciones', emoji:'🎉',
    desc:'Tortas temáticas, mesas de dulces y catering personalizado para que tu festejo sea único e irrepetible.',
    incluye:['Torta temática','Mesa de dulces','Mini pasteles individuales','Packaging personalizado','Entrega a domicilio'],
    desde:'$45.000',
  },
  {
    tipo:'Eventos Corporativos', emoji:'🏢',
    desc:'Desayunos, almuerzos ejecutivos, lanzamientos de productos y celebraciones de empresa con la calidad Dolche\'B.',
    incluye:['Menú ejecutivo personalizado','Servicio de coffee break','Canapés y finger food','Postres individuales','Personal de servicio'],
    desde:'$80.000',
  },
  {
    tipo:'Clases de Pastelería', emoji:'👨‍🍳',
    desc:'Aprendé las técnicas de Damián en talleres íntimos y personalizados, para todos los niveles.',
    incluye:['Grupos de hasta 8 personas','Materiales incluidos','Certificado de asistencia','Recetario exclusivo','Degustación al finalizar'],
    desde:'$18.000',
  },
]

const proceso = [
  { n:'01', t:'Consulta inicial',      d:'Nos contás tu idea, fecha y presupuesto. Coordinamos una reunión o videollamada.' },
  { n:'02', t:'Propuesta a medida',    d:'Damián diseña una propuesta personalizada con menú, referencias visuales y presupuesto.' },
  { n:'03', t:'Degustación',           d:'Te invitamos a probar las creaciones antes de confirmar. Tu aprobación es lo primero.' },
  { n:'04', t:'Producción y entrega',  d:'Elaboramos todo con tiempo y cuidado. El día del evento, llegamos puntuales y prolijos.' },
]

const CATEGORIAS = [
  { key: '', label: 'Todos' },
  { key: 'boda', label: 'Bodas' },
  { key: 'cumpleanos', label: 'Cumpleaños' },
  { key: 'corporativo', label: 'Corporativos' },
  { key: 'clase', label: 'Clases' },
  { key: 'otro', label: 'Otros' },
]

interface VideoEvento {
  id: number
  titulo: string
  descripcion: string
  video_url: string
  embed_url: string
  thumbnail_url: string
  categoria: string
  fecha: string | null
  destacado: boolean
  orden: number
}

/* ─── VIDEO PLACEHOLDER para cuando no hay videos cargados ─── */
const DEMO_VIDEOS: VideoEvento[] = [
  { id:1, titulo:'Boda en el Salón Imperial', descripcion:'Una noche mágica con cascada de chocolate y mesa de dulces para 200 invitados.', video_url:'', embed_url:'', thumbnail_url:'', categoria:'boda', fecha:'2025-11-15', destacado:true, orden:0 },
  { id:2, titulo:'Cumpleaños de 15 Sofía', descripcion:'Mesa de dulces temática con torta de 5 pisos y más de 80 variedades.', video_url:'', embed_url:'', thumbnail_url:'', categoria:'cumpleanos', fecha:'2025-10-02', destacado:false, orden:1 },
  { id:3, titulo:'Lanzamiento Banco Nación', descripcion:'Catering ejecutivo para 150 personas con finger food premium y postres artesanales.', video_url:'', embed_url:'', thumbnail_url:'', categoria:'corporativo', fecha:'2025-09-18', destacado:false, orden:2 },
]

/* ─── Icono Play ─── */
function PlayIcon({ size = 48 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="24" cy="24" r="23" stroke="white" strokeWidth="1.5" strokeOpacity="0.6"/>
      <path d="M19 15.5L35 24L19 32.5V15.5Z" fill="white"/>
    </svg>
  )
}

/* ─── Thumbnail placeholder cuando no hay imagen ─── */
function VideoThumbnailPlaceholder({ titulo, categoria }: { titulo: string; categoria: string }) {
  const gradients: Record<string, string> = {
    boda: 'linear-gradient(135deg, #1a0a0a 0%, #2d1515 50%, #1a0a0a 100%)',
    cumpleanos: 'linear-gradient(135deg, #0a0a1a 0%, #151528 50%, #0a0a1a 100%)',
    corporativo: 'linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 50%, #0a0a0a 100%)',
    clase: 'linear-gradient(135deg, #0a1a0a 0%, #152815 50%, #0a1a0a 100%)',
    otro: 'linear-gradient(135deg, #0a0a0a 0%, #1a1010 50%, #0a0a0a 100%)',
  }
  return (
    <div style={{
      width:'100%', height:'100%', position:'absolute', inset:0,
      background: gradients[categoria] || gradients.otro,
      display:'flex', alignItems:'center', justifyContent:'center', flexDirection:'column', gap:16,
    }}>
      <div style={{ opacity:0.12, fontSize:72 }}>🎬</div>
      <p style={{ fontFamily:C, fontSize:12, letterSpacing:'0.2em', textTransform:'uppercase',
                  color:'rgba(250,247,242,0.2)', textAlign:'center', padding:'0 24px', lineHeight:1.4 }}>
        {titulo}
      </p>
    </div>
  )
}

export default function Eventos() {
  const [videos, setVideos] = useState<VideoEvento[]>([])
  const [loadingVideos, setLoadingVideos] = useState(true)
  const [categoriaActiva, setCategoriaActiva] = useState('')
  const [activeVideo, setActiveVideo] = useState<VideoEvento | null>(null)

  useEffect(() => {
    getVideosEventos()
      .then(r => setVideos(r.data.results ?? r.data))
      .catch(() => setVideos([]))
      .finally(() => setLoadingVideos(false))
  }, [])

  const videosFiltrados = categoriaActiva
    ? videos.filter(v => v.categoria === categoriaActiva)
    : videos

  const displayVideos = videosFiltrados.length > 0 ? videosFiltrados : (loadingVideos ? [] : DEMO_VIDEOS)
  const isDemo = !loadingVideos && videosFiltrados.length === 0

  const closeModal = useCallback(() => setActiveVideo(null), [])

  useEffect(() => {
    if (!activeVideo) return
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') closeModal() }
    window.addEventListener('keydown', handler)
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', handler)
      document.body.style.overflow = ''
    }
  }, [activeVideo, closeModal])

  return (
    <main style={{ background:'#FAF7F2' }}>
      <Navbar />

      {/* HERO */}
      <section style={{ background:'#0E0C0C', padding:'10rem 2.5rem 7rem', position:'relative', overflow:'hidden' }}>
        <div style={{ position:'absolute', inset:0, opacity:0.04, pointerEvents:'none',
          backgroundImage:'linear-gradient(#FAF7F2 1px,transparent 1px),linear-gradient(90deg,#FAF7F2 1px,transparent 1px)',
          backgroundSize:'70px 70px' }}/>
        <div style={{ position:'absolute', top:0, right:0, width:'40%', height:'100%',
          background:'linear-gradient(to left, rgba(204,31,31,0.1) 0%, transparent 100%)', pointerEvents:'none' }}/>
        <div style={{ maxWidth:1280, margin:'0 auto', display:'grid', gridTemplateColumns:'1fr 1fr', gap:'5rem', alignItems:'center' }}>
          <motion.div {...inView()}>
            <div style={{ ...TAG_STYLE, marginBottom:24 }}><span style={LINE}/>Eventos & Catering</div>
            <h1 style={{ fontFamily:P, fontSize:'clamp(3rem,7vw,6rem)', lineHeight:0.92, color:'#FAF7F2', marginBottom:24 }}>
              Cada celebración<br /><em style={{ color:'#CC1F1F', fontStyle:'normal' }}>merece lo mejor</em>
            </h1>
            <p style={{ fontFamily:C, fontSize:'1.2rem', fontWeight:300, color:'rgba(250,247,242,0.45)', lineHeight:1.7, maxWidth:420 }}>
              Diseñamos experiencias gastronómicas completas para bodas, cumpleaños, eventos corporativos y clases de cocina.
            </p>
          </motion.div>
          <motion.div {...inView(0.15)} style={{ display:'flex', flexDirection:'column', gap:2 }}>
            {['500+ eventos realizados','100% satisfacción garantizada','Personalización total','Presencia en el Norte Santafesino y Capital Correntina'].map((item,i) => (
              <div key={i} style={{
                background:'#1A1515', padding:'1.4rem 2rem',
                display:'flex', alignItems:'center', gap:16,
              }}>
                <div style={{ width:6, height:6, borderRadius:'50%', background:'#CC1F1F', flexShrink:0 }}/>
                <p style={{ fontFamily:C, fontSize:'1.1rem', color:'rgba(250,247,242,0.7)' }}>{item}</p>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* SERVICIOS */}
      <section style={{ padding:'8rem 2.5rem', background:'#FAF7F2' }}>
        <div style={{ maxWidth:1280, margin:'0 auto' }}>
          <motion.div {...inView()} style={{ marginBottom:56 }}>
            <div style={{ ...TAG_STYLE, marginBottom:20 }}><span style={LINE}/>Servicios</div>
            <h2 style={{ fontFamily:P, fontSize:'clamp(2.2rem,4vw,3.8rem)', lineHeight:0.95, color:'#0E0C0C' }}>
              ¿Qué tipo de evento<br /><em style={{ color:'#CC1F1F', fontStyle:'normal' }}>organizamos?</em>
            </h2>
          </motion.div>

          <div style={{ display:'grid', gridTemplateColumns:'repeat(2,1fr)', gap:3 }}>
            {eventos.map((ev, i) => (
              <motion.div key={i} {...inView(i*0.1)} style={{
                background:'#0E0C0C', padding:'3rem',
                transition:'background 0.4s', cursor:'default',
              }}
                onMouseEnter={e => (e.currentTarget.style.background = '#1A1515')}
                onMouseLeave={e => (e.currentTarget.style.background = '#0E0C0C')}
              >
                <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:24 }}>
                  <span style={{ fontSize:'2.5rem' }}>{ev.emoji}</span>
                  <div style={{ textAlign:'right' }}>
                    <p style={{ fontFamily:C, fontSize:10, letterSpacing:'0.2em', textTransform:'uppercase', color:'rgba(204,31,31,0.7)' }}>Desde</p>
                    <p style={{ fontFamily:P, fontSize:'1.4rem', color:'#CC1F1F', fontWeight:700 }}>{ev.desde}</p>
                  </div>
                </div>
                <h3 style={{ fontFamily:P, fontSize:'1.4rem', color:'#FAF7F2', marginBottom:12, lineHeight:1.2 }}>{ev.tipo}</h3>
                <p style={{ fontFamily:C, fontSize:'1.1rem', fontWeight:300, color:'rgba(250,247,242,0.45)', lineHeight:1.65, marginBottom:28 }}>{ev.desc}</p>
                <div style={{ borderTop:'1px solid rgba(250,247,242,0.08)', paddingTop:24 }}>
                  <p style={{ fontFamily:C, fontSize:10, letterSpacing:'0.2em', textTransform:'uppercase', color:'rgba(250,247,242,0.3)', marginBottom:12 }}>Incluye</p>
                  <ul style={{ listStyle:'none', display:'flex', flexDirection:'column', gap:8 }}>
                    {ev.incluye.map((inc, j) => (
                      <li key={j} style={{ display:'flex', alignItems:'center', gap:10 }}>
                        <span style={{ color:'#CC1F1F', fontSize:'0.7rem' }}>✦</span>
                        <span style={{ fontFamily:C, fontSize:'1rem', color:'rgba(250,247,242,0.5)' }}>{inc}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          VIDEOS DE EVENTOS
      ══════════════════════════════════════════════════════ */}
      <section id="videos-eventos" style={{ background:'#050505', padding:'clamp(60px,10vw,120px) 2.5rem', position:'relative', overflow:'hidden' }}>
        {/* Grain texture */}
        <div style={{
          position:'absolute', inset:0, pointerEvents:'none', opacity:0.025,
          backgroundImage:'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 256 256\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noise\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.9\' numOctaves=\'4\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noise)\'/%3E%3C/svg%3E")',
        }}/>
        {/* Red accent glow top-right */}
        <div style={{
          position:'absolute', top:'-20%', right:'-10%', width:'60%', height:'80%',
          background:'radial-gradient(ellipse at center, rgba(220,38,38,0.07) 0%, transparent 70%)',
          pointerEvents:'none',
        }}/>

        <div style={{ maxWidth:1280, margin:'0 auto', position:'relative', zIndex:1 }}>
          {/* Header */}
          <motion.div {...inView()} style={{ display:'flex', flexDirection:'column', gap:0, marginBottom:'clamp(40px,6vw,72px)' }}>
            <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', flexWrap:'wrap', gap:24 }}>
              <div>
                <div style={{ ...TAG_STYLE, marginBottom:20, color:'#DC2626' }}>
                  <span style={{ ...LINE, background:'#DC2626' }}/>Videos de Eventos
                </div>
                <h2 style={{ fontFamily:P, fontSize:'clamp(2.2rem,5vw,4.5rem)', lineHeight:0.9, color:'#FAF7F2', margin:0 }}>
                  Viví la experiencia<br />
                  <em style={{ color:'#DC2626', fontStyle:'normal' }}>antes de vivirla</em>
                </h2>
              </div>
              <p style={{ fontFamily:C, fontSize:'1.15rem', fontWeight:300, color:'rgba(250,247,242,0.4)',
                          lineHeight:1.7, maxWidth:380 }}>
                Cada video es una ventana a lo que podemos crear juntos. Bodas, celebraciones, eventos corporativos — todos con la firma Dolche&apos;B.
              </p>
            </div>

            {/* Filtros */}
            <div style={{ display:'flex', gap:8, flexWrap:'wrap', marginTop:40 }}>
              {CATEGORIAS.map(cat => (
                <button
                  key={cat.key}
                  onClick={() => setCategoriaActiva(cat.key)}
                  style={{
                    fontFamily:C, fontSize:10, letterSpacing:'0.25em', textTransform:'uppercase',
                    padding:'10px 22px', border:'1px solid',
                    borderColor: categoriaActiva === cat.key ? '#DC2626' : 'rgba(255,255,255,0.12)',
                    background: categoriaActiva === cat.key ? '#DC2626' : 'transparent',
                    color: categoriaActiva === cat.key ? '#fff' : 'rgba(250,247,242,0.45)',
                    cursor:'pointer', transition:'all 0.25s', borderRadius:9999,
                  }}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </motion.div>

          {/* Demo notice */}
          {isDemo && (
            <motion.div {...inView()} style={{
              background:'rgba(220,38,38,0.06)', border:'1px solid rgba(220,38,38,0.15)',
              borderRadius:12, padding:'16px 24px', marginBottom:40,
              display:'flex', alignItems:'center', gap:12,
            }}>
              <span style={{ color:'#DC2626', fontSize:'1rem' }}>✦</span>
              <p style={{ fontFamily:C, fontSize:'1rem', color:'rgba(250,247,242,0.4)', margin:0, lineHeight:1.5 }}>
                Aún no hay videos cargados. Podés agregarlos desde el panel de administración en <strong style={{ color:'rgba(250,247,242,0.6)' }}>/admin → Videos de Eventos</strong>.
              </p>
            </motion.div>
          )}

          {/* Loading skeleton */}
          {loadingVideos && (
            <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:16 }}>
              {[1,2,3].map(i => (
                <div key={i} style={{
                  borderRadius:16, overflow:'hidden',
                  background:'rgba(255,255,255,0.03)',
                  aspectRatio:'16/10',
                  animation:'pulse 1.5s ease-in-out infinite',
                }}/>
              ))}
              <style>{`@keyframes pulse{0%,100%{opacity:.3}50%{opacity:.7}}`}</style>
            </div>
          )}

          {/* Video grid */}
          {!loadingVideos && (
            <div style={{
              display:'grid',
              gridTemplateColumns: displayVideos.length === 1 ? '1fr' : displayVideos.length === 2 ? 'repeat(2,1fr)' : 'repeat(3,1fr)',
              gap:16,
            }}>
              <style>{`
                @media(max-width:900px){.vid-grid{grid-template-columns:repeat(2,1fr)!important}}
                @media(max-width:560px){.vid-grid{grid-template-columns:1fr!important}}
                .vid-card{position:relative;border-radius:16px;overflow:hidden;cursor:pointer;background:#0a0a0a;aspect-ratio:16/10}
                .vid-card::after{content:'';position:absolute;inset:0;border-radius:16px;border:1.5px solid transparent;transition:border-color .4s;pointer-events:none;z-index:5}
                .vid-card:hover::after{border-color:rgba(220,38,38,.55)}
                .vid-thumb{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;transition:transform .7s cubic-bezier(.16,1,.3,1),filter .5s}
                .vid-card:hover .vid-thumb{transform:scale(1.06);filter:brightness(.6)}
                .vid-overlay{position:absolute;inset:0;z-index:3;background:linear-gradient(to top,rgba(0,0,0,.9) 0%,rgba(0,0,0,.15) 50%,transparent 80%);transition:opacity .4s}
                .vid-play{position:absolute;top:50%;left:50%;transform:translate(-50%,-50%) scale(.85);z-index:4;transition:transform .4s cubic-bezier(.16,1,.3,1),opacity .35s}
                .vid-card:hover .vid-play{transform:translate(-50%,-50%) scale(1)}
                .vid-meta{position:absolute;bottom:0;left:0;right:0;z-index:4;padding:20px 20px 18px;transform:translateY(6px);opacity:0;transition:transform .4s cubic-bezier(.16,1,.3,1),opacity .35s}
                .vid-card:hover .vid-meta{transform:translateY(0);opacity:1}
                .vid-chip{position:absolute;top:14px;left:14px;font-family:var(--cormorant-font);font-size:9.5px;letter-spacing:.28em;text-transform:uppercase;color:rgba(255,255,255,.75);background:rgba(0,0,0,.5);backdrop-filter:blur(12px);border:1px solid rgba(255,255,255,.12);padding:5px 10px;border-radius:20px;z-index:4;pointer-events:none}
                .vid-destacado{position:absolute;top:14px;right:14px;z-index:4;background:rgba(220,38,38,.85);backdrop-filter:blur(8px);border:1px solid rgba(220,38,38,.5);padding:5px 12px;border-radius:20px;font-family:var(--cormorant-font);font-size:9px;letter-spacing:.25em;text-transform:uppercase;color:#fff;pointer-events:none}
              `}</style>
              {displayVideos.map((v, i) => (
                <motion.div
                  key={v.id}
                  className="vid-card"
                  {...inView(Math.min(i * 0.08, 0.32))}
                  onClick={() => { if (!isDemo && v.embed_url) setActiveVideo(v) }}
                  style={{ cursor: isDemo || !v.embed_url ? 'default' : 'pointer' }}
                >
                  {/* Thumbnail */}
                  {v.thumbnail_url ? (
                    /* eslint-disable-next-line @next/next/no-img-element */
                    <img src={v.thumbnail_url} alt={v.titulo} className="vid-thumb" />
                  ) : (
                    <VideoThumbnailPlaceholder titulo={v.titulo} categoria={v.categoria} />
                  )}

                  {/* Gradient overlay */}
                  <div className="vid-overlay"/>

                  {/* Chip categoría */}
                  <div className="vid-chip">
                    {CATEGORIAS.find(c => c.key === v.categoria)?.label ?? v.categoria}
                  </div>

                  {/* Destacado badge */}
                  {v.destacado && (
                    <div className="vid-destacado">Destacado</div>
                  )}

                  {/* Play button — sólo si hay embed */}
                  {!isDemo && v.embed_url && (
                    <div className="vid-play">
                      <PlayIcon size={56} />
                    </div>
                  )}

                  {/* Meta */}
                  <div className="vid-meta">
                    <p style={{ fontFamily:P, fontSize:'1.05rem', color:'#FAF7F2', marginBottom:4, lineHeight:1.2 }}>
                      {v.titulo}
                    </p>
                    {v.descripcion && (
                      <p style={{ fontFamily:C, fontSize:'0.95rem', fontWeight:300,
                                  color:'rgba(250,247,242,0.55)', lineHeight:1.5, margin:0 }}>
                        {v.descripcion.length > 80 ? v.descripcion.slice(0, 80) + '…' : v.descripcion}
                      </p>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          )}

          {/* Empty state cuando hay filtro activo y no hay resultados */}
          {!loadingVideos && videos.length > 0 && videosFiltrados.length === 0 && (
            <motion.div {...inView()} style={{ textAlign:'center', padding:'60px 0' }}>
              <p style={{ fontFamily:C, fontSize:'1.2rem', color:'rgba(250,247,242,0.3)' }}>
                No hay videos en esta categoría todavía.
              </p>
            </motion.div>
          )}
        </div>
      </section>

      {/* PROCESO */}
      <section style={{ background:'#CC1F1F', padding:'8rem 2.5rem' }}>
        <div style={{ maxWidth:1280, margin:'0 auto' }}>
          <motion.div {...inView()} style={{ marginBottom:56, textAlign:'center' }}>
            <div style={{ ...TAG_STYLE, justifyContent:'center', color:'rgba(255,255,255,0.6)', marginBottom:16 }}>
              <span style={{ ...LINE, background:'rgba(255,255,255,0.4)' }}/>Proceso<span style={{ ...LINE, background:'rgba(255,255,255,0.4)' }}/>
            </div>
            <h2 style={{ fontFamily:P, fontSize:'clamp(2.2rem,4vw,3.5rem)', color:'#fff' }}>
              ¿Cómo trabajamos?
            </h2>
          </motion.div>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:2 }}>
            {proceso.map((p,i) => (
              <motion.div key={i} {...inView(i*0.1)} style={{ background:'rgba(0,0,0,0.15)', padding:'2.5rem 2rem' }}>
                <p style={{ fontFamily:P, fontSize:'3rem', fontWeight:700, color:'rgba(255,255,255,0.15)', lineHeight:1, marginBottom:20 }}>{p.n}</p>
                <h3 style={{ fontFamily:P, fontSize:'1.1rem', color:'#fff', marginBottom:12 }}>{p.t}</h3>
                <p style={{ fontFamily:C, fontSize:'1.05rem', fontWeight:300, color:'rgba(255,255,255,0.6)', lineHeight:1.6 }}>{p.d}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ background:'#FAF7F2', padding:'8rem 2.5rem', textAlign:'center' }}>
        <motion.div {...inView()}>
          <div style={{ ...TAG_STYLE, justifyContent:'center', marginBottom:20 }}>
            <span style={LINE}/>Consultanos<span style={LINE}/>
          </div>
          <h2 style={{ fontFamily:P, fontSize:'clamp(2.2rem,4vw,3.5rem)', color:'#0E0C0C', marginBottom:20 }}>
            ¿Tenés un evento en mente?
          </h2>
          <p style={{ fontFamily:C, fontSize:'1.2rem', fontWeight:300, color:'#8A7878', maxWidth:480, margin:'0 auto 40px', lineHeight:1.7 }}>
            Escribinos y te respondemos en menos de 24 horas con una propuesta personalizada.
          </p>
          <Link href="/contacto" style={{
            fontFamily:C, fontSize:11, letterSpacing:'0.22em', textTransform:'uppercase',
            padding:'16px 48px', background:'#CC1F1F', color:'#fff', textDecoration:'none',
          }}>
            Solicitar Presupuesto
          </Link>
        </motion.div>
      </section>

      {/* FOOTER */}
      <footer style={{ background:'#0E0C0C', borderTop:'1px solid rgba(250,247,242,0.06)', padding:'2.5rem' }}>
        <div style={{ maxWidth:1280, margin:'0 auto', display:'flex', alignItems:'center', justifyContent:'space-between', flexWrap:'wrap', gap:20 }}>
          <div style={{ display:'flex', alignItems:'center', gap:12 }}>
            <div style={{ width:32, height:32, borderRadius:'50%', background:'#CC1F1F', display:'flex', alignItems:'center', justifyContent:'center' }}>
              <span style={{ fontFamily:P, fontWeight:700, color:'#fff', fontSize:14 }}>D</span>
            </div>
            <p style={{ fontFamily:P, fontWeight:700, color:'#FAF7F2', fontSize:14 }}>Dolche&apos;B</p>
          </div>
          <p style={{ fontFamily:C, color:'rgba(250,247,242,0.18)', fontSize:13 }}>© 2026 Dolche&apos;B</p>
        </div>
      </footer>

      {/* ══ VIDEO MODAL ══════════════════════════════════════════════ */}
      <AnimatePresence>
        {activeVideo && (
          <motion.div
            initial={{ opacity:0 }}
            animate={{ opacity:1 }}
            exit={{ opacity:0 }}
            transition={{ duration:0.25 }}
            onClick={closeModal}
            style={{
              position:'fixed', inset:0, zIndex:9999,
              background:'rgba(0,0,0,0.96)',
              backdropFilter:'blur(20px)',
              display:'flex', alignItems:'center', justifyContent:'center',
              padding:'clamp(16px,4vw,48px)',
            }}
          >
            <motion.div
              initial={{ opacity:0, scale:0.92, y:24 }}
              animate={{ opacity:1, scale:1, y:0 }}
              exit={{ opacity:0, scale:0.95, y:12 }}
              transition={{ duration:0.35, ease:[0.16,1,0.3,1] }}
              onClick={e => e.stopPropagation()}
              style={{
                width:'100%', maxWidth:960,
                display:'flex', flexDirection:'column', gap:0,
                borderRadius:20, overflow:'hidden',
                border:'1px solid rgba(255,255,255,0.08)',
                boxShadow:'0 40px 120px rgba(0,0,0,0.8), 0 0 0 1px rgba(220,38,38,0.1)',
              }}
            >
              {/* Video embed */}
              <div style={{ position:'relative', width:'100%', aspectRatio:'16/9', background:'#000' }}>
                <iframe
                  src={activeVideo.embed_url + '&autoplay=1'}
                  title={activeVideo.titulo}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  style={{ position:'absolute', inset:0, width:'100%', height:'100%', border:'none' }}
                />
              </div>

              {/* Info bar */}
              <div style={{
                background:'#0E0C0C', padding:'20px 28px',
                display:'flex', alignItems:'center', justifyContent:'space-between', gap:16,
              }}>
                <div style={{ display:'flex', flexDirection:'column', gap:4 }}>
                  <p style={{ fontFamily:P, fontSize:'1.15rem', color:'#FAF7F2', margin:0, lineHeight:1.2 }}>
                    {activeVideo.titulo}
                  </p>
                  {activeVideo.descripcion && (
                    <p style={{ fontFamily:C, fontSize:'0.95rem', fontWeight:300,
                                color:'rgba(250,247,242,0.4)', margin:0, lineHeight:1.5 }}>
                      {activeVideo.descripcion}
                    </p>
                  )}
                </div>
                <button
                  onClick={closeModal}
                  style={{
                    flexShrink:0, width:40, height:40, borderRadius:'50%',
                    background:'rgba(255,255,255,0.06)', border:'1px solid rgba(255,255,255,0.1)',
                    color:'rgba(250,247,242,0.7)', cursor:'pointer',
                    fontFamily:C, fontSize:18, display:'flex', alignItems:'center', justifyContent:'center',
                    transition:'background .2s, color .2s',
                  }}
                  onMouseEnter={e => { e.currentTarget.style.background='rgba(220,38,38,0.2)'; e.currentTarget.style.color='#DC2626' }}
                  onMouseLeave={e => { e.currentTarget.style.background='rgba(255,255,255,0.06)'; e.currentTarget.style.color='rgba(250,247,242,0.7)' }}
                >
                  ✕
                </button>
              </div>
            </motion.div>

            {/* ESC hint */}
            <p style={{
              position:'absolute', bottom:24, left:'50%', transform:'translateX(-50%)',
              fontFamily:C, fontSize:11, letterSpacing:'0.2em', textTransform:'uppercase',
              color:'rgba(255,255,255,0.2)',
            }}>
              Presioná ESC para cerrar
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  )
}
