import type { Metadata } from 'next'
import { Playfair_Display, Cormorant_Garamond } from 'next/font/google'
import './globals.css'

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--playfair-font',
  display: 'swap',
})

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600'],
  variable: '--cormorant-font',
  display: 'swap',
})

export const metadata: Metadata = {
  title: "Dolche'B — Damián Borelli",
  description: 'Pastelería y alta cocina artesanal',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className={`${playfair.variable} ${cormorant.variable}`}>
      <body>{children}</body>
    </html>
  )
}