import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: "Dolche'B | Alta Pastelería & Catering",
  description: "Diseñamos experiencias a tu medida. Tortas de bodas, mesas dulces premium y la exclusiva cascada de chocolate por el Chef Damián Borelli.",
  icons: {
    // ESTO PONE TU LOGO COMO FAVICON EN LA PESTAÑA
    icon: '/logo-dolcheb.jpg', 
    apple: '/logo-dolcheb.jpg',
  },
  openGraph: {
    // ESTO ES LO QUE SALE CUANDO PEGÁS EL LINK EN WHATSAPP/INSTAGRAM
    title: "Dolche'B | Chef Damián Borelli",
    description: "Alta Pastelería & Catering para eventos. Cotizá tu celebración con nosotros.",
    url: 'https://proyectodamian.vercel.app', // Tu link de Vercel
    siteName: "Dolche'B",
    images: [
      {
        url: '/logo-dolcheb.jpg', 
        width: 800,
        height: 800,
        alt: "Logo Dolche'B",
      },
    ],
    locale: 'es_AR',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es" className="scroll-smooth">
      <body className="bg-[#050505] text-[#FAF7F2]">
        {children}
      </body>
    </html>
  )
}