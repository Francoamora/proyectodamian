import type { Metadata } from 'next'
import { Playfair_Display, Cormorant_Garamond } from 'next/font/google'
import './globals.css'

const playfair = Playfair_Display({ subsets: ['latin'], variable: '--playfair-font', display: 'swap' })
const cormorant = Cormorant_Garamond({ subsets: ['latin'], weight: ['300', '400', '500', '600'], variable: '--cormorant-font', display: 'swap' })

export const metadata: Metadata = {
  title: "Dolche'B | Alta Pastelería & Catering",
  description: 'Diseñamos experiencias a tu medida. Cascada de chocolate, tortas personalizadas y mesas dulces premium por Damián Borelli. Cotizá tu evento.',
  openGraph: {
    title: "Dolche'B | Alta Pastelería & Catering",
    description: 'Cascada de chocolate, tortas personalizadas y mesas dulces premium. Cotizá tu celebración con nosotros.',
    url: 'https://dolcheb.com.ar',
    siteName: "Dolche'B",
    locale: 'es_AR',
    type: 'website',
    images: [{ url: 'https://dolcheb.com.ar/logo.jpg', width: 800, height: 800, alt: "Logo Dolche'B - Alta Pastelería" }],
  },
  twitter: {
    card: 'summary_large_image',
    title: "Dolche'B | Alta Pastelería & Catering",
    description: 'Cascada de chocolate, tortas personalizadas y mesas dulces premium.',
    images: ['https://dolcheb.com.ar/logo.jpg'],
  },
  icons: { icon: '/logo.jpg', apple: '/logo.jpg' },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className={`scroll-smooth ${playfair.variable} ${cormorant.variable}`}>
      <body className="bg-[#050505] text-[#FAF7F2]">{children}</body>
    </html>
  )
}
