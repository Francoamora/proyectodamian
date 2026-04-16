'use client'
import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import Link from 'next/link'
import Image from 'next/image'
import Navbar from '@/components/Navbar'
import WhatsAppButton from '@/components/WhatsAppButton'

const P = 'var(--playfair-font)'
const C = 'var(--cormorant-font)'

const inView = (delay = 0) => ({
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.75, delay, ease: [0.25,0.1,0.25,1] as const },
})

const WHATSAPP = 'https://wa.me/5491112345678?text=' + encodeURIComponent('Hola Damián! Vi tu sitio y quiero hacer una consulta 🎂')

const stats = [
  { n:'15+',  l:'Años de trayectoria' },
  { n:'+500', l:'Eventos realizados'  },
  { n:'100%', l:'Hecho a mano'        },
  { n:'5 ★',  l:'Calificación Google' },
]

const services = [
  { n:'01', t:'Tortas & Pasteles',   d:'Diseños únicos para cada ocasión. Bodas, cumpleaños, bautismos y más.', href:'/galeria'  },
  { n:'02', t:'Eventos & Catering',  d:'Menús completos para tu celebración. Coordinamos todo por vos.',        href:'/eventos'  },
  { n:'03', t:'Clases de Pastelería',d:'Aprendé las técnicas profesionales en talleres íntimos y personalizados.',href:'/eventos' },
]

const creations = [
  { e:'🎂', n:'Torta Red Velvet',      t:'Tortas',   d:'Con frosting de queso crema artesanal',   href:'/galeria' },
  { e:'🥐', n:'Medialunas de Manteca', t:'Panadería', d:'Masa hojaldrada 72 horas de fermentación', href:'/blog/medialunas-artesanales' },
  { e:'🍮', n:'Crème Brûlée',          t:'Postres',   d:'Vainilla de Madagascar y azúcar quemada',  href:'/blog/creme-brulee-clasica'   },
  { e:'🍰', n:'Opera Cake',            t:'Tortas',    d:'Capas de café, almendras y ganache 70%',   href:'/galeria' },
]

const INSTAGRAM = 'https://instagram.com/dolcheb_pasteles'
const FACEBOOK  = 'https://facebook.com/dolcheb'

