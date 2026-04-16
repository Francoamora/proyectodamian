'use client'
import { motion } from 'framer-motion'
import Link from 'next/link'
import Navbar from '@/components/Navbar'

const P = 'var(--playfair-font)'
const C = 'var(--cormorant-font)'

const inView = (delay = 0) => ({
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.75, delay, ease: [0.25,0.1,0.25,1] as const },
})

const TAG_STYLE = {
  display:'flex', alignItems:'center', gap:10,
  fontFamily: C, fontSize:11, letterSpacing:'0.28em',
  textTransform:'uppercase' as const, color:'#CC1F1F',
}
const LINE = { width:28, height:1, background:'#CC1F1F', flexShrink:0 as const }

const timeline = [
  { year:'2005', title:'Los inicios', desc:'Damián comienza su formación en pastelería clásica francesa en Buenos Aires, descubriendo su pasión por el detalle y la precisión.' },
  { year:'2010', title:'Formación', desc:'Perfecciona sus técnicas en España e Italia, absorbiendo las tradiciones de la pastelería mediterránea y la alta cocina europea.' },
  { year:'2015', title:'Nacimiento de Dolche\'B', desc:'Regresa a Argentina y funda su emprendimiento, fusionando lo aprendido en Europa con los sabores y las emociones de su tierra.' },
  { year:'2020', title:'Referente gastronómico', desc:'Dolche\'B se consolida como uno de los emprendimientos culinarios mas importante del norte Santafesino' },
  { year:'2026', title:'Hoy', desc:'Más de 500 eventos realizados, cientos de tortas entregadas y un equipo comprometido con la excelencia en cada creación.' },
]

const values = [
  { icon:'🌾', title:'Ingredientes de origen', desc:'Solo trabajamos con productores locales y materias primas de primera calidad.' },
  { icon:'🔬', title:'Técnica y precisión',    desc:'Cada receta es resultado de años de investigación y perfeccionamiento constante.' },
  { icon:'❤️', title:'Pasión en cada bocado',  desc:'El amor por la gastronomía se siente en cada detalle de nuestras creaciones.' },
  { icon:'🤝', title:'Compromiso contigo',     desc:'Escuchamos tus ideas y las transformamos en experiencias únicas e irrepetibles.' },
]

