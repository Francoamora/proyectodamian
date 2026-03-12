import type { Metadata } from "next";
import { Playfair_Display, Cormorant_Garamond } from "next/font/google";
import "./globals.css";

const playfair = Playfair_Display({ 
  subsets: ["latin"],
  variable: '--playfair-font'
});

const cormorant = Cormorant_Garamond({ 
  subsets: ["latin"], 
  weight: ['300', '400', '600'],
  variable: '--cormorant-font'
});

export const metadata: Metadata = {
  title: "Dolche'B | Damián Borelli",
  description: "La atracción dulce de tu fiesta. Una experiencia única por Damián Borelli. Cascada de chocolate premium para eventos.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className={`${playfair.variable} ${cormorant.variable} bg-[#050505] text-white antialiased`}>
        {children}
      </body>
    </html>
  );
}