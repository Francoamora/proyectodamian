'use client'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { useParams } from 'next/navigation'
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

const difColor: Record<string, string> = {
  'Fácil':'#2D7A4F', 'Medio':'#A06C10', 'Difícil':'#CC1F1F',
}

const recetasDB: Record<string, {
  titulo: string; emoji: string; tag: string; dificultad: string;
  tiempo: number; porciones: number; desc: string;
  intro: string;
  ingredientes: string[];
  pasos: { titulo: string; desc: string }[];
  tips: string[];
}> = {
  'medialunas-artesanales': {
    titulo:'Medialunas Artesanales',
    emoji:'🥐', tag:'Panadería', dificultad:'Difícil',
    tiempo:240, porciones:12,
    desc:'El secreto está en el levado lento. 72 horas de paciencia.',
    intro:'Esta es la receta que más orgullo me da. Las medialunas son el test definitivo para cualquier pastelero. Requieren paciencia, técnica y entender cómo se comporta la masa en cada etapa. No hay atajos.',
    ingredientes:[
      '500g harina 000', '10g levadura seca', '80g azúcar',
      '10g sal fina', '2 huevos', '200ml leche entera tibia',
      '250g manteca fría (para el empaste)', '1 huevo + leche (para pintar)',
      'Almíbar: 100g azúcar + 100ml agua',
    ],
    pasos:[
      { titulo:'Masa base', desc:'Mezclar harina, levadura, azúcar y sal. Incorporar los huevos y la leche tibia de a poco. Amasar 10 minutos hasta obtener una masa lisa y elástica. Cubrir y llevar a la heladera 8 horas.' },
      { titulo:'Empaste de manteca', desc:'Aplanar la manteca fría entre papel film hasta obtener un rectángulo de 1cm de grosor. La manteca debe estar fría pero maleable, no dura.' },
      { titulo:'Laminado', desc:'Estirar la masa en rectángulo. Colocar la manteca en el centro y encerrarla. Hacer 3 pliegues simples con reposo de 30 minutos en heladera entre cada uno.' },
      { titulo:'Formado', desc:'Estirar la masa a 3mm de grosor. Cortar triángulos de 10x15cm. Enrollar desde la base hacia la punta. Doblar las puntas para dar la forma característica.' },
      { titulo:'Levado final', desc:'Disponer en placa con papel. Dejar levar 2-3 horas a temperatura ambiente hasta que dupliquen su tamaño.' },
      { titulo:'Cocción', desc:'Pintar con huevo batido con leche. Hornear a 200°C por 14-16 minutos hasta dorar. Al salir, pintar inmediatamente con almíbar caliente.' },
    ],
    tips:[
      'La temperatura de la manteca es todo. Si se derrite, la masa pierde las capas.',
      'No te saltes los reposos en heladera. Son los que crean el hojaldrado.',
      'El almíbar caliente sobre las medialunas recién horneadas es lo que da ese brillo característico.',
      'Podés congelar las medialunas formadas (sin levar) y hornearlas directo del freezer.',
    ],
  },
  'creme-brulee-clasica': {
    titulo:'Crème Brûlée Clásica',
    emoji:'🍮', tag:'Postres clásicos', dificultad:'Medio',
    tiempo:60, porciones:6,
    desc:'Crema suave, vainilla de Madagascar y esa capa de azúcar quemada.',
    intro:'La crème brûlée parece simple pero esconde varios secretos. El más importante: no cocerla de más. La textura debe ser apenas firme, con un centro que tiemble levemente al moverla.',
    ingredientes:[
      '500ml crema de leche 35% MG', '6 yemas de huevo',
      '100g azúcar', '1 vaina de vainilla de Madagascar',
      'Azúcar extra para quemar',
    ],
    pasos:[
      { titulo:'Infusión', desc:'Calentar la crema con la vaina de vainilla abierta (raspar las semillas). Llevar hasta casi hervir, retirar del fuego y dejar infusionar 15 minutos.' },
      { titulo:'Mezcla', desc:'Batir las yemas con el azúcar hasta blanquear levemente. No incorporar demasiado aire. Agregar la crema tibia de a poco, siempre revolviendo.' },
      { titulo:'Colado y armado', desc:'Colar la mezcla y distribuir en ramequines. Colocar en una fuente con agua caliente (baño maría). El agua debe llegar a mitad de los moldes.' },
      { titulo:'Cocción', desc:'Hornear a 150°C por 35-40 minutos. La crema debe estar firme en los bordes pero temblar en el centro. Retirar y enfriar a temperatura ambiente.' },
      { titulo:'Reposo y acabado', desc:'Llevar a heladera mínimo 4 horas (ideal toda la noche). Al momento de servir, espolvorear azúcar pareja y quemar con soplete hasta caramelizar.' },
    ],
    tips:[
      'Usá yemas a temperatura ambiente para mejor integración.',
      'El baño maría es obligatorio. Sin él, la textura queda gomosa.',
      'Quemá el azúcar en dos capas para una costra más gruesa y pareja.',
      'Si no tenés soplete, podés usar el grill del horno en modo máximo.',
    ],
  },
}