export default function Home() {
  const heroRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target:heroRef, offset:['start start','end start'] })
  const yHero  = useTransform(scrollYProgress, [0,1], ['0%','18%'])
  const opHero = useTransform(scrollYProgress, [0,0.7], [1, 0])

  return (
    <main style={{ background:'#FAF7F2' }}>
      <Navbar />
      <WhatsAppButton />

      {/* ══════════ HERO ══════════ */}
      <section ref={heroRef} style={{ position:'relative', minHeight:'100vh', background:'#0E0C0C', overflow:'hidden', display:'flex', alignItems:'center' }}>
        <div style={{ position:'absolute', inset:0, opacity:0.04, pointerEvents:'none',
          backgroundImage:'linear-gradient(#FAF7F2 1px,transparent 1px),linear-gradient(90deg,#FAF7F2 1px,transparent 1px)',
          backgroundSize:'70px 70px' }}/>
        <div style={{ position:'absolute', top:0, right:0, width:'55%', height:'100%', pointerEvents:'none',
          background:'linear-gradient(to left, rgba(204,31,31,0.12) 0%, transparent 70%)' }}/>

        <motion.div style={{ y:yHero, opacity:opHero, position:'relative', zIndex:10, width:'100%' }}>
          <div style={{ maxWidth:1280, margin:'0 auto', padding:'8rem 2.5rem 5rem',
            display:'grid', gridTemplateColumns:'1fr auto', gap:'4rem', alignItems:'center' }}>

            <div style={{ maxWidth:640 }}>
              {/* eyebrow */}
              <motion.div {...inView(0)} style={{ display:'flex', alignItems:'center', gap:10, marginBottom:28 }}>
                <div style={{ width:28, height:1, background:'#CC1F1F' }}/>
                <span style={{ fontFamily:C, fontSize:11, letterSpacing:'0.28em', textTransform:'uppercase', color:'#CC1F1F' }}>
                  Pastelería Artesanal · Buenos Aires
                </span>
              </motion.div>

              <motion.h1 {...inView(0.08)} style={{ fontFamily:P, fontSize:'clamp(3.8rem,9vw,7.5rem)', lineHeight:0.9, color:'#FAF7F2', marginBottom:24 }}>
                Damián<br />
                <em style={{ color:'#CC1F1F', fontStyle:'normal' }}>Borelli</em>
              </motion.h1>

              <motion.p {...inView(0.16)} style={{ fontFamily:C, fontSize:'1.3rem', fontWeight:300, color:'rgba(250,247,242,0.5)', lineHeight:1.7, maxWidth:480, marginBottom:40 }}>
                Tortas artesanales, catering de autor y clases de pastelería. Cada creación lleva técnica, amor y los mejores ingredientes.
              </motion.p>

              <motion.div {...inView(0.22)} style={{ display:'flex', flexWrap:'wrap', gap:14 }}>
                <Link href="/contacto" style={{
                  fontFamily:C, fontSize:12, letterSpacing:'0.2em', textTransform:'uppercase',
                  padding:'15px 36px', background:'#CC1F1F', color:'#fff', textDecoration:'none', transition:'background 0.3s',
                }}
                  onMouseEnter={e => (e.currentTarget.style.background='#A01818')}
                  onMouseLeave={e => (e.currentTarget.style.background='#CC1F1F')}
                >
                  Hacer un Pedido
                </Link>
                <a href={WHATSAPP} target="_blank" rel="noopener noreferrer" style={{
                  display:'flex', alignItems:'center', gap:10,
                  fontFamily:C, fontSize:12, letterSpacing:'0.2em', textTransform:'uppercase',
                  padding:'15px 28px', background:'rgba(37,211,102,0.12)', border:'1px solid rgba(37,211,102,0.3)',
                  color:'#25D366', textDecoration:'none', transition:'all 0.3s',
                }}
                  onMouseEnter={e => { e.currentTarget.style.background='rgba(37,211,102,0.2)'; e.currentTarget.style.borderColor='#25D366' }}
                  onMouseLeave={e => { e.currentTarget.style.background='rgba(37,211,102,0.12)'; e.currentTarget.style.borderColor='rgba(37,211,102,0.3)' }}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="#25D366">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                  </svg>
                  Escribir por WhatsApp
                </a>
              </motion.div>

              {/* Social row */}
              <motion.div {...inView(0.28)} style={{ display:'flex', alignItems:'center', gap:20, marginTop:36 }}>
                <span style={{ fontFamily:C, fontSize:10, letterSpacing:'0.2em', textTransform:'uppercase', color:'rgba(250,247,242,0.25)' }}>Seguinos</span>
                <div style={{ width:28, height:1, background:'rgba(250,247,242,0.1)' }}/>
                {[
                  { href:INSTAGRAM, label:'Instagram', icon:(
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
                    </svg>
                  )},
                  { href:FACEBOOK, label:'Facebook', icon:(
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z"/>
                    </svg>
                  )},
                ].map(s => (
                  <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer" style={{
                    display:'flex', alignItems:'center', gap:8,
                    fontFamily:C, fontSize:12, letterSpacing:'0.12em',
                    color:'rgba(250,247,242,0.35)', textDecoration:'none', transition:'color 0.25s',
                  }}
                    onMouseEnter={e => (e.currentTarget.style.color='#CC1F1F')}
                    onMouseLeave={e => (e.currentTarget.style.color='rgba(250,247,242,0.35)')}
                  >
                    {s.icon} {s.label}
                  </a>
                ))}
              </motion.div>
            </div>

            {/* Logo orbit */}
            <motion.div {...inView(0.15)} className="hidden lg:block" style={{ position:'relative', width:300, height:300 }}>
              <motion.div animate={{ rotate:360 }} transition={{ duration:30, repeat:Infinity, ease:'linear' }}
                style={{ position:'absolute', inset:0, borderRadius:'50%', border:'1px solid rgba(204,31,31,0.18)' }}/>
              <motion.div animate={{ rotate:-360 }} transition={{ duration:20, repeat:Infinity, ease:'linear' }}
                style={{ position:'absolute', inset:20, borderRadius:'50%', border:'1px dashed rgba(204,31,31,0.28)' }}/>

              {/* Logo real centrado */}
              <div style={{ position:'absolute', inset:50, borderRadius:'50%', overflow:'hidden', background:'#CC1F1F', boxShadow:'0 0 60px rgba(204,31,31,0.4)' }}>
                <Image src="/logo.jpg" alt="Dolche'B" width={200} height={200}
                  style={{ objectFit:'cover', width:'100%', height:'100%' }}
                  onError={() => {}}
                />
              </div>

              {/* floating tags */}
              {[
                { label:'🎂 Tortas',    angle:0   },
                { label:'🥐 Panadería', angle:128 },
                { label:'🎉 Eventos',   angle:252 },
              ].map((pill,i) => {
                const a = (pill.angle * Math.PI) / 180
                const r = 158
                const x = 150 + r * Math.sin(a) - 56
                const y2= 150 - r * Math.cos(a) - 16
                return (
                  <motion.div key={i}
                    animate={{ y:[0,-6,0] }} transition={{ duration:3, delay:i*1.1, repeat:Infinity }}
                    style={{ position:'absolute', left:x, top:y2,
                      background:'#1A1515', border:'1px solid rgba(204,31,31,0.3)',
                      padding:'5px 12px', fontFamily:C, fontSize:12,
                      color:'rgba(250,247,242,0.65)', whiteSpace:'nowrap',
                    }}
                  >
                    {pill.label}
                  </motion.div>
                )
              })}
            </motion.div>
          </div>
        </motion.div>

        {/* scroll hint */}
        <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay:2.2 }}
          style={{ position:'absolute', bottom:32, left:'50%', transform:'translateX(-50%)' }}>
          <motion.div animate={{ scaleY:[1,0.3,1], opacity:[0.4,1,0.4] }} transition={{ duration:1.6, repeat:Infinity }}
            style={{ width:1, height:40, background:'#CC1F1F' }}/>
        </motion.div>
      </section>

      {/* ══════════ STATS ══════════ */}
      <section style={{ background:'#CC1F1F' }}>
        <div style={{ maxWidth:1280, margin:'0 auto', padding:'0 2.5rem',
          display:'grid', gridTemplateColumns:'repeat(4,1fr)',
          borderLeft:'1px solid rgba(255,255,255,0.15)' }}>
          {stats.map((s,i) => (
            <motion.div key={i} {...inView(i*0.07)} style={{
              padding:'26px 32px', textAlign:'center',
              borderRight:'1px solid rgba(255,255,255,0.15)',
            }}>
              <p style={{ fontFamily:P, fontSize:'2rem', fontWeight:700, color:'#fff' }}>{s.n}</p>
              <p style={{ fontFamily:C, fontSize:10, letterSpacing:'0.22em', textTransform:'uppercase', color:'rgba(255,255,255,0.55)', marginTop:4 }}>{s.l}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ══════════ SERVICIOS ══════════ */}
      <section style={{ background:'#FAF7F2', padding:'8rem 2.5rem' }}>
        <div style={{ maxWidth:1280, margin:'0 auto', display:'grid', gridTemplateColumns:'1fr 1fr', gap:'5rem', alignItems:'center' }}>
          <motion.div {...inView()}>
            <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:24 }}>
              <div style={{ width:28, height:1, background:'#CC1F1F' }}/>
              <span style={{ fontFamily:C, fontSize:11, letterSpacing:'0.28em', textTransform:'uppercase', color:'#CC1F1F' }}>Servicios</span>
            </div>
            <h2 style={{ fontFamily:P, fontSize:'clamp(2.6rem,5vw,4.5rem)', lineHeight:0.95, color:'#0E0C0C', marginBottom:24 }}>
              Lo que<br /><em style={{ color:'#CC1F1F', fontStyle:'normal' }}>ofrecemos</em>
            </h2>
            <p style={{ fontFamily:C, fontSize:'1.2rem', fontWeight:300, color:'#8A7878', lineHeight:1.7, maxWidth:380, marginBottom:32 }}>
              Desde una torta personalizada hasta el catering completo de tu evento. Damián Borelli se encarga de todo.
            </p>
            <Link href="/eventos" style={{
              display:'inline-flex', alignItems:'center', gap:10,
              fontFamily:C, fontSize:11, letterSpacing:'0.2em', textTransform:'uppercase',
              color:'#CC1F1F', textDecoration:'none', borderBottom:'1px solid rgba(204,31,31,0.3)', paddingBottom:2,
              transition:'border-color 0.25s',
            }}
              onMouseEnter={e => (e.currentTarget.style.borderColor='#CC1F1F')}
              onMouseLeave={e => (e.currentTarget.style.borderColor='rgba(204,31,31,0.3)')}
            >
              Ver todos los servicios →
            </Link>
          </motion.div>

          <div style={{ borderTop:'1px solid rgba(14,12,12,0.08)' }}>
            {services.map((s,i) => (
              <motion.div key={i} {...inView(i*0.1)}>
                <Link href={s.href} style={{ textDecoration:'none', display:'block' }}>
                  <div style={{ display:'flex', gap:24, padding:'28px 16px',
                    borderBottom:'1px solid rgba(14,12,12,0.08)', cursor:'pointer',
                    transition:'background 0.3s', margin:'0 -16px' }}
                    onMouseEnter={e => (e.currentTarget.style.background='rgba(204,31,31,0.04)')}
                    onMouseLeave={e => (e.currentTarget.style.background='transparent')}
                  >
                    <span style={{ fontFamily:P, fontSize:'2.2rem', fontWeight:700, color:'rgba(204,31,31,0.2)', lineHeight:1, flexShrink:0, paddingTop:2, minWidth:40 }}>{s.n}</span>
                    <div style={{ flex:1 }}>
                      <h3 style={{ fontFamily:P, fontSize:'1.15rem', color:'#0E0C0C', marginBottom:6 }}>{s.t}</h3>
                      <p style={{ fontFamily:C, fontSize:'1.1rem', fontWeight:300, color:'#8A7878', lineHeight:1.5 }}>{s.d}</p>
                    </div>
                    <span style={{ color:'rgba(204,31,31,0.4)', fontSize:'1.1rem', alignSelf:'center', flexShrink:0 }}>→</span>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════ CREACIONES ══════════ */}
      <section style={{ background:'#0E0C0C', padding:'8rem 2.5rem' }}>
        <div style={{ maxWidth:1280, margin:'0 auto' }}>
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-end', marginBottom:48, flexWrap:'wrap', gap:16 }}>
            <motion.div {...inView()}>
              <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:16 }}>
                <div style={{ width:28, height:1, background:'#CC1F1F' }}/>
                <span style={{ fontFamily:C, fontSize:11, letterSpacing:'0.28em', textTransform:'uppercase', color:'#CC1F1F' }}>Del obrador</span>
              </div>
              <h2 style={{ fontFamily:P, fontSize:'clamp(2.6rem,5vw,4.5rem)', lineHeight:0.95, color:'#FAF7F2' }}>
                Creaciones<br /><em style={{ color:'#CC1F1F', fontStyle:'normal' }}>Destacadas</em>
              </h2>
            </motion.div>
            <Link href="/galeria" style={{
              fontFamily:C, fontSize:12, letterSpacing:'0.2em', textTransform:'uppercase',
              color:'rgba(250,247,242,0.3)', textDecoration:'none',
              borderBottom:'1px solid rgba(250,247,242,0.1)', paddingBottom:2,
              transition:'color 0.25s, border-color 0.25s',
            }}
              onMouseEnter={e => { e.currentTarget.style.color='#CC1F1F'; e.currentTarget.style.borderColor='#CC1F1F' }}
              onMouseLeave={e => { e.currentTarget.style.color='rgba(250,247,242,0.3)'; e.currentTarget.style.borderColor='rgba(250,247,242,0.1)' }}
            >
              Ver galería completa →
            </Link>
          </div>

          <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:2 }}>
            {creations.map((c,i) => (
              <motion.div key={i} {...inView(i*0.08)}>
                <Link href={c.href} style={{ textDecoration:'none', display:'block' }}>
                  <div style={{ background:'#1A1515', padding:'2.5rem 2rem', cursor:'pointer', transition:'background 0.4s', height:'100%' }}
                    onMouseEnter={e => (e.currentTarget.style.background='#CC1F1F')}
                    onMouseLeave={e => (e.currentTarget.style.background='#1A1515')}
                  >
                    <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:28 }}>
                      <span style={{ fontSize:'2.2rem' }}>{c.e}</span>
                      <span style={{ fontFamily:C, fontSize:10, letterSpacing:'0.2em', textTransform:'uppercase', color:'#CC1F1F' }}>{c.t}</span>
                    </div>
                    <h3 style={{ fontFamily:P, fontSize:'1.1rem', color:'#FAF7F2', marginBottom:8, lineHeight:1.2 }}>{c.n}</h3>
                    <p style={{ fontFamily:C, fontSize:'1rem', fontWeight:300, color:'rgba(250,247,242,0.4)', lineHeight:1.5 }}>{c.d}</p>
                    <div style={{ marginTop:24, height:1, width:28, background:'rgba(204,31,31,0.6)' }}/>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════ CTA ══════════ */}
      <section style={{ background:'#FAF7F2', padding:'8rem 2.5rem' }}>
        <div style={{ maxWidth:1280, margin:'0 auto', display:'grid', gridTemplateColumns:'1fr 1fr', gap:'5rem', alignItems:'stretch' }}>
          <motion.div {...inView()} style={{ display:'flex', flexDirection:'column', justifyContent:'center' }}>
            <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:24 }}>
              <div style={{ width:28, height:1, background:'#CC1F1F' }}/>
              <span style={{ fontFamily:C, fontSize:11, letterSpacing:'0.28em', textTransform:'uppercase', color:'#CC1F1F' }}>Contacto</span>
            </div>
            <h2 style={{ fontFamily:P, fontSize:'clamp(2.4rem,4.5vw,4rem)', lineHeight:0.95, color:'#0E0C0C', marginBottom:24 }}>
              ¿Tenés un evento<br /><em style={{ color:'#CC1F1F', fontStyle:'normal' }}>especial?</em>
            </h2>
            <p style={{ fontFamily:C, fontSize:'1.2rem', fontWeight:300, color:'#8A7878', lineHeight:1.7, maxWidth:400, marginBottom:36 }}>
              Conversemos. Diseñamos propuestas únicas para cada ocasión, desde una torta de cumpleaños hasta el catering completo de tu boda.
            </p>
            <div style={{ display:'flex', flexWrap:'wrap', gap:14 }}>
              <Link href="/contacto" style={{
                fontFamily:C, fontSize:11, letterSpacing:'0.2em', textTransform:'uppercase',
                padding:'14px 36px', background:'#CC1F1F', color:'#fff', textDecoration:'none', transition:'background 0.3s',
              }}
                onMouseEnter={e => (e.currentTarget.style.background='#A01818')}
                onMouseLeave={e => (e.currentTarget.style.background='#CC1F1F')}
              >
                Enviar Consulta
              </Link>
              <a href={WHATSAPP} target="_blank" rel="noopener noreferrer" style={{
                display:'flex', alignItems:'center', gap:8,
                fontFamily:C, fontSize:11, letterSpacing:'0.2em', textTransform:'uppercase',
                padding:'14px 28px', border:'1px solid rgba(37,211,102,0.4)',
                background:'rgba(37,211,102,0.06)', color:'#25D366', textDecoration:'none', transition:'all 0.3s',
              }}
                onMouseEnter={e => { e.currentTarget.style.background='rgba(37,211,102,0.15)'; e.currentTarget.style.borderColor='#25D366' }}
                onMouseLeave={e => { e.currentTarget.style.background='rgba(37,211,102,0.06)'; e.currentTarget.style.borderColor='rgba(37,211,102,0.4)' }}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="#25D366"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/></svg>
                WhatsApp directo
              </a>
            </div>
          </motion.div>

          {/* Info card */}
          <motion.div {...inView(0.15)} style={{ background:'#0E0C0C', padding:'3rem', display:'flex', flexDirection:'column', justifyContent:'space-between' }}>
            <div>
              <p style={{ fontFamily:C, fontSize:10, letterSpacing:'0.28em', textTransform:'uppercase', color:'rgba(250,247,242,0.25)', marginBottom:28 }}>
                Encontranos
              </p>
              <div style={{ display:'flex', flexDirection:'column', gap:0 }}>
                {[
                  { icon:'📍', l:'Zona',      v:'Buenos Aires — Zona Norte y CABA' },
                  { icon:'📞', l:'Teléfono',  v:'+54 9 11 XXXX-XXXX'              },
                  { icon:'📧', l:'Email',     v:'contacto@dolcheb.com'             },
                  { icon:'📸', l:'Instagram', v:'@dolcheb_pasteles'                },
                  { icon:'📘', l:'Facebook',  v:'/dolcheb'                         },
                ].map((row,i,arr) => (
                  <div key={i} style={{ display:'flex', alignItems:'center', gap:16, padding:'16px 0',
                    borderBottom: i < arr.length-1 ? '1px solid rgba(250,247,242,0.05)' : 'none' }}>
                    <span style={{ fontSize:'1.2rem', flexShrink:0 }}>{row.icon}</span>
                    <div>
                      <p style={{ fontFamily:C, fontSize:9, letterSpacing:'0.22em', textTransform:'uppercase', color:'rgba(250,247,242,0.25)' }}>{row.l}</p>
                      <p style={{ fontFamily:C, fontSize:'1.05rem', color:'rgba(250,247,242,0.75)', marginTop:2 }}>{row.v}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Social icons */}
            <div style={{ display:'flex', gap:12, marginTop:24, paddingTop:24, borderTop:'1px solid rgba(250,247,242,0.06)' }}>
              {[
                { href:INSTAGRAM, label:'Instagram', svg:<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="2" y="2" width="20" height="20" rx="5"/><path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg> },
                { href:FACEBOOK,  label:'Facebook',  svg:<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z"/></svg> },
                { href:WHATSAPP,  label:'WhatsApp',  svg:<svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/></svg> },
              ].map(s => (
                <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer" style={{
                  width:40, height:40, background:'rgba(250,247,242,0.05)',
                  display:'flex', alignItems:'center', justifyContent:'center',
                  color:'rgba(250,247,242,0.35)', textDecoration:'none', transition:'all 0.25s',
                }}
                  onMouseEnter={e => { e.currentTarget.style.background='#CC1F1F'; e.currentTarget.style.color='#fff' }}
                  onMouseLeave={e => { e.currentTarget.style.background='rgba(250,247,242,0.05)'; e.currentTarget.style.color='rgba(250,247,242,0.35)' }}
                >
                  {s.svg}
                </a>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ══════════ FOOTER ══════════ */}
      <footer style={{ background:'#0E0C0C', borderTop:'1px solid rgba(250,247,242,0.06)', padding:'3rem 2.5rem' }}>
        <div style={{ maxWidth:1280, margin:'0 auto' }}>
          <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', flexWrap:'wrap', gap:24, marginBottom:32, paddingBottom:32, borderBottom:'1px solid rgba(250,247,242,0.06)' }}>
            {/* Brand */}
            <div style={{ display:'flex', alignItems:'center', gap:14 }}>
              <div style={{ width:44, height:44, borderRadius:'50%', overflow:'hidden', background:'#CC1F1F' }}>
                <Image src="/logo.jpg" alt="Logo" width={44} height={44} style={{ objectFit:'cover', width:'100%', height:'100%' }} onError={() => {}}/>
              </div>
              <div>
                <p style={{ fontFamily:P, fontWeight:700, color:'#FAF7F2', fontSize:16, letterSpacing:'0.04em' }}>Dolche'B</p>
                <p style={{ fontFamily:C, color:'rgba(250,247,242,0.3)', fontSize:11, marginTop:2 }}>Damián Borelli · Pastelería Artesanal</p>
              </div>
            </div>
            {/* Nav */}
            <div style={{ display:'flex', gap:28, flexWrap:'wrap' }}>
              {[
                { href:'/sobre-mi', l:'El Chef' },
                { href:'/galeria',  l:'Galería' },
                { href:'/blog',     l:'Recetas' },
                { href:'/eventos',  l:'Eventos' },
                { href:'/contacto', l:'Contacto'},
              ].map(n => (
                <Link key={n.href} href={n.href} style={{ fontFamily:C, fontSize:12, letterSpacing:'0.15em', textTransform:'uppercase', color:'rgba(250,247,242,0.3)', textDecoration:'none', transition:'color 0.25s' }}
                  onMouseEnter={e => (e.currentTarget.style.color='#CC1F1F')}
                  onMouseLeave={e => (e.currentTarget.style.color='rgba(250,247,242,0.3)')}
                >{n.l}</Link>
              ))}
            </div>
            {/* Social */}
            <div style={{ display:'flex', gap:10 }}>
              {[
                { href:INSTAGRAM, svg:<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="2" y="2" width="20" height="20" rx="5"/><path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg> },
                { href:FACEBOOK,  svg:<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z"/></svg> },
                { href:WHATSAPP,  svg:<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/></svg> },
              ].map((s,i) => (
                <a key={i} href={s.href} target="_blank" rel="noopener noreferrer" style={{
                  width:36, height:36, background:'rgba(250,247,242,0.05)',
                  display:'flex', alignItems:'center', justifyContent:'center',
                  color:'rgba(250,247,242,0.3)', textDecoration:'none', transition:'all 0.25s',
                }}
                  onMouseEnter={e => { e.currentTarget.style.background='#CC1F1F'; e.currentTarget.style.color='#fff' }}
                  onMouseLeave={e => { e.currentTarget.style.background='rgba(250,247,242,0.05)'; e.currentTarget.style.color='rgba(250,247,242,0.3)' }}
                >{s.svg}</a>
              ))}
            </div>
          </div>
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', flexWrap:'wrap', gap:12 }}>
            <p style={{ fontFamily:C, color:'rgba(250,247,242,0.18)', fontSize:13 }}>© 2026 Dolche'B — Todos los derechos reservados</p>
            <p style={{ fontFamily:C, color:'rgba(250,247,242,0.18)', fontSize:13 }}>Hecho con ❤️ en Buenos Aires</p>
          </div>
        </div>
      </footer>
    </main>
  )
}