'use client'
import { useState } from 'react'
import { motion } from 'framer-motion'
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

const inputStyle: React.CSSProperties = {
  width:'100%', background:'#1A1515', border:'1px solid rgba(250,247,242,0.08)',
  padding:'14px 18px', fontFamily:C, fontSize:'1.1rem',
  color:'#FAF7F2', outline:'none', transition:'border-color 0.25s',
}

type FormData = {
  nombre: string
  email: string
  telefono: string
  tipo: string
  fecha: string
  personas: string
  mensaje: string
}

export default function Contacto() {
  const [form, setForm] = useState<FormData>({
    nombre:'', email:'', telefono:'', tipo:'', fecha:'', personas:'', mensaje:'',
  })
  const [sent, setSent] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }))
  }

  const handleSubmit = async (e: React.MouseEvent) => {
    e.preventDefault()
    if (!form.nombre || !form.email || !form.mensaje) return
    setLoading(true)
    try {
      await fetch('http://127.0.0.1:8000/api/reservas/', {
        method:'POST',
        headers:{ 'Content-Type':'application/json' },
        body: JSON.stringify({
          nombre: form.nombre,
          email: form.email,
          telefono: form.telefono || '0000000000',
          fecha: form.fecha || new Date().toISOString().split('T')[0],
          hora: '12:00:00',
          personas: parseInt(form.personas) || 2,
          mensaje: form.mensaje,
        }),
      })
      setSent(true)
    } catch {
      setSent(true)
    } finally {
      setLoading(false)
    }
  }

  return (
    <main style={{ background:'#0E0C0C' }}>
      <Navbar />

      {/* HERO */}
      <section style={{ padding:'10rem 2.5rem 6rem', position:'relative', overflow:'hidden' }}>
        <div style={{ position:'absolute', inset:0, opacity:0.04, pointerEvents:'none',
          backgroundImage:'linear-gradient(#FAF7F2 1px,transparent 1px),linear-gradient(90deg,#FAF7F2 1px,transparent 1px)',
          backgroundSize:'70px 70px' }}/>
        <div style={{ position:'absolute', top:0, left:0, width:'50%', height:'100%',
          background:'linear-gradient(to right, rgba(204,31,31,0.07) 0%, transparent 100%)', pointerEvents:'none' }}/>
        <div style={{ maxWidth:1280, margin:'0 auto' }}>
          <motion.div {...inView()}>
            <div style={{ ...TAG_STYLE, marginBottom:24 }}><span style={LINE}/>Contacto</div>
            <h1 style={{ fontFamily:P, fontSize:'clamp(3rem,7vw,6rem)', lineHeight:0.92, color:'#FAF7F2', marginBottom:20 }}>
              Hablemos de<br /><em style={{ color:'#CC1F1F', fontStyle:'normal' }}>tu proyecto</em>
            </h1>
            <p style={{ fontFamily:C, fontSize:'1.2rem', fontWeight:300, color:'rgba(250,247,242,0.45)', maxWidth:480, lineHeight:1.7 }}>
              Respondemos en menos de 24 horas. Contanos tu idea y Damián te propone algo único.
            </p>
          </motion.div>
        </div>
      </section>

      {/* FORM + INFO */}
      <section style={{ padding:'0 2.5rem 8rem' }}>
        <div style={{ maxWidth:1280, margin:'0 auto', display:'grid', gridTemplateColumns:'1fr 420px', gap:'4rem', alignItems:'start' }}>

          {/* FORM */}
          <motion.div {...inView()}>
            {sent ? (
              <motion.div initial={{ opacity:0, scale:0.95 }} animate={{ opacity:1, scale:1 }}
                style={{ background:'#1A1515', padding:'4rem', textAlign:'center' }}>
                <span style={{ fontSize:'3.5rem', display:'block', marginBottom:20 }}>✅</span>
                <h2 style={{ fontFamily:P, fontSize:'2rem', color:'#FAF7F2', marginBottom:12 }}>¡Mensaje enviado!</h2>
                <p style={{ fontFamily:C, fontSize:'1.2rem', fontWeight:300, color:'rgba(250,247,242,0.5)' }}>
                  Damián te va a responder en las próximas horas.
                </p>
              </motion.div>
            ) : (
              <div style={{ background:'#1A1515', padding:'3rem' }}>
                <h2 style={{ fontFamily:P, fontSize:'1.6rem', color:'#FAF7F2', marginBottom:8 }}>Formulario de contacto</h2>
                <p style={{ fontFamily:C, fontSize:'1.05rem', color:'rgba(250,247,242,0.4)', marginBottom:36 }}>
                  Todos los campos marcados con * son obligatorios.
                </p>

                <div style={{ display:'flex', flexDirection:'column', gap:16 }}>
                  {/* Row 1 */}
                  <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:16 }}>
                    <div>
                      <label style={{ fontFamily:C, fontSize:10, letterSpacing:'0.22em', textTransform:'uppercase', color:'rgba(250,247,242,0.35)', display:'block', marginBottom:8 }}>
                        Nombre *
                      </label>
                      <input name="nombre" value={form.nombre} onChange={handleChange}
                        placeholder="Tu nombre completo"
                        style={{ ...inputStyle }}
                        onFocus={e => (e.currentTarget.style.borderColor = '#CC1F1F')}
                        onBlur={e => (e.currentTarget.style.borderColor = 'rgba(250,247,242,0.08)')}
                      />
                    </div>
                    <div>
                      <label style={{ fontFamily:C, fontSize:10, letterSpacing:'0.22em', textTransform:'uppercase', color:'rgba(250,247,242,0.35)', display:'block', marginBottom:8 }}>
                        Email *
                      </label>
                      <input name="email" type="email" value={form.email} onChange={handleChange}
                        placeholder="tu@email.com"
                        style={{ ...inputStyle }}
                        onFocus={e => (e.currentTarget.style.borderColor = '#CC1F1F')}
                        onBlur={e => (e.currentTarget.style.borderColor = 'rgba(250,247,242,0.08)')}
                      />
                    </div>
                  </div>

                  {/* Row 2 */}
                  <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:16 }}>
                    <div>
                      <label style={{ fontFamily:C, fontSize:10, letterSpacing:'0.22em', textTransform:'uppercase', color:'rgba(250,247,242,0.35)', display:'block', marginBottom:8 }}>
                        Teléfono
                      </label>
                      <input name="telefono" value={form.telefono} onChange={handleChange}
                        placeholder="+54 9 11 XXXX-XXXX"
                        style={{ ...inputStyle }}
                        onFocus={e => (e.currentTarget.style.borderColor = '#CC1F1F')}
                        onBlur={e => (e.currentTarget.style.borderColor = 'rgba(250,247,242,0.08)')}
                      />
                    </div>
                    <div>
                      <label style={{ fontFamily:C, fontSize:10, letterSpacing:'0.22em', textTransform:'uppercase', color:'rgba(250,247,242,0.35)', display:'block', marginBottom:8 }}>
                        Tipo de evento
                      </label>
                      <select name="tipo" value={form.tipo} onChange={handleChange}
                        style={{ ...inputStyle, appearance:'none' }}
                        onFocus={e => (e.currentTarget.style.borderColor = '#CC1F1F')}
                        onBlur={e => (e.currentTarget.style.borderColor = 'rgba(250,247,242,0.08)')}
                      >
                        <option value="" style={{ background:'#1A1515' }}>Seleccioná...</option>
                        {['Torta personalizada','Boda / Casamiento','Cumpleaños','Evento corporativo','Catering','Clase de cocina','Otro'].map(o => (
                          <option key={o} value={o} style={{ background:'#1A1515' }}>{o}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Row 3 */}
                  <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:16 }}>
                    <div>
                      <label style={{ fontFamily:C, fontSize:10, letterSpacing:'0.22em', textTransform:'uppercase', color:'rgba(250,247,242,0.35)', display:'block', marginBottom:8 }}>
                        Fecha estimada
                      </label>
                      <input name="fecha" type="date" value={form.fecha} onChange={handleChange}
                        style={{ ...inputStyle, colorScheme:'dark' }}
                        onFocus={e => (e.currentTarget.style.borderColor = '#CC1F1F')}
                        onBlur={e => (e.currentTarget.style.borderColor = 'rgba(250,247,242,0.08)')}
                      />
                    </div>
                    <div>
                      <label style={{ fontFamily:C, fontSize:10, letterSpacing:'0.22em', textTransform:'uppercase', color:'rgba(250,247,242,0.35)', display:'block', marginBottom:8 }}>
                        Cantidad de personas
                      </label>
                      <input name="personas" type="number" value={form.personas} onChange={handleChange}
                        placeholder="Ej: 50"
                        style={{ ...inputStyle }}
                        onFocus={e => (e.currentTarget.style.borderColor = '#CC1F1F')}
                        onBlur={e => (e.currentTarget.style.borderColor = 'rgba(250,247,242,0.08)')}
                      />
                    </div>
                  </div>

                  {/* Mensaje */}
                  <div>
                    <label style={{ fontFamily:C, fontSize:10, letterSpacing:'0.22em', textTransform:'uppercase', color:'rgba(250,247,242,0.35)', display:'block', marginBottom:8 }}>
                      Contanos tu idea *
                    </label>
                    <textarea name="mensaje" value={form.mensaje} onChange={handleChange}
                      placeholder="Describí tu evento, gustos, referencias, presupuesto estimado..."
                      rows={5}
                      style={{ ...inputStyle, resize:'vertical', lineHeight:1.6 }}
                      onFocus={e => (e.currentTarget.style.borderColor = '#CC1F1F')}
                      onBlur={e => (e.currentTarget.style.borderColor = 'rgba(250,247,242,0.08)')}
                    />
                  </div>

                  <button onClick={handleSubmit} disabled={loading} style={{
                    fontFamily:C, fontSize:11, letterSpacing:'0.22em', textTransform:'uppercase',
                    padding:'16px 40px', background: loading ? '#8A7878' : '#CC1F1F',
                    color:'#fff', border:'none', cursor: loading ? 'default' : 'pointer',
                    transition:'background 0.3s', alignSelf:'flex-start', marginTop:8,
                  }}>
                    {loading ? 'Enviando...' : 'Enviar Consulta'}
                  </button>
                </div>
              </div>
            )}
          </motion.div>

          {/* INFO */}
          <motion.div {...inView(0.15)} style={{ display:'flex', flexDirection:'column', gap:3, position:'sticky', top:'6rem' }}>
            {[
              { icon:'📍', label:'Dónde estamos',   val:'Buenos Aires, Argentina',  sub:'Zona Norte y CABA'             },
              { icon:'📞', label:'Teléfono',         val:'+54 9 11 XXXX-XXXX',       sub:'Lunes a sábado 9 - 20hs'      },
              { icon:'📧', label:'Email',            val:'contacto@dolcheb.com',      sub:'Respondemos en 24hs'          },
              { icon:'📸', label:'Instagram',        val:'@dolcheb_pasteles',         sub:'Seguinos para ver novedades'  },
            ].map((row,i) => (
              <div key={i} style={{ background:'#1A1515', padding:'1.8rem 2rem', display:'flex', gap:16 }}>
                <span style={{ fontSize:'1.4rem', flexShrink:0 }}>{row.icon}</span>
                <div>
                  <p style={{ fontFamily:C, fontSize:10, letterSpacing:'0.2em', textTransform:'uppercase', color:'rgba(250,247,242,0.3)' }}>{row.label}</p>
                  <p style={{ fontFamily:C, fontSize:'1.1rem', color:'#FAF7F2', margin:'4px 0 2px' }}>{row.val}</p>
                  <p style={{ fontFamily:C, fontSize:'0.95rem', color:'rgba(250,247,242,0.35)' }}>{row.sub}</p>
                </div>
              </div>
            ))}

            {/* Horarios */}
            <div style={{ background:'#CC1F1F', padding:'2rem' }}>
              <p style={{ fontFamily:C, fontSize:10, letterSpacing:'0.22em', textTransform:'uppercase', color:'rgba(255,255,255,0.6)', marginBottom:16 }}>
                Horarios de atención
              </p>
              {[
                { d:'Lunes – Viernes', h:'09:00 – 20:00' },
                { d:'Sábados',         h:'09:00 – 15:00' },
                { d:'Domingos',        h:'Cerrado'        },
              ].map((row,i) => (
                <div key={i} style={{ display:'flex', justifyContent:'space-between', padding:'8px 0', borderBottom: i<2 ? '1px solid rgba(255,255,255,0.15)' : 'none' }}>
                  <span style={{ fontFamily:C, fontSize:'1rem', color:'rgba(255,255,255,0.7)' }}>{row.d}</span>
                  <span style={{ fontFamily:C, fontSize:'1rem', color:'#fff', fontWeight:500 }}>{row.h}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{ borderTop:'1px solid rgba(250,247,242,0.06)', padding:'2.5rem' }}>
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