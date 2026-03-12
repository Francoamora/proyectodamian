'use client'
import { useRef, useState, useEffect } from 'react'
import { motion, useScroll, useTransform, AnimatePresence, useMotionValueEvent } from 'framer-motion'
import Image from 'next/image'

const P = 'var(--playfair-font)' 
const C = 'var(--cormorant-font)' 

const reveal = (delay = 0) => ({
  initial:     { opacity: 0, y: 40 },
  whileInView: { opacity: 1, y: 0  },
  viewport:    { once: true, margin: '-10%' },
  transition:  { duration: 1.1, delay, ease: [0.16, 1, 0.3, 1] as const },
})

const WA_NUMERO = '5491112345678' // Reemplazar con el número real de Damián
const WA_LINK_GENERAL = `https://wa.me/${WA_NUMERO}?text=` + encodeURIComponent('Hola Damián! Estuve viendo tu web y quiero consultar por un evento 🥂')

const BACKEND_URL = 'http://localhost:8000'

const getImageUrl = (imgPath: string) => {
  if (!imgPath) return '';
  if (imgPath.startsWith('http')) return imgPath;
  return `${BACKEND_URL}${imgPath}`; 
}

const generarLinkWspProducto = (nombreProducto: string) => {
  const mensaje = `Hola Damián! Estuve viendo tu catálogo web y me gustaría pedirte una cotización para: *${nombreProducto}* 🎂`
  return `https://wa.me/${WA_NUMERO}?text=${encodeURIComponent(mensaje)}`
}

/* ─── DATA ESTÁTICA ────────────────────────────── */
const servicios = [
  { n: '01', t: 'Tortas de Bodas & 15 Años', d: 'Diseños exclusivos y personalizados. Desde clásicos pisos fondant hasta naked cakes florales, el centro de tu celebración.' },
  { n: '02', t: 'Catering & Menús', d: 'Propuestas gastronómicas completas para eventos. Opciones saladas, finger food y menús formales diseñados a medida.' },
  { n: '03', t: 'Mesas Dulces Premium', d: 'Bocaditos de autor, shots, tartas clásicas y pastelería moderna para deslumbrar a tus invitados.' },
  { n: '04', t: 'La Cascada de Chocolate', d: 'Nuestra atracción estrella. Una experiencia interactiva con frutas de estación y pastelería para sumergir.' },
]

const navLinks = ['Servicios', 'Catálogo', 'Eventos', 'Contacto']

