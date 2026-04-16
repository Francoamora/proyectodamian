'use client'
import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import Link from 'next/link'

const inView = (delay = 0) => ({
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.8, delay, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] },
})

export default function Hero() {
  const heroRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] })
  const yText  = useTransform(scrollYProgress, [0, 1], ['0%', '30%'])
  const yImage = useTransform(scrollYProgress, [0, 1], ['0%', '15%'])

  return (
    <section ref={heroRef} className="relative min-h-screen bg-ink flex items-center pt-20 overflow-hidden">
      
      {/* Background Textures */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[radial-gradient(circle_at_center,_var(--color-cream)_1px,_transparent_1px)] bg-[size:40px_40px]" />
      
      <div className="max-w-7xl mx-auto px-6 lg:px-10 w-full grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center relative z-10">
        
        {/* ── LEFT: TYPOGRAPHY & COPY ── */}
        <motion.div style={{ y: yText }} className="max-w-xl">
          <motion.div {...inView(0)} className="flex items-center gap-4 font-cormorant text-xs tracking-[0.3em] uppercase text-red mb-8">
            <span className="w-8 h-[1px] bg-red flex-shrink-0" />
            Chef Pastelero · Buenos Aires
          </motion.div>

          <motion.h1 {...inView(0.1)} className="font-playfair text-[clamp(4rem,8vw,7.5rem)] leading-[0.85] text-cream mb-8">
            Damián<br />
            <em className="text-red not-italic font-medium">Borelli</em>
          </motion.h1>

          <motion.p {...inView(0.2)} className="font-cormorant text-xl font-light text-cream/60 leading-relaxed max-w-md mb-10">
            Creaciones de autor que combinan técnica francesa, pasión pura 
            y los mejores ingredientes locales. Cada bocado, una obra de arte.
          </motion.p>

          <motion.div {...inView(0.3)} className="flex flex-wrap gap-6">
            <Link 
              href="/contacto" 
              className="font-cormorant text-xs tracking-[0.2em] uppercase px-10 py-4 bg-red text-white hover:bg-red-dark transition-colors duration-300"
            >
              Hacer una Reserva
            </Link>
            <Link 
              href="/sobre-mi" 
              className="font-cormorant text-xs tracking-[0.2em] uppercase px-10 py-4 border border-cream/20 text-cream/70 hover:text-cream hover:border-cream/50 transition-all duration-300"
            >
              Conocer al Chef
            </Link>
          </motion.div>
        </motion.div>

        {/* ── RIGHT: CINEMATIC IMAGE ── */}
        {/* Nota: Reemplazá el src del img por una foto real de un postre o del chef */}
        <motion.div style={{ y: yImage }} {...inView(0.4)} className="hidden lg:block relative h-[80vh] w-full max-h-[800px] overflow-hidden group">
          <div className="absolute inset-0 bg-ink/20 z-10 transition-colors duration-500 group-hover:bg-transparent" />
          <img 
            src="https://images.unsplash.com/photo-1551024601-bec78aea704b?q=80&w=1000&auto=format&fit=crop" 
            alt="Creación pastelera de Damián Borelli" 
            className="w-full h-full object-cover object-center scale-105 transition-transform duration-[2s] group-hover:scale-100"
          />
          {/* Sutil gradiente para fundir con el fondo */}
          <div className="absolute inset-0 bg-gradient-to-t from-ink via-transparent to-transparent z-20" />
          <div className="absolute inset-0 bg-gradient-to-r from-ink via-transparent to-transparent z-20" />
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }} 
        animate={{ opacity: 1 }} 
        transition={{ delay: 1.5, duration: 1 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3 hidden md:flex"
      >
        <span className="font-cormorant text-[10px] tracking-[0.2em] uppercase text-cream/30">Scroll</span>
        <motion.div
          animate={{ scaleY: [1, 0, 1], transformOrigin: ['top', 'top', 'bottom'] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          className="w-[1px] h-12 bg-red"
        />
      </motion.div>
    </section>
  )
}