export default function SobreMi() {
  return (
    <main style={{ background:'#FAF7F2' }}>
      <Navbar />

      {/* ── HERO ── */}
      <section style={{ background:'#0E0C0C', padding:'10rem 2.5rem 7rem', position:'relative', overflow:'hidden' }}>
        <div style={{
          position:'absolute', inset:0, opacity:0.04, pointerEvents:'none',
          backgroundImage:'linear-gradient(#FAF7F2 1px,transparent 1px),linear-gradient(90deg,#FAF7F2 1px,transparent 1px)',
          backgroundSize:'70px 70px',
        }}/>
        <div style={{ position:'absolute', bottom:0, left:0, right:0, height:1, background:'rgba(204,31,31,0.2)' }}/>

        <div style={{ maxWidth:1280, margin:'0 auto', display:'grid', gridTemplateColumns:'1fr 1fr', gap:'5rem', alignItems:'center' }}>
          <motion.div {...inView()}>
            <div style={{ ...TAG_STYLE, marginBottom:24 }}><span style={LINE}/>El Chef</div>
            <h1 style={{ fontFamily:P, fontSize:'clamp(3rem,7vw,6rem)', lineHeight:0.92, color:'#FAF7F2', marginBottom:24 }}>
              Damián<br /><em style={{ color:'#CC1F1F', fontStyle:'normal' }}>Borelli</em>
            </h1>
            <p style={{ fontFamily:C, fontSize:'1.2rem', fontWeight:300, color:'rgba(250,247,242,0.5)', lineHeight:1.7, maxWidth:420 }}>
              Chef con más de 15 años de experiencia, en el norte Santefesino. Creador de Dolche'B, donde la técnica y el alma se encuentran en cada plato.
            </p>
          </motion.div>

          <motion.div {...inView(0.15)} style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:1 }}>
            {[
              { n:'15+', l:'Años de experiencia' },
              { n:'500+',l:'Eventos realizados'  },
              { n:'12',  l:'Especialidades'      },
              { n:'5★',  l:'Calificación promedio'},
            ].map((s,i) => (
              <div key={i} style={{ background:'#1A1515', padding:'2rem', textAlign:'center' }}>
                <p style={{ fontFamily:P, fontSize:'2.2rem', fontWeight:700, color:'#CC1F1F' }}>{s.n}</p>
                <p style={{ fontFamily:C, fontSize:10, letterSpacing:'0.22em', textTransform:'uppercase', color:'rgba(250,247,242,0.4)', marginTop:6 }}>{s.l}</p>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── BIO ── */}
      <section style={{ padding:'8rem 2.5rem', background:'#FAF7F2' }}>
        <div style={{ maxWidth:1280, margin:'0 auto', display:'grid', gridTemplateColumns:'1fr 1fr', gap:'6rem', alignItems:'start' }}>
          <motion.div {...inView()}>
            <div style={{ ...TAG_STYLE, marginBottom:24 }}><span style={LINE}/>La Historia</div>
            <h2 style={{ fontFamily:P, fontSize:'clamp(2.2rem,4vw,3.5rem)', lineHeight:0.95, color:'#0E0C0C', marginBottom:32 }}>
              Una vocación que<br /><em style={{ color:'#CC1F1F', fontStyle:'normal' }}>nació en casa</em>
            </h2>
            <div style={{ display:'flex', flexDirection:'column', gap:20 }}>
              {[
                'Desde chico, Damián encontró en la cocina un espacio de creación y afecto. Lo que comenzó como curiosidad entre ollas y harinas se transformó en una vocación que lo llevó a recorrer cocinas de España, Italia y Francia.',
                'Hoy, con más de 15 años de trayectoria, Damián Borelli es uno de los referentes de la pastelería artesanal en Buenos Aires. Su filosofía es simple: ingredientes honestos, técnica precisa y mucho amor.',
                'Dolche\'B es el resultado de ese camino. Un emprendimiento que combina lo mejor de la pastelería europea con el calor y la identidad argentina.',
              ].map((p,i) => (
                <p key={i} style={{ fontFamily:C, fontSize:'1.2rem', fontWeight:300, color:'#8A7878', lineHeight:1.75 }}>{p}</p>
              ))}
            </div>
          </motion.div>

          {/* Decorative quote */}
          <motion.div {...inView(0.2)} style={{ position:'sticky', top:'8rem' }}>
            <div style={{ background:'#0E0C0C', padding:'3.5rem', position:'relative' }}>
              <div style={{ position:'absolute', top:28, left:28, fontFamily:P, fontSize:'6rem', color:'#CC1F1F', lineHeight:1, opacity:0.6 }}>"</div>
              <p style={{ fontFamily:P, fontSize:'1.5rem', fontStyle:'italic', color:'#FAF7F2', lineHeight:1.5, marginTop:'3rem', position:'relative', zIndex:1 }}>
                Cocinar es traducir emociones en sabores. Cada torta, cada postre, lleva una parte de mí.
              </p>
              <div style={{ marginTop:28, paddingTop:24, borderTop:'1px solid rgba(250,247,242,0.08)' }}>
                <p style={{ fontFamily:P, fontWeight:700, color:'#CC1F1F', fontSize:'1rem' }}>Damián Borelli</p>
                <p style={{ fontFamily:C, fontSize:11, letterSpacing:'0.2em', textTransform:'uppercase', color:'rgba(250,247,242,0.3)', marginTop:4 }}>Chef & Fundador</p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── TIMELINE ── */}
      <section style={{ background:'#0E0C0C', padding:'8rem 2.5rem' }}>
        <div style={{ maxWidth:900, margin:'0 auto' }}>
          <motion.div {...inView()} style={{ marginBottom:56, textAlign:'center' }}>
            <div style={{ ...TAG_STYLE, justifyContent:'center', marginBottom:16 }}><span style={LINE}/>Trayectoria<span style={LINE}/></div>
            <h2 style={{ fontFamily:P, fontSize:'clamp(2.2rem,4vw,3.5rem)', color:'#FAF7F2' }}>
              El camino hasta <em style={{ color:'#CC1F1F', fontStyle:'normal' }}>hoy</em>
            </h2>
          </motion.div>

          <div style={{ position:'relative' }}>
            {/* vertical line */}
            <div style={{ position:'absolute', left:80, top:0, bottom:0, width:1, background:'rgba(204,31,31,0.2)' }}/>

            {timeline.map((item,i) => (
              <motion.div key={i} {...inView(i*0.1)} style={{ display:'flex', gap:40, marginBottom:48, position:'relative' }}>
                <div style={{ width:160, flexShrink:0, textAlign:'right', paddingRight:40, paddingTop:4 }}>
                  <span style={{ fontFamily:P, fontSize:'1.3rem', fontWeight:700, color:'#CC1F1F' }}>{item.year}</span>
                </div>
                {/* dot */}
                <div style={{
                  position:'absolute', left:74, top:8,
                  width:13, height:13, borderRadius:'50%',
                  background:'#CC1F1F', border:'2px solid #0E0C0C',
                  boxShadow:'0 0 0 3px rgba(204,31,31,0.3)',
                }}/>
                <div style={{ flex:1, paddingLeft:8 }}>
                  <h3 style={{ fontFamily:P, fontSize:'1.15rem', color:'#FAF7F2', marginBottom:8 }}>{item.title}</h3>
                  <p style={{ fontFamily:C, fontSize:'1.1rem', fontWeight:300, color:'rgba(250,247,242,0.45)', lineHeight:1.65 }}>{item.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── VALORES ── */}
      <section style={{ padding:'8rem 2.5rem', background:'#FAF7F2' }}>
        <div style={{ maxWidth:1280, margin:'0 auto' }}>
          <motion.div {...inView()} style={{ marginBottom:56, textAlign:'center' }}>
            <div style={{ ...TAG_STYLE, justifyContent:'center', marginBottom:16 }}><span style={LINE}/>Filosofía<span style={LINE}/></div>
            <h2 style={{ fontFamily:P, fontSize:'clamp(2.2rem,4vw,3.5rem)', color:'#0E0C0C' }}>
              Lo que nos <em style={{ color:'#CC1F1F', fontStyle:'normal' }}>define</em>
            </h2>
          </motion.div>

          <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:2 }}>
            {values.map((v,i) => (
              <motion.div key={i} {...inView(i*0.1)} style={{
                background:'#0E0C0C', padding:'2.5rem 2rem', cursor:'default',
                transition:'background 0.4s',
              }}
                onMouseEnter={e => (e.currentTarget.style.background = '#CC1F1F')}
                onMouseLeave={e => (e.currentTarget.style.background = '#0E0C0C')}
              >
                <span style={{ fontSize:'2rem', display:'block', marginBottom:20 }}>{v.icon}</span>
                <h3 style={{ fontFamily:P, fontSize:'1.05rem', color:'#FAF7F2', marginBottom:10 }}>{v.title}</h3>
                <p style={{ fontFamily:C, fontSize:'1rem', fontWeight:300, color:'rgba(250,247,242,0.45)', lineHeight:1.55 }}>{v.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section style={{ background:'#CC1F1F', padding:'6rem 2.5rem', textAlign:'center' }}>
        <motion.div {...inView()}>
          <h2 style={{ fontFamily:P, fontSize:'clamp(2rem,4vw,3.2rem)', color:'#fff', marginBottom:16 }}>
            ¿Querés trabajar con Damián?
          </h2>
          <p style={{ fontFamily:C, fontSize:'1.2rem', fontWeight:300, color:'rgba(255,255,255,0.7)', marginBottom:36 }}>
            Contanos tu idea y juntos creamos algo inolvidable.
          </p>
          <Link href="/contacto" style={{
            fontFamily:C, fontSize:11, letterSpacing:'0.22em', textTransform:'uppercase',
            padding:'14px 40px', background:'#fff', color:'#CC1F1F', textDecoration:'none',
          }}>
            Contactar Ahora
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
            <div>
              <p style={{ fontFamily:P, fontWeight:700, color:'#FAF7F2', fontSize:14 }}>Dolche'B</p>
              <p style={{ fontFamily:C, color:'rgba(250,247,242,0.3)', fontSize:11 }}>Damián Borelli</p>
            </div>
          </div>
          <p style={{ fontFamily:C, color:'rgba(250,247,242,0.18)', fontSize:13 }}>© 2026 Dolche'B</p>
          <div style={{ display:'flex', gap:24 }}>
            {['Instagram','Facebook','WhatsApp'].map(s => (
              <a key={s} href="#" style={{ fontFamily:C, fontSize:13, color:'rgba(250,247,242,0.25)', textDecoration:'none' }}>{s}</a>
            ))}
          </div>
        </div>
      </footer>
    </main>
  )
}