const fallback = {
  titulo:'Receta', emoji:'🍽️', tag:'Cocina', dificultad:'Medio',
  tiempo:60, porciones:4,
  desc:'Una creación especial del Chef Damián Borelli.',
  intro:'Esta receta está en desarrollo. Volvé pronto para verla completa.',
  ingredientes:['Ingredientes a confirmar'],
  pasos:[{ titulo:'Preparación', desc:'Paso a paso próximamente.' }],
  tips:['Seguinos en Instagram para ver el proceso en tiempo real.'],
}

export default function RecetaDetalle() {
  const { slug } = useParams()
  const receta = recetasDB[slug as string] || { ...fallback, titulo: String(slug).replace(/-/g,' ') }

  return (
    <main style={{ background:'#FAF7F2' }}>
      <Navbar />

      {/* HERO */}
      <section style={{ background:'#0E0C0C', padding:'10rem 2.5rem 7rem', position:'relative', overflow:'hidden' }}>
        <div style={{ position:'absolute', inset:0, opacity:0.04, pointerEvents:'none',
          backgroundImage:'linear-gradient(#FAF7F2 1px,transparent 1px),linear-gradient(90deg,#FAF7F2 1px,transparent 1px)',
          backgroundSize:'70px 70px' }}/>
        <div style={{ maxWidth:1280, margin:'0 auto', display:'grid', gridTemplateColumns:'1fr auto', gap:'4rem', alignItems:'center' }}>
          <motion.div {...inView()}>
            <Link href="/blog" style={{ display:'inline-flex', alignItems:'center', gap:8,
              fontFamily:C, fontSize:11, letterSpacing:'0.2em', textTransform:'uppercase',
              color:'rgba(250,247,242,0.35)', textDecoration:'none', marginBottom:32,
              transition:'color 0.25s' }}
              onMouseEnter={e => (e.currentTarget.style.color = '#CC1F1F')}
              onMouseLeave={e => (e.currentTarget.style.color = 'rgba(250,247,242,0.35)')}
            >
              ← Volver a recetas
            </Link>
            <div style={{ display:'flex', alignItems:'center', gap:16, marginBottom:20 }}>
              <span style={{ fontFamily:C, fontSize:10, letterSpacing:'0.2em', textTransform:'uppercase', color:'#CC1F1F' }}>{receta.tag}</span>
              <span style={{ width:1, height:12, background:'rgba(250,247,242,0.15)' }}/>
              <span style={{ fontFamily:C, fontSize:10, letterSpacing:'0.2em', textTransform:'uppercase', color:difColor[receta.dificultad] }}>{receta.dificultad}</span>
            </div>
            <h1 style={{ fontFamily:P, fontSize:'clamp(2.5rem,6vw,5rem)', lineHeight:0.92, color:'#FAF7F2', marginBottom:20 }}>
              {receta.titulo}
            </h1>
            <div style={{ display:'flex', gap:32 }}>
              {[
                { icon:'⏱', label: receta.tiempo >= 60 ? `${Math.floor(receta.tiempo/60)}h ${receta.tiempo%60 > 0 ? receta.tiempo%60+'min':''}`.trim() : `${receta.tiempo}min` },
                { icon:'👥', label:`${receta.porciones} porciones` },
                { icon:'📊', label:receta.dificultad },
              ].map((d,i) => (
                <div key={i} style={{ display:'flex', alignItems:'center', gap:8 }}>
                  <span>{d.icon}</span>
                  <span style={{ fontFamily:C, fontSize:'1.05rem', color:'rgba(250,247,242,0.45)' }}>{d.label}</span>
                </div>
              ))}
            </div>
          </motion.div>
          <motion.div {...inView(0.1)} style={{
            width:200, height:200, background:'#1A1515', display:'flex',
            alignItems:'center', justifyContent:'center', position:'relative',
          }}>
            <div style={{ position:'absolute', inset:0, background:'radial-gradient(ellipse at center, rgba(204,31,31,0.2) 0%, transparent 70%)' }}/>
            <span style={{ fontSize:'6rem', position:'relative', zIndex:1 }}>{receta.emoji}</span>
          </motion.div>
        </div>
      </section>

      {/* CONTENIDO */}
      <section style={{ padding:'6rem 2.5rem 8rem' }}>
        <div style={{ maxWidth:1280, margin:'0 auto', display:'grid', gridTemplateColumns:'1fr 340px', gap:'5rem', alignItems:'start' }}>

          {/* Main */}
          <div>
            {/* Intro */}
            <motion.div {...inView()} style={{ marginBottom:56 }}>
              <p style={{ fontFamily:P, fontSize:'1.5rem', fontStyle:'italic', color:'#0E0C0C', lineHeight:1.6, borderLeft:'3px solid #CC1F1F', paddingLeft:24 }}>
                {receta.intro}
              </p>
            </motion.div>

            {/* Pasos */}
            <motion.div {...inView(0.1)}>
              <div style={{ ...TAG_STYLE, marginBottom:32 }}><span style={LINE}/>Preparación paso a paso</div>
              <div style={{ display:'flex', flexDirection:'column', gap:3 }}>
                {receta.pasos.map((paso, i) => (
                  <motion.div key={i} {...inView(i*0.07)}
                    style={{ background:'#0E0C0C', padding:'2.5rem', display:'flex', gap:24 }}>
                    <div style={{ flexShrink:0 }}>
                      <div style={{ width:44, height:44, background:'#CC1F1F', display:'flex', alignItems:'center', justifyContent:'center' }}>
                        <span style={{ fontFamily:P, fontWeight:700, color:'#fff', fontSize:'1.1rem' }}>{String(i+1).padStart(2,'0')}</span>
                      </div>
                    </div>
                    <div>
                      <h3 style={{ fontFamily:P, fontSize:'1.2rem', color:'#FAF7F2', marginBottom:10 }}>{paso.titulo}</h3>
                      <p style={{ fontFamily:C, fontSize:'1.15rem', fontWeight:300, color:'rgba(250,247,242,0.55)', lineHeight:1.7 }}>{paso.desc}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Tips */}
            <motion.div {...inView(0.1)} style={{ marginTop:48 }}>
              <div style={{ ...TAG_STYLE, marginBottom:28 }}><span style={LINE}/>Tips del chef</div>
              <div style={{ background:'#CC1F1F', padding:'3rem' }}>
                <ul style={{ listStyle:'none', display:'flex', flexDirection:'column', gap:16 }}>
                  {receta.tips.map((tip,i) => (
                    <li key={i} style={{ display:'flex', gap:16, alignItems:'flex-start' }}>
                      <span style={{ color:'rgba(255,255,255,0.5)', fontSize:'0.7rem', marginTop:6, flexShrink:0 }}>✦</span>
                      <p style={{ fontFamily:C, fontSize:'1.15rem', fontWeight:300, color:'rgba(255,255,255,0.85)', lineHeight:1.6 }}>{tip}</p>
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          </div>

          {/* Sidebar */}
          <motion.div {...inView(0.2)} style={{ position:'sticky', top:'6rem', display:'flex', flexDirection:'column', gap:3 }}>

            {/* Ingredientes */}
            <div style={{ background:'#0E0C0C', padding:'2.5rem' }}>
              <div style={{ ...TAG_STYLE, marginBottom:24 }}><span style={LINE}/>Ingredientes</div>
              <p style={{ fontFamily:C, fontSize:10, letterSpacing:'0.2em', textTransform:'uppercase', color:'rgba(250,247,242,0.3)', marginBottom:16 }}>
                Para {receta.porciones} porciones
              </p>
              <ul style={{ listStyle:'none', display:'flex', flexDirection:'column', gap:10 }}>
                {receta.ingredientes.map((ing,i) => (
                  <li key={i} style={{ display:'flex', gap:12, alignItems:'flex-start', paddingBottom:10, borderBottom: i < receta.ingredientes.length-1 ? '1px solid rgba(250,247,242,0.06)' : 'none' }}>
                    <span style={{ color:'#CC1F1F', fontSize:'0.6rem', marginTop:7, flexShrink:0 }}>●</span>
                    <span style={{ fontFamily:C, fontSize:'1.05rem', color:'rgba(250,247,242,0.65)', lineHeight:1.4 }}>{ing}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Info card */}
            <div style={{ background:'#1A1515', padding:'2rem' }}>
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:1 }}>
                {[
                  { l:'Tiempo', v: receta.tiempo >= 60 ? `${Math.floor(receta.tiempo/60)}h` : `${receta.tiempo}m` },
                  { l:'Porciones', v:`${receta.porciones}` },
                  { l:'Dificultad', v:receta.dificultad },
                  { l:'Tipo', v:receta.tag },
                ].map((d,i) => (
                  <div key={i} style={{ background:'#0E0C0C', padding:'1.2rem', textAlign:'center' }}>
                    <p style={{ fontFamily:C, fontSize:9, letterSpacing:'0.2em', textTransform:'uppercase', color:'rgba(250,247,242,0.3)', marginBottom:4 }}>{d.l}</p>
                    <p style={{ fontFamily:P, fontSize:'1rem', color:'#FAF7F2' }}>{d.v}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* CTA */}
            <div style={{ background:'#CC1F1F', padding:'2rem', textAlign:'center' }}>
              <p style={{ fontFamily:P, fontSize:'1.1rem', color:'#fff', marginBottom:8 }}>¿Querés que Damián lo prepare para vos?</p>
              <p style={{ fontFamily:C, fontSize:'1rem', fontWeight:300, color:'rgba(255,255,255,0.7)', marginBottom:20 }}>Pedí tu encargo personalizado</p>
              <Link href="/contacto" style={{
                fontFamily:C, fontSize:10, letterSpacing:'0.2em', textTransform:'uppercase',
                padding:'12px 28px', background:'#fff', color:'#CC1F1F', textDecoration:'none', display:'inline-block',
              }}>
                Encargar ahora
              </Link>
            </div>
          </motion.div>
        </div>
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
          <Link href="/blog" style={{ fontFamily:C, fontSize:12, color:'rgba(250,247,242,0.3)', textDecoration:'none' }}>
            ← Volver al blog
          </Link>
        </div>
      </footer>
    </main>
  )
}