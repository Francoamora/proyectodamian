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

export default function Eventos() {
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
            <p style={{ fontFamily:P, fontWeight:700, color:'#FAF7F2', fontSize:14 }}>Dolche'B</p>
          </div>
          <p style={{ fontFamily:C, color:'rgba(250,247,242,0.18)', fontSize:13 }}>© 2026 Dolche'B</p>
        </div>
      </footer>
    </main>
  )
}