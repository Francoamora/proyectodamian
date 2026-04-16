'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'

const links = [
  { href: '/sobre-mi', label: 'El Chef' },
  { href: '/galeria', label: 'Galería' },
  { href: '/blog', label: 'Recetas' },
  { href: '/eventos', label: 'Eventos' },
  { href: '/contacto', label: 'Reservas' },
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <>
      <motion.nav
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled 
            ? 'bg-ink/90 backdrop-blur-lg border-b border-cream/5 py-4' 
            : 'bg-transparent py-8'
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 lg:px-10 flex items-center justify-between">
          
          {/* BRAND MINIMALISTA */}
          <Link href="/" className="flex items-center gap-4 group">
            <div className="w-10 h-10 rounded-full border border-cream/20 flex items-center justify-center transition-transform duration-500 group-hover:rotate-12">
              <span className="font-playfair font-bold text-cream text-lg">D</span>
            </div>
            <div className="leading-none">
              <p className="font-playfair text-xl tracking-wider text-cream">
                Dolche'B
              </p>
              <p className="font-cormorant text-[9px] tracking-[0.3em] uppercase mt-2 text-cream/50">
                Damián Borelli
              </p>
            </div>
          </Link>

          {/* DESKTOP MENU (Puro y elegante) */}
          <ul className="hidden md:flex items-center gap-12">
            {links.map(l => (
              <li key={l.href}>
                <Link 
                  href={l.href} 
                  className="font-cormorant text-[10px] tracking-[0.25em] uppercase text-cream/70 hover:text-cream transition-colors duration-300"
                >
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>

          {/* BURGER MENU */}
          <button 
            onClick={() => setOpen(!open)}
            className="md:hidden flex flex-col gap-[6px] p-2 z-50 relative"
            aria-label="Toggle Menu"
          >
            {[0, 1, 2].map(i => (
              <span key={i} className={`block w-6 h-[1px] transition-all duration-300 bg-cream ${
                open ? (i === 0 ? 'rotate-45 translate-y-[7px]' : i === 2 ? '-rotate-45 -translate-y-[7px]' : 'opacity-0') : ''
              }`} />
            ))}
          </button>
        </div>
      </motion.nav>

      {/* MOBILE OVERLAY */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, backdropFilter: 'blur(0px)' }}
            animate={{ opacity: 1, backdropFilter: 'blur(16px)' }}
            exit={{ opacity: 0, backdropFilter: 'blur(0px)' }}
            className="fixed inset-0 z-40 bg-ink/95 flex flex-col items-center justify-center gap-10"
          >
            {links.map((l, i) => (
              <motion.div key={l.href} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
                <Link href={l.href} onClick={() => setOpen(false)} className="font-playfair text-3xl text-cream tracking-widest hover:text-red transition-colors">
                  {l.label}
                </Link>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}