export default function Home() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [productos, setProductos] = useState<any[]>([])
  const [eventos, setEventos] = useState<any[]>([])
  const [cargando, setCargando] = useState(true)
  const [imagenZoom, setImagenZoom] = useState<string | null>(null)
  
  const [mostrarWaFlotante, setMostrarWaFlotante] = useState(false)

  const heroRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] })
  const txtY = useTransform(scrollYProgress, [0, 1], ['0%', '15%'])
  const op   = useTransform(scrollYProgress, [0, 0.6], [1, 0])

  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    if (latest > 0.05) setMostrarWaFlotante(true)
    else setMostrarWaFlotante(false)
  })

  useEffect(() => {
    if (isMenuOpen || imagenZoom) document.body.style.overflow = 'hidden'
    else document.body.style.overflow = 'unset'
  }, [isMenuOpen, imagenZoom])

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [resProductos, resEventos] = await Promise.all([
          fetch(`${BACKEND_URL}/api/productos/`, { cache: 'no-store' }),
          fetch(`${BACKEND_URL}/api/eventos/`, { cache: 'no-store' })
        ]);

        if (!resProductos.ok || !resEventos.ok) throw new Error('Error en servidor');
        
        const dataProductos = await resProductos.json();
        const dataEventos = await resEventos.json();
        
        setProductos(dataProductos);
        setEventos(dataEventos);
        setCargando(false);
      } catch (err) {
        console.error("Error conectando a la API de Django:", err);
        setCargando(false); 
      }
    };
    fetchData();
  }, [])

  return (
    <main className="bg-[#050505] overflow-x-hidden text-[#FAF7F2]">

      {/* ════ WHATSAPP FLOTANTE INTELIGENTE ════ */}
      <AnimatePresence>
        {mostrarWaFlotante && (
          <motion.a
            initial={{ opacity: 0, scale: 0.5, y: 50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.5, y: 50 }}
            whileHover={{ scale: 1.1 }}
            transition={{ type: "spring", stiffness: 260, damping: 20 }}
            href={WA_LINK_GENERAL}
            target="_blank"
            rel="noreferrer"
            className="fixed bottom-8 right-6 md:right-10 z-50 bg-[#25D366] text-white p-4 rounded-full shadow-[0_0_20px_rgba(37,211,102,0.4)] flex items-center justify-center cursor-pointer"
          >
            <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
            </svg>
          </motion.a>
        )}
      </AnimatePresence>

      {/* ════ NAVBAR FIJO CON LOGO OPTIMIZADO ════ */}
      <nav className="fixed top-0 left-0 w-full z-40 py-4 px-6 md:px-12 bg-black/50 backdrop-blur-md border-b border-white/5 transition-all duration-300">
        <div className="max-w-[1500px] mx-auto flex items-center justify-between">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1 }} className="flex items-center gap-3">
            <Image src="/logo-dolcheb.jpg" alt="Logo Dolche'B" width={48} height={48} className="rounded-full object-cover border border-red-600/50 shadow-[0_0_15px_rgba(220,38,38,0.3)]" />
            <p style={{ fontFamily: P }} className="hidden sm:block text-2xl text-white tracking-tight relative mt-1">
              Dolche<em className="text-red-600 not-italic">'</em>B
            </p>
          </motion.div>
          <div style={{ fontFamily: C }} className="hidden md:flex items-center gap-10 text-[11px] tracking-[0.25em] uppercase text-white/70">
            {navLinks.map(link => (
              <a key={link} href={`#${link.toLowerCase().replace(' ', '-')}`} className="hover:text-red-600 transition-colors duration-300">
                {link}
              </a>
            ))}
          </div>
          <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="md:hidden relative z-50 w-8 h-8 flex flex-col justify-center items-center gap-[6px]">
            <span className={`w-6 h-[1px] bg-white transition-all duration-300 ${isMenuOpen ? 'rotate-45 translate-y-[7px]' : ''}`} />
            <span className={`w-6 h-[1px] bg-white transition-all duration-300 ${isMenuOpen ? 'opacity-0' : ''}`} />
            <span className={`w-6 h-[1px] bg-white transition-all duration-300 ${isMenuOpen ? '-rotate-45 -translate-y-[7px]' : ''}`} />
          </button>
        </div>
      </nav>

      {/* ════ MENÚ MÓVIL Y MODAL ZOOM ════ */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div initial={{ opacity: 0, y: '-100%' }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: '-100%' }} transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }} className="fixed inset-0 z-30 bg-[#050505] flex flex-col items-center justify-center">
            <div className="flex flex-col items-center gap-8">
              {navLinks.map((link, i) => (
                <motion.a key={link} href={`#${link.toLowerCase().replace(' ', '-')}`} onClick={() => setIsMenuOpen(false)} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 + (i * 0.1) }} style={{ fontFamily: P }} className="text-4xl text-white hover:text-red-600 transition-colors">{link}</motion.a>
              ))}
              <motion.a initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }} href={WA_LINK_GENERAL} target="_blank" rel="noreferrer" style={{ fontFamily: C }} className="mt-8 text-[11px] tracking-[0.25em] uppercase px-10 py-4 border border-red-600 text-red-600 hover:bg-red-600 hover:text-white transition-all rounded-full">Contacto Directo</motion.a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {imagenZoom && (
          <motion.div onClick={() => setImagenZoom(null)} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm flex items-center justify-center p-4 md:p-12 cursor-zoom-out">
            <motion.img initial={{ scale: 0.8 }} animate={{ scale: 1 }} exit={{ scale: 0.8 }} src={imagenZoom} alt="Zoom" className="max-w-full max-h-full object-contain rounded-lg shadow-2xl" onClick={(e) => e.stopPropagation()} />
            <button onClick={() => setImagenZoom(null)} className="absolute top-6 right-6 text-white/50 hover:text-white text-4xl font-light">×</button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ════ HERO MINIMALISTA ════ */}
      <section ref={heroRef} className="relative h-[100dvh] overflow-hidden bg-black flex items-center justify-center pt-10">
        <video autoPlay loop muted playsInline className="absolute inset-0 w-full h-full object-cover z-0 brightness-[0.45]">
          <source src="/cascada.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 z-10 bg-gradient-to-b from-black/60 via-transparent to-[#050505]" />
        <motion.div style={{ y: txtY, opacity: op }} className="relative z-20 flex flex-col items-center justify-center text-center px-4 md:px-6 w-full h-full pb-10">
          <motion.h1 initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 1.5, delay: 0.2, ease: [0.16,1,0.3,1] }} style={{ fontFamily: P }} className="text-[clamp(5rem,18vw,14rem)] font-normal leading-[0.8] tracking-tight text-white/90 mix-blend-overlay drop-shadow-2xl mb-4">
            Dolche<em className="text-red-600 not-italic mix-blend-normal">'</em>B
          </motion.h1>
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1, delay: 0.8 }} style={{ fontFamily: C }} className="text-xl md:text-2xl text-white/60 mb-12 tracking-[0.4em] uppercase">Damián Borelli</motion.p>
        </motion.div>
      </section>

      {/* ════ SERVICIOS ════ */}
      <section id="servicios" className="bg-[#050505] py-[8rem] md:py-[10rem] px-6">
        <div className="max-w-[1400px] mx-auto grid grid-cols-1 lg:grid-cols-[1fr_1.4fr] gap-12 lg:gap-32 items-start">
          <motion.div {...reveal()} className="lg:sticky lg:top-32">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-8 md:w-10 h-px bg-red-600" />
              <span style={{ fontFamily: C }} className="text-[10px] tracking-[0.4em] uppercase text-red-600">Nuestras Propuestas</span>
            </div>
            <h2 style={{ fontFamily: P }} className="text-[clamp(2.5rem,6vw,5.5rem)] font-normal leading-[0.95] mb-6 md:mb-8 tracking-tight">
              Diseñamos<br />experiencias a<br /><em className="text-red-600 italic">tu medida</em>.
            </h2>
          </motion.div>
          <div className="border-t border-white/10">
            {servicios.map((s, i) => (
              <motion.div key={i} {...reveal(i * 0.1)} className="group flex flex-col sm:flex-row gap-4 sm:gap-6 md:gap-12 py-8 md:py-14 border-b border-white/10 transition-all duration-500 hover:pl-6">
                <span style={{ fontFamily: P }} className="text-4xl md:text-5xl font-normal text-red-600/30 leading-none transition-colors duration-500 group-hover:text-red-600">{s.n}</span>
                <div className="flex-1">
                  <h3 style={{ fontFamily: P }} className="text-xl md:text-[clamp(1.5rem,2.5vw,2.2rem)] font-normal mb-2 md:mb-3 tracking-tight group-hover:text-red-600 transition-colors duration-300">{s.t}</h3>
                  <p style={{ fontFamily: C }} className="text-base md:text-lg font-light text-white/60 leading-[1.65] max-w-lg">{s.d}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ════ CATÁLOGO DE PRODUCTOS ════ */}
      <section id="catálogo" className="bg-[#0A0A0A] py-[8rem] md:py-[10rem] px-6 border-t border-white/5">
        <div className="max-w-[1400px] mx-auto">
          <motion.div {...reveal()} className="text-center mb-16 md:mb-24">
            <h2 style={{ fontFamily: P }} className="text-[clamp(2.8rem,5vw,5rem)] font-normal leading-[1.1] tracking-tight mb-6">
              Catálogo de <em className="text-red-600 italic">Especialidades</em>
            </h2>
          </motion.div>

          {cargando ? (
            <div className="relative grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
              <div className="absolute inset-0 flex items-center justify-center z-10">
                <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 3, ease: "linear" }} className="w-16 h-16 rounded-full overflow-hidden shadow-[0_0_30px_rgba(220,38,38,0.5)]">
                  <Image src="/logo-dolcheb.jpg" alt="Cargando..." width={64} height={64} className="object-cover" />
                </motion.div>
              </div>
              {[1, 2].map((i) => (
                 <div key={i} className={`bg-[#080808] border border-white/5 rounded-2xl flex flex-col md:flex-row overflow-hidden animate-pulse ${i===2 ? 'md:translate-y-12' : ''}`}>
                    <div className="w-full md:w-2/5 aspect-[7/10] bg-white/5" />
                    <div className="w-full md:w-3/5 p-8 md:p-10 flex flex-col justify-between">
                       <div>
                         <div className="h-6 bg-white/10 rounded w-3/4 mb-4" />
                         <div className="h-3 bg-white/5 rounded w-full mb-2" />
                         <div className="h-3 bg-white/5 rounded w-5/6" />
                       </div>
                       <div className="h-10 bg-white/5 rounded-xl w-full mt-8" />
                    </div>
                 </div>
              ))}
            </div>
          ) : productos.length === 0 ? (
             <div className="text-center text-white/30 py-10" style={{ fontFamily: C }}><p className="text-xl">Aún no hay productos cargados.</p></div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
              {productos.map((prod, i) => (
                <motion.div key={prod.id} {...reveal(0.1 * i)} className={`group bg-[#050505] border border-white/5 overflow-hidden flex flex-col md:flex-row rounded-2xl ${prod.offset ? 'md:translate-y-12' : ''}`}>
                  
                  <div className="w-full md:w-2/5 aspect-[7/10] overflow-hidden relative cursor-zoom-in" onClick={() => setImagenZoom(getImageUrl(prod.img))}>
                    <Image src={getImageUrl(prod.img)} alt={prod.nombre} fill sizes="(max-width: 768px) 100vw, 50vw" className="object-cover object-center transition-transform duration-[1.5s] group-hover:scale-110 brightness-[0.8]" />
                    <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-md px-4 py-1.5 rounded-full z-10">
                      <span style={{ fontFamily: C }} className="text-[10px] tracking-[0.2em] uppercase text-red-500">{prod.categoria}</span>
                    </div>
                  </div>
                  
                  <div className="w-full md:w-3/5 p-8 md:p-10 flex flex-col justify-between">
                    <div>
                      <h3 style={{ fontFamily: P }} className="text-2xl md:text-3xl font-normal leading-tight text-white mb-4 group-hover:text-red-600 transition-colors">{prod.nombre}</h3>
                      <p style={{ fontFamily: C }} className="text-base text-white/50 leading-relaxed mb-8">{prod.descripcion}</p>
                    </div>
                    <a href={generarLinkWspProducto(prod.nombre)} target="_blank" rel="noreferrer" style={{ fontFamily: C }} className="inline-flex items-center justify-between w-full border border-white/20 px-8 py-4 hover:bg-red-600 hover:border-red-600 transition-all duration-300 group/btn rounded-xl">
                      <span className="text-[12px] tracking-[0.2em] uppercase text-white font-bold">Cotizar Pedido</span>
                      <span className="text-white transform group-hover/btn:translate-x-2 transition-transform">→</span>
                    </a>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ════ EVENTOS REALIZADOS ════ */}
      <section id="eventos" className="bg-[#050505] py-[8rem] md:py-[10rem] px-6 border-t border-white/5">
        <div className="max-w-[1400px] mx-auto">
          <motion.div {...reveal()} className="text-center mb-16 md:mb-20">
            <h2 style={{ fontFamily: P }} className="text-[clamp(2.5rem,4.5vw,4.5rem)] font-normal leading-[1.1] tracking-tight mb-4">
              Obras Realizadas
            </h2>
          </motion.div>

          {cargando ? (
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
               {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="aspect-[7/10] bg-[#080808] border border-white/5 rounded-2xl animate-pulse" />
               ))}
             </div>
          ) : eventos.length === 0 ? (
            <div className="text-center text-white/30 py-10" style={{ fontFamily: C }}><p className="text-xl">Aún no hay eventos cargados.</p></div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
              {eventos.map((evento, i) => (
                <motion.div key={evento.id} {...reveal(0.1 * i)} onClick={() => setImagenZoom(getImageUrl(evento.img))} className="relative overflow-hidden aspect-[7/10] group cursor-zoom-in border border-white/5 rounded-2xl">
                  
                  <Image src={getImageUrl(evento.img)} alt={evento.titulo} fill sizes="(max-width: 768px) 100vw, 25vw" className="object-cover object-center transition-transform duration-[1.5s] group-hover:scale-110 brightness-[0.7] group-hover:brightness-40" />
                  
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-80 group-hover:opacity-100 transition-opacity duration-500 z-10" />
                  <div className="absolute bottom-0 left-0 p-6 md:p-8 translate-y-4 group-hover:translate-y-0 transition-transform duration-500 w-full z-20">
                    <p style={{ fontFamily: C }} className="text-[11px] tracking-[0.3em] uppercase text-red-500 mb-2 font-semibold">{evento.categoria}</p>
                    <h3 style={{ fontFamily: P }} className="text-xl md:text-2xl font-normal leading-tight text-white">{evento.titulo}</h3>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ════ FOOTER EJECUTIVO (IZQ/DER SIN LOGO) ════ */}
      <footer id="contacto" className="bg-[#020202] border-t border-white/5 pt-16 pb-8 px-6">
        <div className="max-w-[1400px] mx-auto">
          <div className="flex flex-col items-center mb-12 border-b border-white/5 pb-12">
             <h2 style={{ fontFamily: P }} className="text-[clamp(2rem,4vw,3.5rem)] font-light text-white mb-6 text-center">
                ¿Comenzamos a planear<br /><em className="text-red-600 italic">tu evento?</em>
             </h2>
             <a href={WA_LINK_GENERAL} target="_blank" rel="noreferrer" style={{ fontFamily: C }} className="text-[12px] tracking-[0.3em] uppercase px-12 py-5 bg-red-600 hover:bg-red-700 text-white transition-all duration-300 rounded-full shadow-[0_0_20px_rgba(220,38,38,0.2)]">
                Escribile a Damián
             </a>
          </div>
          
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <p style={{ fontFamily: P }} className="text-white/60 text-lg md:text-xl tracking-wide text-center md:text-left">
              Desarrollado por <span className="text-white font-medium ml-1">Franco Mora</span>
            </p>
            <p style={{ fontFamily: C }} className="text-white/30 text-xs md:text-sm tracking-widest uppercase text-center md:text-right">
              © 2026 Dolche'B — Todos los derechos reservados
            </p>
          </div>
        </div>
      </footer>
    </main>
  )
}